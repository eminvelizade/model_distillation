#!/bin/bash
# mat.sh <material> <outdir> [which]: the standard pictures of a material, to judge it by eye.
#   which: all (default) or any of: hero shapes colours small dark close turn
#   hero.png     one plain ball, large            shapes.png   four looks with eyes, glasses, a hat, a scarf
#   colours.png  white, charcoal, red, mint       small.png    as small as the app draws it (68 and 28 px), magnified
#   dark.png     on the dark theme                close.png    a close-up of the surface
#   turn.png     one look from three angles (do the highlights move as they should?)
# It needs the web app's dev server (cd modellab/web && npx vite --port 5199 --strictPort), playwright and Pillow.
# A shader that doesn't compile draws nothing: the error is printed, with the line.
set -u
M=${1:?material}; OUT=${2:?outdir}; W=${3:-all}; H="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$OUT"; OUT="$(cd "$OUT" && pwd)"
q() { python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$1"; }
# look <shape> <colour> [eyes] [extra] [accent] [glasses]
look() { echo "{\"shape\":\"$1\",\"material\":\"$M\",\"colour\":\"$2\",\"accent\":\"${5:-ice}\",\"eyes\":\"${3:-bean}\",\"glasses\":\"${6:-none}\",\"extra\":\"${4:-none}\"}"; }
# shot <file> <size> <scale> <extra query> <look> ...
shot() {
  local f=$1 size=$2 scale=$3 extra=$4; shift 4
  local looks; looks="[$(IFS=,; echo "$*")]"
  (cd "$H" && timeout 200 node shot.cjs "$OUT/$f" "looks=$(q "$looks")&size=$size&own=1${extra:+&$extra}" --scale "$scale") > "$OUT/.log" 2>&1
  grep -q "^saved" "$OUT/.log" || { echo "$f: FAILED"; tail -4 "$OUT/.log"; }
  if grep -q "ERROR:" "$OUT/.log"; then echo "$f: the shader did not compile:"; grep -A14 "ERROR:" "$OUT/.log" | head -36; fi
}
want() { [ "$W" = all ] || [[ " $W " == *" $1 "* ]]; }
row() { python3 "$H/montage.py" "$@" > /dev/null; }

want hero && shot hero.png 560 1 "" "$(look pom sky)"
want shapes && shot shapes.png 300 1 "" "$(look frog lime googly)" "$(look tofu sun bean beanie cherry)" "$(look cub tangerine bead scarf teal round)" "$(look drop cobalt sparkle sprout)"
want colours && shot colours.png 240 1 "" "$(look pom snow)" "$(look pom ink)" "$(look pom cherry)" "$(look gumdrop mint round)"
if want small; then
  for th in light dark; do
    ex=""; [ $th = dark ] && ex="dark=1&bg=070a10"
    shot .s68$th.png 68 2 "$ex" "$(look frog sky googly)" "$(look cub coral bead scarf teal)"
    shot .s28$th.png 28 2 "$ex" "$(look frog sky googly)" "$(look cub coral bead scarf teal)"
  done
  python3 - "$OUT" <<'PY'
import sys
from PIL import Image
out = sys.argv[1]
tiles = []
for th in ("light", "dark"):
    bg = (245, 248, 252) if th == "light" else (7, 10, 16)
    for s, k in ((68, 3), (28, 6)):
        im = Image.open(f"{out}/.s{s}{th}.png").convert("RGBA")
        flat = Image.new("RGBA", im.size, bg + (255,)); flat.alpha_composite(im)
        tiles.append(flat.convert("RGB").resize((im.width * k, im.height * k), Image.NEAREST))
h = max(t.height for t in tiles); w = sum(t.width for t in tiles) + 12 * (len(tiles) - 1)
sheet = Image.new("RGB", (w, h), (128, 128, 128)); x = 0
for t in tiles: sheet.paste(t, (x, (h - t.height) // 2)); x += t.width + 12
sheet.save(f"{out}/small.png")
PY
fi
want dark && shot dark.png 380 1 "dark=1&bg=070a10" "$(look frog lime googly)" "$(look pom snow)" "$(look kitten coral round none ice shades)"
want close && shot close.png 560 1 "zoom=3.4" "$(look pom sky)"
if want turn; then
  for y in -32 0 32; do shot ".t$y.png" 300 1 "yaw=$y" "$(look kitten coral round)"; done
  row "$OUT/turn.png" "$OUT/.t-32.png" "$OUT/.t0.png" "$OUT/.t32.png"
fi
ls "$OUT"/*.png 2>/dev/null | sed "s|$OUT/||" | tr '\n' ' '; echo
