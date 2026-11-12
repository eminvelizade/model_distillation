// The mascots' shaders (GLSL ES 3.0, run by three.js's ShaderMaterial). A mascot is a signed distance field,
// ray-marched in one fragment shader, put together from these pieces (see ./engine.ts):
//   COMMON   uniforms and helpers
//   BLOOM or FUZZY   the character: Bloom (written out as a shape), or a make-your-own mascot (lists of parts)
//   SCENE    what every program needs: distances, normals, soft shadows, ambient occlusion, the pile's and the
//            glossy parts' shading, the tone curve
//   then either MAIN_PILE (the body is pile: Bloom, and a make-your-own mascot in plush), or, for a body made of a
//   surface material (./materials/*.glsl), the material library (./materials/_lib.glsl), the material, and MAIN_SURFACE.
// tools/mascot/README.md says how the looks were made.
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
uniform vec3 uFwd;          // the way to the camera along the floor (the studio is laid out round it)
uniform vec3 uBackdrop;     // the page behind the mascot: what a clear body shows through it
uniform float uDark;        // 1 on the dark theme
uniform vec2 uShadow;       // the soft shadow on the floor: its half sizes along x and z
uniform float uTime;        // seconds (it stands still with "reduce motion" on)
uniform float uExposure;
uniform vec3 uMain;         // the palette: the body's colour,
uniform vec3 uAccent;       // an accent,
uniform vec3 uBlushC;       // the blush,
uniform vec3 uExtra;        // and one more
uniform vec4 uEye[2];       // (Bloom) stitched eyes on the face's chart: centre x, y, half width, half height
uniform float uEyeMode;     // 0 open, 1 happy arcs, 2 asleep
uniform float uEyeOpen;     // blink
uniform vec4 uNose;         // (Bloom) the stitched mouth: centre, half size
uniform vec4 uBlush[2];     // centre, radius (0 = none)
uniform vec3 uEarC[2];
uniform mat3 uEarM[2];
uniform float uSway;
varying vec3 vPos;

struct Mat { vec3 alb; float fuzz; float ink; };   // dye colour, fuzz cover (none on thread), embroidery thread
// the pile at a point above the fabric
struct Fur {
  float gap;    // how far it is to the nearest pile (0 or less: inside it)
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
  float kind;   // which fabric this is: 0 the body, 1 knit, 2 a pom, 3 a tuft (in between where two meet)
};

const float PI = 3.14159265;
const vec3 INK = vec3(0.012, 0.011, 0.016);
float gPix = 0.002;     // the pixel footprint where we are
float gDetail = 1.0;    // 0 while a distance is asked for something coarse (a shadow, occlusion): a material's fine relief is left out
float gGrain = 1.0;     // 1: a soft shadow may hide its steps in grain (fine under pile); 0: it takes finer steps instead (a bare surface shows grain)

