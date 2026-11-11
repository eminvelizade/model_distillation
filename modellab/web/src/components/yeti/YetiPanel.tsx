import { KeyboardEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowUp, Check, Copy, Eye, KeyRound, Loader2, MessageCircle, MousePointerClick, Plug, RotateCcw, Settings2, Square, SquarePen, Trash2, X, Zap } from "lucide-react";
import { api, YetiSettings } from "../../api";
import { Button, Callout, cx, IconButton, inputCls, relTime, Segmented, sparkleBurst } from "../../ui";
import { CopyBox } from "../Hub";
import Markdown from "./Markdown";
import { MASCOT_LIST, setMascot, useMascot } from "./mascots";
import Yeti from "./Yeti";
import { useYeti, YetiMsg } from "./YetiContext";

const PAGE_NAMES: Record<string, string> = {
  searches: "Find best model", machines: "Machines", leaderboard: "Leaderboard", compare: "Compare", queue: "Queue",
  new: "New experiment", team: "Team",
};

function pageLabel(p: { kind: string; label?: string } | null): string | null {
  if (!p || p.kind === "other") return null;
  if (p.label) return `${p.kind} “${p.label}”`;
  return PAGE_NAMES[p.kind] ?? null;
}

/** The chat window: header, then the conversation, the connect screen or the settings. */
export default function YetiPanel() {
  const y = useYeti();
  const { name } = useMascot();
  const connected = !!y.settings?.connected;
  const fast = !!y.settings?.system1?.connected; // one-step actions work on the decision model alone
  const model = y.settings?.models.find((m) => m.id === y.settings?.model)?.label;
  useEffect(() => {
    const k = (e: globalThis.KeyboardEvent) => e.key === "Escape" && y.setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [y]);
  return (
    <div role="dialog" data-yeti-panel aria-label={`${name}, the ModelLab assistant`}
      className="fixed inset-0 z-50 flex origin-bottom-right animate-pop flex-col overflow-hidden bg-surface sm:inset-auto sm:bottom-[92px] sm:right-5 sm:h-[min(680px,calc(100vh-116px))] sm:w-[412px] sm:rounded-2xl sm:border sm:border-line sm:shadow-lift">
      <div className="flex items-center gap-2.5 border-b border-line px-3.5 py-2.5">
        <Yeti size={36} pose={y.busy ? "think" : connected ? "idle" : "sleep"} />
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-semibold text-fg">{name}</div>
          <div className="truncate text-2xs text-subtle">{connected ? `your ModelLab guide · ${model ?? "Claude"}` : fast ? "one-step actions · connect Claude for answers" : y.settings ? "not connected to Claude yet" : "…"}</div>
        </div>
        {y.view === "chat" && (connected || fast) && y.messages.length > 0 && <IconButton title="New chat" onClick={y.reset}><SquarePen /></IconButton>}
        <IconButton title={y.view === "settings" ? "Back to the chat" : "Settings"} onClick={() => y.setView(y.view === "settings" ? "chat" : "settings")}>
          {y.view === "settings" ? <MessageCircle /> : <Settings2 />}
        </IconButton>
        <IconButton title="Close" onClick={() => y.setOpen(false)}><X /></IconButton>
      </div>
      {y.view === "settings" ? <SettingsView /> : !y.settings ? <div className="flex flex-1 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-subtle" /></div>
        : connected || fast ? <ChatView /> : <ConnectView />}
    </div>
  );
}

// ---------------------------------------------------------------- chat

function ChatView() {
  const y = useYeti();
  const box = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  useLayoutEffect(() => {
    const el = box.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [y.messages]);
  const onScroll = () => {
    const el = box.current;
    if (el) stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
  };
  return (
    <>
      <div ref={box} onScroll={onScroll} className="scroll-thin flex-1 overflow-y-auto px-4 py-4">
        {y.messages.length === 0 ? <Welcome /> : <div className="space-y-5">{y.messages.map((m) => <Message key={m.id} m={m} />)}</div>}
      </div>
      <Composer />
    </>
  );
}

function suggestionsFor(kind: string | undefined): { label: string; ask: string; focus?: string }[] {
  const general = [
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

function Welcome() {
  const y = useYeti();
  const { name } = useMascot();
  const [pose, setPose] = useState<"wave" | "idle">("idle");
  useEffect(() => { const t = window.setTimeout(() => setPose("wave"), 150); const u = window.setTimeout(() => setPose("idle"), 1700); return () => { clearTimeout(t); clearTimeout(u); }; }, []);
  const chips = [...(y.suggestion ? [{ label: y.suggestion.text, ask: y.suggestion.ask, focus: y.suggestion.focus }] : []), ...suggestionsFor(y.page?.kind)]
    .filter((c, i, all) => all.findIndex((x) => x.ask === c.ask) === i).slice(0, 4);
  return (
    <div className="flex flex-col items-center px-1 pt-3 text-center">
      <Yeti size={88} pose={pose} />
      <div className="mt-3 text-[15px] font-semibold text-fg">Hi, I'm {name}</div>
      <p className="mt-1 max-w-[310px] text-[13px] leading-relaxed text-muted">
        I can show you around ModelLab, or explain your results: why a model won, what a PCA plot shows, how attention changed.
        {y.settings?.system1?.connected && " Or say what to do in one sentence, and I'll do it."}
      </p>
      <div className="mt-5 flex w-full flex-col gap-2">
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

function Message({ m }: { m: YetiMsg }) {
  const y = useYeti();
  const [copied, setCopied] = useState(false);
  if (m.role === "user") {
    return (
      <div className="flex flex-col items-end gap-1 animate-fade">
        {m.about && <span className="max-w-[85%] truncate rounded-full bg-raised px-2 py-0.5 text-2xs text-muted">about {m.about}</span>}
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-accent-soft px-3 py-2 text-[13px] leading-relaxed text-fg">{m.text}</div>
      </div>
    );
  }
  if (m.action) return <ActionCard m={m} />;
  const close = () => { if (window.matchMedia("(max-width: 639px)").matches) y.setOpen(false); };
  const copy = () => navigator.clipboard?.writeText(m.text).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1200); }).catch(() => undefined);
  const u = m.usage;
  return (
    <div className="flex gap-2.5">
      <Yeti size={28} pose={m.streaming ? "think" : "idle"} className="mt-0.5" />
      <div className="min-w-0 flex-1 space-y-2 pt-0.5">
        <ToolTrail m={m} />
        {m.text ? <Markdown text={m.text} onNavigate={close} />
          : m.streaming && (
            <div className="flex items-center gap-2 text-xs text-subtle">
              <span className="flex gap-1" aria-hidden>{[0, 1, 2].map((i) => <span key={i} className="yeti-dot h-1.5 w-1.5 rounded-full bg-accent/70" style={{ animationDelay: `${i * 0.15}s` }} />)}</span>
              <span className="truncate italic">{m.status ?? (m.tools?.length ? "thinking it over" : "thinking")}</span>
            </div>
          )}
        {m.streaming && m.text && m.status && <div className="truncate text-2xs italic text-subtle">{m.status}</div>}
        {m.error && (
          <Callout tone={m.error.code === "stopped" ? "info" : "error"}>
            {m.error.message}
            {m.error.code !== "stopped" && <button onClick={y.retry} className="ml-1.5 inline-flex items-center gap-1 font-medium underline underline-offset-2"><RotateCcw className="h-3 w-3" />Try again</button>}
            {(m.error.code === "auth" || m.error.code === "billing" || m.error.code === "not_found") &&
              <button onClick={() => y.setView("settings")} className="ml-1.5 font-medium underline underline-offset-2">Settings</button>}
          </Callout>
        )}
        {!m.streaming && m.text && (
          <div className="flex items-center gap-2 text-2xs text-subtle">
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

/** A one-sentence action, decided without Claude: what it is, what it changes, and (where the action runs or deletes
 *  something) the one tap it waits for. The same component shows what became of it. */
function ActionCard({ m }: { m: YetiMsg }) {
  const y = useYeti();
  const { d, state, note } = m.action!;
  const careful = d.tier === "careful";
  const happened = state === "done" ? note : state === "shown" ? "Here it is: I've ringed it on the page."
    : state === "declined" ? "Left as it is." : state === "failed" ? note : null;
  return (
    <div className="flex gap-2.5 animate-fade">
      <Yeti size={28} pose={state === "working" ? "think" : state === "done" ? "happy" : "idle"} className="mt-0.5" />
      <div className="min-w-0 flex-1 rounded-xl border border-line bg-surface p-3 shadow-soft">
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
        <div className="mt-1.5 text-2xs text-subtle" title="decided by the decision model, without Claude">
          {y.settings?.system1?.model ?? "decision model"}{d.ms ? ` · ${(d.ms / 1000).toFixed(1)} s` : ""}
        </div>
      </div>
    </div>
  );
}

function Composer() {
  const y = useYeti();
  const { name } = useMascot();
  const ta = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(150, el.scrollHeight)}px`;
  }, [y.draft]);
  useEffect(() => { if (window.matchMedia("(min-width: 640px)").matches) ta.current?.focus(); }, []);
  const key = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); y.send(y.draft); }
  };
  const sees = pageLabel(y.page);
  return (
    <div className="border-t border-line px-3 pb-3 pt-2.5">
      {sees && <div className="mb-2 flex min-w-0 items-center gap-1.5 px-1 text-2xs text-subtle"><Eye className="h-3 w-3 shrink-0" />sees <span className="truncate font-medium text-muted">{sees}</span></div>}
      <div className="flex items-end gap-2 rounded-xl bg-surface p-1.5 ring-1 ring-inset ring-line transition focus-within:ring-2 focus-within:ring-accent/50 dark:bg-raised/60">
        <textarea ref={ta} rows={1} value={y.draft} onChange={(e) => y.setDraft(e.target.value)} onKeyDown={key} maxLength={8000}
          placeholder={y.settings?.system1?.connected ? "Ask, or say what to do…" : "Ask about ModelLab or your results…"} aria-label={`Message ${name}`}
          className="scroll-thin min-h-[34px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[13.5px] leading-snug text-fg placeholder:text-subtle focus:outline-none" />
        {y.busy ? (
          <button onClick={y.stop} title="Stop" aria-label="Stop" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-raised text-fg transition hover:bg-line">
            <Square className="h-3.5 w-3.5 fill-current" />
          </button>
        ) : (
          <button onClick={() => y.send(y.draft)} disabled={!y.draft.trim()} title="Send" aria-label="Send"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-ice-500 to-ice-700 text-white shadow-[0_4px_12px_-4px_rgb(61_130_220/.6)] transition hover:from-ice-400 hover:to-ice-600 active:scale-95 disabled:opacity-35 disabled:shadow-none">
            <ArrowUp className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- connect + settings

function KeyForm({ compact, onDone }: { compact?: boolean; onDone?: () => void }) {
  const y = useYeti();
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const btn = useRef<HTMLSpanElement>(null);
  const save = async () => {
    setBusy(true);
    setErr(null);
    try {
      y.setSettings(await api.yetiSave({ api_key: key.trim() }));
      setKey("");
      sparkleBurst(btn.current);
      onDone?.();
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  return (
    <div className="space-y-2">
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (key.trim()) save(); }}>
        <input className={inputCls} type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="sk-ant-api03-…" autoComplete="off" spellCheck={false} aria-label="Claude API key" />
        <span ref={btn} className="shrink-0">
          <Button type="submit" variant={compact ? "secondary" : "brand"} disabled={busy || key.trim().length < 20}>{busy ? <Loader2 className="animate-spin" /> : <KeyRound />}{compact ? "Replace" : "Connect"}</Button>
        </span>
      </form>
      {err && <Callout tone="error">{err}</Callout>}
    </div>
  );
}

/** The OpenRouter key for the decision model: one short sentence becomes one action, without waiting for Claude. */
function FastKeyForm() {
  const y = useYeti();
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const s1 = y.settings?.system1;
  const save = async () => {
    setBusy(true);
    setErr(null);
    try { y.setSettings(await api.system1Save(key.trim())); setKey(""); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  const forget = async () => { try { y.setSettings(await api.system1Forget()); } catch (e) { setErr((e as Error).message); } };
  return (
    <div className="space-y-2.5">
      {s1?.connected ? (
        <div className="flex items-center gap-2 rounded-xl bg-raised/60 px-3 py-2 text-xs text-muted">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />On <span className="font-mono text-fg">{s1.key_hint}</span>
          <span className="truncate text-subtle">· {s1.model}</span>
          <button onClick={forget} className="ml-auto inline-flex shrink-0 items-center gap-1 text-subtle hover:text-rose-600 dark:hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" />Remove</button>
        </div>
      ) : <p className="text-xs text-muted">Off: paste a key from openrouter.ai → Keys.</p>}
      {s1?.key_error && <Callout tone="warn">{s1.key_error}</Callout>}
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (key.trim()) save(); }}>
        <input className={inputCls} type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="sk-or-v1-…" autoComplete="off" spellCheck={false} aria-label="OpenRouter API key" />
        <span className="shrink-0"><Button type="submit" disabled={busy || key.trim().length < 20}>{busy ? <Loader2 className="animate-spin" /> : <KeyRound />}{s1?.connected ? "Replace" : "Turn on"}</Button></span>
      </form>
      {err && <Callout tone="error">{err}</Callout>}
    </div>
  );
}

function ConnectorHelp({ s }: { s: YetiSettings }) {
  const url = s.connector.url;
  return (
    <div className="space-y-2.5 text-xs text-muted">
      <CopyBox text={url} />
      <div><span className="font-medium text-fg">Claude (web, desktop, mobile):</span> Settings → Connectors → Add custom connector, name it ModelLab,
        paste the address, then Connect and approve on the ModelLab page that opens.</div>
      <div><span className="font-medium text-fg">Claude Code:</span> run this, then <code className="rounded bg-raised px-1 font-mono text-[11px]">/mcp</code> to sign in.</div>
      <CopyBox text={`claude mcp add --transport http modellab ${url}`} wrap />
    </div>
  );
}

function ConnectView() {
  const y = useYeti();
  const { name } = useMascot();
  const s = y.settings!;
  return (
    <div className="scroll-thin flex-1 overflow-y-auto px-4 py-5">
      <div className="flex flex-col items-center text-center">
        <Yeti size={84} pose="wave" />
        <div className="mt-3 text-[15px] font-semibold text-fg">Let's connect me to Claude</div>
        <p className="mt-1 max-w-[320px] text-[13px] text-muted">I think with Claude, on your own account. Pick one way:</p>
      </div>
      {s.key_error && <Callout tone="warn" className="mt-4">{s.key_error}</Callout>}
      <section className="mt-5 rounded-2xl border border-line p-4">
        <div className="flex items-center gap-2 text-[13.5px] font-semibold text-fg"><KeyRound className="h-4 w-4 text-accent" />Chat here
          <span className="rounded-md bg-accent-soft px-1.5 py-px text-2xs font-medium text-accent">this window</span></div>
        <p className="mb-3 mt-1 text-xs leading-relaxed text-muted">
          Paste an API key from your Claude Console account (<a className="font-medium text-accent hover:underline" href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer">console.anthropic.com → API keys</a>).
          Usage is billed to that account. The key is stored encrypted on your hub and never shown again.
        </p>
        <KeyForm />
        {y.draft && <p className="mt-2 text-2xs text-subtle">Your question is waiting in the chat.</p>}
      </section>
      <section className="mt-3 rounded-2xl border border-line p-4">
        <div className="flex items-center gap-2 text-[13.5px] font-semibold text-fg"><Plug className="h-4 w-4 text-accent" />Use your Claude app instead</div>
        <p className="mb-3 mt-1 text-xs leading-relaxed text-muted">
          With a Claude subscription, add ModelLab as an MCP connector: Claude can then read your runs, searches and figures in
          claude.ai, Claude Desktop, mobile or Claude Code, after you approve it once.
        </p>
        <ConnectorHelp s={s} />
      </section>
      <p className="mt-4 px-1 text-2xs leading-relaxed text-subtle">
        Either way, Claude only sees what {name}'s tools return when you ask (names, settings, metrics, log tails, feature figures),
        never datasets, images or checkpoints, and it can't start, change or delete anything.
      </p>
    </div>
  );
}

/** Which mascot is the assistant: its look and name everywhere, and who Claude speaks as. Saved in this browser. */
function MascotPicker() {
  const { kind } = useMascot();
  const [poke, setPoke] = useState<string | null>(null);
  return (
    <section className="space-y-2">
      <h3 className="text-[13px] font-semibold text-fg">Your assistant</h3>
      <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6" role="radiogroup" aria-label="Assistant">
        {MASCOT_LIST.map((m) => (
          <button key={m.kind} role="radio" aria-checked={kind === m.kind} title={`${m.name}: ${m.tagline}`}
            onClick={() => { setMascot(m.kind); setPoke(m.kind); }} onMouseEnter={() => setPoke(null)}
            className={cx("flex flex-col items-center gap-0.5 rounded-xl px-0.5 pb-1.5 pt-1 text-2xs font-medium transition",
              kind === m.kind ? "bg-accent-soft text-fg ring-1 ring-inset ring-accent/25" : "text-muted hover:bg-raised/70 hover:text-fg")}>
            <Yeti kind={m.kind} size={48} fps={20} follow={false} pose={poke === m.kind ? "happy" : "idle"} />
            <span className="whitespace-nowrap">{m.name}</span>
          </button>
        ))}
      </div>
      <p className="text-2xs text-subtle">{MASCOT_LIST.find((m) => m.kind === kind)?.name}, {MASCOT_LIST.find((m) => m.kind === kind)?.tagline}. Saved in this browser.</p>
    </section>
  );
}

function SettingsView() {
  const y = useYeti();
  const { name } = useMascot();
  const s = y.settings;
  const [err, setErr] = useState<string | null>(null);
  if (!s) return <div className="flex flex-1 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-subtle" /></div>;
  const patch = async (body: { model?: string; effort?: string }) => {
    setErr(null);
    try { y.setSettings(await api.yetiSave(body)); } catch (e) { setErr((e as Error).message); }
  };
  const forget = async () => { try { y.setSettings(await api.yetiForgetKey()); } catch (e) { setErr((e as Error).message); } };
  const disconnect = async (cid: string) => {
    try { const r = await api.yetiDisconnect(cid); y.setSettings({ ...s, connector: { ...s.connector, apps: r.apps } }); } catch (e) { setErr((e as Error).message); }
  };
  return (
    <div className="scroll-thin flex-1 space-y-5 overflow-y-auto px-4 py-4">
      {err && <Callout tone="error">{err}</Callout>}
      <MascotPicker />
      <section className="space-y-2.5">
        <h3 className="text-[13px] font-semibold text-fg">Claude API key</h3>
        {s.connected ? (
          <div className="flex items-center gap-2 rounded-xl bg-raised/60 px-3 py-2 text-xs text-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />Connected <span className="font-mono text-fg">{s.key_hint}</span>
            <button onClick={forget} className="ml-auto inline-flex items-center gap-1 text-subtle hover:text-rose-600 dark:hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" />Remove</button>
          </div>
        ) : <p className="text-xs text-muted">Not connected: paste a key from console.anthropic.com → API keys.</p>}
        {s.key_error && <Callout tone="warn">{s.key_error}</Callout>}
        <KeyForm compact={s.connected} onDone={() => y.setView("chat")} />
      </section>
      <section className="space-y-2.5">
        <h3 className="flex items-center gap-1.5 text-[13px] font-semibold text-fg"><Zap className="h-3.5 w-3.5 text-accent" />One-step actions</h3>
        <p className="text-xs leading-relaxed text-muted">
          Say what to do in one sentence ("re-run this with batch size 4", "open the leaderboard") and {name} does it in under a second:
          a small decision model picks the action, and anything that runs or deletes something waits for your tap. It runs on your own
          OpenRouter account and sees your sentence and the names on screen, never images or files.
        </p>
        <FastKeyForm />
      </section>
      <section className="space-y-2">
        <h3 className="text-[13px] font-semibold text-fg">Model</h3>
        <div className="overflow-hidden rounded-xl border border-line">
          {s.models.map((m, i) => (
            <button key={m.id} onClick={() => patch({ model: m.id })}
              className={cx("flex w-full items-center gap-2.5 px-3 py-2 text-left transition hover:bg-raised/60", i > 0 && "border-t border-line")}>
              <span className={cx("flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-1 ring-inset", s.model === m.id ? "bg-accent ring-accent" : "ring-line")}>
                {s.model === m.id && <span className="h-1.5 w-1.5 rounded-full bg-white dark:bg-surface" />}
              </span>
              <span className="min-w-0 flex-1"><span className="block text-[13px] font-medium text-fg">{m.label}</span><span className="block text-2xs text-subtle">{m.note}</span></span>
            </button>
          ))}
        </div>
      </section>
      <section className="space-y-2">
        <h3 className="text-[13px] font-semibold text-fg">Answers</h3>
        <Segmented small value={s.effort} onChange={(v) => patch({ effort: v })} options={s.efforts.map((e) => ({ value: e.id, label: e.label }))} />
        <p className="text-2xs text-subtle">How long Claude thinks before answering: quicker answers cost less.</p>
      </section>
      <section className="space-y-2.5">
        <h3 className="text-[13px] font-semibold text-fg">Claude apps (MCP connector)</h3>
        <ConnectorHelp s={s} />
        {s.connector.apps.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-line">
            {s.connector.apps.map((a, i) => (
              <div key={a.client_id} className={cx("flex items-center gap-2 px-3 py-2 text-xs", i > 0 && "border-t border-line")}>
                <Plug className="h-3.5 w-3.5 text-accent" />
                <span className="min-w-0 flex-1"><span className="block truncate font-medium text-fg">{a.name}</span>
                  <span className="text-2xs text-subtle">connected {relTime(a.connected)}{a.last_used ? ` · used ${relTime(a.last_used)}` : ""}</span></span>
                <Button small variant="danger" onClick={() => disconnect(a.client_id)}>Disconnect</Button>
              </div>
            ))}
          </div>
        )}
      </section>
      <p className="text-2xs leading-relaxed text-subtle">
        Claude only sees what {name}'s tools return when you ask: run and search names, settings, metrics, log tails and feature
        figures. Never datasets, images or checkpoints. Claude can read but never start, change or delete anything; one-step
        actions are carried out by this page, through the same buttons you would press.
      </p>
    </div>
  );
}
