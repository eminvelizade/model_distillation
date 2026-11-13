import { useEffect, useState } from "react";
import { Dices, Loader2, Trash2 } from "lucide-react";
import { Agent, api } from "../../api";
import { Button, Callout, cx, Field, inputCls, Modal, Segmented } from "../../ui";
import { AgentLook, COLOURS, DEFAULT_LOOK, isBuiltIn, Look, LOOK_OPTIONS, MASCOT_LIST, Material } from "./mascots";
import boucle from "./stills/materials/boucle.webp";
import clay from "./stills/materials/clay.webp";
import cotton from "./stills/materials/cotton.webp";
import elastane from "./stills/materials/elastane.webp";
import plush from "./stills/materials/plush.webp";
import sugar from "./stills/materials/sugar.webp";
import Yeti from "./Yeti";

// a small sample of each material (a plain ball, rendered by tools/mascot/harness/swatches.sh)
const SAMPLE: Record<Material, string> = { plush, cotton, boucle, elastane, sugar, clay };

// An agent's name, role and look. The look is Bloom (the built-in mascot) or one put together here: a shape in a
// material and a colour, with eyes, and glasses or an extra if you like. The preview is the real thing, drawn live.

const pick = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)];
const USES_ACCENT = new Set(["headphones", "beanie", "antenna", "scarf", "cap", "tuft"]);
const NAMES = ["Pond", "Tofu", "Nimbus", "Pebble", "Miso", "Juno", "Fig", "Atlas", "Poppy", "Kiwi", "Sol", "Mica"];

function randomLook(): Look {
  const colour = pick(LOOK_OPTIONS.colour.filter(([k]) => k !== "ink"))[0];
  return {
    shape: pick(LOOK_OPTIONS.shape)[0], material: pick(LOOK_OPTIONS.material)[0], colour,
    accent: pick(LOOK_OPTIONS.colour.filter(([k]) => k !== colour && k !== "ink"))[0],
    eyes: pick(LOOK_OPTIONS.eyes)[0], glasses: Math.random() < 0.3 ? pick(LOOK_OPTIONS.glasses.slice(1))[0] : "none",
    extra: Math.random() < 0.6 ? pick(LOOK_OPTIONS.extra.slice(1))[0] : "none",
  };
}

