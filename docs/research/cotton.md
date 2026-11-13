# Smooth cotton: research for a real-time procedural SDF shader

Material: a fine, smooth cotton cloth (T-shirt jersey, or poplin / quilting cotton) on a small stuffed toy.
Target: the single-pass WebGL2 SDF ray-marcher in `web/src/components/yeti/mascot/shaders.ts`, 28 to 400 CSS px.

Every claim below carries one of three labels: **[read]** (I opened the page or extracted the PDF text),
**[snippet]** (search-result text only), **[memory]** (my own knowledge, not checked online). Numbers marked
**[checked]** were reproduced numerically in this session (scripts in
`/tmp/claude-0/-home-user/18e70920-d84a-5037-a458-5e9db3778612/scratchpad/research/check/`, results in the appendix).

---

## 0. The short version

1. **At every size the app shows, cotton is made by its lobes, not by its weave.** With a 20 cm toy, one device
   pixel is 0.31 mm at best (400 CSS px on a 2x screen) and 4.4 to 8.8 mm at 28 px. A real jersey wale is 0.69 mm
   and a poplin thread 0.19 mm: at or below the Nyquist limit even in the largest view (section 1).
2. **The lobes:** a rough diffuse base (EON, roughness 0.5) under a weak, broad, pale fuzz lobe (Zeltner's LTC
   sheen, weight 0.35, roughness 0.7). No specular lobe at all. The brightest body pixel is still the dye colour.
3. **What separates it from the other fabrics in the picker at 28 px:** no highlight (elastane has one), a crisp
   outline with at most a pixel of softening and no halo (plush has a wide pale halo, the curly woven a bumpy
   outline), an even flat tone on the lit side, a thin rim under the back light, and thin dark construction lines
   (seams, limb joins) with a little pillowing.
4. **Close up** (it fades in between 200 and 400 CSS px on a 2x screen, and is complete only at 400 or zoomed): a
   knit drawn at twice real scale (wale 0.014 units) as columns of V stitches, never ruler-straight; puckered
   seams with a 2.7 mm stitch rhythm; a sparse halo of stray fibres that lights up against the back light; lint
   on dark dyes.
5. **Cost:** about 47 SDF evaluations beyond the primary march and 5 noise lookups per pixel, well inside the
   budget. Nothing needs a second ray.
6. **Three things to get right or it looks computer-made:** do not stack wrap lighting on a rough diffuse (the limb
   turns brighter than the centre); replace detail by its average when it goes under a pixel, never just switch it
   off; put every discontinuity of the pattern under a seam, as a real toy does.

---

## 1. Scale: what one pixel is

From `engine.ts`: the camera frames the body with `fov` such that the view is `(H + 0.16) * 1.14` units tall
(2.46 units for a 2-unit body), `uPix = 2 tan(fov/2) / h`, and `h = cssPx * min(devicePixelRatio, 2) * quality`
(`quality` drops from 1 to 0.6 when frames are slow). `gPix = t * uPix` is the footprint at the hit, in units.

I fix the real size as **1 unit = 100 mm** (a 20 cm toy). Everything else follows.

| View | device px tall | `gPix` (units/px) | mm per px |
|---|---|---|---|
| 400 CSS px, 2x screen | 800 | 0.0031 | 0.31 |
| 400 CSS px, 1x (or 200 px at 2x) | 400 | 0.0062 | 0.62 |
| 400 CSS px, 2x, quality 0.6 | 480 | 0.0051 | 0.51 |
| 96 CSS px, 2x | 192 | 0.0128 | 1.28 |
| 64 CSS px, 2x | 128 | 0.0192 | 1.92 |
| 28 CSS px, 2x | 56 | 0.044 | 4.4 |
| 28 CSS px, 1x | 28 | 0.088 | 8.8 |

| Real feature | mm | units | px at 400 px 2x | px at 28 px 2x |
|---|---|---|---|---|
| cotton fibre (ribbon width) | 0.012 to 0.020 | 0.00015 | 0.05 | 0.003 |
| yarn, Ne 30 | 0.17 | 0.0017 | 0.55 | 0.04 |
| poplin warp pitch (133 ends/inch) | 0.19 | 0.0019 | 0.6 | 0.04 |
| quilting cotton pitch (68 x 68) | 0.37 | 0.0037 | 1.2 | 0.08 |
| jersey course pitch | 0.52 | 0.0052 | 1.7 | 0.12 |
| jersey wale pitch | 0.69 | 0.0069 | 2.2 | 0.16 |
| fuzz (most protruding fibre ends) | 0.3 to 0.8 | 0.003 to 0.008 | 1 to 2.6 | 0.07 to 0.18 |
| a long stray fibre | 2 to 3 | 0.02 to 0.03 | 6.5 to 10 | 0.45 to 0.7 |
| seam groove width | 1.2 to 1.5 | 0.012 to 0.015 | 4 to 5 | 0.3 |
| stitch length | 2.5 to 3 | 0.025 to 0.03 | 8 to 10 | 0.6 |
| stuffing lumps | 30 to 60 | 0.3 to 0.6 | 100 to 190 | 7 to 14 |

Consequences:

- **True-scale weave cannot be resolved.** A periodic pattern needs about 4 px per period to be drawn without moire.
  Jersey wales get 2.2 px in the best case, poplin 0.6. So the report draws the knit at a **stated exaggeration of
  2.0x** (wale 0.014 units = 1.4 mm, course 0.0105 units). That is honest fabric: it equals a real heavy jersey
  on a 20 cm toy, or T-shirt jersey on a 10 cm toy. It gets 4.5 px per wale at 400 px on a 2x screen and is faded
  out everywhere else (thresholds in 4.6).
- **The fuzz is a sub-pixel layer** except in the largest view. The existing plush shell (`FUZZ = 0.016` in `main`)
  is 1.6 mm at this scale: right for plush or brushed flannel, about three times too deep for smooth cotton.
- **Seams are the only fabric structure that is near a pixel at mid sizes**, and stuffing lumps the only one above a
  pixel at 28 px. They carry the "sewn object" reading when the weave cannot.

---

## 2. The real material (only what explains the look)

### 2.1 Fibre

- Cotton is a **staple** fibre: 22 to 35 mm long [memory], a flat twisted ribbon 16 to 20 micrometres wide (I
  remember 12 to 20 [memory]) with a kidney-shaped cross-section and a hollow lumen, and 50 to 100 convolutions
  per inch (another source gives 40 to 65 per cm) [snippet: Cotton Incorporated and textile-school pages].
- Sadeghi et al. note that their fibre model assumes cylinders, which is "generally true with the exception of
  cotton, which resembles a flat ribbon" [read].
- Cellulose is birefringent: refractive index about 1.56 to 1.59 along the fibre and 1.52 to 1.54 across it
  [snippet]. Normal-incidence Fresnel reflectance of a fibre surface is therefore about 4.5 to 5 % [derived].
- **Why it is matte:** every fibre is a ribbon that turns over a few times per millimetre, so no two neighbouring
  facets agree, and the fibre ends stick out of the yarn. There is no coherent surface for a highlight to form on.
  Mercerising proves the point: caustic soda under tension untwists the ribbon ("deconvolution") and leaves "nearly
  circular cotton fibres", and that alone gives the lustre of mercerised cotton [read: Wikipedia, Mercerised
  cotton]. Polyester and silk are continuous smooth filaments, which is where their streak highlights come from.

### 2.2 Yarn

- T-shirt yarn is ring-spun, single, about Ne 30 (20 tex). Diameter by the usual rule `d = 1 / (28 sqrt(Ne))` inch:
  **0.166 mm** for Ne 30, 0.143 mm for Ne 40 [snippet for the formula, arithmetic mine].
- Fibres lie at a twist angle of roughly 20 to 30 degrees to the yarn axis [memory]. At our scale the twist is
  0.05 px wide: it never shows as lines, only as the absence of any yarn-direction highlight.
- **Hairiness:** fibre ends, loops and wild fibres stand off the yarn. The Uster H index is the total length of
  protruding fibre in centimetres per centimetre of yarn [read]; typical ring-spun cotton values are about 4 to 8
  (mill trials 5.04 to 8.45 [read]; compact spinning 4.21 against 5.01 for ring [snippet]). The Zweigle S3 value
  counts only hairs of 3 mm or more, which are rare. The length distribution is close to exponential [memory]: so
  **most of the fuzz is under 1 mm, with a few strays of 2 to 3 mm**. Singeing removes much of it on premium
  smooth cotton but, in one source's words, does not fully remove the shorter projecting hairs [snippet]; enzyme
  "bio-polishing" does the same job chemically [memory].

### 2.3 Cloth

**Single jersey** (T-shirts, baby clothes, and many soft toys): one yarn knitted in rows of interlocked loops.

- The face shows vertical columns (wales) of V-shaped stitches; the back shows horizontal bumps. It stretches
  mostly across the wales and its wales lean a few degrees ("spirality") because the yarn is twist-lively [memory].
- Peirce's loop model gives loop length `l = 16.66 d` [read], so 2.77 mm for Ne 30; wale spacing about `4 d` and
  course spacing about `3.46 d` [memory]. With Munden-type constants (courses per cm = Kc / l, wales per cm =
  Kw / l, Kc about 5.0 to 5.5 and Kw about 3.8 to 4.2 with l in cm [memory; the definitions are in the snippets,
  the values are not]) a 30s jersey has about **14.4 wales/cm (0.69 mm) and 19 courses/cm (0.52 mm)**.
- 30s single jersey weighs 150 to 160 g/m2, 40s combed 135 to 145 [snippet]; it is about 0.45 to 0.6 mm thick
  [memory].

**Plain weave** (poplin, broadcloth, quilting cotton):

- Poplin is a "strong, plain-weave fabric with a fine cross-rib"; the rib comes from a heavier weft, and with equal
  yarns the surface is plain [read: Wikipedia, Poplin]. A common shirting construction is 133 x 72 threads per inch
  in 40s yarn [memory; two searches found no source for it]: warp pitch 0.19 mm, weft pitch 0.35 mm.
- Quilting cotton is about 68 x 68 threads per inch (60 x 60 for broadcloth solids, up to 78 x 78) [snippet]:
  0.37 mm pitch both ways.
- Cover is not total: a typical white cotton T-shirt has UPF about 5 to 7, so 15 to 20 % of UV passes, and dyeing it
  dark blue more than triples the protection [snippet]. On a stuffed toy the filling sits right behind the cloth,
  so this shows only as slightly paler, less saturated colour where the knit is stretched, never as see-through.

### 2.4 How it scatters light (measurements)

- **No specular peak.** Sadeghi et al. measured a plain-weave linen (the nearest cellulose staple fabric; cotton
  itself was not in their measured set): it "produces a smooth reflection with no specular peaks under most
  lighting conditions, except when the fabric is observed at a grazing angle and the light is also grazing", where
  "reflectance increases substantially" [read].
