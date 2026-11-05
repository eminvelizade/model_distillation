# Yeti's art

Yeti is a puppet made from one picture of the plush. The picture is cut into layers that share one square canvas,
and CSS moves them (`modellab/web/src/index.css`, `.yeti-*`):

| layer | from | moves |
|---|---|---|
| `body.webp` | the plush, eyes patched out with its own fur | breathes; hops (happy); tilts on hover; sways (thinking) |
| `eye-l.webp`, `eye-r.webp` | the embroidered eyes | blink; look up (thinking); close (sleep); hidden for the smile (wave, happy) |
| `tuft.webp` | a copy of the tuft | stretches up and springs back (wave, happy) |
| `arm.webp` | a stubby arm made from the plush's fur | tucked behind the body; rises and waves (wave) |

The smile arcs, the snowflake and the "z"s are small SVGs in `components/yeti/Yeti.tsx`.

## Rebuild from a new picture

```bash
pip install onnxruntime pymatting opencv-python-headless pillow numpy   # dev tools, not part of the app
curl -L -o birefnet.onnx https://huggingface.co/onnx-community/BiRefNet-ONNX/resolve/main/onnx/model.onnx   # ~1 GB
python tools/mascot/matte.py mascot.jpg out/plush --model birefnet.onnx   # transparent cut-out, clean fur edges
python tools/mascot/layers.py out/plush_rgba.png out/L                    # the layers + their positions (L_layers.json)
python tools/mascot/export.py out/L                                       # WebP files for the app
cd modellab/web && npm run build
```

If the eyes, the tuft's base or the arm's shoulder move (another picture), copy the new positions from
`L_layers.json` into the `transform-origin` values in `index.css`.

## Richer motion with an image or video model

The puppet covers blinking, looking up, smiling and small whole-body motion well. Two things look better
generated:

- **The wave:** a real arm, instead of one made from fur.
- **Big gestures:** a hop, a full-body wave, a sleepy nod.

Rules for every generation, so that frames line up with the puppet:

- Give the model the original picture as the reference image, and ask for **the same plush, same camera, same size
  and position in the frame, front view**.
- Use a **plain solid mid-grey background** (`#8c8c8c`), with no floor, shadow or gradient. White fur and blue ears
  both cut out cleanly from grey; avoid white or blue backgrounds.
- **Square**, at least 1024 × 1024. Change one thing per image.

### Stills (image model)

| want | prompt (with the original attached) |
|---|---|
| the waving arm (replaces `arm.webp`) | "The exact same plush toy, same camera, framing and size, front view. It raises one short, stubby, fluffy arm on the viewer's right side beside its face, waving hello. Nothing else changes. Plain solid mid-grey #8c8c8c background, no shadow, no floor." |
| the arm at rest (for the difference) | the same prompt with "its arms are tucked away, not visible" |
| a happy face (optional) | "...its eyes closed in two happy upward arcs, a tiny smile. Nothing else changes..." |

From the waving still, the arm is cut out as the difference to the neutral picture and becomes `arm.webp`.

### Clips (video model)

Image-to-video from the original picture. **Start and end on that exact frame** (use first- and last-frame
conditioning if the model has it). That way a clip can take over from the puppet and hand back without a jump.

Every clip:
- static camera, plain mid-grey background, square;
- 24–30 fps, 1–3 seconds;
- no zoom, no new objects.

| clip | prompt |
|---|---|
| `wave` (once) | "The plush raises a short stubby arm on the viewer's right, waves twice, then lowers it and returns exactly to its starting pose. Static camera, plain grey background." |
| `hop` (once) | "The plush hops once happily, lands softly with a squish, and settles back exactly into its starting pose." |
| `think` (loop) | "The plush slowly tilts its head side to side, looking up thoughtfully. Seamless loop: the last frame matches the first." |
| `sleep` (loop) | "The plush dozes with its eyes closed, gently bobbing. Seamless loop." |
| `idle` (loop) | "The plush breathes gently, its fur stirring slightly, and blinks once. Seamless loop." |

Each clip then becomes a transparent animated WebP, about 100–300 KB at 256 px:

```bash
ffmpeg -i wave.mp4 -vf fps=20 frames/%04d.png
python tools/mascot/matte.py frames/ out/wave --model birefnet.onnx
```

After that, the frames go into a 256 px animated WebP that plays once or loops. The Yeti component plays the clip
for its pose and falls back to the puppet everywhere else. Clips don't replace the layers: blinking and expressions
stay with the puppet, because they need to react instantly.
