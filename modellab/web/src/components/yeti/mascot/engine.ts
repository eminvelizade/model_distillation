import * as THREE from "three";
import type { MascotKind, MascotPose } from "../mascots";
import { BOP, COMMON, MOCHI, PIP, RENDER, RIME, TWINKLE, VERT, YETI } from "./shaders";

/** The 3D mascots, drawn live with three.js.
 *
 *  A page can show many mascots at once (the dock button, the chat header, an avatar on every answer, an Explain pill
 *  next to each result), but a browser only allows about 16 WebGL contexts. So there's ONE renderer: each mascot is a
 *  View with its own scene and a plain 2D canvas, and the shared renderer draws a View into a corner of its own canvas,
 *  which is then copied onto the View's. One animation loop runs the Views that are on screen, each at its own frame
 *  rate, and stops when none are. With "reduce motion" on, Views draw one still frame per change instead. */

// raise: the arm's angle at the top of a wave (from straight up, outward is negative); fwd: how far forward it comes
type Arm = { shoulder: [number, number, number]; len: number; rest: number; hide: boolean; raise?: number; fwd?: number };
type Spec = {
  glsl: string; box: number[]; cam: [number, number, number, number]; top: number; shadow: [number, number];
  eye: { x: number; y: number; rx: number; ry: number }; eyeZ: number; faceR: number;
  nose: [number, number, number, number]; mouth: [number, number, number, number]; blush: [number, number, number, number];
  rest: number; prop: string; exposure: number; colors: { main: string; accent: string; blush: string; extra: string };
  ears?: boolean; petals?: boolean; bubbles?: boolean; arm?: Arm;
  stoic?: boolean;          // never smiles (Rime): no happy eyes, a slow, stiff wave
  frost?: boolean;          // has frost drifting round it (uFrost*)
  flake?: "snow";           // thinks in snowflakes (else sparkles)
};

