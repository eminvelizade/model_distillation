// glass: a first sketch (a ray through the body, the dye's colour by how much glass it crossed). Not finished.
//#header
//#body
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  float F = fresnel(max(dot(n, v), 0.0), 1.0, 1.5);
  vec3 refl = studioLight(studioAt(p, reflect(-v, n), 0.0), 1.0, 1.0);
  vec3 dir = refract(-v, n, 1.0 / 1.5);
  vec3 q, nq; vec4 hit;
  float len = through(p, dir, q, nq, hit);
  vec3 T = exp(log(max(uMain, vec3(0.02))) / 1.2 * len);     // the dye's colour after 1.2 units of glass
  vec3 outDir = refract(dir, -nq, 1.5);
  vec3 behind = dot(outDir, outDir) > 0.0 ? studioLight(studioAt(q, outDir, 0.0), 1.0, 1.0) : studioLight(studioAt(q, reflect(dir, -nq), 0.0), 1.0, 1.0) * 0.6;
  vec3 inside = hit.a > 0.5 ? hit.rgb : behind;
  return vec4(refl * F + inside * T * (1.0 - F), 1.0);
}
