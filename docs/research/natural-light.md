# Natural light for a small soft toy on a plain page: research and a rig for this renderer

## Status of the numbers (read this first)

- **Rig E is the first researcher's**, and it is the only rig that has been rendered. Its constants are in
  section 4.13. It came from their `calc3.py` as first written; the file on disk is a later version, so that scan
  survives only in the transcript (lines 2295 to 2327). The orchestrator has since implemented it and reports, on
  the plush frog at 175 px: lit 0.65 to 0.66, median 0.55, shaded side 0.39, left to right 1.67 : 1, once the
  pile's own shading is multiplied by 1.5. Those are the reference's ratios (shade 0.59 to 0.60 of light, median
  0.83 to 0.85). The pictures were not seen for this report.
- **The rig in sections 4.1 to 4.11 is this report's**: rig E re-fitted with one consistent model
  (`scripts/calc4.py`, `calc5.py`, `calc6.py`, written for this report). It has **not** been rendered. It differs
  from rig E by less than the model's error. Where rig E is in the code, keep it (4.13).
- **Re-computed for this report:** every figure in 2.5, 3.7, 4.0 to 4.11 and the measurements of today's renders.
- **The researcher's, re-run here and reproduced:** the kelvin table, the tone-curve comparison, the lamp fit and
  the overcast sky (`calc1.py`); the reference's light grids, the multi-bounce table and the `k` table
  (`calc3.py`).
- **The researcher's, from the transcript only:** the reference's tone percentiles (`measure.py`), their floor
  Monte Carlo for an earlier key (`calc2.py`), and what each web source returned.
- **One prediction below is contradicted by the render:** that the pile stays flat under the new rig unless its
  wrap is narrowed (4.4, and item 4 of the summary). See 4.13.

**What this is.** The report of a researcher who was cut off before writing it, finished from what survived: the
transcript of everything they did (read in full), their four scripts (re-run), the source files they saved, and the
measured target in `research2/dots/parts/02.md`. Three further calculations were added here (`scripts/calc4.py`,
`calc5.py`, `calc6.py`, beside the researcher's): they measure today's renders and evaluate the proposed rig the way
the GLSL would. Every number in section 4 comes from those three, not from the researcher's earlier fits, which mixed
two floor models.

**What it is not.** Nothing in the repository was edited, so the proposed rig has not been rendered. Predicted
ratios come from a matte ball lit by the rig's formulas; section 4.0 says how far that model was off when it was
asked to predict today's renders. Costs are estimates from counting operations, not timings.

**Left and right.** The reference's key comes from the upper right. This renderer's key, its floor shadow and the
researcher's fits are all on the upper left, and the rig below keeps it there. A ball's statistics are the same
either way. To put the key on the reference's side, negate x in `KEY`, `FILL` and `BACK`: nothing else changes.

## 1. Summary

In order of how much each would improve the picture:

1. **Today's light is flat from side to side and dark underneath. Turn it round.** Measured on today's 560 px
   renders, the upper body's left and right sides differ by 0.97 to 1.04 (the 0.32 fill and the 0.58 back lamp
   cancel the key), the shaded side sits at 0.74 to 0.82 of the lit side, and the only real contrast is a fall
   toward a dark base (top to base 2.5 to 3.0 : 1). On the dark theme a white plush ball spans 1.10 : 1 over its
   upper body: a flat white disc. The reference is modelled from side to side (1.4 to 1.6 : 1), its shade is 0.55
   to 0.60 of its lit side, and nothing is dark. A key 50 degrees to the side at 0.78, a sky of 0.36, a 0.10 fill
   and exposure 1.0 predict 1.38 to 1.62 : 1 side to side and shade at 0.58 of light. It is a change of constants
   in `engine.ts` and costs nothing.
2. **Take the lit side out of the tone curve's shoulder.** A matte point can receive 1.6 to 1.75 units today, times
   exposure 1.06. On the sky dye's blue channel the curve turns a 1.6 : 1 difference in light into 1.13 : 1 on
   screen. With the brightest matte point at 1.15 and exposure 1.0, a 2.1 : 1 difference in light comes out as
   2.03 : 1.
3. **Give the mascot a sky and a floor that behave like one.** An overcast sky is three times brighter overhead
   than at the horizon, and a pale floor returns light to the underside: by Monte Carlo the underside of a ball on
   a white floor receives 0.47 to 0.66 of the open floor's brightness, even inside its own shadow. Today both are
   one linear ramp from 0.21 to 0.42. Two lines in `skyIrr`.
4. **Treat every lamp as having a size, and use one number for it.** The key is a lamp of 40 degrees angular
   radius: `w = 0.643` in a closed-form irradiance that replaces `max(n.l, 0)` (within 0.01 of the exact integral),
   a panel of 0.66 x 0.56 radians for mirrors, a highlight a third of the eye's width, and softer shadows. Today the
   three disagree: the panel is 26 x 19 degrees, the matte lobe sees a point, and the shadows are those of an 11 to
   18 degree lamp. On the pile the same function replaces a linear wrap that lets 0.39 to 0.45 of the key round
   the shadow line; the lamp's size alone lets 0.16 round, lamp plus pile 0.24.
5. **The dark theme needs its own floor and rim.** Over a black page the model gives 3.2 : 1 in the upper body and
   6.5 : 1 overall. The reference holds 2.6 : 1 on black. A floor that is dark to the eye but returns 0.3 of its
   light, a 0.12 fill and a 0.80 cool rim give shade at 0.54 of light, median at 0.83 and 2.66 : 1 with grain:
   the reference's three numbers.
6. **Colour the occlusion.** Jimenez's multi-bounce fit puts back the light that bounces between facing surfaces of
   the dye's colour: at half occlusion the sky dye keeps (0.50, 0.71, 0.86) instead of 0.5 in every channel, so
   creases get deeper in colour, not greyer. Three multiplies per channel.
7. **A rim that reaches every outline.** The reference carries a pale halo on every outline, strongest on tops.
   A back lamp alone cannot do that. Put the back lamp on the side away from the key, make it the page's own glow
   on the light theme and a cool strip on the dark one, and hand the fuzz lobes the light on a surface turned 30
   degrees past the outline: 0.45 to 0.81 all round on the light theme, 0.33 to 1.20 on the dark one.
8. **Keep the tone curve, leave the camera out.** Khronos PBR Neutral is the only curve in three.js that keeps a
   dye's hue and saturation. Depth of field, vignette, grain and bloom all need a frame to act on, and a mascot is
   a cut-out on a page that has none.

## 2. The real thing

### 2.1 Sizes

One unit is 133 mm (a 200 mm toy is 1.5 units wide). In the 560 px render the body is 487 px wide; taking that as 1.5 units, a mascot
drawn S pixels tall has about 0.58 S pixels per unit.

| drawn at | pixels per unit | one CSS pixel | a 0.06 unit halo (8 mm) | a 0.16 unit penumbra (21 mm) |
|---|---|---|---|---|
| 28 px | 16 | 8.2 mm | 1 px | 2.6 px |
| 68 px | 39 | 3.4 mm (1.7 mm on a 2x screen) | 2.4 px | 6 px |
| 300 px | 174 | 0.77 mm | 10 px | 28 px |
| 400 px | 232 | 0.57 mm | 14 px | 37 px |
| the reference's frog | 117 | 1.1 mm | 7 px | 19 px |

At 28 and 68 px today's plush mascots read as flat coloured shapes with a darker foot (seen in
`renders/plush/small.png`): at those sizes the light is the whole material, and it is flat.

### 2.2 What lights a soft toy, and why it looks soft

- **A key.** A window or a softbox. What makes it soft is its angular size from the toy, not its power: a 90 cm
  softbox 55 cm away, or a window 1.7 m wide at 1 m, has an angular radius of 40 degrees. The sun's is 0.27 degrees.
- **A sky.** Everything else overhead: an overcast sky, or the room's ceiling and walls. Daylight is "direct
  sunlight, diffuse sky radiation, and (often) both of these reflected by Earth and terrestrial objects"
  (Wikipedia, Daylight): 111,000 to 120,000 lux in direct sun, 20,000 in open shade under a clear sky, 1,000 to
  2,000 under cloud. Direct sun against shade is about 6 : 1, far outside what the reference shows, which is
  why a toy looks natural by a window or under cloud and harsh in the sun.
- **A floor.** The surface it sits on returns its own colour times the light that falls on it. On white paper that
  is nearly as bright as the lit side of the toy, so undersides glow. On a dark table they sink.
- **Colour.** Daylight runs 5,500 to 6,500 K; "vertical daylight" 5,500 to 6,000 K; overcast 6,500 K; D75 is "north
  sky daylight"; clear blue sky 15,000 to 27,000 K (Wikipedia: Color temperature, Standard illuminant). So the
  natural pattern is a key slightly warmer than the display's white (D65) and a sky slightly cooler.
- **Bounce between the toy's own surfaces.** In a crease, each side lights the other with light of the dye's
  colour. That is why shade in a bright dye is saturated, and why white plush barely darkens in its folds.
- **The outline.** Fibres at the outline are seen side-on, lie one deep against the background, and are lit from
  the side and from behind. The reference's halo is that (02.md, section 2.4).

### 2.3 Soft light in numbers

For a round lamp of angular radius sigma (calc1.py section C, numeric integration; shadow widths are geometry):

| lamp | sigma | light left at the shadow line (n.l = 0), share of facing | light reaches to | penumbra under an edge 15 mm above the surface | the `k` of `softShadow` (1 / tan sigma) |
|---|---|---|---|---|---|
| the sun | 0.27 degrees | 0 | 90.3 degrees | 0.14 mm | 212 |
| today's bare shadows (k = 4 to 5) | 11 to 14 degrees | about 0.05 | 101 to 104 degrees | 6 to 7.5 mm (0.045 to 0.056 units) | 4 to 5 |
| today's pile shadow (k = 3) | 18 degrees | about 0.07 | 108 degrees | 10 mm (0.075 units) | 3 |
| a window 1 m wide at 1 m | 27 degrees | 0.10 | 117 degrees | 15 mm (0.11 units) | 2.0 |
| a 60 cm softbox at 45 cm | 34 degrees | 0.14 | 124 degrees | 20 mm (0.15 units) | 1.5 |
| **the proposed key** | **40 degrees** | **0.16** | **130 degrees** | **25 mm (0.19 units)** | **1.2** |
| an overcast sky | 90 degrees | 0.40 (0.50 if it were uniform) | 180 degrees | no edge | 0 |

