// chrome: a first sketch (the studio mirrored, and the mascot mirrored in itself once). Not finished.
//#header
//#body
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 base = mix(vec3(0.92), uMain, 0.55);
  vec3 R = reflect(-v, n);
  float open = occlusion(p, n);
  vec3 F = F_Schlick(base, max(dot(n, v), 0.0));
  float at = meets(p + n * 0.01, R, 3.0);
  vec3 seen;
  if (at > 0.0) {                       // it sees itself: one more mirror there
    vec3 q = p + n * 0.01 + R * at;
    vec3 nq = bodyNormal(q);
    seen = studioLight(studioAt(q, reflect(R, nq), 0.0), 1.0, 1.0) * F_Schlick(base, max(dot(nq, -R), 0.0));
  } else seen = studioLight(studioAt(p, R, 0.0), 1.0, 1.0);
  return vec4(seen * F * mix(0.5, 1.0, open), 1.0);
}
