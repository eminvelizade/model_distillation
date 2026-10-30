import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Crown, Loader2 } from "lucide-react";
import { api, fmt, ResultRow } from "../api";
import { Button, Callout, Card, cx, Empty, PageHeader, useWidth } from "../ui";
import Radar, { score, SERIES as PALETTE } from "../components/Radar";

type Metric = { key: keyof ResultRow; label: string; better: "high" | "low"; f: (v: any) => string };
const METRICS: Metric[] = [
  { key: "map", label: "mAP50:95", better: "high", f: (v) => fmt.pct(v) },
  { key: "map50", label: "mAP50", better: "high", f: (v) => fmt.pct(v) },
  { key: "ap_small", label: "AP small", better: "high", f: (v) => fmt.pct(v) },
  { key: "ap_medium", label: "AP medium", better: "high", f: (v) => fmt.pct(v) },
  { key: "ap_large", label: "AP large", better: "high", f: (v) => fmt.pct(v) },
  { key: "latency_ms", label: "Latency (median)", better: "low", f: (v) => (v == null ? "–" : `${v.toFixed(2)} ms`) },
  { key: "latency_p95_ms", label: "Latency (p95)", better: "low", f: (v) => (v == null ? "–" : `${v.toFixed(2)} ms`) },
  { key: "params_m", label: "Params", better: "low", f: (v) => (v == null ? "–" : `${v.toFixed(1)} M`) },
  { key: "peak_vram_mb", label: "Peak VRAM", better: "low", f: (v) => fmt.mb(v) },
];

function ClassBars({ rows }: { rows: ResultRow[] }) {
  const [ref, W] = useWidth<HTMLDivElement>();
  const classes = [...new Set(rows.flatMap((r) => Object.keys(r.metrics?.per_class ?? {})))];
  if (!classes.length) return <div ref={ref} className="text-sm text-subtle">No per-class AP.</div>;
  const n = rows.length, H = 240, top = 12, bottom = 30, left = 34;
  const groupW = Math.max(n * 16 + 24, (W - left) / classes.length);
  const bw = Math.min(26, (groupW - 24) / n);
  const width = Math.max(W, left + classes.length * groupW);
  const max = Math.max(0.05, ...rows.flatMap((r) => Object.values((r.metrics?.per_class ?? {}) as Record<string, number | null>).map((v) => v ?? 0)));
  const ceil = Math.ceil(max * 10) / 10;
  const sy = (v: number) => H - bottom - (v / ceil) * (H - top - bottom);
  return (
    <div ref={ref} className="scroll-thin overflow-x-auto">
      {W > 0 && (
        <svg width={width} height={H} className="block">
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <g key={t}>
              <line x1={left} x2={width} y1={sy(t * ceil)} y2={sy(t * ceil)} className="stroke-line" strokeDasharray={t ? "2 4" : undefined} />
              <text x={left - 8} y={sy(t * ceil) + 3.5} textAnchor="end" className="fill-subtle font-mono text-[10.5px]">{(t * ceil * 100).toFixed(0)}</text>
            </g>
          ))}
          {classes.map((c, ci) => {
            const x0 = left + ci * groupW + (groupW - n * bw - (n - 1) * 3) / 2;
            return (
              <g key={c}>
                {rows.map((r, ri) => {
                  const v = ((r.metrics?.per_class as Record<string, number | null> | undefined)?.[c]) ?? 0;
                  return <rect key={ri} x={x0 + ri * (bw + 3)} y={sy(v)} width={bw} height={Math.max(0, H - bottom - sy(v))} rx={4} fill={PALETTE[ri]} className="transition-opacity hover:opacity-80">
                    <title>{`${r.label} · ${c}: ${(v * 100).toFixed(1)}`}</title></rect>;
                })}
                <text x={left + ci * groupW + groupW / 2} y={H - bottom + 18} textAnchor="middle" className="fill-muted text-[11.5px]">{c}</text>
              </g>
            );
          })}
        </svg>
      )}
    </div>
  );
}

function Legend({ rows }: { rows: ResultRow[] }) {
  return <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">{rows.map((r, i) => <span key={i} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: PALETTE[i] }} />{r.label}</span>)}</div>;
}

