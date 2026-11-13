# The reference characters' surface ("Dots"), studied forensically, and a recipe for our pile

**How this report was made.** A researcher measured the reference pictures and our renders and was cut off before writing up. Section 2 is that researcher's finished text, unchanged. The rest was written afterwards from the transcript of their work, from the pile's code (`shaders.ts`: `furM`, `fibres`, `furLight`, `shadeFur`, MAIN_PILE; `cotton.glsl`, `boucle.glsl`, `_lib.glsl`; the lamps in `engine.ts`), and from one further measurement of our renders (`scripts/fin_ours.py`). Nothing in the repository was edited, so nothing in the recipe has been compiled or rendered. Only two web pages were opened in the whole study, both news articles; no paper or renderer documentation was read. Where a statement rests on memory it says so.

Units: a mascot's body is 1.5 units wide; one unit is about 13 cm. "px" without more means pixels of the reference row picture, where the frog's body is 175 px wide: 0.0086 units, or 1.1 mm, per pixel.
## 1. Summary

In order of how much each would improve the picture. Reference figures are from the 857 x 261 px row; ours are from a lime frog drawn at the same 175 px per body, given the reference's blur and measured with the same code.

1. **Every outline of the reference carries a pale halo; our plush has none.** Reference: 1.7 to 2.0 times the interior's brightness 2 to 4 px inside the outline (0.017 to 0.035 units), 1.55 times at 8 px, 1.2 times at 15 px, gone by 30 px, on the side away from the key as much as toward it, washed toward white (+0.13 to +0.32 linear in the absorbed channels; +0.09 on black). Our plush: 0.87 to 0.93 times, a darker edge, on both sides. Cotton and boucle: 1.27 times on the key's side and 0.75 to 0.82 on the other. Shrunk to app sizes the reference's halo is still 2.0 times at a 118 px body, 1.8 at 59 px and 1.6 at 24 px: it is the one texture cue that shows at every size. Fix: one view-dependent term in `shadeFur` (recipe 1), negligible cost.
2. **Our grain is three times too weak, half again too coarse, and one colour.** Reference speckle: 7 % RMS in the light and 10 % in shade, correlation 0.56 / 0.11 / 0.01 at 1 / 2 / 3 px, bright specks paler and dark ones deeper in colour (1.31, 1.24, 1.98 in R, G, B). Plush: 2.2 %, 0.76 / 0.38 / 0.10, and 1.15, 1.14, 1.47. Cause: `f.fine = 175` makes a strand 0.66 px wide at this size, so `fibres()` returns 82 % average; and the pile's depth shading is shallow. Fix: `f.fine` 80 and deeper shade (recipe 2), no cost.
3. **The outline is hard.** Reference: coverage rises from 10 to 90 % over 3.4 px (0.029 units), 3.7 to 3.8 px as pictured. Ours: 1.2 to 1.6 px, 2.0 to 2.2 px with the reference's blur, in all three materials. Fix: a sparse halo of the tallest strands above a lower coat (recipe 3), 5 to 10 % of a plush frame by estimate.
4. **Strands are thick tapered clumps combed one way; ours are whorls of ribbons.** Reference: 0.035 to 0.06 units visible, at most 0.009 to 0.015 wide, one lay drifting slowly with about 30 degrees of scatter, tips meeting in small V shapes, no patches combed their own way. Ours: a grid of 0.04-unit patches, each with a random lay, strands bending in step. Fix: one comb direction with scatter, and valleys between clumps (recipe 4); shows at 200 px and up.
5. **The reference is lit from one side; our plush is lit evenly.** Reference bodies brighten toward the key by 0.4 to 0.9 (log luminance per body width, sideways), the shaded side sits at 0.55 to 0.6 of the lit side, and the median is 0.71 of the brightest tone. Our plush: no sideways gradient at all (-0.07), brightening straight upward, median 0.88 of the top. By arithmetic on the lamps, fill plus back lamp cancel the key (1.15 against 1.13). Fix: less wrap, half the back lamp, a lower key (recipe 5).
6. **Cotton and boucle need the same rim on every side and a grain at the reference's size**; cotton keeps its crisp outline, boucle keeps its tangle's tone to smaller sizes (4.5, 4.6).
7. **Our fades throw away more grain than honest shrinking does.** The reference still has 6.7 % speckle at a 118 px body and 4.5 % at 59 px. Boucle drawn large and box-filtered keeps 4.5 to 7.8 %; drawn directly at that size it has 1.7 to 2.7 %.
8. **Who made the characters, and how, was not found, and the recipe is untested.** No credit, studio, software or making-of turned up; no rendering literature was read; every constant in section 4 is arithmetic from the code and the measurements.
## 2. The real thing: what the reference pictures show (measured)

### 2.0 What was measured, and how far to trust it

- **Effective resolution.** `cloud.png`, `frog.png`, `heart_tri.png` and `fibre.png` are plain enlargements (3.9x, 5.5x, 3.6x and 10.9x) of the same picture as `dots_row.png` (857 x 261 px); template matching puts each crop in the row with a normalised correlation of 0.93 to 0.98, and a down-then-up resample at the row's scale loses under 2 levels RMS. So every size below is in **row pixels**, the only real pixels there are. In the row, the frog's body is 175 px wide, the cloud 313 px, the triangle about 200 px, the heart about 230 px, and all are cut off at the bottom.
- **The picture's own blur.** A hard edge inside the picture (the frog's pupil against the white of the eye) is 1.6 px wide from 10 % to 90 %. Anything narrower than about 1.6 px is an upper bound, not a measurement. Fibre width is in that class.
- **Scale.** Taking the frog as "a mascot" (1.5 units, about 20 cm wide), one row pixel is 0.0086 units, about 1.1 mm. The cloud's fibres are the same size in pixels as the frog's (autocorrelation lengths 2.0 px and 1.8 px) although the cloud is 1.8 times wider, so the characters are different sizes wearing the same fur; sizes below are given against the frog.
- **Light is linear, colours are sRGB.** Every ratio is computed in linear light; sRGB hex values are given so they can be eye-checked. Blue and pink clip (blue: B = 255 on 13 % of pixels, R = 0 on 22 %; pink: R = 255 on 5 %), yellow nearly (R = 255 on 3 %), **green does not**, so green is the reference for tone ratios.
- **The cut-out is not coverage.** `dots_row.png` has an alpha channel, but composited on white the outline shows a dark fringe: the picture was rendered on black and matted afterwards without un-mixing the black. So the outline was measured as "colour on black against the interior colour", not from alpha alone.
- **What a camera sees at toy scale** is therefore: at 175 px per body, single strands are 1 to 2 px wide and 4 to 7 px long, and still read as fibres. That is the resolution the app draws a 200 px mascot at, so the reference shows what a 200 px mascot should look like, not only a close-up.

### 2.1 The fibres

| quantity | measured (row px) | as a share of body width (frog) | mascot units | at a 20 cm toy |
|---|---|---|---|---|
| visible length of a strand | 4 to 7 px | 2.3 to 4 % | 0.035 to 0.06 | 4.5 to 8 mm |
| apparent width of a strand | 1.1 to 1.7 px (at the blur limit: upper bound) | under 0.6 to 1 % | under 0.009 to 0.015 | under 1.2 to 2 mm |
| speckle correlation length (autocorrelation falls to 0.3) | 1.9 px along the lay, 1.3 px across (frog); 2.0 / 1.7 (cloud); 1.3 to 1.5 (heart); 1.5 to 1.7 (beret) | about 1 % | 0.011 to 0.016 | 1.5 to 2.2 mm |
| soft outline (10 to 90 % of the interior brightness) | 3.7 to 3.8 px on every character; 3.4 px after removing the picture's blur | 1.9 % | 0.029 | 3.9 mm |
| pale rim band (brightness back to 1.2x interior) | 12 to 15 px | 7 to 8 % | 0.10 to 0.13 | 14 to 17 mm |

