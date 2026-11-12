// Elastane: the stretch fabric of swimwear and athletic wear.
//
// It is knitted very finely from smooth synthetic filaments and pulled taut, so it has no fuzz and no visible
// weave: what you see is deep, saturated colour with a satin lustre. Smooth fibres lying side by side mirror a lamp
// into a streak that runs across them (as brushed metal does), so the highlights are long soft bands that wrap round
// the body, and the cloth brightens toward its edges. That is an anisotropic GGX lobe laid along the fibres (which
// run up the body), part of it tinted by the dye, over a dark, rich matte base, with a tight sheen toward grazing
// angles. In close-up there is a very fine knit (columns of small loops), and the lustre is a little uneven where
// the cloth is stretched more. The cloth is four panels sewn up the body with flat seams, as sportswear is: thread
// wrapped slantwise between two rows of needle holes, and the cloth puckers a little beside each seam.
//#header
//#body
const float ELASTANE_RIB = 0.009;    // one column of the knit
const float ELASTANE_SEAM = 0.013;   // half the width of a seam

vec4 matShade(vec3 p, vec3 n, vec3 v, float t) {
  vec3 across = around(p, n), along = cross(n, across);            // the fibres run up the body
  float ribSeen = resolvedOn(ELASTANE_RIB * 0.4, dot(n, v)) * smoothstep(0.1, 0.3, length(p.xz));
  float u = atan(p.x, p.z) * 0.9 / ELASTANE_RIB + 0.3 * sin(p.y * 9.0) + 0.5 * (noiseAt(p + 14.0, 11.0) - 0.5);   // (never ruler-straight)
  float loop = cos(6.2832 * (p.y / (ELASTANE_RIB * 0.8) + 0.5 * floor(u + 0.5)));   // each column is small loops, half a loop off from the next
  float rib = cos(6.2832 * u) * (0.72 + 0.28 * loop);
  // the seams: four planes through the body's axis, a quarter turn apart, none down the middle of the face
  float sd = (abs(p.x) - abs(p.z)) * 0.7071;                       // how far the nearest seam is
  float seamSeen = resolved(0.006) * smoothstep(0.08, 0.26, length(p.xz));
  vec3 sg = vec3(sign(p.x), 0.0, -sign(p.z)) * 0.7071;
  vec3 st = normalize(sg - n * dot(sg, n) + 1e-4);                 // across the seam, along the surface
  float band = (1.0 - smoothstep(ELASTANE_SEAM * 0.8, ELASTANE_SEAM, abs(sd))) * seamSeen;
  float thread = sin((p.y + sd * 1.3) * 6.2832 / 0.0075);          // the thread, wrapped slantwise
  float holes = exp(-sq((abs(sd) - ELASTANE_SEAM) / 0.0035)) * seamSeen;   // the two rows of needle holes
  float pucker = sin(p.y * 6.2832 / 0.034 + 4.0 * noiseAt(p + 21.0, 5.0)) * exp(-max(abs(sd) - ELASTANE_SEAM, 0.0) / 0.04) * (1.0 - band) * seamSeen;
  vec3 N = normalize(n + across * rib * 0.07 * ribSeen * (1.0 - band)
                       + st * sign(sd) * holes * 0.5                // the seam stands a little proud of the cloth
                       + along * (thread * 0.3 * band + pucker * 0.1));
  float open = occlusion(p, n), lit = shadowKey(p, n, 5.0);
  float NoV = max(dot(N, v), 1e-3);

  // stretched more in places: there the cloth is thinner, a touch paler and glossier
  float stretch = noiseAt(p + 3.0, 2.2);
  vec3 dye = uMain;
  vec3 alb = pow(dye, vec3(1.18)) * mix(0.72, 0.8, stretch) * mix(1.0, 0.9 + 0.1 * rib, ribSeen);   // deep and saturated
  vec3 threadCol = mix(alb, vec3(lum(alb)), 0.25) * 1.3;           // matching thread: a little paler and duller than the cloth
  alb = mix(alb, threadCol * (0.8 + 0.2 * thread), band) * (1.0 - 0.4 * holes);
  vec3 tint = mix(vec3(1.0), dye / max(max3(dye), 0.05), 0.5);                                      // the lustre takes some of the dye's colour
  float aAlong = mix(0.13, 0.11, stretch), aAcross = 0.44;         // smooth along a fibre, rough across them
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
    col += lampCol(i) * sh * nl * (alb * (1.0 - F) + tint * min(D * V, 8.0) * F * PI * 3.4 * (1.0 - 0.75 * band));   // (thread is matte)
  }
  // a tight sheen toward grazing angles (filaments seen edge-on)
  col += tint * 0.26 * pow5(1.0 - NoV) * (skyIrr(N) * open + uBackCol * max(dot(N, uBack), 0.0) * open + uKeyCol * max(dot(N, uKey), 0.0) * lit * 0.5);
  return vec4(col, 1.0);
}