// Shapes, faces and palette colours (ModelLab's ice scale and the Tailwind palette). Positions are in each mascot's
// own units (floor at y = 0, facing +z); exposures were set by measuring each render against its palette swatch.
const SPECS: Record<MascotKind, Spec> = {
  yeti: {
    glsl: YETI, box: [-1.34, -0.1, -1.1, 1.34, 2.3, 1.15], cam: [2.42, 9.9, 1.02, 18], top: 1.58, shadow: [2.7, 1.6],
    eye: { x: 0.35, y: 0.678, rx: 0.068, ry: 0.1 }, eyeZ: 0, faceR: 1, nose: [0, 0.607, 0.031, 0.009], mouth: [0, 0, 0, 0],
    blush: [0.57, 0.5, 0.8, 0.2], ears: true, petals: true, rest: 0, prop: "#7eb0ee", exposure: 1.1,
    arm: { shoulder: [0.82, 0.76, 0.3], len: 0.44, rest: 2.6, hide: true },   // tucked inside the body until it waves
    colors: { main: "#f3f8fe", accent: "#7eb0ee", blush: "#a6c9f2", extra: "#7eb0ee" },   // ice-50, ice-400, ice-300
  },
  mochi: {
    glsl: MOCHI, box: [-1.0, -0.1, -0.92, 1.0, 1.92, 0.95], cam: [2.2, 9.6, 0.9, 17], top: 1.72, shadow: [2.1, 1.5],
    eye: { x: 0.28, y: 1.12, rx: 0.068, ry: 0.086 }, eyeZ: 0.5813, faceR: 0.711, nose: [0, 0, 0, 0], mouth: [0, 0.885, 0.062, 0.011],
    blush: [0.44, 0.9, 0.538, 0.12], rest: 0, prop: "#14b8a6", bubbles: true, exposure: 1.13,
    arm: { shoulder: [0.7, 0.62, 0.12], len: 0.3, rest: Math.PI + 0.45, hide: false },
    colors: { main: "#fb923c", accent: "#14b8a6", blush: "#ea580c", extra: "#f8fafc" },   // orange-400, teal-500, orange-600, slate-50
  },
  bop: {
    glsl: BOP, box: [-0.98, -0.1, -0.86, 0.98, 2.1, 0.86], cam: [2.3, 9.6, 0.98, 17], top: 1.82, shadow: [1.9, 1.3],
    eye: { x: 0.22, y: 1.12, rx: 0.06, ry: 0.07 }, eyeZ: 0, faceR: 0.6, nose: [0, 0, 0, 0], mouth: [0, 0.94, 0.07, 0.01],
    blush: [0.36, 0.98, 0.42, 0.12], rest: 1, prop: "#3d82dc", exposure: 1.12,
    colors: { main: "#3d82dc", accent: "#fbbf24", blush: "#7eb0ee", extra: "#3d82dc" },   // ice-500, amber-400, ice-400
  },
  twinkle: {
    glsl: TWINKLE, box: [-1.14, -0.1, -0.64, 1.14, 2.04, 0.64], cam: [2.2, 9.6, 0.92, 17], top: 1.82, shadow: [2.0, 1.1],
    eye: { x: 0.21, y: 1.0, rx: 0.065, ry: 0.082 }, eyeZ: 0.44, faceR: 5.0, nose: [0, 0, 0, 0], mouth: [0, 0.83, 0.07, 0.011],
    blush: [0.39, 0.86, 0.36, 0.13], rest: 0, prop: "#f59e0b", exposure: 1.13,
    colors: { main: "#facc15", accent: "#f59e0b", blush: "#fb923c", extra: "#facc15" },   // yellow-400, amber-500, orange-400
  },
  pip: {
    glsl: PIP, box: [-0.98, -0.1, -0.86, 0.98, 1.88, 1.0], cam: [2.1, 9.4, 0.86, 17], top: 1.6, shadow: [1.9, 1.4],
    eye: { x: 0.22, y: 0.96, rx: 0.07, ry: 0.088 }, eyeZ: 0.67, faceR: 0.7, nose: [0, 0, 0, 0], mouth: [0, 0, 0, 0],
    blush: [0.42, 0.74, 0.58, 0.12], rest: 0, prop: "#84cc16", exposure: 1.0,
    colors: { main: "#a3e635", accent: "#f97316", blush: "#facc15", extra: "#a3e635" },   // lime-400, orange-500, yellow-400
  },
  rime: {
    glsl: RIME, box: [-1.36, -0.1, -1.36, 1.36, 2.45, 1.36], cam: [2.3, 9.9, 1.02, 15.5], top: 1.7, shadow: [2.0, 1.4],
    eye: { x: 0.17, y: 1.32, rx: 0.048, ry: 0.056 }, eyeZ: 0.455, faceR: 3.0, nose: [0, 0, 0, 0], mouth: [0, 0, 0, 0],
    blush: [0.3, 1.2, 0.45, 0], rest: 0, prop: "#7eb0ee", exposure: 1.04, stoic: true, frost: true, flake: "snow",
    arm: { shoulder: [0.4, 0.84, 0.03], len: 0.52, rest: Math.PI + 0.24, hide: false, raise: -0.9, fwd: 0.12 },   // hangs; waves out to the side
    colors: { main: "#f3f7fc", accent: "#713f12", blush: "#22c55e", extra: "#7eb0ee" },   // snow, yellow-900 (twigs), green-500 (sprout), ice-400
  },
};

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
  // if frames come slower than ~40 fps, draw every mascot with fewer pixels (and more again when there's room)
  const ms = lastLoop ? now - lastLoop : 16;
  lastLoop = now;
  if (ms > 25 && ms < 200) { if (++slowFrames > 30 && quality > 0.6) { quality = Math.max(0.6, quality - 0.2); slowFrames = 0; views.forEach((v) => v.resize()); } }
  else slowFrames = Math.max(0, slowFrames - 1);
  let any = false;
  for (const v of views) if (v.frame(now)) any = true;
  if (any) raf = requestAnimationFrame(loop);
  else lastLoop = 0;
}

