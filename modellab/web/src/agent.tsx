// The web app's half of the action registry (docs/AGENTS_PLAN.md): where each action lives on screen, the highlight
// that shows it, and the one place that carries a decision out through the same API the buttons call.
//
//   targets    data-yeti="<action id>" on the real button, data-yeti-field="<setting>" around a form field,
//              data-yeti-row="<id>" on a row, data-yeti-nav="<page>" on a sidebar link
//   highlight  a ring that eases in around a target and holds still, with a short caption
//   carry out  navigate, fill a form in, or call the button's API (only after the user's approval, where the
//              action's tier needs one)

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "./api";
import { useSession } from "./session";

export interface Decision {
  id?: string; fast: boolean; action?: string; tier?: "look" | "draft" | "act" | "careful"; intent?: string | null;
  needs?: "none" | "tap" | "confirm"; show?: boolean; values?: Record<string, string>; extra?: Record<string, any>;
  title?: string; target?: string | null; changes?: { name: string; label: string; value: string }[];
  confidence?: number | null; reason?: string | null; tell?: string; ms?: number; note?: string;
  by?: "claude"; // proposed by Claude through its action tools, not picked by the decision model
}

/** A failed run's diagnosis (the hub's failure catalogue) and its fix, a decision this page can carry out. */
export interface Diagnosis {
  known: boolean; status: string; signature?: string; title?: string; explain?: string; source?: "catalog" | "model";
  confidence?: number | null; fix?: Decision | null; no_fix?: string | null; record?: { applied: number; worked: number; failed: number };
}

export const PATHS: Record<string, string> = {
  new: "/", searches: "/search", queue: "/queue", machines: "/machines", leaderboard: "/leaderboard", compare: "/compare", team: "/team",
};
export const sel = {
  action: (id: string) => `[data-yeti="${id}"]`,
  field: (name: string) => `[data-yeti-field="${name}"]`,
  row: (id: string) => `[data-yeti-row="${CSS.escape(id)}"]`,
  nav: (page: string) => `[data-yeti-nav="${PATHS[page] ?? page}"]`,
};

/** Sent when the assistant's panel covers what it is pointing at: the panel steps aside (YetiContext). */
export const COVERED = "modellab:covered";

/** Tell pages that something changed outside them (an action was carried out): polls refresh at once. */
export const CHANGED = "modellab:changed";
export const changed = () => window.dispatchEvent(new Event(CHANGED));

// ---------------------------------------------------------------- highlight

export interface Spot { sel: string; caption?: string }
const SHOW = "modellab:highlight";
/** Ring these targets (the first one found gets the caption). An empty list clears the highlight. */
export function highlight(spots: Spot[]) {
  window.dispatchEvent(new CustomEvent(SHOW, { detail: spots }));
}

type Box = { x: number; y: number; w: number; h: number; caption?: string };

/** One per app: draws the rings. A ring appears when its target is on the page (it waits a few seconds for a page
 *  that is still loading), follows it while the page scrolls, and goes away on the next click or after a while. */
