"""Normalize a COCO or YOLO dataset into RF-DETR's layout with a fixed held-out split.

Output (what rfdetr's `dataset_dir` expects):
    <out>/train/_annotations.coco.json + images   <- the ONLY split distill.py reads
    <out>/valid/_annotations.coco.json + images   <- held out (feature comparison, detector val)
    <out>/test/_annotations.coco.json  + images   <- held out (final detector mAP)
    <out>/split_manifest.json                     <- seed, counts, per-image md5 per split

Images with identical bytes are kept in the same split (grouped by md5), so a
duplicate cannot leak a held-out image into distillation.

Examples:
    # one COCO json, re-split 70/15/15
    python make_splits.py --format coco --coco-json /data/ann.json --images-dir /data/images --out data/ds
    # COCO already split (e.g. Roboflow export): keep the given splits
    python make_splits.py --format coco --split-json train=/d/train/_annotations.coco.json \
        --split-json valid=/d/valid/_annotations.coco.json --split-json test=/d/test/_annotations.coco.json --out data/ds
    # YOLO (data.yaml + images/ + labels/), re-split; add --keep-splits to use train/val/test dirs
    python make_splits.py --format yolo --yolo-dir /data/yolo --out data/ds
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import random
import shutil
from collections import defaultdict
from pathlib import Path

from PIL import Image

IMG_EXT = {".jpg", ".jpeg", ".png", ".bmp", ".tif", ".tiff", ".webp"}
SPLITS = ("train", "valid", "test")
SPLIT_ALIASES = {"train": "train", "val": "valid", "valid": "valid", "validation": "valid", "test": "test"}


def md5(path: Path) -> str:
    h = hashlib.md5()
    with open(path, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    return h.hexdigest()


# A record is: {"path": Path, "width": int, "height": int, "boxes": [(class_name, x, y, w, h)], "split": str|None}


def load_coco(json_path: Path, images_dir: Path | None, split: str | None) -> tuple[list[dict], list[str]]:
    d = json.loads(json_path.read_text())
    cats = sorted(d["categories"], key=lambda c: c["id"])
    id2name = {c["id"]: c["name"] for c in cats}
    anns = defaultdict(list)
    for a in d.get("annotations", []):
        if a.get("iscrowd", 0):
            continue
        x, y, w, h = a["bbox"]
        if w > 0 and h > 0:
            anns[a["image_id"]].append((id2name[a["category_id"]], x, y, w, h))
    recs = []
    for im in d["images"]:
        cands = [json_path.parent / im["file_name"]] + ([images_dir / im["file_name"]] if images_dir else [])
        path = next((p for p in cands if p.is_file()), None)
        if path is None:
            raise FileNotFoundError(f"image {im['file_name']} not found in {[str(c.parent) for c in cands]}")
        recs.append({"path": path.resolve(), "width": im["width"], "height": im["height"],
                     "boxes": anns[im["id"]], "split": split})
    # Drop categories without annotations (e.g. the parent "superclass" in Roboflow exports).
    used = {b[0] for r in recs for b in r["boxes"]}
    return recs, [c["name"] for c in cats if c["name"] in used]


def load_yolo(root: Path, keep_splits: bool) -> tuple[list[dict], list[str]]:
    import yaml

    yml = next((root / n for n in ("data.yaml", "data.yml", "dataset.yaml") if (root / n).is_file()), None)
    if yml is None:
        raise FileNotFoundError(f"no data.yaml in {root}")
    names = yaml.safe_load(yml.read_text())["names"]
    names = [names[k] for k in sorted(names)] if isinstance(names, dict) else list(names)
    recs = []
    for img in sorted(p for p in root.rglob("*") if p.suffix.lower() in IMG_EXT):
        parts = list(img.relative_to(root).parts)
        if "images" not in parts:
            continue
        i = len(parts) - 1 - parts[::-1].index("images")
        lbl = root.joinpath(*parts[:i], "labels", *parts[i + 1:]).with_suffix(".txt")
        with Image.open(img) as im:
            W, H = im.size
        boxes = []
        if lbl.is_file():
            for line in lbl.read_text().splitlines():
                v = line.split()
                if not v:
                    continue
                c, xs = int(v[0]), [float(t) for t in v[1:]]
                if len(xs) == 4:  # cx cy w h (normalized)
                    cx, cy, w, h = xs
                    x0, y0 = cx - w / 2, cy - h / 2
                else:  # polygon -> bbox
                    px, py = xs[0::2], xs[1::2]
                    x0, y0, w, h = min(px), min(py), max(px) - min(px), max(py) - min(py)
                if w > 0 and h > 0:
                    boxes.append((names[c], x0 * W, y0 * H, w * W, h * H))
        split = None
        if keep_splits:
            split = next((SPLIT_ALIASES[p.lower()] for p in parts if p.lower() in SPLIT_ALIASES), None)
            if split is None:
                raise ValueError(f"--keep-splits: cannot tell split of {img}")
        recs.append({"path": img.resolve(), "width": W, "height": H, "boxes": boxes, "split": split})
    return recs, names


def assign_splits(recs: list[dict], val_frac: float, test_frac: float, seed: int) -> None:
    groups = defaultdict(list)
    for r in recs:
        groups[r["md5"]].append(r)
    if all(r["split"] for r in recs):
        # Given splits: duplicates across splits are a leak -> move them all to the held-out split.
        for g in groups.values():
            s = {r["split"] for r in g}
            if len(s) > 1:
                tgt = "test" if "test" in s else "valid"
                print(f"[make_splits] duplicate image across splits {sorted(s)} -> {tgt}: {g[0]['path']}")
                for r in g:
                    r["split"] = tgt
        return
    keys = sorted(groups)
    random.Random(seed).shuffle(keys)
    n_val, n_test = round(len(keys) * val_frac), round(len(keys) * test_frac)
    for i, k in enumerate(keys):
        s = "valid" if i < n_val else "test" if i < n_val + n_test else "train"
        for r in groups[k]:
            r["split"] = s


def write_split(out: Path, split: str, recs: list[dict], names: list[str], copy: bool) -> None:
    d = out / split
    d.mkdir(parents=True, exist_ok=True)
    cat_id = {n: i + 1 for i, n in enumerate(names)}
    coco = {"images": [], "annotations": [],
            "categories": [{"id": cat_id[n], "name": n, "supercategory": "none"} for n in names]}
    for i, r in enumerate(recs):
        fname = f"{i:06d}_{r['path'].name}"
        dst = d / fname
        if dst.is_symlink() or dst.exists():
            dst.unlink()
        if copy:
            shutil.copy2(r["path"], dst)
        else:
            os.symlink(r["path"], dst)
        coco["images"].append({"id": i, "file_name": fname, "width": r["width"], "height": r["height"]})
        for name, x, y, w, h in r["boxes"]:
            coco["annotations"].append({"id": len(coco["annotations"]), "image_id": i, "category_id": cat_id[name],
                                        "bbox": [x, y, w, h], "area": w * h, "iscrowd": 0})
    (d / "_annotations.coco.json").write_text(json.dumps(coco))


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--format", choices=["coco", "yolo"], required=True)
    p.add_argument("--coco-json", type=Path)
    p.add_argument("--images-dir", type=Path)
    p.add_argument("--split-json", action="append", default=[], help="NAME=PATH, NAME in train/valid/val/test")
    p.add_argument("--yolo-dir", type=Path)
    p.add_argument("--keep-splits", action="store_true", help="YOLO: take split from train/val/test dir names")
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--val-frac", type=float, default=0.15)
    p.add_argument("--test-frac", type=float, default=0.15)
    p.add_argument("--seed", type=int, default=0)
    p.add_argument("--copy", action="store_true", help="copy images instead of symlinking")
    a = p.parse_args()

    if a.format == "coco" and a.split_json:
        recs, names = [], []
        for spec in a.split_json:
            k, v = spec.split("=", 1)
            r, n = load_coco(Path(v), a.images_dir, SPLIT_ALIASES[k.lower()])
            recs += r
            names += [x for x in n if x not in names]
    elif a.format == "coco":
        recs, names = load_coco(a.coco_json, a.images_dir, None)
    else:
        recs, names = load_yolo(a.yolo_dir, a.keep_splits)
    if not recs:
        raise SystemExit("no images found")
    for r in recs:
        r["md5"] = md5(r["path"])
    assign_splits(recs, a.val_frac, a.test_frac, a.seed)

    by_split = {s: [r for r in recs if r["split"] == s] for s in SPLITS}
    if not by_split["train"] or not by_split["valid"]:
        raise SystemExit(f"need non-empty train and valid splits, got { {s: len(v) for s, v in by_split.items()} }")
    if not by_split["test"]:
        print("[make_splits] no test split; using valid as test (finetune mAP will be on valid)")
        by_split["test"] = by_split["valid"]
    for s in SPLITS:
        write_split(a.out, s, by_split[s], names, a.copy)

    md5s = {s: sorted({r["md5"] for r in by_split[s]}) for s in SPLITS}
    assert not set(md5s["train"]) & (set(md5s["valid"]) | set(md5s["test"])), "train/held-out overlap"
    manifest = {"seed": a.seed, "val_frac": a.val_frac, "test_frac": a.test_frac, "class_names": names,
                "counts": {s: len(by_split[s]) for s in SPLITS},
                "boxes": {s: sum(len(r["boxes"]) for r in by_split[s]) for s in SPLITS},
                "md5": md5s, "sources": {s: [str(r["path"]) for r in by_split[s]] for s in SPLITS}}
    (a.out / "split_manifest.json").write_text(json.dumps(manifest, indent=1))
    print(f"[make_splits] classes={names}")
    print(f"[make_splits] images={manifest['counts']} boxes={manifest['boxes']} -> {a.out}")


if __name__ == "__main__":
    main()
