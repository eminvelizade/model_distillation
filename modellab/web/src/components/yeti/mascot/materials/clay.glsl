// clay: not written yet. Until it is, a plain surface in the body's colour.
//#header
//#body
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  return vec4(shade(p, n, v, surf(uMain, 0.5), occlusion(p, n), shadowKey(p, n, 5.0)), 1.0);
}
