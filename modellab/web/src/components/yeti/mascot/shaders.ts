// The mascots' shaders (GLSL ES 3.0, run by three.js's ShaderMaterial). Each mascot is a signed distance field,
// ray-marched in one fragment shader: COMMON (helpers, the embroidered face, glossy eyes), one character (its plush
// skin, or Rime's snow, and its solid parts), then RENDER (soft shadows, ambient occlusion, the plush and plastic
// shading; with SNOW defined, the snow, bark and frost instead).
// See ./engine.ts for how they're drawn, and tools/mascot/README.md for how the look was made.
export const VERT = /* glsl */ `
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const COMMON = /* glsl */ `
uniform sampler3D uNoise;
uniform vec3 uCam;          // camera, in the mascot's space (floor at y = 0, front is +z)
uniform vec3 uBoxMin;
uniform vec3 uBoxMax;
uniform float uPix;         // units per pixel, at distance 1
uniform vec3 uKey;          // the studio: a big softbox in front and above (it casts soft shadows),
uniform vec3 uKeyCol;
uniform vec3 uFill;         // a fill from the other side,
uniform vec3 uFillCol;
uniform vec3 uBack;         // a rim light behind and above,
uniform vec3 uBackCol;
uniform vec3 uUp;           // and a white sky dome over a pale floor
uniform vec3 uSky;
uniform vec3 uGround;
uniform float uExposure;
uniform vec3 uMain;         // the palette: body colour,
uniform vec3 uAccent;       // accent (ears, leaf, headphones, beak),
uniform vec3 uBlushC;       // blush,
uniform vec3 uExtra;        // and one more (a stem)
uniform float uPeel;        // 1: the fabric has small raised dots (minky dot), like citrus peel
uniform vec4 uEye[2];       // eyes on the face plane: centre x, y, half width, half height
uniform float uEyeZ;        // glossy eyes: how far forward they sit (at x = 0)
uniform float uFaceR;       // ...and how round the face is there
uniform float uEyeMode;     // 0 open, 1 happy arcs, 2 asleep
uniform float uEyeOpen;     // blink
uniform vec4 uNose;         // stitched nose: centre, half size (0 = none)
uniform vec4 uMouth;        // stitched smile: centre, radius, thread (0 = none)
uniform vec4 uBlush[2];     // centre, radius (0 = none)
uniform vec3 uEarC[2];
uniform mat3 uEarM[2];
uniform vec3 uArmA;
uniform vec3 uArmB;
uniform float uArmOn;
uniform vec4 uPetal[3];     // tuft lobes: direction, length
uniform vec3 uCurl[3];      // ...and which way each curls
uniform vec3 uPetalRoot;    // where the tuft grows from
uniform float uSway;
varying vec3 vPos;

struct Mat { vec3 alb; float fuzz; float ink; };   // dye colour, fuzz cover (none on thread), embroidery thread

const float PI = 3.14159265;
const vec3 INK = vec3(0.012, 0.011, 0.016);
float gPix = 0.002;   // the pixel footprint where we are

vec3 hash33(vec3 p3) { p3 = fract(p3 * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yxx) * p3.zyx); }
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
float smin(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }
float smax(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return max(a, b) + h * h * k * 0.25; }
mat2 rot2(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
float sdEllipsoid(vec3 p, vec3 r) { float k0 = length(p / r); float k1 = length(p / (r * r)); return k0 * (k0 - 1.0) / max(k1, 1e-5); }
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) { vec3 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0); return length(pa - ba * h) - r; }
float sdRoundCone(vec3 p, vec3 a, vec3 b, float r1, float r2) {
  vec3 ba = b - a; float l2 = dot(ba, ba); float rr = r1 - r2; float a2 = l2 - rr * rr; float il2 = 1.0 / l2;
  vec3 pa = p - a; float y = dot(pa, ba); float z = y - l2;
  vec3 xv = pa * l2 - ba * y; float x2 = dot(xv, xv); float y2 = y * y * l2; float z2 = z * z * l2;
  float k = sign(rr) * rr * rr * x2;
  if (sign(z) * a2 * z2 > k) return sqrt(x2 + z2) * il2 - r2;
  if (sign(y) * a2 * y2 < k) return sqrt(x2 + y2) * il2 - r1;
  return (sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}
float sdTorusZ(vec3 p, float R, float r) { return length(vec2(length(p.xy) - R, p.z)) - r; }
float sdCylX(vec3 p, float r, float h) { vec2 d = abs(vec2(length(p.yz), p.x)) - vec2(r, h); return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)); }
// two parts of plush sewn together: a smooth union that also blends their materials
void addPart(inout float d, inout Mat m, float d2, Mat m2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d) / k, 0.0, 1.0);
  d = mix(d2, d, h) - k * h * (1.0 - h);
  m.alb = mix(m2.alb, m.alb, h); m.fuzz = mix(m2.fuzz, m.fuzz, h); m.ink = mix(m2.ink, m.ink, h);
}
// a sewn seam pulls the fabric in along the line where two panels meet
float seam(float dist, float depth, float width) { return depth * exp(-(dist * dist) / (width * width)); }

// noise that stays smooth when magnified (its slope is continuous, so no grid shows) and is mip-mapped when minified;
// q is in noise cells, lod is this pixel's level for it
float snoise(vec3 q, float lod) {
  vec3 x = q + 0.5;
  vec3 i = floor(x), f = fract(x);
  float sm = textureLod(uNoise, (i + f * f * (3.0 - 2.0 * f) - 0.5) / 128.0, 0.0).r;
  if (lod <= 0.0) return sm;
  return mix(sm, textureLod(uNoise, q / 128.0, lod).r, smoothstep(0.0, 1.0, lod));
}
float fab(vec3 p, float freq, float off) { return snoise(p * freq + off, log2(max(gPix * freq, 1e-6)) + 0.5); }

