"""Shared fixtures: an isolated runs dir + dataset registry, and the tiny synthetic dataset (built once per session)."""

import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

import offline_guard  # noqa: E402,F401  (same setup as every ModelLab process)


@pytest.fixture(scope="session")
def tiny_dataset(tmp_path_factory) -> Path:
    out = tmp_path_factory.mktemp("data") / "tiny"
    subprocess.run([sys.executable, str(ROOT / "tests/modellab/make_tiny_dataset.py"), "--out", str(out), "--n", "36"],
                   check=True, capture_output=True)
    return out


@pytest.fixture()
def lab(tmp_path, monkeypatch, tiny_dataset):
    """Fresh store + registry with the tiny dataset registered as 'tiny'."""
    monkeypatch.setenv("MODELLAB_RUNS_DIR", str(tmp_path / "runs"))
    monkeypatch.setenv("MODELLAB_DATASETS", str(tmp_path / "datasets.json"))
    monkeypatch.setenv("MODELLAB_DEVICE", "cpu")
    monkeypatch.setenv("MODELLAB_POLL_S", "0.5")
    monkeypatch.setenv("MODELLAB_NO_AUTOSTART", "1")
    monkeypatch.setenv("PYTHONPATH", str(ROOT))
    from modellab import datasets

    datasets.add("tiny", tiny_dataset)
    return tmp_path
