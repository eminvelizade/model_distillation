import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Cpu, Loader2, Plus, Server, Terminal } from "lucide-react";
import { api, Machine } from "../api";
import { CopyBox, MachineDot, machineState } from "../components/Hub";
import { useSession } from "../session";
import { Button, Callout, Card, cx, Empty, Field, inputCls, LiveDot, Modal, PageHeader, ProgressBar, relTime, sparkleBurst } from "../ui";

function ChecksChip({ m }: { m: Machine }) {
  if (!m.report_time) return <span className="rounded-md bg-raised px-1.5 py-0.5 text-[11px] text-subtle">no report yet</span>;
  if (m.checks.fail) return <span className="rounded-md bg-rose-500/10 px-1.5 py-0.5 text-[11px] font-medium text-rose-700 dark:text-rose-300">{m.checks.fail} problem{m.checks.fail > 1 ? "s" : ""}</span>;
  if (m.checks.warn) return <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-300">{m.checks.warn} warning{m.checks.warn > 1 ? "s" : ""}</span>;
  return <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">ready</span>;
}

function MachineCard({ m }: { m: Machine }) {
  const g = m.online ? m.live?.gpus?.[0] : undefined;
  return (
    <Link to={`/machines/${m.id}`} className="group block min-w-0 rounded-2xl border border-line bg-surface p-4 shadow-soft transition duration-200 hover:-translate-y-px hover:border-accent/30 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2"><MachineDot m={m} /><span className="truncate text-[14.5px] font-semibold text-fg">{m.name}</span></div>
          <div className="mt-0.5 truncate text-xs text-subtle">{machineState(m)}{m.hostname ? ` · ${m.hostname}` : ""}</div>
        </div>
        <ChecksChip m={m} />
      </div>
      <div className="mt-4 space-y-1.5">
        {m.gpus.length ? m.gpus.map((x) => (
          <div key={x.index} className="flex items-center gap-2 text-[13px] text-fg"><Cpu className="h-3.5 w-3.5 text-subtle" />
            <span className="truncate">{x.name.replace("NVIDIA ", "")}</span>
            <span className="ml-auto shrink-0 font-mono text-xs tabular-nums text-muted">{x.memory_gb.toFixed(0)} GB</span>
          </div>
        )) : <div className="text-[13px] text-subtle">{m.report_time ? "no NVIDIA GPU reported" : "waiting for the first self-check…"}</div>}
      </div>
      {g && (
        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-3 text-2xs text-subtle">
          <div><div className="mb-1 flex justify-between"><span>GPU</span><span className="font-mono tabular-nums text-fg">{Math.round(g.util)}%</span></div><ProgressBar value={g.util / 100} /></div>
          <div><div className="mb-1 flex justify-between"><span>VRAM</span><span className="font-mono tabular-nums text-fg">{(g.mem_used_mb / 1024).toFixed(1)}/{(g.mem_total_mb / 1024).toFixed(0)} GB</span></div><ProgressBar value={g.mem_used_mb / g.mem_total_mb} /></div>
        </div>
      )}
      <div className="mt-3 flex items-center gap-2 text-2xs text-subtle">
        <span className="truncate">{m.release ? `release ${m.release}` : m.agent_version ? `agent ${m.agent_version}` : ""}</span>
        <span className="ml-auto shrink-0">{m.online ? "online" : `seen ${relTime(m.last_seen)}`}</span>
        <ArrowUpRight className="h-3 w-3 shrink-0 opacity-0 transition group-hover:opacity-100" />
      </div>
    </Link>
  );
}

