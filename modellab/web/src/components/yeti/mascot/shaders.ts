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
uniform float uSway;
varying vec3 vPos;

struct Mat { vec3 alb; float fuzz; float ink; };   // dye colour, fuzz cover (none on thread), embroidery thread
// the fur at a point above the fabric (for a mascot with a real pile: see FUR in RENDER)
struct Fur {
  float gap;    // how far it is to the nearest fur (0 or less: inside the pile)
  float len;    // how deep the pile is here,
  float h;      // ...and how far up it this point is (0: at the fabric, 1: at the tips)
  float top;    // how far up the fibre through this point reaches (fibres differ; 0 where embroidery leaves none)
  float under;  // how much taller the pile round it stands (pile pulled down by stitches lies in a hollow, in the shade)
  vec3 n;       // which way is out
  vec3 root;    // where that fibre is rooted (fibres lean and wander, so not straight below)
  vec3 dir;     // which way it runs here
  vec3 alb;     // its colour here (tips can be paler than roots)
  float fine;   // fibres across one unit of fabric
  float gloss;  // how silky
  float ink;    // embroidery thread on the fabric below (then dir is the way the thread runs)
};

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
  if (lod >= 1.0) return textureLod(uNoise, q / 128.0, lod).r;
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
// Rime, the snow golem: tall and slender, made of packed snow, with long arms and legs, a smooth blank face, two tiny
// dark pebbles for eyes set far apart and only a faint line pressed in for a mouth. His expression never changes; his
// head turns to watch you. The snow and the frost drifting round him are in RENDER.
uniform float uFrostT;   // the frost's clock: faster while he thinks, slower asleep, stopped with reduced motion
uniform float uFrostR;   // how far out it drifts (it puffs out when he nods)
uniform vec3 uFrostC;    // its colour (deeper on a light page, paler on a dark one)
uniform mat3 uHead;      // the head's turn, about NECK
const vec3 NECK = vec3(0.0, 2.14, 0.035), HEAD_C = vec3(0.0, 2.5, 0.06);    // he stoops a little: head forward
const vec3 SHOULDER_L = vec3(-0.215, 1.97, 0.0);
// soft lumps of packed snow (smooth, from sines: the noise texture is filtered in 8 bits, which shows as terraces)
float lumps(vec3 p) {
  vec3 q = p * 8.5;
  float a = sin(q.x + 1.3 * sin(q.y * 0.8 + 0.5)) * sin(q.y * 1.1 + 1.2 * sin(q.z * 0.9 + 2.0)) * sin(q.z * 1.05 + 1.4 * sin(q.x * 0.85 + 1.0));
  q = p * 19.0 + 1.7;
  float b = sin(q.x + 1.2 * sin(q.z * 0.9)) * sin(q.y + 1.3 * sin(q.x * 1.1)) * sin(q.z + 1.1 * sin(q.y * 0.95));
  return 0.0085 * a + 0.0038 * b;
}
// the head, in its own turned space (q from its centre): an egg, a little narrower at the top, smooth in front
float headD(vec3 q) {
  float d = sdRoundCone(vec3(q.x, q.y, q.z / 0.92), vec3(0.0, -0.08, 0.0), vec3(0.0, 0.11, -0.01), 0.215, 0.165) * 0.92;
  // barely a mouth: a faint short line pressed in
  if (q.z > 0.1) d += seam(length(vec2(max(abs(q.x) - 0.028, 0.0), q.y + 0.125)), 0.0022, 0.0045);
  return d;
}
// a long arm from shoulder a to wrist b, bending a little forward at the elbow (raised, the elbow goes out and down,
// the forearm up), ending in a long flat mitten of a hand
float armD(vec3 p, vec3 a, vec3 b, float side) {
  float raised = clamp((b.y - a.y + 0.4) / 0.8, 0.0, 1.0);
  vec3 e = (a + b) * 0.5 + vec3(side * (0.015 + 0.16 * raised), -0.12 * raised, 0.025);
  float d = smin(sdRoundCone(p, a, e, 0.064, 0.053), sdRoundCone(p, e, b, 0.053, 0.043), 0.025);
  vec3 Y = normalize(b - e), Z = normalize(vec3(0.0, 0.0, 1.0) - Y * Y.z), X = cross(Y, Z);
  vec3 v = p - (b + Y * 0.075);
  return smin(d, sdEllipsoid(vec3(dot(v, X), dot(v, Y), dot(v, Z)), vec3(0.03, 0.09, 0.047)), 0.035);
}
float snowD(vec3 p) {
  vec3 q = uHead * (p - NECK) + NECK - HEAD_C;
  float d = headD(q);
  d = smin(d, sdRoundCone(uHead * (p - NECK), vec3(0.0), vec3(0.0, 0.14, 0.02), 0.085, 0.09), 0.07);    // the neck,
  d = smin(d, sdRoundCone(p, vec3(0.0, 1.9, 0.0), NECK, 0.1, 0.085), 0.07);                             // in two halves
  // a lean body: one column of packed snow, a little wider at the chest, stooping forward at the top
  float body = sdRoundCone(p, vec3(0.0, 1.33, 0.0), vec3(0.0, 1.86, 0.025), 0.15, 0.16);
  body = smin(body, sdEllipsoid(p - vec3(0.0, 1.76, 0.02), vec3(0.17, 0.22, 0.13)), 0.1);
  // shoulders that slope down from the neck into the arms
  vec3 sp = vec3(abs(p.x), p.yz);
  body = smin(body, sdRoundCone(sp, vec3(0.0, 2.02, 0.01), vec3(-SHOULDER_L.x, SHOULDER_L.yz), 0.075, 0.066), 0.08);
  d = smin(d, body, 0.07);
  // long thin legs, a little apart and slightly bent, on small feet that point a little outward
  vec3 lp = vec3(abs(p.x), p.y, p.z);
  float leg = smin(sdRoundCone(lp, vec3(0.082, 1.36, 0.0), vec3(0.094, 0.72, 0.025), 0.08, 0.061),
                   sdRoundCone(lp, vec3(0.094, 0.72, 0.025), vec3(0.104, 0.1, 0.0), 0.061, 0.047), 0.025);
  vec3 fp = lp - vec3(0.112, 0.042, 0.05);
  fp.xz = rot2(-0.25) * fp.xz;
  leg = smin(leg, sdEllipsoid(fp, vec3(0.06, 0.046, 0.11)), 0.045);
  d = smin(d, leg, 0.07);
  // long arms: they hang past his hips; the one on the viewer's right waves
  d = smin(d, armD(p, SHOULDER_L, vec3(-0.305, 0.87, 0.05), -1.0), 0.05);
  d = smin(d, armD(p, uArmA, uArmB, 1.0), 0.05);
  // packed by hand: soft lumps everywhere but his face
  float face = smoothstep(0.2, 0.12, length(q.xy)) * smoothstep(0.05, 0.14, q.z);
  d += (1.0 - face) * lumps(p);
  return smax(d, -p.y, 0.02) * 0.8;    // (the lumps steepen the field a little)
}
float skinM(vec3 p, out Mat m, bool full) { m = Mat(uMain, 0.0, 0.0); return snowD(p); }
// two tiny dark pebbles for eyes, pressed into his face (they turn with his head)
float solid(vec3 p, out vec3 col, out float rough) {
  col = vec3(0.022, 0.024, 0.028); rough = 0.32;
  return eyeDomes(uHead * (p - NECK) + NECK - HEAD_C);
}
float casters(vec3 p) { return 1e3; }
`;

export const BLOOM = /* glsl */ `
#define FUR
// Bloom: a round, fluffy white cub with furry sky-blue ears and a tuft of the same long blue fur, modelled on a photo of the real
// plush. A camera and this shape were fitted to the photo's outline, eyes, mouth and ears, and the colours were sampled
// from it. He's the one mascot with a real pile: FUR switches RENDER to draw his fur as a volume of fibres.
const float PILE = 0.05;                         // how far the body's pile stands off its fabric
const vec3 EAR_R = vec3(0.165, 0.165, 0.05);     // an ear's fabric: a thick disc on the head, facing forward,
const float EAR_PILE = 0.075;                    // ...in the tuft's fur, cut shorter
const vec3 TUFT_C = vec3(0.0, 1.73, 0.2);        // the tuft: a small core lying across the crown,
const float TUFT_W = 0.15, TUFT_R = 0.06;        // (a capsule: half its length, and its radius)
const float TUFT_PILE = 0.3;                     // ...and long fibres all round it
const float FACE_R = 0.947;                      // the face is laid out on the body's surface: longitude x this, and height
const float EYE_TILT = 0.17;                     // the eyes lean outward at the top
const vec3 THREAD = vec3(0.061, 0.059, 0.073);    // embroidery thread: a soft black (the tone curve deepens it)
// (the noise is read in a turned frame: its cells would show as squares on a flat part that faces along an axis, as the ears do)
const mat3 TWIST = mat3(0.8, -0.6, 0.0, 0.36, 0.48, -0.8, 0.48, 0.64, 0.6);
// the body's fabric: a superellipse of revolution with a flat base (the photo's outline, less the pile), and which way
// is out (worked out with it, so the pile needs no numeric normals)
float bodyD(vec3 p, out vec3 n) {
  float rho = length(p.xz), hh = p.y - 0.694;
  float w = smoothstep(-0.45, 0.45, hh);
  float e = mix(1.98, 2.33, w), B = mix(0.804, 1.036, w);
  vec2 q = max(vec2(rho, abs(hh) / B), 1e-4);
  vec2 qn = pow(q, vec2(e));
  float r = pow(qn.x + qn.y, 1.0 / e);
  vec2 g = pow(r, 1.0 - e) * (qn / q) / vec2(1.0, B);
  float gl = max(length(g), 1e-3);
  float d = (r - 1.0) / gl + PILE, fl = 0.02 + PILE - p.y;
  float h = clamp(0.5 + 0.5 * (fl - d) / 0.313, 0.0, 1.0);
  n = normalize(mix(vec3(g.x * p.x, g.y * sign(hh) * rho, g.x * p.z) / (gl * max(rho, 1e-4)), vec3(0.0, -1.0, 0.0), h));
  return mix(d, fl, h) + 0.313 * h * (1.0 - h);
}
// the fabric (pile = 0), or the fabric with that share of its pile on it (the fur casts shadows too)
float bloomD(vec3 p, float pile) {
  vec3 n;
  float d = bodyD(p, n) - pile * PILE;
  for (int i = 0; i < 2; i++) {
    vec3 q = uEarM[i] * (p - uEarC[i]);
    d = smin(d, sdEllipsoid(q, EAR_R) - pile * EAR_PILE, 0.04);
  }
  vec3 v = p - TUFT_C;
  v.x -= clamp(v.x, -TUFT_W, TUFT_W);
  return smin(d, length(v) - TUFT_R - pile * TUFT_PILE, 0.1);
}
float skinM(vec3 p, out Mat m, bool full) { m = Mat(uMain, 0.0, 0.0); return bloomD(p, 0.0); }
float pileD(vec3 p) { return bloomD(p, 0.5); }
// the embroidery, on the face's chart: two oval eyes and a small mouth (a short bar, flat below)
vec2 eyeQ(vec2 q, int i) { return rot2(i == 0 ? -EYE_TILT : EYE_TILT) * (q - uEye[i].xy); }   // in an eye's own frame
float barD(vec2 q) {
  vec2 m = q - uNose.xy;
  return max(length(vec2(max(abs(m.x) - uNose.z + uNose.w, 0.0), m.y)) - uNose.w, -0.6 * uNose.w - m.y);
}
float eyesD(vec2 q) { return min(eyeD(uEye[0].xy + eyeQ(q, 0), uEye[0]), eyeD(uEye[1].xy + eyeQ(q, 1), uEye[1])); }
float stitchD(vec2 q) { return min(barD(q), eyesD(q)); }
// how much of a pixel a stitched shape covers, from its distance; 'wide' is how wide the shape is (one thinner than a
// pixel only ever covers that share of it, so a small view shows a faint mouth, not a heavy one)
float inked(float d, float wide) { return clamp(0.5 - d / gPix, 0.0, min(1.0, wide / gPix)); }
// the fur at p: the distance to the fabric, and the pile there
float furM(vec3 p, out Fur f) {
  vec3 n;
  float d = bodyD(p, n);
  // the body: a long white pile that lies down, combed away from the crown
  float len = PILE, lean = 2.0, stray = 0.3, curl = 0.04, grain = 17.0, body = 1.0, tufty = 0.0;
  vec3 pull = normalize(vec3(p.x, 0.0, p.z) * 0.3 - vec3(0.0, 1.0, 0.0)), alb = uMain, tip = uMain;
  f.fine = 80.0; f.gloss = 0.5;
  // the ears: blue all over, in the same fur as the tuft, cut shorter
  for (int i = 0; i < 2; i++) {
    vec3 q = uEarM[i] * (p - uEarC[i]);
    if (dot(q, q) > 0.16) continue;
    float de = sdEllipsoid(q, EAR_R);
    float w = clamp(0.5 + 0.5 * (de - d) / 0.04, 0.0, 1.0), e = 1.0 - w;
    d = mix(de, d, w) - 0.04 * w * e;
    n = mix(n, normalize(q / (EAR_R * EAR_R)) * uEarM[i], e);
    pull = mix(pull, normalize(vec3(q.xy, 0.0) + 1e-4) * uEarM[i], e);
    len = mix(len, EAR_PILE, e);
    lean = mix(lean, 0.35, e); stray = mix(stray, 0.5, e); curl = mix(curl, 0.03, e); grain = mix(grain, 46.0, e);
    alb = mix(alb, uExtra * 0.9, e);
    tip = mix(tip, mix(uExtra, vec3(1.0), 0.4), e);
    f.fine = mix(f.fine, 105.0, e); f.gloss = mix(f.gloss, 0.8, e);
    tufty = max(tufty, e);
    body *= w;
  }
  n = normalize(n);
  vec3 s = p - n * d;                                  // the fabric below this point
  float h = d / len, gap = d - len;
  // the tuft: long, fine, tangled fibres fanning out of a small core on the crown, lying over the head's own fur
  vec3 v = p - TUFT_C;
  if (dot(v, v) < 0.3) {
    vec3 axis = vec3(clamp(v.x, -TUFT_W, TUFT_W), 0.0, 0.0);
    float dt = length(v - axis) - TUFT_R;
    gap = min(gap, dt - TUFT_PILE);
    if (dt < TUFT_PILE && d >= len) {                  // (above the head's pile: the two don't mix)
      n = normalize(v - axis + vec3(0.0, 0.04, 0.0));
      s = TUFT_C + axis + n * 0.2;                     // (its fibres are told apart by their direction from the core)
      h = dt / TUFT_PILE;
      pull = normalize(vec3(v.x * 2.0 + 0.25 * sin(uSway * 0.7), -0.35, v.z * 2.0 + 0.15 * sin(uSway * 0.9 + 1.0)));
      len = TUFT_PILE; lean = 0.35; stray = 0.5; curl = 0.03; grain = 46.0;
      alb = uExtra * 0.9; tip = mix(uExtra, vec3(1.0), 0.4);
      f.fine = 105.0; f.gloss = 0.8;
      body = 0.0; tufty = 1.0;
    }
    d = smin(d, dt, 0.06);
  }
  f.n = n; f.len = len; f.h = h; f.gap = gap; f.ink = 0.0; f.top = 0.0; f.under = 0.0; f.root = s; f.dir = n; f.alb = alb;
  if (gap > 0.0 && d > max(0.01, 0.3 * gPix)) return d;   // (not in the pile: the march only needs the distances)
  // how the pile lies: locks of fibres lean together, turned a little off the way it was combed; curly pile wanders
  float lock = snoise(TWIST * s * grain + 3.0, 0.0);
  vec3 lay = pull - n * dot(pull, n);
  lay = dot(lay, lay) > 1e-5 ? normalize(lay) : normalize(cross(n, vec3(0.31, 0.2, 0.93)));
  float turn = 0.5 * stray * (sin(dot(s, vec3(11.0, 7.0, 9.0))) + sin(dot(s, vec3(-8.0, 13.0, 6.0)) + 1.7));
  vec3 side = cross(n, lay);
  lay = lay * cos(turn) + side * sin(turn);
  side = cross(n, lay);
  float hc = clamp(h, 0.0, 1.0);
  float reach = lean * len * (0.75 + 0.5 * lock);
  float wave = curl * len * sin(hc * 6.0 + lock * 37.0 + dot(s, vec3(53.0, 37.0, 41.0)));
  f.root = TWIST * (s - lay * reach * hc * (0.4 + 0.6 * hc) - side * wave * hc);
  f.dir = normalize(n * len + lay * reach * (0.4 + 1.2 * hc) + side * wave);
  f.top = mix(0.55 + 0.45 * lock, 0.3 + 0.3 * lock + 0.34 * snoise(s * 11.0 + 5.0, 0.0), tufty);   // (the tuft and ears are ragged: their locks differ a lot, and stop short of the longest fibres)
  // the face: embroidery (no pile on it, and the stitches pull the pile down round them) and a blush sprayed on the fur
  if (body > 0.5 && s.z > 0.3 && s.y > 0.4 && s.y < 1.1) {
    vec2 q = vec2(atan(s.x, s.z) * FACE_R, s.y);
    float press = smoothstep(0.0, 0.085, stitchD(q + vec2(0.0, 0.018)));   // (a few fibres from above lie over the edge)
    f.under = 0.8 * f.top * (1.0 - press);
    f.top *= press;
    for (int i = 0; i < 2; i++) {
      vec2 b = rot2(i == 0 ? 0.35 : -0.35) * (q - uBlush[i].xy) / (uBlush[i].w * vec2(1.0, 0.72));
      float k = exp(-0.69 * dot(b, b));
      alb = mix(alb, alb * mix(vec3(1.0), uBlushC, 0.4), k);
      tip = mix(tip, tip * mix(vec3(1.0), uBlushC, 0.85), k);
    }
    if (d < 0.03) {                                    // the thread itself, on the fabric
      float fray = 0.007 * (1.0 - smoothstep(0.5, 1.5, gPix * 300.0)) * (snoise(vec3(q * 300.0, 1.0), 0.0) - 0.5);   // stitched edges are a little ragged
      f.ink = max(inked(eyesD(q) + fray, (uEyeMode > 0.5 ? 0.76 : 2.0) * uEye[0].z), inked(barD(q) + fray, 2.0 * uNose.w));
      if (f.ink > 0.0) {
        // satin stitch: the eyes are filled in rows that zigzag, with a border sewn round the edge; the mouth is
        // sewn across. The thread runs along 'dir', and the rows show as shallow grooves.
        vec3 eu = normalize(vec3(s.z, 0.0, -s.x)), ev = cross(n, eu);
        vec2 td = vec2(0.0, 1.0);
        float groove = 1.0;
        float rows = 1.0 - smoothstep(0.35, 1.0, gPix / 0.0125);
        for (int i = 0; i < 2; i++) {
          vec2 e = eyeQ(q, i);
          float ed = ellipseD(e, vec2(0.0), uEye[i].zw);
          if (ed > 0.004) continue;
          float row = e.y / 0.0125;
          td = normalize(vec2(1.0, fract(e.x / 0.024 + 0.5 * floor(row)) < 0.5 ? 0.55 : -0.55));
          groove = 0.5 + 0.5 * cos(6.2832 * row);
          if (ed > -0.013) {                           // the border: sewn across the edge
            td = normalize(e / (uEye[i].zw * uEye[i].zw));
            groove = 0.5 + 0.5 * cos(atan(e.x, e.y) * 60.0);
          }
          td = rot2(i == 0 ? EYE_TILT : -EYE_TILT) * td;
        }
        if (abs(q.x - uNose.x) < uNose.z + 0.01 && abs(q.y - uNose.y) < uNose.w * 2.0 + 0.01) groove = 0.5 + 0.5 * cos(q.x / 0.007 * 6.2832);
        f.dir = normalize(eu * td.x + ev * td.y);
        f.alb = THREAD * mix(1.0, mix(0.45, 1.25, groove), rows);
        f.gloss = rows;
        f.top = 0.0;
        return d - 0.016 * f.ink;
      }
    }
  }
  f.alb = mix(alb, tip, smoothstep(0.55, 1.0, hc / max(f.top, 0.05)));
  return d;
}
float solid(vec3 p, out vec3 col, out float rough) { col = vec3(0.0); rough = 0.3; return 1e3; }   // (no plastic parts)
float casters(vec3 p) { return 1e3; }
`;

export const RENDER = /* glsl */ `
float skinD(vec3 p) { Mat m; return skinM(p, m, false); }
float solidD(vec3 p) { vec3 c; float r; return solid(p, c, r); }
float mapD(vec3 p) { return min(skinD(p), solidD(p)); }
#ifdef FUR
float shadowD(vec3 p) { return pileD(p); }   // (fur casts its shadow from part-way up the pile)
#else
// (thin casters like glasses frames are thickened a little here, so the shadow march can't step over them in places)
float shadowD(vec3 p) { return min(skinD(p), casters(p) - 0.012); }
#endif
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
#ifdef FUR
// ---- fur, as real as we can: a pile of fibres standing off the fabric, drawn as a volume (Kajiya & Kay 1989). Each
// fibre is a cell of the noise read at the fibre's root, so the pattern runs along the fibre however it leans; it's
// there where the noise is above a level that rises toward the tip, so fibres taper and differ in length. Rays are
// marched through the pile a fibre's width at a time and each fibre met covers part of the pixel, which gives the
// soft outline, the depth and the locks for free. Where fibres are smaller than a pixel their average is used, so
// nothing shimmers.
const float FUR_OPACITY = 1.5;                  // how much of the light a fibre's width of fibre stops
const vec3 FUR_SHADE = vec3(0.8, 0.93, 1.0);    // the tint a pale pile takes in its own shade (the photo's: a cool blue),
const vec3 FUR_FLOOR = vec3(0.7, 0.92, 1.15);   // ...and the light that comes up off the floor (the photo's blue blanket)
// how much of the noise is above a level (its values are near enough normal: mean 0.5, deviation 0.18)
float above(float level) {
  float z = abs(level - 0.5) / 0.18, q = exp(-0.5 * z * z) / (1.64 * z + sqrt(0.76 * z * z + 4.0));
  return level > 0.5 ? q : 1.0 - q;
}
float fibres(Fur f, float h, float lod) {
  if (h >= 1.0) return 0.0;
  float hs = h / max(f.top, 1e-3);
  // locks of fibres, which end at the lock's own height; and a few single fibres that stand a little clear of them
  float level = hs < 1.0 ? 0.3 + 0.62 * hs * hs : 9.0, wisp = f.top > 0.3 ? 0.9 + 0.25 * max(h - f.top, 0.0) : 9.0;
  float mean = 1.0 - (1.0 - above(level)) * (1.0 - above(wisp));
  if (lod >= 1.5) return mean;
  float fine = snoise(f.root * f.fine * 2.9 + 11.0, max(lod + 1.5, 0.0));
  float n = 0.5 + (0.66 * snoise(f.root * f.fine, max(lod, 0.0)) + 0.34 * fine - 0.5) * 1.3;
  return mix(max(smoothstep(level - 0.09, level + 0.09, n), smoothstep(wisp - 0.03, wisp + 0.03, fine)), mean, smoothstep(0.0, 1.5, lod));
}
// one light on a fibre under 'cover' of pile (0: a tip in the open, 1: a root). Direct light thins out with depth,
// faster when it comes in low; what the pile stops comes back scattered, deeper in colour ('again'). The fibre itself
// is lit as a thin cylinder: brightest side-on, with a silky highlight (Kajiya & Kay), and it glows when lit from
// behind (light passes through pale fibres).
vec3 furLight(vec3 L, vec3 Lc, Fur f, vec3 V, float cover, vec3 again, float sh) {
  float NoL = dot(f.n, L);
  float w = 0.45 + 0.4 * lum(f.alb), wrap = clamp((NoL + w) / (1.0 + w), 0.0, 1.0);   // (the paler the pile, the further round the light gets)
  float reach = exp(-1.6 * cover / max(0.7 * NoL + 0.3, 0.1));
  float TL = dot(f.dir, L), TV = dot(f.dir, V);
  float sL = sqrt(max(1.0 - TL * TL, 0.0)), sV = sqrt(max(1.0 - TV * TV, 0.0));
  vec3 diff = f.alb * mix(again, vec3(1.0), reach) * wrap * mix(1.0, sL, 0.3);
  float spec = 0.22 * f.gloss * pow(max(sL * sV - TL * TV, 0.0), 40.0) * reach * wrap;
  float thru = 0.35 * pow(max(dot(-V, L), 0.0), 3.0) * (1.0 - cover) * (1.0 - cover);
  return Lc * (diff + spec + f.alb * thru) * sh;
}
// a fibre's colour: the key light's share comes back in 'key' (the studio's shadow falls on it afterwards, once per
// pixel), the rest is returned
vec3 shadeFur(vec3 p, Fur f, float cover, vec3 V, out vec3 key) {
  vec3 again = 0.85 * pow(f.alb, vec3(0.75)) * FUR_SHADE;
  float occ = mix(0.55, 1.0, smoothstep(-0.05, 0.45, p.y + 0.25 * f.n.y));   // the floor hides the underside
  vec3 env = mix(uGround * FUR_FLOOR, uSky, dot(f.n, uUp) * 0.5 + 0.5);
  key = furLight(uKey, uKeyCol, f, V, cover, again, mix(0.75, 1.0, occ));
  return f.alb * env * occ * mix(again, vec3(1.0), exp(-1.6 * cover))
       + furLight(uFill, uFillCol, f, V, cover, again, mix(0.5, 1.0, occ)) + furLight(uBack, uBackCol, f, V, cover, again, occ);
}
// embroidery: satin thread, glossy along its length (f.dir)
vec3 shadeThread(vec3 p, Fur f, vec3 V, out vec3 key) {
  float TH = dot(f.dir, normalize(uKey + V)), TF = dot(f.dir, normalize(uFill + V)), g = 0.035 * mix(0.5, 1.0, f.gloss);
  key = uKeyCol * max(dot(f.n, uKey), 0.0) * (f.alb + g * pow(max(1.0 - TH * TH, 0.0), 16.0));
  return f.alb * skyIrr(f.n) + uFillCol * max(dot(f.n, uFill), 0.0) * (f.alb + g * pow(max(1.0 - TF * TF, 0.0), 16.0));
}
#endif
#ifdef SNOW
// ---- snow, as real as we can: packed grains of ice, nearly white. Light goes into snow and scatters a long way before
// it comes back out, so the shadow line is soft and the light that crept round it comes back blue (ice absorbs a little
// red over a long path); thin parts glow when lit from behind (Barre-Brisebois & Bouchard 2011); shadows and creases
// fill with the cool light of the sky; and here and there a single grain flashes, mirroring the light into the eye.
const vec3 SNOW_DEEP = vec3(0.6, 0.79, 1.0);   // the colour light comes back after a long way through snow
const vec3 SNOW_SKY = vec3(0.8, 0.89, 1.0);    // the sky's light, cooler than the key
vec3 snowLight(vec3 L, vec3 Lc, vec3 N, vec3 V, vec3 base, float sh, float thin) {
  float NoL = dot(N, L), lit = max(NoL, 0.0);
  float crept = clamp((NoL + 0.45) / 1.45, 0.0, 1.0) * 0.55 - lit * 0.4;          // light that crept past the shadow line
  float through = pow(clamp(dot(V, -normalize(L + N * 0.4)), 0.0, 1.0), 4.0) * thin; // through thin snow, from behind
  float NoV = max(dot(N, V), 0.0);
  float sheen = 0.06 * pow(max(dot(N, normalize(L + V)), 0.0), 10.0) * lit          // a dull, broad sheen
              + 0.18 * pow(1.0 - NoV, 3.0) * pow(clamp(dot(-V, L), 0.0, 1.0), 2.0); // and brighter edges against the light
  return Lc * ((base * lit + sheen) * sh + base * SNOW_DEEP * (max(crept, 0.0) * sh + through * 0.7));
}
// how thin the snow is behind this point (1: thin enough for light to come through)
float thinness(vec3 p, vec3 N) { return clamp(1.0 + (skinD(p - N * 0.05) + skinD(p - N * 0.1)) / 0.15, 0.0, 1.0); }
// glints: single grains flashing like tiny mirrors. Seed points sit on a jittered 3D grid; where the surface passes
// near one there's a grain facing a random way, and it flashes when it mirrors the key light (x) or the bright sky (y)
// into the eye (after Wang & Bowles 2016). They're sparse and small, and they twinkle as he moves; where they'd be
// smaller than about a pixel, they fade out.
vec2 glints(vec3 p, vec3 N, vec3 V) {
  const float CELL = 0.04;
  float vis = 1.0 - smoothstep(0.25, 0.5, gPix / CELL);
  if (vis <= 0.0) return vec2(0.0);
  vec3 Hk = normalize(uKey + V), Hs = normalize(uUp + V);
  vec3 c0 = floor(p / CELL - 0.5);
  float r = max(0.14 * CELL, 0.75 * gPix);
  vec2 g = vec2(0.0);
  for (int z = 0; z < 2; z++) for (int y = 0; y < 2; y++) for (int x = 0; x < 2; x++) {
    vec3 c = c0 + vec3(float(x), float(y), float(z));
    vec3 h = hash33(c);
    if (h.x > 0.6) continue;                                     // not every cell holds a grain
    vec3 o = p - (c + 0.2 + 0.6 * hash33(c + 31.7)) * CELL;
    float spot = 1.0 - smoothstep(0.35 * r, r, length(o));
    if (spot <= 0.0) continue;
    vec3 f = normalize(N + (hash33(c + 7.3) * 2.0 - 1.0) * 0.7 + 0.06 * sin(uSway * (1.0 + 2.0 * h.y) + h.z * 6.28));
    g += spot * vec2(smoothstep(0.965, 0.99, dot(f, Hk)), smoothstep(0.985, 0.997, dot(f, Hs)));
  }
  return g * vis * min(1.0, 0.14 * CELL / r);
}
// the surface, only where it's bigger than a pixel (so nothing shimmers): shallow scoops where the snow was pressed
// together (Worley cells, 1996), then grains, then finer grains standing up, and the odd tiny hole between them
void snowTexture(vec3 p, inout vec3 N, out float grain) {
  grain = 0.5;
  for (int s = 0; s < 3; s++) {
    float F = s == 0 ? 9.0 : s == 1 ? 30.0 : 85.0;
    float fade = 1.0 - smoothstep(0.15, 0.45, gPix * F);
    if (fade <= 0.0) break;
    vec3 q = p * F + float(s) * 17.3, c0 = floor(q - 0.5), slope = vec3(0.0);
    float hgt = 0.0, hole = 0.0;
    for (int z = 0; z < 2; z++) for (int y = 0; y < 2; y++) for (int x = 0; x < 2; x++) {
      vec3 c = c0 + vec3(float(x), float(y), float(z));
      vec3 h = hash33(c);
      vec3 v = q - (c + 0.15 + 0.7 * h);
      float r = length(v) / 0.62;
      if (r >= 1.0) continue;
      float k = 1.0 - r * r;
      hgt += k * k;
      slope += -4.0 * k * v / 0.3844;                     // the gradient of (1 - r^2)^2
      if (s > 0 && h.y < 0.06) hole = max(hole, 1.0 - smoothstep(0.1, 0.35, r));
    }
    slope -= N * dot(slope, N);
    float amp = s == 0 ? -0.03 : s == 1 ? 0.018 : 0.016;   // scoops dip in, grains stand up
    N = normalize(N - slope * amp * fade);
    grain += (s == 0 ? -0.12 : 0.32) * (min(hgt, 1.2) - 0.55) * fade - hole * 0.6 * fade;
  }
}
vec3 shadeSnow(vec3 p, vec3 N, vec3 V, Mat m, float ao, float shK, float grain, float thin, vec2 glint) {
  vec3 base = m.alb * mix(SNOW_DEEP, vec3(1.0), clamp(0.93 + 0.6 * (grain - 0.5), 0.0, 1.0));   // gaps and holes: bluer
  float occ = ao * mix(0.65, 1.0, smoothstep(-0.05, 0.4, p.y + 0.25 * N.y));   // and the floor hides the underside
  vec3 sky = skyIrr(N) * SNOW_SKY * mix(SNOW_DEEP, vec3(1.0), occ) * occ * 0.6;    // creases fill with blue
  vec3 col = base * sky;
  col += snowLight(uKey, uKeyCol, N, V, base, mix(1.0, shK, smoothstep(-0.1, 0.25, dot(N, uKey))) * mix(0.75, 1.0, occ), thin);
  col += snowLight(uFill, uFillCol * 0.5, N, V, base, mix(0.5, 1.0, occ), thin);
  col += snowLight(uBack, uBackCol, N, V, base, occ, thin);
  return col + uKeyCol * glint.x * shK * 5.0 + vec3(0.8, 0.9, 1.0) * glint.y * occ * 2.0;   // grains flashing
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
// frost: diamond dust, tiny ice crystals drifting round him, slowly falling and turning. Most of the time a crystal is a
// faint speck; when it turns to mirror the light it flashes, with a small four-point flare like a camera sees. They're
// drawn over the picture where they're in front of him and hidden where they're behind; one smaller than a pixel is
// a dot with its brightness scaled to its true size (so it doesn't swell).
vec4 frost(vec3 ro, vec3 rd, float tEnd) {
  vec3 right = normalize(cross(rd, uUp)), up = cross(right, rd);
  vec3 fc = toSRGB(uFrostC);
  vec4 acc = vec4(0.0);
  for (int i = 0; i < 28; i++) {
    float fi = float(i);
    vec3 h = hash33(vec3(fi * 7.31, fi * 1.93 + 2.0, 5.17)), g = hash33(vec3(fi * 3.17 + 9.0, 4.41, fi * 2.71));
    float fall = fract(h.x + uFrostT * (0.012 + 0.016 * g.x));
    float ang = h.y * 6.2832 + uFrostT * (0.12 + 0.12 * g.y);
    float rad = uFrostR * (0.42 + 0.5 * h.z);
    vec3 c = vec3(sin(ang) * rad, mix(3.05, 0.1, fall) + 0.04 * sin(uFrostT * 0.9 + g.z * 6.28), cos(ang) * rad);
    float tc = dot(c - ro, rd);
    if (tc <= 0.0 || tc > tEnd) continue;
    float px = tc * uPix, size = 0.008 + 0.012 * g.z;
    float rr = max(size, 0.8 * px);
    vec3 o = ro + rd * tc - c;
    vec2 uv = vec2(dot(o, right), dot(o, up)) / rr;
    if (dot(uv, uv) > 36.0) continue;
    float flash = pow(0.5 + 0.5 * sin(uFrostT * (1.3 + 2.4 * h.z) + g.x * 6.28), 8.0);   // mostly faint, now and then bright
    float fade = smoothstep(0.0, 0.08, fall) * smoothstep(1.0, 0.9, fall);
    float k = min(1.0, (size / px) * (size / px));
    vec2 a2 = abs(uv);
    float flare = (exp(-a2.x * 1.1) * exp(-a2.y * 9.0) + exp(-a2.y * 1.1) * exp(-a2.x * 9.0)) * flash * smoothstep(0.6, 1.5, size / px);
    float core = exp(-dot(uv, uv) * 2.5) * (0.3 + 0.7 * flash);
    float a = clamp(core + flare * 0.6, 0.0, 1.0) * k * fade;
    acc.rgb += mix(fc, vec3(1.0), clamp(core * 1.5, 0.0, 1.0) * (0.4 + 0.6 * flash)) * a * (1.0 - acc.a);
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
  vec3 V = -rd;
  vec3 Cp = vec3(0.0);   // premultiplied
  float A = 0.0;
  bool hit = false;
#ifdef FUR
  // march up to the pile and then through it, a fibre's width at a time: each fibre met on the way covers part of the
  // pixel (front to back), until the pixel is covered or the fabric underneath is reached
  bool inside = false, seen = false;
  vec3 Ck = vec3(0.0), sp = vec3(0.0), sn = vec3(0.0, 1.0, 0.0);   // the key light's share; where the fur's surface is
  vec3 key = vec3(0.0), col = vec3(0.0);
  float lift = 0.0, depth = 0.0;
  for (int i = 0; i < 200; i++) {
    vec3 p = ro + rd * t;
    if (p.y < 0.0) break;                                  // the floor
    gPix = t * uPix;
    Fur f;
    float d = furM(p, f);
    bool fabric = d < 0.3 * gPix;
    if (f.gap > 0.0 && !fabric) {                          // not in the pile yet (or out of it again)
      inside = false;
      t += max(f.gap * 0.8, 0.5 * gPix);
      if (t > tf) break;
      continue;
    }
    float ds = min(max(0.7 * gPix, min(0.3 / f.fine, 0.12 * f.len)), 0.25 * f.len);
    if (!inside && !fabric) { inside = true; t += ds * ign(gl_FragCoord.xy); continue; }   // (so the steps don't show as rings)
    float c = fabric ? 1.0 : fibres(f, f.h, log2(max(gPix, ds) * f.fine) + 0.5);
    if (c > 0.003) {
      float a = 1.0;
      if (fabric) {                                        // the fabric itself: bare only where it's embroidered
        col = shadeFur(p, f, f.top + f.under, V, key);
        if (f.ink > 0.0) { vec3 k2; col = mix(col, shadeThread(p, f, V, k2), f.ink); key = mix(key, k2, f.ink); }
      } else {
        a = 1.0 - exp(-c * ds * f.fine * FUR_OPACITY);
        if (!seen || (1.0 - A) * a > 0.02) col = shadeFur(p, f, max(f.top - f.h, 0.0) + f.under, V, key);   // (a faint fibre takes the light of the one before)
      }
      float A1 = A + (1.0 - A) * a;
      if (!seen || (A < 0.5 && A1 >= 0.5)) { seen = true; sp = p; sn = f.n; lift = max(0.55 - f.h, 0.0) * f.len; depth = d; }
      Cp += (1.0 - A) * a * col; Ck += (1.0 - A) * a * key; A = A1;
      if (fabric) { hit = true; break; }
      if (A > 0.985) break;
    }
    t += min(ds, max(0.9 * d, 0.3 * gPix));
    if (t > tf) break;
  }
  if (seen) {    // the studio's shadow on the key light, and the creases: once per pixel, where the fur's surface is
    float sh = mix(1.0, mix(0.4, 1.0, softShadow(sp + sn * (lift + 0.012), uKey, 3.0)), smoothstep(-0.1, 0.25, dot(sn, uKey)));   // (fur lets light through)
    float ao = calcAO(sp - sn * depth, sn);
    Cp = Cp * mix(0.6, 1.0, ao) + Ck * sh * mix(0.75, 1.0, ao);
    if (A > 0.985) { Cp /= A; A = 1.0; }
  }
#else
#ifdef SNOW
  const float FUZZ = 0.003;  // (snow has a crisp edge: this is only enough to smooth it)
#else
  const float FUZZ = 0.016;  // how far the fuzz stands off the fabric
#endif
  // 1. trace to the surface, noting the first near miss of the fabric on the way: its fuzzy edge, in front
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
  if (hit) {
    vec3 p = ro + rd * t;
    gPix = t * uPix;
    vec3 sc; float sr;
    if (solid(p, sc, sr) < skinD(p)) {
      vec3 n = solidNormal(p);
      float ao = calcAO(p + n * 0.002, n), sh = softShadow(p + n * 0.01, uKey, 5.0);
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
    float strands = 0.5;   // (a clean edge, no fibres)
    vec3 hc = shadeSnow(q, N, V, m, 0.95, 1.0, 0.5, 0.5, vec2(0.0));
#else
    float strands = snoise(s * 420.0 + 7.0, 0.0);
    vec3 hc = shadePlush(q, N, V, m, 0.95, 1.0, 0.5, 0.5);
#endif
    float cov = (1.0 - smoothstep(0.0, 1.0, x + (strands - 0.5) * 0.9 * x * detail)) * mix(1.0, 0.0, m.ink);
    Cp = hc * cov + Cp * (1.0 - cov);
    A = cov + A * (1.0 - cov);
  }
#endif
  vec4 o = vec4(0.0);
  if (A >= 0.003) o = vec4(toSRGB(clamp(neutralTone(Cp / A * uExposure), 0.0, 1.0)) * A, A);
#ifdef SNOW
  vec4 fr = frost(ro, rd, hit ? t : tf);   // the frost, over him where it's in front
  o = fr + o * (1.0 - fr.a);
#endif
  if (o.a < 0.003) discard;
  gl_FragColor = o;
}`;
