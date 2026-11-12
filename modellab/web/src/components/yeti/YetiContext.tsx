import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Agent, AgentEvent, api, Plan, streamAgent, ThreadMsg, YetiPage, YetiSettings } from "../../api";
import { legacyMascot, setCurrentAgent } from "./mascots";
import { useSession } from "../../session";
import { changed, COVERED, Decision, highlight, spotsFor, useCarryOut } from "../../agent";

export interface YetiTool { id: string; label: string; href?: string | null; ok?: boolean; done: boolean }
/** One message of the thread on screen. The thread itself is kept on the hub (hub/agents.py); while a turn streams,
 *  its messages are local until the turn ends and the thread is read back. */
export interface YetiMsg {
  id: string;
  role: "user" | "assistant" | "event";   // event: the hub's own report of what happened to a plan
  text: string;
  created?: number;
  about?: string | null; // user: what an Explain click was about, shown as a chip
  tools?: YetiTool[];
  status?: string | null; // assistant: the latest progress note while answering
  error?: { code: string; message: string } | null;
  streaming?: boolean;
  model?: string;
  usage?: { input: number; output: number; cache_read: number; cache_write: number };
  /** assistant: one action as a card, and what became of it */
  action?: { d: Decision; state: "shown" | "pending" | "working" | "done" | "declined" | "failed"; note?: string };
  /** assistant: a plan card (the plan's id: its live state is in `plans`) */
  plan?: string;
}

const fromHub = (m: ThreadMsg): YetiMsg => ({
  id: m.id, role: m.role === "agent" ? "assistant" : m.role, text: m.text, created: m.created, about: m.about, tools: m.tools,
  error: m.error ?? null, model: m.model, usage: m.usage, plan: m.kind === "plan" ? m.plan : undefined,
  action: m.kind === "card" && m.d ? { d: m.d, state: m.state === "working" ? "pending" : m.state ?? "pending", note: m.note ?? undefined } : undefined,
});

/** A decision in a sentence (what the thread keeps for a card). */
export function actionText(d: Decision): string {
  const what = [d.title, d.target].filter(Boolean).join(": ");
  const changes = (d.changes ?? []).map((c) => `${c.label.toLowerCase()} ${c.value}`).join(", ");
  return changes ? `${what} (${changes})` : what;
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
  /** the team, and the agent being talked to */
  agents: Agent[];
  agent: Agent | null;
  selectAgent: (id: string) => void;
  reloadAgents: () => Promise<Agent[]>;
  unread: number;
  messages: YetiMsg[];
  plans: Record<string, Plan>;
  loaded: boolean;
  busy: boolean;
  draft: string;
  setDraft: (s: string) => void;
  send: (text: string, opts?: { focus?: string; about?: string }) => void;
  ask: (question: string, focus?: string, about?: string) => void;
  stop: () => void;
  reset: () => void;
  retry: () => void;
  /** the user's tap on an action card: carry the action out, or leave it */
  approve: (msgId: string) => void;
  decline: (msgId: string) => void;
  /** the user's own word on a plan: Start, Not now, Stop, or (when it waits on a failed step) retry or skip */
  planDo: (planId: string, what: "approve" | "decline" | "cancel" | "retry" | "skip") => Promise<void>;
  /** a page that shows the thread itself (the Chat tab) says so: it is kept fresh and counts as read */
  watch: () => () => void;
}

const C = createContext<Ctx | null>(null);
const uid = () => "local-" + Math.random().toString(36).slice(2, 10);

