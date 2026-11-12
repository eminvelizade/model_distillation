# The materials: what each one is, and how it is drawn

A make-your-own mascot can be made of ten materials. Plush is the pile the mascots started with (see
[tools/mascot/README.md](../tools/mascot/README.md)); the other nine are surfaces, each with a shader of its own in
`modellab/web/src/components/yeti/mascot/materials/`. This page says, for each, what the real thing is, what makes a
picture of it unmistakable, and how the shader gets that. How a material is written and tested is in the mascot
guide.

![The ten materials](screenshots/hub_23_materials.png)

## What this rests on

- **Cotton was researched in depth.** A research agent read 22 sources and wrote a long report; its findings are
  the cotton section below, and its sources are listed at the end with what was read and what was only seen in
  search results.
- **The other eight were not.** The same research was planned for each and was cut off by a usage limit before it
  produced reports. Their sections are written from what is generally known in the rendering literature, and the
  works they name are **cited from memory and were not opened and checked for this page**. They are marked so.
- **Every material was judged by eye** on the same set of renders (large, close up, at 68 and 28 px, on the light
  and the dark theme, in white, charcoal, red and mint, with a hat, a scarf and glasses, and from three angles).
  Nothing was compared against photographs side by side, and no one other than the author has reviewed them yet.
- **Speed was measured on a software renderer only** (no graphics card). There, one frame of a plain ball at 68 px
  on a 2x screen takes 58 ms in plush and 24 to 55 ms in the other materials with a look's own program; 170 ms and
  68 to 136 ms with the shared one.

## Two rules that apply to all of them

1. **At the sizes the app draws, a material is its light, not its texture.** A mascot is a 20 cm toy drawn 28 to
   400 px tall, so one pixel covers 0.3 mm at best and several millimetres usually. A weave, a crystal or a
   fingerprint is smaller than a pixel almost everywhere. What survives is where the highlights sit and how wide
   they are, how the outline and the shadow line look, and whether light gets through. Each shader gets those right
   first; the fine structure is for the editor's preview and anything larger.
2. **Detail smaller than a pixel becomes its average, never noise.** Every fine pattern fades toward its mean tone
   and height as it shrinks (`resolved()` in the library), so small mascots are clean and nothing shimmers when
   they move.

## Cotton

*Smooth knitted cotton, as on a well-made soft toy.*

- **What tells it apart** (from the research, in order): no highlight at all, so the brightest part of the body is
  still the dye's colour; an even, flat tone across the lit side (a matte cloth ball keeps about three quarters of
  its brightness out to the edge, where a smooth matte ball keeps a fifth); a crisp outline with no halo, which is
  the main difference from plush; shade that gets deeper in colour, not greyer; seams.
- **Close up:** a jersey knit (columns of small V-shaped stitches) that is never ruler-straight, thick and thin
  places in the yarn, an uneven dye, a seam where two panels meet.
- **How:** a rough matte lobe (Oren and Nayar's, in Fujii's form) under a weak pale haze (Estevez and Kulla's
  "Charlie" sheen), and nothing mirrored. The knit is drawn at twice life size so it shows a little sooner, and its
  columns lean and wander. White cotton is 0.93 of white, as bleached cloth is never paper white.
- **Left out:** stray fibres along the outline, lint on dark dyes, puckered hand-sewn seams (the report recommends
  all three).

## Bouclé

*Curly, messy looped cloth: teddy fabric.* (From memory, not checked.)

- **The real thing:** a yarn that was overfed while it was spun buckles into loops and curls a few millimetres
  across, which stand off the cloth every which way.
- **What tells it apart:** a nubby outline at any size, speckled shading even when small, deep saturated shade
  between the curls, and softness: no strand has a hard edge.
- **How:** the curls are real relief, so they are in the outline and shade one another. Where a wavy surface in
  space (a warped gyroid) cuts the body, the cut is a curve that wanders and closes on itself like a loop of yarn.
  Three sets of such curves at different scales, one over another, make the tangle; each strand is a rounded ridge
  along its curve. Yarn is full of air, so a strand is shaded by a gentler slope than its true one, and its haze of
  loose fibres glows by the body's slope rather than as a rim on every strand.
- **Left out:** single fibres standing off the strands; the ply and twist of the yarn.

## Elastane

*The stretch fabric of swimwear and athletic wear.* (From memory, not checked.)

- **The real thing:** a very fine knit of smooth synthetic filaments, pulled taut. No fuzz and no visible weave.
- **What tells it apart:** deep saturated colour with a satin lustre. Smooth fibres lying side by side mirror a lamp
  into a streak that runs across them, so highlights are long soft bands that wrap round the body.
- **How:** an anisotropic GGX lobe laid along the fibres (which run up the body), smooth along a fibre and rough
  across them, partly tinted by the dye; a dark, rich matte base; a tight sheen toward grazing angles; a very fine
  rib in close-up; lustre that varies a little where the cloth is stretched more. At the very top, where "up the
  body" has no meaning, the streak fades out.
- **Left out:** seams, and the paler tone of cloth stretched thin over a bulge.

## Sugar

*A soft jelly sweet in the body's colour, rolled in coarse sugar.* (From memory, not checked.)

- **The real thing:** clear crystals of sucrose up to a millimetre across, lying every which way on a translucent
  jelly. Sucrose reflects about 5 % of light head-on.
- **What tells it apart:** the rough, frosted outline; pinpoint flashes that come and go as it turns; colour that
  glows between and under the crystals; pale, frosted colour when small.
