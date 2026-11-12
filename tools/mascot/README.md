# The mascots

Each of ModelLab's agents has a mascot. It is either a classic one or one the user put together:

- **Classic:** **Bloom** (everyone's first agent), a fluffy white cub with real fur, modelled on a photo of a
  plush; four plush ones, **Dr. Mochi**, **Bop**, **Twinkle** and **Pip**; and **Rime**, a quiet snow golem.
- **Make your own:** a shape (pom, bean, drop, gumdrop, cub, frog, tofu, kitten) in one of twelve colours, with
  eyes (bean, round, bead, googly, sparkle, smile), glasses (round, shades) and an extra (headphones, beanie,
  sprout, antenna, scarf, cap, tuft). See [Make your own](#make-your-own) below.

The look is chosen in the agent editor (Chat → the pencil) and kept on the hub with the agent. Claude speaks as the
agent, in its voice (`MASCOTS` in `modellab/hub/yeti.py` for the classic ones: warm and light, except Rime, who is
calm and brief; `look_words` in `modellab/hub/agents.py` describes a make-your-own one). Everything is drawn live
in the browser from code: there are no images or 3D model files, except the small still pictures described below.
(The code is still named `yeti`, after the first mascot, which Bloom replaced.)

| file | what's in it |
|---|---|
| `modellab/web/src/components/yeti/mascot/shaders.ts` | the GLSL: each mascot as a signed distance field; the plush, snow, fur and plastic shading; Rime's frost |
| `modellab/web/src/components/yeti/mascot/engine.ts` | shapes, faces, palette colours, poses and motion; the shared renderer |
| `modellab/web/src/components/yeti/mascot/looks.ts` | make-your-own mascots: a look becomes lists of parts, each placed on the body |
| `modellab/web/src/components/yeti/mascots.ts` | names, taglines, still pictures, the make-your-own options and colours, the agent on screen |
| `modellab/web/src/components/yeti/Yeti.tsx` | the React component: `<Yeti size pose look? kind?>` |
| `modellab/web/src/components/yeti/AgentEditor.tsx` | the editor, with the live preview |

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

## Make your own

The make-your-own mascots are short, soft and bright: a body of short curly pile in a pure dye, glossy black eyes,
no mouth, and at most a pair of glasses and one extra. The material is the one OpenAI's dots made familiar (their
press image was the reference for it, and only for it: the characters here are our own, and none of OpenAI's images
are in this repository).

- **The material.** A short plush pile lies in small patches, each combed its own way, a few strands side by
  side. It is drawn with Bloom's fur renderer (`FUR`), with a pile of 0.05 units instead of Bloom's long one:
  - a patch is a cell of a wobbly grid on the fabric, with its own direction;
  - inside a patch the strands are the fibre noise stretched 6.5 times along that direction, bending a little;
  - the strands are of even thickness and end together (a sheared pile), with no stray single fibres;
  - more light gets down into a short, open pile, and what comes back is the dye's own colour, deeper: nothing is
    mixed with white, so a saturated dye stays saturated.
  Measured against the reference's green: its shade, middle and light tones are #95c22c, #afda47 and #cff274; ours
  are #81b31e, #a9dd47 and #c8f17f. Where strands are smaller than a pixel (most sizes in the app) their average is
  drawn, so small views are clean colour with a soft outline.
- **Parts, not shapes.** The other mascots are each written out as a distance function. This one is two lists the
  engine fills in (`FUZZY` in `shaders.ts`): fur parts (the body, a hat, a scarf) and solid parts (eyes, glasses,
  headphones). A part is an ellipsoid, a round cone, a rounded box, a ring, a disc or an arc.
- **Placed by solving.** `looks.ts` has the same distance functions in TypeScript and marches them to find the
  body's surface: where the front is at the eyes' height, how far out the side is, where the top is. Eyes are set
  into the pile there, glasses sit just in front of it with arms that run round the head, headphones span from side
  to side over the top. So every shape takes every pair of eyes, glasses and extra with no table of positions.
- **Hats and scarves are a layer over the body itself** (a part of type 6): the first fur part's own surface,
  thickened between two heights, in knit. A beanie therefore fits a cube of tofu as well as a ball.
- **Solid parts in fur.** The fur path used to draw no solid parts. It now marches them together: a ray that meets
  a glossy eye behind a few fibres draws the eye under those fibres, so the pile closes over an eye's edge.
- **Eyes move.** They are parts too, rebuilt each frame: they blink, turn to stitched arcs for a smile (∩) or for
  sleep (∪), and a googly eye's pupil follows the pointer.
- **Colours.** Twelve dyes (`COLOURS` in `mascots.ts`): the ice blues first, then teal, mint, lime, sun,
  tangerine, coral, cherry, cobalt, snow and ink. No purple or pink, as everywhere in ModelLab.
- **To add a shape, an extra or a colour:** add its parts to `BODIES` or to the extras in `looks.ts`, its name to
  `LOOK_OPTIONS` (and a dye to `COLOURS`) in `mascots.ts`, and the same key to `SHAPES`, `EXTRAS` or `COLOURS` in
  `modellab/hub/agents.py`, which checks a look and describes it to Claude.

## Changing a mascot or adding one

1. **Shape.** Write its `skinM` (plush) and `solid` (plastic parts) in `shaders.ts`, following an existing one. Place
   accessories with a numeric solve against the same shape: `MOCHI`'s glasses and buttons were placed that way. For
   a different material, add a switch like `#define SNOW` rather than changing the plush. A mascot with fur defines
   `FUR`, `furM` (the distance to the fabric and the pile at a point) and `pileD` (for shadows), as `BLOOM` does; solid
   parts in fur are drawn when `FUZZY` is defined too.
2. **Spec.** Add it to `SPECS` in `engine.ts`: box, camera, face, colours and exposure.
3. **Lists.** Add it to `MASCOT_LIST` in `mascots.ts` and to `MASCOTS` in `modellab/hub/yeti.py` (its name, what it
   looks like, and how it talks).
4. **Still picture.** Make a 176 px still with a transparent background: screenshot the live mascot (headless
   Chromium works) and save it as WebP in `components/yeti/stills/`.
5. **Consent-page picture.** The OAuth consent page's picture, `modellab/hub/yeti.webp` (160 px), is a still of Bloom
   made the same way.
