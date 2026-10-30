"""Last step of install.sh, run with the bare uv-managed Python from the unpacked (not yet trusted) release:

  1. build the Python environment from the release's hash-pinned lock files (or wrap --python for CPU testing)
  2. verify the release signature with that environment (cryptography) against the key pinned in agent.json;
     nothing from the release runs as the agent before this passes
  3. move it to releases/<version>, link the data folders, write the launcher, switch `current`
  4. install and start the systemd user service (unless --no-service), then run the self-check

    python -m modellab.agent.setup --staged DIR --manifest F --signature F --tarball F [--python PATH] [--no-service]
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

from modellab.agent import SERVICE, home, load_config
from modellab.agent import update

LAUNCHER = """#!/usr/bin/env bash
# ModelLab agent launcher (written by the installer): runs the current release with its Python environment.
set -euo pipefail
export MODELLAB_HOME="{home}"
REL="$(readlink -f "$MODELLAB_HOME/current")"
ENV="$(cat "$REL/ENV")"
cd "$REL"
export PYTHONPATH="$REL"
exec "$ENV/bin/python" -m modellab.agent "$@"
"""

UNIT = """[Unit]
Description=ModelLab agent: runs this machine's ModelLab jobs for {hub}
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart={home}/bin/modellab-agent run
Restart=always
RestartSec=5
# 78 = machine removed in the web app: stay stopped. 75 = restart into a new release (Restart=always).
RestartPreventExitStatus=78
# Runs live in their own process groups and must survive agent restarts and updates; the agent adopts them.
KillMode=process
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=default.target
"""


def say(msg: str) -> None:
    print(f"[modellab] {msg}", flush=True)


def systemd_user_ok() -> bool:
    if not shutil.which("systemctl"):
        return False
    r = subprocess.run(["systemctl", "--user", "show-environment"], capture_output=True, text=True)
    return r.returncode == 0


def install_service(hub: str) -> bool:
    unit_dir = Path(os.environ.get("XDG_CONFIG_HOME") or Path.home() / ".config") / "systemd" / "user"
    unit_dir.mkdir(parents=True, exist_ok=True)
    (unit_dir / f"{SERVICE}.service").write_text(UNIT.format(home=home(), hub=hub))
    for cmd in (["daemon-reload"], ["enable", SERVICE], ["restart", SERVICE]):
        r = subprocess.run(["systemctl", "--user", *cmd], capture_output=True, text=True)
        if r.returncode:
            say(f"systemctl --user {' '.join(cmd)} failed: {r.stderr.strip()}")
            return False
    r = subprocess.run(["loginctl", "enable-linger"], capture_output=True, text=True) if shutil.which("loginctl") else None
    if r is None or r.returncode:
        say("could not enable lingering: the agent will stop when you log out of this PC. "
            "To keep it running, ask an admin to run: sudo loginctl enable-linger " + (os.environ.get("USER") or "$USER"))
    return True


def main(argv=None) -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--staged", required=True, type=Path)
    p.add_argument("--manifest", required=True, type=Path)
    p.add_argument("--signature", required=True, type=Path)
    p.add_argument("--tarball", required=True, type=Path)
    p.add_argument("--python", help="use this existing Python environment (CPU testing) instead of building one")
    p.add_argument("--no-service", action="store_true")
    a = p.parse_args(argv)

    cfg = load_config()
    manifest_text = a.manifest.read_text()
    manifest = json.loads(manifest_text)
    version = manifest["version"]
    if not update.VERSION_RE.match(version):
        raise SystemExit(f"bad release version {version!r}")

    env = update.ensure_env(a.staged, manifest["lock_hash"], say, base_python=a.python)

    code = ("import sys; from modellab import release; "
            "release.check(open(sys.argv[1]).read(), open(sys.argv[2]).read(), open(sys.argv[3], 'rb').read(), sys.argv[4]); "
            "print('ok')")
    e = dict(os.environ, PYTHONPATH=str(a.staged))
    e.pop("ALLOW_NETWORK", None)
    r = subprocess.run([str(update.env_python(env)), "-c", code, str(a.manifest), str(a.signature), str(a.tarball),
                        cfg["release_pubkey"]], capture_output=True, text=True, env=e, cwd=a.staged)
    if r.returncode or r.stdout.strip() != "ok":
        shutil.rmtree(a.staged, ignore_errors=True)
        raise SystemExit("release signature check FAILED: not installing.\n" + (r.stderr.strip().splitlines() or ["?"])[-1])
    say(f"release {version} signature verified")

    rel = home() / "releases" / version
    if rel.exists():
        shutil.rmtree(rel)
    rel.parent.mkdir(parents=True, exist_ok=True)
    shutil.move(str(a.staged), rel)
    (rel / ".verified").write_text(manifest_text)
    update.link_release(rel, env)
    update.selftest(rel, env, say)

    launcher = home() / "bin" / "modellab-agent"
    launcher.parent.mkdir(parents=True, exist_ok=True)
    launcher.write_text(LAUNCHER.format(home=home()))
    launcher.chmod(0o755)
    update.switch(rel)
    say(f"installed release {version} in {home()}")

    started = False
    if a.no_service:
        say("--no-service: start the agent yourself with: " + str(launcher) + " run")
    elif systemd_user_ok():
        started = install_service(cfg["hub_url"])
        if started:
            say(f"the {SERVICE} service is running and starts with this PC (systemctl --user status {SERVICE})")
    else:
        say("systemd user services are not available here. Start the agent with:\n"
            f"  nohup {launcher} run >> {home() / 'logs' / 'agent.log'} 2>&1 &")
    say("self-check:")
    subprocess.run([str(launcher), "doctor", "--send"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
