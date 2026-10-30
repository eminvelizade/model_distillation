"""ModelLab Agent: the background service on a user's Linux GPU PC that runs the hub's jobs locally.

Installed by `curl -fsSL https://<hub>/install.sh | bash -s -- --pair CODE` (modellab/hub/install.sh). Everything
lives under MODELLAB_HOME (default ~/.modellab):

  agent.json            hub URL, machine id, token (mode 600), release public key pinned at install
  bin/                  uv, modellab-agent (launcher used by the systemd user service)
  python/  envs/<lock>  uv-managed Python and the environment of each lock file
  releases/<version>/   engine code; weights/ cache/ data/ runs/ are symlinks into data/
  current               -> releases/<version>
  data/                 runs/ weights/ cache/ datasets/ datasets.json: kept across updates and on uninstall
  logs/agent.log

The agent process is the only one that talks to the network. Every training process it starts runs with
offline_guard's network block, as on the offline PC.
"""

from __future__ import annotations

import json
import logging
import os
from pathlib import Path

from modellab import __version__

AGENT_VERSION = __version__
SERVICE = "modellab-agent"
log = logging.getLogger("modellab.agent")


def setup_logging(to_file: bool = True) -> None:
    """stdout (journald under systemd) + logs/agent.log (rotated)."""
    from logging.handlers import RotatingFileHandler

    fmt = logging.Formatter("%(asctime)s %(levelname)s %(message)s", "%Y-%m-%d %H:%M:%S")
    log.setLevel(logging.INFO)
    log.handlers.clear()
    h = logging.StreamHandler()
    h.setFormatter(fmt)
    log.addHandler(h)
    if to_file:
        (home() / "logs").mkdir(parents=True, exist_ok=True)
        fh = RotatingFileHandler(home() / "logs" / "agent.log", maxBytes=5 * 2**20, backupCount=3)
        fh.setFormatter(fmt)
        log.addHandler(fh)


def home() -> Path:
    return Path(os.environ.get("MODELLAB_HOME") or Path.home() / ".modellab").expanduser().resolve()


def data_dir() -> Path:
    return home() / "data"


def config_path() -> Path:
    return home() / "agent.json"


def load_config() -> dict:
    p = config_path()
    if not p.is_file():
        raise SystemExit(f"not paired: {p} is missing. Run the install command from the hub's Machines page.")
    return json.loads(p.read_text())


def save_config(cfg: dict) -> None:
    p = config_path()
    p.parent.mkdir(parents=True, exist_ok=True)
    tmp = p.with_suffix(".tmp")
    fd = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600)
    with os.fdopen(fd, "w") as f:
        json.dump(cfg, f, indent=2)
    os.replace(tmp, p)


def use_data_dirs() -> None:
    """Point the engine's run store and dataset registry at data/ (they survive updates)."""
    d = data_dir()
    for sub in ("runs", "weights", "cache", "datasets"):
        (d / sub).mkdir(parents=True, exist_ok=True)
    os.environ.setdefault("MODELLAB_RUNS_DIR", str(d / "runs"))
    os.environ.setdefault("MODELLAB_DATASETS", str(d / "datasets.json"))


def release_info() -> dict:
    """RELEASE.json of the code this process runs (absent when running from a git checkout)."""
    from modellab import ROOT

    f = ROOT / "RELEASE.json"
    return json.loads(f.read_text()) if f.is_file() else {}
