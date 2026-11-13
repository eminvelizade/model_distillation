import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { KeyRound, Loader2, Maximize2, MessageCircle, Plug, Settings2, Trash2, Users, X, Zap } from "lucide-react";
import { api, YetiSettings } from "../../api";
import { Button, Callout, cx, IconButton, inputCls, relTime, Segmented, sparkleBurst } from "../../ui";
import { CopyBox } from "../Hub";
import { useMascot } from "./mascots";
import { Composer, ThreadView } from "./Thread";
import Yeti from "./Yeti";
import { useYeti } from "./YetiContext";

/** The corner panel: the current agent's thread (the same one the Chat tab shows), the connect screen or the
 *  settings. */
export default function YetiPanel() {
  const y = useYeti();
  const { name } = useMascot();
  const loc = useLocation();
  const onChat = loc.pathname.startsWith("/chat");   // the Chat tab is the thread: there, the panel is only the settings
  const connected = !!y.settings?.connected;
  const fast = !!y.settings?.system1?.connected; // one-step actions work on the decision model alone
  const model = y.settings?.models.find((m) => m.id === y.settings?.model)?.label;
  const view = onChat ? "settings" : y.view;
  useEffect(() => {
    const k = (e: globalThis.KeyboardEvent) => e.key === "Escape" && y.setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [y]);
  const plan = y.agent?.plan;
  const sub = y.busy ? "thinking…" : plan ? `${plan.status === "waiting" ? "waiting for you on" : "working on"} “${plan.title}”`
    : connected ? `${y.agent?.role || "your ModelLab guide"} · ${model ?? "Claude"}` : fast ? "one-step actions · connect Claude for answers" : y.settings ? "not connected to Claude yet" : "…";
  return (
    <div role="dialog" data-yeti-panel aria-label={`${name}, the ModelLab assistant`}
      className="fixed inset-0 z-50 flex origin-bottom-right animate-pop flex-col overflow-hidden bg-surface sm:inset-auto sm:bottom-[92px] sm:right-5 sm:h-[min(680px,calc(100vh-116px))] sm:w-[412px] sm:rounded-2xl sm:border sm:border-line sm:shadow-pop">
      <div className="flex items-center gap-2.5 border-b border-line px-3.5 py-2.5">
        <Yeti size={36} pose={y.busy ? "think" : connected || fast ? "idle" : "sleep"} />
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-semibold text-fg">{view === "settings" ? "Settings" : name}</div>
          <div className="truncate text-2xs text-subtle">{view === "settings" ? "Claude, one-step actions, Claude apps" : sub}</div>
        </div>
        {view === "chat" && y.agents.length > 1 && (
          <div className="flex items-center -space-x-1.5" role="radiogroup" aria-label="Agent">
            {y.agents.filter((a) => a.id !== y.agent?.id).slice(0, 3).map((a) => (
              <button key={a.id} role="radio" aria-checked={false} title={`Talk to ${a.name}`} onClick={() => y.selectAgent(a.id)}
                className="relative rounded-full bg-surface ring-2 ring-surface transition hover:z-10 hover:-translate-y-0.5">
                <Yeti look={a.look} size={26} fps={8} follow={false} />
                {a.unread > 0 && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-surface" />}
              </button>
            ))}
          </div>
        )}
        {view === "chat" && <Link to={y.agent ? `/chat/${y.agent.id}` : "/chat"} onClick={() => y.setOpen(false)} title="Open in Chat" aria-label="Open in Chat"
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-subtle transition hover:bg-raised hover:text-fg"><Maximize2 className="h-[15px] w-[15px]" /></Link>}
        {!onChat && (
          <IconButton title={view === "settings" ? "Back to the chat" : "Settings"} onClick={() => y.setView(view === "settings" ? "chat" : "settings")}>
            {view === "settings" ? <MessageCircle /> : <Settings2 />}
          </IconButton>
        )}
        <IconButton title="Close" onClick={() => y.setOpen(false)}><X /></IconButton>
      </div>
      {view === "settings" ? <SettingsView /> : !y.settings ? <div className="flex flex-1 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-subtle" /></div>
        : connected || fast ? <><ThreadView /><Composer /></> : <ConnectView />}
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
        never datasets, images or checkpoints. It can fill a form in, offer an action as a card or write a plan; anything that
        runs, cancels or deletes waits for your tap.
      </p>
    </div>
  );
}

/** The team: who the agents are is set in the Chat tab (each has a name, a look and a role of its own). */
function TeamRow() {
  const y = useYeti();
  return (
    <section className="space-y-2">
      <h3 className="text-[13px] font-semibold text-fg">Your agents</h3>
      <Link to="/chat" onClick={() => y.setOpen(false)} className="flex items-center gap-2.5 rounded-xl border border-line px-3 py-2 transition hover:bg-raised/60">
        <span className="flex -space-x-2">{y.agents.slice(0, 4).map((a) => <span key={a.id} className="rounded-full bg-surface ring-2 ring-surface"><Yeti look={a.look} size={30} fps={8} follow={false} /></span>)}</span>
        <span className="min-w-0 flex-1 text-xs text-muted"><span className="block font-medium text-fg">{y.agents.map((a) => a.name).join(", ") || "…"}</span>
          Names, looks, roles and what they keep in mind: in Chat</span>
        <Users className="h-4 w-4 shrink-0 text-subtle" />
      </Link>
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
      <TeamRow />
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
        figures. Never datasets, images or checkpoints. Claude starts nothing by itself: it can fill a form in, offer an
        action as a card or write a plan of several steps, and anything that runs, cancels or deletes waits for your tap.
        A plan runs on the hub once you press Start, inside what you approved.
      </p>
    </div>
  );
}
