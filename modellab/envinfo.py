"""Environment fingerprint stored with every run (env.json)."""

from __future__ import annotations

import platform
import socket
import subprocess
import sys
from importlib import metadata

from modellab import ROOT, __version__

PACKAGES = ("torch", "torchvision", "lightly-train", "rfdetr", "transformers", "pycocotools", "numpy", "pytorch-lightning",
            "scikit-learn", "supervision")


def git_info() -> dict:
    def git(*args: str) -> str:
        try:
            return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, timeout=10).stdout.strip()
        except (OSError, subprocess.SubprocessError):
            return ""

    commit = git("rev-parse", "HEAD")
    if not commit:  # offline bundle has no .git: pack_env.sh writes GIT_COMMIT
        f = ROOT / "GIT_COMMIT"
        return {"commit": f.read_text().strip() if f.is_file() else None, "dirty": None, "source": "GIT_COMMIT file"}
    return {"commit": commit, "dirty": bool(git("status", "--porcelain", "--untracked-files=no")), "branch": git("rev-parse", "--abbrev-ref", "HEAD")}


def gpu_info() -> dict:
    try:
        import torch
    except ImportError:
        return {}
    out = {"cuda_available": torch.cuda.is_available(), "torch_cuda": torch.version.cuda}
    if torch.cuda.is_available():
        out["devices"] = [{"name": torch.cuda.get_device_name(i), "capability": ".".join(map(str, torch.cuda.get_device_capability(i))),
                           "memory_gb": round(torch.cuda.get_device_properties(i).total_memory / 2**30, 1)}
                          for i in range(torch.cuda.device_count())]
        try:
            import pynvml

            pynvml.nvmlInit()
            drv = pynvml.nvmlSystemGetDriverVersion()
            out["driver"] = drv.decode() if isinstance(drv, bytes) else drv
        except Exception:  # noqa: BLE001
            out["driver"] = None
    return out


def capture(seed: int | None = None) -> dict:
    pk = {}
    for p in PACKAGES:
        try:
            pk[p] = metadata.version(p)
        except metadata.PackageNotFoundError:
            pk[p] = None
    return {"modellab": __version__, "git": git_info(), "python": sys.version.split()[0], "platform": platform.platform(),
            "host": socket.gethostname(), "packages": pk, "gpu": gpu_info(), "seed": seed}
