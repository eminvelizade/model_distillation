import * as THREE from "three";
import type { Look, MascotKind, MascotPose } from "../mascots";
import { COLOURS } from "../mascots";
import { build, Built, MAX_FUR, MAX_SOLID, NAP, PARKED, Part } from "./looks";
import { material, MATLIB, type Surface } from "./materials";
import { BLOOM, COMMON, FUZZY, MAIN_PILE, MAIN_SURFACE, SCENE, VERT } from "./shaders";

/** The 3D mascots, drawn live with three.js.
 *
 *  A page can show many mascots at once (the dock button, the chat header, an avatar on every answer, an Explain pill
 *  next to each result), but a browser only allows about 16 WebGL contexts. So there's ONE renderer: each mascot is a
 *  View with its own scene and a plain 2D canvas, and the shared renderer draws a View into a corner of its own canvas,
 *  which is then copied onto the View's. One animation loop runs the Views that are on screen, each at its own frame
 *  rate, and stops when none are. With "reduce motion" on, Views draw one still frame per change instead. */

// base: where an ear meets the head (the one on the viewer's right); off: from there to its centre, in the ear's own
// frame; yaw: how far it faces outward; lean: how far it leans outward
type Ears = { base: [number, number, number]; off: [number, number]; yaw: number; lean: number };
type Spec = {
  glsl: string; box: number[]; cam: [number, number, number, number]; top: number; shadow: [number, number];
  eye: { x: number; y: number; rx: number; ry: number };
  nose: [number, number, number, number]; blush: [number, number, number, number];
  rest: number; prop: string; exposure: number; colors: { main: string; accent: string; blush: string; extra: string };
  ears?: Ears;
};

// The built-in mascot. Positions are in his own units (floor at y = 0, facing +z).
const SPECS: Record<MascotKind, Spec> = {
  // Bloom was measured from a photo of the real plush: the face is laid out on his surface (eye and blush x are
  // distances round the body, not across the picture), and the colours are the photo's, not the palette's.
  bloom: {
    glsl: BLOOM, box: [-1.15, -0.1, -1.08, 1.15, 2.22, 1.08], cam: [2.48, 9.9, 1.08, 17], top: 1.73, shadow: [2.6, 1.6],
    eye: { x: 0.321, y: 0.785, rx: 0.062, ry: 0.088 }, nose: [0, 0.711, 0.055, 0.014],
    blush: [0.481, 0.62, 0, 0.1], ears: { base: [0.605, 1.34, 0.339], off: [0, 0.14], yaw: 0, lean: 0.8 }, rest: 0,
    prop: "#68c7ea", exposure: 1.1,
    colors: { main: "#eff2fa", accent: "#99d7f0", blush: "#b0f1fc", extra: "#84d1f0" },   // white fur; (accent: unused); the blush's dye; the tuft's and ears' blue
  },
};

/** A make-your-own mascot's shader with this look's own parts written out in it (see glslFor), or null when a part
 *  can't be written out. */
