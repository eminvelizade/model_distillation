import { useSyncExternalStore } from "react";
import bloom from "./stills/bloom.webp";

/** An agent looks like ModelLab's built-in mascot (Bloom, a furry cub modelled on a real plush) or like one the user
 *  put together (a Look, below). This file is the light part (names, the still picture, the options); the 3D renderer
 *  (./mascot/engine.ts, with three.js) loads on demand. The hub's persona list (hub/yeti.py, MASCOTS) uses the same
 *  keys, and hub/agents.py the same options. */
export type MascotKind = "bloom";
export type MascotPose = "idle" | "wave" | "think" | "happy" | "sleep";

export const MASCOT_LIST: { kind: MascotKind; name: string; tagline: string }[] = [
  { kind: "bloom", name: "Bloom", tagline: "a fluffy little cub who helps your models bloom" },
];
export const MASCOT_NAMES = Object.fromEntries(MASCOT_LIST.map((m) => [m.kind, m.name])) as Record<MascotKind, string>;

/** A still picture of the built-in mascot (rendered from the 3D one): shown while the renderer loads, and where WebGL is off. */
export const STILLS: Record<MascotKind, string> = { bloom };

// ---------------------------------------------------------------- the agent on screen
/** What an agent looks like: a built-in mascot, or a make-your-own one. Kept on the hub with the agent. */
export type AgentLook = { base: MascotKind } | ({ base: "fuzzy" } & Look);
export const isBuiltIn = (l: AgentLook): l is { base: MascotKind } => l.base !== "fuzzy";

let current: { name: string; look: AgentLook } = { name: MASCOT_NAMES.bloom, look: { base: "bloom" } };
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
/** What a make-your-own mascot is made of. Plush, cotton and boucle are pile, drawn as a volume of fibres (thick combed
 *  strands, a short brushed nap, curls); elastane, sugar and clay are surfaces, each with its own shader in
 *  mascot/materials/. */
export type Material = "plush" | "cotton" | "boucle" | "elastane" | "sugar" | "clay";

/** A mascot the user put together: a body in a material and a colour, with eyes, and glasses or an extra if they
 *  like. Drawn by the same renderer (mascot/looks.ts turns it into parts). */
export type Look = {
  shape: "pom" | "bean" | "drop" | "gumdrop" | "cub" | "frog" | "tofu" | "kitten";
  material?: Material;       // (plush when it isn't said: looks saved before there were materials)
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
  material: [["plush", "Plush"], ["cotton", "Cotton"], ["boucle", "Bouclé"], ["elastane", "Elastane"], ["sugar", "Sugar"], ["clay", "Clay"]],
  colour: [["ice", "Ice"], ["sky", "Sky"], ["teal", "Teal"], ["mint", "Mint"], ["lime", "Lime"], ["sun", "Sun"], ["tangerine", "Tangerine"],
    ["coral", "Coral"], ["cherry", "Cherry"], ["cobalt", "Cobalt"], ["snow", "Snow"], ["ink", "Ink"]],
  eyes: [["bean", "Bean"], ["round", "Round"], ["bead", "Bead"], ["googly", "Googly"], ["sparkle", "Sparkle"], ["smile", "Smile"]],
  glasses: [["none", "None"], ["round", "Round"], ["shades", "Shades"]],
  extra: [["none", "None"], ["headphones", "Headphones"], ["beanie", "Beanie"], ["sprout", "Sprout"], ["antenna", "Antenna"], ["scarf", "Scarf"],
    ["cap", "Cap"], ["tuft", "Tuft"]],
} as const;
export const DEFAULT_LOOK: Look = { shape: "pom", material: "plush", colour: "lime", accent: "ice", eyes: "bean", glasses: "none", extra: "none" };

/** The colour an agent's thread takes (its messages' tint, its header): its dye, or Bloom's blue. */
export function agentColour(look: AgentLook): string {
  if (isBuiltIn(look)) return "#3d82dc";
  return look.colour === "snow" ? "#3d82dc" : look.colour === "ink" ? "#475569" : COLOURS[look.colour] ?? "#3d82dc";
}
