import { useState } from "react";
import { Check, Copy, Loader2, PackageOpen } from "lucide-react";
import { api, Command, fmt } from "../api";
import { Button, cx, relTime, StatusPill, usePoll } from "../ui";

const ACTIVE = ["pending", "sent", "running"];

/** Export a finished fine-tune stage on the machine that trained it (ONNX, TensorRT if installed, model card), and
 *  show the latest export. The files stay on that machine; this shows where they are. */
export default function ExportPanel({ runId, stage, machineName, className }: { runId: string; stage: string; machineName?: string | null; className?: string }) {
  const ex = usePoll(() => api.exports(runId), 4000, [runId]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const mine = (ex.data ?? []).filter((c) => c.args.stage === stage);
  const last: Command | undefined = mine[0];
  const busy = !!last && ACTIVE.includes(last.status);
  const card = last?.status === "done" ? last.result : null;
  const go = () => { setError(null); api.exportRun(runId, stage).then(() => ex.refresh()).catch((e) => setError(String(e.message))); };
  const copy = (t: string) => navigator.clipboard?.writeText(t).then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1200); }).catch(() => undefined);
  return (
    <div className={cx("rounded-xl border border-line bg-raised/30 p-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <PackageOpen className="h-4 w-4 text-subtle" />
        <span className="text-[13px] font-medium text-fg">Export for deployment</span>
        {last && <StatusPill status={busy ? (last.status === "running" ? "running" : "queued") : last.status} />}
        {last && !busy && <span className="text-2xs text-subtle">{relTime(last.finished ?? last.created)}</span>}
        <Button small className="ml-auto" onClick={go} disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <PackageOpen />}{last?.status === "done" ? "Export again" : "Export"}</Button>
      </div>
      {!last && <p className="mt-1.5 text-xs text-subtle">ONNX, a TensorRT FP16 engine when TensorRT is installed on {machineName ?? "the machine"}, a model card and an example script. The files stay on the machine.</p>}
      {busy && <p className="mt-1.5 text-xs text-sky-700 dark:text-sky-300">{last?.status === "running" ? "exporting on " : "waiting for "}{machineName ?? "the machine"}…</p>}
      {(error || (last?.status === "failed" && last.error)) && <p className="mt-1.5 whitespace-pre-wrap text-xs text-rose-600 dark:text-rose-300">{error ?? last?.error?.trim().split("\n").slice(-3).join("\n")}</p>}
      {card && (
        <div className="mt-2.5 space-y-2 text-xs animate-fade">
          <div className="flex flex-wrap gap-x-5 gap-y-1 font-mono tabular-nums text-muted">
            <span>{card.model} @ {card.input_size}</span>
            {card.trt_latency_ms != null
              ? <span className="text-emerald-700 dark:text-emerald-300">TensorRT FP16 {card.trt_latency_ms.toFixed(2)} ms <span className="text-subtle">p95 {card.trt_latency_p95_ms?.toFixed(2)}</span></span>
              : <span className="text-subtle">{card.tensorrt}</span>}
            {card.metrics?.map != null && <span>mAP {fmt.pct(card.metrics.map)} ({card.metrics.split})</span>}
          </div>
          <button onClick={() => copy(card.folder)} title="Copy the folder path"
            className="flex w-full items-center gap-2 rounded-lg bg-code px-2.5 py-1.5 text-left font-mono text-[11px] text-zinc-300 ring-1 ring-black/5 dark:ring-white/[.07]">
            <span className="min-w-0 flex-1 truncate">{machineName ? `${machineName}:` : ""}{card.folder}</span>
            {copied ? <Check className="h-3 w-3 shrink-0 text-emerald-400" /> : <Copy className="h-3 w-3 shrink-0 text-zinc-500" />}
          </button>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(card.files ?? {}).map(([n, f]: [string, any]) => (
              <span key={n} className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[10.5px] text-muted ring-1 ring-inset ring-line">{n} <span className="text-subtle">{fmt.mb(f.size / 2 ** 20)}</span></span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