const ownGlsl = (b: Built) => b.glsl && FUZZY.replace(/\/\*CLOTH<\*\/[\s\S]*?\/\*>CLOTH\*\//, () => b.glsl!.cloth).replace(/\/\*SOLID<\*\/[\s\S]*?\/\*>SOLID\*\//, () => b.glsl!.solid);

/** The fragment shader of a mascot. `character` is BLOOM, or FUZZY (with a look's own parts written out, or not).
 *  A make-your-own body in plush is pile, like Bloom. In any other material it is a bare surface: the material's
 *  header (its defines) goes first, and the material library and the material itself before the march that calls it. */
function program(character: string, b: Built | null, look?: Look): string {
  if (!b?.bare || !look?.material) return COMMON + character + SCENE + MAIN_PILE;
  const m = material(look.material as Surface);
  return COMMON + "#define MAT\n" + (b.pile ? "#define PILE\n" : "") + m.header + "\n" + character + SCENE + MATLIB + "\n" + m.body + "\n" + MAIN_SURFACE;
}

/** The spec of a make-your-own mascot: its parts are lists (see ./looks.ts), so most of a Spec doesn't apply. */
/** The body's pile in the three materials that are pile, as the shader's uPileA..D (see furM in ./shaders.ts):
 *  [depth, clumps per unit, strands per unit, a strand's length against its width],
 *  [how far a clump leans off the lay (radians), how hard its strands lean together, how far and how often a strand bends],
 *  [how far a strand lies over (in depths), the shortest strand (share of the depth), how much longer the rest are, strays],
 *  [how much whole clumps differ in height, how round a strand is shaded, the pale rim's strength, a strand's taper]. */
const PILES: Record<string, number[][]> = {
  // plush: thick strands combed one way, as on the reference (docs/MATERIALS.md)
  plush: [[NAP.plush, 15, 100, 2.8], [0.65, 6.0, 0.007, 55], [0.85, 0.5, 0.3, 0.2], [0.0, 0.46, 1.0, 0.24]],
  // cotton: a short brushed nap of fine fibres lying every way
  cotton: [[NAP.cotton, 34, 190, 1.8], [3.14, 0.0, 0.002, 90], [0.5, 0.62, 0.3, 0.08], [0.0, 0.3, 0.55, 0.2]],
  // boucle: thick yarn in curls and loops, in nubs of different heights
  boucle: [[NAP.boucle, 13, 66, 3.0], [3.14, 2.0, 0.019, 76], [0.5, 0.5, 0.35, 0.1], [0.45, 0.6, 0.9, 0.2]],
};

function fuzzySpec(b: Built, look: Look): Spec {
  const main = COLOURS[look.colour] ?? COLOURS.lime, pale = look.colour === "snow";
  const glsl = FUZZY;   // (the program that reads any parts: every look shares it, so each is ready at once. See View.specialise)
  return {
    glsl, box: b.box, cam: b.cam, top: b.top, shadow: b.shadow, eye: { x: 0, y: b.eyeY, rx: 0, ry: 0 },
    nose: [0, 0, 0, 0], blush: [0, 0, 0, 0], rest: 0, prop: pale ? COLOURS.ice : main, exposure: pale ? 1.12 : 1.0,
    colors: { main, accent: main, blush: main, extra: main },
  };
}

const C = (hex: string) => new THREE.Color(hex);
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const reduceMotion = () => !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const isDark = () => document.documentElement.classList.contains("dark");

// ---------------------------------------------------------------- the shared renderer
let renderer: THREE.WebGLRenderer | null = null;
let glW = 0, glH = 0;
let noise: THREE.Data3DTexture | null = null;

function gl(w: number, h: number): THREE.WebGLRenderer {
  if (!renderer) {
    // preserveDrawingBuffer: each View's picture is copied out right after it's drawn
    renderer = new THREE.WebGLRenderer({ alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);
    renderer.autoClear = false;
  }
  if (w > glW || h > glH) { glW = Math.max(w, glW); glH = Math.max(h, glH); renderer.setSize(glW, glH, false); }
  return renderer;
}

function noiseTexture(): THREE.Data3DTexture {
  if (noise) return noise;
  const N = 128, data = new Uint8Array(N * N * N);
  let s = 0x2f6b9d1;
  for (let i = 0; i < data.length; i++) { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; data[i] = s & 255; }
  const tex = new THREE.Data3DTexture(data, N, N, N);
  tex.format = THREE.RedFormat;
  tex.type = THREE.UnsignedByteType;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = tex.wrapR = THREE.RepeatWrapping;
  tex.generateMipmaps = true;
  tex.unpackAlignment = 1;
  tex.needsUpdate = true;
  return (noise = tex);
}

/** Throws when this browser can't draw WebGL 2 (the caller then shows the still picture). */
export function probe() {
  if (!renderer && !document.createElement("canvas").getContext("webgl2")) throw new Error("WebGL 2 is not available");   // quietly
  gl(1, 1);
}

// ---------------------------------------------------------------- the loop
const views = new Set<View>();
const pointer = { x: 0, y: 0, seen: false };
let raf = 0, lastLoop = 0, slowFrames = 0, quality = 1;
let listening = false;

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("pointermove", (e) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.seen = true; }, { passive: true });
  document.addEventListener("visibilitychange", kick);
  new MutationObserver(() => views.forEach((v) => v.applyTheme())).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
}

function kick() { if (!raf && !document.hidden) raf = requestAnimationFrame(loop); }

function loop(now: number) {
  raf = 0;
  if (document.hidden) return;
  // If frames come slower than ~40 fps: first give the biggest make-your-own mascot on screen a program of its own
  // (one at a time: each has to be compiled); when none is left, draw every mascot with fewer pixels. (A gap of
  // more than a second and a half is the tab coming back, not a slow frame.)
  const ms = lastLoop ? now - lastLoop : 16;
  lastLoop = now;
  if (ms > 25 && ms < 1500) {
    if (++slowFrames > 16) {
      const next = [...views].sort((a, b) => b.gain - a.gain)[0];
      if (next?.gain) { next.specialise(); slowFrames = 0; }
      else if (slowFrames > 30 && quality > 0.6) { quality = Math.max(0.6, quality - 0.2); slowFrames = 0; views.forEach((v) => v.resize()); }
    }
  } else slowFrames = Math.max(0, slowFrames - 1);
  let any = false;
  for (const v of views) if (v.frame(now)) any = true;
  if (any) raf = requestAnimationFrame(loop);
  else lastLoop = 0;
}

