import { FormEvent, useState } from "react";
import { AlertTriangle, Check, CheckCircle2, Copy, KeyRound, Loader2, XCircle } from "lucide-react";
import { api, Machine } from "../api";
import { useSession } from "../session";
import { Button, Callout, cx, Field, inputCls, LiveDot, Modal } from "../ui";

/** Online / busy / offline dot for a machine (busy = running a job). */
export function MachineDot({ m, className }: { m: Machine | null; className?: string }) {
  if (!m) return <span className={cx("h-2 w-2 rounded-full bg-subtle/50", className)} />;
  if (!m.online) return <span className={cx("h-2 w-2 rounded-full bg-subtle", className)} title="offline" />;
  if (m.state === "running" || m.state === "preparing") return <LiveDot className={className} />;
  return <span className={cx("h-2 w-2 rounded-full bg-emerald-500", className)} title="online" />;
}

export function machineState(m: Machine): string {
  if (!m.online) return "offline";
  return { running: "training", preparing: "preparing a run", updating: "updating", command: "busy", idle: "idle" }[m.state] ?? m.state;
}

/** Picks the machine new runs go to and the Queue shows. */
export function MachinePicker({ className, compact }: { className?: string; compact?: boolean }) {
  const { machines, machineId, machine, setMachineId } = useSession();
  if (!machines.length) return null;
  return (
    <div className={cx("relative flex items-center", className)}>
      <MachineDot m={machine} className="pointer-events-none absolute left-3 z-10" />
      <select aria-label="Machine" value={machineId ?? ""} onChange={(e) => setMachineId(e.target.value)}
        className={cx(inputCls, "pl-7 pr-8", compact && "h-8 text-[13px]")}>
        {machines.map((m) => <option key={m.id} value={m.id}>{m.name}{m.online ? "" : " (offline)"}</option>)}
      </select>
    </div>
  );
}

export function CheckIcon({ status, className }: { status: "ok" | "warn" | "fail"; className?: string }) {
  const c = cx("h-4 w-4 shrink-0", className);
  if (status === "ok") return <CheckCircle2 className={cx(c, "text-emerald-500")} aria-label="ok" />;
  if (status === "warn") return <AlertTriangle className={cx(c, "text-amber-500")} aria-label="warning" />;
  return <XCircle className={cx(c, "text-rose-500")} aria-label="problem" />;
}

/** A command / secret to copy, in the dark code style. */
export function CopyBox({ text, className, wrap }: { text: string; className?: string; wrap?: boolean }) {
  const [done, setDone] = useState(false);
  const copy = () => navigator.clipboard?.writeText(text).then(() => { setDone(true); window.setTimeout(() => setDone(false), 1400); }).catch(() => undefined);
  return (
    <div className={cx("flex items-start gap-2 rounded-xl bg-code p-3 ring-1 ring-black/5 dark:ring-white/[.07]", className)}>
      <code className={cx("min-w-0 flex-1 font-mono text-[12px] leading-relaxed text-emerald-200", wrap ? "whitespace-pre-wrap break-all" : "scroll-none overflow-x-auto whitespace-pre")}>{text}</code>
      <button onClick={copy} title="Copy" aria-label="Copy"
        className="flex h-7 shrink-0 items-center gap-1 rounded-lg bg-white/10 px-2 text-[11.5px] font-medium text-zinc-200 transition hover:bg-white/20">
        {done ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}{done ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/** Change your password. `forced`: the admin gave you a temporary one, so this can't be dismissed. */
export function ChangePassword({ onClose, forced }: { onClose: () => void; forced?: boolean }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { reload } = useSession();
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (next !== again) return setError("the new passwords don't match");
    setBusy(true);
    setError(null);
    try {
      await api.changePassword(current, next);
      await reload();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal onClose={forced ? () => undefined : onClose}>
      <form onSubmit={submit} className="space-y-4 p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent"><KeyRound className="h-4 w-4" /></span>
          <div>
            <h2 className="text-[15px] font-semibold text-fg">{forced ? "Choose your own password" : "Change password"}</h2>
            <p className="text-xs text-muted">{forced ? "You signed in with a temporary password from your admin." : "At least 8 characters."}</p>
          </div>
        </div>
        <Field label={forced ? "Temporary password" : "Current password"}>
          <input className={inputCls} type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" required autoFocus />
        </Field>
        <Field label="New password" hint="8 or more characters">
          <input className={inputCls} type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" minLength={8} required />
        </Field>
        <Field label="New password again">
          <input className={inputCls} type="password" value={again} onChange={(e) => setAgain(e.target.value)} autoComplete="new-password" minLength={8} required />
        </Field>
        {error && <Callout tone="error">{error}</Callout>}
        <div className="flex justify-end gap-2">
          {!forced && <Button variant="ghost" onClick={onClose}>Cancel</Button>}
          <Button type="submit" variant="primary" disabled={busy}>{busy && <Loader2 className="animate-spin" />}Save password</Button>
        </div>
      </form>
    </Modal>
  );
}
