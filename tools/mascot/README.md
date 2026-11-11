# The mascots

ModelLab's assistant is one of six mascots: **Bloom** (the default), a fluffy white cub with real fur, modelled on a
photo of a plush; four plush ones, **Dr. Mochi**, **Bop**, **Twinkle** and **Pip**; and **Rime**, a quiet snow golem.
You pick one in the assistant's settings. Its look and name then follow everywhere, and Claude speaks as it, in its
own voice (`MASCOTS` in `modellab/hub/yeti.py`: Bloom and the plush ones are warm and light, Rime is calm and brief
and never gushes). Everything is drawn live in the browser from code: there are no images or 3D model files, except
the small still pictures described below. (The assistant's code is still named `yeti`, after the first mascot, which
Bloom replaced.)

| file | what's in it |
|---|---|
| `modellab/web/src/components/yeti/mascot/shaders.ts` | the GLSL: each mascot as a signed distance field; the plush, snow, fur and plastic shading; Rime's frost |
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
- **Loaded on demand.** three.js and the shaders are a separate chunk (about 140 KB gzipped), loaded the first time a
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
  by measuring its render against its swatch. No purple, pink or indigo (see `modellab/web/DESIGN.md`). Bloom is the
  exception: his colours are the photo's.

## Rime, the snow golem

Rime is the one mascot that isn't plush, and he isn't meant to look like the others. He's a tall, slender figure of
packed snow, about five heads tall, with long arms that hang to his knees, long thin legs and a slight stoop. His face
is a smooth, blank egg with two tiny dark pebbles for eyes, set far apart, and only a faint line pressed in for a
mouth. His expression never changes (`stoic` in his spec): no smile, no blinking, no closed eyes. His head turns on
its own (`head`: the `uHead` uniform turns it about his neck) to watch the pointer, nods when he's pleased, tilts while
he thinks and bows when he sleeps; the body barely moves (`motion`), and he waves slowly with a bent elbow. He has no
cartoon props (`props: false`). Below 48 px he's framed head and shoulders (`portrait`), so his face still reads.
His GLSL starts with `#define SNOW`, which switches `RENDER` to the snow shading and the frost; the other mascots never
compile any of it.

- **Snow.** Light goes a long way into snow before it comes back out, so the shadow line is very soft (a wide wrap),
  and the light that wrapped furthest comes back blue, since ice absorbs a little red over a long path. Shadows and
  creases fill with the sky's cool light. Thin parts like the arms glow when the rim light is behind them, after
  Barré-Brisebois & Bouchard's fast translucency (GDC 2011), with the thickness read from the distance field.
- **Real snow, not plush.** More contrast than the plush studio look, as snow has in daylight: near-white where
  the key light falls, blue-grey in shadow. No fuzzy edge: snow's outline is crisp.
- **Grain.** Three levels, each drawn only where it's bigger than a pixel: shallow scoops where the snow was pressed
  together, then grains, then finer grains standing up (soft bumps round jittered points of cell grids, Worley 1996),
  with bluer gaps and the odd tiny hole. Single grains flash like tiny mirrors when they reflect the key light or the
  bright sky into the eye; their seeds sit on a jittered 3D grid, as in Wang & Bowles' sparkle effect (EGSR 2016).
- **Shape.** Soft lumps of hand-packed snow everywhere but his face, made from sines. The 3D noise texture is
  filtered in 8 bits, which shows as terraces when it shapes a surface; it's fine for colour. The joints are blended
  only a little, because a wide blend swells them like knuckles.
- **Frost.** Diamond dust: 28 tiny ice crystals drift round him, slowly falling and turning. Most of the time a
  crystal is a faint speck; when it turns to mirror the light it flashes, with a small four-point flare like a camera
  sees. They're drawn in the same shader, hidden where they're behind him, and one smaller than a pixel keeps its
  true brightness instead of swelling. The frost drifts faster while he thinks, slower while he sleeps, and puffs
  out when he nods. It's deeper blue on a light page and pale on a dark one, and it stops with "reduce motion".

## Bloom, the furry cub

Bloom is a round, fluffy white cub with furry sky-blue ears and a tuft of the same long blue fur. He's the one mascot modelled on a
real object, a photo of a plush, and the one with a real pile. His GLSL starts with `#define FUR`, which switches
`RENDER` to the fur; the other mascots never compile any of it.

