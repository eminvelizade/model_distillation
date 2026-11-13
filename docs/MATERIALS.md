# The materials: what each one is, and how it is drawn

A make-your-own mascot can be made of six materials, all cloth-like or soft. Three are **pile**: plush, cotton and
bouclé are a coat of real strands, drawn as a volume of fibres, and differ only in how the strands are sized and how
they lie. Three are **surfaces**: elastane, sugar and clay, each with a shader of its own in
`modellab/web/src/components/yeti/mascot/materials/`. This page says what each real thing is, what makes a picture
of it unmistakable, and how it is drawn here. How the renderer is put together is in the
[mascot guide](../tools/mascot/README.md).

![The six materials](screenshots/hub_23_materials.png)

## What this rests on

- **The texture was measured from the reference**, not judged by eye. The owner's reference for "the perfect woolly,
  grainy, cottony texture" is OpenAI's Dots characters. Their pictures were studied as a forensic exercise (strand
  sizes, how the strands lie, the grain's size, contrast and colour, the pale rim, the outline, tones, shadows, the
  light), and our plush was rendered at the same resolution, measured with the same code, and changed until the
  numbers agreed. The study is [research/reference-texture.md](research/reference-texture.md). None of OpenAI's
  pictures are in this repository. Who made the characters, and with what, was not found.
- **The light was researched** ([research/natural-light.md](research/natural-light.md)): about 27 sources read, and
  a rig fitted numerically to the reference's tones. The rig in the code is that report's "rig E".
- **Cotton was researched in depth earlier** ([research/cotton.md](research/cotton.md), 22 sources): cloth
  reflectance and knit structure. Cotton is now a brushed nap, so that report's knit is no longer drawn; what it says
  about cloth's light (no highlight, an even tone, a pale haze) still holds.
- **Bouclé, elastane, sugar and clay were not researched in depth.** Research agents were started for them twice
  and cut off by a usage limit both times before they wrote anything. What they have is a handful of single web
  searches whose excerpts were read (listed under Sources): how bouclé yarn is made, what elastane is, sugar's grain
  sizes, what Plasticine is made of, how far apart a fingerprint's ridges are, what makers of clay shaders
  recommend, and one sherpa fleece's pile height (7 mm). Everything else about them is general knowledge.
- **Two of the three reports were finished from interrupted work.** The researchers of the reference texture and of
  the light were cut off (a machine restart, then the usage limit); their reports were completed from their saved
  logs, scripts and measurements by a second agent. Each report says which of its numbers were re-computed.
- **Checked blind only in their old form.** AI viewers twice named seven or eight of ten materials and rated them 4
  to 7 out of 10 as photographs (see the end of this page). That was before this rework. The new plush, cotton,
  bouclé and clay, and the new light, have not been looked at blind, and nothing was compared with a photograph of
  a real toy.
- **Speed was measured on a software renderer only** (no graphics card). There, one frame of a plain ball at 68 px
  on a 2x screen takes about 70 ms in plush, 74 in cotton, 80 in bouclé, 22 in elastane, 42 in sugar and 28 in clay
  with a look's own program (plush was 57 ms before the rework). Readings vary by about a tenth from run to run.

## Two rules that apply to all of them

1. **A material is its light first, its texture second, but the texture has to survive.** A mascot is a 20 cm toy
   drawn 28 to 400 px tall. The reference shows what that should look like: at 175 px per body its strands are 1 to
   2 px wide and still read as fibres, and its pale rim survives down to a 24 px body. So the rim and the tones are
   what every size gets, and the strands are sized to show from about 130 px up.
2. **Detail smaller than a pixel becomes its average, never noise.** Every fine pattern fades toward its mean tone
   and height as it shrinks (`resolved()` in the library, the `lod` of `fibres()` in the pile), and sooner where the
   surface turns away from the eye (`resolvedOn()`). What is left is real texture a pixel or two across, as in the
   reference, and it moves with the body: between two frames half a degree of turn apart, a 68 px mascot on a 2x
   screen changes by 3 % of its local brightness in plush and 10 % in bouclé, which is about the grain's own
   strength. Fading the strands sooner removed that and the reference's grain with it (7 % fell to under 3 %), so it
   was not done. How it looks in motion on a real screen was not checked: every picture here is a still.

