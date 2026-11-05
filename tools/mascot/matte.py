"""Cut the mascot out of a picture (or out of every frame of a clip) with a transparent background.

BiRefNet from its ONNX export (weights only; nothing downloaded is executed) gives the alpha; pymatting's foreground
estimation then removes the background colour from the fur's soft edges, so the cut-out has no halo on light or dark
pages. Two passes: the whole picture finds the mascot, then a tight crop around it gives fine fur detail.

    python tools/mascot/matte.py mascot.jpg out/plush --model birefnet.onnx   # -> out/plush_rgba.png (+ _alpha.png)
    python tools/mascot/matte.py frames/ out/wave --model birefnet.onnx       # every PNG/JPG in a folder (clip frames)

The model (about 1 GB): https://huggingface.co/onnx-community/BiRefNet-ONNX/resolve/main/onnx/model.onnx
Needs: pip install onnxruntime pymatting pillow numpy  (dev only; not part of the hub or the agent)
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image

MEAN = np.array([0.485, 0.456, 0.406], np.float32)
STD = np.array([0.229, 0.224, 0.225], np.float32)


def _alpha(sess, img: Image.Image) -> np.ndarray:
    x = np.asarray(img.convert("RGB").resize((1024, 1024), Image.BILINEAR)).astype(np.float32) / 255
    x = ((x - MEAN) / STD).transpose(2, 0, 1)[None]
    p = sess.run(None, {sess.get_inputs()[0].name: x})[0][0, 0]
    if p.min() < 0 or p.max() > 1:  # logits
        p = 1 / (1 + np.exp(-p))
    a = Image.fromarray((np.clip(p, 0, 1) * 255).astype(np.uint8)).resize(img.size, Image.BICUBIC)
    return np.asarray(a).astype(np.float64) / 255


def matte(sess, img: Image.Image, box: tuple[int, int, int, int] | None = None) -> tuple[Image.Image, tuple]:
    """-> (RGBA cut-out of `box` or of a margin around the mascot, the box used)."""
    from pymatting import estimate_foreground_ml

    img = img.convert("RGB")
    if box is None:
        a = _alpha(sess, img)
        ys, xs = np.where(a > 0.5)
        if not len(xs):
            raise SystemExit("no foreground found")
        m = int(0.1 * max(xs.max() - xs.min(), ys.max() - ys.min()))
        box = (max(0, xs.min() - m), max(0, ys.min() - m), min(img.width, xs.max() + m), min(img.height, ys.max() + m))
    crop = img.crop(box)
    a = _alpha(sess, crop)
    fg = estimate_foreground_ml(np.asarray(crop).astype(np.float64) / 255, a)
    rgba = np.dstack([np.clip(fg * 255, 0, 255).astype(np.uint8), (a * 255).astype(np.uint8)])
    return Image.fromarray(rgba, "RGBA"), box


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src", type=Path, help="an image, or a folder of frames")
    ap.add_argument("out", help="output prefix")
    ap.add_argument("--model", required=True, type=Path, help="BiRefNet ONNX file")
    args = ap.parse_args()
    import onnxruntime as ort

    sess = ort.InferenceSession(str(args.model), providers=["CPUExecutionProvider"])
    if args.src.is_dir():
        frames = sorted(p for p in args.src.iterdir() if p.suffix.lower() in (".png", ".jpg", ".jpeg"))
        box = None
        out = Path(args.out)
        out.mkdir(parents=True, exist_ok=True)
        for i, f in enumerate(frames):  # one crop box for the whole clip (found on the first frame), so frames align
            rgba, box = matte(sess, Image.open(f), box)
            rgba.save(out / f"{i:04d}.png")
        print(f"{len(frames)} frames -> {out}/ (crop {box})")
    else:
        rgba, box = matte(sess, Image.open(args.src))
        rgba.save(f"{args.out}_rgba.png")
        rgba.getchannel("A").save(f"{args.out}_alpha.png")
        print(f"{args.out}_rgba.png {rgba.size} (crop {box})")


if __name__ == "__main__":
    main()
