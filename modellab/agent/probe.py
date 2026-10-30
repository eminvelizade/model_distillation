"""Environment + GPU probe, run in its own process (`python -m modellab.agent.probe`) so the agent never holds a CUDA
context: rfdetr transforms, torch/CUDA, a small matmul on every GPU, and installed packages vs the lock file.
Prints one JSON object.
"""

import offline_guard  # noqa: F401  (first: same network block and env as every training process)

import json
import re
import sys
from importlib import metadata


def main() -> int:
    out: dict = {}
    try:
        from modellab import preflight

        out["albumentations_rfdetr"] = preflight.ensure_rfdetr_transforms()
    except Exception as e:  # noqa: BLE001
        out["transforms_error"] = f"{type(e).__name__}: {e}"[-600:]
    try:
        import torch

        out.update(torch=torch.__version__, torch_cuda=torch.version.cuda, cuda_available=torch.cuda.is_available())
        if out["cuda_available"]:
            out["arch_list"] = torch.cuda.get_arch_list()
            devs = []
            for i in range(torch.cuda.device_count()):
                p = torch.cuda.get_device_properties(i)
                d = {"index": i, "name": p.name, "memory_gb": round(p.total_memory / 2**30, 1), "capability": f"{p.major}.{p.minor}"}
                try:
                    a = torch.randn(512, 512, device=f"cuda:{i}")
                    float((a @ a).sum())
                    d["matmul_ok"] = True
                except Exception as e:  # noqa: BLE001  ("no kernel image is available", ...)
                    d["matmul_ok"], d["error"] = False, f"{type(e).__name__}: {e}"[-400:]
                devs.append(d)
            out["devices"] = devs
    except Exception as e:  # noqa: BLE001
        out["torch_error"] = f"{type(e).__name__}: {e}"[-600:]
    lock = sys.argv[1] if len(sys.argv) > 1 else None
    if lock:
        mismatch = []
        for line in open(lock):
            m = re.match(r"^([A-Za-z0-9_.\-\[\]]+)==([^\s;\\]+)", line)
            if not m:
                continue
            name, want = re.sub(r"\[.*\]", "", m.group(1)), m.group(2)
            try:
                got = metadata.version(name)
            except metadata.PackageNotFoundError:
                got = None
            if got != want:
                mismatch.append({"package": name, "want": want, "got": got})
        out["lock_mismatch"] = mismatch
    print(json.dumps(out))
    return 0


if __name__ == "__main__":
    sys.exit(main())
