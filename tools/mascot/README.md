# The mascots

ModelLab's assistant is one of five plush mascots: **Yeti** (the default), **Dr. Mochi**, **Bop**, **Twinkle** and
**Pip**. You pick one in the assistant's settings. Its look and name then follow everywhere, and Claude speaks as it
(`MASCOTS` in `modellab/hub/yeti.py`). Everything is drawn live in the browser from code: there are no images or 3D
model files, except the small still pictures described below.

| file | what's in it |
|---|---|
| `modellab/web/src/components/yeti/mascot/shaders.ts` | the GLSL: each mascot as a signed distance field, the plush and plastic shading |
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

## Changing a mascot or adding one

1. **Shape.** Write its `skinM` (plush) and `solid` (plastic parts) in `shaders.ts`, following an existing one. Place
   accessories with a numeric solve against the same shape: `MOCHI`'s glasses and buttons were placed that way.
2. **Spec.** Add it to `SPECS` in `engine.ts`: box, camera, face, colours and exposure.
3. **Lists.** Add it to `MASCOT_LIST` in `mascots.ts` and to `MASCOTS` in `modellab/hub/yeti.py`.
4. **Still picture.** Make a 176 px still with a transparent background: screenshot the live mascot (headless
   Chromium works) and save it as WebP in `components/yeti/stills/`.
5. **Consent-page picture.** The OAuth consent page's picture, `modellab/hub/yeti.webp` (160 px), is a still of Yeti
   made the same way.
