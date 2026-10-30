"""modellab-agent: the ModelLab agent on a GPU PC (normally run as ~/.modellab/bin/modellab-agent).

    modellab-agent run                  # the service loop (the systemd user service runs this)
    modellab-agent doctor [--json] [--send] [--quick]   # self-check; --send also updates the Machines page
    modellab-agent status               # pairing, service and hub reachability
    modellab-agent pair --hub URL --code CODE --pubkey KEY   # pair again (replaces the token)
    modellab-agent uninstall [--purge] [--keep-machine] [--yes]
"""

from __future__ import annotations

import os
import sys

# This process talks to the hub; the training processes it starts must not (the worker drops this for them).
os.environ["ALLOW_NETWORK"] = "1"
os.environ["MODELLAB_GUARD_CHILDREN"] = "1"

import offline_guard  # noqa: E402,F401  (cache dirs and telemetry-off env vars, inherited by every child)

import argparse  # noqa: E402
import json  # noqa: E402
import platform  # noqa: E402
import shutil  # noqa: E402
import subprocess  # noqa: E402
import time  # noqa: E402

from modellab.agent import (AGENT_VERSION, SERVICE, config_path, home, load_config, save_config,  # noqa: E402
                            setup_logging, use_data_dirs)


def cmd_run(a) -> int:
    from modellab.agent.service import Agent

    setup_logging()
    use_data_dirs()
    cfg = load_config()
    if a.cpu_only:
        cfg["cpu_only"] = True
    return Agent(cfg).run()


def cmd_pair(a) -> int:
    from modellab.agent.client import HubClient

    old = json.loads(config_path().read_text()) if config_path().is_file() else {}
    pubkey = a.pubkey or old.get("release_pubkey")
    if not pubkey:
        raise SystemExit("give --pubkey (the hub's MODELLAB_RELEASE_PUBKEY)")
    r = HubClient(a.hub).post("/agent/v1/pair", {"code": a.code, "hostname": platform.node(), "agent_version": AGENT_VERSION})
    save_config({"hub_url": a.hub.rstrip("/"), "machine_id": r["machine_id"], "name": r["name"], "token": r["token"],
                 "release_pubkey": pubkey, "cpu_only": a.cpu_only or old.get("cpu_only", False), "paired": time.time()})
    print(f"paired as {r['name']!r} ({r['machine_id']}); config in {config_path()}")
    return 0


def cmd_doctor(a) -> int:
    from modellab.agent import doctor

    use_data_dirs()
    cfg = json.loads(config_path().read_text()) if config_path().is_file() else {}
    rep = doctor.report(with_probe=not a.quick, skip_gpu=cfg.get("cpu_only", False))
    if a.json:
        print(json.dumps(rep, indent=2, default=str))
    else:
        doctor.print_report(rep)
    if a.send and cfg:
        from modellab.agent.client import HubClient, HubError

        try:
            HubClient(cfg["hub_url"], cfg["token"]).post("/agent/v1/report", rep)
            print(f"report sent to {cfg['hub_url']}")
        except HubError as e:
            print(f"could not send the report: {e}", file=sys.stderr)
    return 1 if any(c["status"] == "fail" for c in rep["checks"]) else 0


def cmd_status(a) -> int:
    from modellab.agent import release_info
    from modellab.agent.client import HubClient, HubError

    cfg = load_config()
    print(f"home:      {home()}")
    print(f"hub:       {cfg['hub_url']}")
    print(f"machine:   {cfg.get('name')} ({cfg.get('machine_id')})")
    print(f"release:   {release_info().get('version', 'dev (git checkout)')}, agent {AGENT_VERSION}")
    if shutil.which("systemctl"):
        st = subprocess.run(["systemctl", "--user", "is-active", SERVICE], capture_output=True, text=True).stdout.strip()
        print(f"service:   {st or 'unknown'}")
    try:
        cur = HubClient(cfg["hub_url"], cfg["token"]).get("/agent/v1/releases/current")
        print(f"hub ok:    current release {cur['version']}")
    except HubError as e:
        print(f"hub:       {e}")
        return 1
    return 0


def cmd_uninstall(a) -> int:
    from modellab import store
    from modellab.agent.client import HubClient, HubError

    use_data_dirs()
    if not a.yes:
        what = "everything including data/ (runs, checkpoints, weights)" if a.purge else "the agent (data/ is kept)"
        if input(f"Remove {what} from {home()}? [y/N] ").strip().lower() != "y":
            return 1
    for r in store.queue():
        store.request_cancel(r["id"])  # a running run is killed by its process group below
        if r.get("pid"):
            try:
                os.killpg(r["pid"], 15)
            except OSError:
                pass
    if shutil.which("systemctl"):
        subprocess.run(["systemctl", "--user", "disable", "--now", SERVICE], capture_output=True)
        unit = (os.environ.get("XDG_CONFIG_HOME") and os.path.join(os.environ["XDG_CONFIG_HOME"], "systemd/user")) \
            or os.path.expanduser("~/.config/systemd/user")
        try:
            os.remove(os.path.join(unit, f"{SERVICE}.service"))
        except OSError:
            pass
        subprocess.run(["systemctl", "--user", "daemon-reload"], capture_output=True)
    if config_path().is_file() and not a.keep_machine:
        cfg = load_config()
        try:
            HubClient(cfg["hub_url"], cfg["token"]).post("/agent/v1/unpair")
            print("machine removed from the hub")
        except HubError as e:
            print(f"could not reach the hub to remove the machine ({e}); remove it on the Machines page")
    keep = set() if a.purge else {"data"}
    for p in home().iterdir():
        if p.name in keep:
            continue
        if p.is_dir() and not p.is_symlink():
            shutil.rmtree(p, ignore_errors=True)
        else:
            p.unlink(missing_ok=True)
    print("uninstalled" + ("" if a.purge else f"; your runs, checkpoints and weights are still in {home() / 'data'}"))
    return 0


def main(argv=None) -> int:
    p = argparse.ArgumentParser(prog="modellab-agent", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("run")
    r.add_argument("--cpu-only", action="store_true", help="a machine without NVIDIA GPU (testing)")
    r.set_defaults(fn=cmd_run)
    pa = sub.add_parser("pair")
    pa.add_argument("--hub", required=True)
    pa.add_argument("--code", required=True)
    pa.add_argument("--pubkey")
    pa.add_argument("--cpu-only", action="store_true")
    pa.set_defaults(fn=cmd_pair)
    d = sub.add_parser("doctor")
    d.add_argument("--json", action="store_true")
    d.add_argument("--send", action="store_true")
    d.add_argument("--quick", action="store_true", help="skip the GPU / environment probe")
    d.set_defaults(fn=cmd_doctor)
    sub.add_parser("status").set_defaults(fn=cmd_status)
    u = sub.add_parser("uninstall")
    u.add_argument("--purge", action="store_true", help="also delete data/ (runs, checkpoints, weights, dataset registry)")
    u.add_argument("--keep-machine", action="store_true", help="don't remove this machine from the hub")
    u.add_argument("--yes", action="store_true")
    u.set_defaults(fn=cmd_uninstall)
    a = p.parse_args(argv)
    return a.fn(a)


if __name__ == "__main__":
    sys.exit(main())
