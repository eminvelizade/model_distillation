// Elastane: the stretch fabric of swimwear and athletic wear.
//
// It is knitted very finely from smooth synthetic filaments and pulled taut, so it has no fuzz and no visible
// weave: what you see is deep, saturated colour with a satin lustre. Smooth fibres lying side by side mirror a lamp
// into a streak that runs across them (as brushed metal does), so the highlights are long soft bands that wrap round
// the body, and the cloth brightens toward its edges. That is an anisotropic GGX lobe laid along the fibres (which
// run up the body), part of it tinted by the dye, over a dark, rich matte base, with a tight sheen toward grazing
// angles. In close-up there is a very fine rib, and the lustre is a little uneven where the cloth is stretched more.
//#header
//#body
const float ELASTANE_RIB = 0.009;   // one rib of the knit

vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 across = around(p, n), along = cross(n, across);            // the fibres run up the body
  float ribSeen = resolved(ELASTANE_RIB * 0.7) * smoothstep(0.1, 0.3, length(p.xz)) * smoothstep(0.12, 0.45, dot(n, v));
  float u = atan(p.x, p.z) * 0.9 / ELASTANE_RIB + 0.3 * sin(p.y * 9.0);
  float rib = cos(6.2832 * u);
  vec3 N = normalize(n + across * rib * 0.07 * ribSeen);
  float open = occlusion(p, n), lit = shadowKey(p, n, 5.0);
  float NoV = max(dot(N, v), 1e-3);

  // stretched more in places: there the cloth is thinner, a touch paler and glossier
  float stretch = noiseAt(p + 3.0, 2.2);
  vec3 dye = uMain;
  vec3 alb = pow(dye, vec3(1.18)) * mix(0.7, 0.82, stretch) * mix(1.0, 0.9 + 0.1 * rib, ribSeen);   // deep and saturated
  vec3 tint = mix(vec3(1.0), dye / max(max3(dye), 0.05), 0.5);                                      // the lustre takes some of the dye's colour
  float aAlong = mix(0.15, 0.11, stretch), aAcross = 0.5;          // smooth along a fibre, rough across them
  float pole = smoothstep(0.05, 0.32, length(p.xz));               // (at the very top the fibres' direction has no meaning: no streak there)
  aAlong = mix(0.36, aAlong, pole); aAcross = mix(0.36, aAcross, pole);

  vec3 col = alb * skyIrr(N) * open;
  // the sky and the walls, mirrored softly; more toward the edges
  col += tint * envBRDF(vec3(0.05), 0.45, NoV) * studioAt(p, normalize(mix(N, reflect(-v, N), 0.6)), 0.25).room * specOcclusion(NoV, open, 0.45) * 0.8;
  for (int i = 0; i < 3; i++) {
    vec3 l = lampDir(i);
    float nl = max(dot(N, l), 0.0), sh = i == 0 ? lit : mix(0.6, 1.0, open);
    vec3 hv = normalize(l + v);
    float D = D_GGXaniso(max(dot(N, hv), 0.0), dot(along, hv), dot(across, hv), aAlong, aAcross);
    float V = V_GGXaniso(NoV, nl, dot(along, v), dot(across, v), dot(along, l), dot(across, l), aAlong, aAcross);
    float F = F_Schlick1(0.05, max(dot(v, hv), 0.0));
    col += lampCol(i) * sh * nl * (alb * (1.0 - F) + tint * min(D * V, 8.0) * F * PI * 3.4);
  }
  // a tight sheen toward grazing angles (filaments seen edge-on)
  col += tint * 0.26 * pow5(1.0 - NoV) * (skyIrr(N) * open + uBackCol * max(dot(N, uBack), 0.0) * open + uKeyCol * max(dot(N, uKey), 0.0) * lit * 0.5);
  return vec4(col, 1.0);
}
