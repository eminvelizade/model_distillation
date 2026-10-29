import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { Command, FlaskConical, GitCompareArrows, ListOrdered, Moon, Search, Sun, Trophy } from "lucide-react";
import { api } from "./api";
import { cx, Kbd, LiveDot, Mascot, usePoll, useTheme } from "./ui";
import CommandPalette from "./components/CommandPalette";
import NewExperiment from "./pages/NewExperiment";
import Queue from "./pages/Queue";
import Leaderboard from "./pages/Leaderboard";
import Compare from "./pages/Compare";
import RunDetail from "./pages/RunDetail";

export const NAV = [
  { group: "Build", to: "/", label: "New experiment", icon: FlaskConical },
  { group: "Run", to: "/queue", label: "Queue", icon: ListOrdered },
  { group: "Analyze", to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { group: "Analyze", to: "/compare", label: "Compare", icon: GitCompareArrows },
];

function ThemeSwitch() {
  const { dark, set } = useTheme();
  return (
    <div className="flex rounded-lg bg-raised p-0.5">
      {[false, true].map((d) => (
        <button key={String(d)} onClick={() => set(d)} title={d ? "Dark" : "Light"} aria-label={d ? "Dark theme" : "Light theme"}
          className={cx("flex h-6 w-7 items-center justify-center rounded-md transition", dark === d ? "bg-surface text-fg shadow-soft" : "text-subtle hover:text-fg")}>
          {d ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </button>
      ))}
    </div>
  );
}

type QueueData = Awaited<ReturnType<typeof api.queue>>;

function WorkerWidget({ q }: { q: QueueData | null }) {
  const gpu = usePoll(api.gpu, 5000);
  const running = q?.runs.find((r) => r.status === "running");
  const waiting = q?.runs.filter((r) => r.status === "queued").length ?? 0;
  const alive = q?.worker.alive;
  const g = gpu.data?.available ? gpu.data.gpus[0] : null;
  return (
    <NavLink to="/queue" className="group block rounded-xl border border-line bg-surface p-3 shadow-soft transition hover:shadow-lift">
      <div className="flex items-center gap-2.5">
        <Mascot size={30} mood={!q ? "happy" : !alive ? "sleepy" : running ? "busy" : "happy"} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-fg">
            {alive ? (running ? <LiveDot /> : <span className="h-2 w-2 rounded-full bg-emerald-500" />) : <span className="h-2 w-2 rounded-full bg-subtle" />}
            {!q ? "Connecting…" : !alive ? "Worker offline" : running ? "Training" : "Idle"}
          </div>
          <div className="truncate text-2xs text-subtle">{running ? running.name : waiting ? `${waiting} waiting` : alive ? "ready for work" : "start it from Queue"}</div>
        </div>
        {running && <span className="font-mono text-xs font-medium tabular-nums text-accent">{Math.round(running.progress * 100)}%</span>}
      </div>
      {running && (
        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-raised">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-400 transition-all duration-700" style={{ width: `${running.progress * 100}%` }} />
        </div>
      )}
      {g && (
        <div className="mt-2.5 grid grid-cols-2 gap-2 border-t border-line pt-2.5 text-2xs text-subtle">
          <div><div>GPU</div><div className="font-mono text-[11.5px] font-medium tabular-nums text-fg">{Math.round(g.util)}%</div></div>
          <div><div>VRAM</div><div className="font-mono text-[11.5px] font-medium tabular-nums text-fg">{(g.mem_used_mb / 1024).toFixed(1)}<span className="text-subtle">/{(g.mem_total_mb / 1024).toFixed(0)} GB</span></div></div>
        </div>
      )}
    </NavLink>
  );
}

function NavItem({ to, label, icon: Icon, badge }: { to: string; label: string; icon: typeof Trophy; badge?: React.ReactNode }) {
  return (
    <NavLink to={to} end={to === "/"}
      className={({ isActive }) => cx("group relative flex h-8 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] font-medium transition",
        isActive ? "bg-raised text-fg" : "text-muted hover:bg-raised/60 hover:text-fg")}>
      {({ isActive }) => <>
        {isActive && <span className="absolute -left-3 top-1.5 h-5 w-[3px] rounded-r-full bg-accent" />}
        <Icon className={cx("h-4 w-4", isActive ? "text-accent" : "text-subtle group-hover:text-muted")} />
        <span className="flex-1">{label}</span>
        {badge}
      </>}
    </NavLink>
  );
}

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-400 shadow-glow">
        <FlaskConical className="h-4 w-4 text-white" strokeWidth={2.4} />
      </span>
      <div className="leading-tight">
        <div className="text-[15px] font-semibold tracking-tight text-fg">ModelLab</div>
        <div className="text-2xs text-subtle">fine-tune · distill · benchmark</div>
      </div>
    </NavLink>
  );
}