// ---------------------------------------------------------------- one mascot
export type ViewOptions = { kind: MascotKind; pose?: MascotPose; fps?: number; follow?: boolean; zoom?: number };

export class View {
  private K: Spec;
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
  private bubbles: THREE.Sprite[];
  private zs: THREE.Sprite[];
  private ro: ResizeObserver;
  private io: IntersectionObserver;
  private w = 1; private h = 1; private fov: number;
  private onScreen = true; private last = 0; private dirty = true;
  private fps: number; private follow: boolean;
  private st = {
    pose: "idle" as MascotPose, poseT: 0, t: Math.random() * 10, blinkIn: 1.6 + Math.random() * 2, blinkT: -1,
    look: new THREE.Vector2(), lookV: new THREE.Vector2(), poke: -1, tilt: 0, tiltV: 0, flake: 0, zz: 0, bub: 0,
    frost: Math.random() * 40,
  };
  private earM = new THREE.Matrix4(); private earE = new THREE.Euler(); private v3 = new THREE.Vector3();
  private q = new THREE.Quaternion(); private qi = new THREE.Quaternion();
  private KEY = new THREE.Vector3(-0.42, 0.78, 0.5).normalize();    // big softbox, in front and above
  private FILL = new THREE.Vector3(0.85, 0.15, 0.5).normalize();    // fill from the other side
  private BACK = new THREE.Vector3(0.25, 0.6, -0.76).normalize();   // rim light, behind and above

