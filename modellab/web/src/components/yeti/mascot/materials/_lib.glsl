// The material library: what every surface material can use. (Read this before writing a material.)
//
// A material is one file in this folder. It is pasted into the fragment shader after this library and defines
//
//     vec4 matShade(vec3 p, vec3 n, vec3 v, float t)
//
//   p   the point of the body the eye's ray met, in the mascot's space: the floor is y = 0, the front faces +z, the
//       body is about 2 units tall and stays put while the mascot moves (so a pattern in p sticks to it)
//   n   the SMOOTH body's outward normal there (unit); add your own relief to it
//   v   the direction toward the eye (unit)
//   t   how far away the eye is (gPix, the size of a pixel at p, is already set)
//   returns  rgb: the light going to the eye (linear, before exposure and the tone curve)
//            a:   how much of the page behind it hides (1: opaque)
//
// A file may start with a header: lines between "//#header" and "//#body" are placed before everything else, for
// defines that change the framework:
//     #define MAT_DISPLACE 0.05   the material has real relief: the body's surface stands matDisplace(p) (0 .. this
//                                 much) above its smooth shape, in silhouette, shadows and all. Then also define
//                                 float matDisplace(vec3 p). It runs at every step of every ray near the body: keep
//                                 it cheap, and fade it to its average where it is smaller than a pixel (resolved()).
//     #define MAT_STEP 0.6        take smaller steps toward the body (for relief with steep sides, which a full
//                                 step could jump through). 0.9 if not said.
//
// Units of light. Lamps are directions with a colour: a matte white surface facing the key lamp sends back uKeyCol
// (about 1). So a diffuse surface is  albedo * sum(lampCol * max(dot(n, lampDir), 0)), and a lobe f (in 1/sr) goes in as
// f * PI. Mirror-like things don't use the lamps as points at all: they reflect the studio (studioAt), where each
// lamp is a soft-edged panel of the right brightness for the light it gives.
//
// GLSL ES 3.00 reserves many ordinary words: don't name anything half, sample, input, output, filter, common, flat,
// smooth, active, fixed, packed, patch, union, long, short, double, class, public, static, inline, external or
// interface. A compile error draws nothing at all: the harness prints it with the line.
//
// From the rest of the shader you may use: uMain (the body's colour, linear), uAccent, uKey/uFill/uBack and their
// uKeyCol/uFillCol/uBackCol, uUp, uFwd (toward the camera along the floor), uBackdrop (the page behind), uDark,
// uTime (seconds; it stands still with "reduce motion"), gPix, snoise(q, lod), hash33, ign(gl_FragCoord.xy), smin,
// smax, lum, max3, D_Charlie, V_Neubelt, sheenIBL, skyIrr, and everything below.

