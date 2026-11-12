// Ice: a figure carved from real ice.
//
// Ice is clear, nearly colourless and bends light less than glass does (index 1.31), so it mirrors little head-on and
// a lot at its edges. What makes it ice and not glass is what is inside and on it: a milky core where air came out of
// the water as it froze, bubbles in that core, a few curved cracks that catch the light, a surface rippled by melting
// and wet with it, and patches of white frost where it is dry. So a ray goes in (bent at the rippled surface), and
// on its way through the body it gathers the core's milk, the bubbles and the cracks; what is left of it comes out
// the far side and sees the lamps or the page. The body's colour is only a tint in the thick parts: ice has no dye.
// Thin clear parts let the page show through.
//#header
//#body
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  // the surface: slow ripples where it has melted
  float w0 = noiseAt(p + 11.0, 6.0);
  vec3 N = normalize(n + (tu * (noiseAt(p + 11.0 + tu * 0.04, 6.0) - w0) + tv * (noiseAt(p + 11.0 + tv * 0.04, 6.0) - w0)) * 1.3);
  float open = occlusion(p, n), lit = shadowKey(p, n, 5.0);
  float NoV = max(dot(N, v), 1e-3);
  float F = fresnel(NoV, 1.0, 1.31);
  vec3 mirrored = studioLight(studioAt(p, reflect(-v, N), 0.0), specOcclusion(NoV, open, 0.05), lit);

  // through the ice
  vec3 dir = refract(-v, N, 1.0 / 1.31);
  vec3 q, nq; vec4 hit;
  float len = through(p, dir, q, nq, hit);
  float milk = 0.0, crack = 0.0;
  for (int i = 0; i < 6; i++) {
    vec3 s = p + dir * len * (float(i) + 0.5) / 6.0;
    float depth = -bodySmooth(s);                                           // how deep inside the body this is
    float air = snoise(s * 24.0 + 4.0, 0.0);                                // bubbles gather in the core
    milk += smoothstep(0.24, 0.6, depth) * (0.35 + 1.0 * smoothstep(0.6, 0.78, air));
    crack += smoothstep(0.007, 0.0, abs(snoise(s * 1.0 + 9.0, 0.0) - 0.46)) * smoothstep(0.04, 0.16, depth);   // a crack is a curved sheet
  }
  milk = 1.0 - exp(-milk * len * 0.3);                                      // how much of the view the core's milk hides
  vec3 tint = mix(vec3(0.74, 0.9, 1.0), uMain, 0.42);                       // ice's own blue-green, and a blush of the body's colour
  vec3 clear = exp(log(max(tint, vec3(0.03))) * len * 1.15);                // what gets through that much ice
  vec3 outDir = refract(dir, -nq, 1.31);
  bool trapped = dot(outDir, outDir) < 0.5;                                 // (it can't get out here: it is mirrored back inside)
  Studio behind = studioAt(q, trapped ? reflect(dir, -nq) : outDir, 0.03);
  vec3 lamps = behind.key + behind.fill + behind.back + (trapped ? behind.room : vec3(0.0));
  // the core scatters whatever light there is, through the tinted ice round it
  vec3 milkLit = mix(vec3(0.9, 0.96, 1.0), tint, 0.55) * (skyIrr(n) * 1.3 + uKeyCol * mix(0.3, 0.75, lit) + uBackCol * 0.45);
  vec3 inside = lamps * clear * (trapped ? 0.7 : 1.0) * (1.0 - milk) + milkLit * milk + uKeyCol * min(crack, 1.0) * 0.7 * (1.0 - 0.5 * milk);
  // how much of the page behind gets through: less where the far side looks at the mascot's own shadow or a wall
  vec3 page = trapped ? vec3(0.0) : clear * (1.0 - milk) * clamp(behind.room / max(uBackdrop, vec3(0.04)), 0.0, 1.0);
  if (hit.a > 0.5) { inside = hit.rgb * clear * (1.0 - milk) + milkLit * milk; page = vec3(0.0); }   // the back of an eye

  // frost: dry patches, white and rough, that sparkle
  float frost = smoothstep(0.5, 0.72, noiseAt(p + 5.0, 2.2) + 0.22 * noiseAt(p, 17.0)) * 0.8;
  vec3 frostLit = vec3(0.93, 0.97, 1.0) * (skyIrr(N) * open + uKeyCol * max(dot(N, uKey), 0.0) * lit + uFillCol * max(dot(N, uFill), 0.0) + uBackCol * max(dot(N, uBack), 0.0) * open);
  vec2 g = glints(p, n, v, 0.03, 0.6, 0.9, 0.975);
  frostLit += uKeyCol * g.x * lit * 5.0 + (uFillCol + uBackCol) * g.y * 2.5;

  F = max(F, 0.045);                                                        // (a film of melt water: it mirrors a little more head-on)
  vec3 shown = mirrored * F + (1.0 - F) * mix(inside, frostLit, frost);
  return seeThrough(shown, (1.0 - F) * page * (1.0 - frost));
}