- **The fitted numbers** (Table 2 of the 2011 technical report, which is the version I could open; the TOG 2013
  tables may differ) [read]: linen threads have a surface lobe width `gamma_s = 12` degrees, a volume lobe
  `gamma_v = 24` degrees and an isotropic share `k_d = 0.3`. Flat polyester threads: 2.5, 5 and 0.1.
  Flat silk: 5, 10 and 0.2. So the staple plant fibre has a lobe about five times wider and three times the
  isotropic scatter, and the authors added the isotropic term precisely "to account for cellulose based fibers such
  as cotton and linen, which predominantly yield isotropic volume scattering instead of a forward scattering cone".
- **A tinted grazing gain.** Burley on the MERL fabrics: "many of the fabric samples ... exhibit a specular tint at
  grazing angles and also have a Fresnel peak that is stronger than with materials of comparable roughness", which
  "could be explained by the fact that cloth often has transmissive fibers which pick up the material color near
  object silhouettes" [read]. This is the "sheen" every cloth model adds, and for cotton it is weak and coloured.
- **Rough-diffuse behaviour.** Burley also notes that rough materials show a peak in grazing retro-reflection where
  smooth ones show a drop [read]. That is the flat, "full moon" look of matte cloth lit from the camera.
- **What games found.** Ready At Dawn's textile library led them to: "soft specular lobes with large smooth
  falloffs", "fuzz on the rim of objects from asperity scattering", "a low but noticeable specular contribution at
  front facing angles", and a diffuse term added so the velvet model also covers "suede and cotton" [read].
- **Albedo** [memory, not checked]: bleached white cotton reflects about 0.80 to 0.88; black reactive-dyed cotton
  about 0.03 to 0.05 (it reads charcoal, never the black of a glossy plastic); saturated dyes reach 0.5 to 0.7 in
  their own band and 0.03 to 0.08 outside it.

---

## 3. Visual cues

### 3.1 Cues that survive at small size (ranked)

1. **No highlight.** The brightest pixel of the body is the dye colour, not white. Next to the glossy black eyes,
   whose reflections are the only specular in the picture, this is the strongest single signal of "cloth".
2. **Flat, even tone on the lit side.** Lit from near the camera, a matte cloth ball keeps most of its brightness
   out to the edge. With the lobes recommended here the edge (at 98 % of the radius) keeps 74 % of the centre's
   brightness; a Lambert ball keeps 20 % [checked]. The picture reads as a soft disc, not a shaded sphere.
3. **A crisp outline.** At 28 px the fuzz is 0.1 px deep: the edge is clean, with at most one pixel of
   antialiasing and no halo. (This is the main difference from plush.)
4. **A soft, short terminator and soft shadows that are never black.** The softbox wraps the light a little way
   round; fill and floor bounce keep the shadow side at roughly a quarter to a third of the lit side.
5. **Colour that deepens in the creases.** Where limbs meet the body and along seams, the shade is darker and
   more saturated, not greyer (inter-reflection between dyed surfaces). On white the creases stay light.
6. **Construction.** One or two thin low-contrast dark lines (seams, limb joins) and a slightly lumpy, pillowed
   outline: a sewn, stuffed object rather than a set of perfect ellipsoids.
7. **A thin rim under the back light**, in a paler tint of the dye, roughly as bright as plain Lambert would give
   and visibly weaker than the plush's.

### 3.2 Cues visible in close-up (ranked)

1. **The knit or weave relief.** Jersey: columns of small V stitches with a dark groove between wales. Plain weave:
   an over-and-under grid of oval thread crowns. Grooves are darker and more saturated; crowns catch raking light.
2. **Irregularity.** Thick and thin places in the yarn, wales that wander and lean, faint horizontal bands
   (barre), a soft mottle in the dye. Nothing is straight or evenly spaced for more than a centimetre.
3. **Fuzz.** A sparse haze of stray fibres along every silhouette, a few long ones curling off, glowing when the
   back light is behind them; and over the surface a haze that flattens the relief toward grazing angles.
4. **Seams.** A groove with a regular pucker every stitch (2.5 to 3 mm), cloth pillowing out on either side, the
   seam's ridge slightly paler from wear; one hand-closed seam with uneven ladder stitches.
5. **Soft creases** fanning from the joins, and dimples where the stuffing is uneven.
6. **Lint and pills**, most visible on dark dyes: pale specks and short pale fibres lying on the surface.
7. **A broad pale sheen toward grazing, with no streak.** No highlight follows the thread direction (silk and
   polyester satin show one).

### 3.3 Imperfections that make it read as real

- Wales lean 2 to 5 degrees and do not meet across a seam.
- The cloth is a little paler and flatter where it is stretched over the widest part of the body.
- Seam puckers are not all the same depth; one seam is hand-sewn and uneven.
- The outline has lumps of 3 to 6 cm wavelength and 0.5 to 1 mm height.
- Dye is slightly uneven at a 3 to 10 cm scale (2 to 3 %), and raised ridges are worn paler.
- Lint: a few specks of a paler colour per square centimetre on dark cloth; near-black is charcoal with a grey haze
  at grazing angles.
- White is not pure white: 0.85, with creases only a few per cent darker.

### 3.4 How it must differ from its neighbours in the picker

| Against | Cotton has | The neighbour has |
|---|---|---|
| Short curly plush (the existing material) | crisp outline, even tone, thin rim, visible seams | a soft pale halo more than 1.5 px wide at any size, mottled "crushed" patches, a strong glowing rim, seams buried in pile |
| Curly messy woven (boucle) | smooth outline, no speckle | loops of 2 to 5 mm that make the outline bumpy and the shading speckled even at 64 px |
| Elastane | no highlight, tiny puckers, fuzz | a clear stretched highlight from the softbox, taut seams, no fuzz, higher contrast |
| Sugar, ice | opaque, no glints | translucency, sparkle, refraction |

---

## 4. Techniques

Conventions used below, matching the shader: a light is a direction `L` and a colour `Lc` with the 1/pi folded in
(`radiance = Lc * albedo * cos` for Lambert), so any BRDF `f` contributes `Lc * f * PI * NoL`.

### 4.1 The base: energy-preserving rough diffuse (EON) [read]

What it is for: cues 3.1 (2) and (4). The fabric's yarn crowns are a rough diffuse surface; its far-field is the
Oren-Nayar family. EON (Portsmouth, Kutz and Hill) is Fujii's variant of Oren-Nayar plus an analytic
multiple-scattering term so that it loses no energy; it is the base diffuse of OpenPBR.

```glsl
const float EON_C1 = 0.5 - 2.0 / (3.0 * PI);          // 0.28779
const float EON_C2 = 2.0 / 3.0 - 28.0 / (15.0 * PI);  // 0.07248
float eonE(float mu, float r) {                       // albedo of the single-scatter lobe at cosine mu (the paper's fit)
  float m = 1.0 - mu, m2 = m * m;
  float g = 0.0571085289 * m + 0.491881867 * m2 - 0.332181442 * m2 * m + 0.0714429953 * m2 * m2;
  return (1.0 + r * g) / (1.0 + EON_C1 * r);
}
// f * PI for albedo rho and roughness r in [0,1]. NoL and NoV must be > 0 (clamp to 1e-3).
// tMin: the smallest cosine the retro term may divide by; pass the terminator's softness w (4.3), never less than 1e-3.
vec3 eonPi(vec3 rho, float r, float NoL, float NoV, float LoV, float tMin) {
  float s = LoV - NoL * NoV;
  float sOverT = s > 0.0 ? s / max(max(NoL, NoV), tMin) : s;
  float AF = 1.0 / (1.0 + EON_C1 * r);
  vec3 ss = rho * AF * (1.0 + r * sOverT);                                     // Fujii Oren-Nayar
  float avg = AF * (1.0 + EON_C2 * r);
  vec3 rhoMs = rho * rho * avg / (vec3(1.0) - rho * (1.0 - avg));
  vec3 ms = rhoMs * max(1e-7, 1.0 - eonE(NoV, r)) * max(1e-7, 1.0 - eonE(NoL, r)) / max(1e-7, 1.0 - avg);
  return ss + ms;                                                              // multiply by cos and Lc outside
}
```

- Parameters: `r = 0.50` where the weave is not drawn, `0.30` where it is (the drawn relief then supplies the
  rest). Range for cotton 0.4 to 0.6.
- Checked: with `rho = 1` the albedo is 1.0000 +/- 0.0001 at every angle and roughness; the single-scatter lobe
  alone would lose 13 % at normal view for `r = 0.5` and 22 % for `r = 1`.
- Cost: about 25 multiplies per light. No lookups.
- Failure modes: **the retro term divides by `max(NoL, NoV)` and blows up where both are near zero**, which is
  exactly the silhouette where a light's terminator crosses it. With the softened terminator of 4.3 the cosine
  that multiplies the lobe is no longer `NoL`, so nothing cancels the division: the first test render had pixels
  several times too bright along the edge. `tMin = w` bounds it (the product is then at most `r * s`), fades it to
  zero at the end of the ramp, and changes nothing where `NoL >= w`. The near-miss layer of 4.9 shades a point
  whose normal is at right angles to the view, so the app would hit this on every outline. Also: with a
  bump-mapped normal `NoL` can be positive where the form is in shade; gate the light with the geometric normal
  (4.3).
- What it gets wrong for cloth: when light and view are on opposite sides (`s < 0`) it darkens, as an opaque rough
  surface should; cloth with fuzz does the opposite. The fuzz lobe (4.2) pays that back. Do not push `r` above
  0.6 or the back-light rim goes dull (checked in the appendix).

Alternatives considered:

