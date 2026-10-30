import { useState } from "react";
import { ResultRow } from "../api";
import { useWidth } from "../ui";

export interface Pt { key: string; x: number; y: number; label: string; family: string; comparable: boolean; row: ResultRow }

/** Pareto front for "lower x (latency) and higher y (mAP) is better". */
export function paretoFront(pts: Pt[]): Set<string> {
  const sorted = [...pts].sort((a, b) => a.x - b.x || b.y - a.y);
  const front = new Set<string>();
  let best = -Infinity;
  for (const p of sorted) if (p.y > best) { front.add(p.key); best = p.y; }
  return front;
}

export const FAMILY: Record<string, { color: string; label: string }> = {
  rfdetr: { color: "#3b82f6", label: "RF-DETR · DINOv2" },
  ltdetr: { color: "#f59e0b", label: "LT-DETR · DINOv3" },
};
const famColor = (f: string) => FAMILY[f]?.color ?? "#64748b";

/** Round tick values whose range covers [a, b]. */
export function niceTicks(a: number, b: number, n = 5): number[] {
  const span = b - a || 1;
  const raw = span / n, mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= n) ?? 10 * mag;
  const out = [];
  for (let t = Math.floor(a / step) * step; t < b + step - 1e-9; t += step) out.push(+t.toFixed(10));
  return out;
}

