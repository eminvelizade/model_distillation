import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import { Command, KeyRound, Loader2, LogOut, Moon, Search, Sun, Trophy } from "lucide-react";
import { api } from "./api";
import { Beta, cx, Kbd, LiveDot, Mascot, usePoll, useTheme } from "./ui";
import { SessionProvider, useSession } from "./session";
import { NAV, useNav } from "./nav";
import CommandPalette from "./components/CommandPalette";
import { ChangePassword, MachinePicker, machineState } from "./components/Hub";
import NewExperiment from "./pages/NewExperiment";
import Queue from "./pages/Queue";
import Leaderboard from "./pages/Leaderboard";
import Compare from "./pages/Compare";
import RunDetail from "./pages/RunDetail";
import Login from "./pages/Login";
import Machines from "./pages/Machines";
import MachineDetail from "./pages/MachineDetail";
import Team from "./pages/Team";

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

/** Local: the worker on this PC. Hub: the machine picked above (its agent, live GPU). */
function WorkerWidget({ q }: { q: QueueData | null }) {
  const { hub, machine, machines } = useSession();
  const gpu = usePoll(api.gpu, 5000, [machine?.id]);
  const running = q?.runs.find((r) => r.status === "running");
  const waiting = q?.runs.filter((r) => r.status === "queued").length ?? 0;
  const alive = q?.worker.alive;
  const g = gpu.data?.available ? gpu.data.gpus[0] : null;
  const title = hub ? (!machines.length ? "No machine yet" : !machine ? "…" : !machine.online ? "Machine offline" : running ? "Training" : machineState(machine) === "idle" ? "Idle" : machineState(machine))
    : !q ? "Connecting…" : !alive ? "Worker offline" : running ? "Training" : "Idle";
  const sub = hub ? (!machines.length ? "add one under Machines" : running ? running.name : waiting ? `${waiting} waiting` : machine?.online ? "ready for work" : "is the PC on?")
    : running ? running.name : waiting ? `${waiting} waiting` : alive ? "ready for work" : "start it from Queue";
  const online = hub ? !!machine?.online : !!alive;
  return (
    <NavLink to={hub && !machines.length ? "/machines" : "/queue"} className="group block rounded-xl border border-line bg-surface p-3 shadow-soft transition hover:shadow-lift">
      <div className="flex items-center gap-2.5">
        <Mascot size={30} mood={!online ? "sleepy" : running ? "busy" : "happy"} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-fg">
            {online ? (running ? <LiveDot /> : <span className="h-2 w-2 rounded-full bg-emerald-500" />) : <span className="h-2 w-2 rounded-full bg-subtle" />}
            {title}
          </div>
          <div className="truncate text-2xs text-subtle">{sub}</div>
        </div>
        {running && <span className="font-mono text-xs font-medium tabular-nums text-muted">{Math.round(running.progress * 100)}%</span>}
      </div>
      {running && (
        <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-raised">
          <div className="h-full rounded-full bg-gradient-to-r from-ice-600 via-ice-400 to-ice-300 transition-all duration-700" style={{ width: `${running.progress * 100}%` }} />
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
        isActive ? "bg-accent/[.09] text-fg" : "text-muted hover:bg-raised/70 hover:text-fg")}>
      {({ isActive }) => <>
        {isActive && <span className="absolute -left-3 top-1.5 h-5 w-[3px] animate-growy rounded-r-full bg-accent" />}
        <Icon className={cx("h-4 w-4 transition-transform duration-300 group-hover:scale-110", isActive ? "text-accent" : "text-subtle group-hover:text-muted")} />
        <span className="flex-1">{label}</span>
        {badge}
      </>}
    </NavLink>
  );
}

function Logo() {
  return (
    <NavLink to="/" className="group flex items-center gap-2.5">
      <span className="relative flex h-8 w-8 items-center justify-center">
        <span className="text-[26px] leading-none transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-rotate-12" role="img" aria-label="test tube">🧪</span>
        {/* tiny bubbles drifting up out of the tube */}
        <span aria-hidden className="absolute right-0.5 top-0 h-[5px] w-[5px] animate-rise rounded-full bg-ice-300/90" />
        <span aria-hidden className="absolute right-2 top-0.5 h-[3px] w-[3px] animate-rise rounded-full bg-ice-frost/90" style={{ animationDelay: "1.7s" }} />
      </span>
      <div className="leading-tight">
        <div className="text-[15px] font-semibold tracking-tight text-fg">ModelLab</div>
        <div className="text-2xs text-subtle">fine-tune · distill · benchmark</div>
        <Beta className="mt-1" />
      </div>
    </NavLink>
  );
}

