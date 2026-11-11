import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowUpRight, Award, Gauge, Loader2, Square, Trash2 } from "lucide-react";
import { api, fmt, SearchArch, SearchDetail as SD, SearchTrial } from "../api";
import { Button, Callout, Card, Empty, PageHeader, ProgressBar, StatusPill, Toast, useWidth, usePoll } from "../ui";
import { FAMILY, niceTicks } from "../components/Scatter";
import ExportPanel from "../components/Export";
import ExplainButton from "../components/yeti/ExplainButton";
import { useYetiPage } from "../components/yeti/YetiContext";

const gpuTime = (sec: number) => (sec >= 3600 ? `${(sec / 3600).toFixed(1)} h` : `${Math.round(sec / 60)} min`);
const fam = (model: string) => (model.startsWith("ltdetr") ? "ltdetr" : "rfdetr");
const runLink = (t: SearchTrial) => t.run_id && <Link to={`/runs/${t.run_id}`} className="inline-flex items-center text-subtle hover:text-accent" title="open the run"><ArrowUpRight className="h-3.5 w-3.5" /></Link>;

/** Each configuration at its speed (timed on the target GPU) and its best validation mAP so far; the budget as a line. */
function SpeedChart({ s }: { s: SD }) {
  const [ref, W] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<string | null>(null);
  const lat: Record<string, number> = Object.fromEntries(s.state.archs.filter((a) => a.latency_ms != null).map((a) => [a.key, a.latency_ms!]));
  const best: Record<string, number> = {};
  for (const t of [...s.state.rounds.flatMap((r) => r.trials), ...s.state.seed_trials]) {
    if (t.map_valid != null) best[t.config] = Math.max(best[t.config] ?? 0, t.map_valid);
  }
  const pts = s.state.configs.filter((c) => best[c.key] != null && lat[`${c.model}@${c.size}`] != null)
    .map((c) => ({ key: c.key, model: c.model, x: lat[`${c.model}@${c.size}`], y: best[c.key] * 100 }));
  const H = 260, P = { l: 40, r: 16, t: 16, b: 38 };
  if (!pts.length) return <div ref={ref} className="flex h-40 items-center justify-center text-sm text-subtle">Points appear as the first round finishes.</div>;
  const xt = niceTicks(0, Math.max(s.spec.speed_ms, ...pts.map((p) => p.x)) * 1.08);
  const ys = pts.map((p) => p.y);
  const yt = niceTicks(Math.max(0, Math.min(...ys) - 2), Math.min(100, Math.max(...ys) + 2));
  const sx = (x: number) => P.l + (x / xt[xt.length - 1]) * (W - P.l - P.r);
  const sy = (y: number) => H - P.b - ((y - yt[0]) / (yt[yt.length - 1] - yt[0] || 1)) * (H - P.t - P.b);
  const rec = s.recommendation?.config;
  const h = pts.find((p) => p.key === hover);
  return (
    <div ref={ref} className="relative">
      <svg width={W} height={H} className="overflow-visible">
        {yt.map((y) => <g key={y}><line x1={P.l} x2={W - P.r} y1={sy(y)} y2={sy(y)} className="stroke-line" />
          <text x={P.l - 6} y={sy(y) + 3} textAnchor="end" className="fill-subtle font-mono text-[10px]">{y}</text></g>)}
        {xt.map((x) => <text key={x} x={sx(x)} y={H - P.b + 14} textAnchor="middle" className="fill-subtle font-mono text-[10px]">{x}</text>)}
        <text x={(W + P.l) / 2} y={H - 4} textAnchor="middle" className="fill-subtle text-[10.5px]">latency on the target GPU (ms)</text>
        <text x={12} y={P.t + (H - P.t - P.b) / 2} transform={`rotate(-90 12 ${P.t + (H - P.t - P.b) / 2})`} textAnchor="middle" className="fill-subtle text-[10.5px]">best validation mAP50:95 (%)</text>
        <line x1={sx(s.spec.speed_ms)} x2={sx(s.spec.speed_ms)} y1={P.t} y2={H - P.b} className="stroke-amber-500" strokeDasharray="4 4" />
        <text x={sx(s.spec.speed_ms) + 4} y={P.t + 10} className="fill-amber-600 text-[10.5px] dark:fill-amber-400">budget {s.spec.speed_ms} ms</text>
        {pts.map((p) => (
          <g key={p.key} onMouseEnter={() => setHover(p.key)} onMouseLeave={() => setHover(null)} className="cursor-default">
            {p.key === rec && <circle cx={sx(p.x)} cy={sy(p.y)} r={11} className="fill-emerald-500/15 stroke-emerald-500" strokeWidth={1.5} />}
            <circle cx={sx(p.x)} cy={sy(p.y)} r={5.5} fill={FAMILY[fam(p.model)]?.color} className="stroke-surface animate-pop" strokeWidth={1.5} />
          </g>
        ))}
      </svg>
      {h && (
        <div className="pointer-events-none absolute z-10 rounded-lg bg-surface px-2.5 py-1.5 text-xs shadow-lift ring-1 ring-line" style={{ left: Math.min(sx(h.x) + 10, W - 220), top: Math.max(0, sy(h.y) - 44) }}>
          <div className="font-medium text-fg">{h.key}</div>
          <div className="font-mono text-muted">{h.x.toFixed(2)} ms · {h.y.toFixed(1)}% mAP (valid)</div>
        </div>
      )}
    </div>
  );
}

