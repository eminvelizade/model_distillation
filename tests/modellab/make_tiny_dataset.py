"""Tiny Roboflow-layout detection dataset for ModelLab CPU tests (synthetic shapes renamed to COCO vehicle names,
so stock COCO detectors get scored through the by-name class mapping).

    python tests/modellab/make_tiny_dataset.py --out /tmp/ml/tiny --n 40
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RENAME = {"circle": "car", "square": "truck", "triangle": "bus"}


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--n", type=int, default=40)
    p.add_argument("--seed", type=int, default=0)
    a = p.parse_args()
    raw = a.out.parent / (a.out.name + "_raw")
    subprocess.run([sys.executable, str(ROOT / "tests/make_synthetic_dataset.py"), "--out", str(raw), "--n", str(a.n),
                    "--format", "coco", "--seed", str(a.seed)], check=True)
    subprocess.run([sys.executable, str(ROOT / "make_splits.py"), "--format", "coco", "--coco-json",
                    str(raw / "annotations.json"), "--images-dir", str(raw / "images"), "--out", str(a.out), "--copy"],
                   check=True)
    for s in ("train", "valid", "test"):
        f = a.out / s / "_annotations.coco.json"
        d = json.loads(f.read_text())
        for c in d["categories"]:
            c["name"] = RENAME[c["name"]]
        f.write_text(json.dumps(d))
    print(f"tiny dataset -> {a.out}")


if __name__ == "__main__":
    main()