- Plain Lambert plus wrap (Filament's cloth, the existing `plushLight`): no flattening on the lit side, so a
  small picture reads as a shaded plastic ball in matte paint.
- `FabricLambert` in Unity HDRP's Cotton/Wool is Lambert scaled by a function of roughness [read: Fabric.hlsl];
  it has no directional effect at all.
- Lommel-Seeliger (`rho / (2 pi (mu_i + mu_o))`, the single-scattering law of a dusty layer; Sadeghi's volume term
  divides by the same sum of cosines): gives a perfectly flat disc and a grazing rise on both sides, but its
  albedo is `rho * (1 - mu ln(1 + 1/mu))`, only 0.31 rho at normal view [checked], so a blend darkens the
  centre. Not recommended; noted because it explains why the microcylinder model brightens at grazing.

### 4.2 The fuzz lobe: Zeltner's LTC sheen, with Charlie as the fallback

What it is for: cues 3.1 (2), (7) and 3.2 (7), and the charcoal look of near-black cotton.

**Preferred: "Practical Multiple-Scattering Sheen Using Linearly Transformed Cosines"** (Zeltner, Burley, Chiang
2022). It is a fit to a layer of fibre-like SGGX microflakes standing along the normal, with multiple scattering;
the authors made it because their earlier (Disney) sheen "lacked significant backward scattering" [read]. It is
OpenPBR's fuzz model, where low roughness gives "a high-sheen fabric appearance" and high roughness "a dusty
appearance" [read]. The original uses 32 x 32 tables of three numbers; **MaterialX ships analytic fits, so no
texture is needed** [read: `mx_microfacet_sheen.glsl`, constants copied exactly]:

```glsl
// directional albedo R(NoV, roughness): how much light the fuzz returns
float ltcSheenR(float x, float y) {
  float s = y * (0.0206607 + 1.58491 * y) / (0.0379424 + y * (1.32227 + y));
  float m = y * (-0.193854 + y * (-1.14885 + y * (1.7932 - 0.95943 * y * y))) / (0.046391 + y);
  float o = y * (0.000654023 + (-0.0207818 + 0.119681 * y) * y) / (1.26264 + y * (-1.92021 + y));
  float t = (x - m) / s;
  return exp(-0.5 * t * t) / (s * sqrt(2.0 * PI)) + o;
}
float ltcSheenA(float x, float y) { return (2.58126 * x + 0.813703 * y) * y / (1.0 + 0.310327 * x * x + 2.60994 * x * y); }
float ltcSheenB(float x, float y) { return sqrt(1.0 - x) * (y - 1.0) * y * y * y / (0.0000254053 + 1.71228 * x - 1.71506 * x * y + 1.34174 * y * y); }
// the lobe over L with its cosine already in it: it integrates to 1. radiance = Lc * tint * R * lobe * PI
float ltcSheen(vec3 L, vec3 V, vec3 N, float NoV, float rough) {
  vec3 X = V - N * NoV;                                   // the frame turns with the view
  float l2 = dot(X, X);
  X = l2 > 1e-6 ? X * inversesqrt(l2) : normalize(cross(N, abs(N.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  vec3 Y = cross(N, X);
  vec3 w = vec3(dot(L, X), dot(L, Y), dot(L, N));
  float a = ltcSheenA(NoV, rough), b = ltcSheenB(NoV, rough);
  vec3 wo = vec3(a * w.x + b * w.z, a * w.y, w.z);
  float q = a / dot(wo, wo);
  return max(wo.z, 0.0) / PI * q * q;
}
```

- Use: `sheen = fuzzC * R * ltcSheen(L, V, N, NoV, rough) * PI` per light (no extra `NoL`), and
  `fuzzC * R * skyIrr(N)` for the sky. `x = NoV` clamped to [1e-3, 1], roughness clamped to [0.01, 1].
- Layering (OpenPBR and glTF both use albedo scaling): `base *= 1.0 - max3(fuzzC) * R` [read]. This replaces the
  constant `baseW = 1.0 - 0.157 * max3(fuzzC)` of `shadePlush` with a view-dependent one.
- Parameters for cotton: **roughness 0.70** (0.6 to 0.8: toward the "dusty" end, because cotton fuzz points every
  way, not up), **weight 0.35** (0.2 to 0.45), tint `mix(sqrt(alb), vec3(1.0), 0.18)`: a paler, less saturated
  version of the dye plus a small white share for the fibres' own surface reflection (0.1 to 0.35; at 0.35 the
  near-black ball in the test render grew a grey outline and read as dusty velvet).
- Checked: the lobe integrates to 1.000 over the hemisphere at every `NoV` and roughness tried; `R` at roughness
  0.7 is 0.65, 0.54, 0.31, 0.16, 0.11 at `NoV` = 0.05, 0.2, 0.5, 0.8, 1.0; at `NoV = 0.2` the lobe sends 55 % of
  its light back toward the viewer's side and 45 % forward.
- Cost: about 60 multiplies, one `exp`, two `sqrt` per pixel plus about 25 multiplies per light.
- Failure modes: (a) **the frame is undefined where `N = V`** (the middle of a ball). Without the fallback tangent
  the lobe spikes to several times its value there (seen in the check: 1.5 instead of 0.13). (b) The lobe includes
  the cosine and is only approximately reciprocal [read]; do not multiply by `NoL` again. (c) The fits are
  MaterialX's, not the paper's tables; if a visible kink appears near `NoV = 1` at low roughness, the tables in
  `tizian/ltc-sheen` are the reference.
- The wiring of `R`, the lobe and the base throughput follows MaterialX's `mx_sheen_bsdf` as I remember it
  [memory]; the two integrals above were checked independently.

**Fallback: "Charlie"** (Estevez and Kulla 2017), already in the shader as `D_Charlie` with `V_Neubelt`.

- The paper's distribution is `D = (2 + 1/r) sin^(1/r)(theta) / (2 pi)` with `r` in (0, 1] [read]. glTF, Filament
  and the shader's `D_Charlie(r, NoH)` use `alpha = r * r` in its place (`a = r * r`), "which results in more
  perceptually linear changes" [read]. So the shader's `FUZZ_R = 0.5` is the paper's `r = 0.25`: a narrow rim.
- For cotton use sheen roughness **0.80 to 0.85** (alpha 0.64 to 0.72) and weight 0.3. Directional albedo with the
  Neubelt visibility at 0.85 is 0.54, 0.44, 0.28, 0.17, 0.12 at `NoV` = 0.05, 0.2, 0.5, 0.8, 1.0 [checked]; use
  the shader's `sheenIBL` fit, or these, for the albedo scaling.
- The paper's own shadowing term, for reference [read]: `Lambda(theta) = exp(L(cos))` for `cos < 0.5`, else
  `exp(2 L(0.5) - L(1 - cos))`, with `L(x) = a / (1 + b x^c) + d x + e`; coefficients for `r = 0` are (25.3245,
  3.32435, 0.16801, -1.27393, -4.85967) and for `r = 1` (21.5473, 3.82987, 0.19823, -1.97760, -4.32054),
  interpolated with `(1 - r)^2`; `G = 1 / (1 + Lambda(o) + Lambda(i))`. Filament, Unity ("V_Charlie is expensive,
  use approx with V_Ashikhmin instead") and the shader all drop it for `1 / (4 (NoL + NoV - NoL NoV))` [read].
- Why it is only the fallback: Charlie is a back-scattering lobe (it peaks where the half vector is at right
  angles to the normal, which never happens for light crossing over the surface toward the viewer). Under this
  studio's back light, 140 degrees off the view axis, the lit edge of a ball is 0.12 with Charlie against about
  0.2 with the LTC lobe (0.19 with the defaults here) and 0.24 for Lambert [checked]. The loss is EON's
  darkening of the forward direction (EON
  alone gives 0.13 there), which Charlie cannot pay back. **Raising Charlie's weight makes it worse**: the albedo
  scaling takes light from the base and the lobe returns none in this direction (0.12 falls to 0.10 at three times
  the weight) [checked]. If Charlie is kept, shade the back light's diffuse with `r = 0` (plain Lambert): the rim
  returns to 0.21 [checked]. Khronos also warns that the simple visibility term "will make the BRDF not energy
  conserving when using the albedo-scaling technique" [read].

**How strong should it be?** Engines disagree. Filament's guidance for denim or cotton is to keep the default
sheen colour, 0.04 [read], which is almost none; OpenPBR-style fuzz for textiles is far stronger. Calibrate on the
near-black dye: it should read charcoal with a faintly paler rim. With the defaults, under a key at 45 degrees,
the middle of a black ball goes from 0.019 to 0.026 and its lit edge from 0.029 to 0.055 [checked]. If the rim
reads as a glowing outline the weight or the tint's white share is too high; if black looks like matte plastic
they are too low.

### 4.3 The terminator and the shadows

- **Do not add wrap lighting to the rough diffuse.** Filament's cloth uses the energy-conserving wrap
  `sat((NoL + w) / (1 + w)^2)` with `w = 0.5` [read], and `plushLight` uses `(NoL + 0.4) / 1.4`. On top of EON
  this over-flattens: lit from the camera, the ball's edge comes out *brighter* than its centre (0.45 against 0.38
  with `w = 0.25`) [checked]. That is a dusty or velvet look, not cotton.
- **Soften only the terminator**, as a large light does. A softbox of angular radius `asin(w)` turns the hard
  `max(NoL, 0)` into a smooth ramp over `[-w, w]` and leaves the rest alone:

```glsl
float softCos(float x, float w) { return x <= -w ? 0.0 : (x >= w ? x : (x + w) * (x + w) / (4.0 * w)); }
```

  Use `w = 0.20` for the key, `0.25` for the fill, `0.10` for the back light. This is a property of the studio,
  not of cotton: every opaque material should share it. Cost: nothing.
- **Gate by the form**: `c *= smoothstep(-w - 0.10, -w + 0.05, dot(Ng, L))` with `Ng` the SDF normal, so the
  weave's perturbed normal cannot light the shadow side. The window must sit below the ramp: a gate that closes
  inside `[-w, w]` (my first version did) cuts the softbox's tail to a third or less.
- **Soft shadow**: keep `softShadow(p + Ng * 0.012, uKey, 5.0)`. Cotton is opaque: use the shadow at full strength
  (the fur path lets 40 % through; cotton must not). The shadow of an arm on the body is one of the few places
  where the eye judges how soft the material's surface is; it should have a penumbra, not an edge.

### 4.4 Colour in creases: inter-reflection

Between two facing surfaces of albedo `rho` that see the outside through a fraction `V`, light bounces until it
escapes: the cavity returns `rho V / (1 - rho (1 - V))` instead of `rho V` (a geometric series; Jimenez et al.
2016 fit the same effect for ambient occlusion [memory]). Per channel this is what makes dyed cloth richer, not
greyer, in its folds:

```glsl
vec3 bounceVis(float vis, vec3 alb) { return vec3(vis) / (1.0 - alb * (1.0 - vis)); }   // use in place of a scalar occlusion
```

- Checked: at `V = 0.4`, a channel with `rho = 0.8` returns 0.615 instead of 0.32; one with `rho = 0.05` returns
  0.021 instead of 0.020. So a coral (0.8, 0.3, 0.2) keeps its red in the crease and loses its green and blue.
- On white (0.85) a crease with `V = 0.7` is only 6 % darker than open cloth; on black, creases are invisible and
  the structure is carried by the fuzz. Both match real cloth.
- Apply to the sky term with the SDF ambient occlusion, and to all terms with the weave's own cavity factor
  (4.6). Cost: nothing.
- This replaces `shadePlush`'s `deep` colour (same hue, richer, past the terminator), which is a pile effect.

### 4.5 Where the pattern's directions come from on a smooth-unioned blob

The shader has no UVs. `cloth()` loops over parts (`uFA`, `uFB`, `uFR`: ellipsoids, round cones, a rounded box,
layers) and blends them with a per-part weight `h`. That is enough to build a fabric frame the way a real toy is
cut:

1. **Which part.** In the `cloth()` loop keep the index of the part with the largest share (the loop's `h` is the
   share of what came before: switch to part `i` when `h < 0.5`), and the distance to the join:
   `seamJ = min(seamJ, abs(di - d) * 0.7)` taken before the blend. The surface where two parts are equally near is exactly where a real limb is sewn on, so the join
   is a seam, and the change of frame is hidden under it. Cost: a few instructions inside a loop that already runs.