export function YetiProvider({ children }: { children: ReactNode }) {
  const { hub, me, machineId } = useSession();
  const loc = useLocation();
  const carry = useCarryOut();
  const user = me?.user?.username ?? null;
  const available = hub && !!user;
  const pickKey = `yeti-agent:${user ?? ""}`;
  const [open, setOpenState] = useState(false);
  const [view, setView] = useState<"chat" | "settings">("chat");
  const [settings, setSettings] = useState<YetiSettings | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [picked, setPicked] = useState<string | null>(() => { try { return localStorage.getItem(pickKey); } catch { return null; } });
  const [messages, setMessages] = useState<YetiMsg[]>([]);
  const [plans, setPlans] = useState<Record<string, Plan>>({});
  const [loaded, setLoaded] = useState(false);
  const [wake, setWake] = useState(false);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");
  const [watchers, setWatchers] = useState(0);
  const [pages, setPages] = useState<Record<string, { page: YetiPageInfo | null; suggestion: YetiSuggestion | null }>>({});
  const abort = useRef<AbortController | null>(null);
  const msgsRef = useRef(messages);
  msgsRef.current = messages;
  const busyRef = useRef(busy);
  busyRef.current = busy;

  const agent = agents.find((a) => a.id === picked) ?? agents[0] ?? null;
  const aid = agent?.id ?? null;
  const aidRef = useRef(aid);
  aidRef.current = aid;
  const visible = open || watchers > 0;

  const reloadSettings = useCallback(async () => {
    if (!available) return;
    try { setSettings(await api.yeti()); } catch { /* shown in the panel when opened */ }
  }, [available]);
  useEffect(() => { reloadSettings(); }, [reloadSettings]);

  const reloadAgents = useCallback(async () => {
    if (!available) return [];
    try { const list = await api.agents(legacyMascot()); setAgents(list); return list; } catch { return []; }
  }, [available]);
  useEffect(() => { setAgents([]); reloadAgents(); }, [reloadAgents]);
  useEffect(() => { if (!available) return; const t = window.setInterval(reloadAgents, visible ? 8000 : 20000); return () => window.clearInterval(t); }, [available, visible, reloadAgents]);
  useEffect(() => { if (agent) setCurrentAgent(agent.name, agent.look); }, [agent?.name, JSON.stringify(agent?.look)]); // eslint-disable-line react-hooks/exhaustive-deps
  const selectAgent = useCallback((id: string) => {
    if (busyRef.current) abort.current?.abort();
    setPicked(id);
    try { localStorage.setItem(pickKey, id); } catch { /* private window: this tab only */ }
  }, [pickKey]);

  // the thread, read from the hub: when the agent changes, and every few seconds while it is on screen
  const loadThread = useCallback(async () => {
    const id = aidRef.current;
    if (!id) return;
    try {
      const t = await api.thread(id);
      if (aidRef.current !== id) return;
      setPlans((p) => ({ ...p, ...t.plans }));
      if (busyRef.current) return;   // a turn is streaming: its messages are local until it ends
      setMessages(t.messages.map(fromHub));
      setWake(t.wake);
      setLoaded(true);
    } catch { /* offline for a moment: the next poll tries again */ }
  }, []);
  useEffect(() => { setMessages([]); setPlans({}); setLoaded(false); setWake(false); if (aid) loadThread(); }, [aid, loadThread]);
  useEffect(() => {
    if (!aid || !visible) return;
    loadThread();
    const t = window.setInterval(loadThread, 5000);
    return () => window.clearInterval(t);
  }, [aid, visible, loadThread]);
  // what is on screen counts as read
  useEffect(() => {
    if (!aid || !visible || !agent?.unread) return;
    api.markRead(aid).then(() => setAgents((as) => as.map((a) => (a.id === aid ? { ...a, unread: 0 } : a)))).catch(() => undefined);
  }, [aid, visible, agent?.unread, messages.length]);

  const setOpen = useCallback((v: boolean) => { setOpenState(v); if (v) reloadSettings(); }, [reloadSettings]);
  // The panel floats over the page: when it covers what it is pointing at, it steps aside so the ring can be seen.
  // A card that waits for a tap keeps it open (the tap is in the panel).
  useEffect(() => {
    const aside = () => {
      const waiting = msgsRef.current.slice(-6).some((m) => ["pending", "working"].includes(m.action?.state ?? ""));
      if (!waiting) setOpenState(false);
    };
    window.addEventListener(COVERED, aside);
    return () => window.removeEventListener(COVERED, aside);
  }, []);

  const register = useCallback((key: string, page: YetiPageInfo | null, suggestion: YetiSuggestion | null) => {
    setPages((p) => ({ ...p, [key]: { page, suggestion } }));
  }, []);
  const unregister = useCallback((key: string) => setPages((p) => { const n = { ...p }; delete n[key]; return n; }), []);
  const top = Object.values(pages).slice(-1)[0] ?? null;
  const page: YetiPageInfo | null = top?.page ? { ...top.page, path: loc.pathname + loc.search } : { kind: "other", path: loc.pathname };
  const suggestion = top?.suggestion ?? null;

  const patch = (id: string, f: (m: YetiMsg) => YetiMsg) => setMessages((ms) => ms.map((m) => (m.id === id ? f(m) : m)));

  /** One turn with Claude, streamed: the hub writes it into the thread, and the thread is read back when it ends. */
  const run = useCallback(async (body: { text?: string; page?: YetiPage | null; about?: string | null; retry?: boolean }, asWake = false) => {
    const id = aidRef.current;
    if (!id) return;
    const tmp = uid();
    setMessages((ms) => [...ms.filter((m) => !(m.role === "assistant" && m.error && !m.text)),
      ...(body.text ? [{ id: uid(), role: "user" as const, text: body.text, about: body.about ?? null }] : []),
      { id: tmp, role: "assistant", text: "", tools: [], streaming: true }]);
    setBusy(true);
    busyRef.current = true;
    setWake(false);
    const ctrl = new AbortController();
    abort.current = ctrl;
    // Claude drafted or proposed an action: opening and filling in happen now; the rest is a card that waits for a tap
    const act = async (d: Decision, mid?: string) => {
      const card = (action: NonNullable<YetiMsg["action"]>) => setMessages((ms) => [...ms, { id: mid ?? uid(), role: "assistant", text: actionText(d), action }]);
      const tell = (state: string, note?: string) => { if (mid) api.cardState(id, mid, state, note).catch(() => undefined); };
      if (d.needs !== "none") { highlight(spotsFor(d)); card({ d, state: "pending" }); return; }
      try {
        const done = await carry(d);
        card({ d, state: "done", note: done });
        tell("done", done);
        if (d.id) api.actionOutcome(d.id, "done").catch(() => undefined);
      } catch (err) {
        card({ d, state: "failed", note: (err as Error).message });
        tell("failed", (err as Error).message);
        if (d.id) api.actionOutcome(d.id, "failed", (err as Error).message).catch(() => undefined);
      }
    };
    let queue: Promise<void> = Promise.resolve();
    let idle = false;
    const onEvent = (e: AgentEvent) => {
      if (e.type === "idle") idle = true;
      else if (e.type === "text") patch(tmp, (m) => ({ ...m, text: m.text + e.text, status: null }));
      else if (e.type === "rewind") patch(tmp, (m) => ({ ...m, text: m.text.slice(0, Math.max(0, m.text.length - e.chars)) }));
      else if (e.type === "note") patch(tmp, (m) => ({ ...m, status: e.text }));
      else if (e.type === "tool") patch(tmp, (m) => ({ ...m, status: null, tools: [...(m.tools ?? []), { id: e.id, label: e.label, done: false }] }));
      else if (e.type === "tool_done") {
        if (e.href?.startsWith("/notebook")) changed();
        patch(tmp, (m) => ({ ...m, tools: (m.tools ?? []).map((t) => (t.id === e.id ? { ...t, label: e.label, href: e.href, ok: e.ok, done: true } : t)) }));
      }
      else if (e.type === "done") patch(tmp, (m) => ({ ...m, text: e.text, streaming: false, status: null, model: e.model_label, usage: e.usage }));
      else if (e.type === "action") queue = queue.then(() => act(e.decision, e.mid)); // one after the other, in the order Claude gave
      else if (e.type === "plan") {
        setPlans((p) => ({ ...p, [e.plan.id]: e.plan }));
        setMessages((ms) => (ms.some((m) => m.plan === e.plan.id) ? ms : [...ms, { id: e.mid ?? uid(), role: "assistant", text: e.plan.title, plan: e.plan.id }]));
      }
      else if (e.type === "error") patch(tmp, (m) => ({ ...m, streaming: false, status: null, error: { code: e.code, message: e.message } }));
    };
    let failed: string | null = null;
    try {
      await streamAgent(id, body, onEvent, ctrl.signal, asWake);
      await queue;
      patch(tmp, (m) => (m.streaming ? { ...m, streaming: false, error: m.text || idle ? null : { code: "cut", message: "The answer stopped early. Try again." } } : m));
    } catch (err) {
      const aborted = (err as Error).name === "AbortError";
      failed = aborted ? null : (err as Error).message;
      patch(tmp, (m) => ({ ...m, streaming: false, status: null,
        error: aborted ? (m.text ? null : { code: "stopped", message: "Stopped." }) : { code: "http", message: (err as Error).message } }));
      if (!aborted && /connect (yeti|claude)/i.test((err as Error).message)) reloadSettings();
    } finally {
      busyRef.current = false;
      setBusy(false);
      abort.current = null;
      if (idle) setMessages((ms) => ms.filter((m) => m.id !== tmp));
      if (!failed) { await loadThread(); reloadAgents(); }   // the turn as the hub kept it (its ids, the cards, the plan)
    }
  }, [reloadSettings, carry, loadThread, reloadAgents]);

  const send = useCallback((text: string, opts?: { focus?: string; about?: string }) => {
    const t = text.trim();
    const id = aidRef.current;
    if (!t || busy || !id) return;
    const ctx: YetiPage | null = page ? { kind: page.kind, id: page.id, items: page.items, path: page.path, focus: opts?.focus } : null;
    setDraft("");
    const claude = () => {
      if (settings?.connected) { run({ text: t, page: ctx, about: opts?.about ?? null }); return; }
      setMessages((ms) => [...ms, { id: uid(), role: "user", text: t, about: opts?.about ?? null }, { id: uid(), role: "assistant", text: "",
        error: { code: "auth", message: "That one needs Claude: I can do one-step actions on my own, but questions and plans need a Claude API key." } }]);
    };
    // One short sentence goes to the decision model first: it either names one action (carried out here, with the
    // user's tap where the action needs one) or hands over to Claude. An Explain click is always Claude's.
    if (!settings?.system1?.connected || opts?.focus || t.length > 300) { claude(); return; }
    const u: YetiMsg = { id: uid(), role: "user", text: t, about: opts?.about ?? null };
    setMessages((ms) => [...ms, u]);
    setBusy(true);
    busyRef.current = true;
    (async () => {
      let d: Decision | null = null;
      try { d = await api.decide(t, { ...(ctx ?? { kind: "other" }), rows: page?.rows, form: page?.form, machine: machineId ?? undefined }); } catch { /* Claude takes it */ }
      const done = () => { busyRef.current = false; setBusy(false); };
      // what the decision model did is kept in the thread too, so the chat tab, the panel and Claude all see it
      const keep = async (m: Partial<YetiMsg>) => {
        setMessages((ms) => [...ms, { id: uid(), role: "assistant", text: "", ...m }]);
        try {
          await api.record(id, { text: t, about: opts?.about ?? null, ...(m.action ? { card: { d: m.action.d, state: m.action.state, note: m.action.note ?? null } } : { reply: m.text }) });
        } catch { /* the action itself happened: only the record is missing */ }
        done();
        await loadThread();
      };
      if (d?.fast && d.action) {
        const phone = window.matchMedia("(max-width: 639px)").matches;
        if (d.show) {
          highlight(spotsFor(d));
          await keep({ text: actionText(d), action: { d, state: "shown" } });
          if (phone) setOpenState(false);
        } else if (d.needs === "none") {
          try {
            const note = await carry(d);
            if (d.id) api.actionOutcome(d.id, "done").catch(() => undefined);
            await keep({ text: actionText(d), action: { d, state: "done", note } });
            if (phone) setOpenState(false);
          } catch (e) {
            if (d.id) api.actionOutcome(d.id, "failed", (e as Error).message).catch(() => undefined);
            await keep({ text: actionText(d), action: { d, state: "failed", note: (e as Error).message } });
          }
        } else {
          highlight(spotsFor(d));
          await keep({ text: actionText(d), action: { d, state: "pending" } });
        }
        return;
      }
      if (d?.tell) { await keep({ text: d.tell.charAt(0).toUpperCase() + d.tell.slice(1) + "." }); return; }
      done();
      setMessages((ms) => ms.filter((m) => m.id !== u.id));   // Claude's turn shows the question itself
      claude();
    })();
  }, [busy, page, run, settings, machineId, carry, loadThread]);

  const settle = (id: string, state: NonNullable<YetiMsg["action"]>["state"], note?: string) => {
    patch(id, (m) => (m.action ? { ...m, action: { ...m.action, state, note } } : m));
    if (aidRef.current && !id.startsWith("local-")) api.cardState(aidRef.current, id, state, note).catch(() => undefined);
  };
  const approve = useCallback((msgId: string) => {
    const m = msgsRef.current.find((x) => x.id === msgId);
    if (!m?.action || m.action.state !== "pending") return;
    const d = m.action.d;
    settle(msgId, "working");
    if (d.id) api.actionOutcome(d.id, "approved").catch(() => undefined);
    carry(d).then((done) => { settle(msgId, "done", done); if (d.id) api.actionOutcome(d.id, "done").catch(() => undefined); })
      .catch((e) => { settle(msgId, "failed", (e as Error).message); if (d.id) api.actionOutcome(d.id, "failed", (e as Error).message).catch(() => undefined); });
  }, [carry]);
  const decline = useCallback((msgId: string) => {
    const m = msgsRef.current.find((x) => x.id === msgId);
    if (!m?.action || m.action.state !== "pending") return;
    settle(msgId, "declined");
    highlight([]);
    if (m.action.d.id) api.actionOutcome(m.action.d.id, "declined").catch(() => undefined);
  }, []);

  const planDo = useCallback(async (planId: string, what: "approve" | "decline" | "cancel" | "retry" | "skip") => {
    const p = what === "retry" || what === "skip" ? await api.planResume(planId, what) : await api.planDo(planId, what);
    setPlans((ps) => ({ ...ps, [p.id]: p }));
    changed();
    loadThread();
    reloadAgents();
  }, [loadThread, reloadAgents]);

  const ask = useCallback((question: string, focus?: string, about?: string) => {
    setOpenState(true);
    setView("chat");
    if (settings && !settings.connected) { setDraft(question); return; }
    send(question, { focus, about });
  }, [send, settings]);

  const stop = useCallback(() => abort.current?.abort(), []);
  const reset = useCallback(() => {
    abort.current?.abort();
    setMessages([]);
    setDraft("");
    if (aidRef.current) api.clearThread(aidRef.current).then(reloadAgents).catch(() => undefined);
  }, [reloadAgents]);
  const retry = useCallback(() => {
    if (busy) return;
    const ctx: YetiPage | null = page ? { kind: page.kind, id: page.id, items: page.items, path: page.path } : null;
    run({ retry: true, page: ctx });
  }, [busy, page, run]);

  // The hub reported something while nobody was looking (a plan finished or got stuck): with the thread on screen
  // and Claude connected, the agent follows up once, on its own.
  useEffect(() => {
    if (!wake || !visible || busy || !settings?.connected || !aid) return;
    const ctx: YetiPage | null = page ? { kind: page.kind, id: page.id, items: page.items, path: page.path } : null;
    run({ page: ctx }, true);
  }, [wake, visible, busy, settings?.connected, aid]); // eslint-disable-line react-hooks/exhaustive-deps

  const watch = useCallback(() => { setWatchers((n) => n + 1); return () => setWatchers((n) => n - 1); }, []);
  const unread = agents.reduce((n, a) => n + a.unread, 0);

  const value = useMemo<Ctx>(() => ({
    available, open, setOpen, view, setView, settings, reloadSettings, setSettings, page, suggestion, register, unregister,
    agents, agent, selectAgent, reloadAgents, unread, messages, plans, loaded, busy, draft, setDraft, send, ask, stop, reset, retry,
    approve, decline, planDo, watch,
  }), [available, open, setOpen, view, settings, reloadSettings, page, suggestion, register, unregister, agents, agent, selectAgent,
    reloadAgents, unread, messages, plans, loaded, busy, draft, send, ask, stop, reset, retry, approve, decline, planDo, watch]);
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
