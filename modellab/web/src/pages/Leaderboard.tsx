import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUp, Cpu, Database, MousePointerClick, Gauge, GitCompareArrows, Layers, MessageSquareText, Pencil, Sparkles, Trophy, X, Zap } from "lucide-react";
import { api, fmt, ResultRow } from "../api";
import { comparability } from "../comparability";
import Scatter, { FAMILY, paretoFront, Pt, ScatterLegend } from "../components/Scatter";
import Radar, { SERIES } from "../components/Radar";
import { Button, Card, cx, Empty, inputCls, Medal, Modal, PageHeader, SearchInput, Segmented, Stat, Switch, Tag, Toast, relTime, useCountUp, usePoll } from "../ui";

type SortKey = "label" | "map" | "map50" | "ap_small" | "ap_medium" | "ap_large" | "latency_ms" | "params_m" | "peak_vram_mb" | "created";
const COLS: { key: SortKey; label: string; fmt: (r: ResultRow) => string; num?: boolean }[] = [
  { key: "map50", label: "mAP50", fmt: (r) => fmt.pct(r.map50), num: true },
  { key: "ap_small", label: "AP S", fmt: (r) => fmt.pct(r.ap_small), num: true },
  { key: "ap_medium", label: "AP M", fmt: (r) => fmt.pct(r.ap_medium), num: true },
  { key: "ap_large", label: "AP L", fmt: (r) => fmt.pct(r.ap_large), num: true },
  { key: "latency_ms", label: "Latency", fmt: (r) => (r.latency_ms == null ? "–" : `${r.latency_ms.toFixed(2)}`), num: true },
  { key: "params_m", label: "Params", fmt: (r) => (r.params_m == null ? "–" : `${r.params_m.toFixed(1)}M`), num: true },
  { key: "peak_vram_mb", label: "VRAM", fmt: (r) => fmt.mb(r.peak_vram_mb), num: true },
  { key: "created", label: "Added", fmt: (r) => relTime(r.created) },
];
const rk = (r: ResultRow) => `${r.run_id}:${r.stage}`;

function NotesEditor({ row, onDone }: { row: ResultRow; onDone: () => void }) {
  const [tags, setTags] = useState(row.tags.join(", "));
  const [notes, setNotes] = useState(row.notes ?? "");
  return (
    <Modal onClose={onDone}>
      <div className="p-5">
        <div className="text-[15px] font-semibold text-fg">Tags & notes</div>
        <div className="mb-4 text-xs text-subtle">{row.run_name}</div>
        <label className="mb-1.5 block text-xs font-medium text-muted">Tags (comma separated)</label>
        <input autoFocus className={inputCls} value={tags} onChange={(e) => setTags(e.target.value)} />
        <label className="mb-1.5 mt-4 block text-xs font-medium text-muted">Notes</label>
        <textarea className={cx(inputCls, "h-28 py-2")} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What did you learn?" />
      </div>
      <div className="flex justify-end gap-2 border-t border-line bg-raised/40 px-5 py-3">
        <Button variant="ghost" onClick={onDone}>Cancel</Button>
        <Button variant="primary" onClick={() => api.patch(row.run_id, { tags: tags.split(",").map((t) => t.trim()).filter(Boolean), notes }).then(onDone)}>Save</Button>
      </div>
    </Modal>
  );
}