2. **Jersey: a tube over each part.** Knit stretches across its wales, so a part wears it like a sock: wales run
   along the part's axis, courses round it, and the number of wales round the part is fixed.

```glsl
// p on part (A, B, R); N the surface normal. uv in units, T across the wales, Bt along them.
void jerseyFrame(vec3 p, vec3 N, vec4 A, vec4 B, vec4 R, out vec2 uv, out vec3 T, out vec3 Bt, out float pitchK, out float pole) {
  bool cone = int(A.w + 0.5) == 1;
  vec3 ax = cone ? normalize(B.xyz - A.xyz) : vec3(0.0, 1.0, 0.0);      // a limb runs along itself; a body stands up
  vec3 q = p - A.xyz;
  float along = dot(q, ax);
  vec3 rad = q - ax * along;
  vec3 front = cone ? normalize(cross(ax, cross(vec3(0.0, 0.0, 1.0), ax)) + 1e-4) : vec3(0.0, 0.0, 1.0);
  vec3 side = cross(ax, front);
  float ang = atan(dot(rad, side), dot(rad, front));                    // 0 at the front; the cut (+-PI) is at the back
  float Rref = cone ? max(R.x, R.y) : max(R.x, R.z);
  uv = vec2(ang * Rref, along);
  pitchK = length(rad) / Rref;                                           // how much the knit is stretched here (1 at the widest)
  pole = smoothstep(0.05, 0.25, 1.0 - abs(dot(N, ax)));                  // the tube closes at the ends: fade the pattern there
  Bt = normalize(ax - N * dot(ax, N) + 1e-5);
  T = cross(Bt, N);
}
```

   - The wale pitch on screen is `PW * pitchK`: finer toward the ends of a part. Use it in the fade (4.6), so the
     pattern disappears where it pinches instead of turning to moire, and lower the albedo's saturation slightly
     where `pitchK` is near 1 (the knit is open there).
   - `Rref` as written suits ellipsoids and round cones. For a rounded box use the larger of its half widths
     (`B.x`, `B.z`). **A layer part (type 6: a hat, a scarf) has no shape of its own** (`R.x` is its thickness):
     give it the frame of part 0, the body it lies on. A limb that points straight at the camera has no "front":
     the `1e-4` keeps the frame finite, but give such a part a fixed reference direction from `looks.ts` instead.
   - The `atan` cut is at the back: put the centre-back seam on it. The poles (crown of the head, tips of limbs)
     are where a real tube is gathered or capped: fade the pattern with `pole` and, in close-up, draw a short
     gathered seam there.
   - The frame is built from the part's own uniforms, so it moves with the part (arms, ears) and cannot swim.
3. **Plain weave: flat panels.** Woven cotton does not stretch, so a toy is made of flat-cut panels. Per part,
   cut the panels with explicit planes in the part's own space (for a two-panel body, the side plane `z = z0`:
   front panel and back panel; for a boxy part, its faces), project each panel flat along its own axis to get
   `uv`, and draw a seam on every cutting plane. Place the cuts by position, not by the normal, so the seam
   distance is an ordinary plane distance. Stretch grows as the surface turns away from the panel's axis (1.41 at
   45 degrees), so a strongly curved part needs more panels or a dart, exactly as in sewing. This is Quilez's
   biplanar idea (use the best axes for the normal instead of blending three [snippet]), but with a seam instead
   of a blend, because a blend of two weaves at different angles reads as moire.
4. **What not to do:** blend three projections of the pattern (double images in close-up), or map by world
   position (the pattern swims when a limb moves).

Body seams to add besides the joins: the side seam (the plane `z = z0` through the widest outline: seen from the
front it sits on the silhouette, where a real two-panel toy has it), the centre-back seam with the hand-closed
stretch near the bottom, and a short dart at the crown.

### 4.6 The weave itself: a height function, its normal, its cavity, and its average

The functions below were plotted and checked for mean and slope (appendix). `uv` is in stitches (jersey: across
wales, along wales) or threads.

```glsl
// single jersey, face side: each wale is a column of V stitches pointing down
float jerseyH(vec2 uv) {
  float a = abs(fract(uv.x) - 0.5);                         // 0: the middle of the wale; 0.5: the groove between wales
  float c = cos(1.5707963 * clamp(abs(a - 0.22) / 0.26, 0.0, 1.0));
  float leg = c * c;                                        // each leg of the V: a soft round ridge
  float st = 0.68 + 0.32 * sin(PI * fract(uv.y - 1.1 * a)); // one stitch per course, slanting, each tucked under the next
  return leg * st;
}
// plain weave: the thread on top alternates like a chessboard
float weaveH(vec2 uv) {
  vec2 i = floor(uv), f = fract(uv) - 0.5;
  vec2 g = mod(i.x + i.y, 2.0) > 0.5 ? f : f.yx;            // g.x across the thread on top, g.y along it
  float top = pow(max(cos(1.5707963 * clamp(abs(g.x) / 0.46, 0.0, 1.0)), 0.0), 1.2) * (0.55 + 0.45 * cos(PI * g.y));
  float under = 0.36 * pow(max(cos(1.5707963 * clamp(abs(g.y) / 0.46, 0.0, 1.0)), 0.0), 1.2);   // the thread it crosses, in the gaps
  return max(top, under);
}
```

(The `max(..., 0.0)` inside `pow` matters: `cos(1.5707963)` is slightly negative and `pow` of a negative base is
undefined in GLSL. It produced NaN in the check until clamped.)

Numbers [checked]: jersey mean height 0.457, RMS slope 3.85 across the wales and 0.44 along them (per stitch);
weave mean height 0.50, RMS slope 1.52 both ways. With the cavity factor below, the mean cavity is **0.90 for
jersey and 0.92 for the weave**; with a relief of 0.10 of a pitch, light at 45 degrees is on average 16 % (jersey)
and 10 % (weave) lower than on flat cloth, of which 10 % and 8 % are the cavity and the rest the tilted facets.

Putting it on the surface:

```glsl
const float PW = 0.014, PC = 0.0105;        // wale and course pitch (twice real T-shirt jersey: see section 1)
void cottonTexture(vec3 p, vec2 uv, vec3 T, vec3 Bt, float pitchK, float pole, float NoV,
                   inout vec3 N, out float cav, out float rough, out float tone) {
  float fp = gPix / max(NoV, 0.25);                                   // the pixel's footprint on the cloth, longer toward the edge
  float fade = (1.0 - smoothstep(0.22, 0.45, fp / (PW * max(pitchK, 0.05)))) * pole;
  cav = 0.90; rough = 0.50;                                           // the averages, used wherever the knit is not drawn
  float thick = fab(p, 55.0, 23.0);                                   // thick and thin places in the yarn
  if (fade > 0.0) {
    vec2 q = uv / vec2(PW, PC);
    q.x += 0.07 * uv.y / PW;                                          // spirality: the wales lean about 4 degrees
    q.x += 0.35 * (fab(p, 18.0, 5.0) - 0.5);                          // and wander
    float e = max(0.06, 0.5 * fp / PW);                               // a step that grows with the footprint filters the slope
    float h = jerseyH(q), hu = jerseyH(q + vec2(e, 0.0)), hv = jerseyH(q + vec2(0.0, e));
    float amp = 0.10 * (0.8 + 0.4 * thick) * fade * mix(0.5, 1.0, NoV);   // (the fuzz hides the relief toward the edge)
    N = normalize(N - (T * (hu - h) / max(pitchK, 0.3) + Bt * (hv - h) * (PW / PC)) * (amp / e));   // (closer wales are steeper)
    cav = mix(0.90, 0.72 + 0.28 * smoothstep(0.0, 0.6, h), fade);
    rough = mix(0.50, 0.30, fade);
  }
  float fine = 1.0 - smoothstep(0.3, 0.9, gPix * 55.0);
  tone = 1.0 + 0.05 * (fab(p, 4.0, 71.0) - 0.5)                       // dye mottle, 2.5 %, at every size
             + 0.04 * (thick - 0.5) * fine                            // yarn by yarn
             + 0.03 * (fab(vec3(0.0, uv.y / (PC * 14.0), 3.0), 1.0, 0.0) - 0.5) * fine;   // barre: bands a dozen courses tall
}
```

- **Level of detail.** The knit is fully drawn while a wale covers at least 4.5 px (`fp / PW < 0.22`) and is gone
  by 2.2 px (`fp / PW > 0.45`). With `PW = 0.014` that is `gPix < 0.0031` (400 CSS px at 2x) down to nothing at
  `gPix > 0.0063` (400 px at 1x, 200 px at 2x), and earlier toward the silhouette and where the tube narrows. The
  55-per-unit yarn noise lasts to about 96 px at 2x. The mottle never fades (its period is 6 px at 28 px on a 2x
  screen).
