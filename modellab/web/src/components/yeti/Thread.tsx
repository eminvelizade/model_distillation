import { CSSProperties, KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, AlertTriangle, ArrowUp, Check, CircleDashed, Copy, Eye, ListChecks, Loader2, Minus, MousePointerClick, RotateCcw, Square, X, Zap } from "lucide-react";
import { Plan, PlanStep } from "../../api";
import { Button, Callout, cx } from "../../ui";
import Markdown from "./Markdown";
import { agentColour, useMascot } from "./mascots";
import Yeti from "./Yeti";
import { useYeti, YetiMsg } from "./YetiContext";

// The thread, as the Chat tab and the corner panel both show it: the user's and the agent's messages, the cards the
// agent offered, plan cards with their steps as the hub reports them, and the hub's own notes on a plan.

const PAGE_NAMES: Record<string, string> = {
  searches: "Find best model", machines: "Machines", leaderboard: "Leaderboard", compare: "Compare", queue: "Queue",
  new: "New experiment", team: "Team", notebook: "Notebook",
};

export function pageLabel(p: { kind: string; label?: string } | null): string | null {
  if (!p || p.kind === "other" || p.kind === "chat") return null;
  if (p.label) return `${p.kind} “${p.label}”`;
  return PAGE_NAMES[p.kind] ?? null;
}

const dur = (s: number | null | undefined) => {
  if (s == null) return "";
  if (s < 90) return `${Math.round(s)} s`;
  const m = Math.round(s / 60);
  return m < 90 ? `${m} min` : `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ""}`;
};
const clock = (t: number) => new Date(t * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
function dayLabel(t: number): string {
  const d = new Date(t * 1000), now = new Date();
  const days = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / 864e5);
  return days === 0 ? `Today ${clock(t)}` : days === 1 ? `Yesterday ${clock(t)}` : `${d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })} ${clock(t)}`;
}

