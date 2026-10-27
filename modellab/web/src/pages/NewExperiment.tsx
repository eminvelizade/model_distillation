import { Children, isValidElement, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, Catalog, Preview } from "../api";
import { Button, Card, cx, Field, inputCls, Mascot, Tag, Toast } from "../ui";

type Ref = { from: string };
type Stage = Record<string, any> & { name: string; type: string };
interface Recipe { name: string; description?: string; dataset?: string; seed?: number; tags?: string[]; matrix?: Record<string, unknown[]>; stages: Stage[] }

const isRef = (v: unknown): v is Ref => !!v && typeof v === "object" && "from" in (v as object);
const enc = (v: unknown) => (isRef(v) ? `@${v.from}` : v === undefined || v === null ? "" : String(v));
const dec = (s: string): unknown => (s.startsWith("@") ? { from: s.slice(1) } : s);

const TYPE_STYLE: Record<string, { color: string; emoji: string; blurb: string }> = {
  distill: { color: "from-violet-500 to-fuchsia-500", emoji: "⚗", blurb: "teacher → RF-DETR backbone" },
  finetune: { color: "from-sky-500 to-cyan-400", emoji: "◎", blurb: "supervised detection training" },
  eval: { color: "from-emerald-500 to-teal-400", emoji: "✓", blurb: "identical COCO eval + latency" },
  features: { color: "from-amber-500 to-orange-400", emoji: "◈", blurb: "feature probe + PCA" },
};

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

  return (
    <div className="relative rounded-2xl border border-ink-200/80 bg-white p-4 shadow-soft dark:border-ink-800 dark:bg-ink-900">
      <div className="mb-3 flex items-center gap-3">
        <div className={cx("flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-lg text-white", style?.color)}>{style?.emoji}</div>
        <input value={st.name} onChange={(e) => set("name", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "_"))}
          className="w-40 rounded-lg bg-transparent px-1 text-[15px] font-semibold text-ink-800 outline-none focus:bg-ink-50 dark:text-ink-100 dark:focus:bg-ink-800" />
        <span className="text-xs text-ink-400">{st.type} · {style?.blurb}</span>
        <div className="ml-auto flex items-center gap-1">
          <Button small variant="ghost" onClick={() => onMove(-1)} disabled={idx === 0} title="move up">↑</Button>
          <Button small variant="ghost" onClick={() => onMove(1)} disabled={idx === stages.length - 1} title="move down">↓</Button>
          <Button small variant="ghost" onClick={onRemove} title="remove stage">✕</Button>
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
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-ink-600 dark:text-ink-300">
            <input type="checkbox" checked={st.latency !== false} onChange={(e) => set("latency", e.target.checked ? undefined : false)} className="h-4 w-4 accent-violet-600" />
            measure latency (fp16, bs 1)
          </label>
        </>}

        {st.type === "features" && <>
          <Field label="Backbones to probe">
            <div className="flex flex-wrap gap-2 rounded-xl bg-ink-50 p-2 ring-1 ring-inset ring-ink-200 dark:bg-ink-850 dark:ring-ink-700">
              {[...prods.filter((p) => p.kind === "rfdetr").map((p) => ({ v: `@${p.name}`, l: `from: ${p.name}` })),
                ...cat.students.map((s) => ({ v: s, l: `stock ${s.replace("rfdetr/", "")}` }))].map((o) => {
                const cur: string[] = (st.models ?? []).map(enc);
                const on = cur.includes(o.v);
                return <button key={o.v} onClick={() => set("models", (on ? cur.filter((x) => x !== o.v) : [...cur, o.v]).map(dec))}
                  className={cx("rounded-lg px-2 py-1 text-xs", on ? "bg-amber-500 text-white" : "bg-white text-ink-600 ring-1 ring-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:ring-ink-700")}>{o.l}</button>;
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

  useEffect(() => { api.catalog().then(setCat).catch((e) => setToast({ msg: String(e), kind: "error" })); }, []);

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
  }, [recipe, yamlText, mode]);

  const vars = useMemo(() => Object.keys(recipe.matrix ?? {}), [recipe.matrix]);
  const setStage = (i: number, s: Stage) => setRecipe((r) => ({ ...r, stages: r.stages.map((x, j) => (j === i ? s : x)) }));

  const submit = async (position: "front" | "end") => {
    setBusy(true);
    try {
      const res = await api.submit(mode === "builder" ? preview?.yaml ?? "" : yamlText, position);
      setToast({ msg: `${res.run_ids.length} run${res.run_ids.length > 1 ? "s" : ""} ${position === "front" ? "starting next" : "added to the queue"} ✨`, kind: "info" });
      window.setTimeout(() => nav("/queue"), 700);
    } catch (e) {
      setToast({ msg: String((e as Error).message), kind: "error" });
    } finally {
      setBusy(false);
    }
  };

  if (!cat) return <div className="py-20 text-center text-ink-400">loading the lab…</div>;
  const matrixEntries = Object.entries(recipe.matrix ?? {});

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
      <div className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white">New experiment</h1>
            <p className="text-sm text-ink-500 dark:text-ink-400">Pick a template or stack stages. Each stage can use an earlier stage's output.</p>
          </div>
          <div className="flex rounded-xl bg-ink-100 p-1 text-sm dark:bg-ink-800">
            {(["builder", "yaml"] as const).map((m) => (
              <button key={m} onClick={() => (m === "builder" && mode === "yaml" ? loadYaml(yamlText) : setMode(m))}
                className={cx("rounded-lg px-3 py-1", mode === m ? "bg-white font-medium shadow-sm dark:bg-ink-700" : "text-ink-500")}>{m === "builder" ? "Builder" : "YAML"}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cat.templates.map((t, i) => (
            <button key={t.id} onClick={() => loadYaml(t.yaml)}
              className="group rounded-2xl border border-ink-200/80 bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-violet-300 dark:border-ink-800 dark:bg-ink-900 dark:hover:border-violet-500/50">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">{i + 1}</span>
                <span className="text-sm font-semibold text-ink-800 dark:text-ink-100">{t.name}</span>
              </div>
              <p className="line-clamp-3 text-xs text-ink-500 dark:text-ink-400">{t.description}</p>
            </button>
          ))}
        </div>

        {mode === "builder" ? (
          <>
            <Card title="Recipe">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Field label="Name"><input className={inputCls} value={recipe.name} onChange={(e) => setRecipe({ ...recipe, name: e.target.value })} /></Field>
                <Field label="Dataset">
                  <select className={inputCls} value={recipe.dataset ?? ""} onChange={(e) => setRecipe({ ...recipe, dataset: e.target.value })}>
                    {cat.datasets.map((d) => <option key={d.name} value={d.name}>{d.name}{d.built === false ? " (not built)" : ""}</option>)}
                  </select>
                </Field>
                <Field label="Seed"><NumberInput value={recipe.seed} onChange={(v) => setRecipe({ ...recipe, seed: v })} /></Field>
                <Field label="Tags">
                  <div className="flex flex-wrap items-center gap-1 rounded-xl bg-ink-50 px-2 py-1.5 ring-1 ring-inset ring-ink-200 dark:bg-ink-850 dark:ring-ink-700">
                    {(recipe.tags ?? []).map((t) => <Tag key={t} onRemove={() => setRecipe({ ...recipe, tags: recipe.tags!.filter((x) => x !== t) })}>{t}</Tag>)}
                    <input value={tagDraft} placeholder="add…" onChange={(e) => setTagDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && tagDraft.trim()) { setRecipe({ ...recipe, tags: [...(recipe.tags ?? []), tagDraft.trim()] }); setTagDraft(""); } }}
                      className="min-w-[60px] flex-1 bg-transparent text-sm outline-none" />
                  </div>
                </Field>
              </div>
              <div className="mt-4 rounded-xl bg-violet-50/60 p-3 dark:bg-violet-500/5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">Sweep (optional) — one run per combination; use ${"{var}"} in a stage</span>
                  <Button small variant="ghost" onClick={() => setRecipe({ ...recipe, matrix: { ...(recipe.matrix ?? {}), [vars.includes("teacher") ? `var${vars.length + 1}` : "teacher"]: ["dinov3/vits16", "dinov3/vitb16"] } })}>+ variable</Button>
                </div>
                {matrixEntries.map(([k, vals]) => (
                  <div key={k} className="mb-2 grid grid-cols-[140px_1fr_auto] gap-2">
                    <input className={inputCls} value={k} onChange={(e) => {
                      const m: Record<string, unknown[]> = {};
                      Object.entries(recipe.matrix!).forEach(([kk, vv]) => (m[kk === k ? e.target.value.replace(/\W/g, "") : kk] = vv));
                      setRecipe({ ...recipe, matrix: m });
                    }} />
                    <input className={inputCls} value={vals.join(", ")} onChange={(e) => setRecipe({ ...recipe, matrix: { ...recipe.matrix!, [k]: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) } })} />
                    <Button small variant="ghost" onClick={() => { const m = { ...recipe.matrix! }; delete m[k]; setRecipe({ ...recipe, matrix: Object.keys(m).length ? m : undefined }); }}>✕</Button>
                  </div>
                ))}
              </div>
            </Card>

            <div className="space-y-3">
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
              <div className="flex flex-wrap gap-2 rounded-2xl border-2 border-dashed border-ink-200 p-3 dark:border-ink-800">
                <span className="self-center px-1 text-sm text-ink-400">add stage:</span>
                {Object.entries(TYPE_STYLE).map(([t, s]) => (
                  <button key={t} onClick={() => setRecipe({ ...recipe, stages: [...recipe.stages, blankStage(t, recipe.stages)] })}
                    className="flex items-center gap-2 rounded-xl bg-white px-3 py-1.5 text-sm text-ink-700 shadow-soft ring-1 ring-ink-200 hover:ring-violet-300 dark:bg-ink-900 dark:text-ink-200 dark:ring-ink-700">
                    <span className={cx("flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br text-[11px] text-white", s.color)}>{s.emoji}</span>{t}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <Card title="Recipe YAML">
            <textarea value={yamlText} onChange={(e) => setYamlText(e.target.value)} spellCheck={false}
              className={cx(inputCls, "h-[560px] font-mono text-[12.5px] leading-relaxed")} />
          </Card>
        )}
      </div>

      <aside className="lg:sticky lg:top-20 lg:self-start">
        <Card title="Preview" actions={preview && (preview.ok
          ? <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">✓ looks good</span>
          : <span className="text-xs font-medium text-rose-600 dark:text-rose-400">needs fixes</span>)}>
          {mode === "builder" && (
            <pre className="scroll-thin mb-4 max-h-[340px] overflow-auto rounded-xl bg-ink-950 p-3 font-mono text-[11.5px] leading-relaxed text-emerald-200 dark:bg-black/50">{preview?.yaml ?? "…"}</pre>
          )}
          {preview && preview.errors.length > 0 && (
            <ul className="mb-3 space-y-1 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
              {preview.errors.map((e, i) => <li key={i}>• {e}</li>)}
            </ul>
          )}
          {preview && preview.warnings.length > 0 && (
            <ul className="mb-3 space-y-1 rounded-xl bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
              {preview.warnings.map((e, i) => <li key={i}>• {e}</li>)}
            </ul>
          )}
          {preview && preview.runs.length > 0 && (
            <div className="mb-4 space-y-2">
              <div className="text-xs font-medium text-ink-500">Will create {preview.runs.length} run{preview.runs.length > 1 ? "s" : ""}</div>
              {preview.runs.map((r) => (
                <div key={r.name} className="rounded-xl bg-ink-50 px-3 py-2 text-xs dark:bg-ink-850">
                  <div className="font-medium text-ink-700 dark:text-ink-200">{r.name}</div>
                  <div className="mt-1 flex flex-wrap items-center gap-1 text-ink-500">
                    {r.stages.map((s, i) => <span key={s.name}>{i > 0 && "→ "}{s.name}</span>)}
                  </div>
                  {r.missing_weights.length > 0 && (
                    <div className="mt-1 text-amber-700 dark:text-amber-300">⚠ weights not downloaded: {r.missing_weights.join(", ")} (online: <code>modellab weights fetch …</code>)</div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button variant="primary" disabled={!preview?.ok || busy} onClick={() => submit("front")} title="Put at the front of the queue">▶ Run next</Button>
            <Button disabled={!preview?.ok || busy} onClick={() => submit("end")}>＋ Add to queue</Button>
            <div className="ml-auto"><Mascot size={32} mood={preview?.ok ? "happy" : "sad"} /></div>
          </div>
        </Card>
      </aside>
      <Toast msg={toast?.msg ?? null} kind={toast?.kind} onClose={() => setToast(null)} />
    </div>
  );
}