- **The far-field replacement** is the whole point of the `mix` calls: when the relief goes, its mean cavity (0.90)
  stays in the albedo and its facet tilt moves into the diffuse roughness (0.30 becomes 0.50; at normal incidence
  EON's `AF` falls from 0.92 to 0.87, the same 5 % the facets cost). Without this the body brightens by about a
  sixth as it shrinks, and "pops" when the quality scaler changes resolution. With it, the test render's mean
  brightness changes by 2 % or less across the hand-over (4 % on near-black; appendix). This is the Toksvig/LEAN
  idea (unresolved normal variance becomes roughness [memory]) applied to a diffuse lobe.
- **Cavity colour:** multiply the base by `bounceVis(cav, alb)` (4.4), so grooves are deeper in colour.
- Cost: 3 evaluations of `jerseyH` (about 20 multiplies, one `cos`, one `sin` each), 4 noise lookups. No SDF.
- Failure modes: moire if the fade thresholds are loosened (anything under 4 px per period shimmers when the
  mascot bobs); a visible tile if `fab` is called at a frequency whose 128-cell period is smaller than the body
  (18/unit repeats every 7 units, 55/unit every 2.3 units: both fine; do not go above 60/unit for anything that
  has structure of its own); the normal step `e` must not fall below about 0.06 stitch or the slope aliases.
- For the **plain weave** variant: `uv / pitch` with pitch 0.010 (balanced) or (0.0055, 0.010) for poplin's rib,
  `weaveH` in place of `jerseyH`, averages 0.92 and 0.45, no spirality, a wander of 0.15 thread. It is drawn only
  under zoom; at the app's sizes it is its averages.

Published models and why the above is distilled from them rather than ported: see 4.11.

### 4.7 Seams, puckers, pillowing, stitches

The shader already has `seam(dist, depth, width) = depth * exp(-dist^2 / width^2)`, added to the distance so the
fabric is pulled in. For cotton:

```glsl
// sd: distance to the nearest seam line; s: length along it. Call inside skinM, with gPix set by the march (see below).
float w = max(0.014, 0.75 * gPix);                       // never thinner than three quarters of a pixel
float k = 0.014 / w;                                     // and shallower as it widens, so the line keeps its weight
float rhythm = 1.0 - smoothstep(0.25, 0.5, gPix / 0.027);
float pucker = 1.0 + 0.35 * rhythm * sin(232.7 * s + 1.7 * sin(31.0 * s));   // one pucker per 2.7 mm stitch, not quite regular
d += 0.0065 * k * pucker * exp(-sd * sd / (w * w));      // the seam pulls in
d -= 0.0020 * k * exp(-sd * sd / (9.0 * w * w));         // and the stuffing pillows the cloth out on either side
```

- Real numbers behind it: garment seams run 10 to 12 stitches per inch, 2.1 to 2.5 mm; plush is sewn inside out
  with a 5 to 6 mm allowance, which leaves a groove with a soft ridge either side [memory]. Seam pucker is thread
  tension relaxing after sewing and gathering the cloth, or the two plies feeding at different rates [snippet:
  Coats, Amann].
- In shading, add the seam's own occlusion analytically: `seamAO = 1.0 - 0.30 * k * exp(-sd * sd / (w * w))`, and a
  worn ridge: `tone *= 1.0 + 0.04 * k * exp(-(sd - 1.6 * w) * (sd - 1.6 * w) / (w * w))`. Being analytic, both are
  stable at any size; at 28 px on a 2x screen `w = 0.033`, `k = 0.42`, and the seam is a 0.75 px line about 12 %
  darker than its surroundings, which is how seams look in a thumbnail photograph of a toy.
- **`gPix` must be set while marching** (`gPix = t * uPix` at each step, before `skinD`). At present the non-fur
  march only sets it at the hit. If the march and the later normal, occlusion and shadow taps see different seam
  widths, the surface they agree on is not the same surface.
- Visible stitches (only for the hand-closed seam and any top-stitching): dashes 0.022 long with 0.006 gaps, thread
  0.003 wide, the fabric's own colour times 0.9, each end a small dimple. Fade with `rhythm`.
- Tension folds at a join: `d += 0.002 * sin(9.0 * angRoundJoin) * exp(-(seamJ / 0.06)^2) * rhythm`.
- Cost: arithmetic only, but it runs at every SDF evaluation. Skip it when `sd > 3.0 * w` (one compare).
- Failure modes: a groove narrower than a pixel flickers as the mascot moves (hence the clamp); the shadow ray
  starts 0.012 off the surface, deeper than the seam (0.0065), so the seam casts no shadow of its own, which is
  why `seamAO` is needed; pillowing wider than the gap between two seams makes a ridge.

### 4.8 Stuffing lumps

Real toys are not ellipsoids. Add to the distance, everywhere:

```glsl
float lumps(vec3 p) {
  return 0.008 * sin(5.1 * p.x + 1.3) * sin(4.7 * p.y + 0.4) * sin(5.3 * p.z + 2.1)
       + 0.004 * sin(11.0 * p.x + 0.7) * sin(9.5 * p.y + 1.0) * sin(10.3 * p.z + 2.0);
}
```

0.8 mm and 0.4 mm at 6 and 3 cm wavelengths. No noise lookup, so it is free in the march. It never fades: at
28 px on a 2x screen the long wavelength is 14 px. Keep the amplitude under the smooth-union radius of the joins.
Use the same function for all cloth materials so that swapping materials does not change the outline.

### 4.9 Fuzz at the silhouette and stray fibres

The mechanism is the one in `main` now: while marching, remember the first near miss of the fabric (the closest
approach, within a threshold), and after shading composite a thin layer there. It is the "fins" half of shells
and fins (Lengyel et al. 2001 [memory]): one sample per pixel on the silhouette's tangent surface. For cotton:

```glsl
const float FUZZ = 0.006, FLY = 0.026;                    // the fuzz (0.6 mm), and how far a stray fibre reaches (2.6 mm)
// record the near miss when prevD < FLY + 1.0 * px   (plush: FUZZ + 1.5 * px, with FUZZ = 0.016)
float aa = 1.0 - smoothstep(0.0, 1.0, nmD / gPix);                              // the cloth's own edge, antialiased: one pixel
float detail = smoothstep(0.8, 2.5, FUZZ / gPix);
float strands = snoise(s * 700.0 + 7.0, 0.0);                                    // fibres about 0.15 mm apart
float fz = 0.35 * (1.0 - smoothstep(0.0, 1.0, nmD / FUZZ)) * mix(0.5, smoothstep(0.35, 0.75, strands), detail);
float fly = 0.0;                                                                  // one stray fibre in one cell in six
vec3 ci = floor(s * 60.0), hh = hash33(ci);
if (hh.x < 0.16 && gPix < 0.012) {
  float len = FLY * (0.35 + 0.65 * hh.y), u = clamp(nmD / len, 0.0, 1.0);
  vec3 lean = normalize(T1 * cos(6.2832 * hh.z) + T2 * sin(6.2832 * hh.z));
  vec3 c = (ci + 0.3 + 0.4 * hh.zxy) / 60.0 + lean * (0.0055 * u * u);           // it bends over as it rises
  vec3 dv = s - c;
  float r = length(dv - N * dot(dv, N));
  const float TH = 0.0008;                                                        // 0.08 mm: five real fibres wide, or it vanishes
  fly = (1.0 - smoothstep(TH, TH + gPix, r)) * step(nmD, len) * min(1.0, 2.0 * TH / gPix) * (1.0 - 0.6 * u);
}
float edge = aa * (1.0 - m.ink);                                                  // how much of the pixel the cloth itself covers
float fuzz = max(fz, 0.7 * fly) * (1.0 - m.ink);                                  // and how much the fibres cover, over that
```

- Composite in two steps: first the cloth's own shading at the silhouette (what `hc` is now) with `edge`, then
  the fuzz colour with `fuzz`. Giving the whole layer the fuzz's colour draws a pale outline round the body at
  every size, which is exactly the halo cotton must not have (it showed in the first test render).

- Colour of the layer: the fuzz tint (4.2), lit from both sides: `fuzzTint * (skyIrr(N) + sum over lights of
  Lc * (0.35 + 0.65 * softCos(NoL, 0.5)))`, plus for the back light a forward-scatter term
  `uBackCol * 1.5 * pow(max(dot(-V, uBack), 0.0), 2.0)`. Thin fibres between the camera and the back light glow;
  this halo is the most photographic detail cotton has.
- Sizes: at 400 px on a 2x screen the fuzz is 2 px deep and strays reach 8 px. Below about 165 CSS px on a 2x
  screen `detail` is 0, the strands are replaced by their mean (0.5), the strays are off, and the layer is a 1 px
  antialiased edge with a faint paler fringe. At 28 px it is the antialiasing only: **the crisp edge is the cue**.
- Over the interior the fuzz is not drawn; its effect is the haze in `cottonTexture` (`mix(0.5, 1.0, NoV)` on the
  relief) and the fuzz lobe.
- The fibre taxonomy comes from the fibre-level yarn models: Zhao, Luan and Bala fit CT scans of cotton, rayon,
  silk and polyester yarns and add "a measurement-based model of flyaway fibers" [snippet]; as I remember the
  paper, these are of a hair type (one end free) and a loop type (both ends in the yarn) [memory]. Wu and Yuksel
  generate fibre-level detail on the GPU from yarn control points [snippet]. The one-per-cell stray above is the
  hair type; the strand noise stands in for the loops.
- Cost: 4 SDF evaluations for the normal at the near miss and 1 for the material (as now), 1 noise lookup, 1 hash.
- Failure modes: only the first near miss is kept, so fuzz on an arm in front of the body is drawn but fuzz on the
  body's edge behind an arm's near miss is not (same as plush; invisible at this depth). A stray fibre is clipped
  where it leaves its cell: keep its reach (0.0055) under 0.4 of a cell (0.0067). `TH` below about a quarter of a
  pixel only dims the fibre; do not try to draw true 15 micrometre fibres.

### 4.10 Lint, pills, wear

- Lint: cells of 0.1 units on the surface point, 12 % occupied, each a speck 0.004 across in
  `mix(alb, vec3(0.75), 0.6)`. Scale its opacity by `min(1, (0.004 / gPix)^2)` and by `1 - lum(alb)` so it shows on
  dark dyes and not on white. One hash, no neighbour search (keep the speck inside its cell). Visible only above
  about 300 px.
- Pills (optional, a "loved toy" switch): the same with 0.01 specks that also raise the normal.
- Wear and curvature: the four taps of `skinNormal` already give the mean curvature for free. With tetrahedral
  offsets of length `h`, `laplacian = (d1 + d2 + d3 + d4 - 4.0 * d0) / (2.0 * h * h)` [derived], and `d0` is the
  march's last distance. Lighten convex ridges by up to 4 % and deepen concave folds by the same; it stands in for
  wrinkles too small for the occlusion taps.

### 4.11 The published cloth models: port, distil, or skip

| Model | What it is | Cotton in its data? | Cost here (3 lights) and sky term | Verdict |
|---|---|---|---|---|
| Irawan and Marschner 2012, woven cloth [snippet; Mitsuba plugin read] | BRDF and texture from yarn-segment geometry and fibre twist | Cotton denim and cotton twill among six fabrics (with silk charmeuse, silk shantung, wool gabardine, polyester lining) [read: Mitsuba `irawan.cpp`]; both are twills, not a smooth plain cotton | A pattern lookup and a numerically integrated specular per light; no sky term | **Skip.** Take the layout of the weave as yarn segments and the idea of per-yarn brightness noise for staple yarns. |
| Sadeghi et al. 2013, microcylinders [read, in its 2011 technical-report version] | Far-field: threads as cylinders, surface plus volume lobes, shadowing and reweighting | No. Linen plain weave is the nearest; the paper names cotton only as the ribbon-shaped exception | 2 thread directions x 4 to 8 tangents x 3 lights of Gaussian and Fresnel terms; no sky term | **Distil to parameters.** Its linen fit says: no specular lobe worth drawing, an isotropic body, a grazing rise. |
| Estevez and Kulla 2017, "Charlie" [read] | A grazing back-scatter lobe; albedo-scaled layering | Motivated by velvet-like fibres standing on the normal | In the shader already; sky by the three.js fit `sheenIBL` | **Keep as the fallback** (4.2). |
| Zeltner, Burley, Chiang 2022, LTC sheen [read] | A fit to a fibre-flake volume layer with multiple scattering, forward and backward | No fabric: it is fitted to a simulated fibre layer (the model it replaces "was motivated by measured cloth reflectance") | About 25 multiplies per light with MaterialX's fits; sky by `R * irradiance` | **Port** (4.2). |
| SpongeCake (Wang et al. 2022) [read] and Zhu et al. 2023 [supplement read] | Layered microflake slabs; the cloth model adds ply-level normals, a fibre lobe `k D(h) G / (4 (i.n)(o.n))` with `G = (1 - exp(-T (Li + Lo))) / (Li + Lo)`, a diffuse term that blends Lambert with a ply-normal term, and transmission | Woven and knitted cloth in general; values per scene | One more anisotropic lobe per light plus a fibre tangent per pixel; the multiple-scattering part needs a small network evaluated before rendering | **Distil.** The fibre tangent only matters when a yarn covers several pixels, which never happens here at true scale. Revisit for a zoomed "material preview". Their far-field comparison says a far-field model "falls short on demonstrating fine geometric details": we have none to show anyway. |
| Montazeri et al. 2020 and 2021, ply-based [knit paper read] | Explicit ply curves with fibre detail from a 1D normal and tangent texture | Fitted to photographs of real samples | Needs curve geometry | **Skip.** Take the idea that fibre twist is a 1D pattern round the ply. |
| Zhao et al. 2016; Wu and Yuksel 2017, fibre level [snippet] | Procedural yarns of plies and fibres with flyaways; real-time on a GPU with 20 M curves | Cotton yarns fitted | Geometry | **Skip.** Take the flyaway types (4.9). |
| Filament cloth; Unity HDRP Cotton/Wool; Unreal Cloth; The Order: 1886 [read, read, snippet, read] | What ships: a sheen distribution without Fresnel or shadowing, a diffuse term, sometimes wrap | Cotton by name (Filament: denim or cotton; Unity: cotton, wool, linen; Ready At Dawn: suede and cotton), none fitted to a measurement | Cheap | **Study** for what they leave out (section 7). |

---

## 5. The recipe for this renderer

Cotton is a surface material: use the plain path of `main` (trace, shade once, composite the near-miss layer), not
the volumetric fur march. With the part lists of the make-your-own mascots, `skinM` is `cloth(p, 0.0, ...)` plus
the displacements below.

**Step 1. Geometry (inside the distance function).**
`d = cloth(...) + lumps(p) [4.8] + seams [4.7]`, with seams at part joins (`seamJ`), at the side plane, down the
back, and a dart at the crown. Set `gPix = t * uPix` at every march step.

**Step 2. At the hit, once.**
`Ng = skinNormal(p)`; `ao = calcAO(p, Ng)`; `shK = softShadow(p + Ng * 0.012, uKey, 5.0)`; curvature from the
normal's taps [4.10]; the dominant part and its frame (`jerseyFrame`) [4.5]; the seam distance `sd` again for the
analytic seam terms.

**Step 3. Texture.**
`cottonTexture(...)` [4.6] gives the perturbed `N`, the cavity `cav`, the diffuse roughness `r` and the tone.
Under embroidery (`m.ink`) keep `Ng`, as now.

**Step 4. Colour.**

```glsl
vec3 alb = clamp(dye, 0.03, 0.86) * tone * wear;            // black is charcoal, white is not paper
alb = mix(alb, vec3(lum(alb)), 0.06 * pitchK * pitchK);     // slightly washed where the knit is stretched open
vec3 fuzzTint = mix(sqrt(alb), vec3(1.0), 0.18);
vec3 fuzzC = 0.35 * fuzzTint;                               // weight 0.35
```

**Step 5. Lobes.**

```glsl
const float FUZZ_ROUGH = 0.70;
vec3 cottonLight(vec3 L, vec3 Lc, float w, vec3 N, vec3 Ng, vec3 V, vec3 alb, float r, vec3 fuzzC, float R, float sh) {
  float NoL = dot(N, L), NoV = max(dot(N, V), 1e-3);
  float c = softCos(NoL, w) * smoothstep(-w - 0.10, -w + 0.05, dot(Ng, L));   // (the knit's normal must not light what the form shades)
  vec3 base = eonPi(alb, r, max(NoL, 1e-3), NoV, dot(L, V), max(w, 1e-3)) * c * (1.0 - max3(fuzzC) * R);
  float sheen = NoL > 0.0 ? ltcSheen(L, V, N, NoV, FUZZ_ROUGH) * PI * R : 0.0;
  return Lc * (base + fuzzC * sheen) * sh;
}
vec3 shadeCotton(vec3 p, vec3 N, vec3 Ng, vec3 V, vec3 alb, vec3 fuzzC, float r, float cav, float ao, float seamAO, float shK) {
  float NoV = max(dot(N, V), 1e-3);
  float R = ltcSheenR(NoV, FUZZ_ROUGH);
  float occ = ao * seamAO * mix(0.55, 1.0, smoothstep(-0.05, 0.45, p.y + 0.25 * Ng.y));   // (the floor hides the underside, as now)
  vec3 cavC = bounceVis(cav, alb);                                                         // the knit's own grooves
  vec3 col = skyIrr(N) * (alb * bounceVis(occ, alb) * cavC * (1.0 - max3(fuzzC) * R) + fuzzC * R * occ);
  vec3 a2 = alb * cavC;
  col += cottonLight(uKey,  uKeyCol,  0.20, N, Ng, V, a2, r, fuzzC, R, shK * mix(0.75, 1.0, occ));
  col += cottonLight(uFill, uFillCol, 0.25, N, Ng, V, a2, r, fuzzC, R, mix(0.5, 1.0, occ));
  col += cottonLight(uBack, uBackCol, 0.10, N, Ng, V, a2, r, fuzzC, R, occ);
  return col;                                                                              // no specular term of any kind
}
```

Weights, in one place: diffuse `alb` through EON with `r = 0.50` (0.30 where the knit is drawn), scaled by
`1 - max3(fuzzC) * R`; fuzz lobe weight 0.35, roughness 0.70, tint as above; specular 0; transmission 0.

**Step 6. Subsurface and transmission.** None. The cloth is 0.5 mm of opaque dyed fibre over stuffing. The light
that "creeps" is handled by the softbox ramp (4.3) and the inter-reflection colour (4.4). Optional, for flat
unstuffed ears only: `thinness()` (two SDF taps, already in the snow path) times the back light times
`alb * alb`, at most 10 %.

**Step 7. The fuzz layer.** Composite the near-miss layer of 4.9 with `FUZZ = 0.006`, `FLY = 0.026`, maximum
coverage 0.35, edge antialiasing over one pixel.

**Step 8. Level of detail** (all by `gPix`, units per pixel):

| Detail | Fully drawn | Gone | Replaced by |
|---|---|---|---|
| knit relief (`PW` 0.014) | `gPix < 0.0031` | `> 0.0063` | cavity 0.90 in the albedo, roughness 0.50 |
| yarn thick and thin (55/unit) | `< 0.0055` | `> 0.016` | nothing (its mean is 1) |
| stray fibres | `< 0.0016` (dimming as `0.0016 / gPix` above that) | `> 0.012` | nothing |
| fuzz strands | `< 0.0024` | `> 0.0075` | mean coverage, then a 1 px edge |
| lint | `< 0.004` (opacity `(0.004 / gPix)^2` above that) | under 5 % past `0.018` | nothing |
| stitch rhythm, pucker, tension folds | `< 0.007` | `> 0.0135` | the even seam |
| seam groove | always | never | width `max(0.014, 0.75 gPix)`, depth and darkening times `0.014 / width` |
| dye mottle, stuffing lumps, occlusion, shadow | always | never | |

**What must still read at 28 px:** the first six cues of 3.1, in that order. In shader terms: no specular term;
EON plus the fuzz lobe; a one-pixel edge; the softbox ramp and fill; `bounceVis` on the occlusion; the clamped
seam with its analytic darkening and the pillowing; the lumps.

**Step 9. Per dye.**

- Snow white: albedo clamps to 0.86. The fuzz adds nothing visible; form comes from shadow, occlusion (weakened
  by `bounceVis`, correctly) and the seams. Check that the key does not push it past the tone curve's shoulder
  (0.76): white cotton should peak near 0.8 on screen, with texture still visible in it.
- Near-black ink: albedo clamps to 0.03. The fuzz tint is about 0.32 grey, the lobe weight 0.11: charcoal with a
  paler rim and visible lint (the ball's mean radiance is about 1.7 times a Lambert black's). This is the one dye
  where the fuzz lobe carries the picture, so tune its weight here.
- Saturated dyes: nothing special; the brightest value stays the dye's (no white highlight), the creases go deeper
  in hue, the rim goes paler.

**Cost per pixel on the cloth** (beyond the primary march):

| Step | SDF evaluations | Noise lookups | Other |
|---|---|---|---|
| normal (also curvature) | 4 | 0 | |
| ambient occlusion | 5 | 0 | |
| soft shadow of the key | up to 32 | 0 | |
| part frame and seam distance at the hit | 1 | 0 | |
| `cottonTexture` | 0 | 4 | 3 pattern evaluations |
| lint | 0 | 0 | 1 hash |
| shading, three lights | 0 | 0 | about 300 multiplies, 1 `exp` |
| fuzz layer: normal, material | 5 | 1 | 1 hash |
| optional thin ears | 2 | 0 | |
| **Total** | **up to 47 (49 with ears)** | **5** | |

Inside the march, `lumps` and the seams add arithmetic to every distance evaluation but no lookups.

**If over budget, drop in this order:** stray fibres; lint; curvature wear; thin ears; the LTC lobe (fall back to
Charlie at 0.8, and use Lambert instead of EON for the back light, see 4.2); EON's multiple-scattering term (keep
the single-scatter line of `eonPi`: up to 13 % darker at `r = 0.5`); the knit's normal (keep its cavity as albedo
only); the pucker. Never drop: the seam clamp, the averages, the one-pixel edge.

