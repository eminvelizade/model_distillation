#!/bin/bash
# swatches.sh: the small pictures of each material that the agent editor shows (a plain ball, in the brand's sky blue),
# written to modellab/web/src/components/yeti/stills/materials/<material>.webp. Run it again after changing a material.
# Needs the web app's dev server on port 5199, playwright and Pillow.
set -u
H="$(cd "$(dirname "$0")" && pwd)"; OUT="$H/../../../modellab/web/src/components/yeti/stills/materials"; TMP="$(mktemp -d)"
mkdir -p "$OUT"
for m in plush cotton boucle elastane sugar clay; do
  look="[{\"shape\":\"pom\",\"material\":\"$m\",\"colour\":\"sky\",\"eyes\":\"bean\",\"glasses\":\"none\",\"extra\":\"none\"}]"
  q=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$look")
  (cd "$H" && timeout 200 node shot.cjs "$TMP/$m.png" "looks=$q&size=128&noeyes=1&general=1&zoom=1.04" --scale 2) > "$TMP/log" 2>&1
  grep -q "ERROR:" "$TMP/log" && { echo "$m: the shader did not compile"; grep -A8 "ERROR:" "$TMP/log" | head -12; continue; }
  python3 - "$TMP/$m.png" "$OUT/$m.webp" <<'PY'
import sys
from PIL import Image
im = Image.open(sys.argv[1]).convert("RGBA")
box = im.getbbox() or (0, 0, im.width, im.height)          # trim to the ball and its shadow, keep it square
side = max(box[2] - box[0], box[3] - box[1]); cx = (box[0] + box[2]) // 2; cy = (box[1] + box[3]) // 2
sq = Image.new("RGBA", (side, side), (0, 0, 0, 0)); sq.paste(im, (side // 2 - cx, side // 2 - cy))
sq.resize((112, 112), Image.LANCZOS).save(sys.argv[2], "WEBP", quality=86, method=6)
PY
  echo "$m: $(stat -c %s "$OUT/$m.webp") bytes"
done
rm -rf "$TMP"
