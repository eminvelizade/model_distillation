import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, fmt, ResultRow } from "../api";
import { comparability } from "../comparability";
import Scatter, { paretoFront, Pt } from "../components/Scatter";
import { Button, Card, cx, Empty, inputCls, Tag, Toast, usePoll } from "../ui";

type SortKey = "label" | "map" | "map50" | "ap_small" | "ap_medium" | "ap_large" | "latency_ms" | "params_m" | "peak_vram_mb" | "created";
const COLS: { key: SortKey; label: string; fmt: (r: ResultRow) => string; num?: boolean }[] = [
  { key: "map", label: "mAP", fmt: (r) => fmt.pct(r.map), num: true },
  { key: "map50", label: "mAP50", fmt: (r) => fmt.pct(r.map50), num: true },
  { key: "ap_small", label: "AP s", fmt: (r) => fmt.pct(r.ap_small), num: true },
  { key: "ap_medium", label: "AP m", fmt: (r) => fmt.pct(r.ap_medium), num: true },
  { key: "ap_large", label: "AP l", fmt: (r) => fmt.pct(r.ap_large), num: true },
  { key: "latency_ms", label: "lat ms", fmt: (r) => fmt.num(r.latency_ms), num: true },
  { key: "params_m", label: "params M", fmt: (r) => fmt.num(r.params_m, 1), num: true },
  { key: "peak_vram_mb", label: "VRAM", fmt: (r) => fmt.mb(r.peak_vram_mb), num: true },
  { key: "created", label: "date", fmt: (r) => fmt.time(r.created) },
];
const rk = (r: ResultRow) => `${r.run_id}:${r.stage}`;