**What changes against the existing plush path, in numbers:**

| | Plush (`shadePlush`, `fabricTexture`, the shell in `main`) | Cotton |
|---|---|---|
| diffuse | Lambert with wrap `(NoL + 0.4) / 1.4`, a `deep` colour past the terminator | EON `r` 0.50, softbox ramp `w` 0.20, no wrap, no `deep` |
| fuzz lobe | Charlie, `FUZZ_R` 0.5 (alpha 0.25), full weight, tint `mix(base, sqrt(base), 0.45)`, patches from `crush` | LTC sheen, roughness 0.70, weight 0.35, tint `mix(sqrt(alb), 1, 0.18)`, no patches |
| base under the fuzz | `1 - 0.157 * max3(fuzzC)` | `1 - max3(fuzzC) * R(NoV)` |
| occlusion | scalar | per channel, `V / (1 - alb (1 - V))` |
| micro normal | noise at 90/unit, 0.0016; grain at 300/unit | a knit at 71 wales/unit, relief 0.0014, plus yarn noise at 55/unit |
| shell depth | 0.016 (1.6 mm), full coverage, 1.5 px | 0.006 (0.6 mm), coverage 0.35, strays to 0.026, 1 px |
| key shadow | lets 40 % through in the fur path | full |
| seams | hidden by the pile | drawn: groove 0.0065 x 0.014 with pucker and pillowing |

One thing outside the shader: `looks.ts` places eyes and glasses against the pile's surface (`PILE`, 0.05 for the
body; an eye's centre sits 0.03 behind it). Cotton has no pile, so unless the placement uses the cloth's own
surface for this material they will float about 0.05 units off it.

---

## 6. What the shared studio must provide for cotton

Cotton reflects no image, so it needs none; it needs good *light*.

