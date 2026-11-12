import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, FlaskConical, Link2, Loader2, Pencil, RotateCcw, Trash2, Wand2, X } from "lucide-react";
import { api, fmt, NotebookDetail, RunSummary } from "../api";
import { Button, Callout, Card, cx, Empty, IconButton, inputCls, Modal, PageHeader, relTime, StatusPill, Toast, usePoll } from "../ui";
import Markdown from "../components/yeti/Markdown";
import ExplainButton from "../components/yeti/ExplainButton";
import { useYetiPage } from "../components/yeti/YetiContext";
import { useMascot } from "../components/yeti/mascots";
import { Author, EntryPill } from "./Notebook";

type Field = "title" | "question" | "plan" | "answer";

/** One text of the entry: shown (Markdown for the plan and the answer), or edited in place. */
function Section({ e, field, title, empty, onSave, actions, markdown = true }: {
  e: NotebookDetail; field: Field; title: string; empty: string; onSave: (f: Field, v: string) => Promise<void>;
  actions?: React.ReactNode; markdown?: boolean;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const value = e[field] ?? "";
  const save = async () => { setBusy(true); try { await onSave(field, draft ?? ""); setDraft(null); } finally { setBusy(false); } };
  return (
    <Card title={title} actions={draft === null
      ? <>{actions}<IconButton title={`Edit the ${title.toLowerCase()}`} onClick={() => setDraft(value)}><Pencil /></IconButton></>
      : <><Button small variant="ghost" onClick={() => setDraft(null)}>Cancel</Button>
        <Button small variant="primary" disabled={busy || (field === "question" && !draft.trim())} onClick={save}>{busy ? <Loader2 className="animate-spin" /> : <Check />}Save</Button></>}>
      {draft !== null ? (
        <textarea autoFocus value={draft} onChange={(ev) => setDraft(ev.target.value)} maxLength={field === "question" ? 4000 : 8000}
          className={cx(inputCls, "h-40 resize-y py-2.5 font-mono text-[12.5px] leading-relaxed")} placeholder={markdown ? "Markdown" : undefined} />
      ) : value ? (markdown ? <Markdown text={value} /> : <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-fg">{value}</p>)
        : <p className="text-[13px] text-subtle">{empty}</p>}
    </Card>
  );
}

function LinkPicker({ e, onLinked, onClose }: { e: NotebookDetail; onLinked: (d: NotebookDetail) => void; onClose: () => void }) {
  const [runs, setRuns] = useState<RunSummary[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { api.runs().then(setRuns).catch((x) => setErr(String(x.message))); }, []);
  const linked = new Set(e.linked_runs.map((r) => r.id));
  const pick = (id: string) => api.linkEntry(e.id, "run", id).then((d) => { onLinked(d); onClose(); }).catch((x) => setErr(String(x.message)));
  const rows = (runs ?? []).filter((r) => !linked.has(r.id)).slice(0, 40);
  return (
    <Modal onClose={onClose} className="max-w-lg">
      <div className="border-b border-line px-5 py-3.5">
        <div className="text-[15px] font-semibold text-fg">Link a run</div>
        <p className="text-xs text-muted">Runs you started some other way can count as evidence too.</p>
      </div>
      <div className="scroll-thin max-h-[50vh] overflow-y-auto p-2">
        {err && <Callout tone="error">{err}</Callout>}
        {!runs ? <div className="flex justify-center py-8"><Loader2 className="h-4 w-4 animate-spin text-subtle" /></div>
          : !rows.length ? <p className="px-3 py-8 text-center text-sm text-subtle">No other runs.</p>
          : rows.map((r) => (
            <button key={r.id} onClick={() => pick(r.id)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13px] hover:bg-raised">
              <span className="min-w-0 flex-1 truncate font-medium text-fg">{r.name}</span>
              {r.best && <span className="font-mono text-[11.5px] tabular-nums text-muted">mAP {fmt.pct(r.best.map)}</span>}
              <StatusPill status={r.status} />
            </button>
          ))}
      </div>
    </Modal>
  );
}

export default function NotebookEntryPage() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const { name } = useMascot();
  const ent = usePoll(() => api.entry(id), 5000, [id]);
  const [data, setData] = useState<NotebookDetail | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [dropping, setDropping] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => { if (ent.data) setData(ent.data); }, [ent.data]);
  const e = data;
  const ready = !!e && e.all_finished && e.status === "open";
  const ask = "All the runs and searches of this notebook entry have finished. Compare their results against its question, quote the "
    + "numbers the answer rests on (and the seed noise, if known), and record the answer and its status in the notebook.";
  useYetiPage(e ? { kind: "entry", id: e.id, label: e.title } : null,
    ready ? { text: "Its runs have finished. Want me to write up the answer?", ask, focus: "answer", about: "the answer" } : null);

  if (ent.error && !e) return <Card><Empty title="Entry not found" mood="sad">{ent.error} · <Link className="text-accent" to="/notebook">the notebook</Link></Empty></Card>;
  if (!e) return <div className="flex items-center justify-center gap-2 py-24 text-sm text-subtle"><Loader2 className="h-4 w-4 animate-spin" />loading…</div>;

  const patch = async (body: Parameters<typeof api.patchEntry>[1]) => {
    try { setData(await api.patchEntry(e.id, body)); } catch (x) { setToast((x as Error).message); throw x; }
  };
  const save = (f: Field, v: string) => patch({ [f]: v });
  const unlink = (kind: "run" | "search", ref: string) => api.unlinkEntry(e.id, kind, ref).then(setData).catch((x) => setToast(String(x.message)));
  const fill = (path: string, f: Record<string, string>) => `${path}?${new URLSearchParams({ fill: JSON.stringify(f), n: String(Date.now()) })}`;
  const by = (who: string) => (who === "claude" ? name : who === "loop" ? "a search" : "you");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<span className="flex items-center gap-1.5"><Link to="/notebook" className="hover:underline">Notebook</Link><span className="text-subtle">/</span><span className="text-muted">entry</span></span>}
        title={<span className="flex flex-wrap items-center gap-3">{e.title}<EntryPill status={e.status} /><Author who={e.author} /></span>}
        actions={<>
          {e.status !== "answered" && <Button onClick={() => patch({ status: "answered" }).catch(() => undefined)} disabled={!e.answer} title={e.answer ? undefined : "write the answer first"}><Check />Answered</Button>}
          {e.status !== "dropped" && <Button variant="ghost" onClick={() => setDropping("")}><X />Drop</Button>}
          {e.status !== "open" && <Button variant="ghost" onClick={() => patch({ status: "open" }).catch(() => undefined)}><RotateCcw />Reopen</Button>}
          <IconButton title="Delete this entry (its runs stay)" className="h-9 w-9 hover:text-rose-600" onClick={() => setDeleting(true)}><Trash2 /></IconButton>
        </>}>
        <div className="mt-2 text-xs text-muted">written by {by(e.author)} {relTime(e.created)} · updated {relTime(e.updated)}{e.updated_by !== e.author ? ` by ${by(e.updated_by)}` : ""}</div>
      </PageHeader>

      {e.status === "dropped" && e.status_reason && <Callout tone="info" title="Dropped">{e.status_reason}</Callout>}
      {ready && <Callout tone="success" title={<span className="flex flex-wrap items-center justify-between gap-2">Everything it ran has finished
        <ExplainButton label="Write up the answer" focus="answer" about="the answer" ask={ask} /></span>}>
        The answer goes below, with the numbers it rests on.</Callout>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Section e={e} field="question" title="Question" empty="" onSave={save} markdown={false} />
        <Section e={e} field="plan" title="Plan" onSave={save}
          empty="No plan yet: what to run where, the estimated GPU time, and which result would answer the question." />
      </div>

      <Card flush title="What tested it" description={`${e.linked_runs.length} run${e.linked_runs.length === 1 ? "" : "s"}${e.linked_searches.length ? `, ${e.linked_searches.length} search${e.linked_searches.length === 1 ? "" : "es"}` : ""}`}
        actions={<>
          <Button small onClick={() => nav(fill("/", { tag: `nb:${e.id}` }))}><FlaskConical />New experiment</Button>
          <Button small onClick={() => nav(fill("/search", { notebook: e.id }))}><Wand2 />New search</Button>
          <Button small variant="ghost" onClick={() => setLinking(true)}><Link2 />Link a run</Button>
        </>}>
        {!e.linked_runs.length && !e.linked_searches.length ? (
          <p className="px-5 pb-5 text-[13px] text-subtle">Nothing yet. Experiments and searches started from here are linked to this entry; so is anything {name} drafts for it.</p>
        ) : (
          <ul className="divide-y divide-line/70">
            {e.linked_searches.map((s) => (
              <li key={s.id} className="group flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3">
                <Wand2 className="h-4 w-4 shrink-0 text-subtle" />
                <Link to={`/search/${s.id}`} className="min-w-0 flex-1 basis-56 truncate text-[13.5px] font-medium text-fg hover:text-accent">{s.name}</Link>
                <span className="truncate text-xs text-muted">{s.recommendation ? `recommends ${s.recommendation.model} @ ${s.recommendation.image_size}` : s.message}</span>
                {s.recommendation && <span className="font-mono text-[12px] font-medium tabular-nums text-emerald-700 dark:text-emerald-300">{fmt.pct(s.recommendation.map_test_mean ?? s.recommendation.map_valid_mean)} mAP</span>}
                <StatusPill status={s.status} />
                <IconButton title="Unlink" onClick={() => unlink("search", s.id)} className="opacity-0 transition group-hover:opacity-100 focus:opacity-100"><X /></IconButton>
              </li>
            ))}
            {e.linked_runs.map((r) => (
              <li key={r.id} className="group flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3">
                <FlaskConical className="h-4 w-4 shrink-0 text-subtle" />
                <Link to={`/runs/${r.id}`} className="min-w-0 flex-1 basis-56 truncate text-[13.5px] font-medium text-fg hover:text-accent">{r.name}</Link>
                <span className="text-xs text-subtle">{[r.dataset, r.machine_name].filter(Boolean).join(" · ")}</span>
                {r.best ? <span className="font-mono text-[12px] tabular-nums text-muted">
                    <span className="font-medium text-fg">{fmt.pct(r.best.map)}</span> mAP{r.best.latency_ms != null && <> · {r.best.latency_ms.toFixed(1)} ms</>}</span>
                  : r.status === "running" ? <span className="font-mono text-[12px] tabular-nums text-muted">{Math.round(r.progress * 100)}%</span> : null}
                <StatusPill status={r.status} />
                <IconButton title="Unlink" onClick={() => unlink("run", r.id)} className="opacity-0 transition group-hover:opacity-100 focus:opacity-100"><X /></IconButton>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Section e={e} field="answer" title="Answer" onSave={save}
        empty={e.all_finished ? "Not written yet." : "Not yet: it comes when what tested it has finished. A negative answer counts too."}
        actions={!ready && e.all_finished && !e.answer ? <ExplainButton label="Write it up" focus="answer" about="the answer" ask={ask} /> : undefined} />

      {dropping !== null && (
        <Modal onClose={() => setDropping(null)} className="max-w-md">
          <form className="space-y-3 p-5" onSubmit={(ev) => { ev.preventDefault(); patch({ status: "dropped", status_reason: dropping }).then(() => setDropping(null)).catch(() => undefined); }}>
            <div className="text-[15px] font-semibold text-fg">Drop this idea</div>
            <p className="text-xs text-muted">Dropped entries stay in the notebook with their reason, so nobody tries it again without knowing.</p>
            <textarea autoFocus className={cx(inputCls, "h-24 resize-y py-2.5")} value={dropping} maxLength={1000} onChange={(ev) => setDropping(ev.target.value)} placeholder="Why?" />
            <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setDropping(null)}>Cancel</Button><Button type="submit" variant="primary" disabled={!dropping.trim()}>Drop it</Button></div>
          </form>
        </Modal>
      )}
      {deleting && (
        <Modal onClose={() => setDeleting(false)} className="max-w-md">
          <div className="space-y-3 p-5">
            <div className="text-[15px] font-semibold text-fg">Delete “{e.title}”?</div>
            <p className="text-xs text-muted">The entry goes; its runs and searches stay. To keep what was learned, drop it instead.</p>
            <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setDeleting(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => api.deleteEntry(e.id).then(() => nav("/notebook")).catch((x) => setToast(String(x.message)))}><Trash2 />Delete</Button></div>
          </div>
        </Modal>
      )}
      {linking && <LinkPicker e={e} onLinked={setData} onClose={() => setLinking(false)} />}
      <Toast msg={toast} onClose={() => setToast(null)} />
    </div>
  );
}
