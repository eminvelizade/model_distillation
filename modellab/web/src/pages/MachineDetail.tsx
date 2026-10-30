import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity, Cpu, Database, Download, HardDrive, ListOrdered, Loader2, Package, Pencil, Plus, RefreshCw, Server, Stethoscope, Trash2 } from "lucide-react";
import { api, Command, DatasetInfo, MachineDetail as MD } from "../api";
import { CheckIcon, CopyBox, MachineDot, machineState } from "../components/Hub";
import { useSession } from "../session";
import { Button, Callout, Card, cx, Empty, Field, IconButton, inputCls, Modal, PageHeader, ProgressBar, relTime, Segmented, StatusPill, Switch, Toast, usePoll } from "../ui";
import { Gauge } from "./Queue";

const CMD_LABEL: Record<string, string> = {
  selfcheck: "Self-check", dataset_add: "Add dataset", dataset_import: "Import dataset", dataset_verify: "Verify dataset",
  dataset_remove: "Remove dataset", weights_fetch: "Download weights", weights_verify: "Verify weights",
  run_delete_files: "Delete run files", update: "Update",
};
const CMD_STATUS: Record<string, string> = { pending: "queued", sent: "queued", running: "running", done: "done", failed: "failed" };

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5 text-[13px]">
      <span className="shrink-0 text-muted">{label}</span>
      <span className="min-w-0 truncate text-right font-mono text-[12px] tabular-nums text-fg">{children}</span>
    </div>
  );
}

function pendingOf(m: MD, type: string, match?: (c: Command) => boolean) {
  return m.commands.find((c) => c.type === type && ["pending", "sent", "running"].includes(c.status) && (!match || match(c)));
}

function DatasetModal({ onClose, onSend }: { onClose: () => void; onSend: (type: string, args: Record<string, unknown>) => Promise<void> }) {
  const [mode, setMode] = useState<"folder" | "coco" | "yolo">("folder");
  const [f, setF] = useState({ name: "", path: "", description: "", coco_json: "", images_dir: "", yolo_dir: "", keep_splits: false });
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "folder") await onSend("dataset_add", { name: f.name, path: f.path, description: f.description });
      else if (mode === "coco") await onSend("dataset_import", { name: f.name, format: "coco", coco_json: f.coco_json, images_dir: f.images_dir || null, description: f.description });
      else await onSend("dataset_import", { name: f.name, format: "yolo", yolo_dir: f.yolo_dir, keep_splits: f.keep_splits, description: f.description });
      onClose();
    } catch (err) {
      setError((err as Error).message);
    }
  };
  return (
    <Modal onClose={onClose} className="max-w-lg">
      <form onSubmit={submit} className="space-y-4 p-5">
        <div>
          <h2 className="text-[15px] font-semibold text-fg">Add a dataset on this machine</h2>
          <p className="mt-0.5 text-xs text-muted">Paths are on the machine. Images stay where they are; the agent hashes them so you can tell when two machines hold the same data.</p>
        </div>
        <Segmented small value={mode} onChange={setMode} options={[{ value: "folder", label: "Roboflow folder" }, { value: "coco", label: "Import COCO" }, { value: "yolo", label: "Import YOLO" }]} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Name" hint="lowercase, e.g. traffic-v2"><input className={cx(inputCls, "font-mono text-[12.5px]")} value={f.name} onChange={set("name")} pattern="[a-z0-9][a-z0-9_.\-]{0,63}" required autoFocus /></Field>
          <Field label="Description (optional)"><input className={inputCls} value={f.description} onChange={set("description")} /></Field>
        </div>
        {mode === "folder" && <Field label="Folder" hint="has train/ valid/ test/, each with _annotations.coco.json"><input className={cx(inputCls, "font-mono text-[12.5px]")} value={f.path} onChange={set("path")} placeholder="/data/traffic" required /></Field>}
        {mode === "coco" && <>
          <Field label="COCO annotations (.json)"><input className={cx(inputCls, "font-mono text-[12.5px]")} value={f.coco_json} onChange={set("coco_json")} placeholder="/data/raw/annotations.json" required /></Field>
          <Field label="Images folder (optional)" hint="split 70 / 15 / 15 into ~/.modellab/data/datasets/<name>"><input className={cx(inputCls, "font-mono text-[12.5px]")} value={f.images_dir} onChange={set("images_dir")} placeholder="/data/raw/images" /></Field>
        </>}
        {mode === "yolo" && <>
          <Field label="YOLO folder" hint="images/ + labels/ + data.yaml"><input className={cx(inputCls, "font-mono text-[12.5px]")} value={f.yolo_dir} onChange={set("yolo_dir")} placeholder="/data/yolo" required /></Field>
          <Switch checked={f.keep_splits} onChange={(v) => setF({ ...f, keep_splits: v })} label="Keep its train / val / test split" />
        </>}
        {error && <Callout tone="error">{error}</Callout>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary"><Plus />Add dataset</Button>
        </div>
      </form>
    </Modal>
  );
}

