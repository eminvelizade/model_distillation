"""Turn the matted frames of a clip (tools/mascot/matte.py on a folder) into a transparent animated WebP that lines up
with the puppet: the first frame's plush is scaled and placed exactly where the puppet's body sits on its canvas, and
every later frame gets the same transform (so the clip's own motion, a hop or a lean, is kept).

    python tools/mascot/clip.py out/wave out/L_layers.json wave --once     # -> modellab/web/src/components/yeti/art/clips/wave.webp
    python tools/mascot/clip.py out/think out/L_layers.json think --loop

Names: wave, happy (a hop), think, sleep, idle. The Yeti component plays art/clips/<pose>.webp while it is in that
pose and uses the puppet for everything else, so a one-shot clip should end on the starting frame.
"""

import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "modellab/web/src/components/yeti/art/clips"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("frames", type=Path, help="folder of RGBA frames from matte.py")
    ap.add_argument("layers", type=Path, help="L_layers.json from layers.py (the puppet's canvas)")
    ap.add_argument("pose", choices=["wave", "happy", "think", "sleep", "idle"])
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--once", action="store_true")
    g.add_argument("--loop", action="store_true")
    ap.add_argument("--fps", type=float, default=20)
    ap.add_argument("--size", type=int, default=256)
    args = ap.parse_args()
    info = json.loads(args.layers.read_text())
    frames = [Image.open(p).convert("RGBA") for p in sorted(args.frames.glob("*.png"))]
    if not frames:
        raise SystemExit("no frames")
    a = np.asarray(frames[0].getchannel("A"))
    ys, xs = np.where(a > 128)
    w0, bottom0, cx0 = xs.max() - xs.min(), ys.max(), (xs.max() + xs.min()) / 2
    S = args.size
    b = info["body"]
    scale = (b["right"] - b["left"]) * S / w0  # the first frame's plush as wide as the puppet's body
    out = []
    for f in frames:
        im = f.resize((max(1, round(f.width * scale)), max(1, round(f.height * scale))), Image.LANCZOS)
        canvas = Image.new("RGBA", (S, S))
        x = round((b["left"] + b["right"]) / 2 * S - cx0 * scale)
        y = round(b["bottom"] * S - bottom0 * scale)
        canvas.paste(im, (x, y))  # onto an empty canvas: a plain copy keeps the alpha exact, and clips at the edges
        out.append(canvas)
    OUT.mkdir(parents=True, exist_ok=True)
    dst = OUT / f"{args.pose}.webp"
    out[0].save(dst, "WEBP", save_all=True, append_images=out[1:], duration=round(1000 / args.fps),
                loop=0 if args.loop else 1, quality=80, method=6)
    print(f"{dst.relative_to(ROOT)}: {len(out)} frames, {dst.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
