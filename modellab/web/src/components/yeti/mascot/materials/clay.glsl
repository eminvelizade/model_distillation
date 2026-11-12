// Clay: modelling clay (plasticine), shaped by hand.
//
// Plasticine is matte with a faint waxy sheen: light gets a little way into it, so shade is soft and the shadow
// line glows slightly, and there is only a broad, dull highlight. What makes it look hand-made is the surface:
// fingerprints (fine parallel ridges that curve round, in patches where a thumb pressed), shallow dents from
// fingers, a few straight grooves from a tool, small pits, and the odd pale speck of lint. All of that is in the
// normal and the tone here; the body's outline stays as the shape gives it. The prints fade to nothing as they get
// smaller than a pixel.
//#header
//#body
// a patch of fingerprint at x (in patches): ridges that curve round the patch's middle; how strongly it pressed
float clayPrint(vec3 p, out float press) {
  vec3 x = p * 2.6, c = floor(x), f = fract(x) - 0.5;
  vec3 hs = hash33(c);
  vec3 o = f - (hs - 0.5) * 0.5;                           // from the middle of this press
  press = smoothstep(0.5, 0.15, length(o)) * step(0.35, hs.z);   // (not every patch was pressed)
  vec3 ax = normalize(hs - 0.5);
  float r = length(o - ax * dot(o, ax)) + 0.35 * dot(o, ax);     // loops round an axis, drifting: a whorl
  return sin(r * 2.6 / 0.011 * 0.3846 + 6.0 * hs.x);       // ridges 0.011 apart
}
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  // dents from fingers, and the unevenness of anything pressed into shape
  float d0 = noiseAt(p + 12.0, 3.2) + 0.5 * noiseAt(p + 2.0, 7.5);
  vec3 N = n - (tu * (noiseAt(p + 12.0 + tu * 0.05, 3.2) + 0.5 * noiseAt(p + 2.0 + tu * 0.05, 7.5) - d0)
              + tv * (noiseAt(p + 12.0 + tv * 0.05, 3.2) + 0.5 * noiseAt(p + 2.0 + tv * 0.05, 7.5) - d0)) * 0.95;
  // fingerprints
  float seen = resolved(0.011 * 0.6);
  float press, pa, pb;
  float e = max(0.002, 0.6 * gPix);
  float r0 = clayPrint(p, press);
  N -= (tu * (clayPrint(p + tu * e, pa) - r0) + tv * (clayPrint(p + tv * e, pb) - r0)) / e * 0.0011 * press * seen;
  // a couple of grooves from a modelling tool, and pits
  float groove = exp(-sq((dot(p, normalize(vec3(-0.6, 0.7, 0.4))) - 0.2 + 0.02 * sin(p.x * 9.0)) / 0.014)) * smoothstep(0.2, 0.6, noiseAt(p + 30.0, 1.5));
  float pit = smoothstep(0.88, 0.94, noiseAt(p + 5.0, 30.0)) * resolved(0.025);
  N = normalize(N);
  float open = occlusion(p, n), lit = shadowKey(p, n, 4.0);

  vec3 dye = uMain * 0.9;
  vec3 alb = dye * (1.0 + 0.05 * (noiseAt(p, 3.0) - 0.5)) * (1.0 - 0.18 * min(groove, 1.0) * resolved(0.02)) * (1.0 - 0.3 * pit);
  alb = mix(alb, mix(alb, vec3(0.9), 0.5), smoothstep(0.93, 0.97, noiseAt(p + 20.0, 60.0)) * resolved(0.014) * 0.6);   // the odd speck of lint
  Surf s = surf(alb, mix(0.62, 0.5, press * 0.6));          // a pressed patch is a little smoother
  s.wrap = 0.3;                                             // light gets in: the shadow line is soft
  s.f0 = 0.035;
  vec3 col = shade(p, N, v, s, open, lit);
  // and comes back a little from inside: a waxy glow at the shadow line, in a deeper tone of the colour
  float edge = clamp(1.0 - abs(dot(n, uKey)) * 2.2, 0.0, 1.0);
  col += dye * dye * 0.1 * edge * uKeyCol * mix(0.4, 1.0, lit);
  return vec4(col, 1.0);
}
