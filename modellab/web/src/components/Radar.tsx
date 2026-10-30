import { ResultRow } from "../api";

/** Series colours for selected / compared results (also used by the Leaderboard selection). */
export const SERIES = ["#14b8a6", "#3b82f6", "#f59e0b", "#f43f5e"];

/** Score in (0, 1] relative to the best value among `ref` (1 = as good as the best). */
export function score(rows: ResultRow[], key: keyof ResultRow, better: "high" | "low", ref: ResultRow[] = rows) {
  const valid = ref.map((r) => r[key] as number | null).filter((v): v is number => v != null && v > 0);
  if (!valid.length) return rows.map(() => null);
  const best = better === "high" ? Math.max(...valid) : Math.min(...valid);
  return rows.map((r) => {
    const v = r[key] as number | null;
    return v == null || v <= 0 ? null : Math.min(1, better === "high" ? v / best : best / v);
  });
}

const AXES: { key: keyof ResultRow; label: string; better: "high" | "low" }[] = [
  { key: "map", label: "mAP", better: "high" },
  { key: "map50", label: "mAP50", better: "high" },
  { key: "ap_small", label: "AP S", better: "high" },
  { key: "ap_medium", label: "AP M", better: "high" },
  { key: "ap_large", label: "AP L", better: "high" },
  { key: "latency_ms", label: "Speed", better: "low" },
  { key: "params_m", label: "Compact", better: "low" },
];

/**
 * Radar of accuracy / speed / size. Each axis is scored against the best of `reference` (default: the plotted rows),
 * then stretched so the worst reference score sits at 25% radius — close contenders stay distinguishable.
 */
export default function Radar({ rows, colors = SERIES, reference }: { rows: ResultRow[]; colors?: string[]; reference?: ResultRow[] }) {
  const S = 340, c = S / 2, R = 108;
  const ref = reference?.length ? reference : rows;
  const axes = AXES.map((a) => ({ ...a, s: score(rows, a.key, a.better, ref), refS: score(ref, a.key, a.better, ref) }));
  const all = axes.flatMap((a) => a.refS).filter((v): v is number => v != null);
  const lo = Math.min(0.85, (all.length ? Math.min(...all) : 0.5) - 0.05);
  const radius = (v: number | null) => (v == null ? 0 : 0.25 + 0.75 * Math.max(0, (v - lo) / (1 - lo)));
  const n = axes.length;
  const pt = (i: number, f: number) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return [c + Math.cos(a) * R * f, c + Math.sin(a) * R * f] as const;
  };
  return (
    <svg viewBox={`0 0 ${S} ${S}`} className="mx-auto block w-full max-w-[340px]">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={axes.map((_, i) => pt(i, f).join(",")).join(" ")} fill="none" className="stroke-line" strokeDasharray={f < 1 ? "2 3" : undefined} />
      ))}
      {axes.map((a, i) => {
        const [x, y] = pt(i, 1), [lx, ly] = pt(i, 1.2);
        return (
          <g key={String(a.key)}>
            <line x1={c} y1={c} x2={x} y2={y} className="stroke-line" />
            <text x={lx} y={ly + 4} textAnchor={Math.abs(lx - c) < 4 ? "middle" : lx > c ? "start" : "end"} className="fill-muted text-[11px] font-medium">{a.label}</text>
          </g>
        );
      })}
      {rows.map((_, ri) => {
        const pts = axes.map((a, i) => pt(i, radius(a.s[ri])));
        return (
          <g key={ri} className="animate-fade">
            <polygon points={pts.map((p) => p.join(",")).join(" ")} fill={colors[ri % colors.length]} fillOpacity={0.14} stroke={colors[ri % colors.length]} strokeWidth={2} strokeLinejoin="round"
              style={{ transition: "all .4s cubic-bezier(.2,.7,.2,1)" }} />
            {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={3} fill={colors[ri % colors.length]} className="stroke-surface" strokeWidth={1.5} />)}
          </g>
        );
      })}
    </svg>
  );
}
