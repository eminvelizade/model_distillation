"""Tiny synthetic detection dataset (3 shape classes) for smoke tests only.

python tests/make_synthetic_dataset.py --out /tmp/synth --n 40 --format coco
python tests/make_synthetic_dataset.py --out /tmp/synth_yolo --n 40 --format yolo
"""

import argparse
import json
import random
from pathlib import Path

from PIL import Image, ImageDraw

CLASSES = ["circle", "square", "triangle"]


def draw_image(rng: random.Random, w: int, h: int):
    bg = tuple(rng.randint(0, 255) for _ in range(3))
    img = Image.new("RGB", (w, h), bg)
    d = ImageDraw.Draw(img)
    boxes = []
    for _ in range(rng.randint(1, 4)):
        cls = rng.randrange(len(CLASSES))
        s = rng.randint(min(w, h) // 8, min(w, h) // 3)
        x0, y0 = rng.randint(0, w - s - 1), rng.randint(0, h - s - 1)
        color = tuple(rng.randint(0, 255) for _ in range(3))
        if cls == 0:
            d.ellipse([x0, y0, x0 + s, y0 + s], fill=color)
        elif cls == 1:
            d.rectangle([x0, y0, x0 + s, y0 + s], fill=color)
        else:
            d.polygon([(x0 + s / 2, y0), (x0, y0 + s), (x0 + s, y0 + s)], fill=color)
        boxes.append((cls, x0, y0, s, s))
    return img, boxes


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--out", type=Path, required=True)
    p.add_argument("--n", type=int, default=40)
    p.add_argument("--format", choices=["coco", "yolo"], default="coco")
    p.add_argument("--seed", type=int, default=0)
    a = p.parse_args()
    rng = random.Random(a.seed)
    img_dir = a.out / "images"
    img_dir.mkdir(parents=True, exist_ok=True)
    coco = {"images": [], "annotations": [], "categories": [{"id": i + 1, "name": c} for i, c in enumerate(CLASSES)]}
    for i in range(a.n):
        w, h = rng.choice([(640, 480), (512, 512), (480, 640)])
        img, boxes = draw_image(rng, w, h)
        name = f"img_{i:04d}.jpg"
        img.save(img_dir / name, quality=90)
        coco["images"].append({"id": i, "file_name": name, "width": w, "height": h})
        for cls, x, y, bw, bh in boxes:
            coco["annotations"].append(
                {"id": len(coco["annotations"]), "image_id": i, "category_id": cls + 1,
                 "bbox": [x, y, bw, bh], "area": bw * bh, "iscrowd": 0}
            )
        if a.format == "yolo":
            lbl_dir = a.out / "labels"
            lbl_dir.mkdir(exist_ok=True)
            lines = [f"{c} {(x + bw / 2) / w:.6f} {(y + bh / 2) / h:.6f} {bw / w:.6f} {bh / h:.6f}" for c, x, y, bw, bh in boxes]
            (lbl_dir / f"img_{i:04d}.txt").write_text("\n".join(lines) + "\n")
    if a.format == "coco":
        (a.out / "annotations.json").write_text(json.dumps(coco))
    else:
        (a.out / "data.yaml").write_text("names:\n" + "".join(f"  {i}: {c}\n" for i, c in enumerate(CLASSES)))
    print(f"wrote {a.n} images to {a.out} ({a.format})")


if __name__ == "__main__":
    main()
