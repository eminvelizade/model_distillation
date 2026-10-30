import { MouseEvent, ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, Loader2, Search, X, XCircle } from "lucide-react";

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

export const reducedMotion = () => !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Animates a number towards `value` (ease-out). Jumps straight there when motion is reduced. */
export function useCountUp(value: number, ms = 700) {
  const [v, setV] = useState(value);
  const from = useRef(0);
  useEffect(() => {
    if (reducedMotion()) { setV(value); return; }
    const a = from.current, t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      setV(a + (value - a) * e);
      if (k < 1) raf = requestAnimationFrame(step); else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); from.current = value; };
  }, [value, ms]);
  return v;
}

export function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  return <>{useCountUp(value).toFixed(decimals)}</>;
}

/** A soft burst of icy sparkles from an element (a success moment). Nothing when motion is reduced. */
export function sparkleBurst(el: Element | null | undefined, n = 12) {
  if (!el || reducedMotion()) return;
  const r = el.getBoundingClientRect();
  const colors = ["#5eead4", "#7dd3fc", "#a5f3fc", "#ffffff", "#2dd4bf"];
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.5, d = 26 + Math.random() * 30;
    s.className = "spark";
    s.textContent = i % 3 ? "✦" : "•";
    Object.assign(s.style, {
      left: `${r.left + r.width / 2 + (Math.random() - 0.5) * r.width * 0.5}px`, top: `${r.top + r.height / 2}px`,
      color: colors[i % colors.length], fontSize: `${8 + Math.random() * 7}px`, textShadow: "0 0 6px rgb(94 234 212 / .6)",
      animationDelay: `${Math.random() * 80}ms`,
    });
    s.style.setProperty("--dx", `${Math.cos(a) * d}px`);
    s.style.setProperty("--dy", `${Math.sin(a) * d - 8}px`);
    s.style.setProperty("--r", `${(Math.random() - 0.5) * 120}deg`);
    document.body.appendChild(s);
    window.setTimeout(() => s.remove(), 1100);
  }
}

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const set = (d: boolean) => {
    const html = document.documentElement;
    html.classList.add("theme-transition");
    window.setTimeout(() => html.classList.remove("theme-transition"), 450);
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    try { localStorage.setItem("modellab-theme", d ? "dark" : "light"); } catch { /* private mode */ }
  };
  return { dark, set, toggle: () => set(!document.documentElement.classList.contains("dark")) };
}

/** Tracks an element's width (for charts that draw in pixels, so text never scales). */
export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export const relTime = (t: number | null | undefined) => {
  if (!t) return "–";
  const s = Date.now() / 1000 - t;
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  if (s < 86400 * 14) return `${Math.round(s / 86400)}d ago`;
  return new Date(t * 1000).toLocaleDateString([], { month: "short", day: "numeric" });
};

// ---------- layout ----------