function NotesEditor({ row, onDone }: { row: ResultRow; onDone: () => void }) {
  const [tags, setTags] = useState(row.tags.join(", "));
  const [notes, setNotes] = useState(row.notes ?? "");
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/40 p-4 backdrop-blur-sm" onClick={onDone}>
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-ink-900" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 text-sm font-semibold">Tags & notes · <span className="font-normal text-ink-500">{row.run_name}</span></div>
        <label className="mb-1 block text-xs text-ink-500">tags (comma separated)</label>
        <input className={inputCls} value={tags} onChange={(e) => setTags(e.target.value)} />
        <label className="mb-1 mt-3 block text-xs text-ink-500">notes</label>
        <textarea className={cx(inputCls, "h-28")} value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onDone}>Cancel</Button>
          <Button variant="primary" onClick={() => api.patch(row.run_id, { tags: tags.split(",").map((t) => t.trim()).filter(Boolean), notes }).then(onDone)}>Save</Button>
        </div>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const res = usePoll(api.results, 10000);
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "map", desc: true });
  const [dataset, setDataset] = useState<string>("");
  const [q, setQ] = useState("");
  const [family, setFamily] = useState("");
  const [onlyComparable, setOnlyComparable] = useState(false);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<ResultRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const nav = useNavigate();

  const rows = res.data?.rows ?? [];
  const datasets = useMemo(() => [...new Set(rows.map((r) => r.dataset))], [rows]);
  const ds = dataset || datasets[0] || "";
  const comp = useMemo(() => comparability(rows, res.data?.current_eval_version ?? ""), [rows, res.data]);

  const visible = useMemo(() => {
    const ql = q.toLowerCase();
    return rows.filter((r) => (!ds || r.dataset === ds) && (!family || r.family === family)
      && (!onlyComparable || !comp.reason(r))
      && (!ql || [r.label, r.run_name, r.model, ...r.tags, r.notes].join(" ").toLowerCase().includes(ql)))
      .sort((a, b) => {
        const va = a[sort.key] as number | string | null, vb = b[sort.key] as number | string | null;
        if (va === null || va === undefined) return 1;
        if (vb === null || vb === undefined) return -1;
        const c = typeof va === "string" ? va.localeCompare(vb as string) : (va as number) - (vb as number);
        return sort.desc ? -c : c;
      });
  }, [rows, ds, family, onlyComparable, q, sort, comp]);

  const points: Pt[] = visible.filter((r) => r.latency_ms !== null && r.map !== null)
    .map((r) => ({ key: rk(r), x: r.latency_ms!, y: r.map!, label: r.label, family: r.family, comparable: !comp.reason(r), row: r }));
  const front = paretoFront(points.filter((p) => p.comparable));
  const toggle = (k: string) => setSel((s) => {
    const n = new Set(s);
    if (n.has(k)) n.delete(k); else if (n.size < 4) n.add(k); else setToast("compare up to 4 results");
    return n;
  });
  const th = (key: SortKey, label: string, num?: boolean) => (
    <th key={key} onClick={() => setSort((s) => ({ key, desc: s.key === key ? !s.desc : true }))}
      className={cx("cursor-pointer whitespace-nowrap px-3 py-2 font-medium hover:text-violet-600", num && "text-right")}>
      {label}{sort.key === key && <span className="ml-0.5 text-violet-500">{sort.desc ? "↓" : "↑"}</span>}
    </th>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">Leaderboard</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">One row per eval stage. Same eval code + same data hash = comparable.</p>
        </div>
        <Button variant="primary" disabled={sel.size < 2} onClick={() => nav(`/compare?items=${[...sel].join(",")}`)}>⇆ Compare {sel.size ? `(${sel.size})` : ""}</Button>
      </div>

      {rows.length === 0 ? <Card><Empty title="No results yet">Results appear here when an eval stage finishes.</Empty></Card> : <>
        <Card title="Accuracy vs latency" actions={<span className="text-xs text-ink-400">{ds} · {points.length} points · {front.size} on the Pareto front</span>}>
          <Scatter points={points} selected={sel} onPick={(p) => toggle(p.key)} />
        </Card>

        <Card>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <select className={cx(inputCls, "!w-auto")} value={ds} onChange={(e) => setDataset(e.target.value)}>
              {datasets.map((d) => <option key={d}>{d}</option>)}
            </select>
            <select className={cx(inputCls, "!w-auto")} value={family} onChange={(e) => setFamily(e.target.value)}>
              <option value="">all families</option><option value="rfdetr">RF-DETR</option><option value="ltdetr">LT-DETR</option>
            </select>
            <input className={cx(inputCls, "!w-64")} placeholder="search label, run, tag, note…" value={q} onChange={(e) => setQ(e.target.value)} />
            <label className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
              <input type="checkbox" className="h-4 w-4 accent-violet-600" checked={onlyComparable} onChange={(e) => setOnlyComparable(e.target.checked)} /> only comparable
            </label>
          </div>
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-ink-500">
                <tr className="border-b border-ink-100 dark:border-ink-800">
                  <th className="w-8 px-2" />
                  {th("label", "result")}
                  {COLS.map((c) => th(c.key, c.label, c.num))}
                  <th className="px-3 py-2 font-medium">tags / notes</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r, i) => {
                  const why = comp.reason(r);
                  return (
                    <tr key={rk(r)} className={cx("border-b border-ink-50 hover:bg-violet-50/40 dark:border-ink-800/60 dark:hover:bg-violet-500/5", sel.has(rk(r)) && "bg-violet-50/70 dark:bg-violet-500/10")}>
                      <td className="px-2"><input type="checkbox" className="h-4 w-4 accent-violet-600" checked={sel.has(rk(r))} onChange={() => toggle(rk(r))} /></td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          {i < 3 && sort.key === "map" && sort.desc && !why && <span>{["🥇", "🥈", "🥉"][i]}</span>}
                          <Link to={`/runs/${r.run_id}`} className="font-medium text-ink-800 hover:text-violet-600 dark:text-ink-100">{r.label}</Link>
                          {front.has(rk(r)) && <span className="rounded-md bg-pink-100 px-1.5 text-[10px] font-semibold text-pink-700 dark:bg-pink-500/20 dark:text-pink-300">pareto</span>}
                          {why && <span title={why} className="rounded-md bg-amber-100 px-1.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">not comparable</span>}
                          {r.warning && <span title={r.warning} className="text-amber-500">⚠</span>}
                        </div>
                        <div className="text-[11px] text-ink-400">{r.model} · {r.run_name} · {r.stage}</div>
                      </td>
                      {COLS.map((c) => <td key={c.key} className={cx("whitespace-nowrap px-3 py-2 tabular-nums", c.num && "text-right", c.key === "map" && "font-semibold text-ink-900 dark:text-white")}>{c.fmt(r)}</td>)}
                      <td className="px-3 py-2">
                        <button onClick={() => setEditing(r)} className="flex flex-wrap items-center gap-1 text-left" title={r.notes || "add tags / notes"}>
                          {r.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                          {r.notes ? <span className="max-w-[160px] truncate text-xs text-ink-500">“{r.notes}”</span> : <span className="text-xs text-ink-300 hover:text-violet-500">✎</span>}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </>}
      {editing && <NotesEditor row={editing} onDone={() => { setEditing(null); res.refresh(); }} />}
      <Toast msg={toast} onClose={() => setToast(null)} />
    </div>
  );
}
