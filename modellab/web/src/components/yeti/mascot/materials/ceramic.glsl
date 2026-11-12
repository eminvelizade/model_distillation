// Ceramic: a figure of glazed stoneware.
//
// A glaze is a layer of coloured glass melted onto a matte clay body. You see two things at once: sharp mirror
// reflections off the glass on top, and under them the colour of the glaze, which depends on how thick it lies.
// Molten glaze runs off bulges and edges, where it ends up thin and pale ("breaking"), and gathers in hollows, where
// it is thick, dark and saturated ("pooling"). So the colour here follows how the body curves. The glass coat mirrors
// the studio with a soft falloff, over a surface that wavers very slightly. In close-up there is a fine crackle
// (crazing: the glaze shrank more than the clay), the odd iron speck and pinhole; and at the very bottom the foot is
// left bare, matte clay, where the piece stood in the kiln.
//#header
//#body
// crazing: thin cracks along the borders of irregular cells (the distance to the nearest border, in cells)
float ceramicCraze(vec3 x) {
  vec3 c0 = floor(x - 0.5);
  float d1 = 9.0, d2 = 9.0;
  for (int z = 0; z < 2; z++) for (int y = 0; y < 2; y++) for (int k = 0; k < 2; k++) {
    vec3 c = c0 + vec3(float(k), float(y), float(z));
    float d = length(x - (c + 0.15 + 0.7 * hash33(c)));
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
  }
  return d2 - d1;
}
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  float w0 = noiseAt(p + 6.0, 5.0);
  vec3 N = normalize(n + (tu * (noiseAt(p + 6.0 + tu * 0.05, 5.0) - w0) + tv * (noiseAt(p + 6.0 + tv * 0.05, 5.0) - w0)) * 0.22);   // a glaze is never quite flat
  float open = occlusion(p, n), lit = shadowKey(p, n, 5.0);
  float NoV = max(dot(N, v), 1e-3);

  // how thick the glaze lies: thin on bulges and edges, thick in hollows
  float bulge = curvature(p, 0.06);
  float thick = clamp(0.78 - 0.075 * bulge + 0.55 * (1.0 - open) + 0.25 * (noiseAt(p + 1.0, 2.0) - 0.5), 0.0, 1.0);
  vec3 dye = uMain;
  vec3 clayBody = vec3(0.86, 0.8, 0.7);                                      // pale stoneware
  vec3 deep = dye * dye * (1.0 / max(lum(dye), 0.06)) * 0.7;
  vec3 glaze = mix(mix(clayBody, dye, 0.6), mix(dye, deep, 0.8), smoothstep(0.25, 0.95, thick));
  // close up: crazing, iron specks, a pinhole here and there
  float seen = resolved(0.012);
  float craze = smoothstep(0.035, 0.0, ceramicCraze(p * 14.0 + 0.5 * noiseAt(p, 9.0))) * seen;
  float speck = smoothstep(0.9, 0.95, noiseAt(p + 3.0, 120.0)) * resolved(0.012);
  glaze = mix(glaze, glaze * 0.6, 0.45 * craze);
  glaze = mix(glaze, vec3(0.2, 0.12, 0.07), 0.6 * speck);

  Surf s = surf(glaze, 0.85);          // the glaze's colour, seen through the glass: matte
  s.coat = 1.0; s.coatRough = 0.035;   // the glass on top
  s.f0 = 0.0;
  // the foot: bare clay, matte
  float foot = 1.0 - smoothstep(0.05, 0.085, p.y + 0.012 * (noiseAt(p, 14.0) - 0.5));
  s.base = mix(s.base, clayBody * (0.9 + 0.2 * noiseAt(p, 60.0)), foot);
  s.coat *= 1.0 - foot;
  return vec4(shade(p, N, v, s, open, lit), 1.0);
}
