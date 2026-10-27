import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, fmt } from "../api";
import { Button, Card, cx, LogView, ProgressBar, StatusPill, Tag, Toast, usePoll } from "../ui";

function Kpi({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-ink-50 px-3 py-2.5 dark:bg-ink-850">
      <div className="text-[11px] text-ink-500">{label}</div>
      <div className="text-lg font-semibold tabular-nums text-ink-900 dark:text-white">{value}</div>
      {sub && <div className="text-[10.5px] text-ink-400">{sub}</div>}
    </div>
  );
}

function EvalResult({ m }: { m: any }) {
  const pc = Object.entries(m.per_class ?? {}) as [string, number | null][];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
        <Kpi label="mAP50:95" value={fmt.pct(m.map)} />
        <Kpi label="mAP50" value={fmt.pct(m.map50)} />
        <Kpi label="AP small" value={fmt.pct(m.ap_small)} />
        <Kpi label="AP medium" value={fmt.pct(m.ap_medium)} />
        <Kpi label="AP large" value={fmt.pct(m.ap_large)} />
        <Kpi label="latency" value={m.latency_ms != null ? `${m.latency_ms.toFixed(2)} ms` : "–"} sub={m.latency_p95_ms != null ? `p95 ${m.latency_p95_ms.toFixed(2)} ms` : undefined} />
        <Kpi label="params" value={m.params_m != null ? `${m.params_m.toFixed(1)} M` : "–"} />
        <Kpi label="peak VRAM" value={fmt.mb(m.peak_vram_mb)} />
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        {pc.map(([c, v]) => (
          <div key={c} className="flex min-w-[180px] items-center gap-2 text-xs">
            <span className="w-20 truncate text-ink-500">{c}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${(v ?? 0) * 100}%` }} /></div>
            <span className="w-10 text-right tabular-nums">{fmt.pct(v)}</span>
          </div>
        ))}
      </div>
      <div className="text-[11px] text-ink-400">
        {m.images} images · {m.latency_device ?? "latency not measured"} · eval {m.eval_version} · data {m.dataset}/{m.split} {m.dataset_hash?.slice(0, 10)} · weights: {m.weights_origin}
        {m.warning && <span className="ml-2 text-amber-600">⚠ {m.warning}</span>}
      </div>
    </div>
  );
}

function FeaturesResult({ m, runId, outputs }: { m: any; runId: string; outputs: any }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="space-y-3">
        <table className="w-full text-xs">
          <thead className="text-left text-ink-500"><tr><th className="py-1">backbone</th><th className="text-right">kNN acc</th><th className="text-right">linear acc</th></tr></thead>
          <tbody>{Object.entries(m.probes ?? {}).map(([k, v]: [string, any]) => (
            <tr key={k} className="border-t border-ink-100 dark:border-ink-800"><td className="py-1">{k}</td><td className="text-right tabular-nums">{fmt.pct(v.knn_acc)}</td><td className="text-right tabular-nums">{fmt.pct(v.linear_acc)}</td></tr>
          ))}</tbody>
        </table>
        <table className="w-full text-xs">
          <thead className="text-left text-ink-500"><tr><th className="py-1">linear CKA</th><th className="text-right">objects</th><th className="text-right">tokens</th></tr></thead>
          <tbody>{Object.entries(m.cka ?? {}).map(([k, v]: [string, any]) => (
            <tr key={k} className="border-t border-ink-100 dark:border-ink-800"><td className="py-1">{k}</td><td className="text-right tabular-nums">{fmt.num(v.objects, 3)}</td><td className="text-right tabular-nums">{fmt.num(v.tokens, 3)}</td></tr>
          ))}</tbody>
        </table>
        <div className="text-[11px] text-ink-400">{m.images} images · {m.objects} objects · size {m.size} · split {m.split}</div>
      </div>
      {outputs?.pca && <img src={api.fileUrl(runId, `stages/${m.__stage}/${outputs.pca}`)} alt="PCA" className="w-full rounded-xl bg-white" />}
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
  const nav = useNavigate();
  if (!r) return <div className="py-20 text-center text-ink-400">loading…</div>;
  const act = (p: Promise<{ result: string }>, then?: () => void) => p.then((x) => { setToast(x.result); refresh(); then?.(); }).catch((e) => setToast(String(e.message)));
  const stageForLogs = logStage ?? r.current_stage ?? r.stages.find((s: any) => s.status === "failed")?.name ?? "runner";
  const finished = ["done", "failed", "cancelled", "interrupted"].includes(r.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">{r.name}</h1>
            <StatusPill status={r.status} />
          </div>
          <div className="mt-1 text-xs text-ink-400">{r.id} · created {fmt.time(r.created)} · {r.started ? `ran ${fmt.dur(r.started, r.finished)}` : "not started"} · dataset {r.dataset}</div>
          <div className="mt-2 flex flex-wrap gap-1">{r.tags.map((t: string) => <Tag key={t}>{t}</Tag>)}</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => nav(`/?clone=${r.id}`)}>⎘ Clone & edit</Button>
          {(r.status === "running" || r.status === "queued") && <Button variant="danger" onClick={() => act(api.cancel(r.id))}>Cancel</Button>}
          {finished && <Button onClick={() => act(api.requeue(r.id))} title="finished stages are kept; resumes at the first unfinished one">↻ Re-queue</Button>}
          {finished && <Button variant="ghost" onClick={() => { if (window.confirm("Delete this run and its files?")) act(api.remove(r.id), () => nav("/leaderboard")); }}>Delete</Button>}
        </div>
      </div>

      {r.status === "running" && <ProgressBar value={r.progress} />}
      {r.error_tail && r.status !== "done" && (
        <pre className="max-h-48 overflow-auto rounded-2xl border border-rose-200 bg-rose-50 p-4 font-mono text-[11.5px] text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">{r.error_tail}</pre>
      )}

      <Card title="Stages">
        <ol className="relative space-y-4 border-l-2 border-ink-100 pl-6 dark:border-ink-800">
          {r.stages.map((s: any) => (
            <li key={s.name} className="relative">
              <span className={cx("absolute -left-[33px] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white dark:ring-ink-900",
                s.status === "done" ? "bg-emerald-500" : s.status === "running" ? "bg-violet-500 animate-pulse" : s.status === "failed" ? "bg-rose-500" : ["cancelled", "interrupted"].includes(s.status) ? "bg-amber-400" : "bg-ink-200 dark:bg-ink-700")} />
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-ink-800 dark:text-ink-100">{s.name}</span>
                <span className="rounded-md bg-ink-100 px-1.5 text-[11px] text-ink-500 dark:bg-ink-800">{s.type}</span>
                <StatusPill status={s.status} />
                {s.started && <span className="text-xs text-ink-400">{fmt.dur(s.started, s.finished)}</span>}
                {s.status === "running" && s.progress && <span className="text-xs text-violet-600 dark:text-violet-300">{Math.round(s.progress.fraction * 100)}% · {s.progress.message}</span>}
                <button onClick={() => setLogStage(s.name)} className="text-xs text-violet-600 hover:underline dark:text-violet-300">logs</button>
              </div>
              {s.result?.metrics && s.type === "eval" && <div className="mt-3"><EvalResult m={s.result.metrics} /></div>}
              {s.result?.metrics && s.type === "features" && <div className="mt-3"><FeaturesResult m={{ ...s.result.metrics, __stage: s.name }} runId={r.id} outputs={s.result.outputs} /></div>}
              {s.result && ["distill", "finetune"].includes(s.type) && (
                <div className="mt-1 text-xs text-ink-500">→ {Object.entries(s.result.outputs).map(([k, v]) => `${k}: ${v}`).join(" · ")} · {s.result.seconds}s</div>
              )}
              {s.artifacts?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.artifacts.filter((a: any) => !a.path.endsWith("progress.json")).map((a: any) => (
                    <a key={a.path} href={api.fileUrl(r.id, a.path)} target="_blank" rel="noreferrer"
                      className="rounded-lg bg-ink-50 px-2 py-0.5 font-mono text-[11px] text-ink-600 hover:text-violet-600 dark:bg-ink-850 dark:text-ink-300">
                      {a.path.split("/").slice(2).join("/")} <span className="text-ink-400">{fmt.mb(a.size / 2 ** 20)}</span>
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      </Card>

      <Card title="Logs" actions={
        <div className="flex flex-wrap gap-1">
          {["runner", ...r.stages.map((s: any) => s.name)].map((s: string) => (
            <button key={s} onClick={() => setLogStage(s)} className={cx("rounded-lg px-2 py-0.5 text-xs", stageForLogs === s ? "bg-ink-800 text-white dark:bg-white dark:text-ink-900" : "text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800")}>{s}</button>
          ))}
        </div>}>
        <LogView runId={r.id} stage={stageForLogs} height="h-96" />
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Card title="Run info" actions={
          <div className="flex rounded-lg bg-ink-100 p-0.5 text-xs dark:bg-ink-800">
            {(["recipe", "env", "data"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={cx("rounded-md px-2 py-0.5", tab === t ? "bg-white shadow-sm dark:bg-ink-700" : "text-ink-500")}>{t}</button>)}
          </div>}>
          <pre className="scroll-thin max-h-[420px] overflow-auto rounded-xl bg-ink-950 p-4 font-mono text-[11.5px] leading-relaxed text-ink-200 dark:bg-black/50">
            {tab === "recipe" ? r.recipe_yaml : JSON.stringify(tab === "env" ? r.env : r.datasets, null, 2)}
          </pre>
        </Card>
        <Card title="Notes">
          <textarea className="h-40 w-full rounded-xl bg-ink-50 p-3 text-sm outline-none ring-1 ring-inset ring-ink-200 focus:ring-2 focus:ring-violet-400 dark:bg-ink-850 dark:ring-ink-700"
            value={notes ?? r.notes ?? ""} placeholder="What did you learn from this run?" onChange={(e) => setNotes(e.target.value)} />
          <div className="mt-2 flex justify-end">
            <Button small variant="primary" disabled={notes === null} onClick={() => api.patch(r.id, { notes: notes ?? "" }).then(() => { setNotes(null); refresh(); setToast("saved"); })}>Save notes</Button>
          </div>
          {r.results.length > 0 && <Link to={`/compare?items=${r.results.map((x: any) => `${x.run_id}:${x.stage}`).slice(0, 4).join(",")}`} className="mt-4 block text-sm text-violet-600 hover:underline dark:text-violet-300">⇆ compare this run's results</Link>}
        </Card>
      </div>
      <Toast msg={toast} onClose={() => setToast(null)} />
    </div>
  );
}