## The light

Every mascot stands in natural light: the look of a soft toy by a large window, on a pale table. Bloom too: he has
the same lamps, sky and floor, the pale rim (at under half strength, since long fur stands edge-on to the eye over
much of him), creases that keep their colour and the deeper shadow on the page. His fur's structure is unchanged.

| | light theme | dark theme |
|---|---|---|
| key | one large lamp (45 degrees in angular radius), 50 degrees to the left and 40 up; warm white (about 6,150 K), 0.70 | the same |
| sky | overcast: three times brighter overhead than at the horizon; cooler (about 7,000 K), 0.40 | the same |
| floor | the page returns 0.6 of the light that falls on it to whatever faces it, except right under the mascot | a table that is dark to the eye and returns about 0.3 |
| fill | the room on the far side: 0.06 | 0.12 |
| rim | from behind and above: 0.30 | 0.75 (on a dark page the rim is a lamp) |
| exposure, tone curve | 1.0 (1.12 for white); Khronos PBR Neutral, which keeps a dye's hue | the same |

What that changes in the picture, in the order it matters:

- **The body is modelled from side to side.** Before, a 0.32 fill and a 0.58 back lamp cancelled the key: left and
  right differed by a few percent and all the contrast was a fall toward a dark base. Now the lit side, the middle
  and the shaded side of a plush frog sit at 0.66, 0.55 and 0.39 (linear), against the reference's 0.68 to 0.76,
  0.57 and 0.39 to 0.42.
- **Lamps have a size.** `lampWrap(nl, w)` is what a matte surface gets from a disc-shaped lamp (within 0.01 of the
  exact integral): the shadow line is a band, not an edge. Materials use it through `lampOn()`.
- **A sky and a floor.** `skyIrr()` is an overcast dome plus the light the page sends back up, so undersides are
  not dark on a light page.
- **Occlusion keeps the dye's colour** (`occludeBy()`, after Jimenez et al. 2016): a crease in a bright dye is the
  dye, deeper, not grey.
