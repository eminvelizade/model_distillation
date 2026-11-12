// Sugar: a soft jelly sweet in the body's colour, rolled in coarse sugar.
//
// Two things make it: the crystals and the jelly. The crystals are small clear bricks of sucrose lying every which
// way. Here they are real relief: one brick in each cell of a jittered grid, each turned its own way, with flat
// faces and sharp edges, so they roughen the outline and each face catches the light on its own. A face that
// mirrors a lamp into the eye flashes white (sucrose reflects about 5 % head-on); where the crystals are too small
// to resolve, the library's grains take over, which fade instead of flickering. Between the crystals the jelly shows:
// deep, saturated colour that light gets into (it creeps round the shadow line, and thin parts glow when a lamp is
// behind them), with a moist gloss.
//#header
#define MAT_DISPLACE 0.03
#define MAT_STEP 0.55
//#body
// how high the nearest crystal of one scattering stands at g (in cells): 0 none .. 1 on a face. id: which crystal.
float sugarGrid(vec3 g, out float id) {
  vec3 c0 = floor(g - 0.5);
  float best = 0.0;
  id = 0.0;
  for (int z = 0; z < 2; z++) for (int y = 0; y < 2; y++) for (int x = 0; x < 2; x++) {
    vec3 c = c0 + vec3(float(x), float(y), float(z));
    vec3 hs = hash33(c);
    vec3 o = g - (c + 0.15 + 0.7 * hs);                    // from the crystal's middle
    vec3 ax = normalize(hash33(c + 17.0) - 0.5);
    vec3 q = o - 2.0 * ax * dot(ax, o);                    // its own frame (a mirror image of a brick is a brick, turned)
    vec3 b = abs(q) - (0.19 + 0.17 * hs.yzx);              // a little brick, each its own size
    float k = clamp(-max(b.x, max(b.y, b.z)) / 0.1, 0.0, 1.0);   // flat faces, sharp sides
    if (k > best) { best = k; id = hs.x; }
  }
  return best;
}
// two scatterings, of different sizes and turned against each other, so no grid shows
float sugarCrystals(vec3 p, out float id) {
  float ia, ib;
  float a = sugarGrid(p / 0.034, ia);
  float b = sugarGrid(vec3(0.8 * p.x - 0.6 * p.z, p.y, 0.6 * p.x + 0.8 * p.z).yzx / 0.027 + 7.3, ib);
  id = a > b ? ia : ib;
  return max(a, b);
}
float matDisplace(vec3 p) { float id; return MAT_DISPLACE * mix(0.35, sugarCrystals(p, id), resolved(0.016)); }

vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  float seen = resolved(0.016);
  float e = max(0.0022, 0.7 * gPix);
  float h = matDisplace(p) / MAT_DISPLACE;
  vec2 dh = vec2(matDisplace(p + tu * e) - matDisplace(p - tu * e), matDisplace(p + tv * e) - matDisplace(p - tv * e)) / (2.0 * e);
  vec3 N = normalize(n - (tu * dh.x + tv * dh.y) * 0.9);     // a crystal's face
  float id;
  sugarCrystals(p, id);
  float sugar = mix(0.4, smoothstep(0.03, 0.3, h), seen);    // how much of this pixel is crystal
  N = normalize(N + (fract(id * vec3(17.3, 29.7, 43.1)) - 0.5) * 0.8 * sugar * seen);   // each crystal lies its own way: its top face too
  float open = occlusion(p, n), lit = shadowKey(p, n, 5.0);
  float NoV = max(dot(n, v), 1e-3);

  // the jelly: light gets into it
  vec3 dye = uMain;
  vec3 jelly = pow(dye, vec3(1.35)) * 0.92;
  vec3 E = skyIrr(n) * open;
  for (int i = 0; i < 3; i++) E += lampCol(i) * clamp((dot(n, lampDir(i)) + 0.45) / 1.45, 0.0, 1.0) * (i == 0 ? mix(0.35, 1.0, lit) : mix(0.6, 1.0, open));
  float through = thickness(p - n * 0.03, uBack, 1.4);        // how much jelly lies between here and the lamp behind
  vec3 glow = uBackCol * exp(-through * vec3(3.0) / max(sqrt(dye), vec3(0.15))) * 1.5;   // (the dye's own colour gets through best)
  vec3 jel = jelly * E + sqrt(jelly) * glow;
  jel += studioLight(studioAt(p, reflect(-v, n), 0.1), specOcclusion(NoV, open, 0.3), lit) * envBRDF(vec3(0.04), 0.32, NoV) * 0.7;   // moist

  // the sugar: a crystal is clear. Some of the jelly shows through it, the rest is light scattered by its faces and
  // flaws (white); each crystal is clearer or cloudier than the next.
  float cloudy = mix(0.75, 0.45 + 0.5 * id, seen);
  vec3 Es = skyIrr(N) * open;
  for (int i = 0; i < 3; i++) Es += lampCol(i) * max(dot(N, lampDir(i)), 0.0) * (i == 0 ? lit : mix(0.6, 1.0, open));
  vec3 sug = mix(jel * 1.1, vec3(0.95) * Es, cloudy);
  float NoVf = max(dot(N, v), 1e-3);
  sug += studioLight(studioAt(p, reflect(-v, N), 0.02), open, lit) * F_Schlick1(0.048, NoVf) * seen * 2.6;   // a face mirroring the studio
  // grains that flash: fine ones, and a few bigger ones that still show when the mascot is small
  vec2 g = glints(p, n, v, 0.024, 0.75, 1.0, 0.972) + 0.7 * glints(p + 3.1, n, v, 0.075, 0.55, 1.0, 0.965);
  vec3 col = mix(jel, sug, sugar) + uKeyCol * g.x * lit * 6.0 + (uFillCol + uBackCol) * g.y * 3.0 * open;
  return vec4(col, 1.0);
}
