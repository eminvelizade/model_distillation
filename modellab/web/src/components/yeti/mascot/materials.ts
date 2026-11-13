// The surface materials a make-your-own mascot's body can be made of (clay, today). Each is a GLSL file
// in ./materials that defines matShade (and matDisplace, if it has relief); ./materials/_lib.glsl is what they all
// share and says how one is written. The engine pastes one material into a program (see program() in ./engine.ts).
// Plush, cotton and boucle aren't here: they are pile, drawn as a volume of fibres (furM in ./shaders.ts, with the
// numbers for each in PILES in ./engine.ts).
import lib from "./materials/_lib.glsl?raw";
import clay from "./materials/clay.glsl?raw";

export type Surface = "clay";
export const MATLIB = lib;
const SOURCES: Record<Surface, string> = { clay };

/** A material's two pieces: its header (defines that go before everything else) and its body. */
export function material(m: Surface): { header: string; body: string } {
  const src = SOURCES[m] ?? SOURCES.clay, at = src.indexOf("//#body");
  if (at < 0) return { header: "", body: src };
  const h = src.indexOf("//#header");
  return { header: h >= 0 ? src.slice(h, at) : "", body: src.slice(at) };
}
