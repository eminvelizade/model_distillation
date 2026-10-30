import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowUpRight, Calendar, Check, Copy, CopyPlus, Database, FileText, GitCompareArrows, HardDrive, Loader2, RotateCcw, Server, Square, Timer, Trash2, X } from "lucide-react";
import { api, fmt } from "../api";
import { Button, Callout, Card, cx, LogView, Modal, PageHeader, ProgressBar, Segmented, sparkleBurst, StatusPill, Switch, Tag, TermTab, Toast, Yaml, inputCls, relTime, usePoll } from "../ui";
import { useSession } from "../session";

function Kpi({ label, value, sub, hero }: { label: string; value: string; sub?: string; hero?: boolean }) {
  return (
    <div className={cx("min-w-0 rounded-xl px-3 py-2.5", hero ? "bg-gradient-to-br from-ice-400/15 to-ice-frost/10 ring-1 ring-inset ring-accent/25" : "bg-raised/60")}>
      <div className="truncate text-2xs font-medium text-muted">{label}</div>
      <div className={cx("mt-0.5 truncate font-mono font-medium tabular-nums text-fg", hero ? "text-xl" : "text-[15px]")}>{value}</div>
      {sub && <div className="truncate font-mono text-2xs text-subtle">{sub}</div>}
    </div>
  );
}

function EvalResult({ m }: { m: any }) {
  const pc = Object.entries(m.per_class ?? {}) as [string, number | null][];
  const max = Math.max(0.01, ...pc.map(([, v]) => v ?? 0));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 2xl:grid-cols-8">
        <Kpi hero label="mAP50:95" value={fmt.pct(m.map)} />
        <Kpi label="mAP50" value={fmt.pct(m.map50)} />
        <Kpi label="AP small" value={fmt.pct(m.ap_small)} />
        <Kpi label="AP medium" value={fmt.pct(m.ap_medium)} />
        <Kpi label="AP large" value={fmt.pct(m.ap_large)} />
        <Kpi label="Latency" value={m.latency_ms != null ? `${m.latency_ms.toFixed(2)} ms` : "–"} sub={m.latency_p95_ms != null ? `p95 ${m.latency_p95_ms.toFixed(2)}` : undefined} />
        <Kpi label="Params" value={m.params_m != null ? `${m.params_m.toFixed(1)} M` : "–"} />
        <Kpi label="Peak VRAM" value={fmt.mb(m.peak_vram_mb)} />
      </div>
      {pc.length > 0 && (
        <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {pc.map(([c, v]) => (
            <div key={c} className="flex items-center gap-3 text-xs">
              <span className="w-24 truncate text-muted">{c}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-raised">
                <div className="h-full origin-left animate-growx rounded-full bg-gradient-to-r from-ice-300 to-ice-500" style={{ width: `${((v ?? 0) / max) * 100}%` }} />
              </div>
              <span className="w-9 text-right font-mono tabular-nums text-fg">{fmt.pct(v)}</span>
            </div>
          ))}
        </div>
      )}
      <div className="text-2xs leading-relaxed text-subtle">
        {m.images} images · {m.latency_device ?? "latency not measured"} · eval <span className="font-mono">{m.eval_version}</span> · data {m.dataset}/{m.split} <span className="font-mono">{m.dataset_hash?.slice(0, 10)}</span> · weights: {m.weights_origin}
        {m.warning && <span className="ml-2 text-amber-600 dark:text-amber-400">⚠ {m.warning}</span>}
      </div>
    </div>
  );
}