vec3 hash33(vec3 p3) { p3 = fract(p3 * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yxx) * p3.zyx); }
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
float smin(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return min(a, b) - h * h * k * 0.25; }
float smax(float a, float b, float k) { float h = max(k - abs(a - b), 0.0) / k; return max(a, b) + h * h * k * 0.25; }
mat2 rot2(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }
float sdEllipsoid(vec3 p, vec3 r) { float k0 = length(p / r); float k1 = length(p / (r * r)); return k0 * (k0 - 1.0) / max(k1, 1e-5); }
float sdRoundCone(vec3 p, vec3 a, vec3 b, float r1, float r2) {
  vec3 ba = b - a; float l2 = dot(ba, ba); float rr = r1 - r2; float a2 = l2 - rr * rr; float il2 = 1.0 / l2;
  vec3 pa = p - a; float y = dot(pa, ba); float z = y - l2;
  vec3 xv = pa * l2 - ba * y; float x2 = dot(xv, xv); float y2 = y * y * l2; float z2 = z * z * l2;
  float k = sign(rr) * rr * rr * x2;
  if (sign(z) * a2 * z2 > k) return sqrt(x2 + z2) * il2 - r2;
  if (sign(y) * a2 * y2 < k) return sqrt(x2 + y2) * il2 - r1;
  return (sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}

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

// ---- (Bloom) the stitched face, on its chart
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
  f.n = n; f.len = len; f.h = h; f.gap = gap; f.ink = 0.0; f.top = 0.0; f.under = 0.0; f.root = s; f.dir = n; f.alb = alb; f.kind = 0.0;
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

export const FUZZY = /* glsl */ `
#define FUR
#define FUZZY
// The make-your-own mascots: a body, what it wears (a hat, a scarf, a tuft: short curly pile), and glossy eyes,
// glasses and other solid parts. This one isn't written out as a shape: its parts are lists the engine fills in
// (./looks.ts builds them from the chosen shape, eyes, glasses and extra, and places each on the body by marching
// this same distance field). The body is the same pile in plush; with MAT defined it is a bare surface that the
// chosen material shades (./materials), standing up to MAT_DISPLACE above its smooth shape if the material has relief.
#ifdef MAT
const float BODY_PILE = 0.0;
#else
const float BODY_PILE = 0.05;
#endif
#ifdef MAT_DISPLACE
float matDisplace(vec3 p);   // how far the material's surface stands above the smooth body at p (0 .. MAT_DISPLACE)
#endif
const int NF = 8;        // fur parts
const int NS = 22;       // solid parts
uniform int uNF;
uniform vec4 uFA[NF];    // xyz: a point (the centre, or one end); w: the part's type
uniform vec4 uFB[NF];    // xyz: a second point, a half size or an axis; w: how softly it joins what's before it
uniform vec4 uFR[NF];    // radii; w: which fur (0 body, 1 knit, 2 pom, 3 tuft)
uniform vec3 uFurC[4];   // each fur's dye
uniform int uNS;
uniform vec4 uSA[NS];
uniform vec4 uSB[NS];    // (w: which colour)
uniform vec4 uSR[NS];    // (w: roughness)
uniform vec3 uSolC[6];
uniform vec4 uSolB;      // a ball that holds every solid part (xyz centre, w radius): outside it they needn't be asked
const mat3 TWIST = mat3(0.8, -0.6, 0.0, 0.36, 0.48, -0.8, 0.48, 0.64, 0.6);
vec3 gN = vec3(0.0, 1.0, 0.0);   // which way is out, where it was last worked out (gNat)
vec3 gNat = vec3(1e3);
// the kinds of part: a rounded box, a ring and a disc about an axis, an arc of a ring facing forward (and, from
// COMMON, an ellipsoid and a round cone)
float sdRBox(vec3 q, vec3 b, float r) { vec3 e = abs(q) - b + r; return length(max(e, 0.0)) + min(max(e.x, max(e.y, e.z)), 0.0) - r; }
float sdRing(vec3 q, vec3 ax, float R, float r) { float h = dot(q, ax); return length(vec2(length(q - ax * h) - R, h)) - r; }
float sdDisc(vec3 q, vec3 ax, vec3 R) {
  float h = dot(q, ax);
  vec2 e = abs(vec2(length(q - ax * h), h)) - R.xy + R.z;
  return min(max(e.x, e.y), 0.0) + length(max(e, 0.0)) - R.z;
}
float sdArc(vec3 q, float up, vec3 R) {   // (Quilez's capped torus) up: 1 the arc's middle is up, -1 down; R.z: half its angle
  q.y *= up; q.x = abs(q.x);
  vec2 sc = vec2(sin(R.z), cos(R.z));
  float k = sc.y * q.x > sc.x * q.y ? dot(q.xy, sc) : length(q.xy);
  return sqrt(max(dot(q, q) + R.x * R.x - 2.0 * R.x * k, 0.0)) - R.y;
}
// The kinds of part fur grows on, with which way is out (the distance's slope) worked out alongside: an ellipsoid, a
// round cone, a rounded box, and a layer over the first part between two heights (a hat, a scarf).
float sdEllipsoidG(vec3 q, vec3 r, out vec3 g) {
  vec3 q1 = q / r, q2 = q1 / r;
  float k0 = length(q1), k1 = max(length(q2), 1e-5);
  g = q2 / k1;
  return k0 * (k0 - 1.0) / k1;
}
float sdRoundConeG(vec3 p, vec3 a, vec3 b, float r1, float r2, out vec3 g) {
  vec3 ba = b - a; float l2 = dot(ba, ba); float rr = r1 - r2; float a2 = l2 - rr * rr; float il2 = 1.0 / l2;
  vec3 pa = p - a; float y = dot(pa, ba); float z = y - l2;
  vec3 xv = pa * l2 - ba * y; float x2 = dot(xv, xv); float y2 = y * y * l2; float z2 = z * z * l2;
  float k = sign(rr) * rr * rr * x2;
  if (sign(z) * a2 * z2 > k) { vec3 pb = p - b; g = pb / max(length(pb), 1e-5); return sqrt(x2 + z2) * il2 - r2; }
  if (sign(y) * a2 * y2 < k) { g = pa / max(length(pa), 1e-5); return sqrt(x2 + y2) * il2 - r1; }
  g = xv * (sqrt(a2 * il2) / max(sqrt(x2), 1e-6)) + ba * (rr * il2);
  return (sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}
float sdRBoxG(vec3 q, vec3 b, float r, out vec3 g) {
  vec3 e = abs(q) - b + r, m = max(e, 0.0);
  float l = length(m);
  g = sign(q) * (l > 1e-5 ? m / l : step(e.yzx, e.xyz) * step(e.zxy, e.xyz));
  return l + min(max(e.x, max(e.y, e.z)), 0.0) - r;
}
// (smax, with the first one's share of the slope)
float smaxW(float a, float b, float k, out float w) { float h = max(k - abs(a - b), 0.0) / k; w = a > b ? 1.0 - 0.5 * h : 0.5 * h; return max(a, b) + h * h * k * 0.25; }
float layerD(float d0, float y, float thick, float y0, float y1) { return smax(smax(d0 - thick, y0 - y, 0.035), y - y1, 0.035); }
float layerG(float d0, vec3 g0, float y, float thick, float y0, float y1, out vec3 g) {
  float w;
  float d = smaxW(d0 - thick, y0 - y, 0.035, w);
  g = mix(vec3(0.0, -1.0, 0.0), g0, w);
  d = smaxW(d, y - y1, 0.035, w);
  g = mix(vec3(0.0, 1.0, 0.0), g, w);
  return d;
}
// one part, whatever its kind (the general way; a look that is drawn a lot has its parts written out instead: see
// glslFor in ./looks.ts)
float partD(vec3 p, vec4 A, vec4 B, vec4 R) {
  int ty = int(A.w + 0.5);
  vec3 q = p - A.xyz;
  if (ty == 0) return sdEllipsoid(q, R.xyz);
  if (ty == 1) return sdRoundCone(p, A.xyz, B.xyz, R.x, R.y);
  if (ty == 2) return sdRBox(q, B.xyz, R.x);
  if (ty == 5) return sdArc(q, B.x, R.xyz);
  if (ty == 3) return sdRing(q, B.xyz, R.x, R.y);
  return sdDisc(q, B.xyz, R.xyz);
}
/*CLOTH<*/
float pileOf(float kind) { return kind < 0.5 ? BODY_PILE : kind < 1.5 ? 0.034 : kind < 2.5 ? 0.09 : 0.28; }
// the fabric (with that share of each part's pile on it); and the pile's depth and its fur (rgb: dye, a: which) there
float cloth(vec3 p, float pile, out float len, out vec4 fur) {
  float d = 1e3;
  len = BODY_PILE; fur = vec4(uFurC[0], 0.0);
  float d0 = partD(p, uFA[0], uFB[0], uFR[0]);
  for (int i = 0; i < NF; i++) {
    if (i >= uNF) break;
    float kind = uFR[i].w, li = pileOf(kind);
    float di;
    if (uFA[i].w > 5.5) di = layerD(d0, p.y, uFR[i].x, uFA[i].y, uFB[i].y);   // a layer of knit over the body itself (a hat, a scarf): it fits any shape
    else di = i == 0 ? d0 : partD(p, uFA[i], uFB[i], uFR[i]);
    di -= pile * li;
    vec4 fi = vec4(uFurC[int(kind + 0.5)], kind);
    if (i == 0) { d = di; len = li; fur = fi; continue; }
    float k = uFB[i].w;
    float h = k > 0.0 ? clamp(0.5 + 0.5 * (di - d) / k, 0.0, 1.0) : step(d, di);
    d = mix(di, d, h) - k * h * (1.0 - h);
    len = mix(li, len, h); fur = mix(fi, fur, h);
  }
#ifdef MAT_DISPLACE
  if (gDetail > 0.5 && fur.a < 0.5 && d < MAT_DISPLACE + 0.02) d -= matDisplace(p) * (1.0 - 2.0 * fur.a);   // the material's relief, on the body only
#endif
  return d;
}
// the smooth fabric (no pile, no relief), with which way is out. The parts are lists here, so there's no formula for
// it: it comes from four more readings of the distance, and only near a surface. The pile is thin beside the body's
// curve, so one reading serves a stretch of the ray through it.
float clothN(vec3 p, out float len, out vec4 fur, out vec3 n) {
  float detail = gDetail;
  gDetail = 0.0;
  float d = cloth(p, 0.0, len, fur);
  n = gN;
#ifdef MAT_DISPLACE
  float far = max(len, 0.01) + MAT_DISPLACE + 1.5 * gPix;
#elif defined(MAT)
  float far = max(len, 0.01) + 1.5 * gPix;
#else
  float far = max(len, max(0.01, 0.3 * gPix));
#endif
  if (d > far) { gNat = vec3(1e3); gDetail = detail; return d; }
  vec3 dn = p - gNat;
  if (dot(dn, dn) > 0.0009) {
    const vec2 k = vec2(1.0, -1.0);
    const float e = 0.004;
    float l2; vec4 f2;
    gN = normalize(k.xyy * cloth(p + k.xyy * e, 0.0, l2, f2) + k.yyx * cloth(p + k.yyx * e, 0.0, l2, f2)
                 + k.yxy * cloth(p + k.yxy * e, 0.0, l2, f2) + k.xxx * cloth(p + k.xxx * e, 0.0, l2, f2));
    gNat = p;
  }
  n = gN;
  gDetail = detail;
  return d;
}
/*>CLOTH*/
// which way is out of the smooth body at p, wherever p is (no shortcuts)
vec3 bodyNormal(vec3 p) {
  float l; vec4 f; vec3 n;
  float px = gPix;
  gPix = 1e3; gNat = vec3(1e3);
  clothN(p, l, f, n);
  gPix = px; gNat = vec3(1e3);
  return n;
}
float skinM(vec3 p, out Mat m, bool full) { float l; vec4 f; m = Mat(uMain, 0.0, 0.0); return cloth(p, 0.0, l, f); }
float pileD(vec3 p) { float l; vec4 f; return cloth(p, 0.5, l, f); }
// the fur at p: a short pile of curly fibres that lie every which way, in small whorls (like the pile of a soft toy)
float furM(vec3 p, out Fur f) {
  float len; vec4 fur; vec3 n;
  float d = clothN(p, len, fur, n);
  f.len = len; f.h = d / max(len, 1e-4); f.gap = d - len; f.ink = 0.0; f.top = 0.0; f.under = 0.0;
  f.n = n; f.root = p; f.dir = n; f.alb = fur.rgb; f.fine = 62.0; f.gloss = 0.3; f.kind = fur.a;
  if (f.gap > 0.0 && d > max(0.01, 0.3 * gPix)) return d;   // (not in the pile: the march only needs the distances)
#ifdef MAT
  if (fur.a < 0.5) return d;                                // (the bare body: its material shades it, not the pile)
#endif
  vec3 s = p - n * d;                                  // the fabric below this point
  float hc = clamp(f.h, 0.0, 1.0), kind = fur.a;
  vec3 t1 = normalize(cross(n, abs(n.y) < 0.92 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0))), t2 = cross(n, t1);
  if (kind > 2.5) {        // a tuft: long, fine fibres fanning out of a small core, drooping a little, swaying
    s = s + n * 0.14;      // (told apart by their direction from the core)
    float lock = snoise(TWIST * s * 46.0 + 3.0, 0.0);
    vec3 pull = normalize(vec3(n.x * 2.0 + 0.25 * sin(uSway * 0.7), -0.35, n.z * 2.0 + 0.15 * sin(uSway * 0.9 + 1.0)));
    vec3 lay = pull - n * dot(pull, n);
    lay = dot(lay, lay) > 1e-5 ? normalize(lay) : t1;
    float reach = 0.35 * len * (0.75 + 0.5 * lock);
    f.root = TWIST * (s - lay * reach * hc * (0.4 + 0.6 * hc));
    f.dir = normalize(n * len + lay * reach * (0.4 + 1.2 * hc));
    f.top = 0.3 + 0.3 * lock + 0.34 * snoise(s * 11.0 + 5.0, 0.0);
    f.fine = 105.0; f.gloss = 0.8;
    f.alb = mix(fur.rgb * 0.9, mix(fur.rgb, vec3(1.0), 0.35), smoothstep(0.55, 1.0, hc / max(f.top, 0.05)));
    return d;
  }
  // which way the pile lies: it turns from whorl to whorl, and each lock a little more
  // A short plush pile lies in small patches, each combed its own way, a few strands side by side. A patch is a cell of
  // a wobbly grid; inside it the strands are the noise stretched along the way the patch lies.
  float knit = step(0.5, kind) * step(kind, 1.5), pom = step(1.5, kind);
  float grain = mix(25.0, 31.0, knit);
  vec3 q = TWIST * s * grain;
  q += 1.5 * (vec3(snoise(q * 0.47 + 3.0, 0.0), snoise(q * 0.47 + 17.0, 0.0), snoise(q * 0.47 + 41.0, 0.0)) - 0.5);   // (the grid wobbles, so patches aren't square)
  vec3 cell = floor(q), hsh = hash33(cell + 0.5);
  vec3 c0 = (cell + 0.5) * TWIST / grain;                    // the patch's middle (TWIST is a rotation: this undoes it)
  float ang = 6.2832 * hsh.x, lock = hsh.y;
  vec3 lay = t1 * cos(ang) + t2 * sin(ang), side = cross(n, lay);
  float along = dot(s - c0, lay);
  float reach = mix(1.25, 0.8, pom) * len * (0.75 + 0.5 * lock);
  vec3 root = s - lay * reach * hc * (0.4 + 0.6 * hc) - side * 0.0045 * sin(along * 85.0 + hsh.z * 6.2832);   // (strands bend a little)
  root -= lay * dot(root - c0, lay) * (1.0 - 1.0 / mix(6.5, 3.0, pom));   // stretched along the lay: strands, not grains
  f.root = TWIST * root;
  f.dir = normalize(n * len + lay * reach * (0.4 + 1.2 * hc));
  f.top = 0.82 + 0.18 * lock;                  // (a sheared pile: its fibres are all about as long)
  f.fine = mix(175.0, 190.0, knit);
  f.gloss = 0.08;
  f.alb = mix(fur.rgb, vec3(1.0), 0.02 * smoothstep(0.35, 1.0, hc / max(f.top, 0.05)));   // (the tips scatter a trace of white light; the dye stays pure)
  return d;
}
/*SOLID<*/
// the solid parts: glossy eyes, glasses, headphones and the like
float solid(vec3 p, out vec3 col, out float rough) {
  float d = 1e3;
  col = INK; rough = 0.2;
  for (int i = 0; i < NS; i++) {
    if (i >= uNS) break;
    float di = partD(p, uSA[i], uSB[i], uSR[i]);
    if (di < d) { d = di; col = uSolC[int(uSB[i].w + 0.5)]; rough = uSR[i].w; }
  }
  return d;
}
/*>SOLID*/
float casters(vec3 p) { vec3 c; float r; return solid(p, c, r); }
// The march asks for the solid parts at every step, and only needs them where it's near them: well outside the ball
// that holds them all, its distance to the ball will do. (Only the march: a shadow measures how near its ray passes,
// and would take the ball for something in the light's way.)
float solidNear(vec3 p, out vec3 col, out float rough) {
  float far = length(p - uSolB.xyz) - uSolB.w;
  if (far > 0.06) { col = INK; rough = 0.2; return far; }
  return solid(p, col, rough);
}
`;

export const SCENE = /* glsl */ `
float skinD(vec3 p) { Mat m; return skinM(p, m, false); }
float solidD(vec3 p) { vec3 c; float r; return solid(p, c, r); }
float mapD(vec3 p) { return min(skinD(p), solidD(p)); }
#ifdef FUZZY
// (thin casters like glasses frames are thickened a little here, so the shadow march can't step over them in places)
float shadowD(vec3 p) { return min(pileD(p), casters(p) - 0.012); }
#else
float shadowD(vec3 p) { return pileD(p); }   // (fur casts its shadow from part-way up the pile)
#endif
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
#ifdef FUZZY
  t += 0.03 * ign(gl_FragCoord.xy) * gGrain;   // (a hat's brim shades a flat face: without this its penumbra shows the march's steps as rings)
#endif
  float lo = mix(0.006, 0.012, gGrain), hi = mix(0.1, 0.2, gGrain);
  for (int i = 0; i < 56; i++) {
    if (i >= 32 && gGrain > 0.5) break;
    float h = shadowD(ro + rd * t);
    float y = h * h / (2.0 * ph);
    float d = sqrt(max(h * h - y * y, 0.0));
    res = min(res, k * d / max(0.0, t - y));
    ph = h;
    t += clamp(h, lo, hi);
    if (res < 0.003 || t > 2.6) break;
  }
  res = clamp(res, 0.0, 1.0);
  return res * res * (3.0 - 2.0 * res);
}

// ---- lobes for fabric: a fuzz layer's sheen (Estevez & Kulla's "Charlie" distribution, with Neubelt's visibility)
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

// ---- the glossy parts (eyes, glasses, headphones): plastic lit by the studio
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
// ---- fur, as real as we can: a pile of fibres standing off the fabric, drawn as a volume (Kajiya & Kay 1989). Each
// fibre is a cell of the noise read at the fibre's root, so the pattern runs along the fibre however it leans; it's
// there where the noise is above a level that rises toward the tip, so fibres taper and differ in length. Rays are
// marched through the pile a fibre's width at a time and each fibre met covers part of the pixel, which gives the
// soft outline, the depth and the locks for free. Where fibres are smaller than a pixel their average is used, so
// nothing shimmers.
const float FUR_OPACITY = 1.5;                  // how much of the light a fibre's width of fibre stops
#ifdef FUZZY
const vec3 FUR_SHADE = vec3(1.0);               // (a dyed pile takes its own colour in the shade, deeper)
const vec3 FUR_FLOOR = vec3(1.0);
#else
const vec3 FUR_SHADE = vec3(0.8, 0.93, 1.0);    // the tint a pale pile takes in its own shade (the photo's: a cool blue),
const vec3 FUR_FLOOR = vec3(0.7, 0.92, 1.15);   // ...and the light that comes up off the floor (the photo's blue blanket)
#endif
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
#ifdef FUZZY
  if (f.fine > 120.0) {   // a short curly pile: strands of even thickness that end together, and no stray single fibres (a tuft has both)
    level = hs < 1.0 ? 0.47 + 0.2 * hs * hs : 9.0;
    wisp = 9.0;
  }
#endif
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
#ifdef FUZZY
  float reach = exp(-1.05 * cover / max(0.7 * NoL + 0.3, 0.1));   // (a short pile is open: more light gets down into it)
#else
  float reach = exp(-1.6 * cover / max(0.7 * NoL + 0.3, 0.1));
#endif
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
#ifdef FUZZY
  vec3 again = 0.92 * pow(f.alb, vec3(0.5));   // (an open pile: the light that comes back out of it is less deep in colour)
#else
  vec3 again = 0.85 * pow(f.alb, vec3(0.75)) * FUR_SHADE;
#endif
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
`;

// The body is pile (Bloom, and a make-your-own mascot in plush).
export const MAIN_PILE = /* glsl */ `
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
  // march up to the pile and then through it, a fibre's width at a time: each fibre met on the way covers part of the
  // pixel (front to back), until the pixel is covered or the fabric underneath is reached
  bool inside = false, seen = false;
  vec3 Ck = vec3(0.0), sp = vec3(0.0), sn = vec3(0.0, 1.0, 0.0);   // the key light's share; where the fur's surface is
  vec3 key = vec3(0.0), col = vec3(0.0);
  float lift = 0.0, depth = 0.0;
#ifdef FUZZY
  vec3 sAt = vec3(0.0), sCol = vec3(0.0);   // a solid part (a glossy eye, glasses) behind the fibres met so far: where, its colour,
  float sRough = 0.0, As = 0.0;             // ...its roughness, and how much of the pixel is left for it
#endif
  for (int i = 0; i < 200; i++) {
    vec3 p = ro + rd * t;
    if (p.y < 0.0) break;                                  // the floor
    gPix = t * uPix;
#ifdef FUZZY
    vec3 sc; float sr;
    float sd = solidNear(p, sc, sr);
    if (sd < 0.3 * gPix) { sAt = p; sCol = sc; sRough = sr; As = 1.0 - A; hit = true; break; }   // (lit below, once: not on every step)
#endif
    Fur f;
    float d = furM(p, f);
    bool fabric = d < 0.3 * gPix;
    if (f.gap > 0.0 && !fabric) {                          // not in the pile yet (or out of it again)
      inside = false;
#ifdef FUZZY
      t += max(min(f.gap * 0.8, sd * 0.9), 0.3 * gPix);
#else
      t += max(f.gap * 0.8, 0.5 * gPix);
#endif
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
#ifdef FUZZY
    t += min(min(ds, max(0.9 * d, 0.3 * gPix)), max(0.9 * sd, 0.3 * gPix));
#else
    t += min(ds, max(0.9 * d, 0.3 * gPix));
#endif
    if (t > tf) break;
  }
  if (seen) {    // the studio's shadow on the key light, and the creases: once per pixel, where the fur's surface is
    float sh = mix(1.0, mix(0.4, 1.0, softShadow(sp + sn * (lift + 0.012), uKey, 3.0)), smoothstep(-0.1, 0.25, dot(sn, uKey)));   // (fur lets light through)
    float ao = calcAO(sp - sn * depth, sn);
    Cp = Cp * mix(0.6, 1.0, ao) + Ck * sh * mix(0.75, 1.0, ao);
    if (A > 0.985) { Cp /= A; A = 1.0; }
  }
#ifdef FUZZY
  if (As > 0.0) {
    vec3 n = solidNormal(sAt);
    Cp += As * shadePlastic(n, V, sCol, sRough, calcAO(sAt + n * 0.002, n), softShadow(sAt + n * 0.01, uKey, 5.0));
    A = min(1.0, A + As);
  }
#endif
  vec4 o = vec4(0.0);
  if (A >= 0.003) o = vec4(toSRGB(clamp(neutralTone(Cp / A * uExposure), 0.0, 1.0)) * A, A);
  if (o.a < 0.003) discard;
  gl_FragColor = o;
}`;


// The body is a surface: the chosen material shades it (./materials: matShade). What it wears is still pile (PILE is
// defined when it wears any), and its eyes and glasses are still glossy solid parts.
export const MAIN_SURFACE = /* glsl */ `
#ifndef MAT_STEP
#define MAT_STEP 0.9   // the share of the distance a step toward the body takes (a material with steep, thin relief asks for less)
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
  // Front to back along the ray: pile (of what the body wears) covers part of the pixel as it goes; a solid part or
  // the body ends it. Each of those two is lit once, after the march, not on every step.
  vec3 sAt = vec3(0.0), sCol = vec3(0.0);   // a solid part: where, its colour,
  float sRough = 0.0, As = 0.0;             // ...its roughness, and how much of the pixel is left for it
  vec3 bAt = vec3(0.0);                     // the body: where,
  float bT = 0.0, Ab = 0.0;                 // ...how far along the ray, and how much of the pixel is left for it
  float lastE = 1e9, lastT = 0.0, nearE = 1e9, nearT = 0.0;   // how near the ray came to the body (in pixels) before leaving it again:
  bool missed = false;                                        // ...the body's edge covers part of such a pixel
  float sLastE = 1e9, sLastT = 0.0, sNearE = 1e9, sNearT = 0.0, sLastRough = 0.2, sNearRough = 0.2;   // the same for a solid part
  vec3 sLastCol = vec3(0.0), sNearCol = vec3(0.0);
  bool sMissed = false;
  gGrain = 0.0;
#ifdef PILE
  bool inside = false, seen = false;
  vec3 Ck = vec3(0.0), sp = vec3(0.0), sn = vec3(0.0, 1.0, 0.0);   // the key light's share; where the pile's surface is
  vec3 key = vec3(0.0), col = vec3(0.0);
  float lift = 0.0, depth = 0.0;
#endif
  for (int i = 0; i < 200; i++) {
    vec3 p = ro + rd * t;
    if (p.y < 0.0) break;                                  // the floor
    gPix = t * uPix;
    vec3 sc; float sr;
    float sd = solidNear(p, sc, sr);
    float se = sd / gPix;
    if (se < 0.3) { sAt = p; sCol = sc; sRough = sr; As = 1.0 - A; break; }
    if (!sMissed && se > sLastE && sLastE < 1.0) { sMissed = true; sNearE = sLastE; sNearT = sLastT; sNearCol = sLastCol; sNearRough = sLastRough; }
    sLastE = se; sLastT = t; sLastCol = sc; sLastRough = sr;
#ifdef PILE
    Fur f;
    float d = furM(p, f);
    float kind = f.kind;
#ifdef MAT_DISPLACE
    if (kind < 0.5 && d < MAT_DISPLACE + 0.02) d -= matDisplace(p) * (1.0 - 2.0 * kind);   // (furM's distance is to the smooth body)
#endif
#else
    float len; vec4 fk;
    float d = cloth(p, 0.0, len, fk);                      // (with the material's relief, if it has any)
    float kind = fk.a;
#endif
    if (kind < 0.5) {                                      // the body, or the way to it
      float e = d / gPix;
      if (e < 0.3) { bAt = p; bT = t; Ab = 1.0 - A; break; }
      if (!missed && e > lastE && lastE < 1.0) { missed = true; nearE = lastE; nearT = lastT; }
      lastE = e; lastT = t;
#ifdef PILE
      inside = false;
#endif
      t += max(min(d * MAT_STEP, sd * 0.9), 0.3 * gPix);
      if (t > tf) break;
      continue;
    }
#ifdef PILE
    lastE = 1e9;
    bool fabric = d < 0.3 * gPix;
    if (f.gap > 0.0 && !fabric) {                          // not in the pile yet (or out of it again)
      inside = false;
      t += max(min(f.gap * 0.8, sd * 0.9), 0.3 * gPix);
      if (t > tf) break;
      continue;
    }
    float ds = min(max(0.7 * gPix, min(0.3 / f.fine, 0.12 * f.len)), 0.25 * f.len);
    if (!inside && !fabric) { inside = true; t += ds * ign(gl_FragCoord.xy); continue; }   // (so the steps don't show as rings)
    float c = fabric ? 1.0 : fibres(f, f.h, log2(max(gPix, ds) * f.fine) + 0.5);
    if (c > 0.003) {
      float a = 1.0;
      if (fabric) col = shadeFur(p, f, f.top + f.under, V, key);
      else {
        a = 1.0 - exp(-c * ds * f.fine * FUR_OPACITY);
        if (!seen || (1.0 - A) * a > 0.02) col = shadeFur(p, f, max(f.top - f.h, 0.0) + f.under, V, key);   // (a faint fibre takes the light of the one before)
      }
      float A1 = A + (1.0 - A) * a;
      if (!seen || (A < 0.5 && A1 >= 0.5)) { seen = true; sp = p; sn = f.n; lift = max(0.55 - f.h, 0.0) * f.len; depth = d; }
      Cp += (1.0 - A) * a * col; Ck += (1.0 - A) * a * key; A = A1;
      if (fabric || A > 0.985) break;
    }
    t += min(min(ds, max(0.9 * d, 0.3 * gPix)), max(0.9 * sd, 0.3 * gPix));
    if (t > tf) break;
#endif
  }
  gDetail = 0.0;   // (the pile's and the solid parts' shadows and creases don't need the material's fine relief)
#ifdef PILE
  if (seen) {      // the studio's shadow on the key light, and the creases: once per pixel, where the pile's surface is
    gGrain = 1.0;
    float sh = mix(1.0, mix(0.4, 1.0, softShadow(sp + sn * (lift + 0.012), uKey, 3.0)), smoothstep(-0.1, 0.25, dot(sn, uKey)));
    gGrain = 0.0;
    float ao = calcAO(sp - sn * depth, sn);
    Cp = Cp * mix(0.6, 1.0, ao) + Ck * sh * mix(0.75, 1.0, ao);
    if (A > 0.985) { Cp /= A; A = 1.0; }
  }
#endif
  if (As > 0.0) {                           // a glossy part: it mirrors the same studio the body's material does
    vec3 n = solidNormal(sAt);
    Cp += As * shade(sAt, n, V, surf(sCol, max(sRough, 0.04)), calcAO(sAt + n * 0.002, n), softShadow(sAt + n * 0.01, uKey, 5.0));
    A = min(1.0, A + As);
  }
  gDetail = 1.0;
  if (Ab <= 0.0 && As <= 0.0 && missed) {   // nothing was met, but the ray passed within a pixel of the body
    bT = nearT; bAt = ro + rd * nearT; Ab = (1.0 - A) * clamp((1.0 - nearE) / 0.7, 0.0, 1.0);
  }
  if (Ab > 0.0) {                           // the body: its material's light toward the eye, and how much of the page it hides
    gPix = bT * uPix;
    vec4 m = matShade(bAt, bodyNormal(bAt), V, bT);
    Cp += Ab * m.a * m.rgb; A += Ab * m.a;
  }
  if (sMissed) {                            // the ray passed within a pixel of a solid part on its way: that part's edge lies over the rest
    float cov = clamp((1.0 - sNearE) / 0.7, 0.0, 1.0);
    vec3 pe = ro + rd * sNearT;
    gDetail = 0.0;
    vec3 c = shade(pe, solidNormal(pe), V, surf(sNearCol, max(sNearRough, 0.04)), 1.0, 1.0);
    gDetail = 1.0;
    Cp = c * cov + Cp * (1.0 - cov); A = cov + A * (1.0 - cov);
  }
  vec4 o = vec4(0.0);
  if (A >= 0.003) o = vec4(toSRGB(clamp(neutralTone(Cp / A * uExposure), 0.0, 1.0)) * A, A);
  if (o.a < 0.003) discard;
  gl_FragColor = o;
}`;