function DatasetRow({ d, busy, onVerify, onRemove }: { d: DatasetInfo; busy: boolean; onVerify: () => void; onRemove: () => void }) {
  const n = (s?: { images: number }) => (s ? s.images.toLocaleString() : "–");
  return (
    <li className="group flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl px-3 py-2.5 hover:bg-raised/50">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {d.error ? <CheckIcon status="fail" /> : d.built === false ? <span className="h-4 w-4 shrink-0 rounded-full border border-dashed border-subtle" /> : <CheckIcon status="ok" />}
          <span className="font-mono text-[13px] font-medium text-fg">{d.name}</span>
          {d.classes && <span className="text-2xs text-subtle">{d.classes.length} classes</span>}
        </div>
        <div className="mt-0.5 truncate pl-6 font-mono text-[11px] text-subtle" title={d.path}>{d.path}</div>
        {d.error && <div className="mt-1 pl-6 text-xs text-rose-600 dark:text-rose-300">{d.error}</div>}
        {d.built === false && !d.error && <div className="mt-0.5 pl-6 text-xs text-subtle">not built on this machine</div>}
      </div>
      {!d.error && d.built !== false && (
        <div className="flex items-center gap-4 pl-6 font-mono text-[11.5px] tabular-nums text-muted sm:pl-0">
          <span title="train / valid / test images">{n(d.train)} · {n(d.valid)} · {n(d.test)}</span>
          {d.hash?.all ? <span className="rounded-md bg-raised px-1.5 py-px text-[10.5px] text-subtle" title={`content hash ${d.hash.all}, checked ${relTime(d.hash_time)}`}>#{d.hash.all.slice(0, 8)}</span>
            : <span className="text-[10.5px] text-subtle">not hashed</span>}
        </div>
      )}
      <div className="flex items-center gap-1">
        {d.built !== false && !d.error && <IconButton title="Re-hash every image (detects changed files)" onClick={onVerify} disabled={busy}>{busy ? <Loader2 className="animate-spin" /> : <RefreshCw />}</IconButton>}
        {d.name !== "coco-vehicles" && <IconButton title="Remove from this machine's list (files stay)" onClick={onRemove}><Trash2 /></IconButton>}
      </div>
    </li>
  );
}

function CommandRow({ c }: { c: Command }) {
  const [open, setOpen] = useState(false);
  const detail = c.error || c.log;
  const what = c.type.startsWith("dataset") ? String(c.args.name ?? "") : c.type === "weights_fetch" ? (c.args.ids as string[] | undefined)?.join(", ") : "";
  return (
    <li className="rounded-xl px-3 py-2 hover:bg-raised/40">
      <div className="flex items-center gap-2 text-[13px]">
        <span className="font-medium text-fg">{CMD_LABEL[c.type] ?? c.type}</span>
        {what && <span className="truncate font-mono text-[11.5px] text-muted">{what}</span>}
        <span className="ml-auto shrink-0"><StatusPill status={CMD_STATUS[c.status] === "queued" ? "queued" : CMD_STATUS[c.status]} /></span>
      </div>
      <div className="mt-0.5 flex items-center gap-2 text-2xs text-subtle">
        <span>{relTime(c.created)}</span>
        {c.status === "failed" && c.error && <span className="truncate text-rose-600 dark:text-rose-300">{c.error.split("\n").slice(-1)[0]}</span>}
        {detail && <button className="ml-auto shrink-0 hover:text-fg" onClick={() => setOpen(!open)}>{open ? "hide" : "details"}</button>}
      </div>
      {open && detail && <pre className="scroll-thin mt-2 max-h-48 overflow-auto rounded-lg bg-code p-2.5 font-mono text-[11px] leading-relaxed text-zinc-300 animate-fade">{[c.error, c.log].filter(Boolean).join("\n\n")}</pre>}
    </li>
  );
}

