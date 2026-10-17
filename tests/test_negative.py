"""Negative tests: the safety checks must actually fire.

python tests/test_negative.py --ckpt runs/smoke/distill/rf-detr-nano-distilled.pth --data runs/smoke/ds --tmp runs/smoke/neg
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import offline_guard  # noqa: E402,F401  (must be first)

import argparse  # noqa: E402
import json  # noqa: E402
import shutil  # noqa: E402

import torch  # noqa: E402

from distill import train_images  # noqa: E402
from load_backbone import check  # noqa: E402


def expect_fail(name, fn, exc=(AssertionError, SystemExit, RuntimeError)):
    try:
        fn()
    except exc as e:
        print(f"PASS {name}: {type(e).__name__}: {str(e).splitlines()[0][:110]}")
        return True
    print(f"FAIL {name}: no error raised")
    return False


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--ckpt", type=Path, required=True)
    p.add_argument("--data", type=Path, required=True)
    p.add_argument("--tmp", type=Path, required=True)
    a = p.parse_args()
    a.tmp.mkdir(parents=True, exist_ok=True)
    stock = offline_guard.NANO_WEIGHTS
    sd = torch.load(a.ckpt, map_location="cpu", weights_only=False)["model"]
    ok = True

    def variant(name, mutate):
        d = dict(sd)
        mutate(d)
        path = a.tmp / f"{name}.pth"
        torch.save({"model": d}, path)
        return path

    k_enc = next(k for k in sd if k.startswith("backbone.0.encoder.") and k.endswith("weight"))
    k_dec = next(k for k in sd if k.startswith("transformer."))
    ok &= expect_fail("missing key", lambda: check(variant("missing", lambda d: d.pop(k_enc)), stock))
    ok &= expect_fail("unexpected key", lambda: check(variant("extra", lambda d: d.__setitem__("bogus.weight", torch.zeros(1))), stock))
    ok &= expect_fail("shape mismatch", lambda: check(variant("shape", lambda d: d.__setitem__(k_enc, torch.zeros(3, 3))), stock))
    ok &= expect_fail("decoder modified", lambda: check(variant("dec", lambda d: d.__setitem__(k_dec, d[k_dec] + 1)), stock))
    ok &= expect_fail("unchanged encoder", lambda: check(stock, stock))

    # Leakage: put one valid image into the train split -> distill must refuse.
    leak = a.tmp / "ds_leak"
    shutil.rmtree(leak, ignore_errors=True)
    shutil.copytree(a.data, leak, symlinks=True)
    tr = json.loads((leak / "train" / "_annotations.coco.json").read_text())
    va = json.loads((leak / "valid" / "_annotations.coco.json").read_text())
    src = (leak / "valid" / va["images"][0]["file_name"]).resolve()
    (leak / "train" / "leaked.jpg").symlink_to(src)
    tr["images"].append({"id": 10**6, "file_name": "leaked.jpg", "width": 1, "height": 1})
    (leak / "train" / "_annotations.coco.json").write_text(json.dumps(tr))
    ok &= expect_fail("held-out image in train split", lambda: train_images(leak))

    print("negative tests: all passed" if ok else "negative tests: FAILURES")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
