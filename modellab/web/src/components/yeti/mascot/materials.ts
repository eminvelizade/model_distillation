// The surface materials a make-your-own mascot's body can be made of. Each is a GLSL file in ./materials that
// defines matShade (and matDisplace, if it has relief); ./materials/_lib.glsl is what they all share and says how
// one is written. The engine pastes one material into a program (see program() in ./engine.ts). Plush isn't here:
// it is the pile itself, drawn as a volume of fibres.
import type { Material } from "../mascots";
import lib from "./materials/_lib.glsl?raw";
import boucle from "./materials/boucle.glsl?raw";
import clay from "./materials/clay.glsl?raw";
import cotton from "./materials/cotton.glsl?raw";
import elastane from "./materials/elastane.glsl?raw";
import sugar from "./materials/sugar.glsl?raw";

export const MATLIB = lib;
const SOURCES: Record<Exclude<Material, "plush">, string> = { cotton, boucle, elastane, sugar, clay };

/** A material's two pieces: its header (defines that go before everything else) and its body. */
export function material(m: Exclude<Material, "plush">): { header: string; body: string } {
  const src = SOURCES[m] ?? SOURCES.cotton, at = src.indexOf("//#body");
  if (at < 0) return { header: "", body: src };
  const h = src.indexOf("//#header");
  return { header: h >= 0 ? src.slice(h, at) : "", body: src.slice(at) };
}
