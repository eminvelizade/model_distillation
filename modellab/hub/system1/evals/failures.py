"""How well the decision model recognises a known failure in an error the catalogue's patterns don't match.

    OPENROUTER_API_KEY=... python -m modellab.hub.system1.evals.failures [--model liquid/d1-ultra-20261015]

Each case is the tail of an error and the catalogue entry it shows ("none" when it shows no known failure). None of
them matches a pattern in failures.py: those never reach the model. A wrong diagnosis offers the wrong fix, so what
matters is how many picks at a threshold are wrong, then how many known failures are found.
"""

from __future__ import annotations

import argparse
import os
import sys

from .. import failures
from ..providers import OpenRouter

CASES: list[tuple[str, str]] = [
    ("oom", "RuntimeError: cuDNN error: CUDNN_STATUS_ALLOC_FAILED"),
    ("oom", "RuntimeError: CUDA error: CUBLAS_STATUS_ALLOC_FAILED when calling `cublasCreate(handle)`"),
    ("oom", "tensorrt.Error: Cuda failure: out of memory while building the engine (workspace 8192 MiB)"),
    ("oom", "nvrtc: error: failed to allocate 4096 MiB on device 0 (16 GiB total; 120 MiB free)"),
    ("oom", "RuntimeError: Unable to find a valid cuDNN algorithm to run convolution\n(GPU 0 has 15.6 GiB, 15.4 GiB in use)"),
    ("open_files", "OSError: [Errno 23] File table overflow"),
    ("open_files", "RuntimeError: Pin memory thread exited unexpectedly\n(hint: ulimit -n is 1024 on this machine)"),
    ("open_files", "torch.multiprocessing: failed to duplicate file descriptor: EMFILE"),
    ("open_files", "OSError: EMFILE: the process has reached its file descriptor limit"),
    ("shm", "RuntimeError: DataLoader worker (pid 4127) is killed by signal: Killed.\nIt is possible that dataloader's workers are out of shm."),
    ("shm", "RuntimeError: DataLoader worker (pid(s) 911) exited unexpectedly\ncontainer started with --shm-size=64m"),
    ("shm", "OSError: [Errno 12] Cannot allocate memory: mmap of a tensor in the SHM segment failed"),
    ("disk", "RuntimeError: PytorchStreamWriter failed writing file data/97: file write failed"),
    ("disk", "IOError: write error: filesystem is 100% full (/home)"),
    ("disk", "RuntimeError: torch.save: unexpected EOF while writing checkpoint_best.pth, 0 bytes free on /dev/nvme0n1p2"),
    ("dataset_missing", "FileNotFoundError: [Errno 2] No such file or directory: '/mnt/old_disk/forklifts/img_0042.jpg'"),
    ("dataset_missing", "RuntimeError: dataset root /data/forklifts-v3 does not exist on this machine"),
    ("dataset_missing", "ValueError: 0 images found in /data/pallets-2026/valid: is the folder empty?"),
    ("weights_missing", "OSError: checkpoint file /home/u/modellab/weights/rf-detr-nano.pth not found"),
    ("weights_missing", "urllib.error.URLError: <urlopen error [Errno -3] Temporary failure in name resolution>\nwhile downloading dinov3_vitl16_pretrain.pth"),
    ("weights_missing", "huggingface_hub.errors.LocalEntryNotFoundError: Cannot find the requested files in the disk cache "
                        "and outgoing traffic has been disabled (model.safetensors)"),
    ("driver", "RuntimeError: The NVIDIA driver on your system is too old (found version 11070). Please update your GPU driver"),
    ("driver", "nvidia-smi: Failed to initialize NVML: Driver/library version mismatch"),
    ("driver", "RuntimeError: CUDA unknown error - this may be due to an incorrectly set up environment, e.g. changing env "
               "variable CUDA_VISIBLE_DEVICES after program start"),
    ("nan", "FloatingPointError: gradient contains inf at step 412"),
    ("nan", "ValueError: cost matrix is infeasible (it contains NaN) in HungarianMatcher"),
    ("nan", "AssertionError: bbox regression loss exploded: inf at epoch 2"),
    ("none", "KeyError: 'category_id'"),
    ("none", "TypeError: forward() got an unexpected keyword argument 'targets'"),
    ("none", "ModuleNotFoundError: No module named 'rfdetr'"),
    ("none", "KeyboardInterrupt"),
    ("none", "RuntimeError: size mismatch for class_embed.weight: copying a param with shape torch.Size([91, 256]) from "
             "checkpoint, the shape in current model is torch.Size([5, 256])"),
    ("none", "AssertionError: image_size must be a multiple of 32, got 500"),
    ("none", "PermissionError: [Errno 13] Permission denied: '/data/runs/20261111-t'"),
    ("none", "ConnectionResetError: [Errno 104] Connection reset by peer"),
    ("none", "RuntimeError: Expected all tensors to be on the same device, but found at least two devices, cuda:0 and cpu!"),
    ("none", "yaml.scanner.ScannerError: mapping values are not allowed here"),
    ("none", "subprocess.CalledProcessError: Command '['trtexec', '--onnx=model.onnx']' returned non-zero exit status 1"),
    ("none", "ZeroDivisionError: division by zero"),
    ("none", "ValueError: num_classes (4) does not match the number of categories in the annotations (5)"),
    ("none", "AttributeError: 'NoneType' object has no attribute 'shape'"),
]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--model", default="liquid/d1-ultra-20261015")
    a = ap.parse_args(argv)
    key = os.environ.get("OPENROUTER_API_KEY")
    if not key:
        print("set OPENROUTER_API_KEY", file=sys.stderr)
        return 2
    assert not [e for _, e in CASES if failures.match(e)], "a case matches a pattern: it would never reach the model"
    client = OpenRouter(key, timeout=30)
    rows = []
    for want, error in CASES:
        res = client.decide(a.model, *failures.near_question(error))
        f, r = res.answers.get("failure") or {}, res.answers.get("failure_rev") or {}
        rows.append({"want": want, "pick": f.get("pick"), "rev": r.get("pick"), "p": f.get("p") or 0.0, "error": error,
                     "failed": res.error})
    known = sum(w != "none" for w, _ in CASES)
    print(f"{a.model}: {len(CASES)} errors, {known} of them a known failure\n")
    print("threshold  found (of the known)  wrong diagnoses  none left alone")
    for t in (0.5, 0.7, 0.8, 0.9, 0.95):
        said = [r for r in rows if r["pick"] != "none" and r["pick"] == r["rev"] and r["p"] >= t]
        right = sum(r["pick"] == r["want"] for r in said)
        quiet = sum(r["want"] == "none" and r not in said for r in rows)
        print(f"   {t:<8} {right:2} of {known:<14} {len(said) - right:<16} {quiet} of {len(CASES) - known}")
    print("\nwhat it said when it was wrong or silent (at 0.9):")
    for r in rows:
        sure = r["pick"] != "none" and r["pick"] == r["rev"] and r["p"] >= 0.9
        if (sure and r["pick"] != r["want"]) or (not sure and r["want"] != "none"):
            print(f"  wanted {r['want']:16} got {str(r['pick']):16} (reversed: {r['rev']}, p {r['p']:.2f})  {r['error'][:70]!r}")
    client.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