export function Highlighter() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const scrolled = useRef(false);
  const lastScroll = useRef(0);
  useEffect(() => {
    const on = (e: Event) => { scrolled.current = false; setBoxes([]); setSpots((e as CustomEvent<Spot[]>).detail ?? []); };
    window.addEventListener(SHOW, on);
    return () => window.removeEventListener(SHOW, on);
  }, []);
  useEffect(() => {
    if (!spots.length) return;
    const started = Date.now();
    const measure = () => {
      const out: Box[] = [];
      let first = true;
      for (const s of spots) {
        const el = document.querySelector<HTMLElement>(s.sel);
        if (!el) continue;
        // bring the first target into view, and again while the page is still settling (a form that just loaded)
        const box = el.getBoundingClientRect();
        const off = box.top < 72 || box.bottom > window.innerHeight - 72;
        if (first && off && Date.now() - lastScroll.current > 500 && (!scrolled.current || Date.now() - started < 2500)) {
          scrolled.current = true;
          lastScroll.current = Date.now();
          const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          el.scrollIntoView({ block: "center", behavior: calm ? "auto" : "smooth" });
        }
        const r = el.getBoundingClientRect();
        if (r.width && r.height) out.push({ x: r.left - 5, y: r.top - 5, w: r.width + 10, h: r.height + 10, caption: first ? s.caption : undefined });
        first = false;
      }
      setBoxes((prev) => (JSON.stringify(prev) === JSON.stringify(out) ? prev : out));
      const panel = document.querySelector('[role="dialog"][data-yeti-panel]')?.getBoundingClientRect();
      if (panel && out.some((b) => b.x < panel.right && b.x + b.w > panel.left && b.y < panel.bottom && b.y + b.h > panel.top)) {
        window.dispatchEvent(new Event(COVERED));
      }
      if (Date.now() - started > 12000) setSpots([]);
    };
    measure();
    const t = window.setInterval(measure, 120);
    // the click that sent the sentence is over by now; the next one anywhere dismisses the ring
    const off = () => setSpots([]);
    const arm = window.setTimeout(() => window.addEventListener("pointerdown", off, { once: true }), 400);
    return () => { window.clearInterval(t); window.clearTimeout(arm); window.removeEventListener("pointerdown", off); setBoxes([]); };
  }, [spots]);
  const caption = boxes.find((b) => b.caption);
  return (
    <>
      <div aria-live="polite" className="sr-only">{caption?.caption ?? ""}</div>
      {boxes.map((b, i) => (
        <div key={i} aria-hidden className="pointer-events-none fixed z-40 animate-fade rounded-xl shadow-lift ring-2 ring-accent motion-reduce:animate-none"
          style={{ left: b.x, top: b.y, width: b.w, height: b.h }}>
          {b.caption && (
            <span className={`absolute left-0 max-w-[260px] truncate rounded-lg border border-line bg-surface px-2 py-1 text-xs font-medium text-fg shadow-lift ${b.y > 44 ? "bottom-full mb-1.5" : "top-full mt-1.5"}`}>
              {b.caption}
            </span>
          )}
        </div>
      ))}
    </>
  );
}

// ---------------------------------------------------------------- carrying a decision out

const FIELDS = ["name", "model", "dataset", "epochs", "batch_size", "grad_accum", "image_size", "lr", "speed_budget_ms", "gpu_hours"];
/** The settings a decision changes, as a form reads them from its address (`?fill=`). */
export function fillOf(values: Record<string, string>): Record<string, string> {
  return Object.fromEntries(FIELDS.filter((k) => values[k] !== undefined).map((k) => [k, values[k]]));
}
export function readFill(params: URLSearchParams): Record<string, string> | null {
  try {
    const f = JSON.parse(params.get("fill") ?? "null");
    return f && typeof f === "object" ? f : null;
  } catch { return null; }
}
const withFill = (path: string, values: Record<string, string>, clone?: string, machine = false, tag?: string) => {
  const q = new URLSearchParams();
  if (clone) q.set("clone", clone);
  // tag: a run started from a known failure's fix says so (fix:<signature>), so the hub can count how fixes go
  q.set("fill", JSON.stringify({ ...fillOf(values), ...(machine && values.machine ? { machine: values.machine } : {}), ...(tag ? { tag } : {}) }));
  q.set("n", String(Date.now())); // the same request twice fills in twice
  return `${path}?${q}`;
};

/** Where a decision's action lives on screen, to ring it before (or instead of) carrying it out. */
export function spotsFor(d: Decision): Spot[] {
  const v = d.values ?? {};
  const caption = [d.title, d.target].filter(Boolean).join(": ");
  const out: Spot[] = [];
  if (d.action === "nav.open_page") out.push({ sel: sel.nav(v.page), caption });
  else if (d.action) out.push({ sel: sel.action(d.action), caption });
  for (const k of ["run", "search", "machine", "dataset"]) if (v[k]) out.push({ sel: sel.row(v[k]), caption });
  return out;
}

