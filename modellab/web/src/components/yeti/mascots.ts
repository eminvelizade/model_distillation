import { useSyncExternalStore } from "react";
import bloom from "./stills/bloom.webp";
import bop from "./stills/bop.webp";
import mochi from "./stills/mochi.webp";
import pip from "./stills/pip.webp";
import rime from "./stills/rime.webp";
import twinkle from "./stills/twinkle.webp";

/** An agent looks like one of ModelLab's built-in mascots (Bloom, a furry cub modelled on a real plush, four plush ones
 *  and a snow golem) or like one the user put together (a Look, below). This file is the light part (names, still
 *  pictures, the options); the 3D renderer (./mascot/engine.ts, with three.js) loads on demand. The hub's persona
 *  list (hub/yeti.py, MASCOTS) uses the same keys, and hub/agents.py the same options. */
export type MascotKind = "bloom" | "mochi" | "bop" | "twinkle" | "pip" | "rime";
export type MascotPose = "idle" | "wave" | "think" | "happy" | "sleep";

export const MASCOT_LIST: { kind: MascotKind; name: string; tagline: string }[] = [
  { kind: "bloom", name: "Bloom", tagline: "a fluffy little cub who helps your models bloom" },
  { kind: "mochi", name: "Dr. Mochi", tagline: "a scientist who runs your experiments" },
  { kind: "bop", name: "Bop", tagline: "always vibing, always on it" },
  { kind: "twinkle", name: "Twinkle", tagline: "a star who cheers every finished run" },
  { kind: "pip", name: "Pip", tagline: "small, quick and curious" },
  { kind: "rime", name: "Rime", tagline: "a tall, quiet snow golem who notices everything" },
];
export const MASCOT_NAMES = Object.fromEntries(MASCOT_LIST.map((m) => [m.kind, m.name])) as Record<MascotKind, string>;

/** A still picture of each mascot (rendered from the 3D one): shown while the renderer loads, and where WebGL is off. */
export const STILLS: Record<MascotKind, string> = { bloom, mochi, bop, twinkle, pip, rime };

// ---------------------------------------------------------------- the agent on screen
/** What an agent looks like: a built-in mascot, or a make-your-own one. Kept on the hub with the agent. */
export type AgentLook = { base: MascotKind } | ({ base: "fuzzy" } & Look);
export const isBuiltIn = (l: AgentLook): l is { base: MascotKind } => l.base !== "fuzzy";

const KEY = "modellab-mascot";   // (where the choice lived before agents were kept on the hub: read once, to carry it over)
const isKind = (v: unknown): v is MascotKind => MASCOT_LIST.some((m) => m.kind === v);
/** The built-in mascot this browser had picked before agents existed (the first agent starts as it). */
export const legacyMascot = (): MascotKind => { try { const v = localStorage.getItem(KEY); return isKind(v) ? v : "bloom"; } catch { return "bloom"; } };

let current: { name: string; look: AgentLook } = { name: MASCOT_NAMES[legacyMascot()], look: { base: legacyMascot() } };
const subs = new Set<() => void>();

/** The agent the user is talking to (set by YetiContext when the team loads or the user switches). */
export function setCurrentAgent(name: string, look: AgentLook) {
  if (name === current.name && JSON.stringify(look) === JSON.stringify(current.look)) return;
  current = { name, look };
  subs.forEach((f) => f());
}

/** The current agent's name and look. `kind` is its built-in mascot, or Bloom for a make-your-own one (for the places
 *  that still need a still picture). */
export function useMascot(): { kind: MascotKind; name: string; look: AgentLook } {
  const c = useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => current);
  return { kind: isBuiltIn(c.look) ? c.look.base : "bloom", name: c.name, look: c.look };
}

// ---------------------------------------------------------------- make your own
/** A mascot the user put together: a body of short curly pile in a colour, with eyes, and glasses or an extra if they
 *  like. Drawn by the same renderer (mascot/looks.ts turns it into parts). */
export type Look = {
  shape: "pom" | "bean" | "drop" | "gumdrop" | "cub" | "frog" | "tofu" | "kitten";
  colour: string;            // a key of COLOURS
  accent?: string;           // the extra's colour (a key of COLOURS)
  eyes: "bean" | "round" | "bead" | "googly" | "sparkle" | "smile";
  glasses: "none" | "round" | "shades";
  extra: "none" | "headphones" | "beanie" | "sprout" | "antenna" | "scarf" | "cap" | "tuft";
};
/** The dye colours: ModelLab's ice blues first, then the rest of a bright palette (no purple or pink: DESIGN.md). */
export const COLOURS: Record<string, string> = {
  ice: "#3d9bf2", sky: "#38c6f4", teal: "#12c2ad", mint: "#3ddc97", lime: "#a8dc38", sun: "#ffc928", tangerine: "#ff8a1f",
  coral: "#ff6658", cherry: "#f0413c", cobalt: "#2a62f0", snow: "#f3f6fb", ink: "#3b4252", leaf: "#58c038",
};
export const LOOK_OPTIONS = {
  shape: [["pom", "Pom"], ["bean", "Bean"], ["drop", "Drop"], ["gumdrop", "Gumdrop"], ["cub", "Cub"], ["frog", "Frog"], ["tofu", "Tofu"], ["kitten", "Kitten"]],
  colour: [["ice", "Ice"], ["sky", "Sky"], ["teal", "Teal"], ["mint", "Mint"], ["lime", "Lime"], ["sun", "Sun"], ["tangerine", "Tangerine"],
    ["coral", "Coral"], ["cherry", "Cherry"], ["cobalt", "Cobalt"], ["snow", "Snow"], ["ink", "Ink"]],
  eyes: [["bean", "Bean"], ["round", "Round"], ["bead", "Bead"], ["googly", "Googly"], ["sparkle", "Sparkle"], ["smile", "Smile"]],
  glasses: [["none", "None"], ["round", "Round"], ["shades", "Shades"]],
  extra: [["none", "None"], ["headphones", "Headphones"], ["beanie", "Beanie"], ["sprout", "Sprout"], ["antenna", "Antenna"], ["scarf", "Scarf"],
    ["cap", "Cap"], ["tuft", "Tuft"]],
} as const;
export const DEFAULT_LOOK: Look = { shape: "pom", colour: "lime", accent: "ice", eyes: "bean", glasses: "none", extra: "none" };

/** The colour an agent's thread takes (its messages' tint, its header): its dye, or its built-in mascot's main colour. */
export function agentColour(look: AgentLook): string {
  if (isBuiltIn(look)) return ({ bloom: "#3d82dc", mochi: "#f97316", bop: "#2a62f0", twinkle: "#eab308", pip: "#65a30d", rime: "#64748b" } as Record<MascotKind, string>)[look.base];
  return look.colour === "snow" ? "#3d82dc" : look.colour === "ink" ? "#475569" : COLOURS[look.colour] ?? "#3d82dc";
}