- **Measured from the photo.** The plush was cut out of the picture, and a camera and a shape (a superellipse of
  revolution with a flat base) were fitted together to its outline and to the centres of the eyes and the mouth, by
  least squares. The outline agrees to about 8 px in the 2000 px photo and the face to about 1 px. The eyes, mouth and
  blush were then taken from the picture back onto that surface, which gives their true size and place, and the ears
  were placed by fitting discs to their blue fronts.
  - His face is laid out on the body's surface (distance round the body, and height), not flat across the picture as
    the other faces are. So `eye.x` and the blush's x in his spec are distances round the body.
  - The eyes lean outward at the top by about 10°, as they do on the plush.
  - One photo can't tell how far the camera looked down from how low the face sits. The best fit has the camera
    looking down 8°, which is also the app's camera, so in the app he sits as he does in the photo.
- **Colours.** Sampled from the photo part by part (fur in light and in shade, ears, tuft, blush, thread) and checked
  by rendering him with the photo's own camera and comparing the same regions. The photo is exposed so that its white
  fur is a light grey-blue. In the app he sits on a white page, so all the colours are brightened together (×1.37 in
  linear light) until the fur is white. The cool blue the fur takes in its own shade is the photo's too.
- **Fur.** The pile is drawn as a volume of fibres standing off the fabric (Kajiya & Kay 1989), not as a shaded
  surface:
  - A ray is marched to the pile and then through it, a fibre's width at a time. Each fibre it meets covers part of
    the pixel, front to back, until the pixel is covered or the fabric is reached. That gives the soft outline, the
    depth between locks and the fibres over the embroidery's edge without drawing any of them specially.
  - A fibre is a cell of the 3D noise, read at the fibre's root, so the pattern runs along the fibre however it
    leans. It's there where the noise is above a level that rises toward the tip, so fibres taper and differ in
    length. Fibres lean together in locks; a few single ones stand clear of them.
  - Where fibres are smaller than a pixel, the share of the noise above that level is used instead (worked out from
    the noise's measured spread). Small and large views then have the same amount of fur, and nothing shimmers.
  - Direct light thins out with depth in the pile, faster when it comes in low. What the pile stops comes back
    scattered and deeper in colour. Each fibre is lit as a thin cylinder, with a silky highlight, and pale tips glow
    when lit from behind.
  - The studio's shadow is worked out once per pixel, where the fur's surface is, and is never black: fur lets light
    through. The fur casts shadows too, from half-way up the pile.
- **Two furs.** The body's is long and white and lies down, combed away from the crown. The tuft is long, straight
  blue fibres fanning out of a small core on the crown, lying over the head's own fur; its locks differ a lot in
  length, so its outline is ragged. The ears are blue all over, in the tuft's fur cut shorter. (On the plush the ears
  are short nubby pile with a white back; these were asked for instead.)
- **Embroidery.** No pile grows on the stitches, and the pile round them is pulled down, so it lies in a hollow, in the
  shade of the taller fur. The eyes are satin stitch: rows that zigzag, with a border sewn round the edge. The thread
  is a soft black, sampled from the photo. A stitch thinner than a pixel covers only its share of that pixel, so in a
  small view the mouth is a faint line and doesn't run into the eyes.
- **Cost.** A pixel takes about 12 march steps in the corner button and about 20 at 176 px, with two or three fibre
  shadings: about what the plush mascots take. Software rendering (no GPU) is slower with fur than with plush.
- **Motion.** His ears twitch now and then and the tuft sways. He has no arms, so he wiggles hello.

## Changing a mascot or adding one

1. **Shape.** Write its `skinM` (plush) and `solid` (plastic parts) in `shaders.ts`, following an existing one. Place
   accessories with a numeric solve against the same shape: `MOCHI`'s glasses and buttons were placed that way. For
   a different material, add a switch like `#define SNOW` rather than changing the plush. A mascot with fur defines
   `FUR`, `furM` (the distance to the fabric and the pile at a point) and `pileD` (for shadows), as `BLOOM` does; the
   fur path draws no plastic parts yet.
2. **Spec.** Add it to `SPECS` in `engine.ts`: box, camera, face, colours and exposure.
3. **Lists.** Add it to `MASCOT_LIST` in `mascots.ts` and to `MASCOTS` in `modellab/hub/yeti.py` (its name, what it
   looks like, and how it talks).
4. **Still picture.** Make a 176 px still with a transparent background: screenshot the live mascot (headless
   Chromium works) and save it as WebP in `components/yeti/stills/`.
5. **Consent-page picture.** The OAuth consent page's picture, `modellab/hub/yeti.webp` (160 px), is a still of Bloom
   made the same way.