// ---- the stitched face, on the front (x, y) plane
float ellipseD(vec2 p, vec2 c, vec2 r) { vec2 d = (p - c) / r; return (length(d) - 1.0) * min(r.x, r.y); }
float arcD(vec2 p, vec2 c, float R, float a0, float a1) {
  vec2 d = p - c; float a = atan(d.x, d.y);
  if (a > a0 && a < a1) return abs(length(d) - R);
  vec2 e0 = c + R * vec2(sin(a0), cos(a0)); vec2 e1 = c + R * vec2(sin(a1), cos(a1));
  return min(length(p - e0), length(p - e1));
}
float eyeD(vec2 p, vec4 e) {
  if (uEyeMode < 0.5) return ellipseD(p, e.xy, vec2(e.z, max(e.w * uEyeOpen, e.z * 0.2)));
  float t = e.z * 0.38;
  if (uEyeMode < 1.5) return arcD(p, e.xy - vec2(0.0, e.w * 0.5), e.w * 0.85, -1.0, 1.0) - t;   // happy: ^
  return arcD(vec2(p.x, 2.0 * e.y - p.y), e.xy - vec2(0.0, e.w * 0.6), e.w * 0.95, -0.95, 0.95) - t; // asleep: a soft U
}
float noseD(vec2 p) { if (uNose.z <= 0.0) return 1e3; vec2 d = abs(p - uNose.xy) - uNose.zw; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - uNose.w * 0.7; }
float mouthD(vec2 p) {
  if (uMouth.w <= 0.0) return 1e3;
  return arcD(vec2(p.x, 2.0 * uMouth.y - p.y), vec2(uMouth.x, uMouth.y - uMouth.z), uMouth.z, -0.9, 0.9) - uMouth.w;
}
float faceD(vec2 p, bool stitchedEyes) {
  float d = min(noseD(p), mouthD(p));
  if (stitchedEyes || uEyeMode > 0.5) d = min(d, min(eyeD(p, uEye[0]), eyeD(p, uEye[1])));
  return d;
}
// the face, embroidered: thread where the stitches are (no fuzz on it), blush dyed into the plush
void stitchFace(vec3 p, inout Mat m, vec3 blush, bool stitchedEyes) {
  if (p.z < 0.05) return;
  vec3 a = m.alb;
  for (int i = 0; i < 2; i++)
    if (uBlush[i].w > 0.0) a = mix(a, blush, 0.5 * (1.0 - smoothstep(0.0, uBlush[i].w, distance(p, uBlush[i].xyz))));
  float fd = faceD(p.xy, stitchedEyes);
  if (fd < 0.05) fd += 0.005 * (snoise(p * 260.0, 0.0) - 0.5);   // stitched edges aren't perfectly clean
  float k = 1.0 - smoothstep(-gPix, gPix, fd);
  m.ink = max(m.ink, k);
  m.alb = mix(a, INK, k);
  m.fuzz *= 1.0 - k;
}
// glossy plastic eyes (safety eyes), set into the face; when closed they become stitched arcs instead
float eyeDomes(vec3 p) {
  if (uEyeMode > 0.5) return 1e3;
  float d = 1e3;
  for (int i = 0; i < 2; i++) {
    vec4 e = uEye[i];
    float zs = uEyeZ - (uFaceR - sqrt(max(uFaceR * uFaceR - e.x * e.x, 0.0)));
    vec3 q = p - vec3(e.xy, zs);
    q.xz = rot2(asin(clamp(e.x / uFaceR, -0.8, 0.8))) * q.xz;
    d = min(d, sdEllipsoid(q, vec3(e.z, max(e.w * uEyeOpen, e.z * 0.12), e.z * 0.72)));
  }
  return d;
}
`;

// ---- the characters: each defines its plush (skinM) and its plastic parts (solid)
export const YETI = /* glsl */ `
// the body: a superellipse of revolution fitted to the photo of the plush (half-width 1)
float bodySdf(vec3 p) {
  vec2 xz = vec2(p.x, p.z / 0.9);
  float rho = length(xz), hh = p.y - 0.68;
  float w = smoothstep(-0.45, 0.45, hh);
  float n = mix(3.4, 2.2, w), B = mix(0.72, 0.9, w);
  vec2 q = max(vec2(rho, abs(hh) / B), 1e-4);
  vec2 qn = pow(q, vec2(n));
  float r = pow(qn.x + qn.y, 1.0 / n);
  vec2 g = pow(r, 1.0 - n) * (qn / q) / vec2(1.0, B);
  float d = (r - 1.0) / max(length(g), 1e-3);
  float zz = p.z * p.z;
  d *= mix(1.0, 0.9, zz / max(p.x * p.x + zz, 1e-5));
  return smax(d, -p.y + 0.02, 0.26);
}
float skinM(vec3 p, out Mat m, bool full) {
  m = Mat(uMain, 1.0, 0.0);
  float d = bodySdf(p) + seam(p.z + 0.04, 0.006, 0.02);   // where the front and back panels are sewn together
  if (full) stitchFace(p, m, uBlushC, true);
  // panda ears: thick rounded discs with a cupped front, set into the upper corners of the head
  for (int i = 0; i < 2; i++) {
    vec3 q = uEarM[i] * (p - uEarC[i]);
    float disc = sdEllipsoid(q, vec3(0.235, 0.22, 0.12));
    float cup = sdEllipsoid(q - vec3(0.0, 0.025, 0.13), vec3(0.15, 0.14, 0.085));
    addPart(d, m, smax(disc, -cup, 0.05), Mat(uAccent, 1.0, 0.0), 0.05);
  }
  // the tuft: one soft flame of plush, curling over like a cowlick
  vec3 v = p - uPetalRoot;
  if (dot(v, v) < 1.0) {
    float dt = 1e3;
    for (int i = 0; i < 3; i++) {
      vec3 dir = uPetal[i].xyz, a = uPetalRoot + dir * 0.02;
      float L = uPetal[i].w, r0 = i == 0 ? 0.17 : 0.135;
      vec3 b = a + dir * L * 0.55;
      vec3 c = b + normalize(dir + uCurl[i]) * L * 0.5;
      dt = smin(dt, smin(sdRoundCone(p, a, b, r0, r0 * 0.66), sdRoundCone(p, b, c, r0 * 0.66, r0 * 0.4), 0.05), 0.12);
    }
    addPart(d, m, dt, Mat(uAccent, 1.0, 0.0), 0.07);
  } else d = min(d, length(v) - 0.65);   // (a safe bound: the tuft reaches no further than 0.65 from its root)
  // the waving arm, with a pad on the paw
  if (uArmOn > 0.5) {
    vec3 a = mix(uMain, uAccent, 1.0 - smoothstep(0.05, 0.085, distance(p, uArmB + vec3(0.0, 0.02, 0.12))));
    addPart(d, m, sdRoundCone(p, uArmA, uArmB, 0.15, 0.135), Mat(a, 1.0, 0.0), 0.03);
  }
  return d;
}
float solid(vec3 p, out vec3 col, out float rough) { col = vec3(0.0); rough = 0.3; return 1e3; }
float casters(vec3 p) { return 1e3; }
`;

export const MOCHI = /* glsl */ `
// Dr. Mochi, the scientist: a soft gumdrop in a white lab coat, with round glasses and a pen in the breast pocket.
// (The glasses, buttons and pen were placed on the surface by solving this same shape numerically.)
float bodyD(vec3 p) {
  float d = sdRoundCone(vec3(p.x, p.y, p.z / 0.9), vec3(0.0, 0.6, 0.0), vec3(0.0, 1.1, 0.0), 0.8, 0.6) * 0.9;
  return smax(d, -p.y + 0.02, 0.2);
}
const float COLLAR = 0.74, V_START = 0.34, V_SLOPE = 0.6;
const vec3 SH = vec3(0.7, 0.62, 0.12), HAND = vec3(0.8305, 0.35, 0.12);   // the sleeves at rest: shoulder and cuff
float skinM(vec3 p, out Mat m, bool full) {
  m = Mat(uMain, 1.0, 0.0);
  float d = bodyD(p);
  if (full) stitchFace(p, m, uBlushC, false);
  // the lab coat: cotton over the lower body, open in a V at the chest, its collar and lapels rolled
  float vEdge = (abs(p.x) - V_SLOPE * (p.y - V_START)) * 0.857;    // distance to the V's edge (negative inside it)
  float front = smoothstep(0.15, 0.35, p.z);
  float collarY = COLLAR + 0.12 * (1.0 - smoothstep(-0.1, 0.45, p.z));   // the collar stands up at the sides and back
  float roll = exp(-pow((p.y - collarY) / 0.035, 2.0)) + front * step(V_START, p.y) * exp(-pow(vEdge / 0.025, 2.0));
  float dc = d - 0.03 - 0.014 * roll;
  float lapelZone = front * step(V_START + 0.04, p.y);
  dc -= 0.006 * lapelZone * (1.0 - smoothstep(0.06, 0.075, vEdge)) * smoothstep(0.0, 0.01, vEdge);   // lapels: folded back,
  dc += lapelZone * seam(vEdge - 0.075, 0.004, 0.006);                                                 // two layers of cloth
  dc -= front * step(p.y, V_START) * 0.005 * exp(-pow(p.x / 0.035, 2.0));   // where the coat overlaps and buttons
  dc += front * step(p.y, V_START + 0.02) * seam(p.x + 0.035, 0.004, 0.006);
  // a breast pocket on the wearer's left: a patch, sewn on round three sides
  vec2 pk = vec2(p.x - 0.4, p.y - 0.38);
  float pd = max(abs(pk.x) - 0.1, abs(pk.y) - 0.09);
  dc -= front * (0.008 * (1.0 - smoothstep(-0.008, 0.002, pd)) - seam(pd + 0.012, 0.003, 0.004) * step(pk.y, 0.075));
  dc = smax(dc, p.y - collarY, 0.02);                               // the coat ends at the collar
  dc = smax(dc, -max(vEdge, 0.2 - p.z), 0.012);                     // and is open at the front, above the buttons
  dc = smax(dc, -p.y, 0.02);
  addPart(d, m, dc, Mat(uExtra, 0.5, 0.0), 0.006);
  // coat sleeves with orange paws peeking out; the one on the viewer's right waves
  for (int i = 0; i < 2; i++) {
    vec3 a = i == 0 ? vec3(-SH.x, SH.y, SH.z) : uArmA;
    vec3 b = i == 0 ? vec3(-HAND.x, HAND.y, HAND.z) : uArmB;
    vec3 dir = normalize(b - a);
    addPart(d, m, sdRoundCone(p, a, b, 0.12, 0.1), Mat(uExtra, 0.5, 0.0), 0.04);
    addPart(d, m, length(p - (b + dir * 0.075)) - 0.08, Mat(uMain, 1.0, 0.0), 0.02);
  }
  return d;
}
// round glasses: two rings facing along the face, a little arched bridge, and arms that run round the sides of the head
const vec3 GC = vec3(0.28, 1.1272, 0.5834), GR = vec3(0.9177, 0.0, -0.3973), GU = vec3(-0.1476, 0.9285, -0.3408), GN = vec3(0.3689, 0.3714, 0.8521);
const float FR = 0.16, FT = 0.02;
float glassesD(vec3 p) {
  vec3 a = vec3(abs(p.x), p.y, p.z);   // the glasses are symmetric
  vec3 q = a - GC;
  float d = sdTorusZ(vec3(dot(q, GR), dot(q, GU), dot(q, GN)), FR, FT);
  vec3 inner = GC - GR * FR, outer = GC + GR * FR;
  vec3 bc = vec3(0.0, inner.y + 0.005, inner.z);
  vec3 qb = a - bc;
  float arch = max(length(vec2(length(qb.xy) - 0.05, qb.z)) - 0.016, -qb.y);
  d = min(d, min(arch, sdCapsule(a, inner, bc + vec3(0.05, 0.0, 0.0), 0.016)));
  d = min(d, sdCapsule(a, outer, vec3(0.5194, 1.148, 0.3743), 0.015));
  d = min(d, sdCapsule(a, vec3(0.5194, 1.148, 0.3743), vec3(0.582, 1.148, 0.2893), 0.015));
  d = min(d, sdCapsule(a, vec3(0.582, 1.148, 0.2893), vec3(0.6238, 1.148, 0.2059), 0.015));
  return d;
}
float buttonsD(vec3 p) {
  vec3 q1 = p - vec3(0.0, 0.2376, 0.6886); q1.yz = rot2(-0.403) * q1.yz;
  vec3 q2 = p - vec3(0.0, 0.1262, 0.6261); q2.yz = rot2(-0.686) * q2.yz;
  return min(sdEllipsoid(q1, vec3(0.034, 0.034, 0.013)), sdEllipsoid(q2, vec3(0.034, 0.034, 0.013)));
}
float penD(vec3 p) {   // a pen in the pocket: only what shows above the pocket's edge
  return max(sdCapsule(p, vec3(0.408, 0.4, 0.662), vec3(0.428, 0.6, 0.67), 0.022), 0.47 - p.y);
}
float solid(vec3 p, out vec3 col, out float rough) {
  float d = eyeDomes(p);
  col = INK; rough = 0.16;
  float dg = glassesD(p);
  if (dg < d) { d = dg; col = vec3(0.016, 0.016, 0.02); rough = 0.2; }
  float db = buttonsD(p);
  if (db < d) { d = db; col = vec3(0.05, 0.055, 0.07); rough = 0.25; }
  float dp = penD(p);
  if (dp < d) { d = dp; col = p.y > 0.57 ? INK : uAccent; rough = 0.24; }
  return d;
}
float casters(vec3 p) { return min(glassesD(p), penD(p)); }   // the glasses and the pen cast soft shadows
`;

export const BOP = /* glsl */ `
float skinM(vec3 p, out Mat m, bool full) {
  m = Mat(uMain, 1.0, 0.0);
  vec3 q = vec3(p.x, p.y, p.z / 0.88);
  float d = smax(sdCapsule(q, vec3(0.0, 0.6, 0.0), vec3(0.0, 1.22, 0.0), 0.6) * 0.88, -p.y + 0.02, 0.16);
  d += seam(p.z + 0.02, 0.006, 0.02);
  if (full) stitchFace(p, m, uBlushC, true);
  return d;
}
// headphones: a band over the head and a cup on each side, glossy plastic
float solid(vec3 p, out vec3 col, out float rough) {
  vec3 q = p - vec3(0.0, 1.22, -0.02);
  float band = max(sdTorusZ(q, 0.69, 0.05), -q.y - 0.1);
  vec3 cq = vec3(abs(q.x) - 0.64, q.y + 0.12, q.z);
  float cup = sdCylX(cq, 0.19, 0.06) - 0.03;
  col = cup < band ? uAccent : vec3(0.014, 0.014, 0.018);
  rough = 0.22;
  return min(band, cup);
}
float casters(vec3 p) { vec3 c; float r; return solid(p, c, r); }   // the headphones shade the head
`;

export const TWINKLE = /* glsl */ `
float skinM(vec3 p, out Mat m, bool full) {
  m = Mat(uMain, 1.0, 0.0);
  // a stuffed star: five soft arms blended into a plump middle, sewn from a front and a back panel
  vec3 q = p - vec3(0.0, 0.93, 0.0);
  float d = sdEllipsoid(q, vec3(0.47, 0.47, 0.35));
  for (int i = 0; i < 5; i++) {
    float a = float(i) * 1.2566371;
    vec2 dir = vec2(sin(a), cos(a));
    vec3 qa = vec3(q.x * dir.y - q.y * dir.x, dot(q.xy, dir) - 0.5, q.z);
    d = smin(d, sdEllipsoid(qa, vec3(0.26, 0.53, 0.27)), 0.22);
  }
  d += seam(q.z, 0.012, 0.026);
  d = smax(d, -p.y + 0.02, 0.1);
  if (full) stitchFace(p, m, uBlushC, false);
  return d;
}
float solid(vec3 p, out vec3 col, out float rough) { col = INK; rough = 0.16; return eyeDomes(p); }
float casters(vec3 p) { return 1e3; }
`;

export const PIP = /* glsl */ `
float skinM(vec3 p, out Mat m, bool full) {
  m = Mat(uMain, 1.0, 0.0);
  float body = sdEllipsoid(p - vec3(0.0, 0.64, 0.0), vec3(0.74, 0.66, 0.7));
  float top = sdRoundCone(p, vec3(0.0, 0.92, 0.0), vec3(0.1 + 0.02 * sin(uSway), 1.6, -0.06), 0.44, 0.05);   // a pointy top that leans
  float d = smax(smin(body, top, 0.3), -p.y + 0.02, 0.16);
  if (full) stitchFace(p, m, uBlushC, false);
  // little wings
  vec3 qw = vec3(abs(p.x) - 0.72, p.y - 0.6, p.z - 0.04);
  qw.xy = rot2(-0.35) * qw.xy;
  addPart(d, m, sdEllipsoid(qw, vec3(0.09, 0.23, 0.15)), Mat(uMain * 0.9, 1.0, 0.0), 0.06);
  return d;
}
// a glossy beak and glossy eyes
float solid(vec3 p, out vec3 col, out float rough) {
  float de = eyeDomes(p);
  float db = sdRoundCone(p, vec3(0.0, 0.76, 0.6), vec3(0.0, 0.72, 0.83), 0.085, 0.022);
  if (db < de) { col = uAccent; rough = 0.3; return db; }
  col = INK; rough = 0.16;
  return de;
}
float casters(vec3 p) { return 1e3; }
`;

export const RIME = /* glsl */ `
#define SNOW
// Rime, the snow golem: packed snow, a crown of twigs round his face (frosted on top, with one green sprout), glossy
// pebble eyes, and a small wavy mouth that never smiles. Frost drifts round him; the snow and the frost are in RENDER.
uniform float uFrostT;   // the frost's clock: faster while he thinks, slower asleep, stopped with reduced motion
uniform float uFrostR;   // how far out it swirls (it puffs out when he hops)
uniform vec3 uFrostC;    // its colour (deeper on a light page, paler on a dark one)
const vec3 HEAD = vec3(0.0, 1.28, 0.0), HEAD_R = vec3(0.6, 0.6, 0.55);
const float FACE_Z = 0.47;                       // the front of the head is pressed a little flat: his face
const vec3 CROWN = vec3(0.0, 1.27, 0.43);        // the twig crown: its centre and radius
const float CROWN_R = 0.4;
const vec3 MOUTH = vec3(0.025, 1.14, 0.058);     // the mouth: centre, half width
float seg2(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0)); }
float mouthLine(vec2 p) {   // a short wavy line, a little off centre
  vec2 m = p - MOUTH.xy;
  return length(vec2(max(abs(m.x) - MOUTH.z, 0.0), (m.y - 0.008 * sin(m.x * 60.0)) / 1.1));
}
// soft lumps of packed snow (smooth, from sines: the noise texture is filtered in 8 bits, which would show as terraces)
float lumps(vec3 p) {
  vec3 q = p * 2.7;
  float a = sin(q.x + 1.3 * sin(q.y * 0.8 + 0.5)) * sin(q.y * 1.1 + 1.2 * sin(q.z * 0.9 + 2.0)) * sin(q.z * 1.05 + 1.4 * sin(q.x * 0.85 + 1.0));
  q = p * 6.3 + 1.7;
  float b = sin(q.x + 1.2 * sin(q.z * 0.9)) * sin(q.y + 1.3 * sin(q.x * 1.1)) * sin(q.z + 1.1 * sin(q.y * 0.95));
  return 0.016 * a + 0.006 * b;
}
float snowD(vec3 p) {
  vec3 q = p - HEAD;
  float head = smax(sdEllipsoid(q, HEAD_R), q.z - FACE_Z, 0.16);
  head = smin(head, sdRoundCone(p, HEAD + vec3(0.0, 0.22, -0.1), HEAD + vec3(0.03, 0.64, -0.27), 0.3, 0.05), 0.2);   // a soft hood point
  float d = smin(head, sdRoundCone(p, vec3(0.0, 0.42, 0.0), vec3(0.0, 0.8, 0.0), 0.38, 0.28), 0.12);                 // the body
  vec3 lq = vec3(abs(p.x) - 0.19, p.y, p.z - 0.03);
  d = smin(d, sdRoundCone(lq, vec3(0.0, 0.1, 0.0), vec3(0.0, 0.34, 0.0), 0.13, 0.14), 0.07);                          // stubby legs
  d = smin(d, sdRoundCone(p, vec3(-0.4, 0.84, 0.03), vec3(-0.524, 0.335, 0.03), 0.1, 0.115), 0.04);                   // arms that hang;
  d = smin(d, sdRoundCone(p, uArmA, uArmB, 0.1, 0.115), 0.04);                                                        // this one waves
  // packed snow isn't smooth: soft lumps everywhere but his face
  float face = smoothstep(0.42, 0.3, length(q.xy)) * smoothstep(0.25, 0.4, q.z);
  d += (1.0 - face) * lumps(p);
  if (q.z > 0.3) d += seam(mouthLine(p.xy), 0.006, 0.012);   // the mouth is pressed into the snow
  return smax(d, -p.y, 0.04) * 0.9;   // (the lumps steepen the field a little)
}
float skinM(vec3 p, out Mat m, bool full) {
  m = Mat(uMain, 0.0, 0.0);
  float d = snowD(p);
  if (full && p.z > 0.3) {   // the mouth, and asleep, two level lines for eyes (otherwise they're pebbles: solid())
    float fd = mouthLine(p.xy) - 0.008;
    if (uEyeMode > 1.5) for (int i = 0; i < 2; i++) fd = min(fd, seg2(p.xy, uEye[i].xy - vec2(uEye[i].z, 0.0), uEye[i].xy + vec2(uEye[i].z, 0.0)) - 0.011);
    m.ink = 1.0 - smoothstep(-gPix, gPix, fd);
  }
  return d;
}
// the crown: four twigs wound round each other, ends and forks sticking out, and a sprout with two leaves
const vec4 STICKS[9] = vec4[9](   // where each leaves the crown (angle round it), lean along it, lift toward us, length
  vec4(0.25, 0.35, 0.25, 0.2), vec4(0.95, -0.3, 0.4, 0.16), vec4(1.55, 0.4, 0.15, 0.22), vec4(2.0, -0.45, 0.3, 0.14),
  vec4(2.75, 0.3, 0.35, 0.19), vec4(3.5, -0.35, 0.2, 0.17), vec4(4.3, 0.5, 0.45, 0.13), vec4(5.15, -0.3, 0.3, 0.2),
  vec4(5.8, 0.45, 0.2, 0.15));
