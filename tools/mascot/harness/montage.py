import sys
from PIL import Image
out = sys.argv[1]; files = sys.argv[2:]
ims = [Image.open(f).convert("RGBA") for f in files]
h = max(i.height for i in ims)
W = sum(i.width for i in ims)
m = Image.new("RGBA", (W, h), (245, 245, 247, 255))
x = 0
for i in ims:
    m.alpha_composite(i, (x, 0)); x += i.width
m.convert("RGB").save(out); print(out, m.size, [i.size for i in ims])