  constructor(private host: HTMLElement, o: ViewOptions) {
    const K = (this.K = SPECS[o.kind]);
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
      uExposure: { value: K.exposure },
      uMain: { value: C(K.colors.main) }, uAccent: { value: C(K.colors.accent) }, uBlushC: { value: C(K.colors.blush) }, uExtra: { value: C(K.colors.extra) },
      uPeel: { value: 0 },
      uEye: { value: [new THREE.Vector4(), new THREE.Vector4()] }, uEyeZ: { value: K.eyeZ }, uFaceR: { value: K.faceR },
      uEyeMode: { value: K.rest }, uEyeOpen: { value: 1 },
      uNose: { value: v4(K.nose) }, uMouth: { value: v4(K.mouth) },
      uBlush: { value: [v4([-K.blush[0], K.blush[1], K.blush[2], K.blush[3]]), v4(K.blush)] },
      uEarC: { value: [new THREE.Vector3(), new THREE.Vector3()] }, uEarM: { value: [new THREE.Matrix3(), new THREE.Matrix3()] },
      uArmA: { value: new THREE.Vector3() }, uArmB: { value: new THREE.Vector3() }, uArmOn: { value: 0 },
      uPetal: { value: [0, 1, 2].map(() => new THREE.Vector4()) }, uCurl: { value: [0, 1, 2].map(() => new THREE.Vector3()) },
      uPetalRoot: { value: new THREE.Vector3(0, 1.49, 0.1) }, uSway: { value: 0 },
      uFrostT: { value: 0 }, uFrostR: { value: 1 }, uFrostC: { value: C("#3d82dc") },
    };
    const box = new THREE.BoxGeometry(boxMax.x - boxMin.x, boxMax.y - boxMin.y, boxMax.z - boxMin.z);
    box.translate((boxMax.x + boxMin.x) / 2, (boxMax.y + boxMin.y) / 2, (boxMax.z + boxMin.z) / 2);
    this.geos.push(box);
    this.mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: COMMON + K.glsl + RENDER, uniforms: this.uniforms,
      transparent: true, depthWrite: false, premultipliedAlpha: true });
    this.body = new THREE.Mesh(box, this.mat);
    this.body.frustumCulled = false;
    this.root.add(this.squash);
    this.squash.add(this.body);
    this.scene.add(this.root);

    // a soft contact shadow on the floor
    const sc = document.createElement("canvas");
    sc.width = sc.height = 128;
    const sx = sc.getContext("2d")!;
    const grad = sx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(30,40,60,0.4)");
    grad.addColorStop(0.5, "rgba(30,40,60,0.14)");
    grad.addColorStop(1, "rgba(30,40,60,0)");
    sx.fillStyle = grad;
    sx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(sc);
    const plane = new THREE.PlaneGeometry(K.shadow[0], K.shadow[1]);
    this.shadow = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.set(0, 0.002, 0.04);
    this.shadow.renderOrder = -1;
    this.scene.add(this.shadow);
    this.disposables.push(shadowTex, plane, this.shadow.material);

    // props: a snowflake (Yeti, Rime) or a sparkle while thinking, bubbles for the scientist, z's while asleep
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
      if (K.ears || K.flake === "snow") {
        x.strokeStyle = K.prop; x.lineWidth = 9; x.lineCap = "round";
        for (let i = 0; i < 6; i++) {
          x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -52); x.moveTo(0, -31); x.lineTo(-15, -45); x.moveTo(0, -31); x.lineTo(15, -45);
          x.stroke(); x.rotate(Math.PI / 3);
        }
      } else {
        x.fillStyle = K.prop;
        x.beginPath();
        for (let i = 0; i < 4; i++) { x.quadraticCurveTo(0, 0, 0, -56); x.quadraticCurveTo(0, 0, 56, 0); x.rotate(Math.PI / 2); }
        x.fill();
      }
    });
    this.bubbles = K.bubbles ? [0, 1, 2].map(() => sprite((x) => {
      x.beginPath(); x.arc(64, 64, 50, 0, Math.PI * 2);
      x.fillStyle = K.prop + "40"; x.fill();
      x.lineWidth = 9; x.strokeStyle = K.prop; x.stroke();
      x.beginPath(); x.arc(46, 46, 11, 0, Math.PI * 2); x.fillStyle = "#ffffffcc"; x.fill();
    })) : [];
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
    (this.uniforms.uBackCol.value as THREE.Color).set("#ffffff").multiplyScalar(dark ? 0.85 : 0.58);   // the rim glow reads better on dark
    this.shadow.material.color.set(dark ? "#000000" : "#ffffff");
    (this.uniforms.uFrostC.value as THREE.Color).set(dark ? "#cfe1f8" : "#3d82dc");   // frost: pale on dark, deeper blue on light
    this.dirty = true;
    kick();
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
    if (reduceMotion()) {               // still pictures: one frame per change
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

  private setEar(i: number, s: number, twitch: number) {
    const base = new THREE.Vector3(s * 0.7, 1.14, 0.12);   // where the ear meets the head
    this.earE.set(0, s * 0.28, -s * (0.5 + twitch), "YXZ");
    this.earM.makeRotationFromEuler(this.earE);
    this.v3.set(s * 0.1, 0.16, 0).applyMatrix4(this.earM).add(base);
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

    // tilt: thinking leans in, waving leans away (or, without an arm, wiggles hello)
    let tilt = P === "think" ? 0.07 + Math.sin(t * 1.4) * 0.035 : P === "wave" && pt < 1.7 ? 0.05 : P === "sleep" ? 0.05 : 0;
    if (P === "wave" && !K.arm && pt < 1.6) tilt = 0.13 * Math.sin(pt * 9) * (1 - ease(pt / 1.6));
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
    if ((P === "wave" || P === "happy") && !K.stoic) mode = 1;   // (Rime never smiles)
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
    U.uSway.value = reduce ? 0 : t * 1.4;

    if (K.ears) {   // a little twitch now and then, a perk when waving
      [-1, 1].forEach((sgn, i) => {
        const tw = Math.max(0, Math.sin(t * 0.9 + sgn * 1.7) - 0.92) * 4;
        this.setEar(i, sgn, tw * 0.2 + (P === "wave" ? 0.06 * Math.sin(pt * 9) : 0) + (P === "sleep" ? -0.1 : 0));
      });
    }
    if (K.petals) {   // Yeti's tuft: a tall middle lobe that curls over and two smaller ones; they sway a little
      const PETALS: [number, number, number, number[]][] = [[0.0, 0.12, 0.42, [0.3, 0.0, 0.3]], [-0.52, 0.05, 0.3, [-0.55, -0.1, 0.05]], [0.55, 0.0, 0.3, [0.55, -0.1, 0.05]]];
      const sway = reduce ? 0 : 1;
      PETALS.forEach(([a, b, len, curl], i) => {
        const aa = a + sway * 0.05 * Math.sin(t * 1.3 + i * 1.9), bb = b + sway * 0.04 * Math.sin(t * 0.9 + i);
        this.v3.set(Math.sin(aa), Math.cos(aa) * Math.cos(bb), Math.sin(bb) * 0.8 + 0.1).normalize();
        (U.uPetal.value as THREE.Vector4[])[i].set(this.v3.x, this.v3.y, this.v3.z, len);
        (U.uCurl.value as THREE.Vector3[])[i].set(curl[0], curl[1], curl[2]);
      });
    }
    if (K.arm) {     // the arm on the viewer's right rises, waves and comes back down
      let up = 0, ang = K.arm.raise ?? -0.38;
      if (P === "wave") {
        up = ease(pt / 0.4) * (1 - ease((pt - 1.45) / 0.4));
        ang += (K.stoic ? 0.16 * Math.sin((pt - 0.4) * 6) : 0.26 * Math.sin((pt - 0.4) * 11)) * (pt > 0.4 && pt < 1.45 ? 1 : 0);
      }
      U.uArmOn.value = !K.arm.hide || up > 0.01 ? 1 : 0;
      const a = K.arm.rest + (ang + Math.PI * 2 - K.arm.rest) * up;
      const [sx, sy, sz] = K.arm.shoulder, L = K.arm.len;
      (U.uArmA.value as THREE.Vector3).set(sx, sy, sz);
      (U.uArmB.value as THREE.Vector3).set(sx - Math.sin(a) * L, sy + Math.cos(a) * L, sz + (K.arm.fwd ?? 0.04) * up);
    }
    if (K.frost) {   // the frost drifts faster while thinking, slower asleep, and puffs out on a hop
      st.frost += reduce ? 0 : dt * (P === "think" ? 2.6 : P === "sleep" ? 0.35 : 1);
      U.uFrostT.value = st.frost;
      U.uFrostR.value = 1 + (P === "happy" && !reduce ? 0.2 * Math.sin(Math.PI * Math.min(1, pt / 1.2)) : 0);
    }

    // props
    const H = K.top, bx = K.box[3];
    st.flake += ((P === "think" ? 1 : 0) - st.flake) * (dt === 0 ? 1 : 1 - Math.exp(-dt * 6));
    this.flake.visible = st.flake > 0.01 && !K.bubbles;
    this.flake.material.opacity = st.flake;
    this.flake.material.rotation = reduce ? 0 : (K.ears || K.flake ? t * 0.8 : Math.sin(t * 2.0) * 0.25);
    this.flake.scale.setScalar(0.3 * (0.5 + 0.5 * st.flake));
    this.flake.position.set(bx * 0.82, H + 0.42 + (reduce ? 0 : Math.sin(t * 1.6) * 0.04), 0.3);
    st.bub += ((P === "think" ? 1 : 0) - st.bub) * (dt === 0 ? 1 : 1 - Math.exp(-dt * 5));
    this.bubbles.forEach((b, i) => {
      const k = reduce ? 0.3 + i * 0.25 : (t * 0.45 + i / 3) % 1;
      b.visible = st.bub > 0.01;
      b.position.set(bx * 0.62 + Math.sin(k * 7 + i * 2) * 0.06, H * 0.88 + k * 0.62, 0.3);
      b.material.opacity = st.bub * Math.sin(Math.PI * Math.min(1, k * 1.2));
      b.scale.setScalar(0.09 + 0.1 * k + 0.02 * i);
    });
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