// ---------------------------------------------------------------- one mascot
/** kind "fuzzy" is a make-your-own mascot: `look` says which. `still`: one picture per change, no motion (a
 *  thumbnail). A make-your-own mascot starts on the program that reads any parts and gets one of its own when
 *  frames come slowly (see View.specialise): `general` keeps it on the first for good, `own` starts it on the second. */
export type ViewOptions = { kind: MascotKind | "fuzzy"; look?: Look; pose?: MascotPose; fps?: number; follow?: boolean; zoom?: number;
  still?: boolean; general?: boolean; own?: boolean };

export class View {
  private K: Spec;
  private built: Built | null = null;   // a make-your-own mascot's parts
  private still = false;                // a thumbnail: one picture per change
  private own: string | null = null;    // a make-your-own mascot's shader with its own parts written out, until it is in use
  private look?: Look;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private uniforms: Record<string, THREE.IUniform>;
  private mat: THREE.ShaderMaterial;
  private geos: THREE.BufferGeometry[] = [];
  private disposables: { dispose(): void }[] = [];
  private body: THREE.Mesh;
  private root = new THREE.Group();
  private squash = new THREE.Group();
  private shadow: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  private flake: THREE.Sprite;
  private zs: THREE.Sprite[];
  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private w = 1; private h = 1; private fov: number;
  private onScreen = true; private last = 0; private dirty = true;
  private fps: number; private follow: boolean;
  private st = {
    pose: "idle" as MascotPose, poseT: 0, t: Math.random() * 10, blinkIn: 1.6 + Math.random() * 2, blinkT: -1,
    look: new THREE.Vector2(), lookV: new THREE.Vector2(), poke: -1, tilt: 0, tiltV: 0, flake: 0, zz: 0,
  };
  private earM = new THREE.Matrix4(); private earE = new THREE.Euler(); private v3 = new THREE.Vector3();
  private q = new THREE.Quaternion(); private qi = new THREE.Quaternion();
  private pileU: Record<string, { value: THREE.Vector4 }> = {};
  private KEY = new THREE.Vector3(-0.42, 0.78, 0.5).normalize();    // big softbox, in front and above
  private FILL = new THREE.Vector3(0.85, 0.15, 0.5).normalize();    // fill from the other side
  private BACK = new THREE.Vector3(0.25, 0.6, -0.76).normalize();   // rim light, behind and above

