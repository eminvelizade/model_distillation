// Boucle: curly, messy looped cloth (teddy fabric).
//
// Real boucle is knitted from a yarn that was overfed as it was spun, so it buckles into loops and curls 2 to 5 mm
// across that stand off the cloth every which way. What you see is a tangle of fuzzy strands with deep, saturated
// shade between them and a nubby outline. Here the strands are real relief. Where a wavy surface in space (a warped
// gyroid) cuts the body, the cut is a curve that wanders and closes on itself like a loop of yarn; two such sets at
// different scales, one over the other, make the tangle. Each strand is a rounded ridge along its curve, so the
// strands are in the outline and shade one another. They are lit as matte, fuzzy yarn (Oren & Nayar, with a
// "Charlie" sheen), darker and deeper in colour down between them. Smaller than a pixel, the tangle becomes an even
// nap of its average height and tone.
//#header
#define MAT_DISPLACE 0.036
#define MAT_STEP 0.6
//#body
// how high the yarn stands at p: 0 between strands .. 1 on top of one
float boucleYarn(vec3 p) {
  // the upper strands: loops about 0.1 across
  vec3 q = p * 30.0 + 1.9 * sin(p.zxy * 11.0 + vec3(0.0, 2.1, 4.2));
  float a = abs(dot(sin(q), cos(q.yzx))) / 39.0;                 // about how far the nearest curve is, along the surface
  // the lower ones: tighter curls, turned another way
  vec3 r = (p.yzx + p.zxy * 0.6) * 41.0 + 1.6 * sin(p * 15.0 + vec3(3.3, 1.2, 5.0));
  float b = abs(dot(sin(r), cos(r.zxy))) / 54.0;
  // and under both, small tight curls that fill the gaps (there is always more yarn underneath)
  vec3 u = (p.zxy - p.yzx * 0.5) * 68.0 + 1.3 * sin(p.yzx * 23.0 + vec3(1.1, 4.0, 2.3));
  float c = abs(dot(sin(u), cos(u.yzx))) / 88.0;
  float ha = sqrt(clamp(1.0 - a * a / (0.019 * 0.019), 0.0, 1.0));     // a strand is round: half a circle across
  float hb = sqrt(clamp(1.0 - b * b / (0.016 * 0.016), 0.0, 1.0));
  float hc = sqrt(clamp(1.0 - c * c / (0.011 * 0.011), 0.0, 1.0));
  return max(max(ha, 0.74 * hb), 0.2 + 0.32 * hc);
}
float matDisplace(vec3 p) {
  float clump = 0.8 + 0.4 * snoise(p * 5.0 + 3.0, 0.0);          // it stands taller in places
  return MAT_DISPLACE * mix(0.5, boucleYarn(p) * clump, resolved(0.02));
}
float boucleMatte(vec3 n, vec3 l, vec3 v, float nl) {             // rough matte yarn (Oren & Nayar, as Fujii wrote it)
  const float sigma = 0.9;
  float s = dot(l, v) - nl * dot(n, v);
  float tt = s > 0.0 ? max(nl, max(dot(n, v), 1e-3)) : 1.0;
  return PI * (1.0 + sigma * s / tt) / (PI + (PI * 0.5 - 2.0 / 3.0) * sigma);
}
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  float seen = resolved(0.02);
  float e = max(0.003, 0.8 * gPix);
  float h = matDisplace(p) / MAT_DISPLACE;                         // 0 down between the strands .. 1 on top
  vec2 dh = vec2(matDisplace(p + tu * e) - matDisplace(p - tu * e), matDisplace(p + tv * e) - matDisplace(p - tv * e)) / (2.0 * e);
  // the yarn's own fuzz: fine fibres wrapped round it, a little unruly
  float fibre = noiseAt(p, 150.0) - 0.5;
  // A strand of yarn is soft and full of air: light gets round it, so it is shaded by a gentler slope than its
  // true one, roughened by the fibres wrapped round it. Its haze of loose fibres glows by the body's slope, not the
  // strand's (a halo over the whole tangle, not a rim on every strand).
  vec3 N = normalize(n - (tu * dh.x + tv * dh.y) * 0.5 + (tu * fibre + tv * (noiseAt(p + 9.0, 150.0) - 0.5)) * 0.5 * seen);
  float open = occlusion(p, n), lit = shadowKey(p, n, 4.0);
  float deepIn = mix(1.0, smoothstep(0.0, 0.75, h), seen);         // how far up out of the tangle this point is (1: on top)

  vec3 dye = uMain * 0.94;
  vec3 deep = dye * dye * (1.0 / max(lum(dye), 0.05)) * 0.8;       // the same hue, more of it: light that bounced between strands
  vec3 alb = mix(deep, dye, mix(0.35, 1.0, deepIn)) * (1.0 + 0.1 * fibre * seen) * (1.0 + 0.06 * (noiseAt(p, 4.0) - 0.5));
  float gap = mix(0.5, 1.0, deepIn) * mix(0.6, 1.0, open);         // the strands above keep the sky and the lamps off what is below
  vec3 fuzz = mix(dye, vec3(1.0), 0.45) * 0.42;
  float NoV = max(dot(n, v), 1e-3);
  vec3 col = (alb * skyIrr(N) + fuzz * sheenIBL(NoV, 0.6) * skyIrr(n)) * gap * open;
  for (int i = 0; i < 3; i++) {
    vec3 l = lampDir(i);
    float nl = clamp((dot(N, l) + 0.25) / 1.25, 0.0, 1.0), nls = max(dot(n, l), 0.0), sh = (i == 0 ? lit : mix(0.6, 1.0, open)) * gap;
    col += lampCol(i) * sh * (alb * nl * boucleMatte(N, l, v, nl) + fuzz * nls * D_Charlie(0.6, max(dot(n, normalize(l + v)), 0.0)) * V_Neubelt(NoV, nls) * PI);
  }
  return vec4(col, 1.0);
}
