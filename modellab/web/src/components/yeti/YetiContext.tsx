import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { api, streamYeti, YetiEvent, YetiPage, YetiSettings } from "../../api";
import { useSession } from "../../session";

export interface YetiTool { id: string; label: string; href?: string | null; ok?: boolean; done: boolean }
export interface YetiMsg {
  id: string;
  role: "user" | "assistant";
  text: string;
  note?: string | null; // user: the page context the hub attached (sent back with later turns)
  about?: string | null; // user: what an Explain click was about, shown as a chip
  tools?: YetiTool[];
  status?: string | null; // assistant: the latest progress note while answering
  error?: { code: string; message: string } | null;
  streaming?: boolean;
  model?: string;
  usage?: { input: number; output: number; cache_read: number; cache_write: number };
}
/** What the current page shows, so "this" means something: pages register it with useYetiPage. */
export interface YetiPageInfo extends YetiPage { label?: string }
export interface YetiSuggestion { text: string; ask: string; focus: string; about?: string }

interface Ctx {
  available: boolean; // hub mode, signed in
  open: boolean;
  setOpen: (v: boolean) => void;
  view: "chat" | "settings";
  setView: (v: "chat" | "settings") => void;
  settings: YetiSettings | null;
  reloadSettings: () => Promise<void>;
  setSettings: (s: YetiSettings) => void;
  page: YetiPageInfo | null;
  suggestion: YetiSuggestion | null;
  register: (key: string, page: YetiPageInfo | null, suggestion: YetiSuggestion | null) => void;
  unregister: (key: string) => void;
  messages: YetiMsg[];
  busy: boolean;
  draft: string;
  setDraft: (s: string) => void;
  send: (text: string, opts?: { focus?: string; about?: string }) => void;
  ask: (question: string, focus?: string, about?: string) => void;
  stop: () => void;
  reset: () => void;
  retry: () => void;
}

const C = createContext<Ctx | null>(null);
const uid = () => Math.random().toString(36).slice(2, 10);
const MAX_KEPT = 60;

function load(key: string): YetiMsg[] {
  try {
    const raw = localStorage.getItem(key);
    const msgs = raw ? (JSON.parse(raw) as YetiMsg[]) : [];
    return Array.isArray(msgs) ? msgs.map((m) => ({ ...m, streaming: false })) : [];
  } catch { return []; }
}