- **Softer shadows** (the key's shadow is that of a large lamp), and **the shadow on the page** is deeper close to
  the body and trails off away from the lamp.
- **No camera effects.** No depth of field, vignette, grain or bloom: a mascot is a cut-out on a flat page.

The pile sends back less light than a matte surface of the same dye, because its fibres shade one another. Its
shading is multiplied by 1.5 to make that up, so a pile in the light is its dye's own colour.

## The pile: plush, cotton and bouclé

A pile is drawn as a volume: rays are marched through a coat of strands and each strand met covers part of the
pixel, which gives the soft outline and the depth for free (`furM`, `fibres`, `shadeFur` and `MAIN_PILE` in
`shaders.ts`). The strands are built the same way in all three materials:

- The coat is divided into **clumps** (cells of a wobbly grid with ragged borders, so strands of neighbouring clumps
  interlock). A clump has a direction it lies in, and its strands lean in toward its middle at their tips.
- A **strand** is a cell of noise stretched along that direction: thick at the root, tapering to a point, slightly
  curved, lying over like thatch so that half to two thirds of it shows before the next covers it.
- Strands differ in **length**, and a few stand clear of the rest: the outline is soft and uneven.
- A strand is shaded **round**: its middle is paler, its flanks deeper, and finer fibres streak it along its length.
  So the grain is a change of colour (pale flank over saturated depth), not a brightness wobble.
- **The pale rim.** Seen edge-on, a pile shows light that met one fibre and left again, hardly dyed. Every outline
  carries a halo that is the dye washed toward white, on the side away from the lamp as well.

The numbers for each material are `PILES` in `engine.ts`:

| | plush | cotton | bouclé |
|---|---|---|---|
| depth of the coat (units; 1 unit is about 13 cm) | 0.056 | 0.026 | 0.060 |
| clumps across one unit | 15 | 34 | 13 |
| strand width (units) | 0.010 | 0.005 | 0.015 |
| a strand's length against its width | 2.8 | 1.8 | 3.0 |
| how the clumps lie | combed one way, up to about 37 degrees off it | any way at all | any way at all |
| how much a strand bends | a little | hardly | strongly: C and S curls |
| whole clumps of different heights (nubs) | no | no | yes |
| pale rim | full | a little over half | nine tenths |

### Plush

*Thick strands combed one way: the reference's own fabric.*

Measured on a lime frog drawn at the reference's resolution (a body 175 px wide), with the same code as the
reference:

| | reference | plush before | plush now |
|---|---|---|---|
| grain: speckle against the local mean (RMS) | 7 % lit, 10 % in shade | 2 % | 6 to 7 % |
| bright specks against dark ones, in red, green, blue | 1.31, 1.24, 1.98 | 1.15, 1.14, 1.47 | 1.33, 1.25, 2.4 to 2.8 |
| grain size: correlation at 1 and 2 px | 0.56, 0.11 | 0.76, 0.38 | 0.31 to 0.38, 0.02 to 0.09 |
| strands | 0.035 to 0.06 units showing, one drifting lay | a grid of patches, each combed its own way | 0.03 to 0.05 units, one drifting lay |
| pale rim: brightness 2 px inside the outline against the interior | 1.2 on green (2.0 on pink and blue) | 0.87: darker at the edge | 1.24 on the lit side, 1.67 on the far side |
| top, middle, and each side (linear light) | lit 0.68 to 0.76, middle 0.57, shaded side 0.39 to 0.42 | 0.75, 0.67, and 0.61 on both sides: flat | lit side 0.66, middle 0.55, shaded side 0.39 |

Where it still differs: our grain is a little finer than the reference's (whose picture is slightly blurred), our
lit side is 4 to 13 % darker, and the outline's softness was not matched by measurement (the reference rises over
3.4 px; ours is soft to the eye, with stray strands the reference does not show).

### Cotton

*A short brushed nap, as on flannel or the inside of a sweatshirt: what "cottony" looks like.*

Fine fibres half a strand's width of plush, lying every way, in a coat under half as deep. At mascot sizes single
fibres are smaller than a pixel, so cotton reads as a smooth, even, matte body with a soft edge and a narrow pale
rim, and shows its fibres only in the editor's preview and larger. It is told from plush by its tight outline and
its fine, even grain. (Cotton was a smooth knitted surface before: the blind viewers faulted it for stitches too
regular to be real, no fuzz and a razor-clean outline.)

### Bouclé

*Curly, nubby looped wool: teddy fabric. The beret in the reference is this kind of cloth.*

- **The real thing:** an effect yarn is fed faster than the core it is wound round, so the extra length buckles into
  loops, and a binder thread holds them. One sherpa fleece on sale lists a 7 mm pile, which is 0.053 units here.
- **How:** the thickest strands of the three, bent strongly so they curl into C and S shapes, in clumps that lie any
  way at all and stand at different heights, which makes the nubs. (Bouclé was relief on a surface before: both
  blind viewers took it for a scouring pad, because its strands merged like poured goo.)
- **Left out:** closed loops; the ply and twist of the yarn.

### What the mascot wears

Hats, scarves and poms are pile too and use the same strand code: knitted things are a small curly wool (like
bouclé at a little over half the scale), a pom is fluffy like plush.

## Elastane

*The stretch fabric of swimwear and athletic wear.*

*Looked up:* what the fibre is (a segmented polyurethane that stretches to four to eight times its length). How
the cloth looks is from memory.

- **The real thing:** a very fine knit of smooth synthetic filaments, pulled taut. No fuzz and no visible weave.
- **What tells it apart:** deep saturated colour with a satin lustre. Smooth fibres lying side by side mirror a lamp
  into a streak that runs across them, so highlights are long soft bands that wrap round the body.
