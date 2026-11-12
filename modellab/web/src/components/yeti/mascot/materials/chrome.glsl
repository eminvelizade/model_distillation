// Chrome: mirror-polished metal, tinted by the body's colour.
//
// A mirror has no look of its own: it is the studio, bent round the body. So the work is in what it mirrors (the
// lamps' panels, the bright floor under a darker room, the dark side where the camera stands) and in the mascot
// mirrored in itself, once (an ear in the head). What makes it a real object and not a perfect one is very small:
// the surface wavers by a hair (so straight edges in the reflections wobble), and there is a smudge or two where
// the mirror is a little dull. Snow is silver, sun is gold, ink is black chrome; the other colours are tinted
// chrome.
//#header
//#body
vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 tu, tv;
  frame(n, tu, tv);
  // the faintest waviness
  float w0 = noiseAt(p + 4.0, 4.5);
  vec3 N = n + (tu * (noiseAt(p + 4.0 + tu * 0.05, 4.5) - w0) + tv * (noiseAt(p + 4.0 + tv * 0.05, 4.5) - w0)) * 0.16;
  N = normalize(N);
  float smudge = smoothstep(0.55, 0.8, noiseAt(p + 8.0, 1.7));              // a fingermark: the mirror is a little dull there
  float blur = 0.0006 + 0.02 * smudge;
  float open = occlusion(p, n);
  float NoV = max(dot(N, v), 1e-3);

  float pale = max3(uMain);
  vec3 metal = mix(vec3(0.93), uMain / max(pale, 0.05), 0.62) * mix(0.42, 0.95, smoothstep(0.1, 0.6, pale));   // (a dark dye is black chrome)
  vec3 F = metal + (1.0 - metal) * pow5(1.0 - NoV);
  vec3 R = reflect(-v, N);
  float at = meets(p + n * 0.012, R, 3.0);
  vec3 seen;
  if (at > 0.0) {                          // it sees itself: mirror the studio once more there
    vec3 q = p + n * 0.012 + R * at;
    vec3 nq = bodyNormal(q);
    vec3 c; float r;
    float solidThere = solidNear(q, c, r);
    vec3 again = studioLight(studioAt(q, reflect(R, nq), blur), 1.0, 1.0) * (metal + (1.0 - metal) * pow5(1.0 - max(dot(nq, -R), 0.0)));
    seen = solidThere < 0.01 ? c * 0.6 + again * 0.04 : again;   // (an eye or the glasses mirrored: dark and glossy)
  } else seen = studioLight(studioAt(p, R, blur), 1.0, 1.0);
  return vec4(seen * F * mix(0.45, 1.0, open), 1.0);
}
