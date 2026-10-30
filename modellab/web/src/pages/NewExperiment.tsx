import { Children, isValidElement, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowUp, BadgeCheck, Code2, FlaskConical, Layers, ListPlus, Loader2, Play, Plus, ScanSearch, Shuffle, Target, Trash2, Wand2, X } from "lucide-react";
import { api, Catalog, Preview } from "../api";
import { Button, Callout, Card, cx, Field, IconButton, inputCls, Mascot, PageHeader, Segmented, sparkleBurst, Tag, Toast, Yaml } from "../ui";
import { MachinePicker } from "../components/Hub";
import { useSession } from "../session";

type Ref = { from: string };
type Stage = Record<string, any> & { name: string; type: string };
interface Recipe { name: string; description?: string; dataset?: string; seed?: number; tags?: string[]; matrix?: Record<string, unknown[]>; stages: Stage[] }

const isRef = (v: unknown): v is Ref => !!v && typeof v === "object" && "from" in (v as object);
const enc = (v: unknown) => (isRef(v) ? `@${v.from}` : v === undefined || v === null ? "" : String(v));
const dec = (s: string): unknown => (s.startsWith("@") ? { from: s.slice(1) } : s);

const TYPE_STYLE: Record<string, { color: string; icon: typeof Target; blurb: string }> = {
  distill: { color: "from-ice-glint to-ice-500", icon: FlaskConical, blurb: "teacher → RF-DETR backbone" },
  finetune: { color: "from-sky-400 to-blue-500", icon: Target, blurb: "supervised detection training" },
  eval: { color: "from-orange-400 to-rose-400", icon: BadgeCheck, blurb: "identical COCO eval + latency" },
  features: { color: "from-amber-300 to-amber-500", icon: ScanSearch, blurb: "feature probe + PCA" },
};

/** Template card art, picked from the template's name. */
function templateStyle(name: string, i: number) {
  const n = name.toLowerCase();
  if (/sweep/.test(n)) return { icon: Shuffle, color: "from-amber-300 to-orange-400" };
  if (/distill/.test(n)) return { icon: FlaskConical, color: "from-ice-glint to-ice-500" };
  if (/probe|feature/.test(n)) return { icon: ScanSearch, color: "from-amber-300 to-amber-500" };
  if (/fine|baseline/.test(n)) return { icon: Target, color: "from-sky-400 to-blue-500" };
  return [{ icon: Wand2, color: "from-ice-300 to-ice-600" }, { icon: Layers, color: "from-ice-200 to-sky-500" }][i % 2];
}

function blankStage(type: string, existing: Stage[]): Stage {
  let i = 1;
  while (existing.some((s) => s.name === `${type}${i === 1 ? "" : i}`)) i++;
  const name = `${type}${i === 1 ? "" : i}`;
  const last = [...existing].reverse().find((s) => s.type === "finetune" || s.type === "distill");
  if (type === "distill") return { name, type, student: "rfdetr/nano", teacher: "dinov3/vitl16", batch_size: 32, budget: { epochs: 30 } };
  if (type === "finetune") return { name, type, model: "rfdetr/nano", ...(last && last.type === "distill" ? { init: { from: last.name } } : {}), batch_size: 16, budget: { epochs: 20 } };
  if (type === "eval") return { name, type, model: last ? { from: last.name } : "rfdetr/nano" };
  return { name, type, models: ["rfdetr/nano", ...(last ? [{ from: last.name }] : [])] };
}

const BLANK: Recipe = {
  name: "my-experiment", dataset: "coco-vehicles", seed: 42, tags: [],
  stages: [
    { name: "finetune", type: "finetune", model: "rfdetr/nano", batch_size: 16, budget: { epochs: 20 } },
    { name: "eval", type: "eval", model: { from: "finetune" } },
  ],
};