function ArchRow({ a, budget }: { a: SearchArch; budget: number }) {
  return (
    <tr>
      <td className="font-mono text-fg"><span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ background: FAMILY[fam(a.model)]?.color }} />{a.key}</td>
      <td className="text-right font-mono tabular-nums">{a.latency_ms != null ? a.latency_ms.toFixed(2) : "–"}</td>
      <td className="text-right font-mono tabular-nums text-subtle">{a.latency_p95_ms != null ? a.latency_p95_ms.toFixed(2) : ""}</td>
      <td className="text-right font-mono tabular-nums">{a.params_m != null ? a.params_m.toFixed(1) : "–"}</td>
      <td className="text-right">{a.error ? <span className="text-rose-600 dark:text-rose-300" title={a.error}>error</span>
        : a.fits == null ? <span className="text-subtle">…</span>
        : a.fits ? <span className="text-emerald-700 dark:text-emerald-300">fits</span>
        : <span className="text-muted">{(a.latency_ms! / budget).toFixed(1)}× too slow</span>}</td>
    </tr>
  );
}

function TrialTable({ trials, final, names }: { trials: SearchTrial[]; final: boolean; names: Record<string, string> }) {
  const sorted = [...trials].sort((a, b) => (b.map_valid ?? -1) - (a.map_valid ?? -1));
  return (
    <div className="scroll-thin -mx-1 overflow-x-auto px-1"><table className="w-full min-w-[30rem] text-xs [&_td]:py-1.5 [&_th]:py-1.5 [&_th]:font-medium [&_tr]:border-t [&_tr]:border-line/70 [&_thead_tr]:border-0">
      <thead className="text-left text-muted"><tr><th>Configuration</th><th className="hidden sm:table-cell">Machine</th><th>Status</th>
        <th className="text-right">mAP valid</th>{final && <th className="text-right">mAP test</th>}<th className="w-6" /></tr></thead>
      <tbody>{sorted.map((t, i) => (
        <tr key={`${t.config}-${t.seed}-${i}`}>
          <td className="max-w-[16rem] truncate text-fg" title={t.error ?? t.config}>{t.config}{t.seed !== undefined && final ? <span className="ml-1.5 text-subtle">seed {t.seed}</span> : null}</td>
          <td className="hidden truncate text-muted sm:table-cell">{t.machine_id ? names[t.machine_id] ?? "" : ""}</td>
          <td><StatusPill status={t.status === "deleted" ? "failed" : t.status} /></td>
          <td className="text-right font-mono tabular-nums">{fmt.pct(t.map_valid)}</td>
          {final && <td className="text-right font-mono tabular-nums">{fmt.pct(t.map_test)}</td>}
          <td className="text-right">{runLink(t)}</td>
        </tr>
      ))}</tbody>
    </table></div>
  );
}

