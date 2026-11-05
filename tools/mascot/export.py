"""Write the mascot layers (tools/mascot/layers.py) where the app uses them:

  modellab/web/src/components/yeti/art/{body,eye-l,eye-r,tuft,arm}.webp   the puppet's layers, 400 px canvas
  modellab/hub/yeti.webp                                                 the whole plush, 160 px, for the Claude sign-in page

    python tools/mascot/export.py out/L         # then: cd modellab/web && npm run build
"""

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
ART = ROOT / "modellab/web/src/components/yeti/art"
SIZE = 400
LAYERS = (("body", "body", 84), ("tuft", "tuft", 84), ("eye_l", "eye-l", 90), ("eye_r", "eye-r", 90), ("paw", "arm", 84))


def main(prefix: str) -> None:
    ART.mkdir(parents=True, exist_ok=True)
    for src, dst, q in LAYERS:
        Image.open(f"{prefix}_{src}.png").resize((SIZE, SIZE), Image.LANCZOS).save(ART / f"{dst}.webp", "WEBP", quality=q, method=6)
    flat = None
    for name in ("body", "tuft", "eye_l", "eye_r"):
        im = Image.open(f"{prefix}_{name}.png").convert("RGBA")
        flat = im if flat is None else Image.alpha_composite(flat, im)
    flat.resize((160, 160), Image.LANCZOS).save(ROOT / "modellab/hub/yeti.webp", "WEBP", quality=82, method=6)
    for f in sorted(ART.glob("*.webp")):
        print(f"{f.relative_to(ROOT)}  {f.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main(sys.argv[1])