/** Which earlier stages produce what (mirrors modellab/recipe.py). */
function producers(stages: Stage[], upto: number, cat: Catalog) {
  const det = (id: string) => cat.detectors.find((d) => d.id === id);
  const out: { name: string; kind: "rfdetr" | "ltdetr"; model: string; teacher: boolean }[] = [];
  stages.slice(0, upto).forEach((s) => {
    if (s.type === "distill") out.push({ name: s.name, kind: "rfdetr", model: s.student, teacher: false });
    if (s.type === "finetune" && typeof s.model === "string") {
      const d = det(s.model) ?? { family: s.model.startsWith("ltdetr") ? "ltdetr" : "rfdetr", teacher_capable: false };
      out.push({ name: s.name, kind: d.family as "rfdetr" | "ltdetr", model: s.model, teacher: !!d.teacher_capable });
    }
  });
  return out;
}

function optionValues(children: React.ReactNode): string[] {
  const out: string[] = [];
  Children.forEach(children, (c) => {
    if (!isValidElement(c)) return;
    const p = c.props as { value?: unknown; children?: React.ReactNode };
    if (c.type === "option") out.push(String(p.value ?? ""));
    else out.push(...optionValues(p.children));
  });
  return out;
}

/** A select that always shows its current value, even one not offered in the menu (e.g. from a cloned recipe). */
function Select({ value, onChange, children, className }: { value: string; onChange: (v: string) => void; children: React.ReactNode; className?: string }) {
  const known = optionValues(children).includes(value);
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={cx(inputCls, "pr-8", className)}>
      {!known && <option value={value}>{value.startsWith("@") ? `from: ${value.slice(1)}` : value}</option>}
      {children}
    </select>
  );
}

function NumberInput({ value, onChange, placeholder, step }: { value: number | undefined; onChange: (v: number | undefined) => void; placeholder?: string; step?: number }) {
  return <input type="number" min={0} step={step ?? 1} value={value ?? ""} placeholder={placeholder}
    onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))} className={inputCls} />;
}