export default function MachineDetail() {
  const { id = "" } = useParams();
  const m = usePoll(() => api.machine(id), 3000, [id]);
  const { machines, refreshMachines, setMachineId } = useSession();
  // the machine you look at becomes the one the sidebar, New experiment and Queue work with
  useEffect(() => { if (machines.some((x) => x.id === id)) setMachineId(id); }, [id, machines, setMachineId]);
  const [toast, setToast] = useState<{ msg: string; kind?: "info" | "error" } | null>(null);
  const [addDs, setAddDs] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [rename, setRename] = useState<string | null>(null);
  const nav = useNavigate();

  if (m.error && !m.data) return <Card><Empty title="Machine not found" mood="sad">{m.error} · <Link className="text-accent" to="/machines">all machines</Link></Empty></Card>;
  const d = m.data;
  if (!d) return <div className="flex items-center justify-center gap-2 py-24 text-sm text-subtle"><Loader2 className="h-4 w-4 animate-spin" />loading…</div>;

  const send = async (type: string, args: Record<string, unknown> = {}) => {
    await api.command(d.id, type, args);
    setToast({ msg: d.online ? `Sent to ${d.name}` : `Queued: ${d.name} is offline and picks it up when it's back` });
    m.refresh();
  };
  const sendSafe = (type: string, args: Record<string, unknown> = {}) => send(type, args).catch((e) => setToast({ msg: e.message, kind: "error" }));
  const rep = d.report ?? {};
  const hw = rep.hardware;
  const checks = [...(rep.checks ?? [])].sort((a, b) => ["fail", "warn", "ok"].indexOf(a.status) - ["fail", "warn", "ok"].indexOf(b.status));
  const weights = Object.entries(rep.weights ?? {});
  const selfcheck = pendingOf(d, "selfcheck");
  const updatePending = d.current_release && d.release && d.current_release !== d.release;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<span className="flex items-center gap-1.5"><Link to="/machines" className="hover:underline">Machines</Link><span className="text-subtle">/</span><span className="text-muted">{d.hostname ?? d.id}</span></span>}
        title={<span className="flex flex-wrap items-center gap-3">{d.name}
          <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium", d.online ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-raised text-muted")}>
            <MachineDot m={d} className="!h-1.5 !w-1.5" />{machineState(d)}</span></span>}
        description={d.online ? `last heartbeat ${relTime(d.last_seen)}` : `offline since ${relTime(d.last_seen)}: is the PC on and the agent running?`}
        actions={<>
          <Button onClick={() => { setMachineId(d.id); nav("/queue"); }}><ListOrdered />Queue</Button>
          <Button variant="brand" disabled={!!selfcheck} onClick={() => sendSafe("selfcheck")}>{selfcheck ? <Loader2 className="animate-spin" /> : <Stethoscope />}Run self-check</Button>
          <IconButton title="Rename" className="h-9 w-9" onClick={() => setRename(d.name)}><Pencil /></IconButton>
          <IconButton title="Remove machine" className="h-9 w-9 hover:text-rose-600" onClick={() => setConfirmRemove(true)}><Trash2 /></IconButton>
        </>} />

      {d.online && d.live?.gpus?.length ? (
        <Card>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {d.live.gpus.map((g) => (
              <div key={g.index}>
                <div className="mb-3 flex items-center justify-between gap-2 text-xs">
                  <span className="truncate font-medium text-fg">GPU {g.index} · {g.name.replace("NVIDIA ", "")}</span>
                  {g.power_w ? <span className="font-mono tabular-nums text-subtle">{g.power_w.toFixed(0)} W</span> : null}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <Gauge label="Utilization" value={g.util} max={100} text={<>{Math.round(g.util)}<span className="text-[10px] text-subtle">%</span></>} colors={["#a6c9f2", "#3d82dc"]} />
                  <Gauge label="VRAM" value={g.mem_used_mb} max={g.mem_total_mb} warn={0.92} text={<>{(g.mem_used_mb / 1024).toFixed(1)}<span className="text-[10px] text-subtle">G</span></>} colors={["#5eead4", "#14b8a6"]} />
                  <Gauge label="Temp" value={g.temp_c} max={95} warn={0.85} text={<>{Math.round(g.temp_c)}<span className="text-[10px] text-subtle">°</span></>} colors={["#f59e0b", "#f97316"]} />
                </div>
              </div>
            ))}
            {d.live.cpu_percent !== null && (
              <div className="flex flex-col justify-center gap-3 text-xs text-muted">
                <div><div className="mb-1 flex justify-between"><span>CPU</span><span className="font-mono tabular-nums text-fg">{Math.round(d.live.cpu_percent ?? 0)}%</span></div><ProgressBar value={(d.live.cpu_percent ?? 0) / 100} /></div>
                {d.live.ram_total_gb ? <div><div className="mb-1 flex justify-between"><span>RAM</span><span className="font-mono tabular-nums text-fg">{d.live.ram_used_gb}/{d.live.ram_total_gb} GB</span></div><ProgressBar value={(d.live.ram_used_gb ?? 0) / d.live.ram_total_gb} /></div> : null}
              </div>
            )}
          </div>
        </Card>
      ) : null}

      {d.update_status?.ok === false && (
        <Callout tone="warn" title={`Update to ${d.update_status.version} failed`}>The machine stays on its current release and retries within the hour. {d.update_status.error?.split("\n").slice(-1)[0]}</Callout>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-5">
          <Card title="Checks" icon={<Stethoscope className="h-3.5 w-3.5" />}
            description={rep.time ? `self-check ${relTime(rep.time)}` : "no self-check yet"}>
            {!checks.length ? <div className="text-[13px] text-subtle">The agent sends its first self-check right after installing.</div> : (
              <ul className="divide-y divide-line">
                {checks.map((c) => (
                  <li key={c.id} className="flex gap-3 py-2.5">
                    <CheckIcon status={c.status} className="mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                        <span className={cx("text-[13px] font-medium", c.status === "fail" ? "text-rose-700 dark:text-rose-300" : "text-fg")}>{c.label}</span>
                        {c.value && <span className="truncate font-mono text-[11.5px] text-muted">{c.value}</span>}
                      </div>
                      {c.detail && c.status !== "ok" && <p className="mt-0.5 text-xs text-muted">{c.detail}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Datasets" icon={<Database className="h-3.5 w-3.5" />} description="registered on this machine" flush
            actions={<Button small onClick={() => setAddDs(true)}><Plus />Add dataset</Button>}>
            {!(rep.datasets ?? []).length ? <div className="px-5 pb-5 text-[13px] text-subtle">None yet.</div> : (
              <ul className="px-2 pb-2">
                {(rep.datasets ?? []).map((ds) => (
                  <DatasetRow key={ds.name} d={ds} busy={!!pendingOf(d, "dataset_verify", (c) => c.args.name === ds.name)}
                    onVerify={() => sendSafe("dataset_verify", { name: ds.name })}
                    onRemove={() => { if (window.confirm(`Forget ${ds.name} on ${d.name}? Its files stay on the machine.`)) sendSafe("dataset_remove", { name: ds.name }); }} />
                ))}
              </ul>
            )}
          </Card>

          <Card title="Weights" icon={<Package className="h-3.5 w-3.5" />} description="downloaded on demand before a run needs them"
            actions={<Button small variant="ghost" onClick={() => sendSafe("weights_verify")}>Verify all</Button>}>
            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
              {weights.map(([k, w]) => {
                const fetching = pendingOf(d, "weights_fetch", (c) => ((c.args.ids as string[]) ?? []).includes(k));
                return (
                  <div key={k} className="flex items-center gap-2 border-b border-line py-2 text-[12.5px] last:border-0">
                    {w.present ? <CheckIcon status={w.verified === false ? "fail" : "ok"} /> : <span className="h-4 w-4 shrink-0 rounded-full border border-dashed border-subtle" />}
                    <span className={cx("min-w-0 flex-1 truncate font-mono", w.present ? "text-fg" : "text-muted")}>{k}</span>
                    {w.present ? <span className="font-mono text-[11px] tabular-nums text-subtle">{w.size ? `${(w.size / 2 ** 20).toFixed(0)} MB` : ""}{w.verified === false ? " · hash mismatch" : ""}</span>
                      : <IconButton title={`Download ${k} now`} disabled={!!fetching} onClick={() => sendSafe("weights_fetch", { ids: [k] })}>{fetching ? <Loader2 className="animate-spin" /> : <Download />}</IconButton>}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="min-w-0 space-y-5">
          <Card title="Hardware" icon={<Cpu className="h-3.5 w-3.5" />}>
            {!hw ? <div className="text-[13px] text-subtle">waiting for the first report…</div> : (
              <div className="divide-y divide-line">
                {hw.gpus.map((g) => <Row key={g.index} label={`GPU ${g.index}`}>{g.name.replace("NVIDIA ", "")} · {g.memory_gb.toFixed(0)} GB{g.capability ? ` · sm ${g.capability}` : ""}</Row>)}
                <Row label="Driver">{hw.driver ?? "none"}{hw.cuda_driver ? ` (CUDA ${hw.cuda_driver})` : ""}</Row>
                <Row label="PyTorch">{hw.torch ?? "–"}{hw.torch_cuda ? ` · CUDA ${hw.torch_cuda}` : ""}</Row>
                <Row label="CPU">{hw.cpu.model} · {hw.cpu.threads} threads</Row>
                <Row label="RAM">{hw.ram_gb.toFixed(0)} GB</Row>
                <div className="py-1.5">
                  <Row label="Disk free">{hw.disk.free_gb.toFixed(0)} of {hw.disk.total_gb.toFixed(0)} GB</Row>
                  <ProgressBar value={1 - hw.disk.free_gb / Math.max(1, hw.disk.total_gb)} />
                </div>
                <Row label="/dev/shm">{hw.shm_gb !== null ? `${hw.shm_gb.toFixed(1)} GB` : "–"}</Row>
                <Row label="Open files">{hw.nofile.soft} / {hw.nofile.hard < 0 ? "∞" : hw.nofile.hard}</Row>
                <Row label="System">{hw.os} · glibc {hw.glibc?.split(" ").slice(-1)[0]}</Row>
                <Row label="Python">{hw.python}</Row>
              </div>
            )}
          </Card>

          <Card title="Agent" icon={<Server className="h-3.5 w-3.5" />}>
            <div className="divide-y divide-line">
              <Row label="Release">{d.release ?? "dev (git checkout)"}</Row>
              {d.current_release && <Row label="Hub release">{d.current_release}</Row>}
              <Row label="Service">{hw?.service?.active ?? "–"}{hw?.service?.linger === false ? " · stops at logout" : ""}</Row>
              {rep.home && <Row label="Folder">{rep.home}</Row>}
            </div>
            {updatePending && <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-sky-500/[.06] px-3 py-2.5 text-xs text-sky-900 dark:text-sky-200">
              <span>Updates to {d.current_release} when idle.</span>
              <Button small onClick={() => sendSafe("update")}><Download />Now</Button>
            </div>}
            <div className="mt-4 text-xs text-muted">To uninstall, run this on the machine (your runs and checkpoints are kept):</div>
            <CopyBox className="mt-2" wrap text={`${rep.home ?? "~/.modellab"}/bin/modellab-agent uninstall`} />
          </Card>

          <Card title="Activity" icon={<Activity className="h-3.5 w-3.5" />} description="commands sent to this machine" flush>
            {!d.commands.length ? <div className="px-5 pb-5 text-[13px] text-subtle">Nothing yet.</div> : (
              <ul className="px-2 pb-2">{d.commands.slice(0, 12).map((c) => <CommandRow key={c.id} c={c} />)}</ul>
            )}
          </Card>
        </div>
      </div>

      {addDs && <DatasetModal onClose={() => setAddDs(false)} onSend={send} />}
      {rename !== null && (
        <Modal onClose={() => setRename(null)}>
          <form className="space-y-4 p-5" onSubmit={(e) => { e.preventDefault(); api.renameMachine(d.id, rename).then(() => { setRename(null); m.refresh(); refreshMachines(); }).catch((err) => setToast({ msg: err.message, kind: "error" })); }}>
            <h2 className="text-[15px] font-semibold text-fg">Rename machine</h2>
            <Field label="Name"><input className={inputCls} value={rename} onChange={(e) => setRename(e.target.value)} maxLength={64} autoFocus required /></Field>
            <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setRename(null)}>Cancel</Button><Button type="submit" variant="primary">Save</Button></div>
          </form>
        </Modal>
      )}
      {confirmRemove && (
        <Modal onClose={() => setConfirmRemove(false)}>
          <div className="space-y-4 p-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600"><HardDrive className="h-4 w-4" /></span>
              <h2 className="text-[15px] font-semibold text-fg">Remove {d.name}?</h2>
            </div>
            <p className="text-[13px] leading-relaxed text-muted">Its token stops working: the agent cancels what it's doing and turns its service off. Queued runs for it are cancelled.
              Runs, checkpoints and weights stay on the PC; run <code className="rounded bg-raised px-1 font-mono text-[11.5px]">modellab-agent uninstall</code> there to remove the agent.</p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirmRemove(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => api.removeMachine(d.id).then(async () => { await refreshMachines(); nav("/machines"); }).catch((e) => setToast({ msg: e.message, kind: "error" }))}><Trash2 />Remove</Button>
            </div>
          </div>
        </Modal>
      )}
      <Toast msg={toast?.msg ?? null} kind={toast?.kind} onClose={() => setToast(null)} />
    </div>
  );
}