function FeaturesResult({ m, runId, outputs }: { m: any; runId: string; outputs: any }) {
  const tbl = "w-full text-xs [&_td]:py-1.5 [&_th]:py-1.5 [&_th]:font-medium [&_tr]:border-t [&_tr]:border-line/70 [&_thead_tr]:border-0";
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="space-y-4 rounded-xl bg-raised/40 p-3">
        <table className={tbl}>
          <thead className="text-left text-muted"><tr><th>Backbone</th><th className="text-right">kNN acc</th><th className="text-right">linear acc</th></tr></thead>
          <tbody>{Object.entries(m.probes ?? {}).map(([k, v]: [string, any]) => (
            <tr key={k}><td className="text-fg">{k}</td><td className="text-right font-mono tabular-nums">{fmt.pct(v.knn_acc)}</td><td className="text-right font-mono tabular-nums">{fmt.pct(v.linear_acc)}</td></tr>
          ))}</tbody>
        </table>
        <table className={tbl}>
          <thead className="text-left text-muted"><tr><th>Linear CKA</th><th className="text-right">objects</th><th className="text-right">tokens</th></tr></thead>
          <tbody>{Object.entries(m.cka ?? {}).map(([k, v]: [string, any]) => (
            <tr key={k}><td className="text-fg">{k}</td><td className="text-right font-mono tabular-nums">{fmt.num(v.objects, 3)}</td><td className="text-right font-mono tabular-nums">{fmt.num(v.tokens, 3)}</td></tr>
          ))}</tbody>
        </table>
        <div className="text-2xs text-subtle">{m.images} images · {m.objects} objects · size {m.size} · split {m.split}</div>
      </div>
      {outputs?.pca && <img src={api.fileUrl(runId, `stages/${m.__stage}/${outputs.pca}`)} alt="PCA" className="w-full rounded-xl border border-line bg-white" />}
    </div>
  );
}

function StageNode({ status }: { status: string }) {
  return (
    <span className={cx("absolute -left-[35px] top-0 flex h-[22px] w-[22px] items-center justify-center rounded-full ring-4 ring-surface [&_svg]:h-3 [&_svg]:w-3",
      status === "done" ? "bg-emerald-500 text-white" : status === "running" ? "bg-sky-500 text-white" : status === "failed" ? "bg-rose-500 text-white"
        : ["cancelled", "interrupted"].includes(status) ? "bg-amber-400 text-amber-950" : "bg-raised text-subtle ring-4 ring-surface")}>
      {status === "done" ? <Check strokeWidth={3} /> : status === "running" ? <Loader2 className="animate-spin" /> : status === "failed" ? <X strokeWidth={3} /> : status !== "pending" ? <Square /> : <span className="h-1.5 w-1.5 rounded-full bg-subtle" />}
    </span>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-[13px]">
      <span className="text-muted">{label}</span>
      <span className="min-w-0 truncate text-right text-fg">{children}</span>
    </div>
  );
}