function Chips<T extends string>({ label, options, value, onChange }: { label: string; options: readonly (readonly [T, string])[]; value: T; onChange: (v: T) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium text-muted">{label}</div>
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={label}>
        {options.map(([k, name]) => (
          <button key={k} type="button" role="radio" aria-checked={value === k} onClick={() => onChange(k)}
            className={cx("rounded-lg px-2.5 py-1 text-xs font-medium transition", value === k ? "bg-accent-soft text-accent ring-1 ring-inset ring-accent/30" : "bg-raised/70 text-muted hover:bg-raised hover:text-fg")}>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

function Swatches({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium text-muted">{label}</div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {LOOK_OPTIONS.colour.map(([k, name]) => (
          <button key={k} type="button" role="radio" aria-checked={value === k} title={name} aria-label={name} onClick={() => onChange(k)}
            className={cx("h-7 w-7 rounded-full ring-1 ring-inset ring-black/10 transition hover:scale-110", value === k && "outline outline-2 outline-offset-2 outline-accent")}
            style={{ background: COLOURS[k] }} />
        ))}
      </div>
    </div>
  );
}

/** Make a new agent (agent = null) or change one. onClose gets the saved agent, or nothing when cancelled. */
export default function AgentEditor({ agent, canDelete, onClose }: { agent: Agent | null; canDelete?: boolean; onClose: (saved?: Agent, deleted?: boolean) => void }) {
  const [name, setName] = useState(agent?.name ?? pick(NAMES));
  const [role, setRole] = useState(agent?.role ?? "");
  const [look, setLook] = useState<AgentLook>(agent?.look ?? { base: "fuzzy", ...randomLook() });
  const [tab, setTab] = useState<"own" | "bloom">(agent && isBuiltIn(agent.look) ? "bloom" : "own");
  const [own, setOwn] = useState<Look>(agent && !isBuiltIn(agent.look) ? agent.look : !isBuiltIn(look) ? look : DEFAULT_LOOK);
  const [pose, setPose] = useState<"idle" | "happy">("idle");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const hop = () => { setPose("happy"); window.setTimeout(() => setPose("idle"), 1200); };
  const change = (patch: Partial<Look>) => { const n = { ...own, ...patch }; setOwn(n); setLook({ base: "fuzzy", ...n }); };
  useEffect(() => { if (tab === "own") setLook({ base: "fuzzy", ...own }); }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = async () => {
    setBusy(true);
    setErr(null);
    try {
      const body = { name: name.trim(), look, role: role.trim() };
      onClose(agent ? await api.patchAgent(agent.id, body) : await api.createAgent(body));
    } catch (e) { setErr((e as Error).message); setBusy(false); }
  };
  const remove = async () => {
    if (!agent || !window.confirm(`Remove ${agent.name}? Its conversation goes with it; the notebook, runs and notes stay.`)) return;
    setBusy(true);
    try { await api.deleteAgent(agent.id); onClose(undefined, true); } catch (e) { setErr((e as Error).message); setBusy(false); }
  };
  return (
    <Modal onClose={() => onClose()} className="!max-w-[760px]">
      <form className="grid gap-0 sm:grid-cols-[280px_1fr]" onSubmit={(e) => { e.preventDefault(); if (name.trim()) save(); }}>
        <div className="flex flex-col items-center gap-4 border-b border-line bg-raised/40 p-5 sm:border-b-0 sm:border-r">
          <button type="button" onClick={hop} title="Say hi" className="rounded-3xl transition active:scale-95"><Yeti look={look} size={208} pose={pose} /></button>
          <div className="w-full space-y-3">
            <Field label="Name"><input autoFocus className={inputCls} value={name} maxLength={24} onChange={(e) => setName(e.target.value)} placeholder="Pond" /></Field>
            <Field label="What it's for" hint="Optional. In your words: it shapes what the agent pays attention to.">
              <textarea className={cx(inputCls, "h-20 resize-none py-2 leading-snug")} value={role} maxLength={600} onChange={(e) => setRole(e.target.value)}
                placeholder="Keeps an eye on the overnight runs" />
            </Field>
          </div>
        </div>
        <div className="flex min-h-0 flex-col">
          <div className="flex items-center gap-2 border-b border-line px-5 py-3">
            <div className="text-[15px] font-semibold text-fg">{agent ? `Change ${agent.name}` : "New agent"}</div>
            <Segmented small className="ml-auto" value={tab} onChange={(v) => { setTab(v); if (v === "bloom") { setLook({ base: "bloom" }); hop(); } }}
              options={[{ value: "own", label: "Make your own" }, { value: "bloom", label: MASCOT_LIST[0].name }]} />
          </div>
          <div className="scroll-thin max-h-[58vh] flex-1 space-y-4 overflow-y-auto px-5 py-4">
            {tab === "own" ? <>
              <div>
                <div className="mb-1.5 flex items-center text-xs font-medium text-muted">Shape
                  <button type="button" onClick={() => { change(randomLook()); hop(); }} className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium text-accent hover:bg-accent-soft"><Dices className="h-3.5 w-3.5" />Surprise me</button>
                </div>
                <div className="grid grid-cols-4 gap-1.5" role="radiogroup" aria-label="Shape">
                  {LOOK_OPTIONS.shape.map(([k, label]) => (
                    <button key={k} type="button" role="radio" aria-checked={own.shape === k} onClick={() => { change({ shape: k }); hop(); }}
                      className={cx("flex flex-col items-center gap-0.5 rounded-xl px-1 pb-1.5 pt-1 text-2xs font-medium transition",
                        own.shape === k ? "bg-accent-soft text-fg ring-1 ring-inset ring-accent/25" : "text-muted hover:bg-raised/70 hover:text-fg")}>
                      <Yeti look={{ base: "fuzzy", shape: k, material: own.material, colour: own.colour, eyes: own.eyes, glasses: "none", extra: "none" }} size={46} thumb follow={false} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-xs font-medium text-muted">Material</div>
                <div className="grid grid-cols-6 gap-1.5" role="radiogroup" aria-label="Material">
                  {LOOK_OPTIONS.material.map(([k, label]) => (
                    <button key={k} type="button" role="radio" aria-checked={(own.material ?? "plush") === k} onClick={() => { change({ material: k }); hop(); }}
                      className={cx("flex flex-col items-center gap-0.5 rounded-xl px-1 pb-1.5 pt-1.5 text-2xs font-medium transition",
                        (own.material ?? "plush") === k ? "bg-accent-soft text-fg ring-1 ring-inset ring-accent/25" : "text-muted hover:bg-raised/70 hover:text-fg")}>
                      <img src={SAMPLE[k]} alt="" width={44} height={44} draggable={false} decoding="async" className="h-11 w-11" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <Swatches label="Colour" value={own.colour} onChange={(colour) => change({ colour })} />
              <Chips label="Eyes" options={LOOK_OPTIONS.eyes} value={own.eyes} onChange={(eyes) => change({ eyes })} />
              {own.shape !== "frog" && <Chips label="Glasses" options={LOOK_OPTIONS.glasses} value={own.glasses} onChange={(glasses) => change({ glasses })} />}
              <Chips label="Extra" options={LOOK_OPTIONS.extra} value={own.extra} onChange={(extra) => change({ extra })} />
              {USES_ACCENT.has(own.extra) && <Swatches label="Its colour" value={own.accent ?? "ice"} onChange={(accent) => change({ accent })} />}
            </> : (
              <p className="text-[13px] leading-relaxed text-muted">
                <span className="font-medium text-fg">{MASCOT_LIST[0].name}</span> is ModelLab's own mascot: {MASCOT_LIST[0].tagline}, modelled on a real
                plush toy. His look is fixed; pick <span className="font-medium text-fg">Make your own</span> to choose a shape, a material and a colour.
              </p>
            )}
            {err && <Callout tone="error">{err}</Callout>}
          </div>
          <div className="flex items-center gap-2 border-t border-line px-5 py-3">
            {agent && canDelete && <Button variant="danger" onClick={remove} disabled={busy}><Trash2 />Remove</Button>}
            <Button variant="ghost" className="ml-auto" onClick={() => onClose()}>Cancel</Button>
            <Button type="submit" variant="brand" disabled={busy || !name.trim()}>{busy && <Loader2 className="animate-spin" />}{agent ? "Save" : "Add to the team"}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
