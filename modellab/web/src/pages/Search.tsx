import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, Gauge, Loader2, Sparkles, Wand2 } from "lucide-react";
import { api, Catalog, DatasetInfo, fmt, MachineDetail, SearchPreview, SearchSpec } from "../api";
import { useSession } from "../session";
import { Button, Callout, Card, cx, Empty, Field, inputCls, PageHeader, relTime, Segmented, StatusPill, usePoll } from "../ui";
import { FAMILY } from "../components/Scatter";
import { useYetiPage } from "../components/yeti/YetiContext";
import { readFill } from "../agent";

/** "1e-4, 2e-4" or "320 384" -> numbers; null if something isn't a number. */
const numbers = (s: string): number[] | null => {
  const parts = s.split(/[\s,]+/).filter(Boolean);
  const out = parts.map(Number);
  return out.some((n) => !Number.isFinite(n)) ? null : out;
};

type Form = Record<string, string | number | undefined>;

function NewSearch({ onCreated, fill, onForm }: { onCreated: (id: string) => void; fill: Record<string, any> | null; onForm: (f: Form) => void }) {
  const { machines, machineId } = useSession();
  const wantTarget = useRef<string | null>(null); // a target machine asked for before its dataset's machines were known
  const wantTrainers = useRef<string[]>([]); // more machines that train, asked for the same way
  const [entry, setEntry] = useState<string | undefined>(undefined); // the notebook entry this search is for
  const [cat, setCat] = useState<Catalog | null>(null);
  const [details, setDetails] = useState<Record<string, MachineDetail>>({});
  const [dataset, setDataset] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [target, setTarget] = useState("");
  const [speed, setSpeed] = useState("10");
  const [models, setModels] = useState<string[]>(["rfdetr/nano", "rfdetr/small"]);
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [teachers, setTeachers] = useState<string[]>([]);
  const [lrs, setLrs] = useState("");
  const [epochs, setEpochs] = useState("30");
  const [rungs, setRungs] = useState("3");
  const [seeds, setSeeds] = useState("2");
  const [hours, setHours] = useState("");
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<SearchPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { api.catalog().then(setCat).catch(() => undefined); }, []);
  useEffect(() => {
    Promise.all(machines.map((m) => api.machine(m.id).catch(() => null)))
      .then((ds) => setDetails(Object.fromEntries(ds.filter(Boolean).map((d) => [d!.id, d!]))));
  }, [machines]);

  // datasets by name -> the machines that hold a usable copy
  const holders = useMemo(() => {
    const out: Record<string, { mid: string; d: DatasetInfo }[]> = {};
    for (const m of Object.values(details)) for (const d of m.report?.datasets ?? []) {
      if (d.error || d.built === false) continue;
      (out[d.name] ??= []).push({ mid: m.id, d });
    }
    return out;
  }, [details]);
  useEffect(() => {
    if (dataset || !Object.keys(holders).length) return;
    const mine = Object.entries(holders).find(([, hs]) => hs.some((h) => h.mid === machineId));
    setDataset((mine ?? Object.entries(holders)[0])[0]);
  }, [holders, dataset, machineId]);
  useEffect(() => {
    const hs = holders[dataset] ?? [];
    const first = hs.find((h) => h.mid === wantTarget.current)?.mid ?? hs.find((h) => h.mid === machineId)?.mid ?? hs[0]?.mid;
    const more = wantTrainers.current.filter((m) => m !== first && hs.some((h) => h.mid === m));
    setPicked(first ? [first, ...more] : []);
    setTarget(first ?? "");
  }, [dataset, holders, machineId]);

  // settings from the assistant (src/agent.tsx, `?fill=`), as if typed into the fields
  const fillKey = JSON.stringify(fill);
  useEffect(() => {
    if (!fill) return;
    if (fill.speed_budget_ms) setSpeed(fill.speed_budget_ms);
    if (fill.epochs) setEpochs(fill.epochs);
    if (fill.gpu_hours) setHours(fill.gpu_hours);
    if (Array.isArray(fill.models) && fill.models.length) setModels(fill.models);
    if (Array.isArray(fill.teachers)) setTeachers(fill.teachers);
    if (typeof fill.name === "string") setName(fill.name);
    if (typeof fill.notebook === "string") setEntry(fill.notebook);
    if (Array.isArray(fill.machines)) {
      wantTrainers.current = fill.machines;
      const hs = holders[fill.dataset ?? dataset] ?? [];
      const ok = fill.machines.filter((m: string) => hs.some((h) => h.mid === m));
      if (ok.length) setPicked((p) => [...new Set([...p, ...ok])]);
    }
    if (fill.machine) {
      wantTarget.current = fill.machine;
      if ((holders[fill.dataset ?? dataset] ?? []).some((h) => h.mid === fill.machine)) {
        setPicked((p) => (p.includes(fill.machine) ? p : [...p, fill.machine]));
        setTarget(fill.machine);
      }
    }
    if (fill.dataset) setDataset(fill.dataset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fillKey]);
  const form = JSON.stringify({ dataset, machine: target || undefined, speed_budget_ms: Number(speed) || undefined,
    epochs: Number(epochs) || undefined, gpu_hours: Number(hours) || undefined });
  useEffect(() => { onForm(JSON.parse(form)); }, [form]); // eslint-disable-line react-hooks/exhaustive-deps

  const sizeLists: Record<string, number[]> = {};
  let sizeError: string | null = null;
  for (const m of models) {
    const t = (sizes[m] ?? "").trim();
    if (!t) continue;
    const n = numbers(t);
    if (!n) sizeError = `input sizes for ${m}: numbers only`; else sizeLists[m] = n;
  }
  const lrList = numbers(lrs);
  const body: Partial<SearchSpec> = {
    name: name.trim() || `${dataset || "dataset"} under ${speed || "?"} ms`, dataset, machines: picked, target_machine: target,
    speed_ms: Number(speed), models, image_sizes: sizeLists, teachers, lrs: lrList ?? [], epochs: Number(epochs),
    rungs: Number(rungs), seeds: Number(seeds), ...(hours.trim() ? { gpu_hours: Number(hours) } : {}),
  };
  const key = JSON.stringify(body);
  useEffect(() => {
    if (!dataset || !picked.length || sizeError || !lrList) { setPreview(null); return; }
    const t = window.setTimeout(() => {
      api.searchPreview(body).then((p) => { setPreview(p); setError(null); }).catch((e) => { setPreview(null); setError(String(e.message)); });
    }, 300);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const start = () => {
    setBusy(true);
    api.createSearch({ ...body, ...(entry ? { notebook: entry } : {}) }).then((s) => onCreated(s.id)).catch((e) => setError(String(e.message))).finally(() => setBusy(false));
  };
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const dets = (cat?.detectors ?? []).filter((d) => !d.hidden);
  const hs = holders[dataset] ?? [];
  const hashes = new Set(hs.filter((h) => picked.includes(h.mid)).map((h) => h.d.hash?.all).filter(Boolean));
  const checkErrors = hs.filter((h) => picked.includes(h.mid)).flatMap((h) => h.d.check?.errors ?? []);
  const anyRf = models.some((m) => m.startsWith("rfdetr"));

  if (!machines.length) return <Card><Empty title="No machine yet">Add a GPU machine under <Link className="text-accent" to="/machines">Machines</Link> first.</Empty></Card>;
  if (Object.keys(details).length && !Object.keys(holders).length)
    return <Card><Empty title="No dataset yet">Add a dataset on one of your <Link className="text-accent" to="/machines">machines</Link> first.</Empty></Card>;

  return (
    <Card title="New search" icon={<Wand2 className="h-4 w-4" />}
      description="Pick a dataset, a speed budget and the models to try. ModelLab times every candidate, trains the ones that fit in rounds, and keeps the best.">
      <div className="space-y-6">
        {entry && <p className="flex items-center gap-1.5 text-xs text-muted"><BookOpen className="h-3.5 w-3.5 text-accent" />
          For a <Link to={`/notebook/${entry}`} className="font-medium text-accent hover:underline">notebook entry</Link>: the search is linked to it when it starts.</p>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Dataset" yeti="dataset">
            <select className={inputCls} value={dataset} onChange={(e) => setDataset(e.target.value)}>
              {Object.keys(holders).sort().map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Field>
          <Field label="Speed budget (ms per image)" hint="median latency, batch 1, FP16, on the machine below" yeti="speed_budget_ms">
            <input className={cx(inputCls, "font-mono")} inputMode="decimal" value={speed} onChange={(e) => setSpeed(e.target.value)} />
          </Field>
          <Field label="Speed measured on" yeti="machine">
            <select className={inputCls} value={target} onChange={(e) => setTarget(e.target.value)}>
              {hs.filter((h) => picked.includes(h.mid)).map((h) => <option key={h.mid} value={h.mid}>{details[h.mid]?.name}</option>)}
            </select>
          </Field>
          <Field label="Name">
            <input className={inputCls} value={name} placeholder={`${dataset || "dataset"} under ${speed || "?"} ms`} onChange={(e) => setName(e.target.value)} />
          </Field>
        </div>

        <div>
          <div className="mb-1.5 text-xs font-medium text-muted">Machines that train (they must hold the same {dataset} data)</div>
          <div className="flex flex-wrap gap-2">
            {hs.map((h) => (
              <button key={h.mid} onClick={() => setPicked(toggle(picked, h.mid))}
                className={cx("rounded-lg px-2.5 py-1.5 text-[13px] font-medium ring-1 ring-inset transition",
                  picked.includes(h.mid) ? "bg-accent-soft text-accent ring-accent/30" : "text-muted ring-line hover:text-fg")}>
                {details[h.mid]?.name}{!details[h.mid]?.online && <span className="ml-1.5 text-2xs text-subtle">offline</span>}
              </button>
            ))}
          </div>
          {hashes.size > 1 && <p className="mt-1.5 text-xs text-amber-700 dark:text-amber-300">These machines hold different versions of {dataset} (different fingerprints): pick one, or make them the same.</p>}
          {checkErrors.length > 0 && <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-300">The dataset check found problems: {checkErrors[0]} (see the machine page).</p>}
        </div>

        <div>
          <div className="mb-1.5 text-xs font-medium text-muted">Models to try · input sizes (optional, multiples of 32; empty = the model's native size)</div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {dets.map((d) => {
              const on = models.includes(d.id);
              return (
                <div key={d.id} className={cx("flex items-center gap-3 rounded-xl px-3 py-2 ring-1 ring-inset transition", on ? "bg-surface ring-accent/30" : "ring-line")}>
                  <button onClick={() => setModels(toggle(models, d.id))} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                    <span className={cx("flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px]", on ? "border-accent bg-accent text-white" : "border-line")}>{on && "✓"}</span>
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: FAMILY[d.family]?.color }} />
                    <span className="min-w-0 truncate text-[13px] text-fg">{d.label}</span>
                  </button>
                  {on && <div className="w-28 shrink-0"><input className={cx(inputCls, "h-7 px-2 font-mono text-[12px]")} placeholder={String(d.resolution)}
                    value={sizes[d.id] ?? ""} onChange={(e) => setSizes({ ...sizes, [d.id]: e.target.value })} aria-label={`input sizes for ${d.label}`} /></div>}
                </div>
              );
            })}
          </div>
          {sizeError && <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-300">{sizeError}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-1.5 text-xs font-medium text-muted">Also try distilling a teacher into RF-DETR models first (optional)</div>
            <div className="flex flex-wrap gap-1.5">
              {(cat?.teachers ?? []).map((t) => (
                <button key={t.id} disabled={!anyRf} onClick={() => setTeachers(toggle(teachers, t.id))}
                  className={cx("rounded-lg px-2 py-1 text-[12px] font-medium ring-1 ring-inset transition disabled:opacity-40",
                    teachers.includes(t.id) ? "bg-accent-soft text-accent ring-accent/30" : "text-muted ring-line hover:text-fg")}>{t.label}</button>
              ))}
            </div>
          </div>
          <Field label="Learning rates to try (optional)" hint="e.g. 1e-4, 3e-4 · empty = each trainer's default">
            <input className={cx(inputCls, "font-mono")} value={lrs} placeholder="default" onChange={(e) => setLrs(e.target.value)} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Field label="Epochs (full training)" hint="earlier rounds train a fraction of this" yeti="epochs">
            <input className={cx(inputCls, "font-mono")} inputMode="numeric" value={epochs} onChange={(e) => setEpochs(e.target.value)} />
          </Field>
          <Field label="Rounds"><Segmented value={rungs} onChange={setRungs} options={["1", "2", "3", "4"].map((v) => ({ value: v, label: v }))} /></Field>
          <Field label="Extra seeds for the best two"><Segmented value={seeds} onChange={setSeeds} options={["0", "1", "2", "3"].map((v) => ({ value: v, label: v }))} /></Field>
          <Field label="GPU-hour cap (optional)" hint="stops before a round that wouldn't fit" yeti="gpu_hours">
            <input className={cx(inputCls, "font-mono")} inputMode="decimal" value={hours} placeholder="none" onChange={(e) => setHours(e.target.value)} />
          </Field>
        </div>

        {error && <Callout tone="error">{error}</Callout>}
        <div className="flex flex-wrap items-center gap-4 rounded-xl bg-raised/50 px-4 py-3">
          {preview ? (
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-muted">
              <span><b className="font-mono text-fg">{preview.archs}</b> model/size combination{preview.archs > 1 ? "s" : ""} to time</span>
              <span>up to <b className="font-mono text-fg">{preview.configs}</b> configuration{preview.configs > 1 ? "s" : ""} to train</span>
              <span>rounds of <b className="font-mono text-fg">{preview.rounds.map((r) => r.epochs).join(" → ")}</b> epochs</span>
              <span>at most <b className="font-mono text-fg">{preview.max_trials}</b> training runs</span>
            </div>
          ) : <span className="text-[13px] text-subtle">{error ? "fix the above to see the plan" : "working out the plan…"}</span>}
          <Button variant="brand" className="ml-auto" yeti="search.start" disabled={!preview || busy} onClick={start}>{busy ? <Loader2 className="animate-spin" /> : <Sparkles />}Start search</Button>
        </div>
      </div>
    </Card>
  );
}

export default function Search() {
  const list = usePoll(api.searches, 5000);
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState<Form | undefined>(undefined);
  const fill = useMemo(() => readFill(params), [params]);
  useEffect(() => { if (fill) setShow(true); }, [fill]);
  const rows = list.data ?? [];
  const showForm = show || (list.data && !rows.length);
  useYetiPage({ kind: "searches", form: showForm ? form : undefined });
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Build" title="Find my best model"
        description="The most accurate detector that fits your speed budget: every candidate is timed first, the ones that fit train in rounds, the best are repeated with other seeds."
        actions={!showForm && <Button variant="brand" onClick={() => setShow(true)}><Wand2 />New search</Button>} />
      {showForm && <NewSearch onCreated={(id) => nav(`/search/${id}`)} fill={fill} onForm={setForm} />}
      {rows.length > 0 && (
        <Card title="Searches" flush>
          <ul className="divide-y divide-line/70">
            {rows.map((s) => (
              <li key={s.id} data-yeti-row={s.id}>
                <Link to={`/search/${s.id}`} className="group flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 transition hover:bg-raised/40">
                  <div className="min-w-0 flex-1 basis-64">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[14px] font-medium text-fg">{s.name}</span>
                      <StatusPill status={s.status} />
                    </div>
                    <div className="mt-0.5 truncate text-xs text-subtle">{s.message}</div>
                  </div>
                  <div className="flex items-center gap-5 font-mono text-[12px] tabular-nums text-muted">
                    <span className="flex items-center gap-1" title="speed budget"><Gauge className="h-3.5 w-3.5 text-subtle" />{s.spec.speed_ms} ms</span>
                    <span title="training runs done / started">{s.trials.done}/{s.trials.total} runs</span>
                    {s.recommendation && <span className="font-semibold text-emerald-700 dark:text-emerald-300" title={s.recommendation.config}>
                      {fmt.pct(s.recommendation.map_test_mean ?? s.recommendation.map_valid_mean)} mAP</span>}
                    <span className="text-subtle">{relTime(s.created)}</span>
                    <ArrowRight className="h-4 w-4 text-subtle transition group-hover:translate-x-0.5 group-hover:text-accent" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