- **A strand is a clump, not a hair.** A real plush fibre is 15 to 30 micrometres across; these are a millimetre or more. They are thick, tapered, slightly curved strands (the look of a hair system with a large root radius and a pointed tip, or of clumped fibres), each lit along one flank.
- **They lie down, in one general direction, and converge at the tips.** On the frog, 72 % of the edge energy lies within 0 to 60 degrees of one diagonal (strands run from upper left to lower right), with local coherence 0.41 (0 = isotropic, 1 = parallel lines). The cloud is broader (30 % in its main 30-degree bin and 37 % in the two bins on its shallow side). Neighbouring strands lean together at their tips, which draws small V and herringbone shapes: that is "clumping" seen from above. There are **no patches each combed its own way**; the direction drifts slowly over the body and scatters by roughly plus or minus 30 degrees strand to strand.
- **How much of each strand shows.** Strands overlap like thatch: about the outer half to two thirds of a strand is visible before the next one covers it. The gaps between them are small, dark and deeper in colour, never black.
- **The beret is a different fabric**: shorter, tighter strands that curl into C and S shapes 4 to 6 px across (2 to 3 % of the frog's width, 0.035 to 0.05 units), with no single lay to the eye and a pom whose strands point outward. (Its edge-direction histogram does peak along the hat's long axis, 57 % within 30 degrees of horizontal, but that may be the hat's own shading; local coherence is 0.38.) The sunglasses' discs are the same black curly cloth.

### 2.2 The grain (light and dark speckle)

Linear luminance divided by its local mean (Gaussian, sigma 4 px), inside each body:

| region | RMS | 2nd to 98th percentile | bright 15 % against dark 15 % (luminance) | per channel (R, G, B) |
|---|---|---|---|---|
| frog, lit centre | 7.0 % | -15 % to +14 % | 1.25 | 1.31, 1.24, **1.98** |
| frog, shaded left | 10.0 % | -21 % to +21 % | 1.38 | 1.47, 1.36, **2.49** |
| cloud, centre | 9.4 % | -18 % to +21 % | 1.40 | **4.5**, 1.53, 1.13 |
| cloud, upper | 9.8 % | -19 % to +22 % | 1.34 | **3.5**, 1.44, 1.08 |
| heart, left lobe | 5.6 % | -11 % to +12 % | 1.19 | 1.13, **3.1**, 1.23 |
| triangle | 3.6 % (red channel clipped) | -5 % to +11 % | 1.01 | not usable |
| beret (black wool) | **39 %** | -64 % to +100 % | 3.65 | 3.6, 3.6, 3.7 |

- **Size.** The speckle's autocorrelation is 0.56 at 1 px, 0.11 at 2 px and 0 at 3 px on the frog. The grain is 1 to 2 px across: about 1 % of the body's width. Its energy is spread evenly from the finest band to about 2.4 px sigma and falls off above that: there is no large-scale blotchiness.
- **Contrast.** About 7 to 10 % RMS on a dyed pile, a little more in the shade than in the light (in the light the gaps fill with scattered light).
- **Colour.** The bright speckles are paler, not just brighter: the channel the dye absorbs rises two to four and a half times while the dye's own channel rises 1.1 to 1.3 times. The dark speckles are the dye, deeper. So the grain is "pale strand flank over saturated depth", which is what a fibre's surface reflection and short light paths look like over multiply scattered light. It is not albedo noise.
- **On black wool** the same structure gives a much larger relative contrast (39 % RMS) because there is no scattered colour to fill the gaps: grey flanks (#1d1d1d) over near black (#0b0b0b).

### 2.3 Tones: tip, base, shade

Green (frog), sRGB with linear luminance:

| tone | sRGB | linear L | against the lit body |
|---|---|---|---|
| rim, facing the light (top of the eye bumps, 2 to 4 px inside the outline) | #daf486 | 0.83 | 1.21 |
| brightest 2 % of body pixels | #d0f574 | 0.80 | 1.17 |
| lit body (forehead, centre) | #bde65b to #caf06a | 0.68 to 0.76 | 1.00 |
| median of the whole body | #acd643 | 0.57 | 0.83 |
| shaded side | #8cba2b to #94bc30 | 0.39 to 0.42 | 0.60 |
| contact shade beside the cloud | #7ead44 to #89b332 | 0.35 to 0.40 | 0.55 |
| crease between the eye bumps | #84b114 | 0.36 | 0.48 |
| darkest 2 % | #77a507 | 0.31 | 0.45 |

- **The whole body lives within about 2.6 : 1** (98th to 2nd percentile; 1.8 : 1 from the 90th to the 10th). Nothing is black, nothing is white. The other characters agree: blue 2.5 : 1, yellow 2.4 : 1, pink 1.9 : 1 (10th to 90th).
- **Shade is the dye, deeper; light is the dye, paler.** From lit body to crease, green falls to 0.45 of its value but blue falls to 0.03 (0.143 to 0.004 linear): the hue saturates hard in shade. From lit body to rim, blue more than doubles: the hue washes toward a pale yellow-green.
- Other dyes, same pattern. Blue: rim #a9dbfb to #b2dff8 where it faces the light, #6eb2f8 on the side away from it; body #0b7ef7; shade #0263db; under the brim #0245a0. Pink: rim #f79cf6, body #f31ebe to #f930d4, shade #d60375. Black wool: rim #5e5d5d, lit top #403f3e, body #0b0b0b to #131212, shade #050505.

### 2.4 The outline and the pale rim

Brightness from the outline inward, against the brightness 25 to 35 px inside (on black):

| distance inside the outline | heart, top | heart, right side | cloud, left side (away from the light) | beret, top |
|---|---|---|---|---|
| 0 px (half coverage) | 0.45 | 0.01 | 0.59 | 1.2 |
| 2 px | 1.99 | 1.39 | 1.78 | 10.5 |
| 4 px | 1.96 | 1.71 | 1.91 | 6.0 |
| 8 px | 1.57 | 1.46 | 1.58 | 3.6 |
| 15 px | 1.21 | 1.21 | 1.29 | 3.1 |
| 20 px | 1.11 | 1.09 | 1.17 | 2.0 |
| 30 px | 1.00 | 0.99 | 1.00 | 0.95 |

- **Every outline carries a pale halo**, on the side away from the key as much as toward it: twice the interior's brightness at 2 to 4 px in, falling back to the interior's over 15 to 20 px (8 to 11 % of the frog's width; an e-folding length of about 7 px, 4 % of body width, 0.06 units).
- **Its colour is the dye washed toward white**: pink goes from linear (0.94, 0.013, 0.62) to (0.93, 0.33, 0.92); blue from (0.014, 0.21, 0.93) to (0.16, 0.45, 0.94). The absorbed channels gain 0.15 to 0.33 linear. On the black beret the halo is neutral grey, about 0.10 linear over a body of 0.01: ten times the interior. So the halo is mostly light that met one fibre and left (it barely takes the dye's colour), plus fibre-surface reflection; on a dark dye only the reflection is left.
- **The outline itself** rises from 10 % to 90 % over 3.4 px (0.029 units): about the depth of the pile seen side-on. No single strands are resolved standing clear of it; at this resolution it reads as a soft, slightly uneven edge. Against a light page this band is where the page shows between fibre tips.

### 2.5 Shadows

| where | width | darkest against the open value nearby | colour |
|---|---|---|---|
| on the cloud under the beret's brim | full value is reached 9 px from the brim on the side toward the light and 20 px on the side away from it (3 to 6 % of the cloud's width; 0.08 to 0.17 units on the frog's scale) | half the open value at 3 px (toward the light) and at 9 px (away from it); near black only in the first pixel | #0245a0 to #0263db: saturated, never grey |
| on the frog beside the cloud | 12 px (7 % of the frog's width, 0.10 units) | 0.64 | #82ad34 against #aad346 |
| between the frog's eye bumps | 25 px | 0.48 | #84b114 against #caf06a |
| on the yellow beside the glasses' wire | 12 to 14 px on the lit side, about 25 px on the side away from the light (the wire is 7 to 8 px thick) | 0.5 on the lit side, 0.1 to 0.2 right under the wire on the far side | #b47412, #8a5603: warmer and deeper, not grey |
| round the cloud's eyes | the pile dips 3 to 5 px into the socket: dark above the eye, a bright lip of lit fibre tips below it (#41a2fb against #0b7ef7 around) | | |

Shadows are soft (a penumbra of 5 to 10 % of body width), they keep their hue and gain saturation, and contact shadows are short and deep: the pile presses down where something sits on it.

### 2.6 The lighting, read from the glossy parts and the bodies

- **One large soft key from the upper right, in front.** Each pupil carries a single broad highlight on its upper right that covers about a third of the pupil and fades over 8 to 10 px with no hard edge (peak #71706f, linear 0.16, on a black of #050505). The glasses' wire throws its shadow to the left. Every body brightens toward the upper right (the fitted gradient of log luminance points 24 to 64 degrees above the horizontal, to the right). A highlight that large and that soft means a source subtending several tens of degrees: a big softbox close in, or the bright part of a studio HDRI.
- **No second highlight.** Nothing else is mirrored in the eyes except the neighbours: green from the frog's own body in the bottom of its pupils, a blue-violet glint from the cloud on the left of its left pupil, blue in the bottom of the cloud's own eyes. The surroundings are dark.
- **Fill is about half the key.** Shaded sides sit at 0.55 to 0.6 of the lit side and never lower than 0.45 outside creases. With a black backdrop that takes either a second soft source or a strong dome.
- **A rim from behind and above, or a dome.** The halo is on every outline including the left one, which faces away from the key, and it is strongest on tops (the beret's top edge is ten times its body). Fur under a dome does this by itself, but the black beret's rim needs light arriving from behind-above.
- **Colour.** The key is neutral (the white of the frog's eye is #f8f8f8 to #fafdff where lit). The white's shade is a warm pink-grey (#ae9f9a to #cdb6be): either a warm fill or light scattered inside the eye's material.
- **Exposure and tone.** Saturated dyes sit just under clipping in their strong channel (0.93 to 0.96 linear) and the paler rim gains in the other two channels, not by getting brighter: a filmic curve with a soft shoulder, exposed so the dye is nearly at full value.

### 2.7 Eyes and glasses

- **Frog's eyes**: a matte-to-satin white ball (lit #f8f8f8, shade #ae9f9a: 0.37 of the lit value) set into the pile so the pile laps its edge; a glossy black dome for the pupil with the one soft highlight and the body's colour bounced into its lower edge.
- **Cloud's eyes**: satin-black beans 24 x 40 px (8 x 13 % of the cloud's width), highlight much dimmer (#323134, linear 0.03) and broader than the frog's pupil: rougher, about 0.4 to 0.5 roughness. They sit in a dimple of the pile.
- **Glasses**: a round tube 7 to 8 px thick (about 4 % of the triangle's width, 0.05 to 0.06 units, 7 to 8 mm), satin black: its top is lit to #3b3b3f to #4d4a36 and falls smoothly to black underneath, with the yellow of the body bounced into its lower edge (#311200). No sharp highlight anywhere: roughness about 0.5. The closed "smile" eyes are the same tube. The sunglasses' lenses are discs of the black curly cloth, not glass.
## 3. How it is rendered

### 3.1 Where the characters come from: what was found, and what was not

Found (two news pages read through a fetch tool that returned quotations and image links, and the summaries of three web searches):

- Dots are OpenAI's always-on agents, announced at its DevDay on 29 September 2026 (search summaries of OpenAI's recap and release notes).
- San Francisco Standard: "Dots appear as plush, colorful creatures taking the shape of a heart, frog, or cloud with a beret." Its picture's alternative text: "Colorful plush characters shaped like a blue cloud, green frog, yellow triangle with glasses". It quotes Sam Altman: "inspired by the cool versions of what we all watched in movies growing up".
- TechCrunch: "The branding also presents a bubbly, cartoonish persona"; its picture is credited to OpenAI.
- From search summaries only: Fast Company is said to describe them as "customizable Pixar characters"; another article lists the shapes as pear, cloud, bean, heart and frog, with a beret, glasses or a bow tie.

Not found:

- **Who designed or made them.** Neither article names a designer, a studio or an in-house team. The only studio in the results, Studio Dumbar/DEPT, is credited with the identity of DevDay 2025, not with these characters. A printable model on MakerWorld (by 321 Design) says of itself that it is an independent adaptation.
- **How they were made.** No making-of, no software, no fur system, no renderer. Neither article says they are 3D renders at all.
- **Two pages that might have said more could not be read**: both Fast Company articles returned HTTP 403.
- **No larger picture.** The San Francisco Standard's page links its picture with a size of 3840 x 2160 in the address (a requested size, not a known native one); the session's network policy refused the download. Every measurement in section 2 rests on the 857 x 261 px row.
- **Nothing was read on how fur is rendered.** The researcher was cut off after the measurements; no paper, course note, renderer manual or engine source was opened.

### 3.2 What the pictures themselves imply (inference from section 2, not a source)

- **Made on black and cut out afterwards**: the outline carries the black it was mixed with (2.0).
- **Strands are modelled, not painted**: they are a millimetre or more thick, tapered, overlap like thatch, shade one another and catch light along a flank (2.1). The same strand size in pixels on a body 1.8 times wider (2.0) fits one fur setting applied to models of different sizes.
- **The light is a studio**: one large soft source, a fill about half as strong, light from above and behind on every edge, and nothing else mirrored in the eyes but the neighbours (2.6).
- **The halo is what a pile does under such light**: at the outline the eye sees only fibre tips, lit from behind and beside, and the light reaching it has met one or two fibres (pale) where in the middle it has met many (saturated) (2.3, 2.4).

All of this fits a groomed strand fur rendered offline with a hair shading model and many bounces of light, which is how such characters are usually made (3.3). The pictures do not prove it.

### 3.3 How such fuzzy characters are usually made (FROM MEMORY: nothing here was read in this study)

Kept to what each technique does; no coefficients are quoted because none could be checked.

Offline (film and advertising):

- **Grooming.** Fur is thousands of curves: a few guide strands are placed and combed by hand and the rest are interpolated between them. The usual controls are length, width at root and tip (taper), clumping (strands pulled toward their guide, more toward the tip), curl or frizz noise, and direction. Tools of this kind: XGen in Maya, Houdini's hair tools, Blender's hair curves, Yeti, Ornatrix. A large strand width with clumping gives exactly the reference's thick tapered strands that meet at their tips.
- **Shading one strand.** Kajiya and Kay (1989): a strand is a thin cylinder, brightest when the light is across it, with a highlight on a cone about its axis. Marschner and others (2003): three lobes from a dielectric fibre, a colourless surface reflection, a strongly forward lobe of light that passed through the fibre once (lightly coloured), and a coloured lobe that reflected once inside. Later production models (d'Eon and others 2011; Chiang and others 2016, Disney's, the basis of Blender's Principled Hair) keep those lobes, conserve energy and are set by a colour and a roughness. Fur with a core (Yan and others, 2015 and 2017) scatters more diffusely.
- **Many bounces.** A path tracer follows light through fibre after fibre. That is where the look comes from: light that leaves after many fibres has the dye's colour to a high power (the saturated depth); light that leaves after one is nearly white (the flanks and the rim).

Real time (games):

- **Shells and fins** (Lengyel and others, 2001): the surface is drawn many times, each copy pushed a little further out and textured with fibre cross-sections, with extra strips along the outline. It needs many passes over geometry. Our pile's march is the same idea done along the eye's ray in one pass.
- **Strand systems** (hair drawn as line geometry with a simplified Marschner model and an approximation of multiple scattering such as Zinke and others' dual scattering, 2008): geometry and several passes; out of reach here.
- **Cloth lobes**: a sheen that brightens toward grazing angles (the "Charlie" distribution of Estevez and Kulla, 2017, with the visibility term from The Order: 1886). These are in our library already (3.4). They follow the lamps, so they give a rim only where a lamp reaches.
- **Fuzz terms**: a glow by the view angle alone, added at the edge. Crude, cheap, and what recipe 1 is.

### 3.4 The models our renderer uses today (read in the repository)

The only sources of formulas actually read in this study are our own shaders.

- **The pile** (`shaders.ts`, SCENE and MAIN_PILE; the code cites Kajiya and Kay 1989). Fibres are a noise read at each fibre's root; a fibre is present where the noise stands above `level`, which rises with height (`0.47 + 0.2 * hs^2` for the short pile). The march takes steps of `ds` (about 0.7 of a pixel) and each step covers `1 - exp(-c * ds * f.fine * FUR_OPACITY)` of what is left (`f.fine` 175, `FUR_OPACITY` 1.5).
- **Light on a fibre** (`furLight`): wrapped diffuse `clamp((NoL + w) / (1 + w))` with `w = 0.45 + 0.4 * lum(albedo)`; direct light thinned with depth, `reach = exp(-1.05 * cover / max(0.7 NoL + 0.3, 0.1))`; colour `albedo * mix(again, 1, reach) * mix(1, sin(T, L), 0.3)` where `again = 0.92 * albedo^0.5` is light scattered back out of the pile; Kajiya and Kay's highlight `0.22 * gloss * (sin(T,L) sin(T,V) - (T.L)(T.V))^40` with gloss 0.08; light through the tips from behind, `0.35 * max(dot(-V, L), 0)^3 * (1 - cover)^2`.
- **Per pixel**: the key's soft shadow (Quilez's penumbra, k = 3, never below 0.4 on pile) and ambient occlusion from the distance field (0.6 to 1).
- **Cloth lobes** (SCENE and `_lib.glsl`): `D_Charlie = (2 + 1/a) * sin^(1/a) / (2 pi)` with `a = roughness^2`; Neubelt's visibility `1 / (4 (NoL + NoV - NoL NoV))`; a fitted sheen for the sky (`sheenIBL`). Cotton and boucle: Oren and Nayar's matte lobe in Fujii's form, `pi (1 + sigma s / t) / (pi + (pi/2 - 2/3) sigma)`, sigma 0.75 and 0.9, under a Charlie sheen of roughness 0.7 and 0.6 tinted `mix(dye, white, 0.55 or 0.45) * 0.42`.
- **Lamps** (`engine.ts`): key from (-0.42, 0.78, 0.5), colour #fff7ee at 1.0; fill from (0.85, 0.15, 0.5), #f3f6ff at 0.32; back from (0.25, 0.6, -0.76) at 0.58 (0.85 on the dark theme); sky 0.42; ground #f1f3f7 at 0.24; exposure 1.06.
- **Tone**: Khronos PBR Neutral, compressing from 0.76 and desaturating what it compresses by 0.15.

### 3.5 Offline against real time, for this look

| part of the look | offline, it comes from | here, it can come from |
|---|---|---|
| thick tapered strands meeting at their tips | the groom: strand width, taper, clumping | the pile's noise at a strand's size, a level that rises with height, a lay per clump (recipes 2 to 4) |
| pale flank over saturated depth | one bounce against many | `reach` and `again`: a ramp from the dye at the tip to a deeper dye in the gaps (recipe 2) |
| pale halo on every outline | many bounces under a dome of light, forward scattering | a view-angle term fed by the sky and the back lamp (recipe 1) |
| soft outline | sparse strand tips | a thin halo of the tallest strands (recipe 3) |
| soft, coloured shadows | a large light and bounced light | already here: the soft shadow and the occlusion, with shade from `again` |
## 4. A recipe for this renderer

**No GLSL below was compiled or rendered.** The repository was not edited for this report. Every constant is a starting value worked out from the formulas in the code and from the measurements, and every cost is an estimate. The targets in 4.1 are measurements; a change is right when the render meets them (4.8 says how to check), not when it matches a constant given here.

Sizes used below (the frog's body is 1.5 units wide):

| mascot as drawn | body width | one pixel | strand cell 0.0125 | halo 0.024 | rim e-folding 0.06 |
|---|---|---|---|---|---|
| 400 px on a 2x screen | about 700 px | 0.0021 units | 5.8 px | 11 px | 28 px |
| 300 px at 1x | about 262 px | 0.0057 | 2.2 px | 4.2 px | 10 px |
| 200 px at 1x (the reference's scale) | 175 px | 0.0086 | 1.45 px | 2.8 px | 7 px |
| 68 px on a 2x screen | about 118 px | 0.0127 | 1.0 px | 1.9 px | 4.7 px |
| 68 px at 1x | about 59 px | 0.0254 | 0.5 px | 0.9 px | 2.4 px |
| 28 px at 1x | about 24 px | 0.0625 | 0.2 px | 0.4 px | 1.0 px |

### 4.1 Target specification for plush

All from section 2, on the frog's scale. "px" means pixels at 175 px per body.

| quantity | target | source |
|---|---|---|
| visible strand length | 0.035 to 0.06 units (4.5 to 8 mm; 4 to 7 px) | 2.1 |
| strand width | at most 0.009 to 0.015 units (1.2 to 2 mm; 1.1 to 1.7 px), tapering to a point | 2.1 (upper bound: at the picture's blur limit) |
| how much of a strand shows | the outer half to two thirds; so a whole strand is about 0.06 to 0.1 units long and leans 60 to 70 degrees from the upright in a coat about 0.03 units deep | 2.1; the lean is arithmetic from those two figures |
| lay | one direction that drifts slowly over the body; strand-to-strand scatter about plus or minus 30 degrees; 72 % of edge energy inside one 60-degree sector; local coherence 0.41; no patches combed their own way; neighbouring strands meet at their tips in small V shapes | 2.1 |
| grain size | speckle autocorrelation 0.56 at 1 px (0.0086 units), 0.11 at 2 px, 0.01 at 3 px (frog); 0.72 / 0.33 / 0.13 (cloud). Falls to 0.3 at 0.011 units across the lay and 0.016 along it | 2.2, transcript |
| grain contrast | 7 % RMS in the light, 10 % in shade; 2nd to 98th percentile -15 to +14 % (light), -21 to +21 % (shade) | 2.2 |
| grain colour | brightest 15 % against darkest 15 %: 1.25x in luminance; the dye's own channel 1.1 to 1.3x, the absorbed channel 2 to 4.5x. In absolute terms the bright speckles carry only +0.01 to +0.04 (linear) of neutral light over a brighter dye colour | 2.2; the absolute figure is arithmetic on the frog's and the cloud's rows |
| pale rim, strength | at 0.017 to 0.035 units inside the outline: 1.7 to 2.0x the interior on dyes of luminance 0.2 to 0.27 (pink, blue), 1.2x on the green (luminance 0.7), 10x on black. As added light: +0.13 to +0.32 linear in the channels that do not clip on a dyed pile, +0.09 on black | 2.3, 2.4, transcript |
| pale rim, width | 1.55x at 0.07 units, 1.2x at 0.13, 1.1x at 0.17, 1.0x at 0.26 (pink and blue); on black it is half gone at 0.035 units | 2.4 |
| pale rim, where | every outline, the side away from the key included (1.8 to 1.9x there), strongest on tops | 2.4 |
| tone range | 2.6 : 1 from the 2nd to the 98th percentile of the body, 1.8 : 1 from the 10th to the 90th; shaded side 0.55 to 0.6 of the lit side; creases 0.45 to 0.48; shade deeper in colour, never grey (the bodies are cut off above their undersides) | 2.3 |
| outline softness | coverage rises from 10 % to 90 % over 0.029 units (3.9 mm; 3.4 px), the same on every character | 2.4 |

### 4.2 Where ours stands (measured)

A lime frog in each material, drawn so its body is 174 to 178 px wide (`renders/cmp/*_frog_201.png`), given the reference picture's blur (Gaussian, sigma 0.63 px), and measured with the same code as the reference (`scripts/ours.py`, the researcher's; `scripts/fin_ours.py`, added for this report). Our key lamp is on the left, the reference's on the right.

| quantity | reference | plush | cotton | boucle |
|---|---|---|---|---|
| outline, 10 to 90 %, with the reference's blur | 3.7 to 3.8 px | 2.0 to 2.2 px | 2.0 to 2.1 px | 2.0 to 2.2 px |
| the same without the added blur | 3.4 px | 1.2 to 1.6 px | 1.6 px | 1.5 to 1.6 px |
| brightness at 2 / 4 / 8 / 15 px inside the outline against 25 to 35 px inside, side toward the key | 1.39 / 1.71 / 1.46 / 1.21 (heart) | 0.92 / 0.94 / 0.95 / 0.98 | 1.28 / 1.24 / 1.16 / 1.07 | 1.27 / 1.23 / 1.16 / 1.07 |
| the same, side away from the key | 1.78 / 1.91 / 1.58 / 1.29 (cloud) | 0.93 / 0.94 / 0.95 / 0.98 | 0.82 / 0.75 / 0.74 / 0.83 | 0.75 / 0.73 / 0.81 / 0.95 |
| speckle RMS (lower middle of the body) | 7.0 % lit, 10.0 % shade | 2.2 % | 2.1 % | 1.1 % |
| speckle, 2nd to 98th percentile | -15 to +14 % | -5.4 to +3.9 % | -8.0 to +2.8 % | -2.8 to +2.2 % |
| speckle autocorrelation at 1 / 2 / 3 px | 0.56 / 0.11 / 0.01 | 0.76 / 0.38 / 0.10 | 0.79 / 0.58 / 0.44 | 0.58 / 0.11 / -0.01 (then 0.17 to 0.19 at 5 to 6 px: a repeat) |
| bright 15 % against dark 15 %, per channel (R, G, B) | 1.31, 1.24, 1.98 | 1.15, 1.14, 1.47 | 1.19, 1.17, 1.32 | 1.07, 1.07, 1.15 |
| body luminance, 2nd / 10th / 50th / 90th / 98th percentile | 0.31 / 0.41 / 0.57 / 0.75 / 0.80 | 0.27 / 0.39 / 0.68 / 0.75 / 0.77 | 0.19 / 0.25 / 0.54 / 0.67 / 0.71 | 0.25 / 0.33 / 0.54 / 0.66 / 0.71 |
| gradient of log luminance across the body: size per body width, and which way is brighter | 0.56 toward 24 degrees above the horizontal (frog); 0.8 to 1.1 toward 34 to 64 degrees (the others) | 1.21 toward 93 degrees (straight up); sideways part -0.07 | 1.61 toward 99 degrees | 1.13 toward 104 degrees |

Read with these cautions:

- **Tops.** On the frog the top of the outline runs into the eyes within 15 px, so no top profile is given for it. On a plain sky-blue ball (`renders/*/hero.png`, drawn 560 px and box-filtered to a 174 px body: another colour, shape and route, so kept apart from the rows above) the top reads 1.08 / 1.08 / 1.07 / 1.04 in plush, 1.21 / 1.17 / 1.12 / 1.09 in cotton and 1.23 / 1.20 / 1.14 / 1.07 in boucle. On a charcoal plush ball the top reads 1.75 / 1.66 / 1.48 / 1.33: the back lamp already makes a rim on a dark dye, on the top only.
- **Tone percentiles are not like for like.** Our frog is whole, with its underside; the reference bodies are cut off above theirs. The dark tail (2nd percentile) therefore says little. The median does: ours sits at 0.88 of its 98th percentile in plush, the reference at 0.71. Our lit side is flat.
- **The gradient is the firmest light figure.** Our plush brightens straight upward and not at all sideways; every reference body brightens toward the key by 0.4 to 0.9 per body width sideways.
- **Our fades remove more grain than shrinking a picture does.** The boucle ball drawn at 560 px and box-filtered to 174 px keeps 4.5 % speckle in its lit half and 7.8 % in its shaded half; the boucle frog drawn directly at 178 px has 1.7 % and 2.7 %. For plush the same pair is 2.3 % and 3.6 % against 1.0 % and 2.2 %. (Different colour and shape, so indicative only.)
- **What it looks like.** Side by side at the same pixel scale (`crops/sbs_fibre_x7.png`) the reference is a field of short pale strands over darker green; our plush is a flat green with a few faint darker patches and a hard edge; cotton shows faint upright streaks; boucle faint wavy lines. In our close-up (`crops/ours_plush_close_crop.png`) the pile is patches of wavy ribbons, each patch combed its own way with a visible border, all one bright tone: it reads as brush strokes, not fibres.

### 4.3 Why: what the code does now

All in `modellab/web/src/components/yeti/mascot/shaders.ts` (line numbers as read on 13 November 2026).

- **No rim.** `shadeFur` (line 653) has no term that depends on the outline. The only light from behind is `thru` in `furLight` (line 648): `0.35 * pow(max(dot(-V, L), 0), 3) * (1 - cover)^2`, tinted by the dye, which follows where the back lamp is and not where the edge is. The wrap term makes the edge darker than the middle.
- **Fibres too fine to see at app sizes.** `furM` sets `f.fine = 175` for the body (line 495): one cell of the noise is 0.0057 units, 0.66 px at 175 px per body. `fibres()` then works at a level of detail `log2(max(gPix, ds) * f.fine) + 0.5` = 1.09 and returns 82 % of the pile's average (line 630). So the grain is mostly gone at the size the reference shows it best.
- **Shallow depth shading.** For a make-your-own mascot `furLight` lets direct light down the pile as `exp(-1.05 * cover / ...)` (line 640) and `shadeFur` returns scattered light as `0.92 * pow(f.alb, 0.5)` (line 655). Taking the reference frog's green as the dye and assuming a tip at cover 0.05 and a gap at cover 0.65, that puts a tip against a gap at 1.18, 1.09, 1.48 (R, G, B): the same order as the render's 1.15, 1.14, 1.47 (which, at this size, is mostly the average and not a clean tip against a gap). The reference is 1.31, 1.24, 1.98.
- **A sheared pile with a hard top.** `fibres()` uses `level = 0.47 + 0.2 * hs * hs` for the short pile (line 622) and `furM` sets `f.top = 0.82 + 0.18 * lock` (line 494). Cover at the tips is still 17 %, which with `f.fine * FUR_OPACITY` = 262 stops light within 0.002 units along a grazing ray. Hence an outline of 1.2 to 1.6 px.
- **Whorls.** `furM` gives each cell of a grid 0.04 units across (`grain = 25`, line 481) its own lay, `ang = 6.2832 * hsh.x` (line 486): any direction at all. The reference has one lay with 30 degrees of scatter. The whorl is right for the hat and the pom (the reference's beret is curly with no lay) and wrong for the body.
- **Ribbons.** Inside a cell the noise is stretched 6.5 times along the lay (line 491) and every strand bends in step, `0.0045 * sin(along * 85)` (line 490): that is the wavy ribbon of the close-up.
- **Even light.** `furLight` wraps each lamp by `w = 0.45 + 0.4 * lum(f.alb)` (line 638; about 0.72 for a green of luminance 0.69, the reference frog's). Adding the lamps at a tip by hand (key 1.0, fill 0.32, back 0.58, sky 0.42, ground 0.24, directions from `engine.ts` lines 184 to 186): 1.15 on the side toward the key, 1.13 on the side away from it, 1.27 in front, 1.9 on top. The fill and the back lamp together undo the key's modelling.

### 4.4 Changes for plush, in priority order

Everything here belongs under `#ifdef FUZZY` or behind a test on `f.kind`: `furLight`, `shadeFur`, `fibres`, `FUR_OPACITY` and MAIN_PILE also draw Bloom, which this report did not study. In `furM` the kinds are 0 body, 1 knit (hat, scarf), 2 pom, 3 tuft; the body and the pom share `f.fine = 175`, the knit has 190 and the tuft 105.

**1. The pale rim.** *Where:* a new function in SCENE after `skyIrr` (line 581), called from `shadeFur`.

```glsl
// The pale edge of anything fuzzy: light from above and behind that met one fibre and came on to the eye.
// width: 2.6 a deep pile .. 4 a short nap. amount: how much of it this point shows (0 .. 1).
vec3 fuzzRim(vec3 n, vec3 v, vec3 dye, float amount, float width) {
  float e = 1.0 - clamp(dot(n, v), 0.0, 1.0);
  vec3 through = pow(dye, vec3(0.25)) * sqrt(max3(dye)) * mix(1.0, 0.45, smoothstep(0.3, 0.8, lum(dye)));
  vec3 behind = uSky * (0.75 + 0.25 * dot(n, uUp)) + uBackCol * (0.35 + 0.65 * max(dot(n, uBack), 0.0));
  return amount * behind * (0.4 * pow(e, 5.0) + 1.4 * through * pow(e, width));
}
```

In `shadeFur`, for FUZZY, add to what it returns (the part the key's shadow does not touch):

```glsl
+ fuzzRim(f.n, V, f.alb, occ * mix(0.5, 1.0, exp(-3.0 * cover)), 2.6)
```

and halve the back lamp there (`furLight(uBack, 0.5 * uBackCol, ...)`), since the rim now does its work at the edge.

- *What it computes.* Two parts. A neutral one (`0.4 * e^5`): fibre-surface reflection at a grazing angle; it is all a black pile shows, and it is narrow (on the beret the rim is half gone at 0.035 units). A wide one (`1.4 * through * e^2.6`): light that passed through a fibre or two, so it carries a quarter-power of the dye (pale), and next to nothing on a dye with no bright channel. `behind` is the sky plus the back lamp, so the rim is on every outline and strongest on tops, as measured. The last factor in `through` halves the term on a dye that is already bright, where the reference shows 1.2x and not 2x.
- *The falloff is a tuning value.* `e^2.6` was fitted to the heart's and the cloud's profiles (1.0 / 0.55 / 0.25 / 0.13 of the peak excess at 0.03 / 0.07 / 0.13 / 0.17 units) on the assumption that the outline there curves like a ball of radius 0.75 units, where a point `d` inside the outline faces the eye at `dot(n, v) = sqrt(2 d / 0.75)`. The radius was not measured. Tune `width` and the two strengths until the measured profile in 4.1 is met on a plain ball.
- *Check of the constants, by arithmetic* (0.025 units inside the outline of that ball, exposure 1.06, `amount` 0.85):

| dye (linear) | where | computed gain | measured gain |
|---|---|---|---|
| pink (0.94, 0.013, 0.62) | top | G +0.23, B +0.50 before the tone curve | G +0.32, B +0.30 (B clips) |
| blue (0.01, 0.21, 0.93) | side away from the key | R +0.14, G +0.26 | R +0.15, G +0.24 |
| green (0.51, 0.80, 0.105) | top | R +0.27, B +0.20 before the tone curve | R +0.19, B +0.13 |
| black (0.006) | top | +0.08 | +0.095 at 2 px, +0.05 at 4 px |

- *Effect.* The edge of a mid-toned dye goes from 0.92 to about 1.7 to 2.0 times the interior and turns paler; the body reads as soft and lit from all round.
- *Cost.* Three `pow` and a `sqrt` per shaded fibre: negligible.
- *Sizes.* All of them. It is the only cue that survives to 28 px: shrunk in linear light, the reference's rim is still 2.0x at a 118 px body, 1.8x at 59 px and 1.6x at 24 px.
- *Risks.* A pale edge on the pale page (#f5f8fc) can melt into it; the reference was made on black. Check snow and the palest dyes at 28 and 68 px on the light theme; if the outline is lost, multiply the wide part by `mix(0.7, 1.0, uDark)`. The dark theme already raises `uBackCol` from 0.58 to 0.85 (`engine.ts` line 352), which strengthens the rim there by itself.

**2. Strands the right size, and grain with depth.** *Where:* `furM` (lines 477 to 498), `fibres` (line 621), `furLight` (lines 640 and 647), `shadeFur` (lines 655 and 662), and the opacity line in both marches (MAIN_PILE line 743, MAIN_SURFACE line 864).

- `furM`: `f.fine = mix(175.0, 190.0, knit)` becomes `mix(mix(80.0, 100.0, knit), 90.0, pom)`. A noise cell on the body is then 0.0125 units (1.7 mm; 1.45 px at 175 px per body), which is the reference's speckle size, and `fibres()` works at level of detail -0.04 at that size (fully drawn), 0.52 at a 118 px body (72 % drawn) and 1.52 at 59 px (the average).
- `furM`: the stretch along the lay, `mix(6.5, 3.0, pom)`, becomes 4.0 for the body and 3.0 for knit and pom: a streak 0.05 units long.
- `fibres`: the test `if (f.fine > 120.0)` that picks the short-pile branch becomes `if (f.kind < 2.5)` (the tuft's 105 would otherwise be above the body's 80).
- Both marches: `a = 1.0 - exp(-c * ds * f.fine * FUR_OPACITY)` becomes, for FUZZY, `... * (f.kind < 2.5 ? PILE_STOP : f.fine * FUR_OPACITY)` with `const float PILE_STOP = 262.0;` (today's 175 x 1.5). Without this, halving `f.fine` halves what the pile stops and the fabric shows through.
- `furLight`, FUZZY branch, for `f.kind < 2.5` (the tuft keeps today's values, here and in the next line): `exp(-1.05 * cover / ...)` becomes `exp(-1.6 * cover / ...)` (the value Bloom already uses).
- `shadeFur`, FUZZY branch: `again = 0.92 * pow(f.alb, vec3(0.5))` becomes `0.75 * pow(f.alb, vec3(0.5))`; and the sky's `exp(-1.6 * cover)` becomes `exp(-2.2 * cover)`.
- `furLight`, for `f.kind < 2.5`: `spec = 0.22 * f.gloss * pow(..., 40.0) * reach * wrap` becomes `0.035 * pow(max(sL * sV - TL * TV, 0.0), 6.0) * reach * wrap`: a broad neutral sheen of 3.5 % of the lamp in place of a narrow highlight of 1.8 %. That is the +0.01 to +0.04 of neutral light the bright speckles carry.
- *Rough check, by arithmetic,* with the reference frog's green as the dye (our lime is not the same colour: its blue is lower) and assumed covers of 0.05 for a tip and 0.65 for a gap: 1.38, 1.24, 1.85 in the light and 1.47, 1.29, 2.17 in shade. That is the same order as the reference's 1.31, 1.24, 1.98 and 1.47, 1.36, 2.49; it is not a prediction of what the render will measure. The body's mean tone drops by about 8 % and gains saturation; if dyes then read too dark, raise `exposure: 1.06` (`engine.ts` line 59) toward 1.12.
- *Effect.* Strands appear at 200 px and above as pale flanks over deeper colour; speckle should rise from 2 % toward the 7 to 10 % target and its correlation shorten from 0.76 at 1 px toward the target of 0.56 (targets, not predictions).
- *Cost.* None at app sizes (there the step is `0.7 * gPix`); in close-ups the step `0.3 / f.fine` doubles, so the pile takes about half as many steps.
- *Sizes.* A 118 px body (68 px on a 2x screen) and up; clearest at 200 to 400 px and close up. Nothing at 68 px on a 1x screen or below.

**3. A soft outline: a sparse halo of the tallest strands.** *Where:* `fibres` (line 622), `furM` (line 494), and both marches (MAIN_PILE lines 734 to 744, MAIN_SURFACE lines 857 to 865).

- `furM`: `f.top = 0.82 + 0.18 * lock` becomes `0.50 + 0.12 * lock`. `f.top` now marks the top of the dense coat (0.025 to 0.031 units above the fabric); the rest of the pile's 0.05 units is halo. `BODY_PILE` stays 0.05.
- `fibres`, short-pile branch:

```glsl
level = hs < 1.0 ? 0.44 + 0.30 * hs * hs                                    // the coat: strands taper (63 % cover at the root, 9 % at its top)
                 : mix(0.85, 1.03, (h - f.top) / max(1.0 - f.top, 1e-3));   // the halo: only the tallest strands, thinning to nothing
wisp = 9.0;
```

- Both marches, for FUZZY and `f.kind < 2.5` only (the tuft has its own `f.top` and its own wisps above it, and keeps today's lines): the cover handed to `shadeFur` becomes `max(f.top - f.h, 0.0) / max(f.top, 0.05) + f.under` (0 at the coat's top and in the halo, 1 at the fabric), and `1.0 + f.under` where the fabric itself is met. The constants of change 2 assume this.
- Both marches, after `float ds = ...`: `if (f.kind < 2.5 && f.h > f.top) ds = min(2.0 * ds, 0.25 * f.len);` (the halo is thin: longer steps there keep the cost down).
- *Why these numbers.* A ray grazing a ball of radius R at depth u below the pile's top runs `2 * sqrt(2 R u)` through the pile. For coverage to climb from 10 % to 90 % across 0.03 units, the outer pile must stop about 0.4 per unit of path at its top rising to about 7 at the coat (today: 45). With `PILE_STOP` 262 that is a cover of 0.15 % rising to 2.6 %, which is the noise standing above 1.03 falling to 0.85 (`above()`, line 611). Computed for R = 0.75: coverage 7 % at the halo's top, 74 % at the coat's top, so 10 to 90 % over about 0.024 units: 2.8 px at 175 px per body, against 3.4 measured and 1.2 to 1.6 now. Face on, the halo hides 5 %. On a part of radius 0.25 the halo is thinner by a factor 0.58.
- The same lines give the hat a halo of about 0.015 units and the pom one of about 0.04; the reference's pom has the softest edge in the picture (8 px from 10 to 90 %).
- *Reaching the full 0.029 units* needs a deeper pile: `BODY_PILE` 0.06, which must be changed together with `PILE[0]` in `looks.ts` (line 17) and the allowance a bare-surface body is grown by (line 18).
- *Effect.* The outline becomes a soft, slightly uneven fringe in which the page shows between strand tips; with change 1 the fringe is the palest part of the body.
- *Cost.* Moderate: a ray that grazes the body takes 10 to 30 more steps (at the doubled step) through the halo before it reaches the coat. That is a ring of about 6 % of the body's pixels; estimate 5 to 10 % on a plush frame. Measure with `tools/mascot/harness/perf.sh`.
- *Sizes.* 68 px on a 2x screen (1.9 px) and up. At 68 px on a 1x screen it is under a pixel.
- *Knock-ons to check.* The opaque body shrinks by about 0.02 units a side. Eyes and glasses are placed against the pile's full height (so the comments in `looks.ts` at lines 63, 176, 186 and 200 say; that code was not read): with the coat lower they will stand prouder by about 0.02 units and may need seating that much deeper. The key's shadow is already cast from half the pile's height (`pileD`, line 449), which is where the coat's top now is.

**4. One lay, with scatter; clumps with valleys between.** *Where:* `furM`, lines 480 to 497.

```glsl
float body = 1.0 - step(0.5, kind);                          // the body's pile is combed; a hat's and a pom's stay curly
vec3 comb = normalize(vec3(0.35, -1.0, 0.2));                // down, and a little to one side
vec3 lay0 = comb - n * dot(comb, n);
float pole = dot(lay0, lay0);                                // (small where the body faces along the comb: the crown, the underside)
lay0 = pole > 1e-3 ? lay0 * inversesqrt(pole) : t1;
float scatter = mix(6.2832, mix(1.05, 6.2832, smoothstep(0.2, 0.0, pole)), body);   // +-30 degrees clump to clump; every way at the crown
float ang = (hsh.x - 0.5) * scatter;
vec3 base = mix(t1, lay0, body);
vec3 lay = base * cos(ang) + cross(n, base) * sin(ang), side = cross(n, lay);
```

and, further down:

```glsl
vec3 fq = abs(fract(q) - 0.5);
float wall = 0.5 - max(fq.x, max(fq.y, fq.z));               // 0 at a clump's border .. 0.5 at its middle
float cellSeen = 1.0 - smoothstep(0.35, 1.0, gPix * grain);  // a clump smaller than a pixel is its average
f.top = (0.50 + 0.12 * lock) * mix(0.95, mix(0.78, 1.0, smoothstep(0.0, 0.08, wall)), cellSeen);
f.alb *= 1.0 + 0.06 * (hsh.z - 0.5) * cellSeen;              // clumps differ a little in tone (1.7 % RMS)
```

- The bend, `0.0045 * sin(along * 85.0 + ...)`, becomes `0.004 * sin(along * 45.0 + ...)` for the body: one gentle curve per strand (wavelength 0.14 units) and not a wave. For the knit keep 85 and raise the amplitude to 0.008 (the beret's C and S curls); set its `grain` to 26 (cells 0.038 units: the beret's curls are 0.035 to 0.05).
- The grid stays (`grain = 25`: clumps 0.04 units across, three or four strands side by side). Adjacent clumps now differ by up to 30 degrees, so their strands meet in V shapes at the borders, and the lower coat along each border (`wall`) is the small dark gap between clumps.
- A slow wander of the comb (`ang += 1.4 * (snoise(s * 2.2 + 31.0, 0.0) - 0.5)`, about 15 degrees over half a unit) costs one more noise lookup at every step in the pile. Leave it out at first.
- *Effect.* Close up and at 300 px the patchwork of brush strokes becomes a combed coat of short tapered strands; at 200 px the speckle gains the reference's direction (target: local coherence about 0.4, most edge energy in one 60-degree sector).
- *Cost.* A few multiplications; nothing measurable without the wander.
- *Sizes.* 200 px and up, and close up. The per-clump tone carries a little grain down to a 59 px body, then fades.

**5. Light the pile from one side.** *Where:* `furLight` line 638; `engine.ts` lines 184 to 186 and 212 to 215. This touches every material, so it belongs with the lighting work; what the pile needs is:

- `w = 0.45 + 0.4 * lum(f.alb)` becomes `0.25 + 0.2 * lum(f.alb)` for FUZZY (0.39 for the same green).
- The back lamp at half strength on the pile (in change 1).
- The key lower and further to the side: `KEY` from (-0.42, 0.78, 0.5) to about (-0.60, 0.55, 0.58), 33 degrees up in place of 50. The fill from 0.32 to about 0.22.
- *By arithmetic* (lamps added at a tip): toward the key 1.07, away from it 0.66, front 1.2, top 1.4; so the far side sits at 0.62 of the near side (today 0.98; reference 0.55 to 0.6) and the top at 1.2 times the front (today 1.5).
- *Effect.* The body gains a lit side and a shaded side, and the shade is the deeper colour change 2 gives it. *Cost:* none. *Sizes:* all.

**6. (Optional) Each strand lit along one flank.** *Where:* `shadeFur`, on the key only. Read `fibres()` once more for a point moved 0.7 of a cell toward the key along the fabric and 0.12 higher in the pile; if a strand stands there, this point is in its lee: `key *= 1.0 - 0.45 * lee`. The move must be made in the strand's own coordinates (`f.root` is squeezed along the lay and turned by `TWIST`), so `furM` has to hand the lay on. *Cost:* two noise lookups per shaded fibre, perhaps 15 % of a plush frame. *Sizes:* close up and 300 px and above. Do it only if, after changes 1 to 4, strands still read as flat in the close-up.

**Leave alone:** the tone curve. `neutralTone` starts to compress at 0.76 and desaturates what it compresses, which is what turns "dye plus rim" into "dye washed toward white" as in the reference; and our lime body already sits where the reference's does (median 0.68, top 0.77).

### 4.5 What cotton should take

Cotton's identity (`cotton.glsl`, MATERIALS.md) is no highlight and a crisp outline; those stay. Two things change, both in `matShade`.

- **The edge away from the key is dark** (0.82 / 0.75 / 0.74 at 2 / 4 / 8 px; the key side is 1.28 / 1.24 / 1.16). The Charlie sheen it has follows the lamps, so it makes a rim only where a lamp reaches. After the lamp loop (line 71) add `col += fuzzRim(n, v, dye, 0.6 * open, 4.0);`: the same rim, six tenths as strong and narrower, on every outline. Target: at least 1.2x at 2 px all round on a mid-toned dye, back to 1.0 by 0.1 units.
- **Grain.** Today's tone variation is a slow blotch, `0.05 * (noiseAt(p, 5.0) - 0.5)` (cells 0.2 units), and upright streaks, `0.07 * (noiseAt(p * vec3(1.0, 0.25, 1.0), 60.0) - 0.5)`; the knit itself is below a pixel at 175 px per body. Hence 2.1 % speckle that is still correlated 0.44 at 3 px. Add a nap at the reference's size:

```glsl
float nap = noiseAt(p, 80.0) - 0.5;                                          // cells of 0.0125 units; noiseAt filters it as it shrinks
alb = mix(alb, deep, clamp(-1.5 * nap, 0.0, 0.5)) * (1.0 + 0.35 * nap);      // dark specks go deeper in colour, bright ones paler
fuzz *= 1.0 + 2.0 * max(nap, 0.0);                                           // ...and the raised fibres catch the haze
```

  placed after `alb` is built (line 60) and after `fuzz` (line 63), and cut the blotch from 0.05 to 0.02. If the noise's deviation is about 0.19 (inferred from the comment at `shaders.ts` line 610), this is about 6.5 % RMS at full size, fading by itself below a 118 px body. Cost: one noise lookup per pixel.

### 4.6 What boucle should take

Boucle's nearest relative in the reference is the beret: curls 0.035 to 0.05 units across, strands at most 0.015 wide, no lay, and far more contrast than the smooth pile.

- **The same all-round rim:** in `matShade` after the lamp loop (line 79), `col += fuzzRim(n, v, dye, 0.8 * open * gap, 3.0);`. Today the far edge is 0.75 / 0.73 / 0.81 at 2 / 4 / 8 px.
- **Keep the tangle's tone longer than its relief.** `seen = resolved(0.014)` fades both the relief and its shading; at 175 px per body 64 % is left, at 118 px 6 %. A picture shrunk honestly keeps more (4.5 to 7.8 % speckle against our 1.7 to 2.7 %). `matShade` already calls `boucleYarn(p, across)` at line 56 and throws its height away: use it for the tone, faded later.

```glsl
float hy = boucleYarn(p, across);                                     // (line 56: keep the height it returns)
float deepIn = mix(1.0, smoothstep(0.0, 0.75, hy), resolved(0.02));   // (line 66: was h and seen)
```

  Leave the relief (`matDisplace`) and the slope `dh` on `resolved(0.014)`. At 175 px per body the tone is then 96 % there, at 118 px 59 %. No extra cost. Watch for shimmer when it moves (`shot.cjs --motion`).
- **More depth:** `gap = mix(0.6, 1.0, deepIn) * ...` becomes `mix(0.45, 1.0, deepIn) * ...`.
- **(Optional) Tighter curls:** the loops are 0.065, 0.05 and 0.03 units across with strands 0.026, 0.022 and 0.015 wide. Scaling `p` by 1.33 inside `boucleYarn` and `MAT_DISPLACE` from 0.027 to 0.021 brings them to the beret's size. Thinner relief is harder to march (`MAT_STEP 0.6`): check that the outline does not break up.

### 4.7 Order of work, and what shows where

| change | 28 px | 68 px | 200 to 400 px | close up | cost |
|---|---|---|---|---|---|
| 1 rim | yes | yes | yes | yes | negligible |
| 2 strand size and depth | no | on a 2x screen | yes | yes | none (cheaper close up) |
| 3 halo outline | no | on a 2x screen | yes | yes | 5 to 10 % of a plush frame (estimate) |
| 4 lay and clumps | no | no | yes | yes | none |
| 5 light from one side | yes | yes | yes | yes | none |
| 6 lit flanks | no | no | at 300 px and up | yes | about 15 % (estimate) |
| cotton: rim and nap | rim | rim | both | both | one noise lookup |
| boucle: rim, later fade, depth | rim | rim | all | all | none |

Do 1 first and look at it at every size on both themes. Do 2 and 3 together (they share the cover and the opacity line). 4 is independent. 5 waits for the lighting work.

### 4.8 How to check

Render a lime frog at the reference's scale and run the two scripts in `scratchpad/research2/dots/scripts/`:

```
node tools/mascot/harness/shot.cjs out.png "looks=<the look, URL-encoded>&size=201&own=1" --scale 1
python3 -I scripts/ours.py scripts out.png        # outline, rim, speckle, autocorrelation, tones
python3 -I scripts/fin_ours.py scripts out.png    # both sides and the top, gradient, lit against shaded speckle
```

(the look is `[{"shape":"frog","material":"plush","colour":"lime","accent":"ice","eyes":"googly","glasses":"none","extra":"none"}]`). Accept when:

- outline, with the reference's blur: 3.0 px or more (reference 3.7 to 3.8);
- rim on a cherry or cobalt ball (`"shape":"pom"`), top and both sides: 1.7 to 2.0x at 2 to 4 px, about 1.5x at 8 px, about 1.2x at 15 px, 1.0x at 30 px; on lime about 1.2x;
- speckle 6 to 10 % RMS, autocorrelation near 0.56 / 0.11 / 0.0 at 1 / 2 / 3 px, bright against dark near 1.3, 1.25, 2.0;
- a sideways gradient of log luminance of 0.4 to 0.9 per body width toward the key (`fin_ours.py` prints it; today -0.07), which is a far side at about 0.55 to 0.65 of the near side;
- snow (white) at 28 and 68 px on the light page still has an outline you can see;
- `tools/mascot/harness/perf.sh` for plush at 68 px on a 2x screen stays inside 60 ms.
## 5. What to leave out, and why

- **Hair lobes strand by strand** (the three lobes, their shifts, the azimuthal terms). A strand is 1 to 2 px wide at the sizes that matter; what reaches the eye is "pale flank, deeper gap, pale edge", and recipes 1 and 2 give that with a few exponentials. The lobes would cost more per fibre than the whole of `furLight` does now and could not be checked against anything read in this study.
- **Real multiple scattering** (path tracing, dual scattering). One pass, and 25 to 60 ms a frame on the slowest machine. `again`, `reach` and the rim stand in for it; rough arithmetic in recipe 2 puts their colour ratios in the same order as the reference's.
- **Shells, fins, hair cards or strand geometry.** One fragment shader, no geometry passes. The march through the pile is the one-pass equivalent.
- **Whorls on the body.** The reference has none; keep them for the hat and the pom, whose reference (the beret) is curly with no lay.
- **A highlight on the pile.** The reference pile has none: the brightest body pixel is the dye washed pale, and only eyes and glasses reflect. Replace the exponent-40 highlight by the broad 3.5 % sheen.
- **Grain painted per pixel** (screen-space or unfiltered noise) to reach the reference's 4.5 % at 68 px on a 1x screen. It would crawl when the mascot moves and breaks the rule that detail below a pixel becomes its average. At that size the rim, the outline and the tone carry the look.
- **Slow blotches in the dye.** The reference's speckle is uncorrelated by 3 px on the frog (0.01) and nearly so on the cloud (0.13). Cotton's 0.2-unit blotch should shrink, not grow.
- **Single hairs flying clear of the outline.** None is resolved in the reference at 175 px per body; the halo of recipe 3 is the whole of it.
- **A new tone curve.** The present one already turns "dye plus rim" into "dye washed toward white", and our dyes already sit where the reference's do.
- **Blur, bloom or depth of field.** The reference's 1.6 px softness is the picture's resolution, not a look; there is one pass and no second buffer.
- **The reference's dark fringe on a light page.** It comes from cutting a black background out badly (2.0). It happens to draw an outline on white; do not copy it.
- **Light through the body.** Nothing in the reference shows it: shade is deep and saturated, not glowing.
## 6. What could not be confirmed

About the reference:

- **Who made the characters, with what, and whether they are 3D renders at all.** No credit or making-of was found; two pages refused to load. Section 3.2 is inference.
- **Anything finer than 1.6 px.** Strand width is an upper bound. The larger press picture could not be downloaded, and the four enlargements hold no more detail than the row.
- **The characters' true size.** Every size in units and millimetres assumes the frog is a 1.5-unit, 20 cm mascot.
- **Real fibre thickness.** Section 2.1's "15 to 30 micrometres" for a real plush fibre has no source in the researcher's record: it rests on memory.
- **Tone ratios outside the green frog.** Blue, pink and yellow clip. The rim's added light is read off a finished picture, after its own tone curve, so "+0.13 to +0.32" is display light, not scene light.
- **The curve of the outline where the rim was measured.** The rim's falloff by view angle (recipe 1) assumes a ball of radius 0.75 units.
- **The undersides.** The reference bodies are cut off at the bottom, so its darkest tones and ours are not the same parts of a body.
- **The lights**, beyond what the eyes and the bodies' gradients show (one soft key on the upper right, about half as much fill, light from above and behind).
- **The lay as a number over a whole body**: direction statistics were taken in four windows, not mapped.

About ours:

- **Nothing in section 4 was compiled, rendered or timed.** The constants come from arithmetic on the code's formulas and the measurements; the costs are estimates. The only test the arithmetic has had: it gives the lamps' even balance on plush (1.15 against 1.13; measured sideways gradient -0.07), and, with the reference frog's green as the dye and assumed covers, a bright-to-dark colour ratio of the same order as today's render.
- **The noise's statistics** (deviation about 0.19) are inferred from a comment in the code, not measured.
- **Knock-ons of a lower coat** on eyes, glasses and hats: only the comments of `looks.ts` were seen, not its code.
- **Bloom**, which shares `fibres`, `furLight`, `shadeFur` and MAIN_PILE, was not looked at. Keep every change inside `#ifdef FUZZY` or behind `f.kind`.
- **Shadows in our renders were not measured** against 2.5; by eye the hat's shadow on a cobalt ball is soft and keeps its colour.
- **Shimmer in motion** after `f.fine` 80, the halo and the later boucle fade: all stills.
- **Our numbers are from one colour and one shape** (a lime frog), plus a sky-blue and a charcoal ball; other dyes were not measured.
- **The dark theme** was not measured at all.
- **How people judge it.** No viewer, blind or otherwise, has seen any of this.

About the method:

- **Section 3.3 is memory.** The names, dates and what each model does are recalled, not read; treat them as pointers for a search, not as citations.
## 7. Sources

Web pages (the researcher's; nothing was opened afterwards):

| source | what it is | status |
|---|---|---|
| https://sfstandard.com/2026/09/29/openai-launches-dots/ | San Francisco Standard, news article on the launch; describes the characters as "plush"; names no maker | read in part (a fetch tool returned its quotations and image links, not the full text) |
| https://techcrunch.com/2026/09/29/openai-launches-dots-its-bubbly-agentic-avatar/ | TechCrunch, news article on the launch; picture credited to OpenAI; names no maker | read in part (the same way) |
| https://www.fastcompany.com/91615068/openai-dots-agent-crew-of-friendly-mascots | Fast Company, design article on the characters | seen in search results only (the page returned HTTP 403) |
| https://www.fastcompany.com/91620091/big-tech-is-cutewashing-its-ai-agents | Fast Company, article on mascots for AI agents | seen in search results only (HTTP 403) |
| https://openai.com/index/devday-2026-recap/ | OpenAI's recap of DevDay 2026 | seen in search results only |
| https://help.openai.com/en/articles/6825453-chatgpt-release-notes | ChatGPT release notes (launch date) | seen in search results only |
| https://community.openai.com/t/devday-2026-announcements-and-developer-resources/1402006 | OpenAI developer forum thread | seen in search results only |
| https://pasqualepillitteri.it/en/news/20242/meta-openai-cute-mascots-ai-agents-jolly-dots | news article listing the characters' shapes | seen in search results only |
| https://designcompass.org/en/2026/09/30/openai-dots-always-on-ai-agents/ | design news item on the launch | seen in search results only |
| https://studiodumbar.com/work/openai-devday-2025 | Studio Dumbar's case study of the DevDay 2025 identity (not these characters) | seen in search results only |
| https://makerworld.com/en/models/3382205 | a fan's printable model "based on OpenAI Dots" | seen in search results only |

Local material:

| source | what it is | status |
|---|---|---|
| `scratchpad/ref/dots_row.png`, `cloud.png`, `frog.png`, `heart_tri.png`, `fibre.png` | the reference pictures | read in full (measured; section 2) |
| `scratchpad/research2/dots/transcript.txt`, `parts/02.md`, `scripts/`, `crops/`, `renders/` | the researcher's record, finished section, code and pictures | read in full (three crops were opened for this report) |
| `modellab/web/src/components/yeti/mascot/shaders.ts` | the shaders: the pile and both marches | read in part (lines 286 to 913, with the head of the file as the transcript shows it) |
| `.../mascot/materials/cotton.glsl`, `boucle.glsl` | the two cloth materials | read in full |
| `.../mascot/materials/_lib.glsl` | the material library | read in part (lines 55 to 250) |
| `.../mascot/engine.ts` | lamps, exposure, level of quality | read in part (the lines that set them) |
| `.../mascot/looks.ts` | where parts are placed | read in part (the lines that mention the pile) |
| `tools/mascot/README.md`, `docs/MATERIALS.md` | the renderer's guide and the materials' notes | read in part (by the researcher; headings checked for this report) |

From memory (not opened in this study; no address was looked up, so none is given):

| source | what it is | status |
|---|---|---|
| Kajiya and Kay, "Rendering fur with three dimensional textures", SIGGRAPH 1989 | fur as a volume; the strand lighting our `furLight` uses | from memory (the formula itself was read in our code) |
| Marschner and others, "Light scattering from human hair fibers", SIGGRAPH 2003 | the three lobes of a hair fibre | from memory |
| Zinke and others, "Dual scattering approximation for fast multiple scattering in hair", SIGGRAPH 2008 | multiple scattering in hair without path tracing | from memory |
| d'Eon and others, "An energy-conserving hair reflectance model", 2011 | a corrected hair model | from memory |
| Chiang and others, "A practical and controllable hair and fur model for production path tracing", 2016 | Disney's production model | from memory |
| Yan and others, fur reflectance models, 2015 and 2017 | fur fibres with a scattering core | from memory |
| Lengyel and others, "Real-time fur over arbitrary surfaces", 2001 | shells and fins | from memory |
| Estevez and Kulla, "Production friendly microfacet sheen BRDF", 2017 | the "Charlie" sheen | from memory (the formula itself was read in our code) |
| Neubelt and Pettineo, "Crafting a next-gen material pipeline for The Order: 1886", 2013 | the cloth visibility term | from memory (the formula itself was read in our code) |
| Grooming tools (XGen, Houdini, Blender hair, Yeti, Ornatrix) | how strand fur is authored | from memory |
| "A real plush fibre is 15 to 30 micrometres across" (section 2.1) | fibre thickness | from memory (the researcher's; no source recorded) |
