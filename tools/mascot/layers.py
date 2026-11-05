"""Split the matted mascot (tools/mascot/matte.py) into animation layers on one square canvas:

  body           the plush with its eyes patched out with real fur (taken from just above each eye)
  eye_l, eye_r   the embroidered eyes, difference-matted against the white fur (stitch texture kept)
  tuft           a copy of the blue tuft: it only ever stretches up from its base, so it always covers the original
  paw            a short stubby arm made from the plush's own fur, drawn pointing up from its shoulder (for waving)

    python tools/mascot/layers.py out/plush_rgba.png out/L     # -> out/L_body.png ... and out/L_layers.json

Tuned for this mascot (white fur, two dark embroidered eyes in the lower half of the face, a blue tuft on top). The
JSON holds the positions (fractions of the canvas) that modellab/web/src/index.css uses for the eyes, the tuft's base
and the arm's shoulder: update the CSS if they move. Then run tools/mascot/export.py.
"""
import json
import sys

import cv2
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
rgba = np.asarray(Image.open(src).convert("RGBA")).astype(np.float32)
H0, W0 = rgba.shape[:2]
alpha0 = rgba[..., 3] / 255
ys, xs = np.where(alpha0 > 0.03)
bx0, bx1, by1 = xs.min(), xs.max(), ys.max()

# ---------------------------------------------------------------- canvas: square, plush centred, room above and below
S = 1100
ox = int(round(S / 2 - (bx0 + bx1) / 2))
oy = int(round(1030 - by1))
canvas = np.zeros((S, S, 4), np.float32)
sx0, sy0, dx0, dy0 = max(0, -ox), max(0, -oy), max(0, ox), max(0, oy)
w, h = min(W0 - sx0, S - dx0), min(H0 - sy0, S - dy0)
canvas[dy0:dy0 + h, dx0:dx0 + w] = rgba[sy0:sy0 + h, sx0:sx0 + w]
A = canvas[..., 3] / 255
RGB = canvas[..., :3]
L = RGB @ np.array([0.299, 0.587, 0.114], np.float32)
hsv = cv2.cvtColor(np.clip(RGB, 0, 255).astype(np.uint8), cv2.COLOR_RGB2HSV).astype(np.float32)
ys, xs = np.where(A > 0.03)
top, bottom, left, right = ys.min(), ys.max(), xs.min(), xs.max()
BW, BH = right - left, bottom - top
info = {"canvas": S, "body": {"top": top / S, "bottom": bottom / S, "left": left / S, "right": right / S}}
rng = np.random.default_rng(7)
body = canvas.copy()

# ---------------------------------------------------------------- eyes
dark = ((L < 95) & (A > 0.9)).astype(np.uint8)
band = np.zeros_like(dark)
band[int(top + 0.55 * BH):int(top + 0.8 * BH), :] = 1
n, lab, stats, cents = cv2.connectedComponentsWithStats(dark * band, 8)
eyes = sorted(sorted(range(1, n), key=lambda i: -stats[i, cv2.CC_STAT_AREA])[:2], key=lambda i: cents[i][0])
fur = float(np.median(L[(A > 0.98) & (L > 200)]))
eye_px = np.isin(lab, eyes)
eye_color = np.median(RGB[eye_px], axis=0)
eye_dark = float(np.percentile(L[eye_px], 20))
info["eye_color"] = "#%02x%02x%02x" % tuple(int(v) for v in eye_color)
for name, i in zip(("eye_l", "eye_r"), eyes):
    x, y, w_, h_ = stats[i, :4]
    pad = 16
    x0, y0, x1, y1 = x - pad, y - pad, x + w_ + pad, y + h_ + pad
    pl = L[y0:y1, x0:x1]
    a = np.clip((fur - 12 - pl) / (fur - 12 - eye_dark), 0, 1)  # stitches opaque, white fur clear
    a = cv2.GaussianBlur(a, (0, 0), 0.6)
    tex = np.clip(pl / max(1.0, eye_dark), 0.7, 1.5)[..., None]
    layer = np.zeros((S, S, 4), np.float32)
    layer[y0:y1, x0:x1, :3] = np.clip(eye_color[None, None, :] * tex, 0, 255)
    layer[y0:y1, x0:x1, 3] = a * 255
    Image.fromarray(layer.astype(np.uint8), "RGBA").save(f"{out}_{name}.png")
    info[name] = {"cx": (x + w_ / 2) / S, "cy": (y + h_ / 2) / S, "w": w_ / S, "h": h_ / S}
    # patch the eye out of the body with fur from just above it: a soft mask that fades to zero well inside a larger
    # window (no visible edges), the donor gain-matched to the ring of fur around the eye
    P = 50
    X0, Y0, X1, Y1 = x - P, y - P, x + w_ + P, y + h_ + P
    big = np.zeros((Y1 - Y0, X1 - X0), np.float32)
    big[y0 - Y0:y1 - Y0, x0 - X0:x1 - X0] = (a > 0.02).astype(np.float32)
    big = cv2.dilate(big, np.ones((21, 21), np.uint8))
    m = cv2.GaussianBlur(big, (0, 0), 5.0)
    m = np.clip(m * 1.6, 0, 1)
    dy = int((y1 - y0) * 1.1)
    donor = RGB[Y0 - dy:Y1 - dy, X0:X1].copy()
    ring = (m > 0.02) & (m < 0.3)
    target = RGB[Y0:Y1, X0:X1][ring].mean(axis=0)
    donor *= target / np.maximum(donor[ring].mean(axis=0), 1)
    body[Y0:Y1, X0:X1, :3] = body[Y0:Y1, X0:X1, :3] * (1 - m[..., None]) + np.clip(donor, 0, 255) * m[..., None]
