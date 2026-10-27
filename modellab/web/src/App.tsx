import { useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { api } from "./api";
import { cx, Mascot, usePoll } from "./ui";
import NewExperiment from "./pages/NewExperiment";
import Queue from "./pages/Queue";
import Leaderboard from "./pages/Leaderboard";
import Compare from "./pages/Compare";
import RunDetail from "./pages/RunDetail";

const NAV = [
  { to: "/", label: "New experiment", icon: "✦" },
  { to: "/queue", label: "Queue", icon: "◷" },
  { to: "/leaderboard", label: "Leaderboard", icon: "▲" },
  { to: "/compare", label: "Compare", icon: "⇆" },
];

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  const toggle = () => {
    const d = !dark;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    try { localStorage.setItem("modellab-theme", d ? "dark" : "light"); } catch { /* private mode */ }
  };
  return (
    <button onClick={toggle} title="Toggle light / dark"
      className="rounded-xl p-2 text-ink-500 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800">
      {dark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
      )}
    </button>
  );
}

function WorkerBadge() {
  const { data } = usePoll(api.queue, 4000);
  const running = data?.runs.find((r) => r.status === "running");
  const waiting = data?.runs.filter((r) => r.status === "queued").length ?? 0;
  const alive = data?.worker.alive;
  return (
    <NavLink to="/queue" className="hidden items-center gap-2 rounded-xl px-3 py-1.5 text-xs text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800 md:flex">
      <span className={cx("h-2 w-2 rounded-full", alive ? (running ? "bg-violet-500 animate-pulse" : "bg-emerald-500") : "bg-ink-300")} />
      {!data ? "…" : !alive ? "worker offline" : running ? `busy · ${Math.round(running.progress * 100)}%` : "idle"}
      {waiting > 0 && <span className="rounded-md bg-sky-100 px-1.5 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">+{waiting} waiting</span>}
    </NavLink>
  );
}

export default function App() {
  const q = usePoll(api.queue, 5000);
  const busy = q.data?.runs.some((r) => r.status === "running");
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-white/80 backdrop-blur dark:border-ink-800 dark:bg-ink-950/80">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-2.5 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2">
            <Mascot size={34} mood={busy ? "busy" : "happy"} />
            <div className="leading-tight">
              <div className="text-[15px] font-bold tracking-tight text-ink-900 dark:text-white">Model<span className="text-violet-600 dark:text-violet-400">Lab</span></div>
              <div className="text-[10.5px] text-ink-400">fine-tune · distill · benchmark</div>
            </div>
          </NavLink>
          <nav className="ml-2 flex flex-1 items-center gap-1 overflow-x-auto scroll-thin">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === "/"}
                className={({ isActive }) => cx("whitespace-nowrap rounded-xl px-3 py-1.5 text-sm font-medium transition",
                  isActive ? "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" : "text-ink-500 hover:bg-ink-100 hover:text-ink-800 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100")}>
                <span className="mr-1.5 opacity-70">{n.icon}</span>{n.label}
              </NavLink>
            ))}
          </nav>
          <WorkerBadge />
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <Routes>
          <Route path="/" element={<NewExperiment />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/runs/:id" element={<RunDetail />} />
        </Routes>
      </main>
    </div>
  );
}