function StageCard({ st, idx, stages, cat, vars, onChange, onRemove, onMove }: {
  st: Stage; idx: number; stages: Stage[]; cat: Catalog; vars: string[];
  onChange: (s: Stage) => void; onRemove: () => void; onMove: (d: -1 | 1) => void;
}) {
  const prods = producers(stages, idx, cat);
  const set = (k: string, v: unknown) => {
    const n = { ...st };
    if (v === undefined || v === "") delete n[k]; else n[k] = v;
    onChange(n);
  };
  const budget = st.budget ?? {};
  const setBudget = (k: string, v: number | undefined) => {
    const b = { ...budget };
    if (v === undefined) delete b[k]; else b[k] = v;
    set("budget", Object.keys(b).length ? b : undefined);
  };
  const style = TYPE_STYLE[st.type];
  const varOpts = vars.map((v) => <option key={v} value={`\${${v}}`}>{`\${${v}}`} (sweep)</option>);
  const detectorOpts = (fam?: string) => cat.detectors.filter((d) => !d.hidden && (!fam || d.family === fam)).map((d) => <option key={d.id} value={d.id}>{d.label}</option>);
  const sameModel = (model: string) => prods.filter((p) => p.model === model);
  const isLT = typeof st.model === "string" && st.model.startsWith("ltdetr");

  const Icon = style?.icon ?? Target;
  return (
    <div className="relative flex animate-pop gap-4">
      {/* pipeline rail */}
      <div className="hidden w-9 shrink-0 flex-col items-center sm:flex">
        <div className={cx("z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-soft ring-4 ring-canvas", style?.color)}><Icon className="h-4 w-4" /></div>
        <div className="w-px flex-1 bg-gradient-to-b from-line to-line/40" />
      </div>
      <div className="mb-4 min-w-0 flex-1 rounded-2xl border border-line bg-surface p-4 shadow-soft transition focus-within:border-accent/40 focus-within:shadow-lift sm:p-5">
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <div className={cx("flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br text-white sm:hidden", style?.color)}><Icon className="h-4 w-4" /></div>
        <span className="font-mono text-2xs text-subtle">{String(idx + 1).padStart(2, "0")}</span>
        <input value={st.name} onChange={(e) => set("name", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "_"))} aria-label="stage name"
          className="w-36 rounded-md bg-transparent px-1 text-[15px] font-semibold text-fg outline-none ring-accent/50 hover:bg-raised focus:bg-raised focus:ring-2" />
        <span className="rounded-md bg-raised px-1.5 py-0.5 text-2xs font-medium text-muted">{st.type}</span>
        <span className="hidden text-xs text-subtle md:inline">{style?.blurb}</span>
        <div className="ml-auto flex items-center">
          <IconButton title="Move up" onClick={() => onMove(-1)} disabled={idx === 0}><ArrowUp /></IconButton>
          <IconButton title="Move down" onClick={() => onMove(1)} disabled={idx === stages.length - 1}><ArrowDown /></IconButton>
          <IconButton title="Remove stage" onClick={onRemove} className="hover:!bg-rose-500/10 hover:!text-rose-500"><Trash2 /></IconButton>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {st.type === "distill" && <>
          <Field label="Student (RF-DETR)">
            <Select value={st.student ?? "rfdetr/nano"} onChange={(v) => set("student", v)}>{detectorOpts("rfdetr")}</Select>
          </Field>
          <Field label="Teacher" hint={isRef(st.teacher) ? "fine-tuned DINOv3 backbone from that stage" : undefined}>
            <Select value={enc(st.teacher)} onChange={(v) => set("teacher", dec(v))}>
              <optgroup label="Pretrained teachers">{cat.teachers.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}</optgroup>
              {prods.some((p) => p.teacher) && <optgroup label="From an earlier stage">{prods.filter((p) => p.teacher).map((p) => <option key={p.name} value={`@${p.name}`}>from: {p.name}</option>)}</optgroup>}
              {vars.length > 0 && <optgroup label="Sweep variable">{varOpts}</optgroup>}
            </Select>
          </Field>
          <Field label="Init student from">
            <Select value={enc(st.init ?? "stock")} onChange={(v) => set("init", v === "stock" ? undefined : dec(v))}>
              <option value="stock">stock COCO weights</option>
              {sameModel(st.student ?? "rfdetr/nano").map((p) => <option key={p.name} value={`@${p.name}`}>from: {p.name}</option>)}
            </Select>
          </Field>
          <Field label="Image size" hint="empty = student native (DINOv2 teachers: multiple of 224)">
            <NumberInput value={st.image_size} onChange={(v) => set("image_size", v)} placeholder="auto" step={32} />
          </Field>
        </>}

        {st.type === "finetune" && <>
          <Field label="Model">
            <Select value={st.model ?? ""} onChange={(v) => { const n: Stage = { ...st, model: v }; delete n.init; if (!v.startsWith("ltdetr")) delete n.image_size; onChange(n); }}>
              <optgroup label="RF-DETR (DINOv2)">{detectorOpts("rfdetr")}</optgroup>
              <optgroup label="LT-DETR (DINOv3, LightlyTrain)">{detectorOpts("ltdetr")}</optgroup>
              {vars.length > 0 && <optgroup label="Sweep variable">{varOpts}</optgroup>}
            </Select>
          </Field>
          <Field label="Init from">
            <Select value={enc(st.init ?? "stock")} onChange={(v) => set("init", v === "stock" ? undefined : dec(v))}>
              <option value="stock">{isLT ? "stock (COCO / DINOv3 weights)" : "stock COCO weights"}</option>
              {sameModel(st.model).map((p) => <option key={p.name} value={`@${p.name}`}>from: {p.name}</option>)}
            </Select>
          </Field>
          {isLT && <Field label="Image size"><NumberInput value={st.image_size} onChange={(v) => set("image_size", v)} placeholder="384" step={32} /></Field>}
          <Field label="Learning rate" hint="empty = library default"><NumberInput value={st.lr} onChange={(v) => set("lr", v)} placeholder="default" step={0.0001} /></Field>
        </>}

        {st.type === "eval" && <>
          <Field label="Model to evaluate">
            <Select value={enc(st.model)} onChange={(v) => set("model", dec(v))}>
              {prods.length > 0 && <optgroup label="From an earlier stage">{prods.map((p) => <option key={p.name} value={`@${p.name}`}>from: {p.name}</option>)}</optgroup>}
              <optgroup label="Stock weights">{detectorOpts()}</optgroup>
            </Select>
          </Field>
          <Field label="Label (leaderboard)"><input className={inputCls} value={st.label ?? ""} placeholder="auto" onChange={(e) => set("label", e.target.value)} /></Field>
          <Field label="Split">
            <Select value={st.split ?? "test"} onChange={(v) => set("split", v === "test" ? undefined : v)}><option value="test">test</option><option value="valid">valid</option></Select>
          </Field>
          <label className="flex items-center gap-2 self-end pb-2 text-[13px] text-muted">
            <input type="checkbox" checked={st.latency !== false} onChange={(e) => set("latency", e.target.checked ? undefined : false)} className="h-4 w-4 accent-ice-600" />
            measure latency (fp16, bs 1)
          </label>
        </>}

        {st.type === "features" && <>
          <Field label="Backbones to probe">
            <div className="flex flex-wrap gap-1.5 rounded-[10px] bg-raised/60 p-1.5 ring-1 ring-inset ring-line">
              {[...prods.filter((p) => p.kind === "rfdetr").map((p) => ({ v: `@${p.name}`, l: `from: ${p.name}` })),
                ...cat.students.map((s) => ({ v: s, l: `stock ${s.replace("rfdetr/", "")}` }))].map((o) => {
                const cur: string[] = (st.models ?? []).map(enc);
                const on = cur.includes(o.v);
                return <button key={o.v} onClick={() => set("models", (on ? cur.filter((x) => x !== o.v) : [...cur, o.v]).map(dec))}
                  className={cx("rounded-md px-2 py-1 text-xs font-medium transition", on ? "bg-amber-500 text-white shadow-soft" : "bg-surface text-muted ring-1 ring-line hover:text-fg")}>{o.l}</button>;
              })}
            </div>
          </Field>
          <Field label="Teacher reference (optional)">
            <Select value={st.teacher ?? ""} onChange={(v) => set("teacher", v || undefined)}>
              <option value="">none</option>{cat.teachers.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </Select>
          </Field>
          <Field label="Split">
            <Select value={st.split ?? "valid"} onChange={(v) => set("split", v === "valid" ? undefined : v)}><option value="valid">valid</option><option value="test">test</option></Select>
          </Field>
        </>}

        {(st.type === "distill" || st.type === "finetune") && <>
          <Field label="Budget: epochs"><NumberInput value={budget.epochs} onChange={(v) => setBudget("epochs", v)} placeholder={String(cat.default_epochs[st.type])} /></Field>
          <Field label="Budget: wall-clock cap (min)"><NumberInput value={budget.minutes} onChange={(v) => setBudget("minutes", v)} placeholder="none" /></Field>
          <Field label="Batch size"><NumberInput value={st.batch_size} onChange={(v) => set("batch_size", v)} placeholder={st.type === "distill" ? "32" : "8"} /></Field>
        </>}
        <Field label="Dataset">
          <Select value={st.dataset ?? ""} onChange={(v) => set("dataset", v || undefined)}>
            <option value="">recipe default</option>
            {cat.datasets.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
          </Select>
        </Field>
      </div>
      </div>
    </div>
  );
}

export default function NewExperiment() {
  const [cat, setCat] = useState<Catalog | null>(null);
  const [recipe, setRecipe] = useState<Recipe>(BLANK);
  const [mode, setMode] = useState<"builder" | "yaml">("builder");
  const [yamlText, setYamlText] = useState("");
  const [preview, setPreview] = useState<Preview | null>(null);
  const [toast, setToast] = useState<{ msg: string; kind: "info" | "error" } | null>(null);
  const [busy, setBusy] = useState(false);
  const [tagDraft, setTagDraft] = useState("");
  const [params] = useSearchParams();
  const nav = useNavigate();
  const { hub, machine, machineId, machines } = useSession();

  // on the hub the datasets (and missing weights) are those of the machine picked in the sidebar
  useEffect(() => { api.catalog().then(setCat).catch((e) => setToast({ msg: String(e), kind: "error" })); }, [machineId]);

  const loadYaml = async (text: string) => {
    try {
      const { recipe: r } = await api.parse(text);
      setRecipe(r);
      setMode("builder");
    } catch {
      setYamlText(text); // not representable in the builder -> stay in YAML mode
      setMode("yaml");
    }
  };

  useEffect(() => {
    const clone = params.get("clone");
    if (clone) api.run(clone).then((r) => { loadYaml(r.recipe_yaml); setToast({ msg: `Cloned recipe of ${r.name} — edit and run`, kind: "info" }); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Live preview (debounced): builder -> server renders YAML + validates; YAML mode -> validate text.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const body = mode === "builder" ? { recipe } : { yaml: yamlText };
      api.preview(body).then((p) => { setPreview(p); if (mode === "builder") setYamlText(p.yaml); }).catch(() => undefined);
    }, 350);
    return () => window.clearTimeout(t);
  }, [recipe, yamlText, mode, machineId]);

  const vars = useMemo(() => Object.keys(recipe.matrix ?? {}), [recipe.matrix]);
  const setStage = (i: number, s: Stage) => setRecipe((r) => ({ ...r, stages: r.stages.map((x, j) => (j === i ? s : x)) }));

  const submit = async (position: "front" | "end", from?: HTMLElement) => {
    setBusy(true);
    try {
      const res = await api.submit(mode === "builder" ? preview?.yaml ?? "" : yamlText, position);
      sparkleBurst(from, 14);
      setToast({ msg: `${res.run_ids.length} run${res.run_ids.length > 1 ? "s" : ""} ${position === "front" ? "starting next" : "added to the queue"}${hub && machine ? ` on ${machine.name}` : ""} ✨`, kind: "info" });
      window.setTimeout(() => nav("/queue"), 700);
    } catch (e) {
      setToast({ msg: String((e as Error).message), kind: "error" });
    } finally {
      setBusy(false);
    }
  };

  if (!cat) return <div className="flex items-center justify-center gap-2 py-24 text-sm text-subtle"><Loader2 className="h-4 w-4 animate-spin" />loading the lab…</div>;
  const matrixEntries = Object.entries(recipe.matrix ?? {});
  const nRuns = preview?.runs.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Build" title="New experiment"
        description="Start from a template or stack stages. Each stage can consume an earlier stage's output."
        actions={<Segmented value={mode} onChange={(m) => (m === "builder" && mode === "yaml" ? loadYaml(yamlText) : setMode(m))}
          options={[{ value: "builder", label: "Builder", icon: <Layers /> }, { value: "yaml", label: "YAML", icon: <Code2 /> }]} />} />

      <div>
        <div className="mb-3 text-xs font-medium text-muted">Start from a template</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cat.templates.map((t, i) => {
            const ts = templateStyle(t.name, i);
            return (
              <button key={t.id} onClick={() => loadYaml(t.yaml)}
                className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-4 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lift">
                <div className={cx("absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-[.12] blur-xl transition group-hover:opacity-25", ts.color)} />
                <span className={cx("flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-soft transition duration-300 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-rotate-6 group-hover:scale-110", ts.color)}><ts.icon className="h-4 w-4" /></span>
                <div className="mt-3 text-[13.5px] font-semibold text-fg">{t.name}</div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{t.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-6">
          {mode === "builder" ? (
            <>
              <Card title="Recipe" description="Shared by every stage unless a stage overrides it">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <Field label="Name"><input className={inputCls} value={recipe.name} onChange={(e) => setRecipe({ ...recipe, name: e.target.value })} /></Field>
                  <Field label="Dataset">
                    <select className={cx(inputCls, "pr-8")} value={recipe.dataset ?? ""} onChange={(e) => setRecipe({ ...recipe, dataset: e.target.value })}>
                      {recipe.dataset && !cat.datasets.some((d) => d.name === recipe.dataset) && <option value={recipe.dataset}>{recipe.dataset} (not on this machine)</option>}
                      {cat.datasets.map((d) => <option key={d.name} value={d.name}>{d.name}{d.built === false ? " (not built)" : d.error ? " (broken)" : ""}</option>)}
                    </select>
                  </Field>
                  <Field label="Seed"><NumberInput value={recipe.seed} onChange={(v) => setRecipe({ ...recipe, seed: v })} /></Field>
                  <Field label="Tags">
                    <div className="flex min-h-9 flex-wrap items-center gap-1 rounded-[10px] bg-surface px-2 py-1.5 shadow-soft ring-1 ring-inset ring-line focus-within:ring-2 focus-within:ring-accent/60 dark:bg-raised/60">
                      {(recipe.tags ?? []).map((t) => <Tag key={t} onRemove={() => setRecipe({ ...recipe, tags: recipe.tags!.filter((x) => x !== t) })}>{t}</Tag>)}
                      <input value={tagDraft} placeholder="add + enter" onChange={(e) => setTagDraft(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && tagDraft.trim()) { setRecipe({ ...recipe, tags: [...(recipe.tags ?? []), tagDraft.trim()] }); setTagDraft(""); } }}
                        className="min-w-[60px] flex-1 bg-transparent text-[13px] text-fg outline-none placeholder:text-subtle" />
                    </div>
                  </Field>
                </div>
                <div className="mt-5 rounded-xl border border-dashed border-accent/30 bg-accent/[.04] p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[13px]">
                      <Shuffle className="h-4 w-4 text-accent" />
                      <span className="font-semibold text-fg">Sweep</span>
                      <span className="text-muted">optional · one run per combination · use <code className="rounded bg-raised px-1 font-mono text-[11.5px] text-accent">${"{var}"}</code> in a stage</span>
                    </div>
                    <Button small variant="ghost" onClick={() => setRecipe({ ...recipe, matrix: { ...(recipe.matrix ?? {}), [vars.includes("teacher") ? `var${vars.length + 1}` : "teacher"]: ["dinov3/vits16", "dinov3/vitb16"] } })}><Plus />Variable</Button>
                  </div>
                  {matrixEntries.length > 0 && <div className="mt-3 space-y-2">
                    {matrixEntries.map(([k, vals]) => (
                      <div key={k} className="grid grid-cols-[120px_1fr_auto] gap-2 sm:grid-cols-[160px_1fr_auto]">
                        <input className={cx(inputCls, "font-mono text-[12.5px]")} value={k} onChange={(e) => {
                          const m: Record<string, unknown[]> = {};
                          Object.entries(recipe.matrix!).forEach(([kk, vv]) => (m[kk === k ? e.target.value.replace(/\W/g, "") : kk] = vv));
                          setRecipe({ ...recipe, matrix: m });
                        }} />
                        <input className={cx(inputCls, "font-mono text-[12.5px]")} value={vals.join(", ")} onChange={(e) => setRecipe({ ...recipe, matrix: { ...recipe.matrix!, [k]: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) } })} />
                        <IconButton title="Remove variable" className="h-9 w-9" onClick={() => { const m = { ...recipe.matrix! }; delete m[k]; setRecipe({ ...recipe, matrix: Object.keys(m).length ? m : undefined }); }}><X /></IconButton>
                      </div>
                    ))}
                  </div>}
                </div>
              </Card>

              <div>
                <div className="mb-3 flex items-center justify-between text-xs font-medium text-muted">
                  <span>Pipeline · {recipe.stages.length} stage{recipe.stages.length === 1 ? "" : "s"}</span>
                  <span className="text-subtle">runs top to bottom</span>
                </div>
                {recipe.stages.map((s, i) => (
                  <StageCard key={i} st={s} idx={i} stages={recipe.stages} cat={cat} vars={vars} onChange={(n) => setStage(i, n)}
                    onRemove={() => setRecipe({ ...recipe, stages: recipe.stages.filter((_, j) => j !== i) })}
                    onMove={(d) => {
                      const st = [...recipe.stages];
                      const j = i + d;
                      [st[i], st[j]] = [st[j], st[i]];
                      setRecipe({ ...recipe, stages: st });
                    }} />
                ))}
                <div className="flex gap-4">
                  <div className="hidden w-9 shrink-0 justify-center sm:flex">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-dashed border-line text-subtle"><Plus className="h-4 w-4" /></div>
                  </div>
                  <div className="flex flex-1 flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-line p-3">
                    <span className="px-1 text-[13px] text-subtle">Add stage</span>
                    {Object.entries(TYPE_STYLE).map(([t, s]) => (
                      <button key={t} onClick={() => setRecipe({ ...recipe, stages: [...recipe.stages, blankStage(t, recipe.stages)] })}
                        className="flex items-center gap-2 rounded-[10px] bg-surface py-1.5 pl-1.5 pr-3 text-[13px] font-medium text-fg shadow-soft ring-1 ring-inset ring-line transition hover:-translate-y-px hover:ring-accent/40">
                        <span className={cx("flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br text-white", s.color)}><s.icon className="h-3.5 w-3.5" /></span>{t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Card title="Recipe YAML" description="Edit freely; switch back to Builder when it fits the form">
              <textarea value={yamlText} onChange={(e) => setYamlText(e.target.value)} spellCheck={false}
                className="scroll-thin h-[600px] w-full resize-y rounded-xl bg-code p-4 font-mono text-[12.5px] leading-[1.7] text-emerald-200 caret-ice-300 outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-accent/60 dark:ring-white/[.07]" />
            </Card>
          )}
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <Card title="Preview" description={preview ? `will create ${nRuns} run${nRuns === 1 ? "" : "s"}` : "validating…"} actions={preview && (preview.ok
            ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Ready</span>
            : <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-700 dark:text-rose-300"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" />Needs fixes</span>)}>
            <div className="space-y-3">
              {mode === "builder" && <Yaml text={preview?.yaml ?? "…"} className="max-h-[320px]" />}
              {preview && preview.errors.length > 0 && (
                <Callout tone="error" title={`${preview.errors.length} error${preview.errors.length > 1 ? "s" : ""}`}>
                  <ul className="space-y-0.5">{preview.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
                </Callout>
              )}
              {preview && preview.warnings.length > 0 && (
                <Callout tone="warn"><ul className="space-y-0.5">{preview.warnings.map((e, i) => <li key={i}>{e}</li>)}</ul></Callout>
              )}
              {preview && preview.runs.length > 0 && (
                <div className="space-y-2">
                  {preview.runs.map((r) => (
                    <div key={r.name} className="rounded-xl border border-line bg-raised/40 px-3 py-2.5">
                      <div className="truncate text-[13px] font-medium text-fg">{r.name}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-1">
                        {r.stages.map((s, i) => {
                          const ts = TYPE_STYLE[s.type];
                          return (
                            <span key={s.name} className="flex items-center gap-1">
                              {i > 0 && <span className="h-px w-2.5 bg-line" />}
                              <span className="flex items-center gap-1.5 rounded-md bg-surface px-1.5 py-0.5 text-[11.5px] text-muted ring-1 ring-inset ring-line">
                                <span className={cx("h-2 w-2 rounded-full bg-gradient-to-br", ts?.color)} />{s.name}
                              </span>
                            </span>
                          );
                        })}
                      </div>
                      {r.missing_weights.length > 0 && (hub
                        ? <div className="mt-2 text-xs text-sky-700 dark:text-sky-300">↓ {machine?.name ?? "the machine"} downloads {r.missing_weights.join(", ")} before the run starts</div>
                        : <div className="mt-2 text-xs text-amber-700 dark:text-amber-300">⚠ weights not downloaded: {r.missing_weights.join(", ")} (online: <code className="font-mono">modellab weights fetch …</code>)</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {hub && (machines.length ? (
                <div className="flex items-center gap-2.5 pt-1 text-xs text-muted">
                  <span className="shrink-0">Runs on</span><MachinePicker className="min-w-0 flex-1" />
                </div>
              ) : <Callout tone="info">Add a GPU machine first on the <Link to="/machines" className="font-medium underline">Machines</Link> page.</Callout>)}
              {hub && machine && !machine.online && <div className="text-xs text-amber-700 dark:text-amber-300">{machine.name} is offline: runs wait in its queue until it's back.</div>}
              <div className="flex items-center gap-2 pt-1">
                <Button variant="brand" className="flex-1" disabled={!preview?.ok || busy} onClick={(e) => submit("front", e.currentTarget)} title="Put at the front of the queue">
                  {busy ? <Loader2 className="animate-spin" /> : <Play />}Run next
                </Button>
                <Button className="flex-1" disabled={!preview?.ok || busy} onClick={(e) => submit("end", e.currentTarget)}><ListPlus />Add to queue</Button>
                <Mascot size={34} mood={!preview ? "happy" : preview.ok ? "happy" : "sad"} />
              </div>
            </div>
          </Card>
        </aside>
      </div>
      <Toast msg={toast?.msg ?? null} kind={toast?.kind} onClose={() => setToast(null)} />
    </div>
  );
}
