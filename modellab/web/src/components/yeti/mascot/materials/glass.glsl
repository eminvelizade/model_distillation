// Glass: a figure of clear coloured glass, blown by hand.
//
// Glass has no colour on its surface: all of it comes from how much glass the light crossed, so thick parts are
// deep and thin parts pale (Beer and Lambert's law). It bends light strongly (index 1.5), mirrors the studio sharply
// and more toward its edges, and traps light that meets its inner surface too flatly, which sends it round again and
// makes the edges darker and richer. So a ray goes in, crosses the body, and either leaves the far side (and sees
// the lamps, or the page, tinted by the glass it crossed) or is mirrored back inside for a second crossing. Hand-blown
// glass is never optically flat: the surface wavers very slightly, which is what makes the reflections look real.
// Clear parts let the page show through.
//#header
//#body
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  float w0 = noiseAt(p + 2.0, 2.6);
  vec3 N = normalize(n + (tu * (noiseAt(p + 2.0 + tu * 0.07, 2.6) - w0) + tv * (noiseAt(p + 2.0 + tv * 0.07, 2.6) - w0)) * 0.4);
  float open = occlusion(p, n), lit = shadowKey(p, n, 5.0);
  float NoV = max(dot(N, v), 1e-3);
  float F = fresnel(NoV, 1.0, 1.5);
  vec3 mirrored = studioLight(studioAt(p, reflect(-v, N), 0.0), specOcclusion(NoV, open, 0.03), lit);

  vec3 dye = log(max(uMain, vec3(0.02))) / 1.15;        // per unit of glass: the body's colour is what 1.15 units lets through
  vec3 dir = refract(-v, N, 1.0 / 1.5);
  vec3 q, nq; vec4 hit;
  float len = through(p, dir, q, nq, hit);
  vec3 outDir = refract(dir, -nq, 1.5);
  bool trapped = dot(outDir, outDir) < 0.5 && hit.a < 0.5;
  // trapped: mirrored back inside for a second crossing (to no solid part and no further: by then little is left)
  vec3 back = reflect(dir, -nq);
  vec3 q2, nq2; vec4 hit2;
  float len2 = through(q - nq * 0.02, back, q2, nq2, hit2);
  vec3 out2 = refract(back, -nq2, 1.5);
  if (trapped) { len += len2; q = q2; outDir = dot(out2, out2) < 0.5 ? reflect(back, -nq2) : out2; }
  bool lost = trapped && dot(out2, out2) < 0.5;          // still inside after two crossings
  vec3 clear = exp(dye * len);
  Studio behind = studioAt(q, outDir, 0.0);
  vec3 inside = (behind.key + behind.fill + behind.back + (lost ? behind.room * 0.6 : vec3(0.0))) * clear;
  // The far side looks at the floor, the mascot's own shadow on it, or a wall: the page gets through less where
  // that is darker than the page, so the room shows through the glass, bent and upside down.
  vec3 page = lost ? vec3(0.0) : clear * clamp(behind.room / max(uBackdrop, vec3(0.04)), 0.0, 1.0);
  inside += clear * max(behind.room - uBackdrop, vec3(0.0)) * (lost ? 0.0 : 1.0);
  // No glass is perfectly clear: a little of the light inside it is scattered toward the eye, in the glass's own
  // colour. On a bright page it hardly shows; on a dark one it is what keeps the colour alive.
  float haze = (1.0 - exp(-len * 0.55)) * mix(0.07, 0.3, uDark);
  inside += exp(dye * mix(0.3, 0.9, uDark)) * haze * (skyIrr(n) + uKeyCol * mix(0.3, 0.8, lit) + uFillCol * 0.5);
  page *= 1.0 - haze;
  if (hit.a > 0.5) { inside = hit.rgb * clear; page = vec3(0.0); }       // the back of an eye
  return seeThrough(mirrored * F + (1.0 - F) * inside, (1.0 - F) * page);
}