export function YetiProvider({ children }: { children: ReactNode }) {
  const { hub, me } = useSession();
  const loc = useLocation();
  const user = me?.user?.username ?? null;
  const available = hub && !!user;
  const storeKey = `yeti-chat:${user ?? ""}`;
  const [open, setOpenState] = useState(false);
  const [view, setView] = useState<"chat" | "settings">("chat");
  const [settings, setSettings] = useState<YetiSettings | null>(null);
  const [messages, setMessages] = useState<YetiMsg[]>(() => (available ? load(storeKey) : []));
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [pages, setPages] = useState<Record<string, { page: YetiPageInfo | null; suggestion: YetiSuggestion | null }>>({});
  const abort = useRef<AbortController | null>(null);
  const msgsRef = useRef(messages);
  msgsRef.current = messages;

  useEffect(() => { setMessages(available ? load(storeKey) : []); }, [storeKey, available]);
  useEffect(() => {
    if (!available || busy) return;
    try { localStorage.setItem(storeKey, JSON.stringify(messages.slice(-MAX_KEPT))); } catch { /* private window */ }
  }, [messages, busy, storeKey, available]);

  const reloadSettings = useCallback(async () => {
    if (!available) return;
    try { setSettings(await api.yeti()); } catch { /* shown in the panel when opened */ }
  }, [available]);
  useEffect(() => { reloadSettings(); }, [reloadSettings]);

  const setOpen = useCallback((v: boolean) => { setOpenState(v); if (v) reloadSettings(); }, [reloadSettings]);

  const register = useCallback((key: string, page: YetiPageInfo | null, suggestion: YetiSuggestion | null) => {
    setPages((p) => ({ ...p, [key]: { page, suggestion } }));
  }, []);
  const unregister = useCallback((key: string) => setPages((p) => { const n = { ...p }; delete n[key]; return n; }), []);
  const top = Object.values(pages).slice(-1)[0] ?? null;
  const page: YetiPageInfo | null = top?.page ? { ...top.page, path: loc.pathname + loc.search } : { kind: "other", path: loc.pathname };
  const suggestion = top?.suggestion ?? null;

  const patch = (id: string, f: (m: YetiMsg) => YetiMsg) => setMessages((ms) => ms.map((m) => (m.id === id ? f(m) : m)));

  const run = useCallback(async (history: YetiMsg[], pageCtx: YetiPage | null, userId: string) => {
    const aid = uid();
    setMessages([...history, { id: aid, role: "assistant", text: "", tools: [], streaming: true }]);
    setBusy(true);
    const ctrl = new AbortController();
    abort.current = ctrl;
    const onEvent = (e: YetiEvent) => {
      if (e.type === "start") patch(userId, (m) => ({ ...m, note: e.note }));
      else if (e.type === "text") patch(aid, (m) => ({ ...m, text: m.text + e.text, status: null }));
      else if (e.type === "rewind") patch(aid, (m) => ({ ...m, text: m.text.slice(0, Math.max(0, m.text.length - e.chars)) }));
      else if (e.type === "note") patch(aid, (m) => ({ ...m, status: e.text }));
      else if (e.type === "tool") patch(aid, (m) => ({ ...m, status: null, tools: [...(m.tools ?? []), { id: e.id, label: e.label, done: false }] }));
      else if (e.type === "tool_done") patch(aid, (m) => ({ ...m, tools: (m.tools ?? []).map((t) => t.id === e.id ? { ...t, label: e.label, href: e.href, ok: e.ok, done: true } : t) }));
      else if (e.type === "done") patch(aid, (m) => ({ ...m, text: e.text, streaming: false, status: null, model: e.model_label, usage: e.usage }));
      else if (e.type === "error") patch(aid, (m) => ({ ...m, streaming: false, status: null, error: { code: e.code, message: e.message } }));
    };
    try {
      await streamYeti({ messages: history.filter((m) => m.text.trim() || m.role === "user").map((m) => ({ role: m.role, text: m.text, note: m.role === "user" ? m.note ?? null : null })), page: pageCtx },
        onEvent, ctrl.signal);
      patch(aid, (m) => (m.streaming ? { ...m, streaming: false, error: m.text ? null : { code: "cut", message: "The answer stopped early. Try again." } } : m));
    } catch (err) {
      const aborted = (err as Error).name === "AbortError";
      patch(aid, (m) => ({ ...m, streaming: false, status: null,
        error: aborted ? (m.text ? null : { code: "stopped", message: "Stopped." }) : { code: "http", message: (err as Error).message } }));
      if (!aborted && /connect yeti/i.test((err as Error).message)) reloadSettings();
    } finally {
      setBusy(false);
      abort.current = null;
    }
  }, [reloadSettings]);

  const send = useCallback((text: string, opts?: { focus?: string; about?: string }) => {
    const t = text.trim();
    if (!t || busy) return;
    const u: YetiMsg = { id: uid(), role: "user", text: t, about: opts?.about ?? null };
    const ctx: YetiPage | null = page ? { kind: page.kind, id: page.id, items: page.items, path: page.path, focus: opts?.focus } : null;
    setDraft("");
    run([...msgsRef.current.filter((m) => !(m.role === "assistant" && m.error && !m.text)), u], ctx, u.id);
  }, [busy, page, run]);

  const ask = useCallback((question: string, focus?: string, about?: string) => {
    setOpenState(true);
    setView("chat");
    if (settings && !settings.connected) { setDraft(question); return; }
    send(question, { focus, about });
  }, [send, settings]);

  const stop = useCallback(() => abort.current?.abort(), []);
  const reset = useCallback(() => { abort.current?.abort(); setMessages([]); setDraft(""); }, []);
  const retry = useCallback(() => {
    const ms = msgsRef.current;
    const lastUser = [...ms].reverse().find((m) => m.role === "user");
    if (!lastUser || busy) return;
    const upto = ms.slice(0, ms.indexOf(lastUser) + 1);
    const ctx: YetiPage | null = page ? { kind: page.kind, id: page.id, items: page.items, path: page.path } : null;
    run(upto, ctx, lastUser.id);
  }, [busy, page, run]);

  const value = useMemo<Ctx>(() => ({
    available, open, setOpen, view, setView, settings, reloadSettings, setSettings, page, suggestion, register, unregister,
    messages, busy, draft, setDraft, send, ask, stop, reset, retry,
  }), [available, open, setOpen, view, settings, reloadSettings, page, suggestion, register, unregister, messages, busy, draft, send, ask, stop, reset, retry]);
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useYeti(): Ctx {
  const c = useContext(C);
  if (!c) throw new Error("useYeti outside YetiProvider");
  return c;
}

/** A page tells Yeti what's on screen (so "this" means something) and, optionally, offers an explanation: Yeti then
 *  waves from the corner with a short suggestion. */
export function useYetiPage(page: YetiPageInfo | null, suggestion?: YetiSuggestion | null) {
  const { register, unregister } = useYeti();
  const key = useRef(uid()).current;
  const pj = JSON.stringify(page), sj = JSON.stringify(suggestion ?? null);
  useEffect(() => { register(key, page, suggestion ?? null); }, [key, pj, sj]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => unregister(key), [key, unregister]);
}