/** The scrolling thread. `roomy`: the Chat tab (wider, a little larger); otherwise the corner panel. */
export function ThreadView({ roomy }: { roomy?: boolean }) {
  const y = useYeti();
  const { look } = useMascot();
  const box = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  useLayoutEffect(() => {
    const el = box.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [y.messages, y.plans]);
  const onScroll = () => {
    const el = box.current;
    if (el) stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };
  let last = 0;
  return (
    <div ref={box} onScroll={onScroll} style={{ "--agent": agentColour(look) } as CSSProperties}
      className={cx("scroll-thin flex-1 overflow-y-auto", roomy ? "px-4 py-5 sm:px-6" : "px-4 py-4")}>
      {!y.loaded ? <div className="flex h-full items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-subtle" /></div>
        : y.messages.length === 0 ? <Welcome roomy={roomy} />
        : <div className={cx("mx-auto", roomy ? "max-w-[820px] space-y-4" : "space-y-4")}>
            {y.messages.map((m) => {
              const gap = !!m.created && m.created - last > 1800;
              if (m.created) last = m.created;
              return (
                <div key={m.id} className="space-y-4">
                  {gap && <div className="text-center text-[10.5px] font-medium uppercase tracking-wide text-subtle/80">{dayLabel(m.created!)}</div>}
                  <Message m={m} roomy={roomy} />
                </div>
              );
            })}
          </div>}
    </div>
  );
}

function suggestionsFor(kind: string | undefined): { label: string; ask: string; focus?: string }[] {
  const general = [
    { label: "Plan an experiment with me", ask: "I have an idea I want to test. Ask me what you need to know, then write a plan for it." },
    { label: "How does Find best model work?", ask: "How does Find best model work, step by step?" },
    { label: "What is distillation, and when does it help?", ask: "What is distillation in ModelLab, and when does it help?" },
    { label: "How do I add a machine?", ask: "How do I add a GPU machine to ModelLab?" },
  ];
  const byPage: Record<string, { label: string; ask: string; focus?: string }[]> = {
    search: [{ label: "Why did this search pick its model?", ask: "Why did this search recommend its model? Walk me through the evidence.", focus: "recommendation" },
             { label: "Is the winner clearly better than the runner-up?", ask: "Is the recommended model clearly better than the runner-up, or within noise?", focus: "seeds" }],
    run: [{ label: "Explain this run's results", ask: "Explain this run's results. What's good, what's weak, and why?", focus: "results" }],
    leaderboard: [{ label: "Which model should I use?", ask: "Looking at my leaderboard, which model should I use, and why?", focus: "champion" }],
    compare: [{ label: "Explain the differences", ask: "Explain the differences between these results and what caused them.", focus: "comparison" }],
    machine: [{ label: "Is this machine ready to train?", ask: "Is this machine ready to train? Anything I should fix?", focus: "checks" }],
    searches: [{ label: "Which of my searches matter most?", ask: "Summarize my searches and what each one found." }],
  };
  return [...(byPage[kind ?? ""] ?? []), ...general].slice(0, 4);
}

function Welcome({ roomy }: { roomy?: boolean }) {
  const y = useYeti();
  const { name } = useMascot();
  const [pose, setPose] = useState<"wave" | "idle">("idle");
  useEffect(() => { const t = window.setTimeout(() => setPose("wave"), 150); const u = window.setTimeout(() => setPose("idle"), 1700); return () => { clearTimeout(t); clearTimeout(u); }; }, []);
  const chips = [...(y.suggestion ? [{ label: y.suggestion.text, ask: y.suggestion.ask, focus: y.suggestion.focus }] : []), ...suggestionsFor(y.page?.kind)]
    .filter((c, i, all) => all.findIndex((x) => x.ask === c.ask) === i).slice(0, 4);
  return (
    <div className={cx("mx-auto flex flex-col items-center px-1 text-center", roomy ? "max-w-[460px] pt-10" : "pt-3")}>
      <Yeti size={roomy ? 132 : 88} pose={pose} />
      <div className={cx("mt-3 font-semibold text-fg", roomy ? "text-lg" : "text-[15px]")}>Hi, I'm {name}</div>
      <p className="mt-1 max-w-[340px] text-[13px] leading-relaxed text-muted">
        {y.agent?.role ? <>{y.agent.role}. </> : null}
        I can explain your results, show you around, and take work off your hands: say what you want done, and I'll plan the steps and run them once you say go.
      </p>
      <div className={cx("mt-5 grid w-full gap-2", roomy && "sm:grid-cols-2")}>
        {chips.map((c, i) => (
          <button key={c.ask} onClick={() => y.send(c.ask, { focus: c.focus })} style={{ animationDelay: `${120 + i * 60}ms` }}
            className="animate-enter rounded-xl border border-line bg-surface px-3 py-2 text-left text-[13px] text-fg shadow-soft transition hover:-translate-y-px hover:border-accent/30 hover:shadow-lift">
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToolTrail({ m }: { m: YetiMsg }) {
  const y = useYeti();
  const tools = m.tools ?? [];
  if (!tools.length) return null;
  const close = () => { if (window.matchMedia("(max-width: 639px)").matches) y.setOpen(false); };
  return (
    <div className="space-y-0.5">
      {tools.map((t) => (
        <div key={t.id} className="flex min-w-0 items-center gap-1.5 text-2xs text-subtle animate-fade">
          {!t.done ? <Loader2 className="h-3 w-3 shrink-0 animate-spin text-accent" />
            : t.ok ? <Check className="h-3 w-3 shrink-0 text-emerald-500" /> : <AlertTriangle className="h-3 w-3 shrink-0 text-amber-500" />}
          {t.href && t.done ? <Link to={t.href} onClick={close} className="truncate hover:text-accent hover:underline">{t.label}</Link>
            : <span className="truncate">{t.label}{!t.done && "…"}</span>}
        </div>
      ))}
    </div>
  );
}

function Message({ m, roomy }: { m: YetiMsg; roomy?: boolean }) {
  const y = useYeti();
  const [copied, setCopied] = useState(false);
  const wide = roomy ? "max-w-[min(640px,82%)]" : "max-w-[86%]";
  if (m.role === "user") {
    return (
      <div className="flex flex-col items-end gap-1 animate-fade">
        {m.about && <span className={cx(wide, "truncate rounded-full bg-raised px-2 py-0.5 text-2xs text-muted")}>about {m.about}</span>}
        <div className={cx(wide, "whitespace-pre-wrap break-words rounded-2xl rounded-br-md px-3.5 py-2 leading-relaxed text-fg", roomy ? "text-[14px]" : "text-[13px]")}
          style={{ background: "color-mix(in srgb, var(--agent, #3d82dc) 17%, transparent)" }}>{m.text}</div>
      </div>
    );
  }
  if (m.role === "event") {
    return (
      <div className="flex justify-center animate-fade">
        <div className="flex max-w-[92%] items-start gap-2 rounded-xl bg-raised/60 px-3 py-1.5 text-xs leading-relaxed text-muted">
          <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" /><span>{m.text}</span>
        </div>
      </div>
    );
  }
  if (m.action) return <ActionCard m={m} />;
  if (m.plan) return y.plans[m.plan] ? <PlanCard p={y.plans[m.plan]} /> : null;
  const close = () => { if (window.matchMedia("(max-width: 639px)").matches) y.setOpen(false); };
  const copy = () => navigator.clipboard?.writeText(m.text).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1200); }).catch(() => undefined);
  const u = m.usage;
  return (
    <div className="flex items-end gap-2.5">
      <Yeti size={roomy ? 32 : 28} pose={m.streaming ? "think" : "idle"} fps={m.streaming ? 15 : 4} className="mb-4" />
      <div className={cx("min-w-0 space-y-1.5", roomy ? "max-w-[min(680px,88%)]" : "flex-1")}>
        <ToolTrail m={m} />
        {(m.text || m.streaming) && (
          <div className={cx("rounded-2xl rounded-bl-md bg-raised/60 px-3.5 py-2.5", roomy && "text-[14px]")}>
            {m.text ? <Markdown text={m.text} onNavigate={close} />
              : (
                <div className="flex items-center gap-2 py-0.5 text-xs text-subtle">
                  <span className="flex gap-1" aria-hidden>{[0, 1, 2].map((i) => <span key={i} className="yeti-dot h-1.5 w-1.5 rounded-full bg-accent/70" style={{ animationDelay: `${i * 0.15}s` }} />)}</span>
                  <span className="truncate italic">{m.status ?? (m.tools?.length ? "thinking it over" : "thinking")}</span>
                </div>
              )}
            {m.streaming && m.text && m.status && <div className="mt-1 truncate text-2xs italic text-subtle">{m.status}</div>}
          </div>
        )}
        {m.error && (
          <Callout tone={m.error.code === "stopped" ? "info" : "error"}>
            {m.error.message}
            {m.error.code !== "stopped" && <button onClick={y.retry} className="ml-1.5 inline-flex items-center gap-1 font-medium underline underline-offset-2"><RotateCcw className="h-3 w-3" />Try again</button>}
            {(m.error.code === "auth" || m.error.code === "billing" || m.error.code === "not_found") &&
              <button onClick={() => { y.setView("settings"); y.setOpen(true); }} className="ml-1.5 font-medium underline underline-offset-2">Settings</button>}
          </Callout>
        )}
        {!m.streaming && m.text && (
          <div className="flex items-center gap-2 pl-1 text-2xs text-subtle">
            {m.created && <span>{clock(m.created)}</span>}
            {m.model && <span title={u ? `${u.input + u.cache_read + u.cache_write} input tokens (${u.cache_read} from cache), ${u.output} output` : undefined}>{m.model}</span>}
            <button onClick={copy} className="inline-flex items-center gap-1 rounded px-1 hover:text-fg" title="Copy the answer">
              {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}{copied ? "copied" : "copy"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const TAP: Record<string, string> = {
  "run.queue": "Queue it", "run.requeue": "Re-queue", "run.cancel": "Cancel the run", "run.export": "Export", "run.delete": "Delete the run",
  "search.start": "Start the search", "search.cancel": "Cancel the search", "search.delete": "Delete the search",
  "dataset.recheck": "Re-check", "dataset.remove": "Remove from the list", "machine.selfcheck": "Run the self-check", "weights.fetch": "Fetch the weights",
};

/** One action: what it is, what it changes, and (where the action runs or deletes something) the one tap it waits
 *  for. The same component shows what became of it. */
function ActionCard({ m }: { m: YetiMsg }) {
  const y = useYeti();
  const { d, state, note } = m.action!;
  const careful = d.tier === "careful";
  const happened = state === "done" ? note : state === "shown" ? "Here it is: I've ringed it on the page."
    : state === "declined" ? "Left as it is." : state === "failed" ? note : null;
  return (
    <div className="flex items-end gap-2.5 animate-fade">
      <Yeti size={28} pose={state === "working" ? "think" : state === "done" ? "happy" : "idle"} fps={state === "working" ? 15 : 4} className="mb-1" />
      <div className="min-w-0 max-w-[440px] flex-1 rounded-2xl rounded-bl-md border border-line bg-surface p-3 shadow-soft">
        <div className="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold text-fg">
          {d.show ? <MousePointerClick className="h-3.5 w-3.5 shrink-0 text-accent" /> : <Zap className="h-3.5 w-3.5 shrink-0 text-accent" />}
          <span className="truncate">{d.title}</span>
        </div>
        {d.target && <div className="mt-0.5 truncate font-mono text-[12px] text-muted">{d.target}</div>}
        {!!d.changes?.length && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {d.changes.map((c) => (
              <span key={c.name} className="rounded-md bg-accent-soft px-1.5 py-0.5 text-2xs font-medium text-accent">{c.label} <span className="font-mono">{c.value}</span></span>
            ))}
          </div>
        )}
        {state === "pending" && (
          <div className="mt-2.5 space-y-2">
            {careful && <p className="text-xs text-muted">This can't be undone.</p>}
            <div className="flex items-center gap-2">
              <Button small variant={careful ? "danger" : "primary"} onClick={() => y.approve(m.id)}>{TAP[d.action ?? ""] ?? "Do it"}</Button>
              <Button small variant="ghost" onClick={() => y.decline(m.id)}>Not now</Button>
            </div>
          </div>
        )}
        {state === "working" && <div className="mt-2 flex items-center gap-1.5 text-xs text-subtle"><Loader2 className="h-3 w-3 animate-spin" />working</div>}
        {happened && (
          <div className={cx("mt-2 flex items-start gap-1.5 text-xs", state === "failed" ? "text-rose-600 dark:text-rose-300" : "text-muted")}>
            {state === "done" ? <Check className="mt-px h-3 w-3 shrink-0 text-emerald-500" /> : state === "failed" ? <AlertTriangle className="mt-px h-3 w-3 shrink-0" /> : null}
            <span>{state === "failed" ? `That didn't work: ${happened}` : happened}</span>
          </div>
        )}
        <div className="mt-1.5 text-2xs text-subtle" title={d.by === "claude" ? "prepared by Claude" : "decided by the decision model, without Claude"}>
          {d.by === "claude" ? "prepared by Claude" : <>{y.settings?.system1?.model ?? "decision model"}{d.ms ? ` · ${(d.ms / 1000).toFixed(1)} s` : ""}</>}
        </div>
      </div>
    </div>
  );
}

const PLAN_PILL: Record<Plan["status"], { label: string; cls: string }> = {
  proposed: { label: "waits for your Start", cls: "bg-accent-soft text-accent" },
  running: { label: "running", cls: "bg-sky-500/10 text-sky-700 dark:text-sky-300" },
  waiting: { label: "needs you", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  done: { label: "done", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  cancelled: { label: "stopped", cls: "bg-raised text-muted" },
  declined: { label: "not started", cls: "bg-raised text-muted" },
};

function StepIcon({ s }: { s: PlanStep }) {
  const base = "mt-0.5 h-4 w-4 shrink-0";
  if (s.status === "running") return <Loader2 className={cx(base, "animate-spin text-sky-500")} />;
  if (s.status === "done") return <Check className={cx(base, "rounded-full bg-emerald-500 p-[3px] text-white")} strokeWidth={3.5} />;
  if (s.status === "failed") return <X className={cx(base, "rounded-full bg-rose-500 p-[3px] text-white")} strokeWidth={3.5} />;
  if (s.status === "skipped" || s.status === "cancelled") return <Minus className={cx(base, "text-subtle")} />;
  return <CircleDashed className={cx(base, "text-subtle")} />;
}

function stepResult(s: PlanStep): string | null {
  const r = s.result;
  if (s.status === "running" && s.run) return s.run.status === "queued" ? "queued" : `${Math.round(s.run.progress * 100)}%${s.run.stage ? ` · ${s.run.stage}` : ""}`;
  if (!r) return null;
  if (s.kind === "pick" && r.winner) return `${r.name ?? r.winner}${r.tie ? " (a tie)" : ""}`;
  if (s.kind === "export") return s.status === "done" && r.tensorrt ? (r.tensorrt === "built" ? "ONNX · TensorRT" : "ONNX only") : null;
  if (r.map != null) return `mAP ${(r.map * 100).toFixed(1)}${r.latency_ms ? ` · ${r.latency_ms.toFixed(1)} ms` : ""}`;
  return null;
}

/** A plan: its steps as the hub reports them (from the runs and the machines themselves), and the user's own word on it: Start, Stop,
 *  or, when a step failed in a way the hub couldn't fix, retry or skip. Nothing in it starts without that word. */
export function PlanCard({ p }: { p: Plan }) {
  const y = useYeti();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const go = async (what: "approve" | "decline" | "cancel" | "retry" | "skip") => {
    setBusy(what);
    setErr(null);
    try { await y.planDo(p.id, what); } catch (e) { setErr((e as Error).message); } finally { setBusy(null); }
  };
  const close = () => { if (window.matchMedia("(max-width: 639px)").matches) y.setOpen(false); };
  const pill = PLAN_PILL[p.status];
  const where = p.machines.length ? ` on ${p.machines.join(" and ")}` : "";
  const time = p.status === "proposed" ? (p.est_s ? `About ${dur(p.est_s)} of GPU time${where}. Starting it approves up to ${dur(p.gpu_s)}, retries included.`
      : `No time estimate yet${where}: there are no past runs of these models to go by.`)
    : p.spent_s > 0 ? `${dur(p.spent_s)} of GPU time used${p.gpu_s ? ` of ${dur(p.gpu_s)} approved` : ""}${where}.` : null;
  const spin = (k: string) => (busy === k ? <Loader2 className="animate-spin" /> : null);
  return (
    <div className="flex items-end gap-2.5 animate-fade" data-plan={p.id}>
      <Yeti size={28} pose={p.status === "running" ? "think" : p.status === "done" ? "happy" : "idle"} fps={p.status === "running" ? 10 : 4} className="mb-1" />
      <div className="min-w-0 max-w-[560px] flex-1 rounded-2xl rounded-bl-md border border-line bg-surface p-3.5 shadow-soft">
        <div className="flex items-start gap-2">
          <ListChecks className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-semibold leading-snug text-fg">{p.title}</div>
            {p.goal && <div className="mt-0.5 text-xs leading-relaxed text-muted">{p.goal}</div>}
          </div>
          <span className={cx("shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium", pill.cls)}>{pill.label}</span>
        </div>
        <ol className="mt-3 space-y-2">
          {p.steps.map((s) => {
            const res = stepResult(s);
            const to = s.kind === "search" && s.search_id ? `/search/${s.search_id}` : s.run_id ? `/runs/${s.run_id}` : null;
            return (
              <li key={s.id} className="flex gap-2.5">
                <StepIcon s={s} />
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-baseline gap-2">
                    {to ? <Link to={to} onClick={close} className={cx("truncate text-[13px] font-medium hover:text-accent hover:underline", s.status === "skipped" ? "text-subtle line-through" : "text-fg")}>{s.title}</Link>
                      : <span className={cx("truncate text-[13px] font-medium", s.status === "skipped" ? "text-subtle line-through" : "text-fg")}>{s.title}</span>}
                    {res && <span className="ml-auto shrink-0 font-mono text-[11.5px] tabular-nums text-muted">{res}</span>}
                  </div>
                  {s.detail && <div className="truncate text-2xs text-subtle" title={s.detail}>{s.detail}</div>}
                  {s.kind === "export" && s.status === "done" && s.result?.folder && <div className="truncate font-mono text-2xs text-subtle" title={s.result.folder}>{s.result.folder}</div>}
                  {s.status === "running" && s.run && s.run.status === "running" && (
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-raised"><div className="h-full rounded-full bg-gradient-to-r from-ice-600 to-ice-300 transition-all duration-700" style={{ width: `${s.run.progress * 100}%` }} /></div>
                  )}
                  {s.fixes.map((f, i) => <div key={i} className="mt-0.5 text-2xs text-amber-700 dark:text-amber-300">Retried after {f.why}: {f.what}</div>)}
                  {s.kind === "pick" && s.result?.why && <div className="mt-0.5 text-2xs text-muted">{s.result.why}</div>}
                  {s.note && <div className={cx("mt-0.5 text-2xs", s.status === "failed" ? "text-rose-600 dark:text-rose-300" : "text-muted")}>{s.note}</div>}
                </div>
              </li>
            );
          })}
        </ol>
        {time && <p className="mt-3 text-xs leading-relaxed text-muted">{time}</p>}
        {p.notebook_entry && <p className="mt-1 text-xs text-muted">Its runs join the <Link to={`/notebook/${p.notebook_entry}`} onClick={close} className="font-medium text-accent hover:underline">notebook entry</Link>.</p>}
        {p.pending && (
          <div className="mt-3 rounded-xl bg-amber-500/10 p-2.5 text-xs text-fg">
            <div className="font-semibold">A change waits for your OK</div>
            {p.pending.why && <p className="mt-0.5 text-muted">{p.pending.why}</p>}
            <p className="mt-1 text-muted">It goes beyond what you approved: {p.pending.reasons.join("; ")}.</p>
            <ul className="mt-1.5 space-y-0.5">{p.pending.steps.map((s) => <li key={s.id} className="truncate"><span className="font-medium">{s.title}</span>{s.detail ? <span className="text-subtle"> · {s.detail}</span> : null}</li>)}</ul>
            <div className="mt-2 flex gap-2">
              <Button small variant="primary" disabled={!!busy} onClick={() => go("approve")}>{spin("approve")}Approve the change</Button>
              <Button small variant="ghost" disabled={!!busy} onClick={() => go("decline")}>Keep it as it is</Button>
            </div>
          </div>
        )}
        {p.status === "waiting" && p.message && !p.pending && <p className="mt-3 text-xs leading-relaxed text-amber-700 dark:text-amber-300">{p.message}</p>}
        {err && <Callout tone="error" className="mt-2">{err}</Callout>}
        {p.status === "proposed" && (
          <div className="mt-3 flex items-center gap-2">
            <Button small variant="brand" disabled={!!busy} onClick={() => go("approve")}>{spin("approve")}Start</Button>
            <Button small variant="ghost" disabled={!!busy} onClick={() => go("decline")}>Not now</Button>
            <span className="text-2xs text-subtle">One Start covers every step.</span>
          </div>
        )}
        {p.status === "waiting" && !p.pending && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button small variant="primary" disabled={!!busy} onClick={() => go("retry")}>{spin("retry")}Retry the step</Button>
            <Button small disabled={!!busy} onClick={() => go("skip")}>Skip it</Button>
            <Button small variant="ghost" disabled={!!busy} onClick={() => go("cancel")}>Stop the plan</Button>
          </div>
        )}
        {p.status === "running" && <div className="mt-3"><Button small variant="ghost" disabled={!!busy} onClick={() => go("cancel")}>{spin("cancel")}Stop the plan</Button></div>}
      </div>
    </div>
  );
}

export function Composer({ roomy }: { roomy?: boolean }) {
  const y = useYeti();
  const { name } = useMascot();
  const ta = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(roomy ? 220 : 150, el.scrollHeight)}px`;
  }, [y.draft, roomy]);
  useEffect(() => { if (window.matchMedia("(min-width: 640px)").matches) ta.current?.focus(); }, [y.agent?.id]);
  const key = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); y.send(y.draft); }
  };
  const sees = pageLabel(y.page);
  return (
    <div className={cx("border-t border-line pb-3 pt-2.5", roomy ? "px-4 sm:px-6" : "px-3")}>
      <div className={cx(roomy && "mx-auto max-w-[820px]")}>
        {sees && <div className="mb-2 flex min-w-0 items-center gap-1.5 px-1 text-2xs text-subtle"><Eye className="h-3 w-3 shrink-0" />sees <span className="truncate font-medium text-muted">{sees}</span></div>}
        <div className="flex items-end gap-2 rounded-2xl bg-surface p-1.5 ring-1 ring-inset ring-line transition focus-within:ring-2 focus-within:ring-accent/50 dark:bg-raised/60">
          <textarea ref={ta} rows={1} value={y.draft} onChange={(e) => y.setDraft(e.target.value)} onKeyDown={key} maxLength={8000}
            placeholder={`Message ${name}…`} aria-label={`Message ${name}`}
            className={cx("scroll-thin min-h-[34px] flex-1 resize-none bg-transparent px-2.5 py-1.5 leading-snug text-fg placeholder:text-subtle focus:outline-none", roomy ? "text-[14.5px]" : "text-[13.5px]")} />
          {y.busy ? (
            <button onClick={y.stop} title="Stop" aria-label="Stop" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-raised text-fg transition hover:bg-line">
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button onClick={() => y.send(y.draft)} disabled={!y.draft.trim()} title="Send" aria-label="Send"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-ice-500 to-ice-700 text-white shadow-[0_4px_12px_-4px_rgb(61_130_220/.6)] transition hover:from-ice-400 hover:to-ice-600 active:scale-95 disabled:opacity-40 disabled:shadow-none">
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
