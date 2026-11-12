import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Lightbulb, Loader2, Pencil, Plus, Settings2, SquarePen, Trash2, X } from "lucide-react";
import { Agent, AgentNote, api } from "../api";
import { Button, Callout, cx, IconButton, inputCls, Modal, relTime } from "../ui";
import AgentEditor from "../components/yeti/AgentEditor";
import { agentColour } from "../components/yeti/mascots";
import { Composer, ThreadView } from "../components/yeti/Thread";
import Yeti from "../components/yeti/Yeti";
import { useYeti, useYetiPage } from "../components/yeti/YetiContext";

// Chat: the team on the left, the thread of the agent you are talking to on the right. The thread is kept on the hub,
// so it is the same one the corner panel shows, and a plan reports into it while no page is open.

function preview(a: Agent): string {
  if (a.plan) return `${a.plan.status === "waiting" ? "Needs you" : "Working on"}: ${a.plan.title}`;
  const l = a.last;
  if (!l) return a.role || "Say hello";
  const t = l.text.replace(/[*_`#>]/g, "").replace(/\s+/g, " ").trim();
  return l.role === "user" ? `You: ${t}` : l.kind === "plan" ? `Plan: ${t}` : l.kind === "card" ? `Offered: ${t}` : t || "…";
}

function Team({ onNew, onNotes, notes }: { onNew: () => void; onNotes: () => void; notes: number | null }) {
  const y = useYeti();
  const nav = useNavigate();
  return (
    <>
      <div className="flex items-center gap-2 px-4 pb-2 pt-4">
        <h1 className="text-[17px] font-semibold tracking-tight text-fg">Chat</h1>
        <IconButton title="New agent" className="ml-auto" onClick={onNew}><Plus /></IconButton>
      </div>
      <div className="scroll-thin flex-1 space-y-0.5 overflow-y-auto px-2 pb-2">
        {y.agents.map((a) => {
          const on = a.id === y.agent?.id;
          return (
            <button key={a.id} onClick={() => { y.selectAgent(a.id); nav(`/chat/${a.id}`); }} aria-current={on}
              className={cx("flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition", on ? "bg-accent-soft" : "hover:bg-raised/70")}>
              <span className="relative shrink-0">
                <Yeti look={a.look} size={46} fps={on ? 20 : 8} follow={on} pose={a.plan?.status === "running" ? "think" : "idle"} />
                {a.plan && <span className={cx("absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-surface", a.plan.status === "waiting" ? "bg-amber-500" : "bg-sky-500")} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="truncate text-[13.5px] font-semibold text-fg">{a.name}</span>
                  {a.last && <span className="ml-auto shrink-0 text-[10.5px] text-subtle">{relTime(a.last.created)}</span>}
                </span>
                <span className="flex items-center gap-2">
                  <span className={cx("truncate text-xs", a.unread ? "font-medium text-fg" : "text-muted")}>{preview(a)}</span>
                  {a.unread > 0 && <span className="ml-auto flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-rose-500 px-1 text-[10.5px] font-semibold text-white">{a.unread > 9 ? "9+" : a.unread}</span>}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <button onClick={onNotes} className="m-2 flex items-center gap-2.5 rounded-xl border border-line px-3 py-2 text-left transition hover:bg-raised/60">
        <Lightbulb className="h-4 w-4 shrink-0 text-accent" />
        <span className="min-w-0 flex-1 text-xs text-muted"><span className="block font-medium text-fg">Kept in mind</span>
          {notes == null ? "…" : notes ? `${notes} note${notes === 1 ? "" : "s"} your agents follow` : "Corrections and preferences land here"}</span>
      </button>
    </>
  );
}

/** What the agents keep in mind between conversations: the user can read, change and delete every note. */
function Notes({ onClose }: { onClose: () => void }) {
  const [rows, setRows] = useState<AgentNote[] | null>(null);
  const [text, setText] = useState("");
  const [edit, setEdit] = useState<{ id: string; text: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const load = () => api.notes().then(setRows).catch((e) => setErr((e as Error).message));
  useEffect(() => { load(); }, []);
  const run = (p: Promise<unknown>) => p.then(() => { setErr(null); load(); }).catch((e) => setErr((e as Error).message));
  return (
    <Modal onClose={onClose} className="max-w-lg">
      <div className="space-y-4 p-5">
        <div>
          <div className="text-[15px] font-semibold text-fg">What your agents keep in mind</div>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">Corrections and standing preferences, a sentence each. An agent adds one when you correct it;
            every agent reads all of them at the start of every answer. Change or remove any of them here.</p>
        </div>
        {err && <Callout tone="error">{err}</Callout>}
        {!rows ? <div className="flex justify-center py-6"><Loader2 className="h-4 w-4 animate-spin text-subtle" /></div>
          : rows.length === 0 ? <p className="rounded-xl bg-raised/60 px-3 py-4 text-center text-xs text-muted">Nothing yet. Try telling an agent “always use the 5090 for quick tests”.</p>
          : (
            <ul className="divide-y divide-line/70 overflow-hidden rounded-xl border border-line">
              {rows.map((n) => (
                <li key={n.id} className="flex items-start gap-2 px-3 py-2">
                  {edit?.id === n.id ? (
                    <form className="flex min-w-0 flex-1 gap-2" onSubmit={(e) => { e.preventDefault(); run(api.patchNote(n.id, edit.text)).then(() => setEdit(null)); }}>
                      <input autoFocus className={inputCls} value={edit.text} maxLength={300} onChange={(e) => setEdit({ id: n.id, text: e.target.value })} />
                      <IconButton title="Save"><Check /></IconButton>
                      <IconButton title="Cancel" onClick={() => setEdit(null)}><X /></IconButton>
                    </form>
                  ) : <>
                    <span className="min-w-0 flex-1 text-[13px] leading-snug text-fg">{n.text}<span className="mt-0.5 block text-2xs text-subtle">by {n.by} · {relTime(n.updated)}</span></span>
                    <IconButton title="Change" onClick={() => setEdit({ id: n.id, text: n.text })}><Pencil /></IconButton>
                    <IconButton title="Remove" onClick={() => run(api.deleteNote(n.id))}><Trash2 /></IconButton>
                  </>}
                </li>
              ))}
            </ul>
          )}
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (text.trim().length > 2) run(api.addNote(text.trim())).then(() => setText("")); }}>
          <input className={inputCls} value={text} maxLength={300} onChange={(e) => setText(e.target.value)} placeholder="Add one yourself: “Show me the plan before queueing anything.”" />
          <Button type="submit" disabled={text.trim().length < 3}><Plus />Add</Button>
        </form>
        <div className="flex justify-end"><Button variant="ghost" onClick={onClose}>Done</Button></div>
      </div>
    </Modal>
  );
}

export default function Chat() {
  const y = useYeti();
  const { id } = useParams();
  const nav = useNavigate();
  useYetiPage({ kind: "chat" });
  useEffect(() => y.watch(), [y.watch]);
  // /chat/<id> picks that agent; /chat alone shows whoever was picked last
  useEffect(() => { if (id && id !== y.agent?.id && y.agents.some((a) => a.id === id)) y.selectAgent(id); }, [id, y.agents.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const [editing, setEditing] = useState<Agent | "new" | null>(null);
  const [notes, setNotes] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => { if (!notes) api.notes().then((n) => setCount(n.length)).catch(() => undefined); }, [notes, y.messages.length]);
  const a = y.agent;
  const connected = !!y.settings?.connected, fast = !!y.settings?.system1?.connected;
  const model = y.settings?.models.find((m) => m.id === y.settings?.model)?.label;
  const status = y.busy ? "thinking…" : a?.plan ? `${a.plan.status === "waiting" ? "waiting for you on" : "working on"} “${a.plan.title}”`
    : a?.role || (connected ? `on ${model ?? "Claude"}` : fast ? "one-step actions only: connect Claude for answers and plans" : "not connected to Claude yet");
  const clear = () => { if (window.confirm(`Start a fresh conversation with ${a?.name}? What was said is removed; plans, notes and the notebook stay.`)) y.reset(); };
  return (
    <div className="flex h-[calc(100dvh-14rem)] min-h-[460px] overflow-hidden rounded-2xl border border-line bg-surface shadow-soft lg:h-[calc(100dvh-5rem)]">
      <aside className={cx("w-full shrink-0 flex-col border-line sm:flex sm:w-[290px] sm:border-r", id ? "hidden" : "flex")}>
        <Team onNew={() => setEditing("new")} onNotes={() => setNotes(true)} notes={count} />
      </aside>
      <section className={cx("min-w-0 flex-1 flex-col sm:flex", id ? "flex" : "hidden")}>
        {a && (
          <div className="flex items-center gap-3 border-b border-line px-4 py-2.5"
            style={{ background: `linear-gradient(to right, color-mix(in srgb, ${agentColour(a.look)} 9%, transparent), transparent 70%)` }}>
            <Link to="/chat" className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-subtle hover:bg-raised hover:text-fg sm:hidden" aria-label="Back to the team"><ArrowLeft className="h-4 w-4" /></Link>
            <button onClick={() => setEditing(a)} title={`Change ${a.name}`} className="shrink-0 rounded-full transition hover:scale-105 active:scale-95">
              <Yeti look={a.look} size={44} pose={y.busy || a.plan?.status === "running" ? "think" : "idle"} />
            </button>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14.5px] font-semibold text-fg">{a.name}</div>
              <div className="truncate text-xs text-muted">{status}</div>
            </div>
            <IconButton title={`Change ${a.name}`} onClick={() => setEditing(a)}><Pencil /></IconButton>
            {y.messages.length > 0 && <IconButton title="Fresh conversation" onClick={clear}><SquarePen /></IconButton>}
            <IconButton title="Settings" onClick={() => { y.setView("settings"); y.setOpen(true); }}><Settings2 /></IconButton>
          </div>
        )}
        {!y.settings || !a ? <div className="flex flex-1 items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-subtle" /></div>
          : connected || fast ? <><ThreadView roomy /><Composer roomy /></>
          : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
              <Yeti look={a.look} size={120} pose="wave" />
              <div className="text-[15px] font-semibold text-fg">Connect {a.name} to Claude</div>
              <p className="max-w-[360px] text-[13px] leading-relaxed text-muted">Your agents think with Claude, on your own account. Paste an API key once and they can answer, plan and run things for you.</p>
              <Button variant="brand" onClick={() => { y.setView("settings"); y.setOpen(true); }}>Open settings</Button>
            </div>
          )}
      </section>
      {editing && <AgentEditor agent={editing === "new" ? null : editing} canDelete={y.agents.length > 1}
        onClose={async (saved, deleted) => {
          setEditing(null);
          if (!saved && !deleted) return;
          const list = await y.reloadAgents();
          if (saved) { y.selectAgent(saved.id); nav(`/chat/${saved.id}`); } else if (list[0]) { y.selectAgent(list[0].id); nav("/chat"); }
        }} />}
      {notes && <Notes onClose={() => setNotes(false)} />}
    </div>
  );
}
