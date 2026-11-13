// The make-your-own mascots. A look (shape, colour, eyes, glasses, extra) becomes two lists of parts for the FUZZY
// shader: fur parts (the body, a hat, a scarf) and solid parts (eyes, glasses, headphones). Every part is placed by
// solving against the body's own surface, with the same distance functions the shader uses, so any shape takes any
// eyes, glasses or extra without a table of hand-set positions.
import type { Look } from "../mascots";
import { COLOURS } from "../mascots";

type V3 = [number, number, number];
/** One part. ty 0: ellipsoid (a centre, r radii); 1: round cone (a, b its ends; r[0], r[1] their radii); 2: rounded
 *  box (a centre, b half size, r[0] corner); 3: ring about the axis b (r[0] radius, r[1] thickness); 4: disc about the
 *  axis b (r[0] radius, r[1] half height, r[2] rounding); 5: an arc of a ring facing forward (b[0]: 1 its middle is
 *  up, -1 down; r[0] radius, r[1] thickness, r[2] half its angle); 6: a layer r[0] thick over the first fur part, from
 *  the height a[1] up to b[1]. k: how softly a fur part joins what's before it.
 *  fur: 0 body, 1 knit, 2 pom, 3 tuft. col: a solid part's colour (SOLID); rough: its roughness. */
export type Part = { ty: number; a: V3; b?: V3; r: V3; k?: number; fur?: number; col?: number; rough?: number };
export const SOLID = { ink: 0, white: 1, accent: 2, dark: 3, leaf: 4, soft: 5 } as const;
export const PILE = [0.05, 0.034, 0.09, 0.28];   // how far each fur stands off its fabric (as in the shader)
/** A body in a surface material has no pile. It is grown by this much instead, so its surface lies where the pile's
 *  tips would be: every look keeps its size, and its eyes and what it wears sit as they do on plush. */
export const SKIN = 0.045;
/** How deep the body's pile is in the materials that are pile (the others are bare surfaces). A body in a short pile
 *  is grown to make up the difference, so every material is the same size on screen. */
export const NAP: Record<string, number> = { plush: 0.056, cotton: 0.026, boucle: 0.06 };
const NAP_FULL = 0.05;
export const MAX_FUR = 8, MAX_SOLID = 22;
export const PARKED = -99;   // the height a solid part that isn't showing is put at (an eye's unused places)