/** Sidebar footer: "local · offline" on the single-user app, the signed-in user on the hub. */
function Account({ onPassword }: { onPassword: () => void }) {
  const { hub, me, logout } = useSession();
  if (!hub || !me?.user) return <span className="text-2xs text-subtle">local · offline</span>;
  const u = me.user;
  return (
    <div className="flex min-w-0 items-center gap-1">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-semibold uppercase text-accent">{u.display_name.slice(0, 1)}</span>
      <span className="min-w-0 truncate text-xs font-medium text-muted" title={u.username}>{u.display_name}</span>
      <button onClick={onPassword} className="rounded p-1 text-subtle hover:text-fg" title="Change password" aria-label="Change password"><KeyRound className="h-3.5 w-3.5" /></button>
      <button onClick={logout} className="rounded p-1 text-subtle hover:text-fg" title="Sign out" aria-label="Sign out"><LogOut className="h-3.5 w-3.5" /></button>
    </div>
  );
}

function Shell() {
  const { hub, me, machineId } = useSession();
  const q = usePoll(api.queue, 4000, [machineId]);
  const [palette, setPalette] = useState(false);
  const [password, setPassword] = useState(false);
  const loc = useLocation();
  const nav = useNav();
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

  useEffect(() => {
    const page = loc.pathname.startsWith("/runs/") ? "Run" : loc.pathname.startsWith("/machines/") ? "Machine" : NAV.find((n) => n.to === loc.pathname)?.label;
    document.title = page ? `${page} · ModelLab` : "ModelLab";
  }, [loc.pathname]);

  return (
    <div className="min-h-screen lg:pl-[248px]">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col border-r border-line bg-canvas lg:flex">
        <div className="px-5 pb-4 pt-5"><Logo /></div>
        <div className="space-y-2 px-3">
          <button onClick={() => setPalette(true)}
            className="flex h-8 w-full items-center gap-2 rounded-lg bg-surface px-2.5 text-[13px] text-subtle shadow-soft ring-1 ring-inset ring-line transition hover:text-muted">
            <Search className="h-3.5 w-3.5" /> <span className="flex-1 text-left">Search…</span>
            <span className="flex gap-0.5"><Kbd>{isMac ? <Command className="h-2.5 w-2.5" /> : "Ctrl"}</Kbd><Kbd>K</Kbd></span>
          </button>
          {hub && <MachinePicker />}
        </div>
        <nav className="mt-4 flex-1 space-y-5 overflow-y-auto px-3">
          {[...new Set(nav.map((n) => n.group))].map((g) => (
            <div key={g}>
              <div className="mb-1 px-2.5 text-[11px] font-medium uppercase tracking-wider text-subtle/80">{g}</div>
              <div className="space-y-0.5">{nav.filter((n) => n.group === g).map((n) => <NavItem key={n.to} {...n} badge={badge(n.to)} />)}</div>
            </div>
          ))}
        </nav>
        <div className="space-y-3 p-3">
          <WorkerWidget q={q.data} />
          <div className="flex items-center justify-between gap-2 px-1">
            <Account onPassword={() => setPassword(true)} />
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
        {hub && <div className="flex items-center gap-2 px-4 pt-2.5"><MachinePicker className="min-w-0 flex-1" /><Account onPassword={() => setPassword(true)} /></div>}
        <nav className="flex gap-1 overflow-x-auto px-3 py-2 scroll-none">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"}
              className={({ isActive }) => cx("flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium",
                isActive ? "bg-accent/[.09] text-fg" : "text-muted")}>
              <Icon className="h-3.5 w-3.5" />{label}{badge(to)}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="relative isolate min-w-0 overflow-x-clip">
        <div className="aurora pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px]" />
        <div key={loc.pathname} className="page mx-auto max-w-[1320px] px-4 py-6 sm:px-8 lg:py-10">
          <Routes>
            <Route path="/" element={<NewExperiment />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/runs/:id" element={<RunDetail />} />
            {hub && <Route path="/machines" element={<Machines />} />}
            {hub && <Route path="/machines/:id" element={<MachineDetail />} />}
            {hub && me?.user?.is_admin && <Route path="/team" element={<Team />} />}
          </Routes>
        </div>
      </main>
      {palette && <CommandPalette onClose={() => setPalette(false)} />}
      {(password || me?.user?.must_change_password) && <ChangePassword forced={!!me?.user?.must_change_password} onClose={() => setPassword(false)} />}
    </div>
  );
}

function Gate() {
  const { ready, needsLogin, reload } = useSession();
  if (needsLogin) return <Login onDone={reload} />;
  if (!ready) return <div className="flex min-h-screen items-center justify-center gap-2 text-sm text-subtle"><Loader2 className="h-4 w-4 animate-spin" />opening the lab…</div>;
  return <Shell />;
}

export default function App() {
  return <SessionProvider><Gate /></SessionProvider>;
}
