import { useSyncExternalStore } from "react";
import bop from "./stills/bop.webp";
import mochi from "./stills/mochi.webp";
import pip from "./stills/pip.webp";
import rime from "./stills/rime.webp";
import twinkle from "./stills/twinkle.webp";
import yeti from "./stills/yeti.webp";

/** The assistant is one of ModelLab's mascots (five plush, one snow golem). This file is the light part (names and
 *  still pictures); the 3D renderer (./mascot/engine.ts, with three.js) loads on demand. The hub's persona list
 *  (hub/yeti.py, MASCOTS) uses the same keys. */
export type MascotKind = "yeti" | "mochi" | "bop" | "twinkle" | "pip" | "rime";
export type MascotPose = "idle" | "wave" | "think" | "happy" | "sleep";

export const MASCOT_LIST: { kind: MascotKind; name: string; tagline: string }[] = [
  { kind: "yeti", name: "Yeti", tagline: "a snow creature who explains your models" },
  { kind: "mochi", name: "Dr. Mochi", tagline: "a scientist who runs your experiments" },
  { kind: "bop", name: "Bop", tagline: "always vibing, always on it" },
  { kind: "twinkle", name: "Twinkle", tagline: "a star who cheers every finished run" },
  { kind: "pip", name: "Pip", tagline: "small, quick and curious" },
  { kind: "rime", name: "Rime", tagline: "a quiet snow golem who notices everything" },
];
export const MASCOT_NAMES = Object.fromEntries(MASCOT_LIST.map((m) => [m.kind, m.name])) as Record<MascotKind, string>;

/** A still picture of each mascot (rendered from the 3D one): shown while the renderer loads, and where WebGL is off. */
export const STILLS: Record<MascotKind, string> = { yeti, mochi, bop, twinkle, pip, rime };

// ---------------------------------------------------------------- which mascot is the assistant (this browser)
const KEY = "modellab-mascot";
const isKind = (v: unknown): v is MascotKind => MASCOT_LIST.some((m) => m.kind === v);
let current: MascotKind = (() => { try { const v = localStorage.getItem(KEY); return isKind(v) ? v : "yeti"; } catch { return "yeti"; } })();
const subs = new Set<() => void>();

/** The mascot picked in this browser (outside React: the chat request names it, so Claude speaks as it). */
export const currentMascot = (): MascotKind => current;

export function setMascot(kind: MascotKind) {
  if (kind === current) return;
  current = kind;
  try { localStorage.setItem(KEY, kind); } catch { /* private window: this tab only */ }
  subs.forEach((f) => f());
}

export function useMascot(): { kind: MascotKind; name: string } {
  const kind = useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => current);
  return { kind, name: MASCOT_NAMES[kind] };
}