float crownD(vec3 p, out float leaf) {
  leaf = 0.0;
  vec3 q = p - CROWN;
  float rho = length(q.xy);
  float bound = length(vec2(rho - CROWN_R, q.z)) - 0.3;
  if (bound > 0.2) return bound;   // (far from it: a safe distance, and far enough that shadows and occlusion can't tell)
  float a = atan(q.y, q.x);
  float d = 1e3;
  for (int j = 0; j < 4; j++) {   // each twig winds round the crown at its own rate, thicker in places, with kinks
    float fj = float(j), ph = fj * 1.7, n = j == 1 ? 2.0 : j == 3 ? 4.0 : 3.0;
    float R = CROWN_R + 0.03 * sin(n * a + ph) + 0.008 * sin(13.0 * a + 2.3 * fj);
    float z = 0.03 * cos(n * a + ph) + 0.007 * sin(9.0 * a + fj);
    d = min(d, length(vec2(rho - R, q.z - z)) - (j == 3 ? 0.013 : 0.019) - 0.005 * sin(5.0 * a + 1.7 * fj));
  }
  d *= 0.8;
  for (int i = 0; i < 9; i++) {
    vec4 s = STICKS[i];
    vec2 o = vec2(cos(s.x), sin(s.x)), t = vec2(-o.y, o.x);
    vec3 dir = normalize(vec3(o * cos(s.y) + t * sin(s.y), s.z));
    vec3 b = vec3(o * CROWN_R, 0.0), e = b + dir * s.w;
    d = min(d, sdRoundCone(q, b - dir * 0.03, e, 0.018, 0.008));
    if (i == 0 || i == 2 || i == 4 || i == 7) {   // a fork
      vec3 f = b + dir * s.w * 0.55;
      vec3 fd = normalize(dir + vec3(t * (i == 4 ? -0.8 : 0.8), 0.25));
      d = min(d, sdRoundCone(q, f, f + fd * s.w * 0.45, 0.011, 0.006));
    }
  }
  // the sprout, at the top left: a little stem and two leaves
  vec2 o = vec2(cos(2.3), sin(2.3)), t = vec2(-o.y, o.x);
  vec3 b = vec3(o * (CROWN_R + 0.02), 0.03), tip = b + vec3(o * 0.06, 0.03);
  float ds = sdCapsule(q, b, tip, 0.009);
  for (int k = 0; k < 2; k++) {
    vec2 ld = normalize(o + t * (k == 0 ? 0.9 : -0.7));
    vec3 lx = normalize(vec3(ld, 0.35)), ly = normalize(cross(vec3(0.0, 0.0, 1.0), lx)), lz = cross(lx, ly);
    vec3 v = q - (tip + lx * 0.05);
    ds = min(ds, sdEllipsoid(vec3(dot(v, lx), dot(v, ly), dot(v, lz)), vec3(0.055, 0.03, 0.008)));
  }
  if (ds < d) { d = ds; leaf = 1.0; }
  return d;
}
// glossy pebble eyes, the crown (rough >= 1 means bark: see shadeBark), and the sprout
float solid(vec3 p, out vec3 col, out float rough) {
  float leaf;
  float dc = crownD(p, leaf);
  float de = eyeDomes(p);
  if (dc < de) { col = leaf > 0.5 ? uBlushC : uAccent; rough = leaf > 0.5 ? 0.45 : 1.0; return dc; }
  col = INK; rough = 0.2;
  return de;
}
// the crown shades his face: for its shadow it's a smooth ring as thick as the twigs (an exact distance, so the soft
// shadow has no banding; the thin ends' shadows would hardly show)
float casters(vec3 p) { vec3 q = p - CROWN; return length(vec2(length(q.xy) - CROWN_R, q.z)) - 0.045; }
`;

export const RENDER = /* glsl */ `
float skinD(vec3 p) { Mat m; return skinM(p, m, false); }
float solidD(vec3 p) { vec3 c; float r; return solid(p, c, r); }
float mapD(vec3 p) { return min(skinD(p), solidD(p)); }
// (thin casters like glasses frames are thickened a little here, so the shadow march can't step over them in places)
float shadowD(vec3 p) { return min(skinD(p), casters(p) - 0.012); }
vec3 skinNormal(vec3 p) {
  const vec2 k = vec2(1.0, -1.0);
  const float h = 0.0015;
  return normalize(k.xyy * skinD(p + k.xyy * h) + k.yyx * skinD(p + k.yyx * h) + k.yxy * skinD(p + k.yxy * h) + k.xxx * skinD(p + k.xxx * h));
}
vec3 solidNormal(vec3 p) {
  const vec2 k = vec2(1.0, -1.0);
  const float h = 0.0015;
  return normalize(k.xyy * solidD(p + k.xyy * h) + k.yyx * solidD(p + k.yyx * h) + k.yxy * solidD(p + k.yxy * h) + k.xxx * solidD(p + k.xxx * h));
}
// ambient occlusion from the distance field (Evans 2006, Quilez 2008): how much nearby surface closes over this point
float calcAO(vec3 p, vec3 n) {
  float occ = 0.0, sca = 1.0;
  for (int i = 0; i < 5; i++) {
    float h = 0.015 + 0.17 * float(i) / 4.0;
    occ += (h - mapD(p + h * n)) * sca;
    sca *= 0.85;
  }
  return clamp(1.0 - 2.2 * occ, 0.0, 1.0);
}
// a soft shadow from the softbox (Quilez's improved penumbra); a smaller k is a bigger, softer light
float softShadow(vec3 ro, vec3 rd, float k) {
  float res = 1.0, t = 0.015, ph = 1e10;
  for (int i = 0; i < 32; i++) {
    float h = shadowD(ro + rd * t);
    float y = h * h / (2.0 * ph);
    float d = sqrt(max(h * h - y * y, 0.0));
    res = min(res, k * d / max(0.0, t - y));
    ph = h;
    t += clamp(h, 0.012, 0.2);
    if (res < 0.003 || t > 2.6) break;
  }
  res = clamp(res, 0.0, 1.0);
  return res * res * (3.0 - 2.0 * res);
}

