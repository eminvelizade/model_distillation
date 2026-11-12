// Cotton: a smooth knitted cotton, as on a well-made soft toy.
//
// What tells cotton from the other materials is mostly what it lacks: no highlight at all (the brightest part of
// the body is still the dye's colour), an even, flat tone across the lit side, a crisp outline, and shade that gets
// deeper in colour, not greyer. So its light is a rough matte lobe that keeps its brightness out to the edge
// (Oren & Nayar's, in Fujii's form) under a weak, pale haze of fuzz (Estevez & Kulla's "Charlie" sheen), and
// nothing mirrored. Close up it is a jersey knit: columns of small V-shaped stitches that wander a little, with
// thick and thin places in the yarn, a seam where two panels meet, and an uneven dye. The knit fades to its average
// tone as it gets smaller than a pixel, so small views are clean.
//#header
//#body
const float COTTON_WALE = 0.014;    // the width of one column of stitches (twice life size: it shows a little sooner)
const float COTTON_ROW = 0.0115;    // the height of one stitch

// the knit's height at (round the body, up it), 0 in the grooves .. 1 on the yarn. fine: how well a single stitch is
// resolved (0: only the columns show, the stitches are their average)
float cottonKnit(vec2 uv, float fine) {
  float col = uv.x / COTTON_WALE + 0.22 * sin(uv.y * 7.0 + 2.0 * sin(uv.x * 3.1)) + 0.08 * sin(uv.y * 41.0);   // columns wander and lean
  float id = floor(col), x = fract(col) - 0.5;
  float thick = 0.5 + 0.5 * sin(id * 12.9898 + uv.y * (19.0 + 7.0 * sin(id * 4.1)));                           // thick and thin places in the yarn
  float stitch = 0.5 + 0.5 * cos(6.2832 * (uv.y / COTTON_ROW - abs(x) * 1.7 + 0.37 * id));                     // two legs of yarn meeting in a V; each column starts where it likes
  return smoothstep(0.5, mix(0.3, 0.2, thick), abs(x)) * mix(0.75, 0.45 + 0.55 * stitch, fine);
}
// one lamp on rough matte cloth (Oren & Nayar, as Fujii wrote it): it stays bright toward the edge, where a smooth
// matte surface would fall away
float cottonMatte(vec3 n, vec3 l, vec3 v, float nl) {
  const float sigma = 0.75;
  float s = dot(l, v) - nl * dot(n, v);
  float tt = s > 0.0 ? max(nl, max(dot(n, v), 1e-3)) : 1.0;
  float a = 1.0 / (PI + (PI * 0.5 - 2.0 / 3.0) * sigma);
  return PI * a * (1.0 + sigma * s / tt);
}
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu = around(p, n), tv = cross(n, tu);
  // where on the cloth: round the body and up it. (The join in "round" is at the back, under a seam.)
  vec2 uv = vec2(atan(p.x, p.z) * 0.9, p.y);
  // (the columns pinch together at the very top, and crowd toward the outline: none there)
  float knitSeen = resolved(COTTON_WALE * 0.8) * smoothstep(0.1, 0.3, length(p.xz)) * smoothstep(0.12, 0.45, dot(n, v));
  float fine = resolved(COTTON_ROW * 0.45);
  float e = max(0.0025, gPix);
  float h = cottonKnit(uv, fine);
  vec2 dh = vec2(cottonKnit(uv + vec2(e, 0.0), fine) - h, cottonKnit(uv + vec2(0.0, e), fine) - h) / e;
  // the seam where the front and back panels meet (it shows when the mascot turns), puckered by its stitches
  float sd = abs(p.z + 0.06);
  float pucker = 0.6 + 0.4 * sin(p.y * 232.0 + 4.0 * sin(p.x * 9.0));
  float seam = exp(-sd * sd / (0.012 * 0.012)) * pucker * resolved(0.03);
  float dseam = -2.0 * (p.z + 0.06) / (0.012 * 0.012) * seam;
  // lumps of stuffing: nothing sewn is perfectly round
  float lump = noiseAt(p + 7.0, 2.6) - 0.5;
  vec3 N = normalize(n - (tu * dh.x + tv * dh.y) * 0.0024 * knitSeen + vec3(0.0, 0.0, 1.0) * dseam * 0.006
                       - (tu * (noiseAt(p + 7.0 + tu * 0.05, 2.6) - 0.5 - lump) + tv * (noiseAt(p + 7.0 + tv * 0.05, 2.6) - 0.5 - lump)) * 1.1);
  float open = occlusion(p, n), lit = shadowKey(p, n, 4.0);

  // the dye: a little uneven, deeper in the knit's grooves and along the seam, paler where the yarn is thick
  vec3 dye = uMain * 0.93;                                             // (white cotton is never paper white)
  float uneven = 1.0 + 0.05 * (noiseAt(p, 5.0) - 0.5) + 0.07 * (noiseAt(p * vec3(1.0, 0.25, 1.0), 60.0) - 0.5) * resolved(0.03);
  float groove = mix(1.0, 0.62 + 0.38 * h, knitSeen);
  vec3 deep = dye * dye * (1.0 / max(lum(dye), 0.05)) * 0.9;           // the same hue, more of it: what light bouncing between dyed threads becomes
  vec3 alb = mix(deep, dye, groove * (1.0 - 0.5 * seam)) * uneven;
  alb = mix(deep * 0.8, alb, mix(0.55, 1.0, open));                     // creases gather colour

  vec3 col = alb * skyIrr(N) * open;
  vec3 fuzz = mix(dye, vec3(1.0), 0.55) * 0.3;                         // a pale haze of stray fibres
  float NoV = max(dot(N, v), 1e-3);
  col += fuzz * sheenIBL(NoV, 0.7) * skyIrr(N) * open;
  for (int i = 0; i < 3; i++) {
    vec3 l = lampDir(i);
    float nl = max(dot(N, l), 0.0), sh = i == 0 ? lit : mix(0.6, 1.0, open);
    col += lampCol(i) * sh * nl * (alb * cottonMatte(N, l, v, nl)
         + fuzz * D_Charlie(0.7, max(dot(N, normalize(l + v)), 0.0)) * V_Neubelt(NoV, nl) * PI);
  }
  return vec4(col, 1.0);
}
