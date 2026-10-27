import { ReactNode, useEffect, useRef, useState } from "react";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function usePoll<T>(fn: () => Promise<T>, ms: number, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;
  useEffect(() => {
    let alive = true;
    let timer: number | undefined;
    const tick = async () => {
      try {
        const d = await fnRef.current();
        if (alive) { setData(d); setError(null); }
      } catch (e) {
        if (alive) setError(String((e as Error).message ?? e));
      }
      if (alive && ms > 0) timer = window.setTimeout(tick, ms);
    };
    tick();
    return () => { alive = false; window.clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { data, error, refresh: () => fnRef.current().then(setData).catch((e) => setError(String(e))) };
}

export function Card({ children, className, title, actions }: { children: ReactNode; className?: string; title?: ReactNode; actions?: ReactNode }) {
  return (
    <section className={cx("rounded-2xl border border-ink-200/70 bg-white shadow-soft dark:border-ink-800 dark:bg-ink-900", className)}>
      {(title || actions) && (
        <header className="flex items-center justify-between gap-3 border-b border-ink-100 px-5 py-3 dark:border-ink-800">
          <h2 className="text-sm font-semibold tracking-wide text-ink-600 dark:text-ink-300">{title}</h2>
          <div className="flex items-center gap-2">{actions}</div>
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

const STATUS: Record<string, { cls: string; label: string; dot: string }> = {
  queued: { cls: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/30", label: "waiting", dot: "bg-sky-400" },
  running: { cls: "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-500/30", label: "running", dot: "bg-violet-500 animate-pulse" },
  done: { cls: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30", label: "done", dot: "bg-emerald-500" },
  failed: { cls: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-500/30", label: "failed", dot: "bg-rose-500" },
  cancelled: { cls: "bg-ink-100 text-ink-600 ring-ink-200 dark:bg-ink-800 dark:text-ink-300 dark:ring-ink-700", label: "cancelled", dot: "bg-ink-400" },
  interrupted: { cls: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/30", label: "interrupted", dot: "bg-amber-500" },
  pending: { cls: "bg-ink-50 text-ink-500 ring-ink-200 dark:bg-ink-800/60 dark:text-ink-400 dark:ring-ink-700", label: "pending", dot: "bg-ink-300" },
};

export function StatusPill({ status }: { status: string }) {
  const s = STATUS[status] ?? STATUS.pending;
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", s.cls)}>
      <span className={cx("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export function Button({ children, onClick, variant = "secondary", disabled, title, type = "button", small }: {
  children: ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "danger" | "ghost"; disabled?: boolean; title?: string;
  type?: "button" | "submit"; small?: boolean;
}) {
  const v = {
    primary: "bg-violet-600 text-white hover:bg-violet-500 shadow-sm shadow-violet-600/20 dark:bg-violet-500 dark:hover:bg-violet-400",
    secondary: "bg-white text-ink-700 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 dark:bg-ink-800 dark:text-ink-100 dark:ring-ink-700 dark:hover:bg-ink-700",
    danger: "bg-white text-rose-600 ring-1 ring-inset ring-rose-200 hover:bg-rose-50 dark:bg-ink-800 dark:text-rose-300 dark:ring-rose-500/40 dark:hover:bg-rose-500/10",
    ghost: "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800",
  }[variant];
  return (
    <button type={type} title={title} disabled={disabled} onClick={onClick}
      className={cx("inline-flex items-center gap-1.5 rounded-xl font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        small ? "px-2.5 py-1 text-xs" : "px-3.5 py-2 text-sm", v)}>
      {children}
    </button>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cx("h-2 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800", className)}>
      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-700"
        style={{ width: `${Math.max(2, Math.min(100, value * 100))}%` }} />
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-ink-500 dark:text-ink-400">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink-400">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border-0 bg-ink-50 px-3 py-2 text-sm text-ink-800 ring-1 ring-inset ring-ink-200 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-violet-400 dark:bg-ink-850 dark:text-ink-100 dark:ring-ink-700";

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <Mascot size={56} mood="sleepy" />
      <div className="text-sm font-semibold text-ink-600 dark:text-ink-300">{title}</div>
      {children && <div className="max-w-md text-sm text-ink-500 dark:text-ink-400">{children}</div>}
    </div>
  );
}

/** "Labby": a little flask with eyes. Moods change the face. */
export function Mascot({ size = 36, mood = "happy" }: { size?: number; mood?: "happy" | "busy" | "sleepy" | "sad" }) {
  const eyes = mood === "sleepy"
    ? <><path d="M24 39q3 2 6 0" stroke="#3b2a6b" strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M34 39q3 2 6 0" stroke="#3b2a6b" strokeWidth="2" fill="none" strokeLinecap="round" /></>
    : <><circle cx="27" cy="39" r="2.6" fill="#3b2a6b" /><circle cx="37" cy="39" r="2.6" fill="#3b2a6b" /><circle cx="27.8" cy="38.2" r=".8" fill="#fff" /><circle cx="37.8" cy="38.2" r=".8" fill="#fff" /></>;
  const mouth = mood === "sad" ? <path d="M29 47q3-2.5 6 0" stroke="#3b2a6b" strokeWidth="2" fill="none" strokeLinecap="round" />
    : mood === "busy" ? <ellipse cx="32" cy="46" rx="2" ry="1.6" fill="#3b2a6b" />
    : <path d="M29 45q3 3 6 0" stroke="#3b2a6b" strokeWidth="2" fill="none" strokeLinecap="round" />;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={mood === "busy" ? "animate-bob" : undefined} aria-hidden>
      <path d="M25 8h14v4h-2v12l13 20a7 7 0 0 1-5.9 10.8H19.9A7 7 0 0 1 14 44l13-20V12h-2z" fill="#ede9fe" stroke="#7c3aed" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M18.6 40h26.8l3.2 5a4.5 4.5 0 0 1-3.8 7H19.2a4.5 4.5 0 0 1-3.8-7z" fill="#c4b5fd" opacity=".85" />
      {eyes}
      {mouth}
      <circle cx="22" cy="44" r="1.8" fill="#f9a8d4" opacity=".8" /><circle cx="42" cy="44" r="1.8" fill="#f9a8d4" opacity=".8" />
      <circle cx="44" cy="20" r="2.2" fill="#6ee7b7" /><circle cx="48" cy="13" r="1.4" fill="#a78bfa" />
    </svg>
  );
}

export function Tag({ children, onRemove }: { children: ReactNode; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-fuchsia-50 px-2 py-0.5 text-[11px] font-medium text-fuchsia-700 dark:bg-fuchsia-500/10 dark:text-fuchsia-300">
      #{children}
      {onRemove && <button onClick={onRemove} className="ml-0.5 opacity-60 hover:opacity-100" aria-label="remove tag">×</button>}
    </span>
  );
}

export function Toast({ msg, kind = "info", onClose }: { msg: string | null; kind?: "info" | "error"; onClose: () => void }) {
  useEffect(() => {
    if (!msg) return;
    const t = window.setTimeout(onClose, 5000);
    return () => window.clearTimeout(t);
  }, [msg, onClose]);
  if (!msg) return null;
  return (
    <div className={cx("fixed bottom-5 right-5 z-50 max-w-md rounded-2xl px-4 py-3 text-sm shadow-lg",
      kind === "error" ? "bg-rose-600 text-white" : "bg-ink-800 text-white dark:bg-white dark:text-ink-900")}>
      {msg}
    </div>
  );
}

/** Live log viewer over server-sent events. */
export function LogView({ runId, stage, height = "h-80" }: { runId: string; stage: string | null; height?: string }) {
  const [lines, setLines] = useState<string[]>([]);
  const [follow, setFollow] = useState(true);
  const box = useRef<HTMLPreElement>(null);
  useEffect(() => {
    setLines([]);
    const es = new EventSource(`/api/runs/${runId}/logs?stage=${encodeURIComponent(stage ?? "runner")}`);
    es.onmessage = (e) => setLines((l) => (l.length > 3000 ? l.slice(-2500) : l).concat(JSON.parse(e.data)));
    return () => es.close();
  }, [runId, stage]);
  useEffect(() => {
    if (follow && box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [lines, follow]);
  return (
    <div className="relative">
      <pre ref={box} onScroll={(e) => {
        const el = e.currentTarget;
        setFollow(el.scrollHeight - el.scrollTop - el.clientHeight < 40);
      }} className={cx(height, "overflow-auto rounded-xl bg-ink-950 p-4 font-mono text-[11.5px] leading-relaxed text-ink-200 dark:bg-black/60")}>
        {lines.length ? lines.map((l, i) => (
          <div key={i} className={cx(/\b(error|traceback|exception|failed)\b/i.test(l) && "text-rose-300", /\[modellab|\[runner/.test(l) && "text-violet-300")}>{l}</div>
        )) : <span className="text-ink-500">waiting for log lines…</span>}
      </pre>
      {!follow && <button onClick={() => setFollow(true)} className="absolute bottom-3 right-4 rounded-lg bg-violet-600 px-2 py-1 text-xs text-white">follow ↓</button>}
    </div>
  );
}