- **How:** an anisotropic GGX lobe laid along the fibres (which run up the body), smooth along a fibre and rough
  across them, partly tinted by the dye; a dark, rich matte base; a tight sheen toward grazing angles; a very fine
  knit in close-up (columns of small loops); lustre that varies a little where the cloth is stretched more. The
  cloth is four panels sewn up the body with flat seams, none down the middle of the face: thread wrapped slantwise
  between two rows of needle holes, with the cloth puckering a little beside it. The seams show on a large mascot
  and fade out on a small one. At the very top, where "up the
  body" has no meaning, the streak fades out.
- **Left out:** the paler tone of cloth stretched thin over a bulge; folds. Not changed in this round beyond the light.

## Sugar

*A soft jelly sweet in the body's colour, rolled in coarse sugar.*

*Looked up:* grain sizes (granulated sugar about 0.6 mm, coarse sugar 1 to 3 mm, sanding sugar between), and the
sparkle method's source. Sucrose's index was found in one secondary source only (1.54, which reflects 4.5 %
head-on; the shader uses 4.8 %). The rest is from memory.

- **The real thing:** clear crystals of sucrose about a millimetre across, lying every which way on a translucent
  jelly. Sucrose reflects a little under 5 % of light head-on.
- **What tells it apart:** the rough, frosted outline; pinpoint flashes that come and go as it turns; colour that
  glows between and under the crystals; pale, frosted colour when small.