Image.fromarray(np.clip(body, 0, 255).astype(np.uint8), "RGBA").save(f"{out}_body.png")

# ---------------------------------------------------------------- tuft: blue hair on top (copy; stretches up only)
blue = (hsv[..., 0] > 80) & (hsv[..., 0] < 118) & (hsv[..., 1] > 28) & (A > 0.04)
zone = np.zeros_like(blue)
zone[: int(top + 0.36 * BH), int(left + 0.26 * BW):int(left + 0.74 * BW)] = True
core = cv2.morphologyEx((blue & zone).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((17, 17), np.uint8))
n, lab_t, st_t, _ = cv2.connectedComponentsWithStats(core, 8)
k = 1 + int(np.argmax(st_t[1:, cv2.CC_STAT_AREA]))
core = (lab_t == k).astype(np.uint8)
tx, ty, tw, th = st_t[k, :4]
grown = cv2.dilate(core, np.ones((25, 25), np.uint8))
tmask = cv2.GaussianBlur((grown & (blue | (A < 0.6))).astype(np.float32), (0, 0), 1.6)
tuft = canvas.copy()
tuft[..., 3] = canvas[..., 3] * np.clip(tmask * 1.2, 0, 1)
Image.fromarray(tuft.astype(np.uint8), "RGBA").save(f"{out}_tuft.png")
base_y = int(ty + th * 0.88)
info["tuft"] = {"pivot_x": (tx + tw / 2) / S, "pivot_y": base_y / S, "top": ty / S}

# ---------------------------------------------------------------- arm: a short stubby arm, drawn pointing straight up
# from its base (inside the body's right side); the CSS rotates it about that base: tucked away, or raised to wave.
r = 0.062 * BW  # half width
length = 0.2 * BW  # base to the centre of the rounded tip
bxp, byp = right - 0.075 * BW, top + 0.6 * BH  # the shoulder, just inside the silhouette
yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
u = xx - bxp  # across the arm
v = byp - yy  # along the arm (up)
seg = np.clip(v, 0, length)
dist = np.sqrt(u ** 2 + ((v - seg) * 1.0) ** 2) / r  # capsule: distance to the segment, in units of r
theta = np.arctan2(v - seg, u)
tips = np.zeros_like(theta)
for f, amp in ((19, 0.035), (37, 0.03), (61, 0.025), (89, 0.02)):
    tips += amp * np.sin(f * theta + rng.uniform(0, 6.28))
strands = cv2.GaussianBlur(rng.normal(0, 1, dist.shape).astype(np.float32), (0, 0), 0.7)
arm_a = np.clip((1 + tips + 0.05 * strands - dist) / 0.09, 0, 1) * (v > -r * 0.8)
# fur texture from the forehead, tiled along the arm; light from the top left, cool shade on the right and underside
cxp, cyp = int(left + 0.5 * BW), int(top + 0.4 * BH)
patch = RGB[cyp - 90:cyp + 90, cxp - 90:cxp + 90]
tile = np.tile(patch, (S // 180 + 1, S // 180 + 1, 1))[:S, :S]
across = np.clip(u / r, -1.2, 1.2)
shade = 1.05 - 0.12 * np.clip(across * 0.8 + 0.2, -1, 1.2) - 0.05 * np.clip(1 - v / length, 0, 1)
cool = np.clip(across - 0.2, 0, 1)[..., None] * np.array([-12, -5, 6], np.float32)
arm_rgb = np.clip(tile * shade[..., None] + cool, 0, 255)
arm = np.zeros((S, S, 4), np.float32)
arm[..., :3] = arm_rgb
arm[..., 3] = arm_a * 255
Image.fromarray(np.clip(arm, 0, 255).astype(np.uint8), "RGBA").save(f"{out}_paw.png")
info["paw"] = {"base_x": bxp / S, "base_y": byp / S, "r": r / S, "length": length / S}
json.dump(info, open(f"{out}_layers.json", "w"), indent=1)
print(json.dumps(info))