// ---- plush: dyed fibres underneath, a fuzz layer on top (layered as in OpenPBR: F f_fuzz + (1 - F E_fuzz) f_base)
float D_Charlie(float r, float NoH) { float a = r * r; float inv = 1.0 / a; float s2 = max(1.0 - NoH * NoH, 0.0078125); return (2.0 + inv) * pow(s2, inv * 0.5) / (2.0 * PI); }
float V_Neubelt(float NoV, float NoL) { return clamp(1.0 / (4.0 * (NoL + NoV - NoL * NoV)), 0.0, 1.0); }
float sheenIBL(float NoV, float r) {   // the fuzz lit by the whole sky (three.js's fit to Estevez & Kulla), in our units
  float r2 = r * r;
  float a = r < 0.25 ? -339.2 * r2 + 161.4 * r - 25.9 : -8.48 * r2 + 14.3 * r - 9.95;
  float b = r < 0.25 ? 44.0 * r2 - 23.7 * r + 3.26 : 1.97 * r2 - 3.27 * r + 0.72;
  return min(exp(a * NoV + b) + (r < 0.25 ? 0.0 : 0.1 * (r - 0.25)), PI);
}
float max3(vec3 v) { return max(v.r, max(v.g, v.b)); }
float lum(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
vec3 skyIrr(vec3 N) { return mix(uGround, uSky, dot(N, uUp) * 0.5 + 0.5); }
const float FUZZ_R = 0.5;    // fuzz roughness (OpenPBR's default): a fibre-like sheen, not a dusty one

// one light: the fibres underneath catch it with a soft wrap past the terminator, the way light creeps through soft
// fabric (Green 2004), coming back a little deeper in colour there; the fuzz on top adds a sheen toward grazing angles
vec3 plushLight(vec3 L, vec3 Lc, vec3 N, vec3 V, vec3 base, vec3 deep, vec3 fuzzC, float baseW, float sh) {
  float NoL = dot(N, L);
  float wrap = clamp((NoL + 0.4) / 1.4, 0.0, 1.0);
  vec3 diff = mix(deep, base, smoothstep(-0.3, 0.5, NoL)) * wrap;
  float nl = max(NoL, 0.0);
  vec3 H = normalize(L + V);
  vec3 sheen = fuzzC * D_Charlie(FUZZ_R, max(dot(N, H), 0.0)) * V_Neubelt(max(dot(N, V), 1e-3), nl) * nl * PI;
  return Lc * (diff * baseW + sheen) * sh;
}
vec3 shadePlush(vec3 p, vec3 N, vec3 V, Mat m, float ao, float shK, float grain, float crush) {
  vec3 base = m.alb * (1.0 + 0.14 * (grain - 0.5) * (1.0 - m.ink));
  vec3 deep = max(mix(vec3(lum(base)), base, 1.3), 0.0) * 0.82;              // same hue, richer
  vec3 fuzzC = mix(base, sqrt(base), 0.45) * m.fuzz * mix(0.7, 1.3, crush);   // the fuzz: a lighter tint of the dye, in soft patches
  float baseW = 1.0 - 0.157 * max3(fuzzC);
  float NoV = max(dot(N, V), 1e-3);
  float occ = ao * mix(0.55, 1.0, smoothstep(-0.05, 0.45, p.y + 0.25 * N.y));   // and the floor hides the underside
  vec3 env = skyIrr(N) * occ;
  vec3 col = base * env * baseW + fuzzC * sheenIBL(NoV, FUZZ_R) * env;
  col += plushLight(uKey, uKeyCol, N, V, base, deep, fuzzC, baseW, mix(1.0, shK, smoothstep(-0.1, 0.25, dot(N, uKey))) * mix(0.75, 1.0, occ));
  col += plushLight(uFill, uFillCol, N, V, base, deep, fuzzC, baseW, mix(0.5, 1.0, occ));
  col += plushLight(uBack, uBackCol, N, V, base, deep, fuzzC, baseW, occ);
  if (m.ink > 0.0) col += m.ink * uKeyCol * 0.14 * pow(max(dot(reflect(-V, N), uKey), 0.0), 12.0) * shK;   // the thread's satin gloss
  return col;
}
vec3 shadePlastic(vec3 n, vec3 V, vec3 base, float rough, float ao, float shK) {
  float nv = max(dot(n, V), 1e-3);
  vec3 col = base * (skyIrr(n) * ao + uKeyCol * max(dot(n, uKey), 0.0) * shK + uFillCol * max(dot(n, uFill), 0.0));
  vec3 R = reflect(-V, n);
  float fres = 0.04 + 0.96 * pow(1.0 - nv, 5.0);
  float w = mix(0.95, 0.82, rough);                 // the softbox reflects as a soft bright window
  vec3 refl = mix(uGround, uSky, dot(R, uUp) * 0.5 + 0.5) * 0.6 * ao
            + uKeyCol * 3.0 * smoothstep(w, w + 0.04, dot(R, uKey)) * shK
            + uBackCol * 1.2 * smoothstep(w, w + 0.05, dot(R, uBack))
            + uFillCol * 1.6 * smoothstep(w + 0.01, w + 0.05, dot(R, uFill));
  return col + refl * fres * mix(1.0, 0.6, rough);
}
// the fabric's texture, only where it's bigger than a pixel (so nothing shimmers): soft clumps that bend the normal a
// little, a fine grain, patches where the pile lies differently, and (some fabrics) small raised dots
void fabricTexture(vec3 p, inout vec3 N, out float grain, out float crush) {
  vec3 T1 = normalize(cross(N, abs(N.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0))), T2 = cross(N, T1);
  float fC = 1.0 - smoothstep(0.3, 0.9, gPix * 90.0);
  float c0 = snoise(p * 90.0 + 17.0, 0.0);
  const float e = 0.004;
  vec2 g = vec2(snoise((p + T1 * e) * 90.0 + 17.0, 0.0) - c0, snoise((p + T2 * e) * 90.0 + 17.0, 0.0) - c0) / e;
  N = normalize(N - (T1 * g.x + T2 * g.y) * 0.0016 * fC);
  float fF = 1.0 - smoothstep(0.3, 0.9, gPix * 300.0);
  grain = 0.5 + (c0 - 0.5) * 0.8 * fC + (snoise(p * 300.0 + 51.0, 0.0) - 0.5) * 0.6 * fF;
  crush = snoise(p * 3.2 + 9.0, 0.0);
  if (uPeel > 0.5) {    // citrus pores: a small soft dimple at each jittered point of a cell grid (Worley 1996)
    float fD = 1.0 - smoothstep(0.25, 0.7, gPix * 34.0);
    if (fD > 0.0) {
      vec3 q = p * 34.0, c = floor(q), bv = vec3(0.0);
      float best = 1e9;
      for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
        vec3 cc = c + vec3(float(x), float(y), float(z));
        vec3 v = q - (cc + 0.15 + 0.7 * hash33(cc));
        float d2 = dot(v, v);
        if (d2 < best) { best = d2; bv = v; }
      }
      float r = sqrt(best) / 0.36, slope = r < 1.0 ? 6.0 * r * (1.0 - r) / 0.36 : 0.0;   // smoothstep's slope
      vec3 g = slope * bv / max(sqrt(best), 1e-4) * 34.0;                                 // the dimple's slope, outward
      N = normalize(N - (g - N * dot(g, N)) * 0.0011 * fD);
      grain -= (1.0 - smoothstep(0.0, 1.0, r)) * 0.25 * fD;                               // a little darker inside
    }
  }
}
#ifdef SNOW
// ---- snow: packed grains of ice. Light goes a long way into snow before it comes back out, so the shadow line is very
// soft, and the light that wrapped furthest comes back blue (ice absorbs a little red over a long path); thin parts
// glow when lit from behind (Barre-Brisebois & Bouchard 2011); shadows and creases fill with the cool light of the sky;
// and single grains flash where they mirror the light into the eye.
const vec3 SNOW_DEEP = vec3(0.55, 0.77, 1.0);
const vec3 SNOW_SKY = vec3(0.84, 0.92, 1.0);
vec3 snowLight(vec3 L, vec3 Lc, vec3 N, vec3 V, vec3 base, float sh, float thin) {
  float NoL = dot(N, L);
  float wrap = clamp((NoL + 0.6) / 1.6, 0.0, 1.0);
  vec3 diff = mix(base * SNOW_DEEP, base, smoothstep(-0.25, 0.65, NoL)) * wrap;
  float through = pow(clamp(dot(V, -normalize(L + N * 0.3)), 0.0, 1.0), 3.0) * thin;
  float spec = 0.05 * pow(max(dot(N, normalize(L + V)), 0.0), 16.0) * max(NoL, 0.0);   // a dull sheen
  return Lc * ((diff + spec) * sh + base * SNOW_DEEP * through * 0.8);
}
// how thin the snow is behind this point (1: thin enough for light to come through)
float thinness(vec3 p, vec3 N) { return clamp(1.0 + (skinD(p - N * 0.12) + skinD(p - N * 0.26)) / 0.38, 0.0, 1.0); }
// glints: ice grains flashing like tiny mirrors. Seed points sit on a jittered 3D grid; where the surface passes near
// one there's a grain, facing a random way, and it flashes when it mirrors the key light (x) or the bright sky (y) into
// the eye (after Wang & Bowles 2016), with a tiny cross of flare. They twinkle as he moves. Where grains would be
// smaller than a couple of pixels, they fade out.
vec2 glints(vec3 p, vec3 N, vec3 V) {
  const float CELL = 0.05;
  float vis = 1.0 - smoothstep(0.18, 0.4, gPix / CELL);
  if (vis <= 0.0) return vec2(0.0);
  vec3 Hk = normalize(uKey + V), Hs = normalize(uUp + V);
  vec3 sr = normalize(cross(V, uUp)), su = cross(sr, V);    // the screen's axes, for the flare
  vec3 c0 = floor(p / CELL - 0.5);
  float r = max(0.2 * CELL, 0.8 * gPix);
  vec2 g = vec2(0.0);
  for (int z = 0; z < 2; z++) for (int y = 0; y < 2; y++) for (int x = 0; x < 2; x++) {
    vec3 c = c0 + vec3(float(x), float(y), float(z));
    vec3 h = hash33(c);
    if (h.x > 0.5) continue;                                     // not every cell holds a grain
    vec3 o = p - (c + 0.2 + 0.6 * hash33(c + 31.7)) * CELL;
    float near = 1.0 - smoothstep(0.4 * r, r, abs(dot(o, N)));  // the surface passes through the grain
    if (near <= 0.0) continue;
    vec2 uv = abs(vec2(dot(o, sr), dot(o, su))) / r;
    float spot = exp(-dot(uv, uv) * 2.0) + 0.5 * (exp(-uv.x * 9.0) * exp(-uv.y * 0.9) + exp(-uv.y * 9.0) * exp(-uv.x * 0.9));
    vec3 f = normalize(N + (hash33(c + 7.3) * 2.0 - 1.0) * 0.6 + 0.07 * sin(uSway * (1.0 + 2.0 * h.y) + h.z * 6.28));
    g += spot * near * vec2(smoothstep(0.955, 0.99, dot(f, Hk)), smoothstep(0.98, 0.996, dot(f, Hs)));
  }
  return g * vis * min(1.0, 0.2 * CELL / r);
}
// the surface: clumps of grains, each a soft little bump round a jittered point of a cell grid (Worley 1996), and a
// fine grain in the colour; only where they're bigger than a pixel, so nothing shimmers
void snowTexture(vec3 p, inout vec3 N, out float grain) {
  const float F = 38.0;
  float fC = 1.0 - smoothstep(0.12, 0.3, gPix * F);
  grain = 0.5;
  if (fC > 0.0) {
    vec3 q = p * F, c0 = floor(q - 0.5), slope = vec3(0.0);
    float hgt = 0.0;
    for (int z = 0; z < 2; z++) for (int y = 0; y < 2; y++) for (int x = 0; x < 2; x++) {
      vec3 c = c0 + vec3(float(x), float(y), float(z));
      vec3 v = q - (c + 0.15 + 0.7 * hash33(c));
      float r = length(v) / 0.62;
      if (r >= 1.0) continue;
      float k = 1.0 - r * r;
      hgt += k * k;
      slope += -4.0 * k * v / 0.3844;                 // the gradient of (1 - r^2)^2
    }
    slope -= N * dot(slope, N);
    N = normalize(N - slope * 0.035 * fC);
    grain += (min(hgt, 1.2) - 0.55) * 0.5 * fC;
  }
  float fF = 1.0 - smoothstep(0.3, 0.9, gPix * 110.0);
  grain += (snoise(p * 110.0 + 5.0, 0.0) - 0.5) * 0.5 * fF;
}
vec3 shadeSnow(vec3 p, vec3 N, vec3 V, Mat m, float ao, float shK, float grain, float thin, vec2 glint) {
  vec3 base = m.alb * mix(SNOW_DEEP, vec3(1.0), clamp(0.92 + 0.6 * (grain - 0.5), 0.0, 1.0));   // gaps between grains: bluer
  float NoV = max(dot(N, V), 1e-3);
  float occ = ao * mix(0.6, 1.0, smoothstep(-0.05, 0.45, p.y + 0.25 * N.y));   // and the floor hides the underside
  vec3 sky = skyIrr(N) * SNOW_SKY * mix(SNOW_DEEP, vec3(1.0), occ) * occ;     // creases fill with blue
  vec3 col = base * sky;
  col += snowLight(uKey, uKeyCol, N, V, base, mix(1.0, shK, smoothstep(-0.1, 0.25, dot(N, uKey))) * mix(0.75, 1.0, occ), thin);
  col += snowLight(uFill, uFillCol, N, V, base, mix(0.5, 1.0, occ), thin);
  col += snowLight(uBack, uBackCol, N, V, base, occ, thin);
  col += sky * pow(1.0 - NoV, 4.0) * 0.25;                                     // brighter toward the edges
  col += uKeyCol * glint.x * shK * 3.0 + vec3(0.8, 0.9, 1.0) * glint.y * occ * 1.4;   // grains flashing
  return mix(col, vec3(0.03, 0.045, 0.07) * (0.5 + sky), m.ink);              // the mouth: a dark pressed line
}
// twigs: matte bark with a fine grain, and frost settled on their upper sides
vec3 shadeBark(vec3 p, vec3 n, vec3 V, vec3 base, float ao, float shK) {
  float g1 = snoise(p * 150.0 + 3.0, log2(max(gPix * 150.0, 1e-6)) + 0.5);
  float g2 = snoise(p * 40.0 + 8.0, log2(max(gPix * 40.0, 1e-6)) + 0.5);
  vec3 alb = base * (0.7 + 0.6 * g2) * (0.85 + 0.3 * g1);
  float frost = smoothstep(0.5, 0.85, dot(n, uUp) + 0.4 * (g2 - 0.5));
  alb = mix(alb, uMain * 0.9, frost);
  vec3 col = alb * (skyIrr(n) * SNOW_SKY * ao + uKeyCol * clamp((dot(n, uKey) + 0.2) / 1.2, 0.0, 1.0) * shK
                    + uFillCol * max(dot(n, uFill), 0.0) * ao + uBackCol * max(dot(n, uBack), 0.0) * 0.6);
  return col + uKeyCol * shK * 0.03 * pow(max(dot(reflect(-V, n), uKey), 0.0), 8.0);
}
#endif
vec3 neutralTone(vec3 color) {   // Khronos PBR Neutral: faithful colour, gentle highlight roll-off
  const float startCompression = 0.8 - 0.04;
  const float desaturation = 0.15;
  float x = min(color.r, min(color.g, color.b));
  float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
  color -= offset;
  float peak = max(color.r, max(color.g, color.b));
  if (peak < startCompression) return color;
  const float d = 1.0 - startCompression;
  float newPeak = 1.0 - d * d / (peak + d - startCompression);
  color *= newPeak / peak;
  float g = 1.0 - 1.0 / (desaturation * (peak - newPeak) + 1.0);
  return mix(color, vec3(newPeak), g);
}
vec3 toSRGB(vec3 c) { return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
#ifdef SNOW
// frost: ice crystals drifting round him, slowly falling and turning, each twinkling now and then. They're drawn over
// the picture where they're in front of him and hidden where they're behind. A crystal is a tiny six-pointed star when
// it's big enough to see; smaller, it's a soft dot whose brightness is scaled to its true size (so it doesn't swell).
vec4 frost(vec3 ro, vec3 rd, float tEnd) {
  vec3 right = normalize(cross(rd, uUp)), up = cross(right, rd);
  vec3 fc = toSRGB(uFrostC);
  vec4 acc = vec4(0.0);
  for (int i = 0; i < 28; i++) {
    float fi = float(i);
    vec3 h = hash33(vec3(fi * 7.31, fi * 1.93 + 2.0, 5.17)), g = hash33(vec3(fi * 3.17 + 9.0, 4.41, fi * 2.71));
    float fall = fract(h.x + uFrostT * (0.02 + 0.025 * g.x));
    float ang = h.y * 6.2832 + uFrostT * (0.22 + 0.18 * g.y);
    float rad = uFrostR * (0.78 + 0.4 * h.z);
    vec3 c = vec3(sin(ang) * rad, mix(2.3, 0.1, fall) + 0.05 * sin(uFrostT * 1.1 + g.z * 6.28), cos(ang) * rad);
    float tc = dot(c - ro, rd);
    if (tc <= 0.0 || tc > tEnd) continue;
    float px = tc * uPix, size = 0.02 + 0.03 * g.z;
    float rr = max(size, px);
    vec3 o = ro + rd * tc - c;
    vec2 uv = vec2(dot(o, right), dot(o, up)) / rr;
    float r = length(uv);
    if (r > 1.5) continue;
    float tw = 0.5 + 0.5 * sin(uFrostT * (2.0 + 3.0 * h.z) + g.x * 6.28);
    tw = 0.35 + 0.65 * tw * tw;
    float fade = smoothstep(0.0, 0.1, fall) * smoothstep(1.0, 0.85, fall);
    float an = atan(uv.y, uv.x) + g.y * 6.28 + uFrostT * 0.3;
    float core = exp(-r * r * 8.0);
    float star = clamp(core + pow(abs(cos(3.0 * an)), 30.0) * smoothstep(1.0, 0.2, r) * 0.9, 0.0, 1.0);
    float k = size / px;
    float a = mix(exp(-r * r * 3.0), star, smoothstep(2.5, 6.0, k)) * min(1.0, k * k) * tw * fade;
    acc.rgb += mix(fc, vec3(1.0), core * tw) * a * (1.0 - acc.a);
    acc.a += a * (1.0 - acc.a);
  }
  return acc;
}
#endif

void main() {
  vec3 ro = uCam;
  vec3 rd = normalize(vPos - uCam);
  rd = mix(rd, vec3(1e-5), step(abs(rd), vec3(1e-5)));
  vec3 t0 = (uBoxMin - ro) / rd, t1 = (uBoxMax - ro) / rd;
  vec3 tl = min(t0, t1), th = max(t0, t1);
  float t = max(max(max(tl.x, tl.y), tl.z), 0.0), tf = min(min(th.x, th.y), th.z);
  if (t >= tf) discard;
#ifdef SNOW
  const float FUZZ = 0.01;   // powdery grains stand off the snow
#else
  const float FUZZ = 0.016;  // how far the fuzz stands off the fabric
#endif
  // 1. trace to the surface, noting the first near miss of the fabric on the way: its fuzzy edge, in front
  bool hit = false;
  float prevD = 1e9, prevT = t, nmD = 1e9, nmT = 0.0;
  for (int i = 0; i < 120; i++) {
    vec3 p = ro + rd * t;
    float ds = skinD(p);
    float d = min(ds, solidD(p));
    float px = t * uPix;
    if (d < 0.3 * px) { hit = true; break; }
    if (nmD > 1e8 && ds > prevD && prevD < FUZZ + 1.5 * px) { nmD = prevD; nmT = prevT; }
    prevD = ds; prevT = t;
    t += max(d * 0.9, 0.3 * px);
    if (t > tf) break;
  }
  vec3 V = -rd;
  vec3 Cp = vec3(0.0);   // premultiplied
  float A = 0.0;
  if (hit) {
    vec3 p = ro + rd * t;
    gPix = t * uPix;
    vec3 sc; float sr;
    if (solid(p, sc, sr) < skinD(p)) {
      vec3 n = solidNormal(p);
      float ao = calcAO(p + n * 0.002, n), sh = softShadow(p + n * 0.01, uKey, 5.0);
#ifdef SNOW
      if (sr > 0.99) Cp = shadeBark(p, n, V, sc, ao, sh); else
#endif
      Cp = shadePlastic(n, V, sc, sr, ao, sh);
    } else {
      Mat m;
      skinM(p, m, true);
      vec3 N = skinNormal(p);
      float ao = calcAO(p, N);
      float sh = softShadow(p + N * 0.012, uKey, 5.0);
      vec3 N0 = N;
#ifdef SNOW
      float grain;
      snowTexture(p, N, grain);
      N = normalize(mix(N, N0, m.ink));
      Cp = shadeSnow(p, N, V, m, ao, sh, grain, thinness(p, N0), glints(p, N, V));
#else
      float grain, crush;
      fabricTexture(p, N, grain, crush);
      N = normalize(mix(N, N0, m.ink));   // embroidery thread is smooth satin: no fabric texture under it
      Cp = shadePlush(p, N, V, m, ao, sh, grain, crush);
#endif
    }
    A = 1.0;
  }
  if (nmD < 1e8) {        // the fuzz: fibres standing off the fabric, growing from the surface below the near miss
    vec3 q = ro + rd * nmT;
    gPix = nmT * uPix;
    vec3 N = skinNormal(q);
    Mat m;
    skinM(q, m, true);
    float x = nmD / (FUZZ + 1.5 * gPix);
    vec3 s = q - N * nmD;
    float detail = smoothstep(0.8, 2.5, FUZZ / gPix);
#ifdef SNOW
    float strands = snoise(s * 160.0 + 7.0, 0.0);   // (powder: grains, not fibres)
    vec3 hc = shadeSnow(q, N, V, m, 0.95, 1.0, 0.5, 0.3, vec2(0.0));
#else
    float strands = snoise(s * 420.0 + 7.0, 0.0);
    vec3 hc = shadePlush(q, N, V, m, 0.95, 1.0, 0.5, 0.5);
#endif
    float cov = (1.0 - smoothstep(0.0, 1.0, x + (strands - 0.5) * 0.9 * x * detail)) * mix(1.0, 0.0, m.ink);
    Cp = hc * cov + Cp * (1.0 - cov);
    A = cov + A * (1.0 - cov);
  }
  vec4 o = vec4(0.0);
  if (A >= 0.003) o = vec4(toSRGB(clamp(neutralTone(Cp / A * uExposure), 0.0, 1.0)) * A, A);
#ifdef SNOW
  vec4 fr = frost(ro, rd, hit ? t : tf);   // the frost, over him where it's in front
  o = fr + o * (1.0 - fr.a);
#endif
  if (o.a < 0.003) discard;
  gl_FragColor = o;
}`;