- **How:** the crystals are real relief: one small brick in each cell of two jittered grids of different sizes,
  turned against each other so no grid shows, each brick turned its own way, with flat faces and sharp sides. A
  crystal is clear: the jelly shows through its top face, its bevelled edges are white, and each is clearer or
  cloudier than the next. Between the big crystals lies fine sugar dust, which is what makes the colour pale and
  frosted and not speckled. A face that mirrors a lamp flashes; where crystals are too small to resolve, grains that fade instead of flickering take
  over (after Wang and Bowles' sparkle), with a few larger ones that still show on a small mascot. The jelly lets
  light creep past the shadow line and glows where a lamp is behind a thin part (thickness is measured through the
  body, as in Barré-Brisebois and Bouchard's translucency).
- **Since the blind checks:** the crystals come in more sizes (a few large among many small), and the jelly between
  them lies in their shade.
- **Left out:** light bending inside a crystal; a real crystal shows several faces, where these show one; crystals
  piled on crystals.

## Clay

*Modelling clay (plasticine), shaped by hand.*

*Looked up:* what Plasticine is made of (calcium salts, petroleum jelly and fatty acids, which is why it never
dries) and how far apart the ridges of a fingerprint are (0.41 to 0.46 mm on average, so the shader's are about
three and a half times life size). How it looks is from memory.

- **The real thing:** smooth and a little waxy, with a broad satin highlight. Light gets a short way into it. Makers
  of clay shaders agree on the recipe: a fairly smooth surface (a roughness of about 0.3 for plasticine in one
  shader's notes, against 0.6 for terracotta), little scattering (more washes the fingerprints out), relief that is
  subtle, and fingerprints that are subtler still.
- **What tells it apart:** nothing a hand shapes is even. The outline stands in and out by a couple of millimetres,
  the side light catches thumb dents, and there is only the one broad highlight.
- **How:** real relief (broad lumps and thumb dents, 0.028 units at most), so the unevenness is in the outline and
  in the shadows; a satin surface with light wrapping a little past the shadow line and a little coming back from
  inside in a deeper tone; and fingerprints in patches where a thumb pressed: ridges 0.012 units apart (about three
  and a half times life size) that arc across the patch and waver, in two sets of patches so that one print lies
  over another. A pressed patch is a little smoother than the rest.
- **Left out:** seams where parts were joined; tool marks and lint (tried: they read as stains); the way the surface
  "boils" from frame to frame in stop motion.

## The blind checks, and what they were of

Before this rework there were ten materials, and AI viewers (fresh instances of the model, shown a plain ball of
each with no names; they are not people) were twice asked what each was made of. Both times one viewer named seven
of the ten and the other eight, and they rated the pictures 4 to 7 out of 10 as photographs. Of the six materials
kept: plush, cotton, sugar and clay were named by both viewers both times; elastane was taken for satin or rubber;
bouclé was taken for a scouring pad. What they faulted, and what has changed since:

| What they said | Now |
|---|---|
| Plush: tufts look like flat brush strokes in close-up, no depth between them, colour very even | rebuilt as strands shaded round, with deeper colour between them (see Plush) |
| Cotton: stitches too regular, no fuzz, razor-clean outline | now a brushed nap of fibres |
| Bouclé: strands melt into each other; a scouring pad | now curled strands of pile |
| Clay: a plain matte ball from a distance; no waxy sheen | real lumps and dents in the outline; a satin highlight |
| Sugar: crystals of one size, flat, no shade between them | more sizes, shade between them; still one face per crystal |
| Elastane: could be satin or rubber | seams and a knit were added before this round; not changed since |

**None of the new versions has been looked at blind.**

## What mirrors see

Sugar's crystals, elastane's lustre, clay's sheen and the glossy eyes need something to mirror. `studio()` in the
library is the same light as panels: the large key, the fill, the rim, walls, and the floor, which is the page with
the mascot's own shadow on it. Each panel is as bright as the light its lamp gives a matte surface, so a mirror and
a matte surface agree about the lighting.

## Sources

The reference texture and the light have their own source lists, in [research/reference-texture.md](research/reference-texture.md)
and [research/natural-light.md](research/natural-light.md).

**Read for the cotton research** (22 of the 57 the report lists; the rest were seen only in search results or are
from memory, and are in the report, not here):

1. Estevez and Kulla, "Production Friendly Microfacet Sheen BRDF", 2017. https://blog.selfshadow.com/publications/s2017-shading-course/imageworks/s2017_pbs_imageworks_sheen.pdf
2. Sadeghi, Bisker, De Deken, Jensen, "A Practical Microcylinder Appearance Model for Cloth Rendering". https://escholarship.org/uc/item/6v11p5b0
3. Neubelt and Pettineo, "Crafting a Next-Gen Material Pipeline for The Order: 1886", 2013. https://blog.selfshadow.com/publications/s2013-shading-course/rad/s2013_pbs_rad_notes.pdf
4. Burley, "Physically Based Shading at Disney" (from a mirror). https://cgvr.informatik.uni-bremen.de/teaching/cg_literatur/Brent%20Burley%20-%20s2012_pbs_disney_brdf_notes_v3.pdf
5. Filament design document, cloth model. https://google.github.io/filament/Filament.md.html
6. Narkowicz, "Cloth Shading", 2018. https://knarkowicz.wordpress.com/2018/01/04/cloth-shading/
7. Zeltner, Burley, Chiang, "Practical Multiple-Scattering Sheen Using Linearly Transformed Cosines". https://tizianzeltner.com/projects/Zeltner2022Practical/ and https://github.com/tizian/ltc-sheen
8. OpenPBR specification. https://academysoftwarefoundation.github.io/OpenPBR/
9. KHR_materials_sheen. https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_sheen/README.md
10. MaterialX `mx_microfacet_sheen.glsl`. https://raw.githubusercontent.com/AcademySoftwareFoundation/MaterialX/main/libraries/pbrlib/genglsl/lib/mx_microfacet_sheen.glsl
11. Wang, Jin, Hasan, Yan, "SpongeCake". https://ar5iv.labs.arxiv.org/html/2110.07145
12. Zhu, Jarabo, Aliaga, Yan, Chiang, "A Realistic Surface-based Cloth Rendering Model", supplementary document. https://sites.cs.ucsb.edu/~lingqi/publications/supplementary_sig23cloth.pdf
13. Portsmouth, Kutz, Hill, "EON: A practical energy-preserving rough diffuse BRDF". https://arxiv.org/html/2410.18026
14. Unity HDRP, "Understand fabrics" and `Fabric.hlsl`. https://docs.unity3d.com/Packages/com.unity.render-pipelines.high-definition@17.0/manual/understand-fabrics.html
15. Mitsuba 0.x `irawan.cpp`. https://github.com/mitsuba-renderer/mitsuba/blob/master/src/bsdfs/irawan.cpp
16. Montazeri et al., "A Practical Ply-Based Appearance Modeling for Knitted Fabrics". https://ar5iv.labs.arxiv.org/html/2105.02475
17. Textile School, "Geometrical Modelling of Plain Weft Knitted Fabrics". https://www.textileschool.com/?p=4168
18. "Hairiness in yarn". https://textile-technology.blogspot.com/2008/04/hairiness-in-yarn.html
19. Wikipedia, "Mercerised cotton" and "Poplin". https://en.wikipedia.org/wiki/Mercerised_cotton, https://en.wikipedia.org/wiki/Poplin

**Looked up** for bouclé, elastane, sugar and clay, and to check the papers named on this page (one web search
each; the excerpts it returned were read, the pages were not opened in full):

- Bouclé: a study of bouclé yarn's structure. https://link.springer.com/article/10.1007/s40034-021-00225-1 and https://nopr.niscpr.res.in/bitstream/123456789/39053/1/IJFTR%2041%284%29%20367-372.pdf
- Elastane: CAMEO, "Spandex fiber". https://cameo.mfa.org/wiki/Spandex_fiber and https://www.fibersource.com/f-tutor/spandex/
- Sugar: grain sizes. https://bobsredmill.com/articles/what-is-sanding-sugar Sucrose's index (a secondary source). https://wiki.kidzsearch.com/wiki/Sucrose
- Clay: Wikipedia, "Plasticine". https://en.wikipedia.org/wiki/Plasticine Ridge-to-ridge distance in fingerprints (a 1989 study, from its abstract). https://ojp.gov/ncjrs/virtual-library/abstracts/analysis-ridge-ridge-distance-fingerprints
- Clay shaders: a Blender forum thread and a clay-shader product's manual (roughness, subtle displacement and prints, low scatter). https://blenderartists.org/t/clay-material-tips/1524904 and https://superhivemarket.com/products/kin-klei/docs
- Sherpa fleece: one retailer's listing with a 7 mm pile. https://fabricwholesaledirect.com/products/sherpa-faux-fur-fleece-fabric
- Sucrose: monoclinic, habit varies (NIST entry). https://webbook.nist.gov/chemistry/silmarils-solids-hrf-drf/docs/META.MIR.PUR.Sucrose.SLD.FLUKA.PNNL409565.pdf
- Wang and Bowles, "A Robust and Flexible Real-Time Sparkle Effect", 2016. https://diglib.eg.org/bitstream/handle/10.2312/sre20161209/049-054.pdf
- Karis, "Physically Based Shading on Mobile", 2014 (the fit to the split sum that `envBRDF` uses; its constants match). https://www.unrealengine.com/en-US/blog/physically-based-shading-on-mobile
- Barré-Brisebois and Bouchard, "Approximating Translucency for a Fast, Cheap and Convincing Subsurface Scattering Look", 2011. https://ea.com/frostbite/news/approximating-translucency-for-a-fast-cheap-and-convincing-subsurface-scattering-look
- Fujii's variant of Oren and Nayar's model (posted in 2012). https://lists.blender.org/pipermail/bf-cycles/2012-February/000578.html
- Lagarde and de Rousiers, "Moving Frostbite to Physically Based Rendering", 2014 (found; the specular occlusion formula used here was not checked against it). https://blog.selfshadow.com/publications/s2014-shading-course/frostbite/s2014_pbs_frostbite_slides.pdf
- Glints, read about and not implemented: Zirr and Kaplanyan 2016. https://research.nvidia.com/sites/default/files/pubs/2016-02_Real-time-Rendering-of/ZirrKaplanyan_MultiscaleI3D2016.pdf Chermain et al. 2020. https://diglib.eg.org/handle/10.1111/cgf14141 Deliot and Belcour 2023. https://arxiv.org/pdf/2306.05051

**Still named from memory only:** Oren and Nayar 1994; Walter et al. 2007 (GGX); Burley 2012 and Kulla and Conty 2017
(anisotropic GGX); Quilez's articles on distance functions, soft shadows and ambient occlusion; Worley 1996
(cellular noise); Khronos PBR Neutral tone mapping.
