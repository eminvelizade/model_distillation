"""Build the "coco-vehicles" quick set from COCO 2017: car, truck, bus, motorcycle.

    # from a local COCO 2017 copy (annotations/instances_{train,val}2017.json + train2017/ + val2017/)
    modellab dataset build-coco-vehicles --coco-root /data/coco2017
    # or download only what is needed (online PC): the annotation zip (~250 MB) + the selected images
    modellab dataset build-coco-vehicles --download

Splits (fixed seed, so the set is reproducible):
    train / valid  <- COCO train2017 images containing >=1 of the 4 classes (shuffled, --max-train / --max-valid)
    test           <- COCO val2017 images containing >=1 of the 4 classes (first --max-test by image id)
Only the 4 classes are kept (ids 1..4, COCO names, so COCO-pretrained detectors can be scored by name).
Crowd annotations are dropped (same rule as make_splits.py). Output: data/coco-vehicles in Roboflow layout
(symlinks to the COCO images unless --copy) + split_manifest.json, then registered as "coco-vehicles".
"""

from __future__ import annotations

import json
import os
import random
import shutil
import subprocess
import zipfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from modellab import ROOT, datasets

CLASSES = ["car", "motorcycle", "bus", "truck"]  # COCO ids 3, 4, 6, 8
ANN_ZIP = "http://images.cocodataset.org/annotations/annotations_trainval2017.zip"
IMG_URL = "http://images.cocodataset.org/{split}/{file}"


def _select(ann: dict, max_n: int | None, shuffle_seed: int | None) -> tuple[list[dict], dict[int, list]]:
    keep_cats = {c["id"]: c["name"] for c in ann["categories"] if c["name"] in CLASSES}
    boxes: dict[int, list] = {}
    for a in ann["annotations"]:
        if a["category_id"] in keep_cats and not a.get("iscrowd", 0) and a["bbox"][2] > 0 and a["bbox"][3] > 0:
            boxes.setdefault(a["image_id"], []).append((keep_cats[a["category_id"]], a["bbox"]))
    imgs = sorted((im for im in ann["images"] if im["id"] in boxes), key=lambda im: im["id"])
    if shuffle_seed is not None:
        random.Random(shuffle_seed).shuffle(imgs)
    return (imgs[:max_n] if max_n else imgs), boxes


def _write(out: Path, split: str, imgs: list[dict], boxes: dict, img_dir: Path, copy: bool) -> list[str]:
    d = out / split
    d.mkdir(parents=True, exist_ok=True)
    cat_id = {n: i + 1 for i, n in enumerate(CLASSES)}
    coco = {"images": [], "annotations": [],
            "categories": [{"id": cat_id[n], "name": n, "supercategory": "vehicle"} for n in CLASSES]}
    md5s = []
    for i, im in enumerate(imgs):
        src = (img_dir / im["file_name"]).resolve()
        dst = d / im["file_name"]
        if dst.is_symlink() or dst.exists():
            dst.unlink()
        shutil.copy2(src, dst) if copy else os.symlink(src, dst)
        md5s.append(datasets._md5(src))
        coco["images"].append({"id": i, "file_name": im["file_name"], "width": im["width"], "height": im["height"],
                               "coco_id": im["id"]})
        for name, (x, y, w, h) in boxes[im["id"]]:
            coco["annotations"].append({"id": len(coco["annotations"]) + 1, "image_id": i, "category_id": cat_id[name],
                                        "bbox": [x, y, w, h], "area": w * h, "iscrowd": 0})
    (d / "_annotations.coco.json").write_text(json.dumps(coco))
    return sorted(md5s)


def _download_images(imgs: list[dict], split: str, img_dir: Path, workers: int = 16) -> None:
    img_dir.mkdir(parents=True, exist_ok=True)

    def get(im: dict) -> None:
        dst = img_dir / im["file_name"]
        if dst.is_file() and dst.stat().st_size > 0:
            return
        tmp = dst.with_suffix(".part")
        subprocess.run(["curl", "-sS", "-L", "--fail", "--retry", "5", "-o", str(tmp),
                        IMG_URL.format(split=split, file=im["file_name"])], check=True)
        tmp.replace(dst)

    with ThreadPoolExecutor(workers) as ex:
        list(ex.map(get, imgs))


def build(coco_root: Path | None, download: bool, out: Path | None = None, max_train: int = 6000, max_valid: int = 800,
          max_test: int = 1500, seed: int = 0, copy: bool = False, log=print) -> dict:
    out = (out or ROOT / datasets.COCO_VEHICLES_DIR).resolve()
    if download:
        coco_root = coco_root or ROOT / "data" / "coco2017"
        ann_dir = coco_root / "annotations"
        if not (ann_dir / "instances_val2017.json").is_file():
            coco_root.mkdir(parents=True, exist_ok=True)
            z = coco_root / "annotations_trainval2017.zip"
            log(f"[coco-vehicles] downloading {ANN_ZIP}")
            subprocess.run(["curl", "-L", "--fail", "--retry", "5", "-C", "-", "-o", str(z), ANN_ZIP], check=True)
            with zipfile.ZipFile(z) as zf:
                for m in ("annotations/instances_train2017.json", "annotations/instances_val2017.json"):
                    zf.extract(m, coco_root)
    if coco_root is None:
        raise SystemExit("give --coco-root (local COCO 2017) or --download")
    coco_root = coco_root.resolve()
    tr_ann = json.loads((coco_root / "annotations" / "instances_train2017.json").read_text())
    tr_imgs, tr_boxes = _select(tr_ann, max_train + max_valid, shuffle_seed=seed)
    del tr_ann
    va_ann = json.loads((coco_root / "annotations" / "instances_val2017.json").read_text())
    te_imgs, te_boxes = _select(va_ann, max_test, shuffle_seed=None)
    del va_ann
    valid, train = tr_imgs[:max_valid], tr_imgs[max_valid:]
    if download:
        log(f"[coco-vehicles] downloading {len(tr_imgs)} train2017 + {len(te_imgs)} val2017 images")
        _download_images(tr_imgs, "train2017", coco_root / "train2017")
        _download_images(te_imgs, "val2017", coco_root / "val2017")
    md5 = {"train": _write(out, "train", train, tr_boxes, coco_root / "train2017", copy),
           "valid": _write(out, "valid", valid, tr_boxes, coco_root / "train2017", copy),
           "test": _write(out, "test", te_imgs, te_boxes, coco_root / "val2017", copy)}
    assert not set(md5["train"]) & (set(md5["valid"]) | set(md5["test"])), "train/held-out overlap"
    manifest = {"source": "COCO 2017", "classes": CLASSES, "seed": seed, "class_names": CLASSES,
                "counts": {"train": len(train), "valid": len(valid), "test": len(te_imgs)}, "md5": md5}
    (out / "split_manifest.json").write_text(json.dumps(manifest, indent=1))
    log(f"[coco-vehicles] {manifest['counts']} -> {out}")
    return datasets.add(datasets.COCO_VEHICLES, out, "COCO 2017 car/truck/bus/motorcycle quick set")
