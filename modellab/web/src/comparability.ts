import { ResultRow } from "./api";

/**
 * Results are comparable when they were produced by the same eval code version on the same data
 * (dataset + split + content hash). The reference for a (dataset, split) group is the most common key among rows
 * that used the CURRENT eval code (falling back to the most common key overall).
 */
export function comparability(rows: ResultRow[], currentEval: string) {
  const ref = new Map<string, string>();
  const groups = new Map<string, ResultRow[]>();
  rows.forEach((r) => {
    const g = `${r.dataset}|${r.split}`;
    groups.set(g, [...(groups.get(g) ?? []), r]);
  });
  groups.forEach((rs, g) => {
    const pool = rs.some((r) => r.eval_version === currentEval) ? rs.filter((r) => r.eval_version === currentEval) : rs;
    const counts = new Map<string, number>();
    pool.forEach((r) => counts.set(r.eval_key, (counts.get(r.eval_key) ?? 0) + 1));
    ref.set(g, [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]);
  });
  const reason = (r: ResultRow): string | null => {
    const k = ref.get(`${r.dataset}|${r.split}`)!;
    if (r.eval_key === k) return null;
    const [ev, , , hash] = k.split("|");
    const why = [];
    if (r.eval_version !== ev) why.push(`eval code ${r.eval_version} ≠ ${ev}`);
    if (r.dataset_hash !== hash) why.push(`dataset content hash ${r.dataset_hash?.slice(0, 8)} ≠ ${hash?.slice(0, 8)}`);
    return why.join("; ") || "different eval key";
  };
  return { reason };
}
