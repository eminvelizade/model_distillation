import { useState } from "react";
import { Link } from "react-router-dom";
import { api, fmt, RunSummary } from "../api";
import { Button, Card, cx, Empty, LogView, Mascot, ProgressBar, StatusPill, Toast, usePoll } from "../ui";

function Meter({ label, value, max, unit, warn }: { label: string; value: number; max: number; unit: string; warn?: number }) {
  const f = max ? value / max : 0;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-ink-500 dark:text-ink-400">
        <span>{label}</span><span className="font-medium text-ink-700 dark:text-ink-200">{unit === "MB" ? `${fmt.mb(value)} / ${fmt.mb(max)}` : `${Math.round(value)}${unit}`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
        <div className={cx("h-full rounded-full transition-all duration-700", warn !== undefined && f > warn ? "bg-rose-400" : "bg-gradient-to-r from-emerald-400 to-teal-400")}
          style={{ width: `${Math.min(100, f * 100)}%` }} />
      </div>
    </div>
  );
}

export function StageTimeline({ run }: { run: RunSummary }) {
  return (
    <ol className="flex flex-wrap items-center gap-1.5">
      {run.stages.map((s, i) => (
        <li key={s.name} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-ink-300 dark:text-ink-600">→</span>}
          <span className={cx("rounded-lg px-2 py-0.5 text-xs ring-1 ring-inset",
            s.status === "done" ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30"
              : s.status === "running" ? "bg-violet-50 text-violet-700 ring-violet-300 dark:bg-violet-500/15 dark:text-violet-200 dark:ring-violet-500/40"
              : s.status === "failed" ? "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30"
              : ["cancelled", "interrupted"].includes(s.status) ? "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30"
              : "bg-ink-50 text-ink-500 ring-ink-200 dark:bg-ink-800 dark:text-ink-400 dark:ring-ink-700")}>
            {s.status === "done" ? "✓ " : s.status === "running" ? "● " : s.status === "failed" ? "✕ " : ""}{s.name}
            {s.started && s.status !== "pending" && <span className="ml-1 opacity-60">{fmt.dur(s.started, s.finished)}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

export default function Queue() {
  const q = usePoll(api.queue, 2000);
  const gpu = usePoll(api.gpu, 2000);
  const recent = usePoll(() => api.runs("done,failed,cancelled,interrupted"), 5000);
  const [toast, setToast] = useState<string | null>(null);
  const [logStage, setLogStage] = useState<string | null>(null);
  const running = q.data?.runs.find((r) => r.status === "running");
  const waiting = q.data?.runs.filter((r) => r.status === "queued") ?? [];
  const act = (p: Promise<{ result: string }>) => p.then((r) => { setToast(r.result); q.refresh(); recent.refresh(); }).catch((e) => setToast(String(e.message)));
  const stageForLogs = logStage ?? running?.current_stage ?? "runner";

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">Queue</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">One GPU, one job at a time. Runs continue in the background if you close this tab or restart the app.</p>
        </div>
        {q.data && !q.data.worker.alive && <Button variant="primary" onClick={() => api.startWorker().then(() => q.refresh())}>Start worker</Button>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="Worker">
          <div className="flex items-center gap-3">
            <Mascot size={44} mood={!q.data?.worker.alive ? "sleepy" : running ? "busy" : "happy"} />
            <div className="text-sm">
              <div className="font-semibold text-ink-800 dark:text-ink-100">{!q.data ? "…" : q.data.worker.alive ? (running ? "Cooking an experiment" : "Idle, ready for work") : "Offline"}</div>
              <div className="text-xs text-ink-500">{q.data?.worker.alive ? `pid ${q.data.worker.pid} · ${waiting.length} waiting` : "start it here or run `modellab worker`"}</div>
            </div>
          </div>
        </Card>
        <Card title="GPU" className="md:col-span-2">
          {!gpu.data ? <div className="text-sm text-ink-400">…</div> : !gpu.data.available ? (
            <div className="text-sm text-ink-500">No NVIDIA GPU visible (NVML: {gpu.data.reason ?? "unavailable"}). Jobs run on CPU here.</div>
          ) : gpu.data.gpus.map((g) => (
            <div key={g.index} className="grid grid-cols-1 gap-3 sm:grid-cols-[180px_1fr_1fr_1fr] sm:items-center">
              <div className="text-sm font-semibold text-ink-700 dark:text-ink-200">{g.name}<div className="text-xs font-normal text-ink-400">{g.power_w ? `${g.power_w.toFixed(0)} W` : ""}</div></div>
              <Meter label="utilization" value={g.util} max={100} unit="%" />
              <Meter label="VRAM" value={g.mem_used_mb} max={g.mem_total_mb} unit="MB" warn={0.92} />
              <Meter label="temperature" value={g.temp_c} max={95} unit="°C" warn={0.85} />
            </div>
          ))}
        </Card>
      </div>

      <Card title="Running now" actions={running && <>
        <Link to={`/runs/${running.id}`} className="text-xs text-violet-600 hover:underline dark:text-violet-300">details →</Link>
        <Button small variant="danger" disabled={!!running.cancel_requested} onClick={() => act(api.cancel(running.id))}>{running.cancel_requested ? "cancelling…" : "Cancel"}</Button>
      </>}>
        {!running ? <Empty title="Nothing running">Queue something from <Link className="text-violet-600 underline" to="/">New experiment</Link>.</Empty> : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill status="running" />
              <span className="font-semibold text-ink-800 dark:text-ink-100">{running.name}</span>
              <span className="text-xs text-ink-400">{running.id} · started {fmt.time(running.started)} · {fmt.dur(running.started)}</span>
            </div>
            <StageTimeline run={running} />
            <div>
              <div className="mb-1 flex justify-between text-xs text-ink-500">
                <span>{running.current_stage}: {running.stage_progress?.message ?? "starting…"}</span>
                <span>{Math.round(running.progress * 100)}% overall</span>
              </div>
              <ProgressBar value={running.progress} />
            </div>
            <div>
              <div className="mb-2 flex flex-wrap gap-1">
                {["runner", ...running.stages.filter((s) => s.status !== "pending").map((s) => s.name)].map((s) => (
                  <button key={s} onClick={() => setLogStage(s)} className={cx("rounded-lg px-2 py-0.5 text-xs", stageForLogs === s ? "bg-ink-800 text-white dark:bg-white dark:text-ink-900" : "text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800")}>{s}</button>
                ))}
              </div>
              <LogView runId={running.id} stage={stageForLogs} />
            </div>
          </div>
        )}
      </Card>

      <Card title={`Waiting (${waiting.length})`}>
        {waiting.length === 0 ? <div className="text-sm text-ink-400">The queue is empty.</div> : (
          <ul className="divide-y divide-ink-100 dark:divide-ink-800">
            {waiting.map((r, i) => (
              <li key={r.id} className="flex items-center gap-3 py-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-100 text-xs font-semibold text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">{i + 1}</span>
                <Link to={`/runs/${r.id}`} className="font-medium text-ink-700 hover:text-violet-600 dark:text-ink-200">{r.name}</Link>
                <span className="hidden text-xs text-ink-400 sm:inline">{r.stages.map((s) => s.name).join(" → ")}</span>
                <span className="ml-auto text-xs text-ink-400">queued {fmt.time(r.created)}</span>
                <Button small variant="ghost" onClick={() => act(api.cancel(r.id))}>remove</Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Recently finished">
        {(recent.data ?? []).slice(0, 8).map((r) => (
          <div key={r.id} className="flex flex-col gap-1 border-b border-ink-100 py-2.5 last:border-0 dark:border-ink-800">
            <div className="flex items-center gap-3">
              <StatusPill status={r.status} />
              <Link to={`/runs/${r.id}`} className="font-medium text-ink-700 hover:text-violet-600 dark:text-ink-200">{r.name}</Link>
              {r.best && <span className="text-xs text-ink-500">best mAP {fmt.pct(r.best.map)}</span>}
              <span className="ml-auto text-xs text-ink-400">{fmt.time(r.finished)}</span>
              {["failed", "interrupted", "cancelled"].includes(r.status) && <Button small onClick={() => act(api.requeue(r.id))}>re-queue</Button>}
            </div>
            {r.status === "failed" && r.error_tail && (
              <pre className="max-h-24 overflow-auto rounded-lg bg-rose-50 p-2 font-mono text-[11px] text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{r.error_tail.split("\n").slice(-6).join("\n")}</pre>
            )}
          </div>
        ))}
        {recent.data?.length === 0 && <div className="text-sm text-ink-400">No finished runs yet.</div>}
      </Card>
      <Toast msg={toast} onClose={() => setToast(null)} />
    </div>
  );
}
