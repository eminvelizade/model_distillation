import { useState } from "react";
import { ResultRow } from "../api";

export interface Pt { key: string; x: number; y: number; label: string; family: string; comparable: boolean; row: ResultRow }

/** Pareto front for "lower x (latency) and higher y (mAP) is better". */
export function paretoFront(pts: Pt[]): Set<string> {
  const sorted = [...pts].sort((a, b) => a.x - b.x || b.y - a.y);
  const front = new Set<string>();
  let best = -Infinity;
  for (const p of sorted) if (p.y > best) { front.add(p.key); best = p.y; }
  return front;
}

const COLORS: Record<string, string> = { rfdetr: "#8b5cf6", ltdetr: "#14b8a6" };

export default function Scatter({ points, onPick, selected }: { points: Pt[]; onPick?: (p: Pt) => void; selected: Set<string> }) {
  const [hover, setHover] = useState<Pt | null>(null);
  const W = 640, H = 340, P = { l: 52, r: 18, t: 16, b: 42 };
  if (!points.length) return <div className="flex h-64 items-center justify-center text-sm text-ink-400">No results with a latency measurement yet.</div>;
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
  const x0 = 0, x1 = Math.max(...xs) * 1.12 || 1;
  const y0 = Math.max(0, Math.min(...ys) - 0.05), y1 = Math.min(1, Math.max(...ys) + 0.05) || 1;
  const sx = (x: number) => P.l + ((x - x0) / (x1 - x0)) * (W - P.l - P.r);
  const sy = (y: number) => H - P.b - ((y - y0) / (y1 - y0 || 1)) * (H - P.t - P.b);
  const comparable = points.filter((p) => p.comparable);
  const front = paretoFront(comparable);
  const fpts = comparable.filter((p) => front.has(p.key)).sort((a, b) => a.x - b.x);
  // staircase: from each front point go right at its mAP until the next point's latency, then up
  let path = "";
  fpts.forEach((p, i) => {
    path += i === 0 ? `M${sx(p.x)},${sy(p.y)}` : ` L${sx(p.x)},${sy(fpts[i - 1].y)} L${sx(p.x)},${sy(p.y)}`;
  });
  if (fpts.length) path += ` L${sx(x1)},${sy(fpts[fpts.length - 1].y)}`;
  const ticks = (a: number, b: number, n: number) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full select-none">
        {ticks(y0, y1, 5).map((t) => (
          <g key={`y${t}`}>
            <line x1={P.l} x2={W - P.r} y1={sy(t)} y2={sy(t)} className="stroke-ink-100 dark:stroke-ink-800" />
            <text x={P.l - 8} y={sy(t) + 4} textAnchor="end" className="fill-ink-400 text-[11px]">{(t * 100).toFixed(0)}</text>
          </g>
        ))}
        {ticks(x0, x1, 5).map((t) => (
          <text key={`x${t}`} x={sx(t)} y={H - P.b + 18} textAnchor="middle" className="fill-ink-400 text-[11px]">{t.toFixed(t < 10 ? 1 : 0)}</text>
        ))}
        <text x={(W + P.l) / 2} y={H - 6} textAnchor="middle" className="fill-ink-500 text-[11px]">latency, ms (median, bs 1) → lower is better</text>
        <text x={14} y={(H - P.b) / 2} textAnchor="middle" transform={`rotate(-90 14 ${(H - P.b) / 2})`} className="fill-ink-500 text-[11px]">mAP50:95 (%) ↑</text>
        {path && <path d={path} fill="none" stroke="#f472b6" strokeWidth={2} strokeDasharray="5 4" opacity={0.85} />}
        {points.map((p) => {
          const onFront = front.has(p.key);
          return (
            <g key={p.key} onMouseEnter={() => setHover(p)} onMouseLeave={() => setHover(null)} onClick={() => onPick?.(p)} className="cursor-pointer">
              {onFront && <circle cx={sx(p.x)} cy={sy(p.y)} r={11} fill="#f472b6" opacity={0.18} />}
              <circle cx={sx(p.x)} cy={sy(p.y)} r={selected.has(p.key) ? 7 : 5.5}
                fill={p.comparable ? COLORS[p.family] ?? "#64748b" : "transparent"} stroke={p.comparable ? "white" : COLORS[p.family] ?? "#64748b"}
                strokeWidth={p.comparable ? 1.5 : 2} strokeDasharray={p.comparable ? undefined : "2 2"} />
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex flex-wrap gap-4 text-[11px] text-ink-500">
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS.rfdetr }} />RF-DETR (DINOv2)</span>
        <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full" style={{ background: COLORS.ltdetr }} />LT-DETR (DINOv3)</span>
        <span><span className="mr-1 inline-block h-0.5 w-4 align-middle" style={{ background: "#f472b6" }} />Pareto front (comparable runs)</span>
        <span>◌ dashed = not comparable</span>
      </div>
      {hover && (
        <div className="pointer-events-none absolute left-2 top-2 rounded-xl bg-ink-900/95 px-3 py-2 text-xs text-white shadow-lg">
          <div className="font-semibold">{hover.label}</div>
          <div>mAP {(hover.y * 100).toFixed(1)} · {hover.x.toFixed(2)} ms · {hover.row.latency_device}</div>
          <div className="opacity-70">{hover.row.run_name}</div>
          {!hover.comparable && <div className="text-amber-300">not comparable with the reference</div>}
        </div>
      )}
    </div>
  );
}
