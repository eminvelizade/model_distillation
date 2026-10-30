"""ModelLab: run, queue and compare vision-model experiments (distill / finetune / eval / features).

Engine first (CLI: `modellab ...` or `python -m modellab ...`); the web UI (`python app.py`) only calls it.
Everything lives in this repo: runs in runs/<id>/ + runs/index.sqlite, datasets registered in datasets.json,
weights in weights/ and cache/ (see modellab.weights). offline_guard is imported by every process.
"""

from __future__ import annotations

import os
from pathlib import Path

__version__ = "0.2.0"

ROOT = Path(__file__).resolve().parent.parent


def runs_dir() -> Path:
    return Path(os.environ.get("MODELLAB_RUNS_DIR", ROOT / "runs")).resolve()


def db_path() -> Path:
    return runs_dir() / "index.sqlite"


def datasets_file() -> Path:
    return Path(os.environ.get("MODELLAB_DATASETS", ROOT / "datasets.json")).resolve()