The reference's shadow under the beret's brim reaches full value 0.08 to 0.17 units from the brim (02.md, 2.5):
a lamp of 20 to 37 degrees if the brim stands 15 mm clear.

A close lamp also falls off across the toy: with a softbox 55 cm from the toy's centre the near side is 45 cm away
and the far side 65 cm, a 2.1 : 1 difference in light; from a window at 1.5 m it is 1.3 : 1. The renderer's lamps are
infinitely far away and have none of this (section 5 says why it is left out).

### 2.4 The target, measured from the reference (02.md, sections 2.3 to 2.6)

- One large soft key from the upper right in front: one broad highlight in each pupil covering about a third of
  it, fading over 8 to 10 px. No second highlight. The surroundings mirrored in the eyes are dark.
- Tones against the lit body (green frog, which does not clip): median 0.83, shaded side 0.55 to 0.60, creases
  0.48, darkest 2 % at 0.45, brightest 2 % at 1.17, rim 1.21. The whole body is within 2.6 : 1 (98th to 2nd
  percentile, which includes 7 to 10 % of fibre grain) and 1.8 : 1 from the 90th to the 10th.
- Side to side: on the frog 0.45 to 0.69 and 0.45 to 0.64 across two rows (1.4 to 1.5 : 1), on the cloud 0.16 to
  0.26 (1.6 : 1); top to bottom of what is in frame about 1.4 : 1 (calc3.py's grid of the reference). The bodies
  are cut off at the bottom, so the reference says nothing about undersides.
- Shadows: half the open value 3 to 9 px from the beret's brim, 0.64 where the frog meets the cloud, 0.48 in the
  crease between the eye bumps. They keep their hue and gain saturation.
- A halo on every outline, the side away from the key included: twice the interior at 2 to 4 px, back to the
  interior over 15 to 20 px (an e-folding length of 0.06 units), strongest on tops. Its colour is the dye washed
  toward white: the channels the dye absorbs gain 0.15 to 0.33 linear. **All of this was measured on black.**
- The key is neutral (the white of the frog's eye is #f8f8f8 to #fafdff). Saturated dyes sit just under clipping
  in their strong channel (0.93 to 0.96 linear).

### 2.5 Today's renders, measured the same way (calc4.py)

The body's bounding box is the unit of position; "upper body" is everything above 0.3 of a radius below the
centre (the part the reference shows); the eyes are masked; lit is the mean of the 70th to 95th percentile band,
shade of the 5th to 15th.

| render (sky-blue ball unless said) | upper left / upper right | top / lower body | top / base | shade / lit, upper body | 98th / 2nd, upper body | 95th / 5th, whole body |
|---|---|---|---|---|---|---|
| clay, light page | 1.04 | 1.62 | 2.96 | 0.82 | 1.65 | 2.64 |
| cotton, light page | 0.97 | 1.93 | 2.99 | 0.74 | 2.12 | 2.99 |
| plush, light page | 1.00 | 1.44 | 2.51 | 0.82 | 1.38 | 2.42 |
| plush, dark page, white ball | 1.01 | 1.20 | 1.96 | 0.94 | 1.10 | 1.81 |
| cotton, dark page, white ball | 0.98 | 1.83 | 2.94 | 0.81 | 1.87 | 2.76 |
| **the reference** | **1.4 to 1.6** | about 1.4 (cut off) | not in frame | **0.55 to 0.60** | **2.6** | not comparable |

(The researcher's first measurement gave 3.2 to 3.8 : 1 for the whole body. It took wider percentile bands in a
box that included the eyes and the outline. The table above is the one to compare with later renders.)

Today's cast shadow, for scale: under the beanie's brim on the clay block (`renders/clay/shapes.png`, k = 4) the
face goes from 0.58 to 0.64 of its open value at the brim to full value 9 to 12 px lower, 4 to 6 % of the body's
width (taking the block as 205 px wide). The reference's beret shadow is also 3 to 6 % of its body's width. So today's shadows under a close brim
are already about the right width; what differs is everything else in the table.

### 2.6 What a camera would add at this scale

- **Depth of field.** A 200 mm toy fills a full-frame sensor at 0.1 magnification: a 100 mm lens at 1.1 m. With
  DOF = 2 u^2 N c / f^2 and c = 0.025 mm (Wikipedia, Depth of field) that leaves 17 mm in focus at f/2.8, 48 mm at
  f/8 and 97 mm at f/16, against a toy 150 to 200 mm deep. Product photographers stop down or stack exposures to
  get rid of it.
- **Vignetting.** Natural fall-off goes as cos^4 of the field angle: 87 % at 15 degrees, 56 % at 30 (Wikipedia,
  Vignetting). The mascot camera's half angle is 8.5 degrees: 4 % at the corner of its box.
- **Exposure.** A photographer exposes so that white fur is just short of white and the page behind is white. In
  the reference the dyes' strong channel is at 0.93 to 0.96.
- **Surround** (from memory, not checked here: Bartleson and Breneman's work on image contrast and surround): a
  picture seen against a dark surround looks lower in contrast than the same picture against a light one. The
  dark theme can carry a little more contrast than the light theme before it looks harsh.

## 3. How it is rendered

The renderer's unit of light, used throughout: a matte white surface facing the key sends back `uKeyCol`. A lamp
is a direction with a colour; a matte surface is `albedo * sum(lampCol * f(n.l))`; the sky term is added the same way.

### 3.1 A round lamp on a matte surface

- **Exact.** A lamp of radiance L and angular radius sigma whose middle is theta from the normal gives
  `E = pi L sin^2(sigma) cos(theta)` while it is wholly above the surface's horizon (theta <= 90 - sigma): the same
  cosine as a point lamp. Only the band from 90 - sigma to 90 + sigma differs, where the horizon cuts the lamp.
  There is a closed form for that band in the Frostbite course notes (from memory; the file was too large to
  fetch).
- **A fit that is enough** (the researcher's, calc1.py section C, against numeric integration). With `w = sin(sigma)`
  and `nl = n.l`:

  ```
  E / E0 = nl                      for nl >= w
         = (nl + w)^2 / (4 w)      for -w < nl < w
         = 0                       for nl <= -w
  ```

  Value and slope are continuous at both joins. Without branches: `a = clamp((nl + w) / (2 w), 0, 1)`,
  `E / E0 = max(nl, w a a)`.

  | sigma | w | worst error of `(nl + w) / (1 + w)` | of that squared | of the fit above |
  |---|---|---|---|---|
  | 15 degrees | 0.259 | 0.152 | 0.137 | 0.009 |
  | 26 degrees | 0.438 | 0.213 | 0.074 | 0.011 |
  | 35 degrees | 0.574 | 0.233 | 0.045 | 0.007 |
  | 45 degrees | 0.707 | 0.233 | 0.021 | 0.005 |
  | 60 degrees | 0.866 | 0.203 | 0.045 | 0.044 |

- **Energy.** With the facing value held at E0, a ball receives `2 / (1 + cos(sigma))` times the flux a point lamp
  would give it: 13 % more at 40 degrees. That is a property of the lamp, not an error (the fit gives 14 %).

### 3.2 Wrap lighting as engines write it

- Unity's `CommonLighting.hlsl` (read): `ComputeWrappedDiffuseLighting(NdotL, w) = saturate((NdotL + w) / ((1 + w) *
  (1 + w)))`, credited there to Steve McAuley's "Energy-Conserving Wrapped Diffuse" (the post itself could not be
  opened); `ComputeWrappedNormal`; and a power variant credited to Jimenez for eyes.
- This renderer's `shade()` uses `clamp((nl + wrap) / (1 + wrap), 0, 1)` and `furLight` the same with
  `w = 0.45 + 0.4 lum(albedo)`. Neither is normalised: a wrap of w multiplies the flux by 1 + w, so the pile takes
  1.6 to 1.8 times the key's light of a matte surface, and 0.39 to 0.45 of the facing value at the shadow line.

### 3.3 Rectangular lamps: linearly transformed cosines (Heitz, Dupuy, Hill, Neubelt 2016)

three.js r170's `lights_physical_pars_fragment.glsl.js` (read): two 64 x 64 tables (`ltc_1`, `ltc_2`) indexed by
`(roughness, sqrt(1 - n.v))` for the glossy lobe. The matte part passes an identity matrix and needs no table: the
lamp's four corners are projected on the sphere, four edge terms are summed
(`LTC_EdgeVectorFormFactor`: `a = 0.8543985 + (0.4965155 + 0.0145206 y) y`, `b = 3.4175940 + (4.1616724 + y) y`,
`v = a / b`) and the horizon is handled by `LTC_ClippedSphereFormFactor(f) = max((l^2 + f.z) / (l + 1), 0)`. It
would fit this renderer's limits, but it is four normalisations, four cross products and four inverse square roots
per lamp per shading point for what the fit in 3.1 does to 1 % in five operations. The glossy part needs the
tables, which the limits exclude, and the studio's panels already serve mirrors.

### 3.4 Glossy things: representative points, and this renderer's panels

- Karis's method for Unreal (course notes not opened; known from search results and a course page that restates
  it): for a sphere lamp, aim the highlight at the point of the lamp nearest the mirror direction and widen the
  lobe's normalisation to keep energy.
- This renderer does not need it: `studio()` in `_lib.glsl` evaluates soft-edged panels in the mirror direction
  with radiance `lampCol * PI / (4 hx hy)`, so a panel's brightness times its size equals the lamp's light. In
  those units today's key panel has radiance 5.0, the fill panel 4.0 and the back strip 8.3: a glossy eye shows
  the fill almost as bright as the key. The reference shows one highlight.
- (Geometry, worked out here.) A lamp of angular radius sigma mirrored in a ball shows as a disc of
  `sin(sigma / 2)` of the ball's radius:
  0.34 at 40 degrees. The reference's highlight covers "about a third" of the pupil.

### 3.5 The sky

- **Overcast** (Moon and Spencer, the CIE overcast sky; formula read in the EnergyPlus engineering reference):
  `L(a) = Lz (1 + 2 sin a) / 3` for altitude a. The zenith is three times the horizon. A level surface receives
  `(7 / 9) pi Lz` (calc1.py section D).
- **On a tilted surface** (numeric, same script), relative to a level one, against `x^1.35` with
  `x = (1 + n.up) / 2`:

  | n.up | 0.75 | 0.5 | 0.25 | 0 | -0.25 | -0.5 | -0.75 |
  |---|---|---|---|---|---|---|---|
  | overcast sky, exact | 0.825 | 0.669 | 0.527 | 0.396 | 0.277 | 0.169 | 0.075 |
  | `x^1.35` | 0.835 | 0.678 | 0.530 | 0.392 | 0.266 | 0.154 | 0.060 |
  | a uniform sky, `x` | 0.875 | 0.75 | 0.625 | 0.5 | 0.375 | 0.25 | 0.125 |

- **Clear skies** (Kittler's CIE clear sky, read in the same reference; Hosek and Wilkie 2012, project page read)
  need a sun's position, and Hosek-Wilkie needs fitted coefficient sets per turbidity and ground albedo (that
  last point from memory: the page read does not give the data's size). They describe outdoor light with a sun in
  it. Left out (section 5).

### 3.6 The colour of daylight

CIE D-series locus (Wikipedia, Standard illuminant, read): for 4,000 to 7,000 K
`x = 0.244063 + 0.09911e3 / T + 2.9678e6 / T^2 - 4.6070e9 / T^3`; for 7,000 to 25,000 K
`x = 0.237040 + 0.24748e3 / T + 1.9018e6 / T^2 - 2.0064e9 / T^3`; `y = -3.000 x^2 + 2.870 x - 0.275`. Converted to
linear sRGB with D65 as white and scaled so the largest channel is 1 (calc1.py section A):

| kelvin | linear RGB | as an sRGB hex | what it is |
|---|---|---|---|
| 5,000 | (1.000, 0.830, 0.613) | #ffebcd | D50, "horizon light" |
| 5,500 | (1.000, 0.894, 0.745) | #fff3e0 | D55, mid-morning daylight; flash |
| 6,000 | (1.000, 0.951, 0.874) | #fff9f0 | the top of "vertical daylight" |
| 6,504 | (1.000, 1.000, 1.000) | #ffffff | D65, noon daylight; the display's white |
| 7,000 | (0.894, 0.934, 1.000) | #f3f7ff | between overcast and north sky |
| 7,500 | (0.812, 0.880, 1.000) | #e9f1ff | D75, "north sky daylight" |
| 10,000 | (0.587, 0.721, 1.000) | #c9ddff | toward clear blue sky |

Today's key, #fff7ee, is linear (1.000, 0.930, 0.855): about 5,850 K. Today's fill, #f3f6ff, is (0.896, 0.922,
1.000): about 7,100 K. The sky and back lamps are D65.

### 3.7 The floor

A ball of radius 1 standing on a matte floor under the proposed key (40 degree lamp, 38 degrees up) and sky, one
bounce, by Monte Carlo (calc4.py; the researcher's calc2.py did the same for an earlier key). Light arriving from
the floor on a patch of the ball with a given n.up, as a share of what a floor in the open would send:

| n.up | -0.88 | -0.70 | -0.50 | -0.30 | -0.10 | 0.15 | 0.50 |
|---|---|---|---|---|---|---|---|
| Monte Carlo | 0.470 | 0.659 | 0.661 | 0.604 | 0.526 | 0.416 | 0.245 |
| `(0.5 - 0.5 c) (1 - 0.95 exp(-6 (1 + c)))` | 0.497 | 0.717 | 0.714 | 0.641 | 0.547 | 0.425 | 0.248 |

The first factor is the share of the surface's view that an endless floor fills. The second is the mascot's own
shadow on the floor, which only matters for surfaces within about 35 degrees of straight down. The fit is 1 to 9 %
above the Monte Carlo figure.

The floor's own light under the same lamp, for the shadow drawn on the page (share of the open floor's light, at
distances in ball radii from the point of contact):

| distance | 0 | 0.25 | 0.5 | 0.8 | 1.0 | 1.2 | 1.5 | 2.0 | 2.5 |
|---|---|---|---|---|---|---|---|---|---|
| toward the key | 0.04 | 0.16 | 0.51 | 0.80 | 0.85 | 0.89 | 0.93 | 0.96 | 0.98 |
| away from the key | 0.04 | 0.07 | 0.16 | 0.26 | 0.31 | 0.35 | 0.53 | 0.78 | 0.85 |
| across | 0.00 | 0.13 | 0.28 to 0.34 | 0.58 to 0.62 | 0.69 to 0.74 | 0.80 to 0.89 | 0.89 to 0.93 | 0.96 | 0.98 |

### 3.8 Occlusion, and the light that bounces back

- **Today.** `calcAO` reads the distance field five times along the normal, out to 0.185 units, and returns
  `1 - 2.2 * sum((h - d) * 0.85^i)` (the method the code credits to Evans 2006 and Quilez 2008; neither was opened).
- **Multiple bounces** (Jimenez, Wu, Pesce, Jarabo 2016, text read in part). Plain occlusion assumes the only
  light is the sky's, so "the light incoming due multiple surface reflections is completely lost", which shows as
  "overdarkening of edges and corners". Their observation: in a region of constant albedo, near-field indirect
  light "exhibits a strong relationship with its ambient occlusion value". They fit a cubic per albedo and found
  its coefficients linear in the albedo. As Unity ships it (`GTAOMultiBounce`, read):

  ```
  a =  2.0404 * albedo - 0.3324
  b = -4.7951 * albedo + 0.6417
  c =  2.7552 * albedo + 0.6903
  G = max(x, ((x * a + b) * x + c) * x)      x: the plain occlusion, 0 closed .. 1 open; per colour channel
  ```

  | albedo | x = 0.2 | 0.4 | 0.6 | 0.8 |
  |---|---|---|---|---|
  | 0.05 | 0.200 | 0.400 | 0.600 | 0.802 |
  | 0.20 | 0.236 | 0.451 | 0.647 | 0.829 |
  | 0.50 | 0.349 | 0.590 | 0.757 | 0.883 |
  | 0.80 | 0.462 | 0.730 | 0.867 | 0.937 |
  | 0.93 | 0.510 | 0.790 | 0.915 | 0.960 |

  Per channel on the palette at x = 0.5 (calc3.py): sky dye (0.040, 0.565, 0.905) gives (0.500, 0.709, 0.857);
  coral (1.000, 0.133, 0.098) gives (0.898, 0.522, 0.506); lime (0.392, 0.716, 0.040) gives (0.634, 0.775, 0.500).
  The dye's own channel recovers and the absorbed one does not: shade gets more saturated.
- Their screen-space occlusion itself (half a millisecond at half resolution, 96 effective directions from a 4 x 4
  neighbourhood and six frames) is not needed here: the distance field gives occlusion directly.
- **Mirrors in creases.** Unity's `GetSpecularOcclusionFromAmbientOcclusion` is
  `saturate(pow(NdotV + ao, exp2(-16 * roughness - 1)) - 1 + ao)`: the same expression as `specOcclusion` in
  `_lib.glsl`. Nothing to change.

### 3.9 Soft shadows from a distance field

- Quilez's estimate, `res = min(res, k * h / t)` along the ray to the lamp, and the improved one that uses the
  previous step (`y = h * h / (2 * ph)`, `d = sqrt(h * h - y * y)`, `res = min(res, k * d / max(0, t - y))`) are
  what `softShadow` already does. The article could not be opened; search results describe it, and the code is in
  the repository.
- **What k means** (derived here, not from a source). `h / t` is the tangent of the angle by which the ray clears
  the nearest surface. A lamp of angular radius sigma is wholly visible when that angle reaches sigma, so
  `k = 1 / tan(sigma)`: 5 is 11 degrees, 4 is 14, 3 is 18, 2.5 is 22, 2 is 27, 1.2 is 40.
- **Two limits of the method.** The penumbra is one-sided: it starts at the edge of the geometric shadow and
  spreads outward only, where a real lamp's is centred on that edge. And a curved body shades itself: on a ball,
  the least `h / t` along a ray that leaves at theta from the normal is about `cos(theta) + 0.155 sin(theta)` (with
  the 0.012 lift the code uses), so k = 4 dims only the last 6 degrees before the shadow line, and k = 1.2 would
  dim everything more than 43 degrees from the lamp. A large lamp therefore needs the ray aimed at the part of
  the lamp the surface can see (section 4.5), not a smaller k alone.

### 3.10 Tone curves

- **Khronos PBR Neutral** (reference GLSL read in full; README read): subtract an offset (0.04, or `x - 6.25 x^2`
  where the smallest channel x is under 0.08); leave everything with a peak under 0.76 alone; above it,
  `newPeak = 1 - d^2 / (peak + d - 0.76)` with `d = 0.24`, then blend toward white by
  `g = 1 - 1 / (0.15 (peak - newPeak) + 1)`. Hue is kept for every input. It is what `neutralTone` in `shaders.ts`
  already is, constant for constant.
- **The others in three.js r170** (source read): Reinhard `c / (1 + c)`; the Hejl and Burgess-Dawson filmic curve;
  ACES (the fit three.js takes from Stephen Hill's code, with exposure divided by 0.6); AgX (inset and outset matrices, log2 range -12.47 to 4.03, a
  sixth-order contrast polynomial).
- **On this palette** (calc1.py section B: dye times a light level E, through each curve; saturation is HSV on the
  encoded result; the sky dye itself is #38c6f4, saturation 0.77):

  | sky dye at | Neutral | ACES | AgX |
  |---|---|---|---|
  | E = 0.45 | #0786a8, 0.96 | #1598b6, 0.88 | #4e93a9, 0.54 |
  | E = 1.0 | #1fbeec, 0.87 | #75ccde, 0.47 | #79b7ca, 0.40 |
  | E = 1.4 | #42c8f6, 0.73 | #96dbe8, 0.35 | #8bc4d6, 0.35 |

  Coral (hue 5 degrees) at E = 1.4 keeps hue 5 under Neutral and turns to 12 under ACES and 9 under AgX. White at
  E = 1.0 comes out #e6e9ee under Neutral, #dfe0e1 under ACES and #c6c7c9 (grey) under AgX. Neutral's offset
  deepens and saturates shade by itself (0.96 at E = 0.45), which is the reference's "shade is the dye, deeper".

### 3.11 What offline renderers do, and what real-time engines do (general knowledge, from memory)

| | offline (path tracers) | real-time engines | this renderer |
|---|---|---|---|
| key | an area light, sampled; penumbra and wrap come free | analytic area lights (representative point, LTC) with filtered shadow maps | a direction, with the fit of 3.1 and a distance-field shadow |
| sky and room | an HDR image dome, sampled | spherical harmonics or prefiltered cube maps | two terms: sky and floor (3.5, 3.7) |
| floor bounce | traced | probes, or baked | a form factor (3.7) |
| bounce in creases | traced | occlusion with the multi-bounce fit (3.8) | the same fit |
| fur | every fibre, multiple scattering | shells or cards with a hair lobe | a ray-marched volume |
| tone | a filmic curve chosen per show | ACES, AgX, Neutral | Neutral |

## 4. A recipe for this renderer

No change below uses noise or relief, so there are no noise frequencies to give: light is constants and a few
closed forms. `matDisplace` is not touched. Every change is arithmetic at points the shader already shades: no new
distance-field readings, no loops, no textures.

### 4.0 How the numbers were got, and how far to trust them

The model (calc4.py): a unit ball on the floor seen from the app's camera direction (0, 0.14, 0.99), 80,000 visible
normals weighted by projected area, light from the formulas below, colour `neutralTone(light * dye * 0.93 *
exposure)`, statistics as in section 2.5. To compare with the reference's 98th to 2nd percentile, which includes
fibre grain, the model's value is multiplied by `1 + 0.08 * gaussian` first.

The same model, given today's lamps and each material's own matte lobe, against today's renders:

| | upper left / upper right | top / lower body | top / base | shade / lit | 95th / 5th, whole |
|---|---|---|---|---|---|
| clay: render | 1.04 | 1.62 | 2.96 | 0.82 | 2.64 |
| clay: model | 1.02 | 1.90 | 3.46 | 0.76 | 3.27 |
| cotton: render | 0.97 | 1.93 | 2.99 | 0.74 | 2.99 |
| cotton: model | 1.01 | 2.42 | 3.47 | 0.66 | 3.58 |
| plush: render | 1.00 | 1.44 | 2.51 | 0.82 | 2.42 |
| plush: model (the pile's wrap, no fibres) | 1.01 | 1.43 | 2.10 | 0.86 | 2.10 |

So the model is right about side to side (within 0.04; 0.12 on one strip of the cotton), and on bare surfaces it
overstates top-to-bottom contrast by 16 to 25 % and puts shade 0.06 to 0.08 too low. The renders have things the
model lacks: sheen, the floor mirrored faintly in the lower half, a body flatter than a ball. Read every predicted
ratio with that error: real renders of bare materials should come out a little flatter top to bottom than predicted.

### 4.1 The rig at a glance

| | light theme | dark theme |
|---|---|---|
| **key**: direction | (-0.604, 0.616, 0.507): 50 degrees to the left of the camera, 38 degrees up | the same |
| key: size | 40 degrees angular radius: `KEY_W = 0.643`, panel 0.66 x 0.56 rad | the same |
| key: colour | 6,000 K, 0.78: linear (0.780, 0.742, 0.682), `C("#fff9f0") * 0.78` | the same |
| **sky**: size | the upper half of the room, overcast: `pow(0.5 + 0.5 c, 1.35)` | the same |
| sky: colour | 7,000 K, 0.36: linear (0.322, 0.336, 0.360), `C("#f3f7ff") * 0.36` | the same |
| **floor**: albedo | 0.6 x the page: (0.548, 0.563, 0.584) | (0.28, 0.30, 0.33): a table that is dark to the eye, not to the light |
| floor: what it sends up, `uGround` | (0.439, 0.447, 0.455) | (0.225, 0.238, 0.257) |
| **fill**: direction, size | (0.752, 0.100, 0.652), `FILL_W = 1.0` (a card or wall) | the same |
| fill: colour | 6,500 K, 0.10 | 6,500 K, 0.12 |
| **back / rim**: direction, size | (0.300, 0.550, -0.780), `BACK_W = 0.6` (37 degrees) | the same |
| back: colour | the page's colour, 0.30: (0.274, 0.282, 0.292) | 7,000 K, 0.80: (0.715, 0.747, 0.800) |
| brightest matte point | 1.15 | 1.28 (the top, where key, sky and rim meet) |
| light on a surface facing the key | (1.143, 1.117, 1.077) | (1.131, 1.108, 1.072) |
| exposure | 1.0; 1.12 for the white dye and for Bloom | the same |
| tone curve | Khronos PBR Neutral, unchanged | the same |
| key's shadow: `k` | 2.5 on pile, 3 on cotton, boucle and clay, 3.5 on elastane and sugar, 4 on glossy parts | the same |
| key's shadow: depth | to 0.4 of the key on pile; to 0 on bare surfaces | the same |

`uGround` is the floor's albedo times the light that reaches the floor, `uKeyCol * KEY.y + uSky` = (0.802, 0.793,
0.780).

Why these values. The key's direction and the key-to-sky balance were scanned (calc4.py) for the reference's three
numbers: shade at 0.55 to 0.60 of light, median at 0.83, 2.6 : 1 with grain. The floor's albedo is a choice, not a
measurement: with the page's full albedo a white floor fills the shade until the body flattens (in a scan with a
slightly different key, shade rose from 0.62 to 0.69 of light and the whole body fell to 1.8 : 1), so 0.6 keeps
the modelling. The dark floor's albedo was chosen to reach the reference's numbers, which were measured on black.
6,000 K and 7,000 K sit 500 K either side of the display's white, inside the range of daylight (section 3.6), so a
white mascot stays white: lit #eeeff1, shade #bec1c7.

### 4.2 Change 1: the lamps' directions, colours and levels, and the exposure

**Where.** `engine.ts`: the three vectors in `View` (lines 184 to 186), the uniforms (lines 212 to 218),
`applyTheme` (lines 350 to 362), `exposure` in `fuzzySpec` (line 59) and in `SPECS.bloom` (line 35).

```ts
private KEY = new THREE.Vector3(-0.604, 0.616, 0.507);   // a big soft lamp 50 degrees to the left of the camera, 38 degrees up
private FILL = new THREE.Vector3(0.752, 0.1, 0.652);     // a white card, low, on the other side and in front
private BACK = new THREE.Vector3(0.3, 0.55, -0.78);      // behind and above, on the side away from the key

// the uniforms. C(hex) converts sRGB to linear, as now.
uKey: { value: this.KEY.clone() }, uKeyCol: { value: C("#fff9f0").multiplyScalar(0.78) },      // 6,000 K
uFill: { value: this.FILL.clone() }, uFillCol: { value: C("#ffffff").multiplyScalar(0.10) },   // set again by applyTheme
uBack: { value: this.BACK.clone() }, uBackCol: { value: C("#f5f8fc").multiplyScalar(0.30) },   // set again by applyTheme
uSky: { value: C("#f3f7ff").multiplyScalar(0.36) },                                            // 7,000 K
uGround: { value: new THREE.Color() },                                                         // set by applyTheme

// applyTheme, after the page colour has been read into uBackdrop:
const U = this.uniforms, key = U.uKeyCol.value as THREE.Color, sky = U.uSky.value as THREE.Color, h = this.KEY.y;
(U.uFillCol.value as THREE.Color).setRGB(1, 1, 1).multiplyScalar(dark ? 0.12 : 0.10);
if (dark) (U.uBackCol.value as THREE.Color).set("#f3f7ff").multiplyScalar(0.80);   // a cool strip behind
else (U.uBackCol.value as THREE.Color).copy(page).multiplyScalar(0.30);            // the page's own glow
// what the floor sends back up: its albedo times the light on it (the key at its height, plus the sky)
const floor = dark ? new THREE.Color(0.28, 0.30, 0.33) : page.clone().multiplyScalar(0.6);
(U.uGround.value as THREE.Color).setRGB(floor.r * (key.r * h + sky.r), floor.g * (key.g * h + sky.g), floor.b * (key.b * h + sky.b));

// fuzzySpec:   exposure: pale ? 1.12 : 1.0      (was 1.06 for every colour)
// SPECS.bloom: exposure: 1.12                   (was 1.1)
```

(`new THREE.Color(r, g, b)` and `setRGB(r, g, b)` take linear values in three r170: from memory. The engine
already passes `THREE.SRGBColorSpace` where it means sRGB, at line 357, which agrees.)

**Effect.** With only this change and the next two (the model cannot separate them): the upper body goes from
1.0 : 1 side to side to 1.38 (upper left against upper right) and 1.62 (left edge against right edge); shade from
0.74 to 0.82 of light to 0.58; top to base from 2.5 to 3.0 : 1 to 2.4 on the light theme. Tones of the sky dye:
lit #1cbee9, median #14b2dc, shade #0a94ba, base #057d9e (today: light #5acef8, median #31bff2, shade #0b769a).
The lit side is less washed out because it is no longer in the curve's shoulder: the sky dye's blue channel maps
light 0.55 to 1.15 onto 0.42 to 0.86. The mascot is a little deeper in colour overall; exposure 1.06 instead of
1.0 lifts the median by 5 % and costs 0.01 of shade-to-light.

**Cost.** None: constants.

**Shows at.** Every size, 28 px included: it is the distribution of tone over the whole body.

### 4.3 Change 2: a sky and a floor

**Where.** `skyIrr` in SCENE (`shaders.ts` line 581), which every material and `shade()` call; and the `env` line
of `shadeFur` (line 660), which has its own copy.

```glsl
// the light of the room on a surface facing N: an overcast sky above (three times brighter overhead than at the
// horizon), and below, what the floor sends back, less the mascot's own shadow on it
vec3 skyIrr(vec3 N) {
  float c = dot(N, uUp);
  float up = pow(max(0.5 + 0.5 * c, 0.0), 1.35);
  float dn = (0.5 - 0.5 * c) * (1.0 - 0.95 * exp(-6.0 * (1.0 + c)));
  return uSky * up + uGround * dn;
}
// shadeFur: the same two terms, with Bloom's blanket tint on the floor's; and the dome no longer needs `occ`
// (the floor term carries the underside), which stays on the three lamps
  float c = dot(f.n, uUp);
  vec3 env = uSky * pow(max(0.5 + 0.5 * c, 0.0), 1.35) + uGround * FUR_FLOOR * (0.5 - 0.5 * c) * (1.0 - 0.95 * exp(-6.0 * (1.0 + c)));
  ...
  return f.alb * env * mix(again, vec3(1.0), exp(-1.6 * cover)) + ...
```

**Effect.** Light on a surface by where it faces (luminance, light theme): straight up 0.98, toward the camera
0.86, the left outline 0.82, the right outline 0.53, the lower front (n.up = -0.6) 0.55, straight down at the point
of contact 0.04. Today a downward surface gets 0.21 whatever is under it and an upward one 0.42 plus lamps. The
underside stops being a dark band: on the light theme it takes the page's light, on the dark theme less of it
(lower front 0.41), which is what a floor does. Side-facing surfaces get 0.39 of the sky, not 0.5: the overcast
sky is what gives the body a top.

**Cost.** One `pow` and one `exp` where there was one `mix`. On bare materials that is a few times per pixel. In
the pile it is once per fibre met; if the profile shows it, replace `pow(x, 1.35)` by `x * mix(1.0, sqrt(x), 0.7)`
and the `exp` by `q * q * q * q` with `q = max(1.0 - 1.25 * (1.0 + c), 0.0)` (within 0.01 and 0.04 over the range).

**Shows at.** Every size: the lower third of the body.

### 4.4 Change 3: lamps with a size (the wrap of matte and fuzzy surfaces)

**Where.** Two constants, a table and one function in COMMON; then every place a lamp's cosine is taken.

```glsl
// The lamps have sizes. w is the sine of a lamp's angular radius. lampWrap is the light the lamp gives a matte
// surface turned nl = dot(n, l) to its middle, as a share of what it gives one facing it (within 0.01 for w <= 0.71).
const float KEY_W = 0.643;    // 40 degrees: a 90 cm softbox at 55 cm, or a window 1.7 m wide at 1 m
const float FILL_W = 1.0;     // a card or a wall: half the room
const float BACK_W = 0.6;     // 37 degrees: the page glowing behind, or a wide strip
float lampWrap(float nl, float w) { float a = clamp((nl + w) / (2.0 * w), 0.0, 1.0); return max(nl, w * a * a); }
float lampW(int i) { return i == 0 ? KEY_W : i == 1 ? FILL_W : BACK_W; }
```

| place | today | becomes |
|---|---|---|
| `_lib.glsl`, `shade()`, the lamp loop (clay, and the glossy parts of bare bodies) | `clamp((dot(n, lampDir(i)) + s.wrap) / (1.0 + s.wrap), 0.0, 1.0)` | `lampWrap(dot(n, lampDir(i)), min(lampW(i) + s.wrap, 0.98))` |
| `cotton.glsl` and `boucle.glsl`, their lamp loops | the matte term times `nl = max(dot(N, l), 0.0)` | the matte term times `lampWrap(dot(N, l), lampW(i))`; the Oren-Nayar factor and the sheen lobe keep the plain cosine |
| `elastane.glsl`, its lamp loop | `nl * alb * (1.0 - F)` | the same replacement on the matte term only; the glossy lobe keeps the plain cosine |
| `sugar.glsl`, the jelly | `clamp((dot(n, lampDir(i)) + 0.45) / 1.45, 0.0, 1.0)` | `lampWrap(dot(n, lampDir(i)), 0.98)` |
| `sugar.glsl`, the crust | `max(dot(N, lampDir(i)), 0.0)` | `lampWrap(dot(N, lampDir(i)), lampW(i))` |
| `shaders.ts`, `shadePlastic` and `shadeThread` | `max(dot(n, uKey), 0.0)`, `max(dot(n, uFill), 0.0)` | `lampWrap(dot(n, uKey), KEY_W)`, `lampWrap(dot(n, uFill), FILL_W)` |
| `shaders.ts`, `furLight` | `w = 0.45 + 0.4 * lum(f.alb)`, `wrap = clamp((NoL + w) / (1.0 + w), 0.0, 1.0)` | a new argument `lw`, the lamp's w (`shadeFur` passes `KEY_W`, `FILL_W`, `BACK_W`); `wrap = lampWrap(NoL, min(lw + 0.2 + 0.2 * lum(f.alb), 0.98))` |

(The materials' lines are known from the researcher's search of them, not from reading each file whole.)

**Effect on bare surfaces.** The shadow line becomes a band: 0.16 of the facing value at n.l = 0, light ending 40
degrees past it. A point lamp gives 0 there, today's clay (wrap 0.3) 0.23 with a kink where it ends.

**Effect on the pile.** Today's linear wrap lets 0.39 to 0.45 of the key round the shadow line and 0.21 to 0.29
at n.l = -0.3. With the lamp's size plus the pile's own share it is 0.24 and 0.12. Under the new rig that is the
difference between a pile that stays flat and one that takes form (calc5.py, sky dye, light theme):

| pile's wrap | upper left / upper right | left / right | shade / lit | 98th / 2nd with grain |
|---|---|---|---|---|
| today's linear wrap, new rig | 1.11 | 1.22 | 0.74 | 1.87 |
| **lamp plus pile (proposed)** | **1.29** | **1.47** | **0.64** | **2.13** |
| the lamp's size only (a lower bound) | 1.38 | 1.62 | 0.58 | 2.36 |
| the reference | 1.4 to 1.6 | | 0.55 to 0.60 | 2.6 |

A white pile goes from shade at 0.94 of light (measured today, dark theme) to a predicted 0.71 (light theme) and
0.69 (dark theme). If a render shows
the pile still flatter than the reference, lower its own share (`0.2 + 0.2 * lum`) toward 0.1: the reference sits
at the lower bound. **(Superseded: the orchestrator's render of rig E shows the pile already at the
reference's contrast. See 4.13 before touching `furLight`.)**

**A side effect to check.** A large lamp also softens the shading of fine relief (the knit's grooves, the clay's
prints), as it does in life. If a material's texture loses too much, raise that material's relief strength, not the
lamp's hardness.

**Cost.** One clamp, three multiplies and a max per lamp, in place of a clamp or a max.

**Shows at.** 68 px and up as a softer turn from light to shade; at 28 px as slightly more form.

### 4.5 Change 4: the key's shadow (softness and depth)

**Where.** A helper in SCENE; `shadowKey` and `shadowKeyRelief` in `_lib.glsl`; the `k` each material passes; the
two `sh` lines in MAIN_PILE (line 760) and MAIN_SURFACE (line 880); the glossy parts' shadow in both (lines 768
and 889).

```glsl
// Where to look for the key's shadow from a surface facing n. A surface turned away from the lamp's middle still
// sees part of the lamp: aim at that part. (The body's own horizon is already in lampWrap; a ray at the lamp's
// middle would count it twice, and from past the shadow line it would start inside the body.)
vec3 keyAim(vec3 n) { return normalize(uKey + n * (0.6 * max(KEY_W - dot(n, uKey), 0.0))); }

// _lib.glsl
float shadowKey(vec3 p, vec3 n, float k) { float keep = gDetail; gDetail = 0.0; float s = softShadow(p + n * 0.012, keyAim(n), k); gDetail = keep; return s; }

// MAIN_PILE (and the PILE block of MAIN_SURFACE, with its gGrain lines kept): k 2.5, depth 0.4 as now
float nk = dot(sn, uKey), sh = 1.0;
if (nk > -0.5) sh = mix(1.0, mix(0.4, 1.0, softShadow(sp + sn * (lift + 0.012), keyAim(sn), 2.5)), smoothstep(-0.5, -0.1, nk));

// glossy parts, both mains
softShadow(sAt + n * 0.01, keyAim(n), 4.0)
```

| | `k` today | `k` proposed | the lamp that `k` stands for | depth of the key's shadow |
|---|---|---|---|---|
| pile (plush, and what a bare body wears) | 3 | 2.5 | 22 degrees | to 0.4 of the key (unchanged) |
| cotton, boucle, clay | 4 | 3 | 18 degrees | to 0 (unchanged); 0.15 is a fair option for cotton and boucle |
| elastane, sugar | 5 | 3.5 | 16 degrees | to 0 |
| eyes, glasses, headphones | 5 | 4 | 14 degrees | to 0 |

Why not `k = 1.2`, the 40 degree lamp's own value. The penumbra this method draws lies wholly outside the geometric
shadow and is fully dark inside it; a real lamp's is centred on the shadow's edge and half lit there. Matching
the amount of shade that falls outside the edge gives `k = 2 / tan(sigma)`, 2.4 for 40 degrees (worked out here);
`k = 1.2` would put twice as much there, and thin things such as a glasses wire would shade the face as if solid.
Hence 2.5 on pile. Bare surfaces stay a little crisper because today's k = 4 already gives the reference's width
under a close brim (section 2.5). With `keyAim`, the ball's own statistics are identical with and without the
shadow term at k = 2.5 and at 3 (calc6.py): the softer shadow does not eat the wrap.

**How dark a cast shadow ends up** (a patch facing up and forward under a brim, sky dye, occlusion 0.55; shadow
against the open value beside it; calc4.py):

| depth of the key's shadow | light theme, plain occlusion | light theme, with change 5 | dark theme, plain | dark theme, with change 5 |
|---|---|---|---|---|
| 0.4 (pile) | 0.49 | 0.56 | 0.53 | 0.59 |
| 0.25 | 0.40 | 0.47 | 0.43 | 0.50 |
| 0.15 | 0.34 | 0.40 | 0.37 | 0.43 |
| 0 (bare) | 0.24 | 0.31 | 0.28 | 0.34 |

The reference's pile measures 0.5 under the beret's brim, 0.64 where the frog meets the cloud and 0.48 in a
crease: depth 0.4 on pile is right and stays. A bare cloth is one layer thick, so its shadow should be deeper than
a pile's; 0.24 to 0.34 is.

**Cost.** The same march as now (up to 56 readings of `shadowD`, 32 for the pile's). The `nk > -0.5` test skips
it where the key cannot reach, a small saving.

**Shows at.** 68 px and up, under hats, scarves, ears and glasses (a 0.1 to 0.2 unit penumbra is 4 to 8 px at
68 px); not at 28 px.

### 4.6 Change 5: occlusion that keeps the dye's colour

**Where.** A function in SCENE; the dome term of every material; the pile's two `ao` lines.

```glsl
// How open the sky is, with the light that bounces between nearby surfaces of this colour put back (Jimenez et al.
// 2016): creases in a bright dye stay bright and deepen in colour, creases in a dark one stay dark.
vec3 aoBounce(float open, vec3 alb) {
  vec3 a = 2.0404 * alb - 0.3324, b = -4.7951 * alb + 0.6417, c = 2.7552 * alb + 0.6903;
  return max(vec3(open), ((open * a + b) * open + c) * open);
}
```

| place | today | becomes |
|---|---|---|
| `_lib.glsl`, `shade()` | `vec3 E = skyIrr(n) * open;` | `vec3 E = skyIrr(n) * aoBounce(open, s.base * (1.0 - s.metal));` |
| cotton, boucle, elastane, sugar: the dome term | `alb * skyIrr(N) * open` | `alb * skyIrr(N) * aoBounce(open, alb)` |
| MAIN_PILE and the PILE block of MAIN_SURFACE | `Cp = Cp * mix(0.6, 1.0, ao) + Ck * sh * mix(0.75, 1.0, ao);` | keep the fibre's colour where the surface is recorded (`sa = f.alb;` beside `sp = p; sn = f.n;`), then `vec3 ob = aoBounce(ao, sa); Cp = Cp * mix(vec3(0.6), vec3(1.0), ob) + Ck * sh * mix(vec3(0.75), vec3(1.0), ob);` |

`calcAO` itself stays as it is.

**Effect.** At half occlusion the sky dye's crease keeps (0.50, 0.71, 0.86) of the open light instead of 0.5 in
each channel: 1.4 times brighter in green, 1.7 in blue, unchanged in red. Coral keeps (0.90, 0.52, 0.51). White
keeps 0.77 to 0.81 at occlusion 0.4: folds in white plush barely darken, as in life. Charcoal is unchanged. The
reference's creases sit at 0.48 of the lit value and keep their hue; its shade "saturates hard".

**Cost.** Nine multiply-adds and a max, once per pixel.

**Shows at.** 68 px and up, where parts meet: between ears and head, under a scarf or a hat, between a frog's
eye bumps. Strongest on white and the bright dyes.

### 4.7 Change 6: the rim

The reference's halo is on every outline, the one facing away from the key included, and strongest on tops. It
was measured on black (section 2.4). Two things make it, and only the first belongs to the lighting.

**The light.** The back lamp moves to the side away from the key and becomes wide (`BACK_W = 0.6`), so that the
key lights one outline, the back lamp the other, and both light the top. On the light theme it is the page
itself: a white page behind a toy is a large pale lamp, at 0.30 of its colour. On the dark theme nothing is
behind the mascot, so it is a lamp of its own: 7,000 K at 0.80 (today 0.58 and 0.85).

**The lobe.** Fibres at the outline are lit from the side and from behind. Hand the fuzz lobes the light on a
surface turned 30 degrees past the outline:

```glsl
// SCENE, after skyIrr and lampWrap
vec3 rimDir(vec3 n, vec3 v) { return normalize(n - 0.6 * v); }
vec3 rimIrr(vec3 n, vec3 v, float lit) {
  vec3 r = rimDir(n, v);
  return skyIrr(r) + uKeyCol * lampWrap(dot(r, uKey), KEY_W) * lit + uFillCol * lampWrap(dot(r, uFill), FILL_W) + uBackCol * lampWrap(dot(r, uBack), BACK_W);
}
```

Its value round the outline (luminance; calc5.py):

| | left | upper left | top | upper right | right | lower left | lower right | a surface facing the camera, for scale |
|---|---|---|---|---|---|---|---|---|
| light theme | 0.63 | 0.81 | 0.79 | 0.66 | 0.57 | 0.45 | 0.48 | 0.86 |
| dark theme | 0.61 | 1.03 | 1.20 | 1.05 | 0.75 | 0.33 | 0.47 | 0.78 |

So the light theme has an even rim all round and the dark theme a stronger one on top, which is the reference's
pattern.

Where it plugs in (these belong with the fibre report; the values are starting points worked out here from the
reference's measurements, not tested):

- Cotton and boucle: in the sheen's dome term, `sheenIBL(NoV, r) * skyIrr(N)` becomes
  `sheenIBL(NoV, r) * skyIrr(rimDir(N, v))`. Their per-lamp sheen lobes already take the back lamp.
- The pile, in `shadeFur`: add
  `(1.0 - min(f.alb, vec3(1.0))) * 0.3 * pow(1.0 - max(dot(f.n, V), 0.0), 2.5) * (1.0 - cover) * rimIrr(f.n, V, 1.0)`.
  The factor `1 - albedo` makes the halo the dye washed toward white (the reference: the absorbed channels gain
  0.15 to 0.33 linear, the dye's own channel nothing). 0.3 times a rim light of 0.5 to 1.2 gives that gain. The
  power 2.5 gives the reference's fall-off on a ball of radius 0.75 units: against its value 0.03 units inside
  the outline it is 0.58 at 0.07 units and 0.29 at 0.13 units (measured: about 0.6 and 0.3).
- Clay gets none: it has no fibres.

**On the light page this is not verified.** The halo there lifts the outline toward the page's own tone. If it
makes outlines look washed out, halve the 0.3 on the light theme (`mix(0.15, 0.3, uDark)`).

**Cost.** One more `skyIrr` and three `lampWrap` per shaded point that uses it.

**Shows at.** 68 px and up: the halo's e-folding length is 0.06 units, 2.4 px at 68 px, 10 px at 300 px, under a
pixel at 28 px.

### 4.8 Change 7: the studio that mirrors see, and the highlight in the eyes

**Where.** `_lib.glsl`: the three panel sizes. `shaders.ts`: `shadePlastic`, for the eyes of a plush body.

```glsl
// _lib.glsl: the panels' half sizes in radians. The key's has the 40 degree lamp's solid angle (1.47 sr).
const vec2 KEY_HALF = vec2(0.66, 0.56), FILL_HALF = vec2(0.5, 0.6), BACK_HALF = vec2(0.7, 0.3);

// shadePlastic: the key as a window of 40 degrees (cos 40 = 0.766), as bright as that lamp is (1 / sin^2(40) = 2.4)
float w = mix(0.766, 0.64, rough);
... + uKeyCol * 2.4 * smoothstep(w, w + 0.08, dot(R, uKey)) * shK
```

**Effect.** One broad soft highlight in each eye, a third of its width (`sin(20 degrees) = 0.34`), where today
there are two, the key's about a fifth of the eye's width and the fill's nearly as bright (radiance 5.0 and 4.0).
New panel radiances, matte white = 1: key 1.66, fill 0.26 (light) and 0.31 (dark), back 1.05 (light) and 2.80
(dark). The room that mirrors see (`wall`, `ground` in `studio()`) stays as it is: the reference's eyes mirror a
dark room with one lamp in it, although its bodies are well filled, and glossy black eyes need that.
A glossy black eye's highlight will peak near 0.04 x 1.66 = 0.07 linear; the reference's peaks at 0.16. If the
eyes look dull, raise the eye's `f0`, not the lamp.

**Cost.** None.

**Shows at.** 68 px and up (an eye is 4 to 6 px there); it is most of what makes an eye look wet at 300 px.

### 4.9 Change 8: the shadow on the page

**Where.** `engine.ts` lines 252 to 268 (the gradient and the plane), and `floorShadow` in `_lib.glsl`, which is
what mirrors see of it.

Today: opacity 0.4 at the middle, 0.14 half-way out, 0 at the edge, centred under the body. Section 3.7's floor,
turned into the opacity this sprite's colour needs on the light page: about 0.3 to 0.5 at half a body radius from
the point of contact, 0.1 to 0.25 at 0.8 of a radius, 0.1 to 0.2 at the body's edge, and on the side away from
the key 0.5 at one radius and 0.3 at one and a half. Today's sprite has 0.18, 0.09 and 0.05 at the first three.
So a real floor shadow is about twice as dark near the body and trails away from the key.

```ts
grad.addColorStop(0, "rgba(30,40,60,0.6)");
grad.addColorStop(0.35, "rgba(30,40,60,0.36)");
grad.addColorStop(0.7, "rgba(30,40,60,0.12)");
grad.addColorStop(1, "rgba(30,40,60,0)");
const plane = new THREE.PlaneGeometry(K.shadow[0] * 1.15, K.shadow[1] * 1.15);
this.shadow.position.set(0.15, 0.002, 0.04);   // toward the side away from the key
```

and in `floorShadow`: `r < 0.5 ? mix(0.6, 0.25, r * 2.0) : 0.25 * (1.0 - clamp(r * 2.0 - 1.0, 0.0, 1.0))`.
The colour (a cool dark) is right as it is: the shadow is lit by the sky alone. These stops are a first setting
from the calculation, not judged in a render; a mascot in a chat header may want less.

**Cost.** None (drawn once).

**Shows at.** Every size on the light theme: it is what says the mascot sits on the page. Nothing on the dark
theme, where the sprite is black on a near-black page.

### 4.10 The tone curve and the exposure

Keep `neutralTone` exactly as it is (section 3.10). Exposure 1.0 for dyed bodies, 1.12 for the white dye and
Bloom: white comes out lit #eeeff1, median #e6e7ea, shade #bec1c7, base #9fa2a6 against a page of #f5f8fc, so the
lit side is just under the page and the shade draws the form. At 1.2 the lit side is #f0f1f3 and shade-to-light
flattens from 0.62 to 0.65. Tones of the other dyes at exposure 1.0 (light theme; lit, median, shade, base):

| dye | lit | median | shade | base | shade / lit |
|---|---|---|---|---|---|
| sky #38c6f4 | #1cbee9 | #14b2dc | #0a94ba | #057d9e | 0.58 |
| coral #ff6658 | #f05645 | #e74c39 | #bf3726 | #a12a18 | 0.54 |
| lime #a8dc38 | #a2d617 | #96c713 | #7ba60a | #688d05 | 0.56 |
| sun #ffc928 | #f0bc22 | #e9b50d | #c39803 | #a68101 | 0.63 |
| cobalt #2a62f0 | #0e59e7 | #0852d9 | #0343b8 | #02389c | 0.58 |
| ink #3b4252 | #1d283e | #172339 | #0c192e | #061224 | 0.45 |
| snow #f3f6fb, exposure 1.12 | #eeeff1 | #e6e7ea | #bec1c7 | #9fa2a6 | 0.62 |

On the dark theme the lit and median tones are within three levels of these and the base is darker (sky #026a87,
snow #83868c).

### 4.11 What the whole rig should give (sky dye; the model's error is in 4.0)

| | upper left / upper right | left / right | top / lower | top / base | shade / lit | median / lit | 98th / 2nd with grain | 95th / 5th, whole |
|---|---|---|---|---|---|---|---|---|
| today, measured (clay, cotton, plush) | 1.04, 0.97, 1.00 | 1.03, 0.99, 1.02 | 1.62, 1.93, 1.44 | 2.96, 2.99, 2.51 | 0.82, 0.74, 0.82 | 0.95, 0.89, 0.93 | 1.65, 2.12, 1.38 | 2.64, 2.99, 2.42 |
| light theme, bare surface | 1.38 | 1.62 | 1.67 | 2.42 | 0.58 | 0.87 | 2.37 | 2.42 |
| light theme, pile | 1.29 | 1.47 | 1.56 | 2.20 | 0.64 | 0.88 | 2.13 | 2.22 |
| dark theme, bare surface | 1.33 | 1.54 | 2.22 | 3.59 | 0.54 | 0.83 | 2.66 | 3.53 |
| dark theme, pile | 1.22 | 1.36 | 2.06 | 3.16 | 0.61 | 0.85 | 2.29 | 3.09 |
| dark theme, the black page as the floor | 1.37 | 1.61 | 3.15 | 6.51 | 0.46 | 0.78 | 3.46 | 6.52 |
| the reference | 1.4 to 1.6 | | about 1.4 (cut off) | | 0.55 to 0.60 | 0.83 | 2.6 | |

Coral on the light theme: shade 0.54 of light, 2.57 : 1 with grain. White at exposure 1.12: 0.62, 2.22 : 1.

### 4.12 Order of work, and what to measure after each step

1. Changes 1 to 3 together (constants, `skyIrr`, `lampWrap`): they are one rig, and the predictions are for all
   three. Render `mat.sh <material> <out> "hero dark small"` for plush, cotton and clay and run
   `calc4.py`'s `render()` and `summary()` on the new pictures. Expect, on the light theme: upper left against
   upper right at least 1.25; shade at 0.55 to 0.68 of light; top to base under 2.5. If the pile is flatter than
   that, lower its own share of the wrap (4.4).
2. Change 5 (occlusion), then change 4 (shadows): look at `shapes` (hat, scarf, glasses).
3. Change 6 (rim), with the fibre work: judge on both themes; on the light theme at 68 px first.
4. Changes 7 and 8.
5. Time it (`tools/mascot/harness/perf.sh`): nothing here adds a distance-field reading, so the frame should stay
   where it is, but that is an estimate until timed.
6. Bloom shares the lamps. His colours and his two tints (`FUR_SHADE`, `FUR_FLOOR`) were matched to a photo under
   today's lamps: compare him with that photo again after step 1.

### 4.13 Rig E as rendered, beside the rig of 4.1

Rig E is the first researcher's fit. The orchestrator has since put it in the renderer and rendered it; the rig
of 4.1 is this report's re-fit and has not been rendered.

| | rig E (the researcher's; rendered) | 4.1 (this report; not rendered) |
|---|---|---|
| key direction | (-0.587, 0.643, 0.492): 50 degrees left, 40 degrees up | (-0.604, 0.616, 0.507): 50 degrees left, 38 degrees up |
| key size | 45 degrees, w = 0.707 | 40 degrees, w = 0.643 |
| key colour | linear (1.000, 0.965, 0.915) x 0.70 = (0.700, 0.676, 0.640); #fffbf5, about 6,200 K | 6,000 K x 0.78 = (0.780, 0.742, 0.682) |
| sky | (0.90, 0.94, 1.00) x 0.40 = (0.360, 0.376, 0.400), `pow(x, 1.35)` | 7,000 K x 0.36 = (0.322, 0.336, 0.360), the same shape |
| floor | 0.6 x page, the same shadow term; light on the open floor (0.81, 0.81, 0.812) | the same; (0.802, 0.793, 0.780) |
| fill | (0.597, 0.100, 0.796), `(1 + n.l) / 2`, (1.00, 0.97, 0.93) x 0.06 | (0.752, 0.100, 0.652), `lampWrap(nl, 1.0)`, white x 0.10 (0.12 dark) |
| back | (0.45, 0.50, -0.74), w = 0.35, (0.95, 0.97, 1.00) x 0.30 light, x 0.75 dark | (0.30, 0.55, -0.78), w = 0.6, page x 0.30 light, 7,000 K x 0.80 dark |
| dark floor | albedo 0.20 (their best dark variant) | (0.28, 0.30, 0.33) |
| exposure | 1.0 (white tried at 1.18) | 1.0 (white 1.12) |
| the researcher's prediction, their statistics | 95th / 5th 2.41, left / right 1.67, top / bottom 2.31, brightest matte point 1.09; dark 4.56 | |
| this report's model | nearest scanned (40 degree lamp, key 0.72, sky 0.40): shade / lit 0.60, left / right 1.54, 2.25 with grain | shade / lit 0.58, left / right 1.62, 2.37 with grain |

**The render** (reported by the orchestrator; the pictures were not seen for this report): rig E on the plush frog
at 175 px gives lit 0.65 to 0.66, median 0.55, shaded side 0.39 and left to right 1.67 : 1, once the pile's own
shading is multiplied by 1.5. The reference's frog: lit 0.68 to 0.76, median 0.57, shaded side 0.39 to 0.42. So
shade is 0.59 to 0.60 of light and the median 0.83 to 0.85: the reference's ratios. The lit side is 4 to 13 %
under the reference's.

What follows from it:

- **Keep rig E where it is in the code.** The two rigs are the same design and differ by less than the model's
  error (0.02 in shade to light). Rig E has a render behind it; 4.1 does not.
- **The pile needs a gain, in the pile.** A pile returns less than a matte surface of the same dye (fibres shade
  one another: `reach`, the `again` tint, the 0.3 share of `sL`, the post-march `mix(0.6, 1.0, ao)`). Under
  today's lamps the surplus of light (1.6 to 1.75 at the brightest point) hid that. Put the 1.5 on the two values
  `shadeFur` hands back, not on the exposure, so that a bare material and what it wears agree under one exposure.
  The ball model has no fibres and did not predict this.
- **Do not narrow the pile's wrap (the `furLight` row of 4.4) on the model's word.** The model said the pile
  would stay flat under the new rig with today's wrap (left to right 1.22, shade 0.74 of light). The render says
  1.67 and 0.60, if `furLight` was left as it is (not known here). The fibres' own shading adds the contrast the
  model lacks. Apply that row only if a render shows the pile flatter than the bare materials; if it is applied,
  the gain must be fitted again (a narrower wrap returns less still).
- **What section 4 adds to rig E and is still untested in a render:** one lamp size shared by the matte lobe, the
  panels and the shadows (4.4, 4.8); `keyAim` and the lower `k` (4.5); `aoBounce` (4.6); `rimDir` and `rimIrr`
  (4.7); the floor sprite (4.9); the dark theme's floor, fill and rim (4.1).

## 5. What to leave out, and why

- **Depth of field.** At toy scale a real lens holds 17 to 97 mm in focus on a toy 150 to 200 mm deep, and
  photographers work to remove that. The mascot is a cut-out on a page that is itself in perfect focus, so blur
  on it reads as a fault, not as depth. It would soften the outline's fibres, which are the texture, and at 68 px
  it would leave nothing sharp. It needs many samples per pixel or a second pass; the renderer has one.
- **Vignette.** It darkens the corners of a frame. A mascot's canvas has no frame: its corners are transparent
  page. Applied to the box it would dim a hat's top or an ear by where it sits in the box. The lens it imitates
  would lose 4 % at this field angle.
- **Film grain.** The page has none, so grain on the mascot alone is dirt. At 15 to 30 frames a second it would
  crawl, and frozen it would be a pattern lying over the fibres. The reference's "grainy" look is fibre structure
  (02.md 2.2: pale strand flanks over saturated depth, 7 to 10 % RMS), which belongs in the material, and the
  renderer's rule that detail under a pixel becomes its average stands.
- **Bloom and glare.** They need a blur pass. The glow would fall outside the mascot's alpha: invisible on a
  white page, a haze round the mascot on a dark one that reads as a UI effect. Nothing matte in the rig exceeds
  1.3; only the eyes' highlights are bright, and they are small.
- **Chromatic aberration, lens distortion, motion blur.** The same argument: camera faults with no camera frame.
- **Direct sun and hard light.** Sun against open shade is about 6 : 1; the reference is 2.6 : 1. Hard shadow edges
  on fibres alias at small sizes.
- **Clear-sky models with a sun (Kittler, Preetham, Hosek-Wilkie).** They need a sun position and fitted data and
  describe outdoors. An overcast dome is one `pow`.
- **Image-based lighting.** No texture assets are allowed, and the analytic studio already serves mirrors with
  panels that match the lamps.
- **Linearly transformed cosines.** The glossy part needs two 64 x 64 tables. The matte part is replaced by the
  five-operation fit of 3.1.
- **A close lamp's fall-off across the mascot.** It would make brightness depend on position (2.1 : 1 across a toy
  for a softbox at 55 cm) and change as the mascot hops. The reference's side-to-side ratio is reached without it.
- **Shadows cast by the fill and the back lamp.** Each is another march of up to 56 distance readings, for lamps
  so wide (w = 1.0 and 0.6) that their shadows have no edge. Occlusion stands in, as now.
- **ACES, AgX, Reinhard.** They desaturate the palette by a half and ACES turns coral toward orange (3.10).
- **Automatic exposure.** A mascot's colour must be the same wherever it is drawn.
- **A different key per theme.** The form should not jump when the theme flips. Only the floor, the fill's level
  and the rim change.
- **Lamps tinted further than 500 K from white.** White mascots would take a cast and the brand colours shift.
- **A second highlight in the eyes.** The reference shows one.

## 6. What could not be confirmed

- **The rig of 4.1 has not been rendered**, and nor have changes 3 to 8 in any form. Rig E has been rendered by
  the orchestrator; its figures in 4.13 are as reported, and the pictures were not seen for this report.
- **The model.** A matte ball with no fibres, sheen, mirrored floor or real shape. Against today's renders it was
  right side to side and 16 to 25 % too contrasty top to bottom on bare materials (4.0). On pile it missed a
  factor of 1.5 in brightness and, it seems, understated contrast (4.13).
- **The dark theme.** The reference was measured on black and holds 2.6 : 1; with the black page as the floor the
  model gives 3.5 : 1 in the upper body and 6.5 : 1 overall. The dark rig reaches the reference's ratios only by
  assuming a floor that returns 0.3 of its light, a stronger fill and a strong rim. That is a design choice. How
  the reference itself was filled is not known (a dome, a second lamp, or light scattered in the fur).
- **The rim.** The halo's figures (twice the interior at 2 to 4 px) are from a black backdrop. Nothing was
  measured on a light page. The lobe's constants (0.3, the cube, the 0.6 turn) were worked out from those
  measurements and never rendered.
- **Shadows.** `k = 1 / tan(sigma)`, the one-sided penumbra, the ball's self-shadow estimate
  (`cos + 0.155 sin`) and `keyAim` are this report's own reasoning from the code. Quilez's article could not be
  opened. `keyAim` was checked only against that estimate.
- **The floor's albedo of 0.6** on the light theme is a choice to keep the modelling; the page's true albedo
  would flatten the body.
- **Left to right in the reference** comes from a 5 x 4 grid of mean luminance per character (calc3.py), on
  shapes that are not balls and are cut off at the bottom.
- **No photograph of a real soft toy was obtained.** The image hosts were blocked and `photos/` is empty. Every
  comparison is with the reference picture, which is itself a render.
- **Material files.** Cotton and clay were read (through the transcript). Boucle, elastane and sugar are known
  only by the lines the researcher's search printed, so the edits in 4.4 and 4.6 name the expressions, not line
  numbers. How a larger key panel changes elastane's and sugar's highlights was not modelled.
- **Costs** are counts of operations. Nothing was timed.
- **Bloom** (the built-in mascot) was matched to a photo under today's lamps; his look under any new rig was not
  examined.
- **From memory, unchecked:** the closed form for a horizon-cut lamp in the Frostbite notes; the surround effect
  (Bartleson and Breneman); that three r170's `Color(r, g, b)` and `setRGB` take linear values; the size of
  Hosek-Wilkie's data; section 3.11.
- **Kelvin values of today's lamps** (5,850 K and 7,100 K) are read off the table in 3.6 by eye.
- **Key-to-fill ratios in product photography** ("2 : 1 a good starting point", "2 : 1 to 4 : 1 most common",
  "1 : 1 to 2 : 1 for high key") were seen in search results only, from blogs of no standing. They agree with the
  reference's shade at 0.55 to 0.60 of light but are not relied on.

## 7. Sources

Web pages were read through a fetch tool that returns an extract in answer to a question, not the raw page. "Read
in full" below means the whole page went through it. Files fetched with curl were read as text. Twenty sources
returned content; the rest failed and are marked.

| # | source | what it is | status |
|---|---|---|---|
| 1 | https://raw.githubusercontent.com/Unity-Technologies/Graphics/master/Packages/com.unity.render-pipelines.core/ShaderLibrary/CommonLighting.hlsl | Unity's shared lighting library: `GTAOMultiBounce`, specular occlusion, wrapped diffuse (saved as `src/commonlighting.hlsl`; it is Unity's, not Frostbite's or Unreal's) | read in part |
| 2 | https://raw.githubusercontent.com/KhronosGroup/ToneMapping/main/PBR_Neutral/pbrNeutral.glsl | the reference GLSL of the PBR Neutral tone curve (`src/neutral.glsl`) | read in full |
| 3 | https://github.com/KhronosGroup/ToneMapping/blob/main/PBR_Neutral/README.md | the curve's specification and constants | read in full |
| 4 | https://raw.githubusercontent.com/mrdoob/three.js/r170/src/renderers/shaders/ShaderChunk/tonemapping_pars_fragment.glsl.js | three.js r170's tone curves: Reinhard, Cineon, ACES, AgX, Neutral (`src/tonemap.glsl.js`) | read in full |
| 5 | https://raw.githubusercontent.com/mrdoob/three.js/r170/src/renderers/shaders/ShaderChunk/lights_physical_pars_fragment.glsl.js | three.js r170's lights, with the rectangle lamp by linearly transformed cosines (`src/lights_physical.glsl.js`) | read in part |
| 6 | https://raw.githubusercontent.com/mrdoob/three.js/r170/examples/jsm/lights/RectAreaLightUniformsLib.js | where three.js loads the two tables | read in part |
| 7 | https://www.iryoku.com/downloads/Practical-Realtime-Strategies-for-Accurate-Indirect-Occlusion.pdf | Jimenez, Wu, Pesce, Jarabo 2016: ground-truth occlusion and the multi-bounce fit (text in `src/jimenez.txt`) | read in part |
| 8 | https://en.wikipedia.org/wiki/Daylight | illuminance of sun, shade and overcast; what daylight is made of | read in full |
| 9 | https://en.wikipedia.org/wiki/Standard_illuminant | the CIE daylight locus and D50 to D75 | read in full |
| 10 | https://en.wikipedia.org/wiki/Lighting_ratio | key-to-fill ratios and stops (the article is tagged as needing citations) | read in full |
| 11 | https://en.wikipedia.org/wiki/Color_temperature | kelvin of common sources | read in part |
| 12 | https://en.wikipedia.org/wiki/Depth_of_field | the depth-of-field formulas and circles of confusion | read in part |
| 13 | https://en.wikipedia.org/wiki/Vignetting | kinds of vignetting and the cos^4 law | read in full |
| 14 | https://bigladdersoftware.com/epx/docs/8-4/engineering-reference/daylight-factor-calculation.html | EnergyPlus engineering reference: the overcast (Moon and Spencer), clear (Kittler) and intermediate sky formulas | read in full |
| 15 | https://eheitzresearch.wordpress.com/415-2/ | Heitz's page on linearly transformed cosines (no table sizes there) | read in full |
| 16 | https://github.com/selfshadow/ltc_code | the LTC reference code's README (quad, line and disk demos) | read in full |
| 17 | https://cgg.mff.cuni.cz/projects/SkylightModelling/ | Hosek and Wilkie's sky model: what it is and takes | read in full |
| 18 | https://fstoppers.com/lighting/how-softbox-size-and-distance-impact-your-photos-701754 | softbox size and distance (qualitative only) | read in full |
| 19 | https://cs418.cs.illinois.edu/website/text/ue4-pbr.html | a course page restating Karis's representative point for sphere lamps | read in full |
| 20 | https://andreasterrius.github.io/posts/sdf-softshadow | a post using `min(shadow, dist * k / t)`; "smaller k gives wider shadows" | read in full |
| 21 | https://iquilezles.org/articles/rmshadows/ | Quilez, soft shadows from distance fields (404 and a redirect loop; the archive was blocked) | seen in search results only |
| 22 | https://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf | Karis, Real Shading in Unreal Engine 4 (too large for the fetch tool; curl refused) | seen in search results only |
| 23 | https://www.cie.co.at/publications/cie-standard-overcast-sky-and-clear-sky | the CIE standard for the overcast and clear sky | seen in search results only |
| 24 | https://cdn.shutterbug.com/node/454334 | "What Makes Soft Light Soft?": apparent size (403) | seen in search results only |
| 25 | https://project-aeon.com/blogs/product-photography-lighting-setup and https://pixelz.com/blog/photograph-white-products-on-white-backgrounds-ecommerce | product-photography blogs: key-to-fill ratios | seen in search results only |
| 26 | https://bentleyblanks.github.io/2018/08/15/2018-08-15-GGX%20Spherical%20Area%20Light/ | a blog's form of Unreal's sphere-lamp normalisation (not used) | seen in search results only |
| 27 | https://seblagarde.wordpress.com/wp-content/uploads/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf | Lagarde and de Rousiers, Moving Frostbite to PBR: area-lamp illuminance (too large to fetch) | from memory |
| 28 | http://blog.stevemcauley.com/2011/12/03/energy-conserving-wrapped-diffuse/ | McAuley's post (the host did not resolve); the formula used here is Unity's copy, source 1 | from memory |
| 29 | https://graphics.stanford.edu/papers/envmap/envmap.pdf | Ramamoorthi and Hanrahan 2001, irradiance by nine coefficients (503; not used in the recipe) | from memory |
| 30 | no URL | Evans 2006 and Quilez 2008 on occlusion from a distance field, as credited in `shaders.ts` | from memory |
| 31 | no URL | Bartleson and Breneman on surround and apparent contrast | from memory |

Not reachable at all: the Activision copy of source 7 (404), web.archive.org, Wikimedia Commons and its image host.

Local material: `research2/dots/parts/02.md` (read in full); the researcher's transcript (read in full); their
scripts `measure.py`, `calc1.py`, `calc2.py`, `calc3.py` (calc1 and calc3 re-run); `shaders.ts` (SCENE, MAIN_PILE
and the end of MAIN_SURFACE read; COMMON through the transcript); `materials/_lib.glsl` (read from the level-of-
detail helpers to the sparkle); `engine.ts` (the lamps, the uniforms, the floor sprite, `applyTheme`); the
researcher's renders of plush, cotton and clay.