export default function Compare() {
  const [params] = useSearchParams();
  const items = (params.get("items") ?? "").split(",").filter(Boolean);
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const nav = useNavigate();
  useEffect(() => {
    if (items.length) api.compare(items).then(setData).catch((e) => setErr(String(e.message)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const header = (n?: number) => (
    <PageHeader eyebrow="Analyze" title="Compare" description={n ? `${n} results side by side. Best value per metric is highlighted.` : "Put 2–4 results head to head."}
      actions={<Button onClick={() => nav("/leaderboard")}><ArrowLeft />Leaderboard</Button>} />
  );
  if (!items.length) return <div className="space-y-6">{header()}<Card><Empty title="Pick 2–4 results to compare" mood="happy">Select rows on the <Link className="font-medium text-accent hover:underline" to="/leaderboard">Leaderboard</Link> and press Compare.</Empty></Card></div>;
  if (err) return <div className="space-y-6">{header()}<Callout tone="error" title="Couldn't load the comparison">{err}</Callout></div>;
  if (!data) return <div className="flex items-center justify-center gap-2 py-24 text-sm text-subtle"><Loader2 className="h-4 w-4 animate-spin" />loading…</div>;
  const rows: ResultRow[] = data.rows;
  const runIds: string[] = [...new Set(rows.map((r) => r.run_id))];
  const topMap = Math.max(...rows.map((r) => r.map ?? -1));

  return (
    <div className="space-y-6">
      {header(rows.length)}

      <div className={cx("grid grid-cols-1 gap-4 sm:grid-cols-2", rows.length >= 3 && "xl:grid-cols-3", rows.length === 4 && "2xl:grid-cols-4")}>
        {rows.map((r, i) => {
          const lead = r.map === topMap && rows.length > 1;
          return (
            <div key={i} className={cx("relative min-w-0 overflow-hidden rounded-2xl border bg-surface p-4 shadow-soft", lead ? "border-amber-400/50" : "border-line")}>
              <div className="absolute inset-x-0 top-0 h-1" style={{ background: PALETTE[i] }} />
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-[.12] blur-2xl" style={{ background: PALETTE[i] }} />
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link to={`/runs/${r.run_id}`} className="block truncate text-[14px] font-semibold text-fg hover:text-accent">{r.label}</Link>
                  <div className="truncate text-xs text-subtle">{r.model} · {r.run_name}</div>
                </div>
                {lead && <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-300"><Crown className="h-3 w-3" />Leader</span>}
              </div>
              <div className="mt-4 flex items-end justify-between gap-2">
                <div>
                  <div className="font-mono text-[34px] font-medium leading-none tracking-tight tabular-nums text-fg">{fmt.pct(r.map)}<span className="text-base text-subtle">%</span></div>
                  <div className="mt-1 text-2xs text-subtle">mAP50:95{!lead && r.map != null && <span className="ml-1.5 font-mono text-rose-500">−{((topMap - r.map) * 100).toFixed(1)}</span>}</div>
                </div>
                <div className="text-right font-mono text-xs tabular-nums text-muted">
                  <div>{r.latency_ms != null ? `${r.latency_ms.toFixed(2)} ms` : "–"}</div>
                  <div className="text-subtle">{r.params_m != null ? `${r.params_m.toFixed(1)} M params` : ""}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {data.warnings.length > 0 ? (
        <Callout tone="warn" title={data.comparable ? "Heads up" : "Not comparable"}>
          <ul className="list-disc pl-4">{data.warnings.map((w: string) => <li key={w}>{w}</li>)}</ul>
        </Callout>
      ) : (
        <Callout tone="success" title="Apples to apples">
          Same eval code (<span className="font-mono">{rows[0]?.eval_version}</span>) and the same data (<span className="font-mono">{rows[0]?.dataset}/{rows[0]?.split}</span>, hash <span className="font-mono">{rows[0]?.dataset_hash?.slice(0, 10)}</span>).
        </Callout>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Card title="Metrics" description="Bars are relative to the best of this set" flush>
          <div className="scroll-thin overflow-x-auto px-2 pb-2">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left">
                  <th className="px-3 py-2" />
                  {rows.map((r, i) => (
                    <th key={i} className="min-w-[150px] px-3 py-2 align-bottom">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-muted"><span className="h-2 w-2 shrink-0 rounded-full" style={{ background: PALETTE[i] }} /><span className="truncate">{r.label}</span></span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {METRICS.map((m) => {
                  const vals = rows.map((r) => r[m.key] as number | null);
                  const sc = score(rows, m.key, m.better);
                  const valid = vals.filter((v): v is number => v !== null && v !== undefined);
                  const best = valid.length ? (m.better === "high" ? Math.max(...valid) : Math.min(...valid)) : null;
                  return (
                    <tr key={String(m.key)} className="border-t border-line/70">
                      <td className="whitespace-nowrap px-3 py-2.5 text-xs text-muted">{m.label} <span className="text-subtle">{m.better === "high" ? "↑" : "↓"}</span></td>
                      {vals.map((v, i) => {
                        const win = v !== null && v === best && valid.length > 1;
                        return (
                          <td key={i} className="px-3 py-2.5">
                            <div className={cx("flex items-center gap-1.5 font-mono tabular-nums", win ? "font-semibold text-emerald-600 dark:text-emerald-400" : "text-fg")}>
                              {m.f(v)}{win && <Crown className="h-3 w-3" />}
                            </div>
                            <div className="mt-1 h-1 overflow-hidden rounded-full bg-raised">
                              <div className="h-full rounded-full" style={{ width: `${(sc[i] ?? 0) * 100}%`, background: PALETTE[i], opacity: win ? 1 : 0.55 }} />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                <tr className="border-t border-line/70"><td className="px-3 py-2.5 text-xs text-muted">Latency setup</td>{rows.map((r, i) => <td key={i} className="px-3 py-2.5 text-xs text-muted">{r.latency_device ?? "–"}</td>)}</tr>
                <tr className="border-t border-line/70"><td className="px-3 py-2.5 text-xs text-muted">Eval / data</td>{rows.map((r, i) => <td key={i} className="px-3 py-2.5 font-mono text-[11px] text-subtle">{r.eval_version} · {r.dataset_hash?.slice(0, 10)}</td>)}</tr>
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Shape" description="Outer ring = best of this set on that axis">
          <Radar rows={rows} />
          <div className="mt-2 flex justify-center"><Legend rows={rows} /></div>
        </Card>
      </div>

      <Card title="Per-class AP" description="mAP50:95 by class" actions={<Legend rows={rows} />}>
        <ClassBars rows={rows} />
      </Card>

      {Object.values(data.pca as Record<string, string[]>).some((l) => l.length) && (
        <Card title="Feature PCA">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {runIds.flatMap((rid) => (data.pca[rid] as string[]).map((p) => (
              <figure key={rid + p} className="overflow-hidden rounded-xl border border-line bg-raised/40">
                <img src={api.fileUrl(rid, p)} alt="PCA" className="w-full" />
                <figcaption className="px-3 py-2 text-[11.5px] text-muted">{rows.find((r) => r.run_id === rid)?.run_name} · <span className="font-mono">{p}</span></figcaption>
              </figure>
            )))}
          </div>
        </Card>
      )}

      <Card title="Config differences" description={`${data.config_diff.length} key${data.config_diff.length === 1 ? "" : "s"} differ`} flush>
        {data.config_diff.length === 0 ? <div className="px-5 pb-5 text-[13px] text-subtle">{runIds.length === 1 ? "All results come from the same run." : "Identical configs."}</div> : (
          <div className="scroll-thin max-h-[480px] overflow-auto px-2 pb-2">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-surface"><tr className="text-left text-muted">
                <th className="px-3 py-2 font-medium">Key</th>{runIds.map((r) => <th key={r} className="px-3 py-2 font-medium">{rows.find((x) => x.run_id === r)?.run_name}</th>)}
              </tr></thead>
              <tbody>
                {data.config_diff.map((d: any) => (
                  <tr key={d.key} className="border-t border-line/70">
                    <td className="px-3 py-2 font-mono text-muted">{d.key}</td>
                    {runIds.map((r) => (
                      <td key={r} className="px-3 py-2">
                        {d.values[r] === null || d.values[r] === undefined ? <span className="text-subtle">–</span>
                          : <span className="rounded-md bg-raised px-1.5 py-0.5 font-mono text-fg">{JSON.stringify(d.values[r])}</span>}
                      </td>
                    ))}
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