export default function App() {
  const q = usePoll(api.queue, 4000);
  const [palette, setPalette] = useState(false);
  const loc = useLocation();
  const waiting = q.data?.runs.filter((r) => r.status === "queued").length ?? 0;
  const busy = q.data?.runs.some((r) => r.status === "running");

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((p) => !p); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const badge = (to: string) => to === "/queue" && (busy || waiting > 0) ? (
    <span className="flex items-center gap-1.5">
      {busy && <LiveDot />}
      {waiting > 0 && <span className="rounded-md bg-raised px-1.5 font-mono text-[10.5px] tabular-nums text-muted ring-1 ring-inset ring-line">{waiting}</span>}
    </span>
  ) : undefined;
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <div className="min-h-screen lg:pl-[248px]">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-line bg-canvas lg:flex">
        <div className="px-5 pb-4 pt-5"><Logo /></div>
        <div className="px-3">
          <button onClick={() => setPalette(true)}
            className="flex h-8 w-full items-center gap-2 rounded-lg bg-surface px-2.5 text-[13px] text-subtle shadow-soft ring-1 ring-inset ring-line transition hover:text-muted">
            <Search className="h-3.5 w-3.5" /> <span className="flex-1 text-left">Search…</span>
            <span className="flex gap-0.5"><Kbd>{isMac ? <Command className="h-2.5 w-2.5" /> : "Ctrl"}</Kbd><Kbd>K</Kbd></span>
          </button>
        </div>
        <nav className="mt-4 flex-1 space-y-5 overflow-y-auto px-3">
          {[...new Set(NAV.map((n) => n.group))].map((g) => (
            <div key={g}>
              <div className="mb-1 px-2.5 text-[11px] font-medium uppercase tracking-wider text-subtle/80">{g}</div>
              <div className="space-y-0.5">{NAV.filter((n) => n.group === g).map((n) => <NavItem key={n.to} {...n} badge={badge(n.to)} />)}</div>
            </div>
          ))}
        </nav>
        <div className="space-y-3 p-3">
          <WorkerWidget q={q.data} />
          <div className="flex items-center justify-between px-1">
            <span className="text-2xs text-subtle">local · offline</span>
            <ThemeSwitch />
          </div>
        </div>
      </aside>

      {/* mobile / tablet top bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3 px-4 pt-3">
          <Logo />
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setPalette(true)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted ring-1 ring-inset ring-line" aria-label="Search"><Search className="h-4 w-4" /></button>
            <ThemeSwitch />
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 py-2 scroll-none">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"}
              className={({ isActive }) => cx("flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium",
                isActive ? "bg-raised text-fg" : "text-muted")}>
              <Icon className="h-3.5 w-3.5" />{label}{badge(to)}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="relative isolate min-w-0">
        <div className="aurora pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]" />
        <div key={loc.pathname} className="mx-auto max-w-[1320px] px-4 py-6 animate-enter sm:px-8 lg:py-10">
          <Routes>
            <Route path="/" element={<NewExperiment />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/runs/:id" element={<RunDetail />} />
          </Routes>
        </div>
      </main>
      {palette && <CommandPalette onClose={() => setPalette(false)} />}
    </div>
  );
}