// ---------------------------------------------------------------- small things
float sq(float x) { return x * x; }
float pow5(float x) { float x2 = x * x; return x2 * x2 * x; }
float sat(float x) { return clamp(x, 0.0, 1.0); }
// a frame on the surface: two directions along it
void frame(vec3 n, out vec3 t, out vec3 b) {
  t = normalize(cross(n, abs(n.y) < 0.92 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
  b = cross(n, t);
}
// the way round the body (level, about the upright axis through its middle): for threads, brushing, rows of stitches.
// It turns smoothly everywhere but on that axis itself (the very top).
vec3 around(vec3 p, vec3 n) {
  vec3 a = cross(vec3(0.0, 1.0, 0.0), vec3(p.x, 0.0, p.z));
  a -= n * dot(a, n);
  return dot(a, a) > 1e-6 ? normalize(a) : normalize(cross(n, vec3(0.0, 0.0, 1.0)));
}

// ---------------------------------------------------------------- level of detail
// 1 where something this big (in the mascot's units) covers a few pixels, 0 where it is smaller than one. Fade fine
// detail toward its average with this, so nothing shimmers at small sizes.
float resolved(float size) { return 1.0 - smoothstep(0.35, 1.0, gPix / size); }
// the same for a pattern lying on a surface seen at a slant (the cosine of its angle to the eye): a pixel covers
// more of it there, so a pattern that is clear face-on would turn to rings toward the outline
float resolvedOn(float size, float cosine) { return resolved(size * clamp(cosine, 0.05, 1.0)); }
// noise at a frequency (cells per unit), filtered for this pixel
float noiseAt(vec3 p, float freq) { return snoise(p * freq, log2(max(gPix * freq, 1e-6)) + 0.5); }

// ---------------------------------------------------------------- the scene, for a material's own questions
// (All of these leave out the material's own relief unless they say otherwise: gDetail is 0 while they ask.)
// the distance to the smooth body and what it wears (negative inside)
float bodySmooth(vec3 p) { float keep = gDetail; gDetail = 0.0; float d = skinD(p); gDetail = keep; return d; }
// how open the sky is at p: 1 in the open, less in creases and under things (the body, what it wears, solid parts)
float occlusion(vec3 p, vec3 n) { float keep = gDetail; gDetail = 0.0; float a = calcAO(p, n); gDetail = keep; return a; }
// the same, with the material's relief (dearer: for a relief deep enough to shade itself)
float occlusionRelief(vec3 p, vec3 n) { return calcAO(p, n); }
// the key lamp's soft shadow at p: 1 lit, 0 in shadow. k: 3 very soft .. 8 crisp
float shadowKey(vec3 p, vec3 n, float k) { float keep = gDetail; gDetail = 0.0; float s = softShadow(p + n * 0.012, uKey, k); gDetail = keep; return s; }
float shadowKeyRelief(vec3 p, vec3 n, float k) { return softShadow(p + n * 0.012, uKey, k); }
// how the smooth body curves at p: positive on a bulge, negative in a crease (about 2 / radius on a ball). h: the
// scale to measure at (0.02 fine .. 0.1 broad). Six readings of the distance.
float curvature(vec3 p, float h) {
  float keep = gDetail; gDetail = 0.0;
  vec2 e = vec2(h, 0.0);
  float c = (skinD(p + e.xyy) + skinD(p - e.xyy) + skinD(p + e.yxy) + skinD(p - e.yxy) + skinD(p + e.yyx) + skinD(p - e.yyx) - 6.0 * skinD(p)) / (h * h);
  gDetail = keep;
  return c;
}
// how much body lies along dir from p (p on the surface or just under it), up to far. For light coming through.
float thickness(vec3 p, vec3 dir, float far) {
  float keep = gDetail; gDetail = 0.0;
  float t = 0.02;
  for (int i = 0; i < 14; i++) {
    float d = skinD(p + dir * t);
    if (d > 0.0 || t > far) break;
    t += max(-d, 0.02);
  }
  gDetail = keep;
  return min(t, far);
}

// ---------------------------------------------------------------- the studio
// What a mirror sees: a photographer's studio laid out round the mascot. A big soft key panel in front and above, a
// tall fill panel to the side, a strip behind for the rim, walls that are brightest low down, a darker side where the
// camera stands (a mirror needs something dark to have lines), and the floor, which is the page. Each panel is as
// bright as the light its lamp gives, so a mirror and a matte surface agree. `blur` softens everything, for rough
// surfaces: pass roughness squared.
struct Studio { vec3 room; vec3 key; vec3 fill; vec3 back; };   // light arriving from a direction, by where it comes from

// a soft-edged rounded panel seen in direction dir. c: its middle (unit); ax, ay: its sideways and upward axes;
// hs: its half sizes in radians. Blurring it wider than it is dims it (the light is the same, spread out).
float panel(vec3 dir, vec3 c, vec3 ax, vec3 ay, vec2 hs, float blur) {
  float z = dot(dir, c);
  vec2 q = vec2(atan(dot(dir, ax), z), atan(dot(dir, ay), z));
  float soft = 0.035 + blur;
  float r = 0.3 * min(hs.x, hs.y);
  vec2 e = abs(q) - hs + r;
  float d = length(max(e, 0.0)) + min(max(e.x, e.y), 0.0) - r;
  vec2 dim = hs / sqrt(hs * hs + soft * soft);
  return (1.0 - smoothstep(-soft, soft, d)) * dim.x * dim.y;
}
const vec2 KEY_HALF = vec2(0.46, 0.34), FILL_HALF = vec2(0.13, 0.48), BACK_HALF = vec2(0.5, 0.11);
Studio studio(vec3 dir, float blur) {
  Studio s;
  float up = dot(dir, uUp), day = 1.0 - uDark;
  // the room: walls brightest low down, darker toward the ceiling and on the camera's side; under the horizon, the floor
  vec3 wall = mix(mix(vec3(0.14), vec3(0.62), day), mix(vec3(0.045), vec3(0.3), day), smoothstep(0.0, 0.9, up));
  wall *= mix(1.0, 0.35, smoothstep(0.15, 0.95, dot(dir, uFwd)) * (1.0 - smoothstep(0.45, 0.9, up)));
  vec3 ground = (uBackdrop + 0.045 * uDark) * mix(0.95, 0.6, smoothstep(0.0, -1.0, up));   // (a dark page still catches a little of the lamps)
  float w = 0.02 + blur;
  s.room = mix(ground, wall, smoothstep(-w, w, up));
  vec3 kx = normalize(cross(uUp, uKey)), fx = normalize(cross(uUp, uFill)), bx = normalize(cross(uUp, uBack));
  s.key = uKeyCol * (PI / (4.0 * KEY_HALF.x * KEY_HALF.y)) * panel(dir, uKey, kx, cross(uKey, kx), KEY_HALF, blur);
  s.fill = uFillCol * (PI / (4.0 * FILL_HALF.x * FILL_HALF.y)) * panel(dir, uFill, fx, cross(uFill, fx), FILL_HALF, blur);
  s.back = uBackCol * (PI / (4.0 * BACK_HALF.x * BACK_HALF.y)) * panel(dir, uBack, bx, cross(uBack, bx), BACK_HALF, blur);
  return s;
}
// the mascot's own soft shadow on the floor at x (the floor's x, z): 0 none .. about 0.4 right under it
float floorShadow(vec2 x) {
  float r = length((x - vec2(0.0, 0.04)) / max(uShadow, vec2(1e-3)));
  return r < 0.5 ? mix(0.4, 0.14, r * 2.0) : 0.14 * (1.0 - clamp(r * 2.0 - 1.0, 0.0, 1.0));
}
// the studio as seen from p: the floor near the mascot carries its shadow
Studio studioAt(vec3 p, vec3 dir, float blur) {
  Studio s = studio(dir, blur);
  if (dir.y < -0.02) s.room *= 1.0 - floorShadow(p.xz + dir.xz * (max(p.y, 0.0) / -dir.y)) * smoothstep(-0.02, -0.2, dir.y);
  return s;
}
// all of it added up, with what dims each part: open = how open the sky is (occlusion), lit = the key's shadow
vec3 studioLight(Studio s, float open, float lit) { return s.room * open + s.key * lit + s.fill * mix(0.6, 1.0, open) + s.back * open; }

// ---------------------------------------------------------------- lobes
// the three lamps as plain directions, for lobes too broad to show a lamp's shape: 0 key, 1 fill, 2 back
vec3 lampDir(int i) { return i == 0 ? uKey : i == 1 ? uFill : uBack; }
vec3 lampCol(int i) { return i == 0 ? uKeyCol : i == 1 ? uFillCol : uBackCol; }
float D_GGX(float NoH, float a) { float a2 = a * a; float d = NoH * NoH * (a2 - 1.0) + 1.0; return a2 / (PI * d * d); }
float V_GGX(float NoV, float NoL, float a) {   // Smith, height-correlated (already holds the 1 / (4 NoV NoL))
  float a2 = a * a;
  return 0.5 / max(NoL * sqrt(NoV * NoV * (1.0 - a2) + a2) + NoV * sqrt(NoL * NoL * (1.0 - a2) + a2), 1e-5);
}
// anisotropic GGX: at, ab are the roughnesses (alpha) along the tangent t and across it
float D_GGXaniso(float NoH, float ToH, float BoH, float at, float ab) {
  float d = ToH * ToH / (at * at) + BoH * BoH / (ab * ab) + NoH * NoH;
  return 1.0 / (PI * at * ab * d * d);
}
float V_GGXaniso(float NoV, float NoL, float ToV, float BoV, float ToL, float BoL, float at, float ab) {
  return 0.5 / max(NoL * length(vec3(at * ToV, ab * BoV, NoV)) + NoV * length(vec3(at * ToL, ab * BoL, NoL)), 1e-5);
}
vec3 F_Schlick(vec3 f0, float VoH) { return f0 + (1.0 - f0) * pow5(1.0 - VoH); }
float F_Schlick1(float f0, float VoH) { return f0 + (1.0 - f0) * pow5(1.0 - VoH); }
// how much of the studio a surface of this roughness mirrors, facing you at NoV (Karis's fit to the split sum)
vec3 envBRDF(vec3 f0, float rough, float NoV) {
  vec4 r = rough * vec4(-1.0, -0.0275, -0.572, 0.022) + vec4(1.0, 0.0425, 1.04, -0.04);
  float a004 = min(r.x * r.x, exp2(-9.28 * NoV)) * r.x + r.y;
  vec2 ab = vec2(-1.04, 1.04) * a004 + r.zw;
  return f0 * ab.x + ab.y;
}
// how much of a mirrored view creases hide (Lagarde): open = occlusion()
float specOcclusion(float NoV, float open, float rough) { return clamp(pow(NoV + open, exp2(-16.0 * rough - 1.0)) - 1.0 + open, 0.0, 1.0); }

// ---------------------------------------------------------------- a plain surface (where most materials start)
struct Surf {
  vec3 base;       // its colour (a metal's colour, for a metal)
  float metal;     // 0 not a metal, 1 a metal
  float rough;     // 0 a mirror .. 1 matte
  float f0;        // how much it mirrors facing you, if not a metal (0.04 for most things)
  float wrap;      // how far diffuse light creeps past the shadow line (0 none .. 0.5 waxy)
  float sheen;     // a fuzz layer's sheen (cloth): 0 none .. 1
  vec3 sheenCol;
  float coat;      // a clear glossy coat on top: 0 none .. 1
  float coatRough;
};
Surf surf(vec3 base, float rough) { return Surf(base, 0.0, rough, 0.04, 0.0, 0.0, vec3(1.0), 0.0, 0.03); }
// its light toward the eye. open: occlusion(p, n); lit: shadowKey(p, n, k). n may carry your relief.
vec3 shade(vec3 p, vec3 n, vec3 v, Surf s, float open, float lit) {
  float NoV = max(dot(n, v), 1e-3);
  vec3 f0 = mix(vec3(s.f0), s.base, s.metal);
  // matte part: the dome and the floor, and the three lamps (the key's shadow falls on the key only)
  vec3 E = skyIrr(n) * open;
  for (int i = 0; i < 3; i++) {
    float w = clamp((dot(n, lampDir(i)) + s.wrap) / (1.0 + s.wrap), 0.0, 1.0);
    E += lampCol(i) * w * (i == 0 ? lit : mix(0.6, 1.0, open));
  }
  vec3 col = s.base * (1.0 - s.metal) * E;
  // mirrored part: the studio (its lamps keep their shapes; a rough surface blurs them)
  float a = s.rough * s.rough;
  vec3 R = normalize(mix(n, reflect(-v, n), (1.0 - a) * (sqrt(1.0 - a) + a)));
  col += studioLight(studioAt(p, R, a), specOcclusion(NoV, open, s.rough), lit) * envBRDF(f0, s.rough, NoV);
  if (s.sheen > 0.0) {          // fuzz: a soft glow toward the edges
    vec3 fz = s.sheenCol * s.sheen;
    col += fz * sheenIBL(NoV, 0.5) * skyIrr(n) * open;
    for (int i = 0; i < 3; i++) {
      vec3 l = lampDir(i);
      float nl = max(dot(n, l), 0.0);
      col += lampCol(i) * fz * D_Charlie(0.5, max(dot(n, normalize(l + v)), 0.0)) * V_Neubelt(NoV, nl) * nl * PI * (i == 0 ? lit : open);
    }
  }
  if (s.coat > 0.0) {           // a clear coat: what is under it shows less where the coat mirrors more
    float Fc = F_Schlick1(0.04, NoV) * s.coat;
    col = col * (1.0 - Fc) + studioLight(studioAt(p, reflect(-v, n), s.coatRough * s.coatRough), specOcclusion(NoV, open, s.coatRough), lit) * Fc;
  }
  return col;
}

// ---------------------------------------------------------------- sparkle
// Grains that flash like tiny mirrors. Seed points sit on a jittered grid in the body's space; near each lies a
// grain facing its own way, and it flashes when it mirrors a lamp into the eye. cell: the grid's size (about the
// spacing of grains); share: how many cells hold a grain (0 .. 1); spread: how far the grains' facings stray from
// the surface's (0.3 nearly flat .. 1 every way); sharp: how exactly a grain must be lined up to flash (0.97 broad ..
// 0.999 pinpoint). Returns how strongly the key (x) and the other lamps (y) flash here. Grains smaller than a pixel
// fade out rather than flicker; they stay put on the body and twinkle as it turns.
vec2 glints(vec3 p, vec3 n, vec3 v, float cell, float share, float spread, float sharp) {
  float vis = 1.0 - smoothstep(0.25, 0.6, gPix / cell);
  if (vis <= 0.0) return vec2(0.0);
  vec3 hk = normalize(uKey + v), hf = normalize(uFill + v), hb = normalize(uBack + v);
  vec3 c0 = floor(p / cell - 0.5);
  float r = max(0.16 * cell, 0.75 * gPix);
  vec2 g = vec2(0.0);
  for (int z = 0; z < 2; z++) for (int y = 0; y < 2; y++) for (int x = 0; x < 2; x++) {
    vec3 c = c0 + vec3(float(x), float(y), float(z));
    vec3 h = hash33(c);
    if (h.x > share) continue;
    vec3 o = p - (c + 0.2 + 0.6 * hash33(c + 31.7)) * cell;
    float spot = 1.0 - smoothstep(0.35 * r, r, length(o));
    if (spot <= 0.0) continue;
    vec3 f = normalize(n + (hash33(c + 7.3) * 2.0 - 1.0) * spread);
    g += spot * vec2(smoothstep(sharp, mix(sharp, 1.0, 0.6), dot(f, hk)),
                     max(smoothstep(sharp, mix(sharp, 1.0, 0.6), dot(f, hf)), smoothstep(sharp, mix(sharp, 1.0, 0.6), dot(f, hb))));
  }
  return g * vis * min(1.0, sq(0.16 * cell / r));
}
