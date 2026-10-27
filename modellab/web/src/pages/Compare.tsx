import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, fmt, ResultRow } from "../api";
import { Card, cx, Empty } from "../ui";

const PALETTE = ["#8b5cf6", "#14b8a6", "#f59e0b", "#ec4899"];
type Metric = { key: keyof ResultRow; label: string; better: "high" | "low"; f: (v: any) => string };
const METRICS: Metric[] = [
  { key: "map", label: "mAP50:95", better: "high", f: (v) => fmt.pct(v) },
  { key: "map50", label: "mAP50", better: "high", f: (v) => fmt.pct(v) },
  { key: "ap_small", label: "AP small", better: "high", f: (v) => fmt.pct(v) },
  { key: "ap_medium", label: "AP medium", better: "high", f: (v) => fmt.pct(v) },
  { key: "ap_large", label: "AP large", better: "high", f: (v) => fmt.pct(v) },
  { key: "latency_ms", label: "latency (median)", better: "low", f: (v) => (v == null ? "–" : `${v.toFixed(2)} ms`) },
  { key: "latency_p95_ms", label: "latency (p95)", better: "low", f: (v) => (v == null ? "–" : `${v.toFixed(2)} ms`) },
  { key: "params_m", label: "params", better: "low", f: (v) => (v == null ? "–" : `${v.toFixed(1)} M`) },
  { key: "peak_vram_mb", label: "peak VRAM", better: "low", f: (v) => fmt.mb(v) },
];

