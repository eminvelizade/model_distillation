# The mascots

ModelLab's assistant is one of six mascots: five plush ones, **Yeti** (the default), **Dr. Mochi**, **Bop**,
**Twinkle** and **Pip**, and **Rime**, a quiet snow golem. You pick one in the assistant's settings. Its look and name
then follow everywhere, and Claude speaks as it, in its own voice (`MASCOTS` in `modellab/hub/yeti.py`: the plush ones
are warm and light, Rime is calm and brief and never gushes). Everything is drawn live in the browser from code: there
are no images or 3D model files, except the small still pictures described below.

| file | what's in it |
|---|---|
| `modellab/web/src/components/yeti/mascot/shaders.ts` | the GLSL: each mascot as a signed distance field; the plush, snow and plastic shading; Rime's frost |
| `modellab/web/src/components/yeti/mascot/engine.ts` | shapes, faces, palette colours, poses and motion; the shared renderer |
| `modellab/web/src/components/yeti/mascots.ts` | names, taglines, still pictures, the chosen mascot (saved in the browser) |
| `modellab/web/src/components/yeti/Yeti.tsx` | the React component: `<Yeti size pose kind?>` |

## How it's drawn

- **One renderer.** A page can show many mascots at once (the corner button, the chat header, an avatar on each
  answer, an Explain pill next to each result), but browsers allow only about 16 WebGL contexts. So there is one
  three.js renderer. Each mascot is a `View` with its own scene and a plain 2D canvas. The renderer draws a View, then
  copies the picture onto the View's canvas.
- **One loop.** It runs only the Views that are on screen, each at its own frame rate (15 fps for small ones,
  30 fps for the rest). It stops when none are visible or the tab is hidden. If frames come slowly, every mascot is
  drawn with fewer pixels. With "reduce motion" on, each change draws one still frame.
- **Loaded on demand.** three.js and the shaders are a separate chunk (about 130 KB gzipped), loaded the first time a
  mascot appears. Until then, and where WebGL 2 isn't available, the component shows a still picture
  (`components/yeti/stills/*.webp`).

## The look

- **Ray-marched SDFs.** Each mascot is a signed distance field, ray-marched in one fragment shader inside a box
  around it.
- **Plush, shaded like velvet in film and product renderers:**
  - dyed fibres underneath, with a fuzz layer on top (OpenPBR's fuzz layer, built on Estevez & Kulla's "Charlie"
    sheen);
  - light that wraps softly past the shadow line (Green, GPU Gems);
  - fuzzy outlines from rays that pass just short of the fabric;
  - fabric texture drawn only where it's bigger than a pixel.
- **Embroidered faces.** Mouths, noses and closed eyes are satin thread.
- **Glossy plastic.** Safety eyes, glasses, headphones and beak.
- **Soft studio light:**
  - a big softbox that casts soft shadows (Quilez's penumbra);
  - ambient occlusion from the distance field;
  - a fill, a rim light and a white sky dome;
  - Khronos PBR Neutral tone mapping.
- **Palette colours.** They come from ModelLab's ice scale and the Tailwind palette, and each mascot's exposure was set
  by measuring its render against its swatch. No purple, pink or indigo (see `modellab/web/DESIGN.md`).

## Rime, the snow golem

Rime is the one mascot that isn't plush. He's packed snow with a crown of twigs round his face, two glossy pebble
eyes and a small wavy mouth, and he never smiles: his eyes don't change when he waves or hops (`stoic` in his spec),
and he waves slowly, out to the side. His GLSL starts with `#define SNOW`, which switches `RENDER` to the snow shading
and the frost; the other mascots never compile any of it.

- **Snow.** Light goes a long way into snow before it comes back out, so the shadow line is very soft (a wide wrap),
  and the light that wrapped furthest comes back blue, since ice absorbs a little red over a long path. Shadows and
  creases fill with the sky's cool light. Thin parts like the arms glow when the rim light is behind them, after
  Barré-Brisebois & Bouchard's fast translucency (GDC 2011), with the thickness read from the distance field.
- **Grain.** The surface is clumps of grains: a soft bump round each jittered point of a cell grid (Worley 1996),
  with bluer gaps between them. Single grains flash like tiny mirrors when they reflect the key light or the bright
  sky into the eye, with a small cross of flare. Their seeds sit on a jittered 3D grid, as in Wang & Bowles' sparkle
  effect (EGSR 2016). Grain and glints fade out where they'd be smaller than a couple of pixels, so nothing shimmers.
  The lit snow sits a little under pure white so the flashes can show.
- **Shape.** Soft lumps of packed snow everywhere but his face, made from sines. The 3D noise texture is filtered
  in 8 bits, which shows as terraces when it shapes a surface; it's fine for colour.
- **The crown.** Four twigs wind round it at different rates, with ends and forks sticking out, frost on their
  upper sides and a green sprout. Its shadow on his face comes from a smooth ring as thick as the twigs, because the
  soft shadow needs an exact distance: a cheap bound there makes banding.
- **Frost.** 28 ice crystals drift round him, slowly falling and turning, each twinkling now and then. They're drawn
  in the same shader, hidden where they're behind him. A crystal is a tiny six-pointed star when it's big enough to
  see; smaller, it's a soft dot with its brightness scaled to its true size. The frost drifts faster while he thinks,
  slower while he sleeps, and puffs out when he hops. It's deeper blue on a light page and pale on a dark one, and
  it stops with "reduce motion".

## Changing a mascot or adding one

1. **Shape.** Write its `skinM` (plush) and `solid` (plastic parts) in `shaders.ts`, following an existing one. Place
   accessories with a numeric solve against the same shape: `MOCHI`'s glasses and buttons were placed that way. For
   a different material, add a switch like `#define SNOW` rather than changing the plush.
2. **Spec.** Add it to `SPECS` in `engine.ts`: box, camera, face, colours and exposure.
3. **Lists.** Add it to `MASCOT_LIST` in `mascots.ts` and to `MASCOTS` in `modellab/hub/yeti.py` (its name, what it
   looks like, and how it talks).
4. **Still picture.** Make a 176 px still with a transparent background: screenshot the live mascot (headless
   Chromium works) and save it as WebP in `components/yeti/stills/`.
5. **Consent-page picture.** The OAuth consent page's picture, `modellab/hub/yeti.webp` (160 px), is a still of Yeti
   made the same way.