// ---------------------------------------------------------------- the same distance functions as the shader
const len = (x: number, y: number, z = 0) => Math.hypot(x, y, z);
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));
function partD(p: V3, q: Part): number {
  const [ax, ay, az] = q.a, x = p[0] - ax, y = p[1] - ay, z = p[2] - az, r = q.r;
  if (q.ty === 0) {
    const k0 = len(x / r[0], y / r[1], z / r[2]), k1 = len(x / (r[0] * r[0]), y / (r[1] * r[1]), z / (r[2] * r[2]));
    return (k0 * (k0 - 1)) / Math.max(k1, 1e-5);
  }
  if (q.ty === 1) {   // (Quilez's round cone)
    const b = q.b!, bx = b[0] - ax, by = b[1] - ay, bz = b[2] - az, l2 = bx * bx + by * by + bz * bz, rr = r[0] - r[1];
    const a2 = l2 - rr * rr, il2 = 1 / l2, yy = x * bx + y * by + z * bz, zz = yy - l2;
    const cx = x * l2 - bx * yy, cy = y * l2 - by * yy, cz = z * l2 - bz * yy, x2 = cx * cx + cy * cy + cz * cz;
    const y2 = yy * yy * l2, z2 = zz * zz * l2, k = Math.sign(rr) * rr * rr * x2;
    if (Math.sign(zz) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - r[1];
    if (Math.sign(yy) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - r[0];
    return (Math.sqrt(x2 * a2 * il2) + yy * rr) * il2 - r[0];
  }
  if (q.ty === 2) {
    const b = q.b!, ex = Math.abs(x) - b[0] + r[0], ey = Math.abs(y) - b[1] + r[0], ez = Math.abs(z) - b[2] + r[0];
    return len(Math.max(ex, 0), Math.max(ey, 0), Math.max(ez, 0)) + Math.min(Math.max(ex, ey, ez), 0) - r[0];
  }
  const b = q.b!, h = x * b[0] + y * b[1] + z * b[2], rho = len(x - b[0] * h, y - b[1] * h, z - b[2] * h);
  if (q.ty === 3) return len(rho - r[0], h) - r[1];
  const ex = Math.abs(rho) - r[0] + r[2], ey = Math.abs(h) - r[1] + r[2];
  return Math.min(Math.max(ex, ey), 0) + len(Math.max(ex, 0), Math.max(ey, 0)) - r[2];
}
/** The fabric of the fur parts (their smooth union), with `pile` of each one's fur on it. */
function fabric(parts: Part[], p: V3, pile = 0): number {
  let d = 1e3;
  parts.forEach((q, i) => {
    const di = partD(p, q) - pile * PILE[q.fur ?? 0], k = q.k ?? 0;
    if (i === 0) { d = di; return; }
    if (k <= 0) { d = Math.min(d, di); return; }
    const h = clamp(0.5 + (0.5 * (di - d)) / k, 0, 1);
    d = di + (d - di) * h - k * h * (1 - h);
  });
  return d;
}
/** Where a ray from `from` along the unit direction `dir` meets the fabric with its full pile: the distance, or null. */
function meet(parts: Part[], from: V3, dir: V3, far = 6): number | null {
  let t = 0;
  for (let i = 0; i < 96 && t < far; i++) {
    const d = fabric(parts, [from[0] + dir[0] * t, from[1] + dir[1] * t, from[2] + dir[2] * t], 1);
    if (d < 0.0008) return t;
    t += Math.max(d * 0.9, 0.0008);
  }
  return null;
}

// ---------------------------------------------------------------- a look's parts, written out
const f = (x: number) => (Number.isInteger(x) ? `${x}.0` : `${+x.toFixed(5)}`);

/** GLSL for cloth(), clothN() and solid() with these parts written out one after another, each as the kind it is. The
 *  numbers still come from the uniform lists (so eyes can blink and glance); only the kinds, the furs and how softly
 *  parts join are fixed in the code. Written out, each part also gives which way is out by formula, where the general
 *  lists need four more readings of the whole shape for it. */
export function glslFor(fur: Part[], solid: Part[]): { cloth: string; solid: string } | null {
  if (fur.some((q) => q.ty > 2 && q.ty !== 6) || fur[0]?.ty === 6) return null;   // (fur only grows on these kinds: draw it the general way)
  const u = (A: string, i: number) => `${A}[${i}]`;
  const dist = (q: Part, i: number, A: string, B: string, R: string) => {
    const a = u(A, i), b = u(B, i), r = u(R, i);
    return q.ty === 0 ? `sdEllipsoid(p - ${a}.xyz, ${r}.xyz)` : q.ty === 1 ? `sdRoundCone(p, ${a}.xyz, ${b}.xyz, ${r}.x, ${r}.y)`
      : q.ty === 2 ? `sdRBox(p - ${a}.xyz, ${b}.xyz, ${r}.x)` : q.ty === 3 ? `sdRing(p - ${a}.xyz, ${b}.xyz, ${r}.x, ${r}.y)`
      : q.ty === 4 ? `sdDisc(p - ${a}.xyz, ${b}.xyz, ${r}.xyz)` : q.ty === 5 ? `sdArc(p - ${a}.xyz, ${b}.x, ${r}.xyz)`
      : `layerD(d0, p.y, ${r}.x, ${a}.y, ${b}.y)`;   // 6: a layer over the first part
  };
  const slope = (q: Part, i: number, g: string) => {   // the same, with which way is out
    const a = u("uFA", i), b = u("uFB", i), r = u("uFR", i);
    return q.ty === 0 ? `sdEllipsoidG(p - ${a}.xyz, ${r}.xyz, ${g})` : q.ty === 1 ? `sdRoundConeG(p, ${a}.xyz, ${b}.xyz, ${r}.x, ${r}.y, ${g})`
      : q.ty === 2 ? `sdRBoxG(p - ${a}.xyz, ${b}.xyz, ${r}.x, ${g})` : `layerG(d0, g0, p.y, ${r}.x, ${a}.y, ${b}.y, ${g})`;
  };
  const parts = fur.slice(0, MAX_FUR).map((q, i) => ({ q, i, L: (q.fur ?? 0) === 0 ? "BODY_PILE" : f(PILE[q.fur ?? 0]),
    F: `vec4(uFurC[${q.fur ?? 0}], ${f(q.fur ?? 0)})`, k: q.k ?? 0 }));
  const join = (L: string, F: string, k: number, n: string) => k > 0
    ? `  h = clamp(0.5 + 0.5 * (di - d) / ${f(k)}, 0.0, 1.0); d = mix(di, d, h) - ${f(k)} * h * (1.0 - h); len = mix(${L}, len, h); fur = mix(${F}, fur, h);${n && " n = mix(gi, n, h);"}`
    : `  if (di < d) { d = di; len = ${L}; fur = ${F};${n && " n = gi;"} }`;
  const flat = parts.map(({ q, i, L, F, k }) => i === 0
    ? `  float d0 = ${dist(q, 0, "uFA", "uFB", "uFR")};\n  float d = d0 - pile * ${L}, di, h;\n  len = ${L}; fur = ${F};`
    : `  di = ${dist(q, i, "uFA", "uFB", "uFR")} - pile * ${L};\n${join(L, F, k, "")}`);
  const sloped = parts.map(({ q, i, L, F, k }) => i === 0
    ? `  vec3 g0, gi;\n  float d0 = ${slope(q, 0, "g0")};\n  float d = d0, di, h;\n  n = g0; len = ${L}; fur = ${F};`
    : `  di = ${slope(q, i, "gi")};\n${join(L, F, k, "n")}`);
  const cloth = `float pileOf(float kind) { return kind < 0.5 ? BODY_PILE : kind < 1.5 ? ${f(PILE[1])} : kind < 2.5 ? ${f(PILE[2])} : ${f(PILE[3])}; }
float cloth(vec3 p, float pile, out float len, out vec4 fur) {
${flat.join("\n")}
#ifdef MAT_DISPLACE
  if (gDetail > 0.5 && fur.a < 0.5 && d < MAT_DISPLACE + 0.02) d -= matDisplace(p) * (1.0 - 2.0 * fur.a);
#endif
  return d;
}
float clothN(vec3 p, out float len, out vec4 fur, out vec3 n) {
${sloped.join("\n")}
  n = normalize(n);
  return d;
}
`;
  const each = solid.slice(0, MAX_SOLID).map((q, i) =>
    `  di = ${dist(q, i, "uSA", "uSB", "uSR")}; if (di < d) { d = di; col = uSolC[int(uSB[${i}].w + 0.5)]; rough = uSR[${i}].w; }`);
  const sol = `float solid(vec3 p, out vec3 col, out float rough) {
  float d = 1e3, di;
  col = INK; rough = 0.2;
${each.join("\n")}
  return d;
}
`;
  return { cloth, solid: sol };
}

// ---------------------------------------------------------------- bodies
type Body = { parts: Part[]; eye: [number, number]; onBumps?: boolean; scale?: number };
const E = (a: V3, r: V3, k?: number): Part => ({ ty: 0, a, r, k });
const cone = (a: V3, b: V3, r0: number, r1: number, k?: number): Part => ({ ty: 1, a, b, r: [r0, r1, 0], k });
const BODIES: Record<Look["shape"], Body> = {
  // a round pom, sitting on the floor
  pom: { parts: [E([0, 0.8, 0], [0.98, 0.86, 0.9])], eye: [0.37, 0.86] },
  // a tall bean, a little narrower at the top
  bean: { parts: [cone([0, 0.6, 0], [0, 1.34, 0], 0.66, 0.55)], eye: [0.27, 1.16], scale: 0.9 },
  // a drop: round below, drawn up to a soft point
  drop: { parts: [E([0, 0.74, 0], [0.92, 0.8, 0.86]), cone([0, 0.98, 0], [0.03, 1.84, 0], 0.62, 0.085, 0.3)], eye: [0.36, 0.8] },
  // a gumdrop: a dome with a flat base
  gumdrop: { parts: [cone([0, 0.5, 0], [0, 1.2, 0], 0.88, 0.5)], eye: [0.34, 0.8] },
  // a cub: round, with two round ears
  cub: { parts: [E([0, 0.8, 0], [0.96, 0.86, 0.88]), E([-0.6, 1.57, 0], [0.26, 0.26, 0.17], 0.07), E([0.6, 1.57, 0], [0.26, 0.26, 0.17], 0.07)], eye: [0.36, 0.84] },
  // a frog: wide, with a bump for each eye
  frog: { parts: [E([0, 0.7, 0], [1.06, 0.76, 0.88]), E([-0.46, 1.3, 0.14], [0.36, 0.36, 0.34], 0.2), E([0.46, 1.3, 0.14], [0.36, 0.36, 0.34], 0.2)], eye: [0.46, 1.34], onBumps: true },
  // a block of tofu: a soft cube
  tofu: { parts: [{ ty: 2, a: [0, 0.78, 0], b: [0.82, 0.82, 0.68], r: [0.36, 0, 0] }], eye: [0.36, 0.86] },
  // a kitten: round, with two pointed ears
  kitten: { parts: [E([0, 0.8, 0], [0.96, 0.86, 0.88]), cone([-0.52, 1.36, 0], [-0.7, 1.84, 0], 0.27, 0.05, 0.1), cone([0.52, 1.36, 0], [0.7, 1.84, 0], 0.27, 0.05, 0.1)], eye: [0.36, 0.84] },
};
export const SHAPES = Object.keys(BODIES) as Look["shape"][];

// ---------------------------------------------------------------- a look, built
export type Built = {
  fur: Part[]; furC: string[]; solidC: string[];
  /** cloth(), clothN() and solid() written out for this look's parts (no loop over a list): what the shader uses
   *  once the look has a program of its own (View.specialise in ./engine.ts). Looks with the same kinds of part in
   *  the same order share it, and so share a program. null: a part it can't write out, so the look stays on the
   *  program that reads any parts. */
  glsl: { cloth: string; solid: string } | null;
  /** whether the body is a bare surface (clay: plush, cotton and boucle are pile), and whether it wears anything with a pile */
  bare: boolean; pile: boolean;
  /** the solid parts for this moment: eyes (open, blinking, smiling or asleep, glancing gx, gy), then the fixed ones */
  solids: (mode: number, open: number, gx: number, gy: number) => Part[];
  box: number[]; top: number; cam: [number, number, number, number]; shadow: [number, number]; eyeY: number;
};

export function build(look: Look): Built {
  const B = BODIES[look.shape] ?? BODIES.pom, body = B.parts.map((p) => ({ ...p, fur: 0 }));
  const main = COLOURS[look.colour] ?? COLOURS.lime, accent = COLOURS[look.accent ?? "snow"] ?? COLOURS.snow;
  const fur: Part[] = [...body], fixed: Part[] = [];
  // the body's surface (with its pile), found by marching the same distance field
  const front = (x: number, y: number) => 3 - (meet(body, [x, y, 3], [0, 0, -1]) ?? 3);          // z of the front at (x, y)
  const topY = (x = 0, z = 0) => 4 - (meet(body, [x, 4, z], [0, -1, 0]) ?? 4);
  const out = (y: number, az: number) => {   // how far out the surface is at height y, in the direction az round from the front
    const d: V3 = [Math.sin(az), 0, Math.cos(az)];
    return 3 - (meet(body, [d[0] * 3, y, d[2] * 3], [-d[0], 0, -d[2]]) ?? 3);
  };
  const top = topY();
  const [ex, ey] = B.eye, s = B.scale ?? 1;

  // ---- eyes: glossy domes set into the pile (their edges are under it), or stitched arcs when shut
  const kind = look.eyes;
  const eyeR: V3 = kind === "round" || kind === "sparkle" ? [0.112 * s, 0.112 * s, 0.075] : kind === "bead" ? [0.064, 0.064, 0.05]
    : kind === "googly" ? [0.2 * s, 0.2 * s, 0.13] : [0.088 * s, 0.128 * s, 0.07];
  const exx = kind === "bead" ? ex * 1.22 : ex;
  const eyeAt = (sgn: number): V3 => {
    if (B.onBumps) {   // on a frog's bumps: the eye looks out of the bump, forward and a little outward
      const c = body[sgn < 0 ? 1 : 2], d: V3 = [sgn * 0.16, 0.1, 0.98], n = len(...d);
      const t = meet(body, [c.a[0] + (d[0] / n) * 2, c.a[1] + (d[1] / n) * 2, c.a[2] + (d[2] / n) * 2], [-d[0] / n, -d[1] / n, -d[2] / n]) ?? 2;
      return [c.a[0] + (d[0] / n) * (2 - t), c.a[1] + (d[1] / n) * (2 - t), c.a[2] + (d[2] / n) * (2 - t)];
    }
    return [sgn * exx, ey, front(sgn * exx, ey)];
  };
  const eyes = [eyeAt(-1), eyeAt(1)];
  // how far behind the pile's surface an eye's centre sits (less in a material whose surface stands up in relief, so
  // its loops or crystals don't close over the eyes)
  const sink = kind === "googly" ? 0.045 : 0.03;

  // ---- glasses: two rings in front of the eyes, a bridge, and arms that run round the sides of the head
  if (look.glasses !== "none" && !B.onBumps) {
    const R = Math.max(0.19 * s, eyeR[0] + 0.07), gx = Math.max(exx, R + 0.035), gy = ey + 0.005;
    let gz = 0;
    for (let i = 0; i < 12; i++) {   // (far enough forward that no part of a ring is under the pile)
      const a = (i / 12) * Math.PI * 2;
      gz = Math.max(gz, front(gx + Math.cos(a) * R, gy + Math.sin(a) * R), front(-gx + Math.cos(a) * R, gy + Math.sin(a) * R));
    }
    gz += 0.03;
    const shades = look.glasses === "shades", th = shades ? 0.026 : 0.021;
    for (const sgn of [-1, 1]) {
      fixed.push({ ty: 3, a: [sgn * gx, gy, gz], b: [0, 0, 1], r: [R, th, 0], col: SOLID.ink, rough: 0.2 });
      if (shades) fixed.push({ ty: 4, a: [sgn * gx, gy, gz], b: [0, 0, 1], r: [R, 0.014, 0.012], col: SOLID.ink, rough: 0.06 });
      const a1 = 0.95, a2 = 1.75, r1 = out(gy, sgn * a1) + 0.03, r2 = out(gy + 0.02, sgn * a2) + 0.012;
      const mid: V3 = [Math.sin(sgn * a1) * r1, gy + 0.01, Math.cos(sgn * a1) * r1], end: V3 = [Math.sin(sgn * a2) * r2, gy + 0.02, Math.cos(sgn * a2) * r2];
      fixed.push(cone([sgn * (gx + R), gy, gz], mid, 0.016, 0.015), cone(mid, end, 0.015, 0.014));
      fixed[fixed.length - 1].col = fixed[fixed.length - 2].col = SOLID.ink;
      fixed[fixed.length - 1].rough = fixed[fixed.length - 2].rough = 0.2;
    }
    const bw = gx - R * 0.96;
    fixed.push({ ...cone([-bw, gy + 0.035, gz], [bw, gy + 0.035, gz], 0.017, 0.017), col: SOLID.ink, rough: 0.2 });
  }

  // ---- the extra
  let H = top;
  if (look.extra === "headphones") {
    // the band's centre is where a circle through the top of the head also meets the sides
    let lo = 0.3, hi = top - 0.15;
    const f = (cy: number) => (top + 0.07 - cy) - (out(cy, Math.PI / 2) + 0.055);
    for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; }
    const cy = (lo + hi) / 2, Rb = top + 0.07 - cy, side = out(cy, Math.PI / 2);
    fixed.push({ ty: 5, a: [0, cy, 0], b: [1, 0, 0], r: [Rb, 0.034, 1.62], col: SOLID.dark, rough: 0.3 });
    for (const sgn of [-1, 1]) {
      fixed.push({ ty: 4, a: [sgn * (side + 0.075), cy, 0], b: [1, 0, 0], r: [0.215, 0.085, 0.05], col: SOLID.accent, rough: 0.22 });
      fixed.push({ ty: 4, a: [sgn * (side + 0.0), cy, 0], b: [1, 0, 0], r: [0.19, 0.05, 0.04], col: SOLID.dark, rough: 0.5 });
    }
    H = top + 0.12;
  } else if (look.extra === "beanie") {
    const yb = top - 0.34;
    fur.push({ ty: 6, a: [0, yb, 0], b: [0, 9, 0], r: [0.05, 0, 0], k: 0.012, fur: 1 });              // the cap: a layer over the head
    fur.push({ ty: 6, a: [0, yb - 0.03, 0], b: [0, yb + 0.13, 0], r: [0.1, 0, 0], k: 0.012, fur: 1 });   // its rolled brim
    fur.push({ ty: 0, a: [0, top + 0.2, 0], r: [0.13, 0.13, 0.13], k: 0.02, fur: 2 });                 // a pom
    H = top + 0.44;
  } else if (look.extra === "sprout") {
    fixed.push({ ...cone([0, top - 0.04, 0], [0.01, top + 0.2, 0], 0.024, 0.02), col: SOLID.leaf, rough: 0.7 });
    fur.push({ ...cone([0.01, top + 0.2, 0], [-0.2, top + 0.36, 0.0], 0.022, 0.075, 0.03), fur: 1 });   // two felt leaves
    fur.push({ ...cone([0.01, top + 0.2, 0], [0.19, top + 0.4, 0.0], 0.022, 0.085, 0.03), fur: 1 });
    H = top + 0.56;
  } else if (look.extra === "antenna") {
    fixed.push({ ...cone([0, top - 0.04, 0], [0, top + 0.3, 0], 0.017, 0.015), col: SOLID.dark, rough: 0.35 });
    fixed.push({ ty: 0, a: [0, top + 0.36, 0], r: [0.078, 0.078, 0.078], col: SOLID.accent, rough: 0.12 });
    H = top + 0.46;
  } else if (look.extra === "scarf") {
    const ys = Math.max(0.2, ey - (B.onBumps ? 0.86 : 0.4));
    fur.push({ ty: 6, a: [0, ys - 0.11, 0], b: [0, ys + 0.11, 0], r: [0.07, 0, 0], k: 0.012, fur: 1 });   // a band round the body
    const fz = front(0.3, ys - 0.12);
    fur.push({ ...cone([0.3, ys - 0.02, fz + 0.02], [0.36, ys - 0.33, front(0.36, Math.max(0.05, ys - 0.33)) + 0.03], 0.075, 0.09, 0.03), fur: 1 });
  } else if (look.extra === "cap") {   // a mortarboard
    fixed.push({ ty: 4, a: [0, top + 0.02, 0], b: [0, 1, 0], r: [0.3, 0.075, 0.03], col: SOLID.dark, rough: 0.6 });
    fixed.push({ ty: 2, a: [0, top + 0.115, 0], b: [0.43, 0.022, 0.43], r: [0.018, 0, 0], col: SOLID.dark, rough: 0.6 });
    fixed.push({ ...cone([0, top + 0.145, 0], [0.4, top + 0.14, 0.34], 0.012, 0.012), col: SOLID.accent, rough: 0.5 });
    fixed.push({ ...cone([0.4, top + 0.14, 0.34], [0.42, top - 0.1, 0.36], 0.012, 0.03), col: SOLID.accent, rough: 0.5 });
    H = top + 0.2;
  } else if (look.extra === "tuft") {
    fur.push({ ty: 0, a: [0, top - 0.02, 0.06], r: [0.06, 0.06, 0.06], k: 0.05, fur: 3 });
    H = top + 0.3;
  }

  // An eye is a few parts in fixed places: the dome (or the white), then a pupil or two glints where it has them, then
  // an arc (the eye shut). What isn't showing is parked out of sight. So a look's list always has the same kinds of
  // part in the same order, whatever its eyes are doing, and the shader can have them written out (glslFor).
  const parked = (ty: number): Part => ({ ty, a: [0, PARKED, 0], b: [1, 0, 0], r: [0.001, 0.001, 0.001], col: SOLID.ink, rough: 0.5 });
  const places = kind === "smile" ? [5] : kind === "googly" ? [0, 0, 5] : kind === "sparkle" ? [0, 0, 0, 5] : [0, 5];
  const solids = (mode: number, open: number, gx: number, gy: number): Part[] => {
    const o: Part[] = [];
    eyes.forEach((c, i) => {
      const sgn = i ? 1 : -1;
      const slot = places.map(parked), arc = places.length - 1;
      if (mode > 0.5 || kind === "smile") {   // shut: a stitched arc, ∩ when smiling and ∪ when asleep
        const up = mode > 1.5 ? -1 : 1, r = Math.max(eyeR[0], 0.085) * (kind === "googly" ? 0.62 : 0.95);
        slot[arc] = { ty: 5, a: [c[0], c[1] - up * r * 0.45, c[2] - 0.012], b: [up, 0, 0], r: [r, 0.024, 1.15], col: SOLID.ink, rough: 0.55 };
      } else {
        const z = c[2] - sink;
        if (kind === "googly") {
          slot[0] = { ty: 0, a: [c[0], c[1], z], r: [eyeR[0], eyeR[1] * Math.max(open, 0.12), eyeR[2]], col: SOLID.white, rough: 0.12 };
          const px = clamp(gx * 2.2, -1, 1) * 0.07 - sgn * 0.012, py = clamp(gy * 2.6, -1, 1) * 0.06;
          const pz = eyeR[2] * Math.sqrt(Math.max(0.2, 1 - (px * px + py * py) / (eyeR[0] * eyeR[0])));
          slot[1] = { ty: 0, a: [c[0] + px, c[1] + py, z + pz - 0.03], r: [0.105 * s, 0.105 * s * Math.max(open, 0.12), 0.05], col: SOLID.ink, rough: 0.08 };
        } else {
          slot[0] = { ty: 0, a: [c[0] + gx * 0.5, c[1] + gy * 0.5, z], r: [eyeR[0], eyeR[1] * Math.max(open, 0.1), eyeR[2]], col: SOLID.ink, rough: 0.08 };
          if (kind === "sparkle" && open > 0.6) {
            slot[1] = { ty: 0, a: [c[0] + gx * 0.5 - 0.036, c[1] + gy * 0.5 + 0.04, z + eyeR[2] * 0.83], r: [0.031, 0.031, 0.016], col: SOLID.white, rough: 0.3 };
            slot[2] = { ty: 0, a: [c[0] + gx * 0.5 + 0.034, c[1] + gy * 0.5 - 0.038, z + eyeR[2] * 0.86], r: [0.015, 0.015, 0.01], col: SOLID.white, rough: 0.3 };
          }
        }
      }
      o.push(...slot);
    });
    return o.concat(fixed);
  };

  // the box the shader marches in, and a camera that frames the whole of it
  let x0 = 9, x1 = -9, z0 = 9, z1 = -9, y1 = 0;
  const grow = (p: Part, pad: number) => {
    if (p.ty === 6) return;   // (a layer over the body: inside the body's own bounds, but for its thickness)
    const pts = p.ty === 1 ? [p.a, p.b!] : [p.a];
    const rad = p.ty === 0 ? Math.max(p.r[0], p.r[2]) : p.ty === 1 ? Math.max(p.r[0], p.r[1]) : p.ty === 2 ? Math.max(p.b![0], p.b![2]) : p.r[0] + p.r[1] + 0.1;
    const rx = p.ty === 0 ? p.r[0] : p.ty === 2 ? p.b![0] : rad, rz = p.ty === 0 ? p.r[2] : p.ty === 2 ? p.b![2] : rad;
    const ry = p.ty === 0 ? p.r[1] : p.ty === 2 ? p.b![1] : rad;
    for (const q of pts) {
      x0 = Math.min(x0, q[0] - rx - pad); x1 = Math.max(x1, q[0] + rx + pad); z0 = Math.min(z0, q[2] - rz - pad); z1 = Math.max(z1, q[2] + rz + pad);
      y1 = Math.max(y1, q[1] + ry + pad);
    }
  };
  fur.forEach((p) => grow(p, PILE[p.fur ?? 0] + 0.03 + (fur.some((q) => q.ty === 6) ? 0.11 : 0)));
  solids(0, 1, 0, 0).forEach((p) => grow(p, 0.03));
  H = Math.max(H, y1 - 0.03);
  const w = Math.max(x1, -x0), dz = Math.max(z1, -z0), camY = 2.4, camZ = 9.8, mid = H * 0.5;
  const dist = Math.hypot(camY - mid, camZ), fov = (2 * Math.atan((Math.max(H * 0.5 + 0.08, w * 0.98) * 1.14) / dist) * 180) / Math.PI;
  // A body in a surface material: no pile, grown by SKIN instead; and the knit layers over it (a hat, a scarf) start
  // from its new surface, so they are no thicker than on plush.
  const nap = NAP[look.material ?? "plush"], bare = nap === undefined, room = bare ? 0.07 : 0.03;
  const more = bare ? SKIN : Math.max(NAP_FULL - nap, 0);   // (a short pile: the body is grown by what the pile lacks)
  if (more > 0) fur.forEach((q, i) => {
    if ((q.fur ?? 0) === 0) fur[i] = q.ty === 0 ? { ...q, r: [q.r[0] + more, q.r[1] + more, q.r[2] + more] }
      : q.ty === 1 ? { ...q, r: [q.r[0] + more, q.r[1] + more, q.r[2]] }
      : { ...q, b: [q.b![0] + more, q.b![1] + more, q.b![2] + more], r: [q.r[0] + more, q.r[1], q.r[2]] };
    else if (q.ty === 6) fur[i] = { ...q, r: [Math.max(q.r[0] - more, 0.006), q.r[1], q.r[2]] };
  });
  return {
    glsl: glslFor(fur, solids(0, 1, 0, 0)), bare, pile: fur.some((q) => (q.fur ?? 0) !== 0),
    fur, solids, furC: [main, look.extra === "sprout" ? COLOURS.leaf : accent, look.extra === "beanie" ? COLOURS.snow : accent, accent],   // body, knit (or leaves), pom, tuft
    solidC: ["#060608", "#f6f7f9", accent, "#23262d", "#3f9b2f", "#c9ced6"],
    // (a bare body may stand a little proud of its smooth shape, where its material has relief: room for that in the
    // box that is marched; the camera's framing stays as it is for plush, so every material is the same size on screen)
    box: [-w - room, -0.1, -dz - room, w + room, H + 0.06 + room, dz + room], top, cam: [camY, camZ, mid * 0.97, fov], shadow: [w * 2.2, dz * 1.6], eyeY: ey,
  };
}