function useCountdown(until: number | null) {
  const [now, setNow] = useState(Date.now() / 1000);
  useEffect(() => {
    if (!until) return;
    const t = window.setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => window.clearInterval(t);
  }, [until]);
  const s = until ? Math.max(0, Math.round(until - now)) : 0;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Name the machine -> one install command with a 10-minute pairing code -> wait until the agent connects. */
function AddMachine({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [pair, setPair] = useState<{ pairing_id: string; code: string; expires: number; command: string } | null>(null);
  const [status, setStatus] = useState<{ used: boolean; machine_id: string | null; expired: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const done = useRef<HTMLDivElement>(null);
  const { refreshMachines, setMachineId } = useSession();
  const nav = useNavigate();
  const left = useCountdown(pair?.expires ?? null);

  const create = async (e?: FormEvent) => {
    e?.preventDefault();
    setBusy(true);
    setError(null);
    try {
      setPair(await api.pair(name.trim()));
      setStatus(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!pair || status?.used || status?.expired) return;
    const t = window.setInterval(async () => {
      try {
        const s = await api.pairing(pair.pairing_id);
        setStatus(s);
        if (s.used && s.machine_id) {
          await refreshMachines();
          setMachineId(s.machine_id);
          window.setTimeout(() => sparkleBurst(done.current, 14), 50);
        }
      } catch { /* keep polling */ }
    }, 2000);
    return () => window.clearInterval(t);
  }, [pair, status, refreshMachines, setMachineId]);

  return (
    <Modal onClose={onClose} className="max-w-xl">
      <div className="space-y-4 p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent"><Server className="h-4 w-4" /></span>
          <div>
            <h2 className="text-[15px] font-semibold text-fg">Add a machine</h2>
            <p className="text-xs text-muted">A Linux PC with an NVIDIA GPU (driver 570 or newer). It runs your experiments on its own hardware.</p>
          </div>
        </div>

        {!pair ? (
          <form onSubmit={create} className="space-y-4">
            <Field label="Name" hint="How it shows up here, e.g. the GPU or where it stands.">
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="RTX 5090 · office" maxLength={64} autoFocus required />
            </Field>
            {error && <Callout tone="error">{error}</Callout>}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={busy || !name.trim()}>{busy ? <Loader2 className="animate-spin" /> : <Terminal />}Get the install command</Button>
            </div>
          </form>
        ) : status?.used ? (
          <div ref={done} className="space-y-4 text-center animate-pop">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
            <div>
              <div className="text-[15px] font-semibold text-fg">{name} is connected</div>
              <p className="mt-1 text-[13px] text-muted">The installer finishes the environment and the self-check; the machine page fills in as it reports.</p>
            </div>
            <div className="flex justify-center gap-2">
              <Button variant="ghost" onClick={onClose}>Close</Button>
              <Button variant="primary" onClick={() => { onClose(); nav(`/machines/${status.machine_id}`); }}>Open machine<ArrowUpRight /></Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <ol className="space-y-3 text-[13px] text-muted">
              <li><span className="font-medium text-fg">1.</span> On <span className="font-medium text-fg">{name}</span>, open a terminal (as your normal user, no sudo) and paste:</li>
            </ol>
            <CopyBox text={pair.command} wrap />
            <p className="text-[12.5px] leading-relaxed text-muted">
              <span className="font-medium text-fg">2.</span> It checks the driver, installs the agent in <code className="rounded bg-raised px-1 font-mono text-[11.5px]">~/.modellab</code>,
              builds the Python environment (a few GB, first time only) and starts it as a service. Datasets, weights and checkpoints stay on that PC.
            </p>
            {status?.expired ? (
              <Callout tone="warn" title="The code expired">Codes work for 10 minutes and only once. <button className="font-medium underline" onClick={() => create()}>Create a new one</button>.</Callout>
            ) : (
              <div className="flex items-center gap-2.5 rounded-xl bg-raised/60 px-3.5 py-3 text-[13px]">
                <LiveDot />
                <span className="text-fg">Waiting for {name} to connect…</span>
                <span className="ml-auto font-mono text-xs tabular-nums text-subtle">code expires in {left}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function Machines() {
  const { machines, ready } = useSession();
  const [adding, setAdding] = useState(false);
  const online = machines.filter((m) => m.online).length;
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Run" title="Machines"
        description="Your GPU PCs. Each runs your experiments on its own hardware; the agent installs once and keeps itself up to date."
        actions={<Button variant="brand" onClick={() => setAdding(true)}><Plus />Add machine</Button>} />
      {!ready ? <div className="flex items-center gap-2 py-12 text-sm text-subtle"><Loader2 className="h-4 w-4 animate-spin" />loading…</div>
        : machines.length === 0 ? (
          <Card><Empty title="No machines yet" mood="happy">
            Add your GPU PC: you get one command to paste into a terminal there, and it shows up here with its hardware.
            <div className="mt-4"><Button variant="brand" onClick={() => setAdding(true)}><Plus />Add machine</Button></div>
          </Empty></Card>
        ) : (
          <div>
            <div className="mb-3 text-xs font-medium text-muted">{machines.length} machine{machines.length > 1 ? "s" : ""} · {online} online</div>
            <div className={cx("grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3")}>
              {machines.map((m) => <MachineCard key={m.id} m={m} />)}
            </div>
          </div>
        )}
      {adding && <AddMachine onClose={() => setAdding(false)} />}
    </div>
  );
}