- **How:** the crystals are real relief: one small brick in each cell of two jittered grids of different sizes,
  turned against each other so no grid shows, each brick turned its own way, with flat faces and sharp sides. A face
  that mirrors a lamp flashes; where crystals are too small to resolve, grains that fade instead of flickering take
  over (after Wang and Bowles' sparkle), with a few larger ones that still show on a small mascot. The jelly lets
  light creep past the shadow line and glows where a lamp is behind a thin part (thickness is measured through the
  body, as in Barré-Brisebois and Bouchard's translucency).
- **Left out:** light bending inside a crystal; at mid sizes the crystals can read as a fine white speckle.

## Ice

*A figure carved from real ice.* (From memory, not checked.)

- **The real thing:** nearly colourless, and it bends light less than glass (index 1.31), so it mirrors little
  head-on and a lot at the edges. Air comes out of water as it freezes inward, so the middle is milky and holds
  bubbles; stress leaves curved cracks; the surface is rippled by melting, wet, and frosted where it is dry.
- **What tells it apart from glass:** the milky core, the cracks, the frost. Ice has no dye: the body's colour is
  only a blush in the thick parts.
- **How:** a ray is bent at the rippled surface and followed through the body. On the way it gathers the core's
  milk (denser deeper in), the bubbles, and the cracks (curved sheets); what is left of it leaves the far side and
  sees the lamps or the page, or is trapped and mirrored back. Frost is a rough white layer in patches, with grains
  that flash. Thin clear parts let the page show through.
- **Left out:** bubbles as separate round things (they are a cloudiness that varies), elongated bubble streaks,
  light concentrated on the floor.

## Glass

*Clear coloured glass, blown by hand.* (From memory, not checked.)

- **The real thing:** no colour on its surface: all of it comes from how much glass the light crossed (Beer and
  Lambert's law), so thick parts are deep and thin parts pale. Index about 1.5.
- **What tells it apart:** sharp reflections of the studio, stronger toward the edges; the scene behind seen bent
  and upside down; dark, rich edges where light is trapped inside.
- **How:** a ray goes in, crosses the body and leaves the far side, or meets the inner surface too flatly and is
  mirrored back for a second crossing. The surface wavers very slightly, as hand-blown glass does. A little light is
  scattered inside in the glass's own colour, which is what keeps the colour on a dark page. Clear parts let the
  page show through.
- **Left out:** colours splitting at the edges, light concentrated on the floor, more than two crossings.

## Chrome

*Mirror-polished metal, tinted by the body's colour.* (From memory, not checked.)

- **The real thing:** a mirror has no look of its own. It is its surroundings, bent round the shape.
- **What tells it apart:** the lamps' panels as crisp bright shapes, a bright floor under a darker room, a dark
  side where the camera stands (a mirror needs something dark to have lines), and the object mirrored in itself.
- **How:** the studio mirrored (see below), and the mascot mirrored in itself once (an ear in the head). The
  surface wavers by a hair, there are hairline scratches in close-up and a smudge where the mirror is a little
  dull. White is silver, yellow is gold, charcoal is black chrome, the rest tinted chrome.
- **Left out:** a second mirroring of itself; the true colour of each metal at grazing angles.

## Ceramic

*Glazed stoneware.* (From memory, not checked.)

- **The real thing:** a layer of coloured glass melted onto a matte clay body. Molten glaze runs off bulges and
  edges, where it ends up thin and pale ("breaking"), and gathers in hollows, where it is thick and dark
  ("pooling"). It shrinks more than the clay as it cools, which cracks it finely ("crazing").
- **What tells it apart from plastic:** colour that follows the shape, sharp reflections with a soft falloff over a
  matte colour underneath, and a bare foot where the piece stood in the kiln.
- **How:** the glaze's thickness is worked out from how the body curves (measured from the distance field) and how
  enclosed the spot is; colour goes from pale clay-tinted to deep with thickness. A clear coat mirrors the studio
  over a matte base, on a surface that wavers slightly. Close up there is crazing (the borders of irregular cells)
  and the odd iron speck. The lowest few millimetres are bare, matte clay.
- **Left out:** pinholes; depth inside the glaze.

## Clay

*Modelling clay (plasticine), shaped by hand.* (From memory, not checked.)

- **The real thing:** matte with a faint waxy sheen. Light gets a little way into it.
- **What tells it apart:** a soft shadow line that glows slightly, only a broad dull highlight, and a surface that
  was plainly touched: lumps, dents, fingerprints.
- **How:** a matte surface with light wrapping past the shadow line and a little coming back from inside in a
  deeper tone. The surface is uneven at two scales (dents from fingers), with fingerprints in patches where a thumb
  pressed (ridges 0.011 units apart that curve round), a groove from a tool, small pits and the odd speck of lint.
  A pressed patch is a little smoother than the rest.
- **Left out:** seams smoothed over where parts were joined.

## The studio

Shiny materials need something to mirror. `studio()` in the library is a photographer's set laid out round the
mascot: a large soft key panel in front and above, a tall fill panel to the side, a strip behind for the rim, walls
that are brightest low down and darker on the camera's side, and the floor, which is the page (so it is bright on
the light theme and dark on the dark one). Each panel is as bright as the light its lamp gives a matte surface, so a
mirror and a matte surface agree about the lighting. Rough surfaces see the same set, blurred.

## Sources

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

**Named above from memory, not opened for this page:** Oren and Nayar 1994 and Fujii's variant; Walter et al. 2007
(GGX); Burley 2012 and Kulla and Conty 2017 (anisotropic GGX); Karis 2013 (the split-sum fit); Lagarde and
de Rousiers 2014 (specular occlusion); Wang and Bowles 2016 (sparkle); Zirr and Kaplanyan 2016, Chermain et al. 2020
and Deliot and Belcour 2023 (glints: read about, not implemented); Barré-Brisebois and Bouchard 2011 (translucency);
Quilez's articles on distance functions, soft shadows and ambient occlusion; Worley 1996 (cellular noise);
Khronos PBR Neutral tone mapping.
