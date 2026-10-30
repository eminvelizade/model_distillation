import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { api, Machine, Me, onUnauthorized, setMachine } from "./api";

/** Who is logged in (hub) or "local" (the single-user app), the user's machines and the one the UI works with. */
interface Session {
  me: Me | null; // null while loading
  ready: boolean; // me known and, on the hub, the machine list loaded once
  needsLogin: boolean;
  hub: boolean;
  machines: Machine[];
  machineId: string | null;
  machine: Machine | null;
  setMachineId: (id: string) => void;
  refreshMachines: () => Promise<void>;
  reload: () => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<Session | null>(null);
const KEY = "modellab-machine";

const remember = (id: string | null) => {
  setMachine(id);
  try { if (id) localStorage.setItem(KEY, id); } catch { /* private window */ }
};

export function SessionProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [machineId, setId] = useState<string | null>(null);
  const hub = me?.mode === "hub";

  const setMachineId = useCallback((id: string) => { remember(id); setId(id); }, []);

  const reload = useCallback(async () => {
    try {
      const m = await api.me();
      if (m.mode === "local") setMachine(null);
      setMe(m);
      setNeedsLogin(m.mode === "hub" && !m.user);
    } catch {
      setMe({ mode: "hub", user: null });
      setNeedsLogin(true);
    }
  }, []);

  // Fetch the machines and settle on a valid one in the same update, so pages never call the API with a stale id.
  const refreshMachines = useCallback(async () => {
    let list: Machine[];
    try { list = await api.machines(); } catch { return; }
    let saved: string | null = null;
    try { saved = localStorage.getItem(KEY); } catch { /* private window */ }
    setMachines(list);
    setId((prev) => {
      const want = prev ?? saved;
      const ok = want && list.some((m) => m.id === want) ? want : (list.find((m) => m.online) ?? list[0])?.id ?? null;
      remember(ok);
      return ok;
    });
    setLoaded(true);
  }, []);

  useEffect(() => { reload(); }, [reload]);
  useEffect(() => onUnauthorized(() => setNeedsLogin(true)), []);
  useEffect(() => {
    if (!hub || needsLogin) return;
    refreshMachines();
    const t = window.setInterval(refreshMachines, 5000);
    return () => window.clearInterval(t);
  }, [hub, needsLogin, refreshMachines]);

  const logout = useCallback(async () => {
    try { await api.logout(); } finally { setMachines([]); setLoaded(false); setNeedsLogin(true); }
  }, []);

  const machine = machines.find((m) => m.id === machineId) ?? null;
  const ready = !!me && (me.mode === "local" || (!needsLogin && loaded));
  return (
    <Ctx.Provider value={{ me, ready, needsLogin, hub, machines, machineId: hub ? machineId : null, machine, setMachineId, refreshMachines, reload, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSession(): Session {
  const s = useContext(Ctx);
  if (!s) throw new Error("useSession outside SessionProvider");
  return s;
}