export function PageHeader({ eyebrow, title, description, actions, children }: {
  eyebrow?: ReactNode; title: ReactNode; description?: ReactNode; actions?: ReactNode; children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        {eyebrow && <div className="mb-1.5 text-xs font-medium text-accent">{eyebrow}</div>}
        <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-fg">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className, title, description, actions, icon, flush, bodyClassName }: {
  children: ReactNode; className?: string; title?: ReactNode; description?: ReactNode; actions?: ReactNode; icon?: ReactNode;
  flush?: boolean; bodyClassName?: string;
}) {
  return (
    <section className={cx("min-w-0 rounded-2xl border border-line bg-surface shadow-soft transition-shadow duration-300", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 pb-1 pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            {icon && <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-raised text-muted">{icon}</span>}
            <div className="min-w-0">
              <h2 className="truncate text-[13.5px] font-semibold text-fg">{title}</h2>
              {description && <p className="truncate text-xs text-subtle">{description}</p>}
            </div>
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cx(flush ? "" : "p-5", !!(title || actions) && !flush && "pt-3", bodyClassName)}>{children}</div>
    </section>
  );
}

export function Stat({ label, value, sub, icon, className }: { label: ReactNode; value: ReactNode; sub?: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <div className={cx("group min-w-0 rounded-2xl border border-line bg-surface p-4 shadow-soft transition duration-300 hover:-translate-y-px hover:border-accent/30 hover:shadow-lift", className)}>
      <div className="flex items-center justify-between gap-2 text-xs font-medium text-muted">
        <span className="truncate">{label}</span>
        {icon && <span className="text-subtle transition duration-300 group-hover:scale-110 group-hover:text-accent">{icon}</span>}
      </div>
      <div className="mt-2 truncate font-mono text-[22px] font-medium tabular-nums tracking-tight text-fg">{value}</div>
      {sub && <div className="mt-0.5 truncate text-xs text-subtle">{sub}</div>}
    </div>
  );
}

// ---------- status ----------

const STATUS: Record<string, { cls: string; label: string; dot: string }> = {
  queued: { cls: "bg-raised text-muted", label: "waiting", dot: "bg-subtle" },
  running: { cls: "bg-sky-500/10 text-sky-700 dark:text-sky-300", label: "running", dot: "bg-sky-500" },
  done: { cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", label: "done", dot: "bg-emerald-500" },
  failed: { cls: "bg-rose-500/10 text-rose-700 dark:text-rose-300", label: "failed", dot: "bg-rose-500" },
  cancelled: { cls: "bg-raised text-muted", label: "cancelled", dot: "bg-subtle" },
  interrupted: { cls: "bg-amber-500/10 text-amber-700 dark:text-amber-300", label: "interrupted", dot: "bg-amber-500" },
  pending: { cls: "bg-raised text-subtle", label: "pending", dot: "bg-subtle/60" },
};

export function LiveDot({ className, color = "bg-sky-500" }: { className?: string; color?: string }) {
  return (
    <span className={cx("relative inline-flex h-2 w-2", className)}>
      <span className={cx("absolute inset-0 rounded-full animate-ping2", color)} />
      <span className={cx("relative inline-flex h-2 w-2 rounded-full", color)} />
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const s = STATUS[status] ?? STATUS.pending;
  return (
    <span className={cx("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11.5px] font-medium", s.cls)}>
      {status === "running" ? <LiveDot className="!h-1.5 !w-1.5 [&>span]:!h-1.5 [&>span]:!w-1.5" /> : <span className={cx("h-1.5 w-1.5 rounded-full", s.dot)} />}
      {s.label}
    </span>
  );
}

// ---------- controls ----------

export function Button({ children, onClick, variant = "secondary", disabled, title, type = "button", small, className }: {
  children: ReactNode; onClick?: (e: MouseEvent<HTMLButtonElement>) => void; variant?: "primary" | "brand" | "secondary" | "danger" | "ghost"; disabled?: boolean; title?: string;
  type?: "button" | "submit"; small?: boolean; className?: string;
}) {
  const v = {
    primary: "bg-fg text-canvas shadow-soft hover:bg-fg/85",
    brand: "bg-gradient-to-b from-teal-400 to-cyan-600 text-white shadow-[0_1px_0_rgb(255_255_255/.3)_inset,0_6px_18px_-6px_rgb(20_184_166/.65)] ring-1 ring-inset ring-cyan-700/25 hover:from-teal-300 hover:to-cyan-500",
    secondary: "bg-surface text-fg ring-1 ring-inset ring-line shadow-soft hover:bg-raised",
    danger: "bg-surface text-rose-600 ring-1 ring-inset ring-rose-500/30 hover:bg-rose-500/10 dark:text-rose-300",
    ghost: "text-muted hover:bg-raised hover:text-fg",
  }[variant];
  return (
    <button type={type} title={title} disabled={disabled} onClick={onClick}
      className={cx("group/btn relative inline-flex select-none items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-[10px] font-medium transition duration-200 active:scale-[.97] disabled:pointer-events-none disabled:opacity-45 [&_svg]:h-[15px] [&_svg]:w-[15px]",
        small ? "h-7 px-2.5 text-xs [&_svg]:!h-3.5 [&_svg]:!w-3.5" : "h-9 px-3.5 text-[13.5px]", v, className)}>
      {variant === "brand" && <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 transition-all duration-700 ease-out group-hover/btn:left-[120%] group-hover/btn:opacity-100" />}
      {children}
    </button>
  );
}

export function IconButton({ children, onClick, title, disabled, className }: { children: ReactNode; onClick?: () => void; title: string; disabled?: boolean; className?: string }) {
  return (
    <button onClick={onClick} title={title} aria-label={title} disabled={disabled}
      className={cx("inline-flex h-7 w-7 items-center justify-center rounded-lg text-subtle transition hover:bg-raised hover:text-fg disabled:pointer-events-none disabled:opacity-35 [&_svg]:h-[15px] [&_svg]:w-[15px]", className)}>
      {children}
    </button>
  );
}

export function Segmented<T extends string>({ options, value, onChange, small, className }: {
  options: { value: T; label: ReactNode; icon?: ReactNode }[]; value: T; onChange: (v: T) => void; small?: boolean; className?: string;
}) {
  // the white "thumb" slides between options instead of jumping
  const box = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);
  useLayoutEffect(() => {
    const measure = () => {
      const el = [...(box.current?.querySelectorAll<HTMLElement>("[data-seg]") ?? [])].find((b) => b.dataset.seg === value);
      if (el) setThumb({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [value, options.length]);
  return (
    <div ref={box} className={cx("relative inline-flex max-w-full overflow-x-auto rounded-[10px] bg-raised p-0.5 scroll-none", className)}>
      {thumb && <span aria-hidden className="absolute bottom-0.5 top-0.5 rounded-lg bg-surface shadow-soft ring-1 ring-line/70 transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
        style={{ left: thumb.left, width: thumb.width }} />}
      {options.map((o) => (
        <button key={o.value} data-seg={o.value} onClick={() => onChange(o.value)}
          className={cx("relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors duration-200 [&_svg]:h-3.5 [&_svg]:w-3.5",
            small ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-[13px]",
            value === o.value ? "text-fg" : "text-muted hover:text-fg", !thumb && value === o.value && "bg-surface shadow-soft")}>
          {o.icon}{o.label}
        </button>
      ))}
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode }) {
  return (
    <label className="inline-flex cursor-pointer select-none items-center gap-2 text-[13px] text-muted">
      <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={cx("relative h-5 w-9 rounded-full transition-colors duration-300", checked ? "bg-accent" : "bg-line")}>
        <span className={cx("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]", checked ? "left-[18px]" : "left-0.5")} />
      </button>
      {label}
    </label>
  );
}

/** `value`, but starting from 0 on mount so bars and rings fill in instead of appearing. */
function useFillIn(value: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setV(value)));
    return () => cancelAnimationFrame(r);
  }, [value]);
  return v;
}

export function ProgressBar({ value, className, active }: { value: number; className?: string; active?: boolean }) {
  const shown = useFillIn(value);
  return (
    <div className={cx("h-1.5 w-full overflow-hidden rounded-full bg-raised", className)}>
      <div className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-teal-300 via-cyan-400 to-sky-400 transition-all duration-1000 ease-[cubic-bezier(.2,.7,.2,1)]"
        style={{ width: `${shown ? Math.max(2, Math.min(100, shown * 100)) : 0}%` }}>
        {active && <div className="shimmer absolute inset-0 animate-shimmer" />}
      </div>
    </div>
  );
}

/** Circular progress / gauge. */
export function Ring({ value, size = 96, stroke = 8, children, gradient = ["#5eead4", "#38bdf8"], track = "stroke-raised" }: {
  value: number; size?: number; stroke?: number; children?: ReactNode; gradient?: [string, string]; track?: string;
}) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const id = useRef(`g${Math.random().toString(36).slice(2, 8)}`).current;
  const shown = useFillIn(value);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={gradient[0]} /><stop offset="1" stopColor={gradient[1]} /></linearGradient></defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={track} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke={`url(#${id})`} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(0, Math.min(1, shown)))} style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.7,.2,1)" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-2xs text-subtle">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full h-9 rounded-[10px] border-0 bg-surface px-3 text-[13.5px] text-fg shadow-soft ring-1 ring-inset ring-line placeholder:text-subtle transition duration-200 hover:ring-subtle/40 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:shadow-[0_0_0_4px_rgb(45_212_191/.12)] dark:bg-raised/60";

export function SearchInput({ value, onChange, placeholder, className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={cx("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
      <input className={cx(inputCls, "pl-9")} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {value && <button onClick={() => onChange("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-subtle hover:text-fg" aria-label="clear"><X className="h-3.5 w-3.5" /></button>}
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-md border border-line bg-surface px-1 font-mono text-[10.5px] font-medium text-subtle">{children}</kbd>;
}

export function Callout({ tone = "info", title, children, className }: { tone?: "info" | "success" | "warn" | "error"; title?: ReactNode; children?: ReactNode; className?: string }) {
  const t = {
    info: { cls: "border-sky-500/25 bg-sky-500/[.06] text-sky-900 dark:text-sky-200", icon: <Info /> },
    success: { cls: "border-emerald-500/25 bg-emerald-500/[.06] text-emerald-900 dark:text-emerald-200", icon: <CheckCircle2 /> },
    warn: { cls: "border-amber-500/30 bg-amber-500/[.07] text-amber-900 dark:text-amber-200", icon: <AlertTriangle /> },
    error: { cls: "border-rose-500/30 bg-rose-500/[.06] text-rose-900 dark:text-rose-200", icon: <XCircle /> },
  }[tone];
  return (
    <div className={cx("flex gap-2.5 rounded-xl border px-3.5 py-3 text-[13px] [&>svg]:mt-px [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0", t.cls, className)}>
      {t.icon}
      <div className="min-w-0 flex-1">
        {title && <div className="font-semibold">{title}</div>}
        {children && <div className={cx(!!title && "mt-0.5", "opacity-90")}>{children}</div>}
      </div>
    </div>
  );
}

export function Empty({ title, children, mood = "sleepy" }: { title: string; children?: ReactNode; mood?: "happy" | "sleepy" | "sad" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="relative">
        <div className="absolute inset-0 -z-0 scale-150 rounded-full bg-accent/10 blur-2xl" />
        <div className="animate-float"><Mascot size={60} mood={mood} /></div>
        {[["-6px", "-10px", 0], ["8px", "64px", 1.2], ["44px", "-16px", 2.1]].map(([t, l, d]) => (
          <span key={`${t}${l}`} aria-hidden className="absolute animate-twinkle text-[9px] text-accent" style={{ top: t as string, left: l as string, animationDelay: `${d}s` }}>✦</span>
        ))}
      </div>
      <div className="text-sm font-semibold text-fg">{title}</div>
      {children && <div className="max-w-md text-[13px] text-muted">{children}</div>}
    </div>
  );
}

export function Modal({ children, onClose, className }: { children: ReactNode; onClose: () => void; className?: string }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink-950/25 p-4 pt-[12vh] backdrop-blur-[6px] animate-fade dark:bg-black/50" onClick={onClose}>
      <div className={cx("w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface shadow-lift animate-pop", className)} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/** "Labby": a little flask with eyes. Moods change the face. */
export function Mascot({ size = 36, mood = "happy" }: { size?: number; mood?: "happy" | "busy" | "sleepy" | "sad" }) {
  const id = useRef(`m${Math.random().toString(36).slice(2, 8)}`).current;
  const delay = useRef(`${-Math.random() * 5}s`).current; // several Labbys never blink in sync
  const ink = "#134e4a";
  const eyes = mood === "sleepy"
    ? <><path d="M24 39q3 2 6 0" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M34 39q3 2 6 0" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" /></>
    : <g className="blink" style={{ animationDelay: delay }}><circle cx="27" cy="39" r="2.6" fill={ink} /><circle cx="37" cy="39" r="2.6" fill={ink} /><circle cx="27.8" cy="38.2" r=".8" fill="#fff" /><circle cx="37.8" cy="38.2" r=".8" fill="#fff" /></g>;
  const mouth = mood === "sad" ? <path d="M29 47q3-2.5 6 0" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
    : mood === "busy" ? <ellipse cx="32" cy="46" rx="2" ry="1.6" fill={ink} />
    : <path d="M29 45q3 3 6 0" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={cx("relative shrink-0", mood === "busy" && "animate-bob")} aria-hidden>
      <defs>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a5f3fc" /><stop offset="1" stopColor="#2dd4bf" /></linearGradient>
      </defs>
      <path d="M25 8h14v4h-2v12l13 20a7 7 0 0 1-5.9 10.8H19.9A7 7 0 0 1 14 44l13-20V12h-2z" fill="#f0fdfa" stroke="#0d9488" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M18.6 40h26.8l3.2 5a4.5 4.5 0 0 1-3.8 7H19.2a4.5 4.5 0 0 1-3.8-7z" fill={`url(#${id}l)`} opacity=".95" />
      {eyes}
      {mouth}
      <circle cx="22" cy="44" r="1.8" fill="#fda4af" opacity=".8" /><circle cx="42" cy="44" r="1.8" fill="#fda4af" opacity=".8" />
      <circle cx="44" cy="20" r="2.2" fill="#5eead4" className="animate-float" /><circle cx="48" cy="13" r="1.4" fill="#7dd3fc" className="animate-float" style={{ animationDelay: "-1.4s" }} />
    </svg>
  );
}

export function Tag({ children, onRemove }: { children: ReactNode; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-0.5 whitespace-nowrap rounded-md bg-accent/10 px-1.5 py-px text-[11px] font-medium text-accent">
      <span className="opacity-60">#</span>{children}
      {onRemove && <button onClick={onRemove} className="ml-0.5 opacity-60 hover:opacity-100" aria-label="remove tag"><X className="h-3 w-3" /></button>}
    </span>
  );
}

/** Gold / silver / bronze rank badge; plain number beyond the podium. */
export function Medal({ rank }: { rank: number | null }) {
  if (rank === null) return <span className="inline-flex w-6 justify-center text-xs text-subtle">–</span>;
  const g = [
    "from-amber-300 to-yellow-500 text-amber-950 shadow-[0_0_0_3px_rgb(251_191_36/.18)]",
    "from-slate-200 to-slate-400 text-slate-800 shadow-[0_0_0_3px_rgb(148_163_184/.18)]",
    "from-orange-300 to-amber-700 text-orange-950 shadow-[0_0_0_3px_rgb(217_119_6/.16)]",
  ][rank - 1];
  if (!g) return <span className="inline-flex w-6 justify-center font-mono text-xs tabular-nums text-subtle">{rank}</span>;
  return <span className={cx("inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br font-mono text-[11px] font-bold", g)}>{rank}</span>;
}

export function Toast({ msg, kind = "info", onClose }: { msg: string | null; kind?: "info" | "error"; onClose: () => void }) {
  useEffect(() => {
    if (!msg) return;
    const t = window.setTimeout(onClose, 5000);
    return () => window.clearTimeout(t);
  }, [msg, onClose]);
  if (!msg) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      <div className={cx("pointer-events-auto flex max-w-md items-center gap-2.5 rounded-full py-2 pl-3 pr-2 text-[13px] font-medium shadow-lift animate-pop",
        kind === "error" ? "bg-rose-600 text-white" : "bg-fg text-canvas ring-1 ring-white/10")}>
        {kind === "error" ? <XCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-300 dark:text-teal-600" />}
        <span className="min-w-0">{msg}</span>
        <button onClick={onClose} className="rounded-full p-1 opacity-60 hover:opacity-100" aria-label="dismiss"><X className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}

/** Live log viewer over server-sent events, in a terminal frame. `tabs` render in the title bar. */
export function LogView({ runId, stage, height = "h-80", tabs, live }: { runId: string; stage: string | null; height?: string; tabs?: ReactNode; live?: boolean }) {
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
    <div className="overflow-hidden rounded-xl bg-code ring-1 ring-black/5 dark:ring-white/[.07]">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[.06] px-3 py-2">
        <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" /></div>
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto scroll-none">{tabs}</div>
        {live && <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400"><LiveDot color="bg-emerald-400" /> live</span>}
      </div>
      <div className="relative">
        <pre ref={box} onScroll={(e) => {
          const el = e.currentTarget;
          setFollow(el.scrollHeight - el.scrollTop - el.clientHeight < 40);
        }} className={cx(height, "scroll-thin overflow-auto px-0 py-3 font-mono text-[11.5px] leading-[1.7] text-zinc-300")}>
          {lines.length ? lines.map((l, i) => (
            <div key={i} className={cx("flex gap-4 px-3 hover:bg-white/[.03]",
              /\b(error|traceback|exception|failed)\b/i.test(l) && "bg-rose-500/[.07] text-rose-300",
              /\[modellab|\[runner/.test(l) && "text-sky-300",
              /Average Precision|mAP/.test(l) && "text-emerald-300")}>
              <span className="w-7 shrink-0 select-none text-right text-zinc-600">{i + 1}</span>
              <span className="whitespace-pre">{l}</span>
            </div>
          )) : <div className="flex items-center gap-2 px-4 text-zinc-500"><Loader2 className="h-3.5 w-3.5 animate-spin" /> waiting for log lines…</div>}
        </pre>
        {!follow && <button onClick={() => setFollow(true)} className="absolute bottom-3 right-4 rounded-full bg-teal-600 px-2.5 py-1 text-xs font-medium text-white shadow-lg">follow ↓</button>}
      </div>
    </div>
  );
}

export function TermTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className={cx("whitespace-nowrap rounded-md px-2 py-0.5 font-mono text-[11px] transition",
      active ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-200")}>{children}</button>
  );
}

/** Tiny YAML highlighter for the preview / run recipe (keys, strings, numbers, refs, comments). */
export function Yaml({ text, className }: { text: string; className?: string }) {
  const lines = text.replace(/\n$/, "").split("\n");
  const val = (s: string) => {
    if (/^\s*#/.test(s)) return <span className="text-zinc-500">{s}</span>;
    if (/^\s*-?\s*\d+(\.\d+)?(e-?\d+)?\s*$/.test(s)) return <span className="text-amber-300">{s}</span>;
    if (/^\s*(true|false|null)\s*$/.test(s)) return <span className="text-sky-300">{s}</span>;
    if (/^\s*[[{]/.test(s)) return <span className="text-zinc-300">{s.split(/(\b\d+\b|from)/).map((p, i) => <span key={i} className={/^\d+$/.test(p) ? "text-amber-300" : p === "from" ? "text-orange-300" : undefined}>{p}</span>)}</span>;
    return <span className="text-emerald-300">{s}</span>;
  };
  return (
    <pre className={cx("scroll-thin overflow-auto rounded-xl bg-code py-3 font-mono text-[11.5px] leading-[1.7] ring-1 ring-black/5 dark:ring-white/[.07]", className)}>
      {lines.map((l, i) => {
        const m = l.match(/^(\s*)(-\s+)?([\w.-]+)(:)(.*)$/);
        return (
          <div key={i} className="flex gap-4 px-3">
            <span className="w-5 shrink-0 select-none text-right text-zinc-600">{i + 1}</span>
            <span className="whitespace-pre">
              {m ? <>{m[1]}{m[2] && <span className="text-zinc-500">{m[2]}</span>}<span className="text-sky-300">{m[3]}</span><span className="text-zinc-500">{m[4]}</span>{m[5] && val(m[5])}</>
                : /^\s*-\s/.test(l) ? <><span className="text-zinc-500">{l.match(/^\s*-\s/)![0]}</span>{val(l.replace(/^\s*-\s/, ""))}</> : val(l)}
            </span>
          </div>
        );
      })}
    </pre>
  );
}