- **Irradiance with a direction.** `skyIrr(N)` (a sky-to-floor gradient) is enough. The floor's bounce should carry
  a trace of the floor's colour, and the sky should be clearly brighter than the floor, or the underside and the
  creases lose their shape. Key to fill about 3:1 to 4:1; flatter than that and matte cloth turns to cardboard.
- **A large key, with a penumbra.** The softbox's angular radius sets `w` in `softCos` (0.20 is a box about 23
  degrees across as seen from the toy) and the softness constant of `softShadow`. These two numbers should come
  from the same place, and be shared by every opaque material.
- **A raking component.** The key should sit 40 to 60 degrees off the camera axis (it is at about 60 now), so that
  seams, lumps and, in close-up, the knit cast and catch light. A key on the camera axis erases all relief.
- **A back light for the fuzz**, behind and above (it is 140 degrees off the view axis now): it draws the thin
  rim on the body and makes stray fibres glow. Cotton needs it less bright than plush does; the difference in
  response is itself a cue.
- **For the eyes, not the cloth:** the environment function should show the softbox as a bright shape. The eyes'
  crisp reflection of it beside a body that reflects nothing is what tells the viewer the body is cloth.
- **Tone mapping:** the Khronos neutral curve starts compressing at 0.76 and desaturates above it. Keep cotton's
  brightest values under about 0.8 so bright dyes (sun yellow) do not whiten; whitening reads as gloss.

---

## 7. Examples worth studying

| Example | Status | Exactly what to take |
|---|---|---|
| MaterialX `libraries/pbrlib/genglsl/lib/mx_microfacet_sheen.glsl` | read | The texture-free Zeltner sheen (the three rational fits and the lobe), and the Imageworks sheen with its analytic albedo fit. This is the code to port. |
| `tizian/ltc-sheen` (GitHub) | read (README) | The definition of the lobe and its tables; the reference if the fits misbehave. |
| OpenPBR specification, Fuzz and base diffuse | read | The layering formula `F f_fuzz + (1 - F E_fuzz) f_base` and the fact that the tint is kept out of the base's scaling; roughness 0.5 default, "dusty" at high values. |
| EON paper and `portsmouth/EON-diffuse` | read (paper) | `eonPi` above; their GLSL listing has the exact and the fitted albedo. |
| Filament design document, "Cloth model" | read | A shipped cloth: Charlie without Fresnel, the Neubelt visibility, wrap diffuse with `w = 0.5`, and for denim or cotton the default sheen colour of 0.04. Take the structure; do not take the wrap (4.3). |
| Narkowicz, "Cloth Shading", and its Shadertoy `4tfBzn` | read (post); shader source not readable | Side by side Ashikhmin's inverted Gaussian and Charlie on the same object; shows how the terminator behaves with each. |
| Unity HDRP `Fabric.hlsl`, Cotton/Wool branch | read | How little a production cotton needs: `D_Charlie`, `V_Ashikhmin`, a fuzz tint in place of Fresnel, `FabricLambert`. Thread maps (occlusion, normal, smoothness) and a fuzz map carry the close-up. |
| Ready At Dawn course notes 2013, "Cloth Shading" | read | The list of what their textile scans showed (quoted in 2.4), and the smoother denominator. |
| Sadeghi et al., Table 2 and the linen measurements | read | The numbers that say cotton has no highlight: 12 and 24 degree lobes, `k_d` 0.3, against 2.5 and 5 for polyester. |
| Mitsuba 0.x `irawan` plugin and its `.weave` files | read (plugin source) | Text descriptions of real weaves as yarn segments (cotton twill and denim among them): a model for describing a pattern procedurally. |
| Shadertoy `wl3GDH`, "[I3D'20] Textile" | snippet | Described in the search result as a simple textile example whose fibres try to keep the same width: constant-width procedural threads, the anti-aliasing problem in miniature. |
| Shadertoy `lsXfWS`, Ashikhmin-Shirley on a ray-marched sphere | snippet | Only as a contrast: what an anisotropic highlight looks like, which cotton must not have. |
| Shadertoy tag `fabric` ("Silky Carbon Fabric", "Textured Cloth", "Cloth Draping + Shadows", "Sport Mesh" `ct23WK`) | snippet | Pattern ideas; none is a matte cotton. I could not read any Shadertoy source (the pages are script-rendered), so nothing here is taken from their code. |
| Zhu et al. 2023 and 2024, surface-based cloth | supplement read; papers snippet | For a later zoomed preview: ply-level normals and the blended diffuse term (2023, from the supplement). The 2024 paper is a multi-scale version of the same model; going by its title and abstract only, it should be the principled form of 4.6's averages, and is the first thing to read if the hand-over ever shows. |
| Quilez, "biplanar mapping" and "filtering procedurals" | snippet (pages returned 404) | Two-axis projection chosen by the normal; filtering a procedural pattern over the pixel footprint instead of clamping it. |
| ThunderLoom (`vidarn/ThunderLoom`) | snippet | An open implementation of the Irawan model with weave drafts in the WIF format: a library of real weave layouts. |
| The Computer Graphics Forum knit-stitch paper (source 46) | snippet | A parametric knit stitch evaluated without textures and mapped straight onto a surface, with parallax for the loops: the closest published relative of `jerseyH`, for a later version with real loop geometry. |

---

## 8. Sources

### Read (22)

1. Estevez and Kulla, "Production Friendly Microfacet Sheen BRDF", 2017. https://blog.selfshadow.com/publications/s2017-shading-course/imageworks/s2017_pbs_imageworks_sheen.pdf
2. Sadeghi, Bisker, De Deken, Jensen, "A Practical Microcylinder Appearance Model for Cloth Rendering" (the 2011 UCSD technical report of the TOG 2013 paper). https://escholarship.org/uc/item/6v11p5b0
3. Neubelt and Pettineo, "Crafting a Next-Gen Material Pipeline for The Order: 1886", course notes 2013. https://blog.selfshadow.com/publications/s2013-shading-course/rad/s2013_pbs_rad_notes.pdf
4. Burley, "Physically Based Shading at Disney", notes v3 (read from a mirror). https://cgvr.informatik.uni-bremen.de/teaching/cg_literatur/Brent%20Burley%20-%20s2012_pbs_disney_brdf_notes_v3.pdf
5. Filament design document, Cloth model. https://google.github.io/filament/Filament.md.html
6. Narkowicz, "Cloth Shading", 2018. https://knarkowicz.wordpress.com/2018/01/04/cloth-shading/
7. `tizian/ltc-sheen` README. https://github.com/tizian/ltc-sheen
8. Zeltner, Burley, Chiang, project page. https://tizianzeltner.com/projects/Zeltner2022Practical/
9. OpenPBR specification. https://academysoftwarefoundation.github.io/OpenPBR/
10. KHR_materials_sheen. https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_sheen/README.md
11. MaterialX `mx_microfacet_sheen.glsl`. https://raw.githubusercontent.com/AcademySoftwareFoundation/MaterialX/main/libraries/pbrlib/genglsl/lib/mx_microfacet_sheen.glsl
12. Wang, Jin, Hasan, Yan, "SpongeCake". https://ar5iv.labs.arxiv.org/html/2110.07145
13. Zhu, Jarabo, Aliaga, Yan, Chiang, "A Realistic Surface-based Cloth Rendering Model", supplementary document. https://sites.cs.ucsb.edu/~lingqi/publications/supplementary_sig23cloth.pdf
14. Portsmouth, Kutz, Hill, "EON: A practical energy-preserving rough diffuse BRDF". https://arxiv.org/html/2410.18026
15. Unity HDRP manual, "Understand fabrics". https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@17.0/manual/understand-fabrics.html
16. Unity Graphics, `Fabric.hlsl`. https://raw.githubusercontent.com/Unity-Technologies/Graphics/master/Packages/com.unity.render-pipelines.high-definition/Runtime/Material/Fabric/Fabric.hlsl
17. Mitsuba 0.x `irawan.cpp`. https://github.com/mitsuba-renderer/mitsuba/blob/master/src/bsdfs/irawan.cpp
18. Montazeri et al., "A Practical Ply-Based Appearance Modeling for Knitted Fabrics". https://ar5iv.labs.arxiv.org/html/2105.02475
19. Textile School, "Geometrical Modelling of Plain Weft Knitted Fabrics". https://www.textileschool.com/?p=4168
20. "Hairiness in yarn". https://textile-technology.blogspot.com/2008/04/hairiness-in-yarn.html
21. Wikipedia, "Mercerised cotton". https://en.wikipedia.org/wiki/Mercerised_cotton
22. Wikipedia, "Poplin". https://en.wikipedia.org/wiki/Poplin

### Snippet only (25)