  constructor(private host: HTMLElement, o: ViewOptions) {
    if (o.kind === "fuzzy") this.built = build(o.look ?? { shape: "pom", colour: "lime", eyes: "bean", glasses: "none", extra: "none" });
    const K = (this.K = this.built ? fuzzySpec(this.built, o.look!) : SPECS[o.kind as MascotKind]);
    if (this.built) {   // the body's pile, in the materials that are pile
      const P = PILES[o.look?.material ?? "plush"] ?? PILES.plush;
      ["uPileA", "uPileB", "uPileC", "uPileD"].forEach((u, i) => (this.pileU[u] = { value: new THREE.Vector4(P[i][0], P[i][1], P[i][2], P[i][3]) }));
    }
    if (this.built) {   // natural light (see the light in shaders.ts): the key low and to the side, so it models the body from side to side
      this.KEY.set(-0.587, 0.643, 0.492).normalize();   // 40 degrees up, 50 to the left
      this.FILL.set(0.597, 0.1, 0.796).normalize();     // the room on the other side
      this.BACK.set(0.45, 0.5, -0.74).normalize();      // the rim, from behind and above
    }
    this.still = !!o.still;
    this.own = this.built && !o.general ? ownGlsl(this.built) : null;
    this.look = o.look;
    this.fps = o.fps ?? 30;
    this.follow = o.follow ?? true;
    this.canvas = document.createElement("canvas");
    this.canvas.style.cssText = "display:block;width:100%;height:100%";
    const ctx = this.canvas.getContext("2d");
    if (!ctx) throw new Error("no 2D canvas");
    this.ctx = ctx;
    const [camY, camZ, target, fov] = K.cam;
    this.fov = fov / (o.zoom ?? 1);
    this.camera = new THREE.PerspectiveCamera(this.fov, 1, 0.1, 60);
    this.camera.position.set(0, camY, camZ);
    this.camera.lookAt(0, target, 0);

    const v4 = (a: number[]) => new THREE.Vector4(a[0], a[1], a[2], a[3]);
    const boxMin = new THREE.Vector3(K.box[0], K.box[1], K.box[2]), boxMax = new THREE.Vector3(K.box[3], K.box[4], K.box[5]);
    this.uniforms = {
      uNoise: { value: noiseTexture() }, uCam: { value: new THREE.Vector3() },
      uBoxMin: { value: boxMin }, uBoxMax: { value: boxMax }, uPix: { value: 0.001 },
      uKey: { value: this.KEY.clone() }, uKeyCol: { value: C("#fff7ee") },
      uFill: { value: this.FILL.clone() }, uFillCol: { value: C("#f3f6ff").multiplyScalar(0.32) },
      uBack: { value: this.BACK.clone() }, uBackCol: { value: C("#ffffff").multiplyScalar(0.58) },
      uUp: { value: new THREE.Vector3(0, 1, 0) }, uSky: { value: C("#ffffff").multiplyScalar(0.42) }, uGround: { value: C("#f1f3f7").multiplyScalar(0.24) },
      uFwd: { value: new THREE.Vector3(0, 0, 1) }, uBackdrop: { value: C("#f5f8fc") }, uDark: { value: 0 },
      uShadow: { value: new THREE.Vector2(K.shadow[0] / 2, K.shadow[1] / 2) }, uTime: { value: 0 },
      uExposure: { value: K.exposure }, ...this.pileU,
      uMain: { value: C(K.colors.main) }, uAccent: { value: C(K.colors.accent) }, uBlushC: { value: C(K.colors.blush) }, uExtra: { value: C(K.colors.extra) },
      uEye: { value: [new THREE.Vector4(), new THREE.Vector4()] },
      uEyeMode: { value: K.rest }, uEyeOpen: { value: 1 },
      uNose: { value: v4(K.nose) },
      uBlush: { value: [v4([-K.blush[0], K.blush[1], K.blush[2], K.blush[3]]), v4(K.blush)] },
      uEarC: { value: [new THREE.Vector3(), new THREE.Vector3()] }, uEarM: { value: [new THREE.Matrix3(), new THREE.Matrix3()] },
      uSway: { value: 0 },
    };
    if (this.built) {   // the parts, as the lists the FUZZY shader reads
      const B = this.built, v4s = (n: number) => Array.from({ length: n }, () => new THREE.Vector4());
      Object.assign(this.uniforms, {
        uNF: { value: B.fur.length }, uFA: { value: v4s(MAX_FUR) }, uFB: { value: v4s(MAX_FUR) }, uFR: { value: v4s(MAX_FUR) },
        uFurC: { value: B.furC.map(C) }, uNS: { value: 0 }, uSA: { value: v4s(MAX_SOLID) }, uSB: { value: v4s(MAX_SOLID) },
        uSR: { value: v4s(MAX_SOLID) }, uSolC: { value: B.solidC.map(C) }, uSolB: { value: new THREE.Vector4(0, 0, 0, 9) },
      });
      B.fur.slice(0, MAX_FUR).forEach((q, i) => {
        (this.uniforms.uFA.value as THREE.Vector4[])[i].set(q.a[0], q.a[1], q.a[2], q.ty);
        (this.uniforms.uFB.value as THREE.Vector4[])[i].set(q.b?.[0] ?? 0, q.b?.[1] ?? 0, q.b?.[2] ?? 0, q.k ?? 0);
        (this.uniforms.uFR.value as THREE.Vector4[])[i].set(q.r[0], q.r[1], q.r[2], q.fur ?? 0);
      });
      this.setSolids(B.solids(0, 1, 0, 0));
    }
    const box = new THREE.BoxGeometry(boxMax.x - boxMin.x, boxMax.y - boxMin.y, boxMax.z - boxMin.z);
    box.translate((boxMax.x + boxMin.x) / 2, (boxMax.y + boxMin.y) / 2, (boxMax.z + boxMin.z) / 2);
    this.geos.push(box);
    this.mat = this.material(K.glsl);
    this.body = new THREE.Mesh(box, this.mat);
    if (o.own) this.specialise();
    this.body.frustumCulled = false;
    this.root.add(this.squash);
    this.squash.add(this.body);
    this.scene.add(this.root);

    // a soft contact shadow on the floor
    const sc = document.createElement("canvas");
    sc.width = sc.height = 128;
    const sx = sc.getContext("2d")!;
    const grad = sx.createRadialGradient(64, 64, 0, 64, 64, 64);
    if (this.built) {   // under one soft lamp to the side: deeper close to the body, trailing off away from the lamp
      grad.addColorStop(0, "rgba(30,40,60,0.5)");
      grad.addColorStop(0.35, "rgba(30,40,60,0.3)");
      grad.addColorStop(0.7, "rgba(30,40,60,0.1)");
    } else {
      grad.addColorStop(0, "rgba(30,40,60,0.4)");
      grad.addColorStop(0.5, "rgba(30,40,60,0.14)");
    }
    grad.addColorStop(1, "rgba(30,40,60,0)");
    sx.fillStyle = grad;
    sx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(sc);
    const wide = this.built ? 1.12 : 1;
    const plane = new THREE.PlaneGeometry(K.shadow[0] * wide, K.shadow[1] * wide);
    this.shadow = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.set(this.built ? 0.12 : 0, 0.002, 0.04);   // (the make-your-own mascots' lamp is on the left)
    this.shadow.renderOrder = -1;
    this.scene.add(this.shadow);
    this.disposables.push(shadowTex, plane, this.shadow.material);

    // props: a sparkle while thinking, z's while asleep
    const sprite = (draw: (x: CanvasRenderingContext2D) => void) => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      draw(c.getContext("2d")!);
      const map = new THREE.CanvasTexture(c);
      map.colorSpace = THREE.SRGBColorSpace;
      const m = new THREE.SpriteMaterial({ map, transparent: true, depthWrite: false, depthTest: false, opacity: 0 });
      const sp = new THREE.Sprite(m);
      sp.renderOrder = 10;
      sp.visible = false;
      this.scene.add(sp);
      this.disposables.push(map, m);
      return sp;
    };
    this.flake = sprite((x) => {
      x.translate(64, 64);
      x.fillStyle = K.prop;
      x.beginPath();
      for (let i = 0; i < 4; i++) { x.quadraticCurveTo(0, 0, 0, -56); x.quadraticCurveTo(0, 0, 56, 0); x.rotate(Math.PI / 2); }
      x.fill();
    });
    this.zs = [0, 1].map(() => sprite((x) => {
      x.fillStyle = K.prop; x.font = "800 108px ui-sans-serif, system-ui, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle";
      x.fillText("z", 64, 60);
    }));

