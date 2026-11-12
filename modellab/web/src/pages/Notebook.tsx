import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Loader2, Plus } from "lucide-react";
import { api, EntryStatus, NotebookEntry } from "../api";
import { Button, Callout, Card, cx, Empty, Field, inputCls, Modal, PageHeader, relTime, SearchInput, Segmented, usePoll } from "../ui";
import { useYetiPage } from "../components/yeti/YetiContext";
import { useMascot } from "../components/yeti/mascots";

const STATUS: Record<EntryStatus, { label: string; cls: string; dot: string }> = {
  open: { label: "open", cls: "bg-raised text-muted", dot: "bg-subtle" },
  answered: { label: "answered", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  dropped: { label: "dropped", cls: "bg-raised text-subtle line-through decoration-subtle/60", dot: "bg-subtle/60" },
};

/** An entry's status: open (waiting for its answer), answered (green: it has one), dropped (kept, with its reason). */
export function EntryPill({ status }: { status: EntryStatus }) {
  const s = STATUS[status];
  return (
    <span className={cx("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11.5px] font-medium", s.cls)}>
      <span className={cx("h-1.5 w-1.5 rounded-full", s.dot)} />{s.label}
    </span>
  );
}

/** Who wrote an entry, when it wasn't the user. */
export function Author({ who }: { who: NotebookEntry["author"] }) {
  const { name } = useMascot();
  if (who === "user") return null;
  return <span className="rounded-md bg-accent-soft px-1.5 py-px text-2xs font-medium text-accent">{who === "claude" ? `by ${name}` : "by a search"}</span>;
}

function NewEntry({ onClose }: { onClose: () => void }) {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const save = async () => {
    setBusy(true);
    setErr(null);
    try { const e = await api.createEntry({ title: title.trim(), question: question.trim() }); onClose(); nav(`/notebook/${e.id}`); }
    catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  return (
    <Modal onClose={onClose} className="max-w-lg">
      <form className="space-y-4 p-5" onSubmit={(e) => { e.preventDefault(); if (title.trim() && question.trim()) save(); }}>
        <div>
          <div className="text-[15px] font-semibold text-fg">New notebook entry</div>
          <p className="mt-0.5 text-xs text-muted">A question or an idea to test. Runs and searches started for it are linked to it.</p>
        </div>
        <Field label="Title"><input autoFocus className={inputCls} value={title} maxLength={140} onChange={(e) => setTitle(e.target.value)} placeholder="Distill DINOv3 into the Nano" /></Field>
        <Field label="The question, in your words">
          <textarea className={cx(inputCls, "h-28 resize-y py-2.5 leading-relaxed")} value={question} maxLength={4000} onChange={(e) => setQuestion(e.target.value)}
            placeholder="Could distilling DINOv3 into the Nano beat the Small at the same speed?" />
        </Field>
        {err && <Callout tone="error">{err}</Callout>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={busy || !title.trim() || !question.trim()}>{busy ? <Loader2 className="animate-spin" /> : <Plus />}Add</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function Notebook() {
  useYetiPage({ kind: "notebook" });
  const { name } = useMascot();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | EntryStatus>("");
  const [adding, setAdding] = useState(false);
  const list = usePoll(() => api.notebook({ q, status }), 10000, [q, status]);
  const rows = list.data ?? [];
  const counts = { all: rows.length };
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Analyze" title="Notebook"
        description="The lab's memory: each question with the runs that tested it and what was learned, including the ideas that didn't work."
        actions={<Button variant="brand" onClick={() => setAdding(true)}><Plus />New entry</Button>} />
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput value={q} onChange={setQ} placeholder="Search questions, plans and answers…" className="min-w-0 flex-1 basis-64" />
        <Segmented small value={status} onChange={setStatus}
          options={[{ value: "", label: "All" }, { value: "open", label: "Open" }, { value: "answered", label: "Answered" }, { value: "dropped", label: "Dropped" }]} />
      </div>
      {list.data && !rows.length ? (
        <Card><Empty title={q || status ? "No entries match" : "No entries yet"} mood="happy">
          {q || status ? "Try other words or another status." : <>Write down a question you want to test, or tell {name} an idea in the chat:
            it writes the entry, plans the runs and links them here. Every search you start gets an entry of its own.</>}
        </Empty></Card>
      ) : (
        <Card flush title={list.data ? `${counts.all} entr${counts.all === 1 ? "y" : "ies"}` : undefined}>
          {!list.data ? <div className="flex items-center justify-center gap-2 py-16 text-sm text-subtle"><Loader2 className="h-4 w-4 animate-spin" />loading…</div> : (
            <ul className="divide-y divide-line/70">
              {rows.map((e, i) => (
                <li key={e.id} className="animate-enter" style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}>
                  <Link to={`/notebook/${e.id}`} className="group flex items-start gap-4 px-5 py-3.5 transition hover:bg-raised/40">
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-subtle transition group-hover:text-accent" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-[14px] font-medium text-fg">{e.title}</span>
                        <EntryPill status={e.status} />
                        <Author who={e.author} />
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[13px] text-muted">{e.status === "answered" && e.answer ? e.answer.replace(/[*_`]/g, "") : e.question}</p>
                      <div className="mt-1 flex flex-wrap gap-x-3 text-2xs text-subtle">
                        <span>{e.runs} run{e.runs === 1 ? "" : "s"}{e.searches ? ` · ${e.searches} search${e.searches === 1 ? "" : "es"}` : ""}</span>
                        <span>updated {relTime(e.updated)}</span>
                        {e.status === "dropped" && e.status_reason && <span className="truncate">dropped: {e.status_reason}</span>}
                      </div>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-subtle transition group-hover:translate-x-0.5 group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
      {adding && <NewEntry onClose={() => setAdding(false)} />}
    </div>
  );
}