export default function SearchDetail() {
  const { id = "" } = useParams();
  const { data: s, error, refresh } = usePoll(() => api.search(id), 4000, [id]);
  const [toast, setToast] = useState<string | null>(null);
  const nav = useNavigate();
  useYetiPage({ kind: "search", id, label: s?.name },
    s?.status === "done" && s.recommendation
      ? { text: "I can explain why this model won, and how close the runner-up came.", ask: "Why did this search recommend its model? Walk me through the evidence.", focus: "recommendation", about: "the recommendation" }
      : s?.status === "failed" ? { text: "This search stopped. Want me to look at why?", ask: "Why did this search stop, and what should I change?", focus: "failure", about: "why it stopped" }
      : null);
  if (error && !s) return <Card><Empty title="Search not found" mood="sad">{error} · <Link className="text-accent" to="/search">all searches</Link></Empty></Card>;
  if (!s) return <div className="flex items-center justify-center gap-2 py-24 text-sm text-subtle"><Loader2 className="h-4 w-4 animate-spin" />loading…</div>;
  const names = s.spec.machine_names ?? {};
  const rec = s.recommendation;
  const done = s.trials.total ? s.trials.done / s.trials.total : 0;
  const rounds = s.state.rounds;
  const recMachine = rec && [...rounds.flatMap((r) => r.trials), ...s.state.seed_trials].find((t) => t.run_id === rec.best_run_id)?.machine_id;
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<span className="flex items-center gap-1.5"><Link to="/search" className="hover:underline">Find my best model</Link></span>}
        title={<span className="flex flex-wrap items-center gap-3">{s.name}<StatusPill status={s.status} /></span>}
        actions={s.status === "running"
          ? <Button variant="danger" yeti="search.cancel" onClick={() => api.cancelSearch(s.id).then(() => { setToast("cancelled: its queued runs too"); refresh(); }).catch((e) => setToast(e.message))}><Square />Cancel search</Button>
          : <Button variant="ghost" yeti="search.delete" onClick={() => window.confirm("Delete this search? Its runs and results stay.") && api.deleteSearch(s.id).then(() => nav("/search")).catch((e) => setToast(e.message))}><Trash2 />Delete</Button>}>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
          <span className="flex items-center gap-1.5"><Gauge className="h-3.5 w-3.5 text-subtle" />under {s.spec.speed_ms} ms on {names[s.spec.target_machine]}</span>
          <span>dataset {s.spec.dataset}</span>
          <span>{s.trials.done}/{s.trials.total} runs · {gpuTime(s.spent_s)} GPU time{s.spec.gpu_hours ? ` of ${s.spec.gpu_hours} h` : ""}</span>
        </div>
      </PageHeader>

      {s.status === "running" && <div className="space-y-1.5"><ProgressBar value={s.phase === "speed" ? 0.03 : done} active /><div className="text-xs text-sky-700 dark:text-sky-300">{s.message}</div></div>}
      {s.status === "failed" && <Callout tone="error" title="Search stopped">{s.message}</Callout>}
      {s.status === "done" && !rec && <Callout tone="warn" title="Nothing to recommend">{s.message}</Callout>}

      {rec && (
        <Card title={<span className="flex items-center gap-2"><Award className="h-4 w-4 text-emerald-500" />Recommended model</span>}
          actions={<ExplainButton label="Why this model?" focus="recommendation" about="the recommendation"
            ask="Why did this search recommend this model? Walk me through the evidence: speed, rounds, seeds and the runner-up." />}
          description={rec.early ? "The search stopped early (GPU-hour cap): this is the best of its last finished round, scored on the validation split only." : "Best mean validation mAP over its full-budget runs; the test mAP is reported, never used to choose."}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold text-fg">{rec.config}</div>
              <div className="mt-0.5 text-xs text-muted">{rec.runs} run{rec.runs > 1 ? "s" : ""} · {rec.params_m?.toFixed(1)} M params</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-emerald-500/10 px-3 py-2 ring-1 ring-inset ring-emerald-500/25">
                <div className="text-2xs font-medium text-muted">mAP50:95 test</div>
                <div className="font-mono text-xl font-medium tabular-nums text-fg">{fmt.pct(rec.map_test_mean)}{rec.map_test_std != null && <span className="text-xs text-subtle"> ±{fmt.pct(rec.map_test_std)}</span>}</div>
              </div>
              <div className="rounded-xl bg-raised/60 px-3 py-2"><div className="text-2xs font-medium text-muted">mAP valid</div><div className="font-mono text-[15px] tabular-nums text-fg">{fmt.pct(rec.map_valid_mean)}</div></div>
              <div className="rounded-xl bg-raised/60 px-3 py-2"><div className="text-2xs font-medium text-muted">Latency</div><div className="font-mono text-[15px] tabular-nums text-fg">{fmt.num(rec.latency_ms)} ms</div></div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button small onClick={() => nav(`/runs/${rec.best_run_id}`)}><ArrowUpRight />Open its best run</Button>
          </div>
          <ExportPanel className="mt-3" runId={rec.best_run_id} stage={rec.stage} machineName={recMachine ? names[recMachine] : null} />
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Card title="Speed vs accuracy" description="Each configuration: latency timed on the target GPU, best validation mAP so far">
          <SpeedChart s={s} />
        </Card>
        <Card title="Candidates" description={`Timed on ${names[s.spec.target_machine]} before training (median ms, batch 1)`}
          actions={<ExplainButton focus="speed" about="the candidates" ask="Walk me through the timing: which candidates were dropped for the speed budget, by how much, and what does that mean for my choice?" />}>
          <table className="w-full text-xs [&_td]:py-1.5 [&_th]:py-1.5 [&_th]:font-medium [&_tr]:border-t [&_tr]:border-line/70 [&_thead_tr]:border-0">
            <thead className="text-left text-muted"><tr><th>Model @ size</th><th className="text-right">ms</th><th className="text-right">p95</th><th className="text-right">M params</th><th className="text-right" /></tr></thead>
            <tbody>{s.state.archs.map((a) => <ArchRow key={a.key} a={a} budget={s.spec.speed_ms} />)}</tbody>
          </table>
          <Link to={`/runs/${s.state.speed_run}`} className="mt-3 inline-flex items-center gap-1 text-xs text-subtle hover:text-accent">timing run<ArrowUpRight className="h-3 w-3" /></Link>
        </Card>
      </div>

      {[...rounds].reverse().map((r, i) => (
        <Card key={r.index} title={`Round ${r.index + 1} of ${s.spec.rungs}`}
          actions={i === 0 && rounds.length > 0 ? <ExplainButton label="How did the rounds go?" focus="rounds" about="the rounds"
            ask="How did the rounds play out? Which configurations moved on, which were dropped and by how much, and did any bigger input size or model stop paying off?" /> : undefined}
          description={`${r.trials.length} configuration${r.trials.length > 1 ? "s" : ""} · ${r.epochs} epoch${r.epochs > 1 ? "s" : ""}${r.final ? " (full budget) · also evaluated on the test split" : ""}`}>
          <TrialTable trials={r.trials} final={r.final} names={names} />
        </Card>
      ))}
      {s.state.seed_trials.length > 0 && (
        <Card title="Seed repeats" description="The best configurations again with other seeds: how much of the difference is luck"
          actions={<ExplainButton label="Is it luck?" focus="seeds" about="the seed repeats" ask="Is the winner clearly better than the runner-up, or is the gap within the noise between seeds?" />}>
          <TrialTable trials={s.state.seed_trials} final names={names} />
        </Card>
      )}
      <Toast msg={toast} onClose={() => setToast(null)} />
    </div>
  );
}
