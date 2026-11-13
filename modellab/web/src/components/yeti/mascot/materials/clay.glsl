// Clay: modelling clay (plasticine), shaped by hand.
//
// Plasticine is smooth and a little waxy: light gets a short way into it, so shade is soft and the shadow line
// glows slightly, and it has a broad satin highlight. What makes it look hand-made is the surface. Nothing a hand
// shapes is even: the body stands in and out by a couple of millimetres in broad lumps and thumb dents, and that is
// real relief here, so it is in the outline and catches the
// side light. Over it lie fingerprints (fine ridges that arc and waver, in patches where a thumb pressed, one over
// another as on anything handled), which fade to nothing as they get smaller than a pixel.
//#header
#define MAT_DISPLACE 0.028
//#body
// a patch of fingerprint: ridges that arc across the patch; press: how strongly it was pressed. scale: patches
// per unit.
float clayPrint(vec3 p, float scale, out float press) {
  vec3 x = p * scale, c = floor(x), f = fract(x) - 0.5;
  vec3 hs = hash33(c + scale);
  vec3 o = f - (hs - 0.5) * 0.5;                           // from the middle of this press
  press = smoothstep(0.55, 0.2, length(o)) * step(0.3, hs.z);   // (not every patch was pressed)
  vec3 k = normalize(hash33(c + 31.0) - 0.5) * (0.25 + 0.6 * hs.y);   // the middle of its loops: mostly off the patch,
  float r = length(o + k);                                       // so the ridges cross it as arcs, as on a thumb
  r += 0.03 * (noiseAt(p + 40.0, 11.0) - 0.5) * scale;           // no ridge is a perfect arc
  return sin(r / scale * 523.6 + 6.0 * hs.x);              // ridges 0.012 apart (about three times life size)
}
// how far the clay stands out at p (0 .. 1): broad lumps and thumb dents
float clayLumps(vec3 p) { return 0.58 * snoise(p * 3.2 + 12.0, 0.0) + 0.42 * snoise(p * 7.5 + 2.0, 0.0); }
float matDisplace(vec3 p) { return MAT_DISPLACE * clayLumps(p); }
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  // the relief's own slope (drawn a little steeper than it is, as side light does to a matte surface)
  float eh = 0.03, h0 = matDisplace(p);
  vec3 N = n - (tu * (matDisplace(p + tu * eh) - h0) + tv * (matDisplace(p + tv * eh) - h0)) / eh * 1.5;
  // fingerprints: two sets of patches, and a later press wipes out most of the one under it
  float seen = resolvedOn(0.012 * 0.3, dot(n, v));
  float press = 0.0;
  if (seen > 0.01) {
    float pa, pb, un;
    float e = max(0.0015, 0.6 * gPix);
    vec3 q = p + 0.37;
    float r0 = clayPrint(p, 2.6, pa), r1 = clayPrint(q, 3.7, pb);
    vec2 da = vec2(clayPrint(p + tu * e, 2.6, un) - r0, clayPrint(p + tv * e, 2.6, un) - r0);
    vec2 db = vec2(clayPrint(q + tu * e, 3.7, un) - r1, clayPrint(q + tv * e, 3.7, un) - r1);
    vec2 d = da * pa * (1.0 - 0.75 * pb) + db * pb;
    N -= (tu * d.x + tv * d.y) / e * 0.0006 * seen;
    press = max(pa, pb);
  }
  N = normalize(N);
  float open = occlusion(p, n), lit = shadowKey(p, n, 2.5);

  vec3 dye = uMain * 0.9;
  vec3 alb = dye * (1.0 + 0.05 * (noiseAt(p, 3.0) - 0.5));
  Surf s = surf(alb, mix(0.44, 0.34, press * 0.6));         // satin; a pressed patch is a little smoother
  s.wrap = 0.15;                                            // light gets in: the shadow line is soft
  s.f0 = 0.04;
  vec3 col = shade(p, N, v, s, open, lit);
  // and comes back a little from inside: a waxy glow at the shadow line, in a deeper tone of the colour
  float edge = clamp(1.0 - abs(dot(n, uKey)) * 2.2, 0.0, 1.0);
  col += dye * dye * 0.1 * edge * uKeyCol * mix(0.4, 1.0, lit);
  return vec4(col, 1.0);
}