23. Irawan and Marschner, "Specular Reflection from Woven Cloth", TOG 2012 (the page returned 503). https://www.cs.cornell.edu/~srm/publications/TOG12-cloth.html
24. Zhu et al. 2023, main paper (over the fetch size limit). https://sites.cs.ucsb.edu/~lingqi/publications/paper_sig23cloth.pdf
25. Zhu et al. 2024, "A Realistic Multi-scale Surface-based Cloth Appearance Model". https://sites.cs.ucsb.edu/~lingqi/publications/paper_sig24cloth.pdf
26. Zhao, Luan, Bala, "Fitting Procedural Yarn Models for Realistic Cloth Rendering", 2016. https://rgb.cs.cornell.edu/papers/fitting-procedural-yarn-models-for-realistic-cloth-rendering
27. Wu and Yuksel, "Real-time Fiber-level Cloth Rendering", 2017. https://people.csail.mit.edu/kuiwu/rtfr.html
28. Montazeri et al., "A Practical Ply-Based Appearance Model of Woven Fabrics", 2020. https://cseweb.ucsd.edu/~henrik/papers/practical_ply_based_cloth_appearance/
29. Unity HDRP, Cotton/Wool shader. https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@15.0/manual/cotton-wool-shader.html
30. Unreal Engine shading models (Cloth). https://dev.epicgames.com/documentation/en-us/unreal-engine/shading-models-in-unreal-engine
31. Shadertoy "[I3D'20] Textile". https://www.shadertoy.com/view/wl3GDH
32. Shadertoy "Anisotropic brdf ashikhmin". https://www.shadertoy.com/view/lsXfWS
33. Shadertoy, shaders tagged fabric. https://www.shadertoy.com/results?query=tag%3Dfabric
34. Shadertoy `4tfBzn` (Narkowicz's sample; the link was read in his post, the shader was not). https://www.shadertoy.com/view/4tfBzn
35. Quilez, "biplanar mapping" (404 on fetch). https://iquilezles.org/articles/biplanar
36. Quilez, "filtering procedurals" (404 on fetch). https://iquilezles.org/articles/filtering
37. Cotton Incorporated, "Cotton for Nonwovens Technical Guide" (fibre dimensions; 403 on fetch). https://cottoninc.com/?p=802
38. Yarn diameter rule `1 / (28 sqrt(Ne))` (in the search-result text; the summary did not say which page carried
    it; the results included this one). https://textileadviser.blogspot.com/2019/09/cotton-yarn-diameter-yarn-diameter-is.html
39. Single jersey weights by yarn count (as 38: one of the result pages). https://www.mh-chine.com/blog/products/single-jersey-material
40. Quilting cotton thread counts (forum posts and a fabric maker's guide among the results). https://www.quiltingboard.com/main-f1/cotton-thread-count-t130896.html
41. UPF of a white cotton T-shirt. https://www.rei.com/learn/expert-advice/sun-protection.html
42. Seam puckering (Coats; Amann). https://www.coats.com/de/info-hub/Eliminating-Seam-Puckering/ and https://www.amann.com/knowledgehub/amann-wiki/preventing-seam-puckering/tension-puckering/

43. Cotton's refractive indices (the range, from textile-physics pages in the results). https://textilestudycenter.com/category/yarn-engineering/textile-physics-1/optical-properties-of-fibre
44. Compact against ring-spun hairiness (Texas A&M / ITC "Textile Topics"). https://cotton.tamu.edu/wp-content/uploads/sites/27/legacy-files/Harvest/ITC%20-%20Textile%20Topics%20-%20Compact%20Spinning%20Effect%20on%20Yarn%20Quality.pdf
45. Definitions of the knit constants Kc and Kw (NPTEL). https://archive.nptel.ac.in/content/storage2/courses/116102008/download/m5faq.pdf
46. A Computer Graphics Forum paper on a texture-free parametric representation of knit stitches with
    curvature-aware parallax (title not retrieved; 403 on fetch). https://diglib.eg.org/bitstream/handle/10.1111/cgf70356/cgf70356.pdf
47. ThunderLoom, "a physically based shader for woven cloth" (an implementation of the Irawan model with a pattern
    editor). https://github.com/vidarn/ThunderLoom

### Memory (not checked online) (10)

48. Oren and Nayar 1994, and Fujii's variant (described in source 14).
49. Koenderink and Pont 2003, "The secret of velvety skin" (asperity scattering; cited in source 1).
50. Lommel-Seeliger law and Chandrasekhar's diffuse reflection (the `1 / (mu_i + mu_o)` term in source 2).
51. Jimenez et al. 2016, multi-bounce ambient occlusion (the closed form in 4.4 is derived here, not quoted).
52. Lengyel et al. 2001, shells and fins.
53. Toksvig 2005; Olano and Baker 2010 (LEAN): normal variance as roughness.
54. Peirce 1947 and Munden 1959: loop geometry and the constants Kc, Kw (values from memory).
55. MaterialX `mx_sheen_bsdf` (how the albedo, the lobe and the base throughput are combined) and its LTC frame.
56. Reflectance of bleached and of black-dyed cotton; fuzz length distribution; staple length; twist angle; stitch
    lengths and seam allowances on toys.
57. Green 2004 (wrap lighting), Quilez's SDF occlusion and soft shadow, the three.js sheen fit: already cited in
    the shader's comments.

Total: 57 sources, 22 read.

---

## Appendix: what was checked

Scripts, in `/tmp/claude-0/-home-user/18e70920-d84a-5037-a458-5e9db3778612/scratchpad/research/check/`:
`check_brdf.py`, `sweep2.py`, `sweep3.py`, `backlight.py`, `black.py` (numpy, 400 x 400 point quadrature over the
hemisphere), `pattern3.py` (the two height functions), and `assemble2.py` with `glsl_test2.js` and `glsl_test3.js`
(the GLSL of this report, extracted from this file and run in headless Chromium).

**The GLSL compiles and renders.** Every `glsl` block in this report was extracted by script, wrapped in a small
test shader (analytic balls, the studio's three lights with their real directions and colours, the app's tone
curve, a hash-based stand-in for the noise texture) and compiled as GLSL ES 3.00 in Chromium's WebGL2 (ANGLE on
SwiftShader): no errors, no warnings. Pictures: `t_final_big.png` (Lambert above, cotton below, six dyes),
`t_final_s56.png` and `t_final_s28.png` (the same at 53 and 27 px across, enlarged), `t_final_close.png` and
`t_final_close2.png` (500 px balls: the knit at 7 px per wale), `edge_crops2.png` (outlines, enlarged).

- What the pictures show: cotton is flatter and softer than Lambert with a paler rim on the key side; near-black
  is charcoal; at 7 px per wale the knit reads as columns of small V stitches and fades cleanly toward the
  silhouette and the poles.
- **The far-field averages hold.** Mean luminance of a 500 px ball with the knit drawn, against the same ball
  with the footprint forced to 0.02 (averages only): 0.998 (lime), 1.001 (coral), 1.014 (cobalt), 0.993 (white),
  1.037 (ink), 0.995 (yellow); within the middle 60 % of the radius, where the knit is fully drawn, 0.98 to 1.04.
  So the hand-over changes brightness by 2 % at most, 4 % on near-black.
- Mean luminance of a cotton ball against a Lambert ball of the same dye: 0.98 for lime, coral and yellow, 0.99
  for white, 1.09 for cobalt, 1.66 for ink (the fuzz lobe: charcoal). So the material neither darkens nor
  brightens a dye; it moves light from the middle to the edge.
- **An honest note on 28 px:** next to a matte Lambert ball of the same colour, the cotton ball differs only a
  little at that size (flatter, slightly paler at the rim, black lifted to charcoal). On the real character the
  reading as cloth comes from the whole of 3.1 together: the eyes' highlights beside a body with none, the clean
  outline, the seams and the lumps.
- Faults found by the pictures (or by review) and corrected in the text, each re-run afterwards: the pale outline
  from colouring the antialiased edge with the fuzz tint (4.9); a fuzz tint with too much white on black (4.2);
  pixels several times too bright along the outline where a light's terminator crosses it, from the retro term's
  division (4.1, `tMin`); a form gate that closed inside the softbox ramp (4.3).
- The tables below come from the Python ports, which have neither `tMin` nor the gate. They differ from the GLSL
  only where both cosines are under `w` (the outer 2 % of a ball's radius).

**Energy.**

| Quantity | Result |
|---|---|
| EON albedo, `rho = 1`, `r` in {0, 0.5, 0.8, 1}, `mu` in {0.1, 0.5, 1} | 0.9999 to 1.0001 |
| Fujii lobe alone, `rho = 1`, `r = 0.5` | 0.986, 0.924, 0.874 |
| EON's fitted albedo against the exact form | equal to 4 decimals |
| Charlie `D` times cosine over the hemisphere, alpha 0.25, 0.64, 1 | 1.0000 |
| Charlie with Neubelt visibility, albedo at sheen roughness 0.5 | 0.69, 0.49, 0.23, 0.09, 0.03 at `NoV` 0.05, 0.2, 0.5, 0.8, 1 |
| the same at 0.85 | 0.54, 0.44, 0.28, 0.17, 0.12 |
| LTC sheen lobe integral, roughness 0.3 to 0.9, all `NoV` | 1.000 |
| LTC sheen albedo fit at roughness 0.5 | 0.62, 0.43, 0.15, 0.04, 0.03 |
| the same at 0.7 | 0.65, 0.54, 0.31, 0.16, 0.11 |
| Lommel-Seeliger albedo | `1 - mu ln(1 + 1/mu)`: 0.76, 0.45, 0.31 |

**A ball of albedo 0.5, viewed along z, light in the x-z plane.** Radiance across the equator at image
x = -0.98, -0.9, -0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75, 0.9, 0.98 (light irradiance pi).

Light on the view axis:

| | | | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Lambert | .10 | .22 | .33 | .43 | .48 | .50 | .48 | .43 | .33 | .22 | .10 |
| **the defaults: EON 0.50 + LTC sheen (0.30, 0.70)** | .35 | .42 | .45 | .47 | .48 | .48 | .48 | .47 | .45 | .42 | .35 |
| EON 0.45 + LTC sheen (0.35, 0.70) | .35 | .41 | .44 | .47 | .48 | .48 | .48 | .47 | .44 | .41 | .35 |
| EON 0.55 + wrap 0.25 (not recommended) | .45 | .39 | .39 | .39 | .38 | .38 | .38 | .39 | .39 | .39 | .45 |

(The sheen's first number is its total weight: 0.35 times a tint of about 0.85 for a mid-toned dye is 0.30.)

Light 45 degrees to the right:

| | | | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Lambert | 0 | 0 | 0 | .13 | .25 | .35 | .43 | .48 | .50 | .47 | .42 |
| **the defaults** | 0 | 0 | .015 | .16 | .27 | .34 | .39 | .43 | .48 | .49 | .49 |
| EON 0.45 + LTC sheen (0.35, 0.70) | 0 | 0 | .015 | .16 | .28 | .35 | .40 | .44 | .48 | .49 | .48 |

Light 140 degrees (the back light), the three rightmost points:

| | 0.75 | 0.9 | 0.98 |
|---|---|---|---|
| Lambert | 0 | .12 | .24 |
| **the defaults** | .01 | .10 | .19 |
| EON 0.45 + LTC sheen (0.35, 0.70) | .01 | .11 | .21 |
| EON 0.55 + LTC sheen (0.25, 0.75) | .01 | .09 | .17 |
| EON 0.45 alone | .01 | .07 | .13 |
| EON 0.30 alone | .01 | .08 | .17 |
| EON 0.45 + Charlie (0.30, 0.80) | .01 | .06 | .12 |
| EON 0.45 + Charlie at three times the weight (0.90, 0.80) | .01 | .05 | .10 |

Near-black (albedo 0.03, EON 0.50), light at 45 degrees, right half of the ball (x = 0, 0.25, 0.5, 0.75, 0.9,
0.98): base alone .019, .021, .024, .027, .029, .029; with the fuzz lobe at total weight 0.113 (the defaults):
.026, .028, .031, .038, .046, .055; at 0.162 (a tint with 0.35 white): .030, .032, .035, .042, .054, .067.

**Patterns** (1024 x 1024 samples over 8 wales or 12 threads; relief 0.10 of a pitch; light 45 degrees):

| | mean height | mean cavity factor | RMS slope across / along | lit mean against flat |
|---|---|---|---|---|
| `jerseyH` | 0.457 | 0.897 | 3.85 / 0.44 | 0.838 |
| `weaveH` | 0.501 | 0.923 | 1.52 / 1.52 | 0.904 |

Box-filtered to 4.5 px per wale the jersey keeps its vertical ribs and a trace of the stitches; at 2.2 px per wale
it is a flat tone with faint stripes that would beat against the pixel grid, which is where the fade ends.

**Not checked:** anything inside the app. The test shader has no distance field, so the parts of the recipe that
live in the march are untested: the seam displacement and its width clamp, the lumps, the part frames across a
smooth union and the seam at the join, the fuzz layer's near-miss bookkeeping (only its coverage and colour were
run, on an analytic ball), soft shadows and occlusion with the new terms, and the frame rate on an integrated GPU.
The stand-in noise is a hash, not the app's 128-cube texture, so tiling was not seen either.