/** The one place a decision becomes an effect. `approved` is the user's tap for actions that need one. */
export function useCarryOut() {
  const nav = useNavigate();
  const loc = useLocation();
  const { hub, setMachineId } = useSession();
  return useCallback(async (d: Decision): Promise<string> => {
    const v = d.values ?? {}, x = d.extra ?? {};
    const press = (id: string) => {
      const el = document.querySelector<HTMLButtonElement>(sel.action(id));
      if (!el) throw new Error("that button isn't on this page any more");
      if (el.disabled) throw new Error("the form isn't ready yet: check what it says is missing");
      el.click();
    };
    const fields = (keys: string[]): Spot[] => keys.map((k) => ({ sel: sel.field(k) })).concat(v.machine ? [{ sel: sel.field("machine") }] : [])
      .map((s, i) => (i === 0 ? { ...s, caption: "Filled in: check it, then run it" } : s));
    const filled = Object.keys(fillOf(v));
    const machine = v.machine ?? x.machine;
    let done = "";
    switch (d.action) {
      case "nav.open_page": nav(PATHS[v.page] ?? "/"); done = `Opened ${d.target}`; break;
      case "nav.open_run": nav(`/runs/${v.run}`); done = `Opened ${d.target}`; break;
      case "nav.open_search": nav(`/search/${v.search}`); done = `Opened ${d.target}`; break;
      case "nav.open_machine": nav(`/machines/${v.machine}`); done = `Opened ${d.target}`; break;
      case "results.compare": nav(`/compare?items=${(x.items ?? []).join(",")}`); done = "Opened the comparison"; break;
      case "experiment.fill":
        if (v.machine) setMachineId(v.machine);
        nav(withFill("/", x.name ? { ...v, name: x.name } : v)); highlight(fields(filled)); done = "Filled in New experiment"; break;
      case "run.clone_edit":
        if (v.machine) setMachineId(v.machine);
        nav(withFill("/", v, v.run, false, x.tag)); highlight(fields(filled));
        done = `Cloned ${d.target ?? "the run"} into New experiment`; break;
      case "search.fill":
        nav(withFill("/search", v, undefined, true)); highlight(fields(filled)); done = "Filled in Find best model"; break;
      case "dataset.fill_add":
        if (machine && !loc.pathname.endsWith(`/machines/${machine}`)) nav(`/machines/${machine}`);
        highlight([{ sel: sel.action("dataset.fill_add"), caption: "Add a dataset here" }]); done = "Here is Add dataset"; break;
      case "run.queue": press("run.queue"); done = "Queued the experiment"; break;
      case "search.start": press("search.start"); done = "Started the search"; break;
      case "run.requeue": await api.requeue(v.run); done = `Re-queued ${d.target}`; break;
      case "run.cancel": await api.cancel(v.run); done = `Cancelled ${d.target}`; break;
      case "run.export": await api.exportRun(v.run, x.stage); done = `Exporting ${d.target}`; break;
      case "run.delete":
        await api.remove(v.run, hub);
        if (loc.pathname === `/runs/${v.run}`) nav("/queue");
        done = `Deleted ${d.target}`; break;
      case "search.cancel": await api.cancelSearch(v.search); done = `Cancelled ${d.target}`; break;
      case "search.delete":
        await api.deleteSearch(v.search);
        if (loc.pathname === `/search/${v.search}`) nav("/search");
        done = `Deleted ${d.target}`; break;
      case "dataset.recheck": await api.command(machine, "dataset_verify", { name: v.dataset }); done = `Re-checking ${d.target}`; break;
      case "dataset.remove": await api.command(machine, "dataset_remove", { name: v.dataset }); done = `Removing ${d.target} from the list`; break;
      case "machine.selfcheck": await api.command(machine, "selfcheck"); done = `Running the self-check on ${d.target ?? "this machine"}`; break;
      case "weights.fetch": await api.command(machine, "weights_fetch", { ids: x.ids }); done = "Fetching the missing weights"; break;
      default: throw new Error("I don't know how to do that yet");
    }
    changed();
    return done;
  }, [nav, loc.pathname, hub, setMachineId]);
}