function ChampionCard({ best, second, ds }: { best: ResultRow; second?: ResultRow; ds: string }) {
  const v = useCountUp((best.map ?? 0) * 100, 900);
  const delta = second?.map != null && best.map != null ? (best.map - second.map) * 100 : null;
  return (
    <div className="relative isolate min-w-0 overflow-hidden rounded-2xl bg-[#06161a] p-6 text-white shadow-lift ring-1 ring-white/10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_20rem_at_100%_0%,rgb(45_212_191/.32),transparent_60%),radial-gradient(30rem_16rem_at_0%_100%,rgb(56_189_248/.2),transparent_60%)]" />
      <div className="grid-bg absolute inset-0 -z-10" />
      {/* a little frost: twinkling sparkles */}
      {[["8%", "46%", 0], ["20%", "64%", 1.1], ["40%", "56%", 2.2], ["52%", "66%", 0.6], ["12%", "34%", 1.7], ["30%", "60%", 2.7]].map(([top, left, d]) => (
        <span key={`${top}${left}`} aria-hidden className="pointer-events-none absolute -z-10 animate-twinkle text-[10px] text-cyan-100" style={{ top: top as string, left: left as string, animationDelay: `${d}s` }}>✦</span>
      ))}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-semibold text-amber-300 ring-1 ring-inset ring-amber-300/25">
          <Trophy className="h-3.5 w-3.5" /> Current champion
        </span>
        <span className="flex items-center gap-1.5 text-xs text-white/50"><Database className="h-3.5 w-3.5" />{ds}</span>
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="min-w-0">
          <Link to={`/runs/${best.run_id}`} className="block truncate text-xl font-semibold tracking-tight hover:underline">{best.label}</Link>
          <div className="mt-1 flex items-center gap-2 text-[13px] text-white/55">
            <span className="h-2 w-2 rounded-full" style={{ background: FAMILY[best.family]?.color }} />{best.model} · {best.run_name}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[56px] font-medium leading-none tracking-tighter tabular-nums">
            {v.toFixed(1)}<span className="text-2xl text-white/40">%</span>
          </div>
          <div className="mt-1.5 flex items-center justify-end gap-2 text-xs">
            <span className="text-white/50">mAP50:95</span>
            {delta !== null && <span className="rounded-full bg-emerald-400/15 px-1.5 py-px font-mono font-medium text-emerald-300">+{delta.toFixed(1)} vs #2</span>}
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-xl bg-white/[.04] ring-1 ring-inset ring-white/[.08]">
        {[
          { l: "Latency", v: best.latency_ms != null ? `${best.latency_ms.toFixed(2)} ms` : "–", i: <Zap className="h-3.5 w-3.5" /> },
          { l: "Params", v: best.params_m != null ? `${best.params_m.toFixed(1)} M` : "–", i: <Layers className="h-3.5 w-3.5" /> },
          { l: "Peak VRAM", v: fmt.mb(best.peak_vram_mb), i: <Cpu className="h-3.5 w-3.5" /> },
        ].map((s) => (
          <div key={s.l} className="min-w-0 px-4 py-3">
            <div className="flex items-center gap-1.5 text-2xs text-white/45">{s.i}{s.l}</div>
            <div className="mt-0.5 truncate font-mono text-sm font-medium tabular-nums">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const res = usePoll(api.results, 10000);
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "map", desc: true });
  const [dataset, setDataset] = useState<string>("");
  const [q, setQ] = useState("");
  const [family, setFamily] = useState<"" | "rfdetr" | "ltdetr">("");
  const [onlyComparable, setOnlyComparable] = useState(false);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<ResultRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const nav = useNavigate();

  const rows = res.data?.rows ?? [];
  const datasets = useMemo(() => [...new Set(rows.map((r) => r.dataset))], [rows]);
  const ds = dataset || datasets[0] || "";
  const comp = useMemo(() => comparability(rows, res.data?.current_eval_version ?? ""), [rows, res.data]);

  // Rank = position by mAP among comparable results on this dataset (stable while filtering / re-sorting).
  const dsRows = useMemo(() => rows.filter((r) => r.dataset === ds), [rows, ds]);
  const ranked = useMemo(() => dsRows.filter((r) => !comp.reason(r) && r.map !== null).sort((a, b) => b.map! - a.map!), [dsRows, comp]);
  const rank = useMemo(() => new Map(ranked.map((r, i) => [rk(r), i + 1])), [ranked]);
  const maxMap = ranked[0]?.map ?? 1;

  const visible = useMemo(() => {
    const ql = q.toLowerCase();
    return dsRows.filter((r) => (!family || r.family === family)
      && (!onlyComparable || !comp.reason(r))
      && (!ql || [r.label, r.run_name, r.model, ...r.tags, r.notes].join(" ").toLowerCase().includes(ql)))
      .sort((a, b) => {
        const va = a[sort.key] as number | string | null, vb = b[sort.key] as number | string | null;
        if (va === null || va === undefined) return 1;
        if (vb === null || vb === undefined) return -1;
        const c = typeof va === "string" ? va.localeCompare(vb as string) : (va as number) - (vb as number);
        return sort.desc ? -c : c;
      });
  }, [dsRows, family, onlyComparable, q, sort, comp]);

  const points: Pt[] = visible.filter((r) => r.latency_ms !== null && r.map !== null)
    .map((r) => ({ key: rk(r), x: r.latency_ms!, y: r.map!, label: r.label, family: r.family, comparable: !comp.reason(r), row: r }));
  const front = paretoFront(points.filter((p) => p.comparable));
  const toggle = (k: string) => setSel((s) => {
    const n = new Set(s);
    if (n.has(k)) n.delete(k); else if (n.size < 4) n.add(k); else setToast("Compare up to 4 results at a time");
    return n;
  });
  const th = (key: SortKey, label: string, num?: boolean, className?: string) => (
    <th key={key} onClick={() => setSort((s) => ({ key, desc: s.key === key ? !s.desc : key !== "latency_ms" && key !== "label" }))}
      className={cx("group cursor-pointer select-none whitespace-nowrap px-3 py-2.5 font-medium transition hover:text-fg", num && "text-right", sort.key === key && "text-fg", className)}>
      <span className={cx("inline-flex items-center gap-1", num && "flex-row-reverse")}>
        {label}
        {sort.key === key ? (sort.desc ? <ArrowDown className="h-3 w-3 text-accent" /> : <ArrowUp className="h-3 w-3 text-accent" />) : <ArrowDown className="h-3 w-3 opacity-0 group-hover:opacity-30" />}
      </span>
    </th>
  );

  const fastest = [...ranked].filter((r) => r.latency_ms != null).sort((a, b) => a.latency_ms! - b.latency_ms!)[0];
  const bestM50 = [...ranked].filter((r) => r.map50 != null).sort((a, b) => b.map50! - a.map50!)[0];
  const selRows = [...sel].map((k) => rows.find((r) => rk(r) === k)).filter(Boolean) as ResultRow[];
  const seriesOf = (k: string) => { const i = [...sel].indexOf(k); return i < 0 ? undefined : SERIES[i % SERIES.length]; };
  // Radar: the selection, or the champion when nothing is selected; axes scored against the comparable leaderboard.
  const shapeRows = selRows.length ? selRows : ranked.slice(0, 1);

  return (
    <div className="space-y-6 pb-20">
      <PageHeader eyebrow="Analyze" title="Leaderboard"
        description="Every eval stage, ranked. Results are comparable when they share the same eval code and the same data hash."
        actions={<>
          {datasets.length > 1 && (
            <div className="relative">
              <Database className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
              <select className={cx(inputCls, "!w-auto pl-8 pr-8")} value={ds} onChange={(e) => setDataset(e.target.value)}>
                {datasets.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          )}
          <Button variant="brand" disabled={sel.size < 2} onClick={() => nav(`/compare?items=${[...sel].join(",")}`)}><GitCompareArrows />Compare{sel.size ? ` · ${sel.size}` : ""}</Button>
        </>} />

      {rows.length === 0 ? <Card><Empty title="No results yet">Results appear here when an eval stage finishes. Queue one from <Link className="font-medium text-accent hover:underline" to="/">New experiment</Link>.</Empty></Card> : <>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          {ranked[0] ? <ChampionCard best={ranked[0]} second={ranked[1]} ds={ds} /> : <Card><Empty title="No comparable results on this dataset" /></Card>}
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Results" icon={<Sparkles className="h-3.5 w-3.5" />} value={dsRows.length}
              sub={`${ranked.length} comparable · ${new Set(dsRows.map((r) => r.model)).size} models`} />
            <Stat label="Pareto front" icon={<Gauge className="h-3.5 w-3.5" />} value={front.size} sub="best accuracy-for-speed trade-offs" />
            <Stat label="Fastest" icon={<Zap className="h-3.5 w-3.5" />} value={fastest ? <>{fastest.latency_ms!.toFixed(2)}<span className="text-sm text-subtle"> ms</span></> : "–"} sub={fastest?.label} />
            <Stat label="Best mAP50" icon={<Trophy className="h-3.5 w-3.5" />} value={bestM50 ? <>{fmt.pct(bestM50.map50)}<span className="text-sm text-subtle">%</span></> : "–"} sub={bestM50?.label} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card title="Accuracy vs latency" description={`${points.length} results · up and to the left is better · click a point to select it`} actions={<ScatterLegend />}>
            <Scatter points={points} selected={sel} ringColor={seriesOf} onPick={(p) => toggle(p.key)} />
          </Card>
          <Card title="Model shape" description={selRows.length ? "Outer ring = best on this leaderboard" : "Showing the champion · select rows to overlay"}>
            {shapeRows.length ? <>
              <Radar rows={shapeRows} colors={selRows.length ? SERIES : [SERIES[0]]} reference={ranked.length ? ranked : dsRows} />
              <ul className="mt-3 space-y-1">
                {shapeRows.map((r, i) => (
                  <li key={rk(r)} className="group flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-raised/60">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: SERIES[i] }} />
                    <span className="min-w-0 flex-1 truncate font-medium text-fg">{r.label}</span>
                    <span className="font-mono tabular-nums text-muted">{fmt.pct(r.map)}</span>
                    {selRows.length > 0 && <button onClick={() => toggle(rk(r))} className="rounded p-0.5 text-subtle opacity-0 hover:text-fg group-hover:opacity-100" aria-label={`Deselect ${r.label}`}><X className="h-3 w-3" /></button>}
                  </li>
                ))}
              </ul>
              {!selRows.length && <div className="mt-2 flex items-center justify-center gap-1.5 text-2xs text-subtle"><MousePointerClick className="h-3 w-3" />click rows or points to compare up to 4</div>}
            </> : <div className="py-16 text-center text-sm text-subtle">No comparable results yet.</div>}
          </Card>
        </div>

        <Card flush>
          <div className="flex flex-wrap items-center gap-2 border-b border-line p-3">
            <SearchInput className="w-full sm:w-72" value={q} onChange={setQ} placeholder="Search label, run, tag, note…" />
            <Segmented small value={family} onChange={setFamily}
              options={[{ value: "", label: "All" }, { value: "rfdetr", label: "RF-DETR" }, { value: "ltdetr", label: "LT-DETR" }]} />
            <div className="px-1"><Switch checked={onlyComparable} onChange={setOnlyComparable} label="Comparable only" /></div>
            <span className="ml-auto pr-1 text-xs text-subtle">{visible.length} of {dsRows.length}</span>
          </div>
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-raised/40 text-left text-xs text-subtle">
                <tr className="border-b border-line">
                  <th className="w-10 pl-4" />
                  <th className="w-10 px-1 py-2.5 text-center font-medium">#</th>
                  {th("label", "Model", false, "min-w-[280px]")}
                  {th("map", "mAP", true, "min-w-[130px]")}
                  {COLS.map((c) => th(c.key, c.label, c.num))}
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => {
                  const why = comp.reason(r), k = rk(r), on = sel.has(k);
                  return (
                    <tr key={k} onClick={() => toggle(k)}
                      className={cx("group cursor-pointer border-b border-line/70 transition last:border-0", on ? "bg-accent/[.05]" : "hover:bg-raised/50")}>
                      <td className="relative pl-4">
                        {on && <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: seriesOf(k) }} />}
                        <input type="checkbox" className="h-4 w-4 cursor-pointer rounded accent-teal-600" checked={on} onChange={() => toggle(k)} onClick={(e) => e.stopPropagation()} />
                      </td>
                      <td className="px-1 text-center"><Medal rank={rank.get(k) ?? null} /></td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <Link to={`/runs/${r.run_id}`} onClick={(e) => e.stopPropagation()} className="font-medium text-fg hover:text-accent">{r.label}</Link>
                          {front.has(k) && <span className="rounded-md bg-accent/10 px-1.5 py-px text-[10.5px] font-semibold text-accent">pareto</span>}
                          {why && <span title={why} className="rounded-md bg-amber-500/10 px-1.5 py-px text-[10.5px] font-semibold text-amber-700 dark:text-amber-300">not comparable</span>}
                          {r.warning && <span title={r.warning} className="text-amber-500">⚠</span>}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11.5px] text-subtle">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: FAMILY[r.family]?.color }} />{r.model} · {r.run_name}
                          {r.tags.map((t) => <Tag key={t}>{t}</Tag>)}
                          <button onClick={(e) => { e.stopPropagation(); setEditing(r); }} title={r.notes ? `“${r.notes}” — edit tags & notes` : "Add tags / notes"}
                            className={cx("inline-flex items-center gap-1 rounded-md px-1 py-px transition hover:bg-raised hover:text-fg", !r.notes && "opacity-0 group-hover:opacity-100")}>
                            {r.notes ? <><MessageSquareText className="h-3 w-3" /><span className="max-w-[140px] truncate">{r.notes}</span></> : <><Pencil className="h-3 w-3" />note</>}
                          </button>
                        </div>
                      </td>
                      <td className="px-3">
                        <div className="flex items-center justify-end gap-2.5">
                          <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-raised sm:block">
                            <div className="h-full rounded-full bg-gradient-to-r from-teal-300 to-cyan-500" style={{ width: `${Math.max(4, ((r.map ?? 0) / maxMap) * 100)}%`, opacity: why ? 0.4 : 1 }} />
                          </div>
                          <span className="w-10 text-right font-mono font-semibold tabular-nums text-fg">{fmt.pct(r.map)}</span>
                        </div>
                      </td>
                      {COLS.map((c) => (
                        <td key={c.key} className={cx("whitespace-nowrap px-3 tabular-nums", c.num ? "text-right font-mono text-muted" : "text-subtle",
                          c.key === "latency_ms" && fastest && rk(fastest) === k && "!text-emerald-600 dark:!text-emerald-400")}>{c.fmt(r)}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {visible.length === 0 && <div className="py-12 text-center text-sm text-subtle">Nothing matches these filters.</div>}
          </div>
        </Card>
      </>}

      {sel.size > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4 lg:pl-[248px]">
          <div className="pointer-events-auto flex max-w-full items-center gap-3 rounded-2xl border border-white/10 bg-ink-900/95 py-2 pl-4 pr-2 text-white shadow-lift backdrop-blur animate-pop dark:bg-ink-800/95">
            <span className="whitespace-nowrap text-[13px] font-medium">{sel.size} selected</span>
            <div className="hidden min-w-0 items-center gap-1.5 overflow-hidden md:flex">
              {selRows.map((r) => (
                <span key={rk(r)} className="flex max-w-[160px] items-center gap-1.5 rounded-lg bg-white/10 px-2 py-1 text-xs">
                  <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: seriesOf(rk(r)) }} /><span className="truncate">{r.label}</span>
                </span>
              ))}
            </div>
            <button onClick={() => setSel(new Set())} className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Clear selection"><X className="h-4 w-4" /></button>
            <Button variant="brand" small disabled={sel.size < 2} onClick={() => nav(`/compare?items=${[...sel].join(",")}`)}>
              {sel.size < 2 ? "Pick one more" : <>Compare <ArrowRight /></>}
            </Button>
          </div>
        </div>
      )}
      {editing && <NotesEditor row={editing} onDone={() => { setEditing(null); res.refresh(); }} />}
      <Toast msg={toast} onClose={() => setToast(null)} />
    </div>
  );
}
