import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Ban, Check, CheckCircle2, Clock, Cpu, Hourglass, Loader2, Play, RotateCcw, Square, Timer, X, XCircle } from "lucide-react";
import { api, fmt, RunSummary } from "../api";
import { Button, Card, cx, Empty, IconButton, LogView, Mascot, PageHeader, ProgressBar, Ring, StatusPill, TermTab, Toast, relTime, useCountUp, usePoll } from "../ui";

const STAGE_DOT: Record<string, string> = { distill: "bg-teal-400", finetune: "bg-sky-500", eval: "bg-orange-400", features: "bg-amber-400" };

/** Horizontal stepper: one node per stage with its status and duration. */
export function StageStepper({ run }: { run: RunSummary }) {
  return (
    <ol className="flex min-w-0 flex-wrap items-center gap-y-3">
      {run.stages.map((s, i) => {
        const done = s.status === "done", live = s.status === "running", bad = s.status === "failed", stop = ["cancelled", "interrupted"].includes(s.status);
        return (
          <li key={s.name} className="flex items-center">
            {i > 0 && <span className={cx("mx-2 h-px w-6 sm:w-10", done || live ? "bg-gradient-to-r from-emerald-500/60 to-sky-500/60" : "bg-line")} />}
            <span className="flex items-center gap-2">
              <span className={cx("flex h-6 w-6 items-center justify-center rounded-full ring-1 ring-inset [&_svg]:h-3.5 [&_svg]:w-3.5",
                done ? "bg-emerald-500 text-white ring-emerald-500" : live ? "bg-sky-500/10 text-sky-600 ring-sky-500/40 dark:text-sky-400" : bad ? "bg-rose-500 text-white ring-rose-500"
                  : stop ? "bg-amber-500/15 text-amber-600 ring-amber-500/40" : "bg-raised text-subtle ring-line")}>
                {done ? <Check strokeWidth={3} /> : live ? <Loader2 className="animate-spin" /> : bad ? <X strokeWidth={3} /> : stop ? <Square /> : <span className="text-[10px] font-semibold">{i + 1}</span>}
              </span>
              <span className="leading-tight">
                <span className={cx("block text-[13px] font-medium", live ? "text-fg" : done ? "text-fg" : "text-muted")}>{s.name}</span>
                <span className="block font-mono text-[10.5px] text-subtle">{s.started ? fmt.dur(s.started, s.finished) : s.type}</span>
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Gauge({ label, value, max, text, colors, warn }: { label: string; value: number; max: number; text: React.ReactNode; colors: [string, string]; warn?: number }) {
  const f = max ? value / max : 0;
  return (
    <div className="flex flex-col items-center gap-2">
      <Ring value={f} size={84} stroke={7} gradient={warn !== undefined && f > warn ? ["#f43f5e", "#fb7185"] : colors}>
        <span className="font-mono text-[15px] font-medium tabular-nums text-fg">{text}</span>
      </Ring>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}

function NowRunning({ run, onCancel }: { run: RunSummary; onCancel: () => void }) {
  const pct = useCountUp(run.progress * 100);
  const elapsed = run.started ? Date.now() / 1000 - run.started : 0;
  const eta = run.progress > 0.03 && elapsed ? (elapsed * (1 - run.progress)) / run.progress : null;
  const sp = run.stage_progress;
  const nav = useNavigate();
  return (
    <div className="relative isolate overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(32rem_10rem_at_10%_0%,rgb(45_212_191/.14),transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <div className="flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:p-6">
        <Ring value={run.progress} size={124} stroke={10}>
          <span className="font-mono text-[26px] font-medium leading-none tabular-nums text-fg">{Math.round(pct)}<span className="text-sm text-subtle">%</span></span>
          <span className="mt-1 text-2xs text-subtle">overall</span>
        </Ring>
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2"><StatusPill status="running" /><span className="font-mono text-2xs text-subtle">{run.id}</span></div>
              <Link to={`/runs/${run.id}`} className="mt-1.5 block truncate text-lg font-semibold tracking-tight text-fg hover:text-accent">{run.name}</Link>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                <span className="flex items-center gap-1.5"><Timer className="h-3.5 w-3.5 text-subtle" />{fmt.dur(run.started)} elapsed</span>
                {eta !== null && <span className="flex items-center gap-1.5"><Hourglass className="h-3.5 w-3.5 text-subtle" />~{fmt.dur(Date.now() / 1000 - eta)} left (est.)</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button small onClick={() => nav(`/runs/${run.id}`)}>Details <ArrowUpRight /></Button>
              <Button small variant="danger" disabled={!!run.cancel_requested} onClick={onCancel}>{run.cancel_requested ? <><Loader2 className="animate-spin" />Cancelling</> : <><Square />Cancel</>}</Button>
            </div>
          </div>
          <StageStepper run={run} />
          <div>
            <div className="mb-1.5 flex justify-between gap-3 text-xs">
              <span className="truncate text-muted"><span className="font-medium text-fg">{run.current_stage}</span> · {sp?.message ?? "starting…"}</span>
              <span className="font-mono tabular-nums text-subtle">{sp ? `${Math.round(sp.fraction * 100)}%` : ""}</span>
            </div>
            <ProgressBar value={sp?.fraction ?? 0} active />
          </div>
        </div>
      </div>
    </div>
  );
}

const FINISHED_ICON: Record<string, React.ReactNode> = {
  done: <CheckCircle2 className="h-[18px] w-[18px] text-emerald-500" />,
  failed: <XCircle className="h-[18px] w-[18px] text-rose-500" />,
  cancelled: <Ban className="h-[18px] w-[18px] text-subtle" />,
  interrupted: <Ban className="h-[18px] w-[18px] text-amber-500" />,
};

export default function Queue() {
  const q = usePoll(api.queue, 2000);
  const gpu = usePoll(api.gpu, 2000);
  const recent = usePoll(() => api.runs("done,failed,cancelled,interrupted"), 5000);
  const [toast, setToast] = useState<string | null>(null);
  const [logStage, setLogStage] = useState<string | null>(null);
  const [openErr, setOpenErr] = useState<string | null>(null);
  const running = q.data?.runs.find((r) => r.status === "running");
  const waiting = q.data?.runs.filter((r) => r.status === "queued") ?? [];
  const act = (p: Promise<{ result: string }>) => p.then((r) => { setToast(r.result); q.refresh(); recent.refresh(); }).catch((e) => setToast(String(e.message)));
  const stageForLogs = logStage ?? running?.current_stage ?? "runner";
  const alive = q.data?.worker.alive;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Run" title="Queue"
        description="One GPU, one job at a time. Runs keep going in the background if you close this tab or restart the app."
        actions={q.data && !alive && <Button variant="brand" onClick={() => api.startWorker().then(() => q.refresh())}><Play />Start worker</Button>} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-5">
          {running ? <NowRunning run={running} onCancel={() => act(api.cancel(running.id))} /> : (
            <Card><Empty title={alive ? "Nothing running" : "Worker is offline"} mood={alive ? "happy" : "sleepy"}>
              {alive ? <>The GPU is free. Queue something from <Link className="font-medium text-accent hover:underline" to="/">New experiment</Link>.</> : <>Start it with the button above or run <code className="rounded bg-raised px-1 font-mono text-xs">modellab worker</code>.</>}
            </Empty></Card>
          )}
          {running && (
            <LogView runId={running.id} stage={stageForLogs} height="h-[340px]" live
              tabs={["runner", ...running.stages.filter((s) => s.status !== "pending").map((s) => s.name)].map((s) => (
                <TermTab key={s} active={stageForLogs === s} onClick={() => setLogStage(s)}>{s}</TermTab>
              ))} />
          )}
        </div>

        <div className="min-w-0 space-y-5">
          <Card title="System" icon={<Cpu className="h-3.5 w-3.5" />}>
            <div className="flex items-center gap-3 rounded-xl bg-raised/60 p-3">
              <Mascot size={40} mood={!alive ? "sleepy" : running ? "busy" : "happy"} />
              <div className="min-w-0 text-[13px]">
                <div className="font-semibold text-fg">{!q.data ? "…" : alive ? (running ? "Cooking an experiment" : "Idle, ready for work") : "Offline"}</div>
                <div className="truncate text-xs text-subtle">{alive ? `worker pid ${q.data?.worker.pid} · ${waiting.length} waiting` : "start it here or run `modellab worker`"}</div>
              </div>
            </div>
            {!gpu.data ? <div className="mt-4 text-sm text-subtle">…</div> : !gpu.data.available ? (
              <div className="mt-4 text-[13px] text-muted">No NVIDIA GPU visible (NVML: {gpu.data.reason ?? "unavailable"}). Jobs run on CPU here.</div>
            ) : gpu.data.gpus.map((g) => (
              <div key={g.index} className="mt-4">
                <div className="mb-4 flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-medium text-fg">{g.name.replace("NVIDIA ", "")}</span>
                  {g.power_w ? <span className="font-mono tabular-nums text-subtle">{g.power_w.toFixed(0)} W</span> : null}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Gauge label="Utilization" value={g.util} max={100} text={<>{Math.round(g.util)}<span className="text-[10px] text-subtle">%</span></>} colors={["#5eead4", "#14b8a6"]} />
                  <Gauge label="VRAM" value={g.mem_used_mb} max={g.mem_total_mb} warn={0.92} text={<>{(g.mem_used_mb / 1024).toFixed(1)}<span className="text-[10px] text-subtle">G</span></>} colors={["#7dd3fc", "#0ea5e9"]} />
                  <Gauge label="Temp" value={g.temp_c} max={95} warn={0.85} text={<>{Math.round(g.temp_c)}<span className="text-[10px] text-subtle">°</span></>} colors={["#f59e0b", "#f97316"]} />
                </div>
              </div>
            ))}
          </Card>

          <Card title="Up next" icon={<Clock className="h-3.5 w-3.5" />} actions={<span className="font-mono text-xs text-subtle">{waiting.length}</span>} flush>
            {waiting.length === 0 ? <div className="px-5 pb-5 pt-2 text-[13px] text-subtle">The queue is empty.</div> : (
              <ul className="px-2 pb-2">
                {waiting.map((r, i) => (
                  <li key={r.id} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-raised/60">
                    <span className={cx("flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold",
                      i === 0 ? "bg-accent text-white" : "bg-raised text-muted ring-1 ring-inset ring-line")}>{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <Link to={`/runs/${r.id}`} className="block truncate text-[13px] font-medium text-fg hover:text-accent">{r.name}</Link>
                      <div className="mt-0.5 flex items-center gap-1">
                        {r.stages.map((s) => <span key={s.name} title={s.name} className={cx("h-1.5 w-3 rounded-full opacity-70", STAGE_DOT[s.type] ?? "bg-subtle")} />)}
                        <span className="ml-1 text-2xs text-subtle">queued {relTime(r.created)}</span>
                      </div>
                    </div>
                    <IconButton title="Remove from queue" className="opacity-0 group-hover:opacity-100" onClick={() => act(api.cancel(r.id))}><X /></IconButton>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <Card title="Recently finished" flush>
        <ul className="px-2 pb-2">
          {(recent.data ?? []).slice(0, 8).map((r) => (
            <li key={r.id} className="rounded-xl px-3 py-2.5 hover:bg-raised/40">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                {FINISHED_ICON[r.status] ?? <StatusPill status={r.status} />}
                <Link to={`/runs/${r.id}`} className="min-w-0 truncate text-[13.5px] font-medium text-fg hover:text-accent">{r.name}</Link>
                <span className="hidden font-mono text-2xs text-subtle sm:inline">{r.stages.map((s) => s.name).join(" → ")}</span>
                {r.best && <span className="rounded-md bg-emerald-500/10 px-1.5 py-px font-mono text-[11px] font-medium text-emerald-700 dark:text-emerald-300">mAP {fmt.pct(r.best.map)}</span>}
                <span className="ml-auto flex items-center gap-3 text-xs text-subtle">
                  <span className="hidden font-mono sm:inline">{fmt.dur(r.started, r.finished)}</span>
                  <span>{relTime(r.finished)}</span>
                  {r.status === "failed" && r.error_tail && <Button small variant="ghost" onClick={() => setOpenErr(openErr === r.id ? null : r.id)}>{openErr === r.id ? "Hide error" : "Show error"}</Button>}
                  {["failed", "interrupted", "cancelled"].includes(r.status) && <Button small onClick={() => act(api.requeue(r.id))}><RotateCcw />Re-queue</Button>}
                </span>
              </div>
              {r.status === "failed" && r.error_tail && openErr === r.id && (
                <pre className="scroll-thin mt-2 max-h-40 overflow-auto rounded-lg bg-rose-500/[.06] p-3 font-mono text-[11px] leading-relaxed text-rose-700 ring-1 ring-inset ring-rose-500/20 animate-fade dark:text-rose-300">{r.error_tail.split("\n").slice(-8).join("\n")}</pre>
              )}
              {r.status === "failed" && r.error_tail && openErr !== r.id && (
                <div className="mt-1 truncate pl-[30px] font-mono text-[11px] text-rose-600/80 dark:text-rose-300/70">{r.error_tail.trim().split("\n").slice(-1)[0]}</div>
              )}
            </li>
          ))}
        </ul>
        {recent.data?.length === 0 && <div className="px-5 pb-5 text-[13px] text-subtle">No finished runs yet.</div>}
      </Card>
      <Toast msg={toast} onClose={() => setToast(null)} />
    </div>
  );
}