export default function Scatter({ points, onPick, selected, ringColor }: { points: Pt[]; onPick?: (p: Pt) => void; selected: Set<string>; ringColor?: (key: string) => string | undefined }) {
  const [hover, setHover] = useState<Pt | null>(null);
  const [ripple, setRipple] = useState<{ key: string; n: number } | null>(null);
  const [ref, W] = useWidth<HTMLDivElement>();
  const H = W < 560 ? 280 : 360, P = { l: 40, r: 20, t: 30, b: 46 };
  if (!points.length) return <div ref={ref} className="flex h-64 items-center justify-center text-sm text-subtle">No results with a latency measurement yet.</div>;

  const xs = points.map((p) => p.x), ys = points.map((p) => p.y * 100);
  const xt = niceTicks(0, Math.max(...xs) * 1.04 || 1);
  const yt = niceTicks(Math.max(0, Math.min(...ys) - 2), Math.min(100, Math.max(...ys) + 2));
  const x0 = 0, x1 = xt[xt.length - 1], y0 = yt[0], y1 = yt[yt.length - 1];
  const sx = (x: number) => P.l + ((x - x0) / (x1 - x0)) * (W - P.l - P.r);
  const sy = (y: number) => H - P.b - ((y * 100 - y0) / (y1 - y0 || 1)) * (H - P.t - P.b);

  const comparable = points.filter((p) => p.comparable);
  const front = paretoFront(comparable);
  const fpts = comparable.filter((p) => front.has(p.key)).sort((a, b) => a.x - b.x);
  // staircase: from each front point go right at its mAP until the next point's latency, then up
  let line = "";
  fpts.forEach((p, i) => {
    line += i === 0 ? `M${sx(p.x)},${sy(p.y)}` : ` L${sx(p.x)},${sy(fpts[i - 1].y)} L${sx(p.x)},${sy(p.y)}`;
  });
  if (fpts.length) line += ` L${sx(x1)},${sy(fpts[fpts.length - 1].y)}`;
  const area = fpts.length ? `${line} L${sx(x1)},${H - P.b} L${sx(fpts[0].x)},${H - P.b} Z` : "";
  const short = (s: string) => (s.length > 26 ? `${s.slice(0, 25)}…` : s);

  // Front labels: try up-left, down-left, then up-right of the point; take the first spot that doesn't hit a placed label.
  const labels = new Map<string, { x: number; y: number; anchor: "start" | "end" }>();
  const boxes: { x0: number; x1: number; y0: number; y1: number }[] = [];
  [...fpts].sort((a, b) => b.x - a.x).forEach((p) => {
    const cx = sx(p.x), cy = sy(p.y), w = short(p.label).length * 6;
    const spots = [
      { x: cx - 12, y: cy - 8, anchor: "end" as const }, { x: cx - 12, y: cy + 17, anchor: "end" as const },
      { x: cx + 10, y: cy - 14, anchor: "start" as const },
    ].filter((c) => (c.anchor === "end" ? c.x - w > P.l : c.x + w < W - P.r));
    const box = (c: { x: number; y: number; anchor: string }) => ({ x0: c.anchor === "end" ? c.x - w : c.x, x1: c.anchor === "end" ? c.x : c.x + w, y0: c.y - 11, y1: c.y + 3 });
    const hit = (b: ReturnType<typeof box>) => boxes.some((o) => b.x0 < o.x1 && o.x0 < b.x1 && b.y0 < o.y1 && o.y0 < b.y1);
    const spot = spots.find((c) => !hit(box(c)));
    if (spot) { labels.set(p.key, spot); boxes.push(box(spot)); }
  });

  return (
    <div ref={ref} className="relative">
      {W > 0 && (
        <svg width={W} height={H} className="block select-none overflow-visible">
          <defs>
            <linearGradient id="pf-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38cde3" stopOpacity=".14" /><stop offset="1" stopColor="#95eedd" stopOpacity="0" /></linearGradient>
            <linearGradient id="pf-line" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#14b2cb" /><stop offset="1" stopColor="#95eedd" /></linearGradient>
          </defs>
          {yt.map((t) => (
            <g key={`y${t}`}>
              <line x1={P.l} x2={W - P.r} y1={sy(t / 100)} y2={sy(t / 100)} className="stroke-line" strokeDasharray={t === y0 ? undefined : "2 4"} />
              <text x={P.l - 10} y={sy(t / 100) + 3.5} textAnchor="end" className="fill-subtle font-mono text-[10.5px]">{t}</text>
            </g>
          ))}
          {xt.map((t) => (
            <text key={`x${t}`} x={sx(t)} y={H - P.b + 18} textAnchor="middle" className="fill-subtle font-mono text-[10.5px]">{t}</text>
          ))}
          <text x={0} y={12} className="fill-muted text-[11px] font-medium">↑ mAP50:95 (%)</text>
          <text x={W - P.r} y={H - 4} textAnchor="end" className="fill-muted text-[11px] font-medium">latency, ms (median · bs 1) →</text>

          {area && <path d={area} fill="url(#pf-area)" className="animate-fade" style={{ animationDuration: ".9s", animationDelay: ".7s" }} />}
          {line && <path d={line} fill="none" stroke="url(#pf-line)" strokeWidth={2} strokeLinejoin="round" pathLength={1} strokeDasharray={1} className="animate-draw" />}

          {hover && <>
            <line x1={sx(hover.x)} x2={sx(hover.x)} y1={sy(hover.y)} y2={H - P.b} className="stroke-subtle" strokeDasharray="3 3" />
            <line x1={P.l} x2={sx(hover.x)} y1={sy(hover.y)} y2={sy(hover.y)} className="stroke-subtle" strokeDasharray="3 3" />
          </>}

          {points.map((p, i) => {
            const onFront = front.has(p.key), sel = selected.has(p.key), hov = hover?.key === p.key;
            const cx = sx(p.x), cy = sy(p.y), c = famColor(p.family);
            const lab = labels.get(p.key);
            return (
              <g key={p.key} onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)} className="cursor-pointer"
                onClick={() => { setRipple({ key: p.key, n: Date.now() }); onPick?.(p); }}>
                <g className="svg-center animate-popin" style={{ animationDelay: `${250 + i * 45}ms` }}>
                  <circle cx={cx} cy={cy} r={16} fill="transparent" />
                  {onFront && <circle cx={cx} cy={cy} r={hov ? 14 : 12} fill={c} opacity={0.14} style={{ transition: "r .25s ease" }} />}
                  {sel && <circle cx={cx} cy={cy} r={10.5} fill="none" className={`svg-center animate-popin ${ringColor?.(p.key) ? "" : "stroke-accent"}`} stroke={ringColor?.(p.key)} strokeWidth={2.5} />}
                  <circle cx={cx} cy={cy} r={hov ? 7.5 : 6} fill={p.comparable ? c : "transparent"} stroke={p.comparable ? undefined : c}
                    className={p.comparable ? "stroke-surface" : undefined} strokeWidth={p.comparable ? 2 : 1.75} strokeDasharray={p.comparable ? undefined : "2.5 2"}
                    style={{ transition: "r .2s cubic-bezier(.34,1.56,.64,1)" }} />
                </g>
                {ripple?.key === p.key && <circle key={ripple.n} cx={cx} cy={cy} r={7} fill="none" stroke={ringColor?.(p.key) ?? c} strokeWidth={1.5} className="svg-center pointer-events-none animate-ripple" />}
                {lab && W > 560 && (
                  <text x={lab.x} y={lab.y} textAnchor={lab.anchor} className="pointer-events-none animate-fade fill-muted text-[11px] font-medium" style={{ animationDuration: ".6s", animationDelay: "1.1s" }}>{short(p.label)}</text>
                )}
              </g>
            );
          })}
        </svg>
      )}
      {hover && W > 0 && (
        <div className="pointer-events-none absolute z-10 w-max max-w-[260px] rounded-xl border border-line bg-surface/95 px-3 py-2.5 text-xs shadow-lift backdrop-blur animate-fade"
          style={{ left: Math.min(sx(hover.x) + 14, W - 250), top: Math.max(0, sy(hover.y) - 92) }}>
          <div className="flex items-center gap-2 font-semibold text-fg"><span className="h-2 w-2 rounded-full" style={{ background: famColor(hover.family) }} />{hover.label}</div>
          <div className="mt-1.5 grid grid-cols-2 gap-x-4 font-mono tabular-nums">
            <span className="text-subtle">mAP</span><span className="text-right text-fg">{(hover.y * 100).toFixed(1)}</span>
            <span className="text-subtle">latency</span><span className="text-right text-fg">{hover.x.toFixed(2)} ms</span>
          </div>
          <div className="mt-1.5 truncate text-2xs text-subtle">{hover.row.run_name} · {hover.row.latency_device}</div>
          {!hover.comparable && <div className="mt-1 text-2xs font-medium text-amber-600 dark:text-amber-400">not comparable with the reference</div>}
        </div>
      )}
    </div>
  );
}

export function ScatterLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted">
      {Object.entries(FAMILY).map(([k, f]) => (
        <span key={k} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full ring-2 ring-surface" style={{ background: f.color }} />{f.label}</span>
      ))}
      <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded-full bg-gradient-to-r from-ice-500 to-ice-glint" />Pareto front</span>
      <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border-[1.5px] border-dashed border-subtle" />not comparable</span>
    </div>
  );
}