export default function RunDetail() {
  const { id = "" } = useParams();
  const { data: r, refresh } = usePoll(() => api.run(id), 3000, [id]);
  const [logStage, setLogStage] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [tab, setTab] = useState<"recipe" | "env" | "data">("recipe");
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteFiles, setDeleteFiles] = useState(false);
  const nav = useNavigate();
  const { hub } = useSession();
  if (!r) return <div className="flex items-center justify-center gap-2 py-24 text-sm text-subtle"><Loader2 className="h-4 w-4 animate-spin" />loading…</div>;
  // `then` replaces the refresh (after a delete there is nothing left to fetch)
  const act = (p: Promise<{ result: string }>, then?: () => void) => p.then((x) => { setToast(x.result); if (then) then(); else refresh(); }).catch((e) => setToast(String(e.message)));
  const stageForLogs = logStage ?? r.current_stage ?? r.stages.find((s: any) => s.status === "failed")?.name ?? "runner";
  const finished = ["done", "failed", "cancelled", "interrupted"].includes(r.status);
  const copyId = () => { navigator.clipboard?.writeText(r.id).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1200); }).catch(() => undefined); };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<span className="flex items-center gap-1.5"><Link to="/queue" className="hover:underline">Runs</Link><span className="text-subtle">/</span>
          <button onClick={copyId} className="inline-flex items-center gap-1 font-mono text-muted hover:text-fg" title="Copy run id">{r.id}{copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}</button></span>}
        title={<span className="flex flex-wrap items-center gap-3">{r.name}<StatusPill status={r.status} /></span>}
        actions={<>
          <Button variant="brand" onClick={() => nav(`/?clone=${r.id}`)}><CopyPlus />Clone & edit</Button>
          {(r.status === "running" || r.status === "queued") && <Button variant="danger" onClick={() => act(api.cancel(r.id))}><Square />Cancel</Button>}
          {finished && <Button onClick={() => act(api.requeue(r.id))} title="finished stages are kept; resumes at the first unfinished one"><RotateCcw />Re-queue</Button>}
          {finished && <Button variant="ghost" onClick={() => (hub ? setDeleting(true) : window.confirm("Delete this run and its files?") && act(api.remove(r.id), () => nav("/leaderboard")))}><Trash2 />Delete</Button>}
        </>}>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-subtle" />{fmt.time(r.created)}</span>
          <span className="flex items-center gap-1.5"><Timer className="h-3.5 w-3.5 text-subtle" />{r.started ? `ran ${fmt.dur(r.started, r.finished)}` : "not started"}</span>
          <span className="flex items-center gap-1.5"><Database className="h-3.5 w-3.5 text-subtle" />{r.dataset}</span>
          {r.machine_name && <Link to={`/machines/${r.machine_id}`} className="flex items-center gap-1.5 hover:text-accent"><Server className="h-3.5 w-3.5 text-subtle" />{r.machine_name}</Link>}
          {r.tags.map((t: string) => <Tag key={t}>{t}</Tag>)}
        </div>
      </PageHeader>

      {r.status === "running" && <ProgressBar value={r.progress} active />}
      {r.status === "running" && !r.current_stage && r.status_message && <div className="-mt-3 text-xs text-sky-700 dark:text-sky-300">{r.status_message}</div>}
      {r.error_tail && r.status !== "done" && (
        <Callout tone="error" title="Run failed">
          <pre className="scroll-thin mt-1 max-h-48 overflow-auto whitespace-pre font-mono text-[11.5px] leading-relaxed">{r.error_tail}</pre>
        </Callout>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <Card title="Stages" description={`${r.stages.filter((s: any) => s.status === "done").length} of ${r.stages.length} done`}>
            <ol className="relative ml-[11px] space-y-6 border-l border-line pl-6 pt-1">
              {r.stages.map((s: any) => (
                <li key={s.name} className="relative">
                  <StageNode status={s.status} />
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-semibold text-fg">{s.name}</span>
                    <span className="rounded-md bg-raised px-1.5 py-0.5 text-2xs font-medium text-muted">{s.type}</span>
                    {s.status !== "done" && <StatusPill status={s.status} />}
                    {s.started && <span className="font-mono text-xs text-subtle">{fmt.dur(s.started, s.finished)}</span>}
                    {s.status === "running" && s.progress && <span className="text-xs text-sky-600 dark:text-sky-400">{Math.round(s.progress.fraction * 100)}% · {s.progress.message}</span>}
                    <button onClick={() => setLogStage(s.name)} className="ml-auto inline-flex items-center gap-1 text-xs text-subtle hover:text-accent"><FileText className="h-3 w-3" />logs</button>
                  </div>
                  {s.status === "running" && s.progress && <ProgressBar className="mt-2" value={s.progress.fraction} active />}
                  {s.result?.metrics && s.type === "eval" && <div className="mt-3"><EvalResult m={s.result.metrics} /></div>}
                  {s.result?.metrics && s.type === "features" && <div className="mt-3"><FeaturesResult m={{ ...s.result.metrics, __stage: s.name }} runId={r.id} outputs={s.result.outputs} /></div>}
                  {s.result && ["distill", "finetune"].includes(s.type) && (
                    <div className="mt-1 text-xs text-muted">→ <span className="font-mono">{Object.entries(s.result.outputs).map(([k, v]) => `${k}: ${v}`).join(" · ")}</span> · {s.result.seconds}s</div>
                  )}
                  {s.artifacts?.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {s.artifacts.filter((a: any) => !a.path.endsWith("progress.json")).map((a: any) => a.stored === false ? (
                        // hub: checkpoints (and files not uploaded) stay on the machine; copy their path there
                        <button key={a.path} title={`On ${r.machine_name ?? "the machine"}: ${a.local_path ?? a.path} (click to copy the path)`}
                          onClick={() => navigator.clipboard?.writeText(a.local_path ?? a.path).then(() => setToast("path copied")).catch(() => undefined)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line bg-raised/40 px-2 py-1 font-mono text-[11px] text-muted transition hover:border-accent/40 hover:text-fg">
                          <HardDrive className="h-3 w-3 text-subtle" />{a.path.split("/").slice(2).join("/")} <span className="text-subtle">{fmt.mb(a.size / 2 ** 20)}</span>
                        </button>
                      ) : (
                        <a key={a.path} href={api.fileUrl(r.id, a.path)} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2 py-1 font-mono text-[11px] text-muted shadow-soft transition hover:border-accent/40 hover:text-accent">
                          {a.path.split("/").slice(2).join("/")} <span className="text-subtle">{fmt.mb(a.size / 2 ** 20)}</span><ArrowUpRight className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </Card>

          <LogView runId={r.id} stage={stageForLogs} height="h-96" live={r.status === "running"}
            tabs={["runner", ...r.stages.map((s: any) => s.name)].map((s: string) => (
              <TermTab key={s} active={stageForLogs === s} onClick={() => setLogStage(s)}>{s}</TermTab>
            ))} />

          <Card title="Run info" actions={<Segmented small value={tab} onChange={setTab} options={[{ value: "recipe", label: "recipe" }, { value: "env", label: "env" }, { value: "data", label: "data" }]} />}>
            {tab === "recipe" ? <Yaml text={r.recipe_yaml || "# no recipe.yaml"} className="max-h-[420px]" />
              : <pre className="scroll-thin max-h-[420px] overflow-auto rounded-xl bg-code p-4 font-mono text-[11.5px] leading-relaxed text-zinc-300 ring-1 ring-black/5 dark:ring-white/[.07]">{JSON.stringify(tab === "env" ? r.env : r.datasets, null, 2)}</pre>}
          </Card>
        </div>

        <div className="min-w-0 space-y-5">
          <Card title="Details">
            <div className="-my-2 divide-y divide-line/70">
              <Detail label="Status"><StatusPill status={r.status} /></Detail>
              <Detail label="Run ID"><span className="font-mono text-xs">{r.id}</span></Detail>
              <Detail label="Recipe">{r.recipe_name}</Detail>
              <Detail label="Created">{relTime(r.created)}</Detail>
              <Detail label="Duration"><span className="font-mono text-xs">{r.started ? fmt.dur(r.started, r.finished) : "–"}</span></Detail>
              <Detail label="Dataset">{r.dataset}</Detail>
              <Detail label="Stages">{r.stages.length}</Detail>
              {r.best && <Detail label="Best mAP"><span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{fmt.pct(r.best.map)}</span></Detail>}
            </div>
            {r.results.length > 0 && (
              <Link to={`/compare?items=${r.results.map((x: any) => `${x.run_id}:${x.stage}`).slice(0, 4).join(",")}`}
                className="mt-4 flex items-center justify-center gap-1.5 rounded-[10px] bg-raised py-2 text-[13px] font-medium text-fg transition hover:bg-accent-soft hover:text-accent">
                <GitCompareArrows className="h-4 w-4" />Compare this run's results
              </Link>
            )}
          </Card>
          <Card title="Notes" description="What did you learn from this run?">
            <textarea className={cx(inputCls, "h-40 resize-y py-2.5 leading-relaxed")}
              value={notes ?? r.notes ?? ""} placeholder="e.g. bigger teacher helps small objects…" onChange={(e) => setNotes(e.target.value)} />
            <div className="mt-3 flex justify-end">
              <Button small variant="primary" disabled={notes === null} onClick={(e) => { const el = e.currentTarget; api.patch(r.id, { notes: notes ?? "" }).then(() => { sparkleBurst(el, 8); setNotes(null); refresh(); setToast("Notes saved"); }); }}>Save notes</Button>
            </div>
          </Card>
        </div>
      </div>
      {deleting && (
        <Modal onClose={() => setDeleting(false)}>
          <div className="space-y-4 p-5">
            <h2 className="text-[15px] font-semibold text-fg">Delete this run?</h2>
            <p className="text-[13px] text-muted">It disappears from the hub: results, logs and stored files.</p>
            <Switch checked={deleteFiles} onChange={setDeleteFiles} label={<>Also delete its files on {r.machine_name ?? "the machine"} (checkpoints)</>} />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setDeleting(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => { setDeleting(false); act(api.remove(r.id, deleteFiles), () => nav("/leaderboard")); }}><Trash2 />Delete</Button>
            </div>
          </div>
        </Modal>
      )}
      <Toast msg={toast} onClose={() => setToast(null)} />
    </div>
  );
}