function ClassBars({ rows }: { rows: ResultRow[] }) {
  const classes = [...new Set(rows.flatMap((r) => Object.keys(r.metrics?.per_class ?? {})))];
  if (!classes.length) return <div className="text-sm text-ink-400">no per-class AP</div>;
  const n = rows.length, bw = 14, gap = 22, groupW = n * bw + gap, H = 200, top = 10, bottom = 40, left = 34;
  const W = left + classes.length * groupW + 10;
  const max = Math.max(0.05, ...rows.flatMap((r) => Object.values((r.metrics?.per_class ?? {}) as Record<string, number | null>).map((v) => v ?? 0)));
  const sy = (v: number) => H - bottom - (v / max) * (H - top - bottom);
  return (
    <div className="scroll-thin overflow-x-auto">
      <svg width={Math.max(W, 300)} height={H}>
        {[0, 0.5, 1].map((t) => (
          <g key={t}>
            <line x1={left} x2={W} y1={sy(t * max)} y2={sy(t * max)} className="stroke-ink-100 dark:stroke-ink-800" />
            <text x={left - 6} y={sy(t * max) + 4} textAnchor="end" className="fill-ink-400 text-[10px]">{(t * max * 100).toFixed(0)}</text>
          </g>
        ))}
        {classes.map((c, ci) => (
          <g key={c} transform={`translate(${left + ci * groupW + gap / 2},0)`}>
            {rows.map((r, ri) => {
              const v = ((r.metrics?.per_class as Record<string, number | null> | undefined)?.[c]) ?? 0;
              return <rect key={ri} x={ri * bw} y={sy(v)} width={bw - 3} height={H - bottom - sy(v)} rx={3} fill={PALETTE[ri]}>
                <title>{`${r.label} · ${c}: ${(v * 100).toFixed(1)}`}</title></rect>;
            })}
            <text x={(n * bw) / 2} y={H - bottom + 16} textAnchor="middle" className="fill-ink-500 text-[11px]">{c}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function Compare() {
  const [params] = useSearchParams();
  const items = (params.get("items") ?? "").split(",").filter(Boolean);
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    if (items.length) api.compare(items).then(setData).catch((e) => setErr(String(e.message)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  if (!items.length) return <Card><Empty title="Pick 2–4 results to compare">Select rows on the <Link className="text-violet-600 underline" to="/leaderboard">Leaderboard</Link> and press Compare.</Empty></Card>;
  if (err) return <Card><div className="text-rose-600">{err}</div></Card>;
  if (!data) return <div className="py-20 text-center text-ink-400">loading…</div>;
  const rows: ResultRow[] = data.rows;
  const runIds: string[] = [...new Set(rows.map((r) => r.run_id))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">Compare</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">{rows.length} results side by side</p>
      </div>
      {data.warnings.length > 0 ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          <div className="mb-1 font-semibold">{data.comparable ? "Heads up" : "⚠ Not comparable"}</div>
          <ul className="list-disc pl-5">{data.warnings.map((w: string) => <li key={w}>{w}</li>)}</ul>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          ✓ Comparable: same eval code ({rows[0]?.eval_version}) and the same data ({rows[0]?.dataset}/{rows[0]?.split}, hash {rows[0]?.dataset_hash?.slice(0, 10)}).
        </div>
      )}

      <Card title="Metrics">
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left dark:border-ink-800">
                <th className="py-2 pr-4 text-xs font-medium text-ink-500" />
                {rows.map((r, i) => (
                  <th key={i} className="min-w-[170px] py-2 pr-4 align-top">
                    <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: PALETTE[i] }} />
                      <Link to={`/runs/${r.run_id}`} className="font-semibold text-ink-800 hover:text-violet-600 dark:text-ink-100">{r.label}</Link></div>
                    <div className="text-[11px] font-normal text-ink-400">{r.model} · {r.stage}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((m) => {
                const vals = rows.map((r) => r[m.key] as number | null);
                const valid = vals.filter((v): v is number => v !== null && v !== undefined);
                const best = valid.length ? (m.better === "high" ? Math.max(...valid) : Math.min(...valid)) : null;
                return (
                  <tr key={String(m.key)} className="border-b border-ink-50 dark:border-ink-800/60">
                    <td className="py-2 pr-4 text-xs text-ink-500">{m.label}</td>
                    {vals.map((v, i) => (
                      <td key={i} className={cx("py-2 pr-4 tabular-nums", v !== null && v === best && valid.length > 1 && "font-semibold text-emerald-600 dark:text-emerald-400")}>
                        {m.f(v)}{v !== null && v === best && valid.length > 1 && " ★"}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr><td className="py-2 pr-4 text-xs text-ink-500">latency setup</td>{rows.map((r, i) => <td key={i} className="py-2 pr-4 text-xs text-ink-500">{r.latency_device ?? "–"}</td>)}</tr>
              <tr><td className="py-2 pr-4 text-xs text-ink-500">eval / data</td>{rows.map((r, i) => <td key={i} className="py-2 pr-4 font-mono text-[11px] text-ink-500">{r.eval_version} · {r.dataset_hash?.slice(0, 10)}</td>)}</tr>
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Per-class AP (mAP50:95)">
        <ClassBars rows={rows} />
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-ink-500">{rows.map((r, i) => <span key={i}><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm" style={{ background: PALETTE[i] }} />{r.label}</span>)}</div>
      </Card>

      {Object.values(data.pca as Record<string, string[]>).some((l) => l.length) && (
        <Card title="Feature PCA">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {runIds.flatMap((rid) => (data.pca[rid] as string[]).map((p) => (
              <figure key={rid + p} className="rounded-xl bg-ink-50 p-2 dark:bg-ink-850">
                <img src={api.fileUrl(rid, p)} alt="PCA" className="w-full rounded-lg" />
                <figcaption className="mt-1 text-[11px] text-ink-500">{rows.find((r) => r.run_id === rid)?.run_name} · {p}</figcaption>
              </figure>
            )))}
          </div>
        </Card>
      )}

      <Card title={`Config differences (${data.config_diff.length})`}>
        {data.config_diff.length === 0 ? <div className="text-sm text-ink-400">{runIds.length === 1 ? "All results come from the same run." : "Identical configs."}</div> : (
          <div className="scroll-thin max-h-[480px] overflow-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-white dark:bg-ink-900"><tr className="text-left text-ink-500">
                <th className="py-1.5 pr-4 font-medium">key</th>{runIds.map((r) => <th key={r} className="py-1.5 pr-4 font-medium">{rows.find((x) => x.run_id === r)?.run_name}</th>)}
              </tr></thead>
              <tbody>
                {data.config_diff.map((d: any) => (
                  <tr key={d.key} className="border-t border-ink-50 dark:border-ink-800/60">
                    <td className="py-1.5 pr-4 font-mono text-ink-500">{d.key}</td>
                    {runIds.map((r) => <td key={r} className="py-1.5 pr-4 font-mono text-ink-800 dark:text-ink-200">{d.values[r] === null || d.values[r] === undefined ? "–" : JSON.stringify(d.values[r])}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