    this.canvas.addEventListener("pointerdown", this.poke);
    host.appendChild(this.canvas);
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.io = new IntersectionObserver(([e]) => { this.onScreen = e.isIntersecting; this.dirty = true; kick(); });
    this.io.observe(host);
    listen();
    this.applyTheme();
    this.resize();
    if (o.pose) this.setPose(o.pose);
    this.update(0);
    views.add(this);
    kick();
  }

  private poke = () => { this.st.poke = 0; this.dirty = true; kick(); };

  private setSolids(parts: Part[]) {
    const U = this.uniforms, n = Math.min(parts.length, MAX_SOLID);
    for (let i = 0; i < n; i++) {
      const q = parts[i];
      (U.uSA.value as THREE.Vector4[])[i].set(q.a[0], q.a[1], q.a[2], q.ty);
      (U.uSB.value as THREE.Vector4[])[i].set(q.b?.[0] ?? 0, q.b?.[1] ?? 0, q.b?.[2] ?? 0, q.col ?? 0);
      (U.uSR.value as THREE.Vector4[])[i].set(q.r[0], q.r[1], q.r[2], q.rough ?? 0.2);
    }
    U.uNS.value = n;
    // a ball round them all (their points, plus their size): outside it the shader skips the list
    let cx = 0, cy = 0, cz = 0, k = 0;
    const pts: [number, number, number, number][] = [];
    for (let i = 0; i < n; i++) {
      if (parts[i].a[1] <= PARKED + 1) continue;   // (an eye's unused places are parked far below)
      const q = parts[i], reach = q.ty === 0 ? Math.max(q.r[0], q.r[1], q.r[2]) : q.ty === 1 ? Math.max(q.r[0], q.r[1]) : q.ty === 2 ? Math.hypot(q.b![0], q.b![1], q.b![2]) : q.r[0] + q.r[1];
      pts.push([q.a[0], q.a[1], q.a[2], reach]);
      if (q.ty === 1) pts.push([q.b![0], q.b![1], q.b![2], reach]);
    }
    for (const q of pts) { cx += q[0]; cy += q[1]; cz += q[2]; k++; }
    if (k) { cx /= k; cy /= k; cz /= k; }
    let rad = 0;
    for (const q of pts) rad = Math.max(rad, Math.hypot(q[0] - cx, q[1] - cy, q[2] - cz) + q[3]);
    (U.uSolB.value as THREE.Vector4).set(cx, cy, cz, k ? rad : -1);
  }

  setPose(p: MascotPose) {
    const st = this.st;
    if (p === st.pose) return;
    if (p === "idle" && (st.pose === "wave" || st.pose === "happy")) return;   // let a wave or hop finish
    st.pose = p;
    st.poseT = 0;
    this.dirty = true;
    kick();
  }

  applyTheme() {
    const dark = isDark();
    if (!this.built) (this.uniforms.uBackCol.value as THREE.Color).set("#ffffff").multiplyScalar(dark ? 0.85 : 0.58);   // the rim glow reads better on dark
    this.shadow.material.color.set(dark ? "#000000" : "#ffffff");
    // the page behind (what a clear or mirrored body shows): the theme's canvas colour
    const rgb = getComputedStyle(document.documentElement).getPropertyValue("--canvas").trim().split(/\s+/).map(Number);
    const page = this.uniforms.uBackdrop.value as THREE.Color;
    if (rgb.length === 3 && rgb.every((x) => Number.isFinite(x))) page.setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, THREE.SRGBColorSpace);
    else page.set(dark ? "#070a10" : "#f5f8fc");
    this.uniforms.uDark.value = dark ? 1 : 0;
    if (this.built) {   // natural light, in linear light: a warm key (6150 K), a cooler sky (7000 K), and what the page sends back
      const U = this.uniforms, set = (u: { value: unknown }, r: number, g: number, b: number, k: number) => (u.value as THREE.Color).setRGB(r * k, g * k, b * k);
      set(U.uKeyCol, 1.0, 0.965, 0.915, 0.7);
      set(U.uSky, 0.9, 0.94, 1.0, 0.4);
      set(U.uFillCol, 1.0, 0.97, 0.93, dark ? 0.12 : 0.06);
      set(U.uBackCol, 0.95, 0.97, 1.0, dark ? 0.75 : 0.3);    // on a dark page the rim is a lamp; on a light one the page itself does most of it
      // the page returns 0.6 of what falls on it (the key at its angle, and the sky); a dark page is taken as a dark grey floor
      const fr = dark ? 0.28 : page.r, fg = dark ? 0.3 : page.g, fb = dark ? 0.33 : page.b;   // (a dark page: a table that is dark to the eye, not to the light)
      (U.uGround.value as THREE.Color).setRGB(0.6 * fr * (0.45 + 0.36), 0.6 * fg * (0.434 + 0.376), 0.6 * fb * (0.412 + 0.4));
    }
    this.dirty = true;
    kick();
  }

  private material(character: string) {
    return new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: program(character, this.built, this.look), uniforms: this.uniforms,
      transparent: true, depthWrite: false, premultipliedAlpha: true });
  }

  /** How much there is to gain by giving this mascot a program of its own: its pixels, or 0 when it has one, can't
   *  have one, or isn't being drawn. */
  get gain() { return this.own && this.onScreen && !this.still ? this.w * this.h : 0; }

  /** Draw this make-your-own mascot with a program that has its own parts written out. It draws about two and a
   *  half times faster and looks the same, but the program has to be compiled first (about a second on a software
   *  renderer), where the one that reads any parts is shared by every look. So the loop calls this only when frames
   *  come slowly, for the biggest mascot first. */
  specialise() {
    if (!this.own) return;
    const old = this.mat;
    this.mat = this.material(this.own);
    this.own = null;
    this.body.material = this.mat;
    old.dispose();
    this.dirty = true;
  }

  resize() {
    const r = this.host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2) * quality;
    this.w = Math.max(1, Math.round(r.width * dpr));
    this.h = Math.max(1, Math.round(r.height * dpr));
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
    this.uniforms.uPix.value = (2 * Math.tan(THREE.MathUtils.degToRad(this.fov / 2))) / this.h;
    this.dirty = true;
    kick();
  }

  /** Called by the loop: draws when it's time; returns whether this View wants more frames. */
  frame(now: number): boolean {
    if (!this.onScreen || this.w < 2) return false;
    if (this.still || reduceMotion()) {               // still pictures: one frame per change
      if (this.dirty) { this.update(0); this.draw(); this.dirty = false; }
      return false;
    }
    if (this.last && now - this.last < 1000 / this.fps - 2) return true;
    const dt = this.last ? Math.min(0.05, Math.max(0, now - this.last) / 1000) : 1 / this.fps;   // (never backwards: it would wreck the springs)
    this.last = now;
    this.update(dt);
    this.draw();
    return true;
  }

  private draw() {
    const r = gl(this.w, this.h);
    r.setViewport(0, 0, this.w, this.h);
    r.setScissor(0, 0, this.w, this.h);
    r.setScissorTest(true);
    r.clear();
    r.render(this.scene, this.camera);
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.ctx.drawImage(r.domElement, 0, glH - this.h, this.w, this.h, 0, 0, this.w, this.h);
  }

  private setEar(E: Ears, i: number, s: number, twitch: number) {
    this.earE.set(0, s * E.yaw, -s * (E.lean + twitch), "YXZ");
    this.earM.makeRotationFromEuler(this.earE);
    this.v3.set(s * E.off[0], E.off[1], 0).applyMatrix4(this.earM);
    this.v3.x += s * E.base[0]; this.v3.y += E.base[1]; this.v3.z += E.base[2];
    (this.uniforms.uEarC.value as THREE.Vector3[])[i].copy(this.v3);
    (this.uniforms.uEarM.value as THREE.Matrix3[])[i].setFromMatrix4(this.earM).transpose();
  }

  private update(dt: number) {
    const st = this.st, K = this.K, U = this.uniforms, reduce = reduceMotion();
    st.t += dt;
    st.poseT += dt;
    const t = st.t, P = st.pose, pt = st.poseT;
    const spring = (x: number, v: number, target: number, k: number, d: number): [number, number] => {
      const a = (target - x) * k - v * d; v += a * dt; return [x + v * dt, v];
    };
    // where to look: up while thinking, down while asleep, else toward the pointer (or idly around)
    const look = new THREE.Vector2();
    if (P === "think") look.set(-0.5, 0.6);
    else if (P === "sleep") look.set(0, -0.3);
    else if (this.follow && pointer.seen) {
      const r = this.host.getBoundingClientRect();
      look.set(Math.max(-1, Math.min(1, (pointer.x - (r.left + r.width / 2)) / (window.innerWidth * 0.45))),
        Math.max(-1, Math.min(1, (r.top + r.height * 0.45 - pointer.y) / (window.innerHeight * 0.45))));
    } else look.set(Math.sin(t * 0.31) * 0.15, Math.sin(t * 0.23) * 0.08);
    if (dt === 0) { st.look.copy(look); } else {
      [st.look.x, st.lookV.x] = spring(st.look.x, st.lookV.x, look.x, 38, 10);
      [st.look.y, st.lookV.y] = spring(st.look.y, st.lookV.y, look.y, 38, 10);
    }
    this.root.rotation.y = st.look.x * 0.5;
    this.root.rotation.x = -st.look.y * 0.16;

    // tilt: thinking leans in, waving wiggles hello
    let tilt = P === "think" ? 0.07 + Math.sin(t * 1.4) * 0.035 : P === "sleep" ? 0.05 : 0;
    if (P === "wave" && pt < 1.6) tilt = 0.13 * Math.sin(pt * 9) * (1 - ease(pt / 1.6));
    if (dt === 0) st.tilt = tilt; else [st.tilt, st.tiltV] = spring(st.tilt, st.tiltV, tilt, 30, 8);
    this.root.rotation.z = st.tilt;

    // breathing, squash, hop
    const breathe = reduce ? 0 : (P === "sleep" ? 0.02 * Math.sin(t * 1.25) : 0.012 * Math.sin(t * 1.9));
    let hop = 0, sq = 0;
    if (P === "happy" && !reduce) {
      const h = pt / 0.9;
      if (h < 1) {
        if (h < 0.15) sq = -0.12 * Math.sin((h / 0.15) * Math.PI);                       // crouch
        else if (h < 0.7) { const k = (h - 0.15) / 0.55; hop = 0.28 * Math.sin(k * Math.PI); sq = 0.06 * Math.sin(k * Math.PI); }
        else sq = -0.1 * Math.sin(((h - 0.7) / 0.3) * Math.PI);                              // land
      }
    }
    if (st.poke >= 0) {
      st.poke += dt;
      if (st.poke < 0.5) sq += -0.14 * Math.sin(Math.min(1, st.poke / 0.5) * Math.PI) * Math.exp(-st.poke * 3); else st.poke = -1;
    }
    this.root.position.y = hop;
    const s = 1 + breathe + sq;
    this.squash.scale.set(1 / Math.sqrt(s), s, 1 / Math.sqrt(s));
    this.shadow.scale.setScalar(1 - hop * 0.7);
    this.shadow.material.opacity = 1 - hop * 1.2;

    // eyes: blink, expressions, and a glance toward the target
    let mode = K.rest, open = 1;
    if (P === "wave" || P === "happy") mode = 1;
    else if (P === "sleep") mode = 2;
    else if (mode === 0 && !reduce) {
      st.blinkIn -= dt;
      if (st.blinkIn <= 0 && st.blinkT < 0) { st.blinkT = 0; st.blinkIn = Math.random() < 0.18 ? 0.28 : 2.4 + Math.random() * 3.2; }
      if (st.blinkT >= 0) { st.blinkT += dt; const b = st.blinkT / 0.15; open = b < 1 ? Math.abs(1 - 2 * b) : 1; if (b >= 1) st.blinkT = -1; }
    }
    if ((P === "wave" && pt > 1.9) || (P === "happy" && pt > 1.4) || (reduce && (P === "wave" || P === "happy"))) {
      st.pose = "idle"; st.poseT = 0;
    }
    const E = K.eye, gx = st.look.x * 0.04, gy = st.look.y * 0.03;
    (U.uEye.value as THREE.Vector4[])[0].set(-E.x + gx, E.y + gy, E.rx, E.ry);
    (U.uEye.value as THREE.Vector4[])[1].set(E.x + gx, E.y + gy, E.rx, E.ry);
    U.uEyeMode.value = mode;
    U.uEyeOpen.value = Math.max(0.05, open);
    if (this.built) this.setSolids(this.built.solids(mode, open, gx, gy));   // its eyes are parts: open, blinking, smiling or shut
    U.uSway.value = reduce ? 0 : t * 1.4;
    U.uTime.value = reduce ? 0 : t;

    const ears = K.ears;
    if (ears) {   // a little twitch now and then, a perk when waving
      [-1, 1].forEach((sgn, i) => {
        const tw = Math.max(0, Math.sin(t * 0.9 + sgn * 1.7) - 0.92) * 4;
        this.setEar(ears, i, sgn, tw * 0.2 + (P === "wave" ? 0.06 * Math.sin(pt * 9) : 0) + (P === "sleep" ? -0.1 : 0));
      });
    }
    // props
    const H = K.top, bx = K.box[3];
    st.flake += ((P === "think" ? 1 : 0) - st.flake) * (dt === 0 ? 1 : 1 - Math.exp(-dt * 6));
    this.flake.visible = st.flake > 0.01;
    this.flake.material.opacity = st.flake;
    this.flake.material.rotation = reduce ? 0 : Math.sin(t * 2.0) * 0.25;
    this.flake.scale.setScalar(0.3 * (0.5 + 0.5 * st.flake));
    this.flake.position.set(bx * 0.82, H + 0.42 + (reduce ? 0 : Math.sin(t * 1.6) * 0.04), 0.3);
    st.zz += ((P === "sleep" ? 1 : 0) - st.zz) * (dt === 0 ? 1 : 1 - Math.exp(-dt * 4));
    this.zs.forEach((z, i) => {
      const k = reduce ? 0.5 + i * 0.25 : (t * 0.42 + i * 0.5) % 1;
      z.visible = st.zz > 0.01;
      z.position.set(bx * 0.62 + k * 0.32, H * 0.95 + k * 0.5, 0.3);
      z.material.opacity = st.zz * Math.sin(Math.PI * k);
      z.scale.setScalar((0.15 + 0.12 * k) * (i ? 0.85 : 1));
    });

    // camera and lights, in the mascot's own space
    this.body.updateWorldMatrix(true, false);
    (U.uCam.value as THREE.Vector3).copy(this.camera.position);
    this.body.worldToLocal(U.uCam.value as THREE.Vector3);
    this.body.getWorldQuaternion(this.q);
    this.qi.copy(this.q).invert();
    (U.uKey.value as THREE.Vector3).copy(this.KEY).applyQuaternion(this.qi);
    (U.uFill.value as THREE.Vector3).copy(this.FILL).applyQuaternion(this.qi);
    (U.uBack.value as THREE.Vector3).copy(this.BACK).applyQuaternion(this.qi);
    (U.uUp.value as THREE.Vector3).set(0, 1, 0).applyQuaternion(this.qi);
    (U.uFwd.value as THREE.Vector3).set(0, 0, 1).applyQuaternion(this.qi);
  }

  dispose() {
    views.delete(this);
    this.ro.disconnect();
    this.io.disconnect();
    this.canvas.removeEventListener("pointerdown", this.poke);
    this.canvas.remove();
    this.mat.dispose();
    this.geos.forEach((g) => g.dispose());
    this.disposables.forEach((d) => d.dispose());
  }
}
