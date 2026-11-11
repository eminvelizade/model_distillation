import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CornerDownLeft, Moon, Search, Server, Zap } from "lucide-react";
import { api, fmt, RunSummary } from "../api";
import { cx, Kbd, Modal, StatusPill, useTheme } from "../ui";
import { useNav } from "../nav";
import { useSession } from "../session";

type Item = { id: string; group: string; label: string; hint?: React.ReactNode; icon: React.ReactNode; run: () => void };

let titles: Record<string, string> | null = null; // the action registry's titles, fetched once (hub only)

/** The actions on the page right now: every button that declares one (data-yeti). Running an entry presses that
 *  button, so ⌘K can do exactly what the page can, with the page's own confirmations. */
function pageActions(): { id: string; el: HTMLButtonElement }[] {
  const seen = new Set<string>();
  return [...document.querySelectorAll<HTMLButtonElement>("button[data-yeti]")].filter((el) => {
    const id = el.dataset.yeti!;
    if (el.disabled || seen.has(id)) return false;
    seen.add(id);
    return true;
  }).map((el) => ({ id: el.dataset.yeti!, el }));
}

/** ⌘K: jump to any page or run, run an action of the current page, toggle the theme. */
export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [i, setI] = useState(0);
  const nav = useNavigate();
  const theme = useTheme();
  const list = useRef<HTMLDivElement>(null);
  const pages = useNav();
  const { machines, hub } = useSession();
  const [names, setNames] = useState<Record<string, string>>(titles ?? {});
  const actions = useRef(pageActions()).current; // read once, before the palette covers the page
  useEffect(() => { api.runs().then(setRuns).catch(() => undefined); }, []);
  useEffect(() => {
    if (!hub || titles) return;
    api.actions().then((r) => { titles = Object.fromEntries(r.actions.map((a) => [a.id, a.title])); setNames(titles); }).catch(() => undefined);
  }, [hub]);

  const go = (to: string) => () => { nav(to); onClose(); };
  const items: Item[] = useMemo(() => {
    const ic = "h-4 w-4";
    const base: Item[] = [
      ...pages.map((p) => ({ id: `p-${p.to}`, group: "Pages", label: p.label, icon: <p.icon className={ic} />, run: go(p.to) })),
      ...machines.map((m) => ({ id: `m-${m.id}`, group: "Machines", label: m.name, icon: <Server className={ic} />,
        hint: <span className="text-[11px] text-muted">{m.online ? "online" : "offline"}</span>, run: go(`/machines/${m.id}`) })),
      ...actions.map(({ id, el }) => ({ id: `do-${id}`, group: "Actions", label: names[id] ?? el.textContent?.trim() ?? id, icon: <Zap className={ic} />,
        hint: <span className="text-[11px] text-muted">this page</span>, run: () => { onClose(); window.setTimeout(() => el.click(), 0); } })),
      { id: "a-theme", group: "Actions", label: `Switch to ${theme.dark ? "light" : "dark"} theme`, icon: <Moon className={ic} />, run: () => { theme.toggle(); onClose(); } },
      ...runs.map((r) => ({
        id: r.id, group: "Runs", label: r.name, icon: <span className="font-mono text-[10px]">{r.id.slice(-4)}</span>,
        hint: <span className="flex items-center gap-2">{r.best && <span className="font-mono text-[11px] text-muted">mAP {fmt.pct(r.best.map)}</span>}<StatusPill status={r.status} /></span>,
        run: go(`/runs/${r.id}`),
      })),
    ];
    const ql = q.toLowerCase().trim();
    return ql ? base.filter((x) => `${x.label} ${x.group} ${x.id}`.toLowerCase().includes(ql)) : base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, runs, theme.dark, pages, machines, names]);

  useEffect(() => setI(0), [q]);
  useEffect(() => { list.current?.querySelector(`[data-i="${i}"]`)?.scrollIntoView({ block: "nearest" }); }, [i]);

  const groups = [...new Set(items.map((x) => x.group))];
  return (
    <Modal onClose={onClose} className="max-w-xl">
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search className="h-4 w-4 text-subtle" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Jump to a page or run, or do something here…"
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setI((x) => Math.min(items.length - 1, x + 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setI((x) => Math.max(0, x - 1)); }
            if (e.key === "Enter") items[i]?.run();
          }}
          className="h-12 flex-1 bg-transparent text-[14.5px] text-fg outline-none placeholder:text-subtle" />
        <Kbd>esc</Kbd>
      </div>
      <div ref={list} className="scroll-thin max-h-[52vh] overflow-y-auto p-2">
        {!items.length && <div className="px-3 py-8 text-center text-sm text-subtle">No matches for “{q}”</div>}
        {groups.map((g) => (
          <div key={g} className="mb-1">
            <div className="px-2.5 pb-1 pt-2 text-[11px] font-medium text-subtle">{g}</div>
            {items.map((x, idx) => x.group === g && (
              <button key={x.id} data-i={idx} onMouseMove={() => setI(idx)} onClick={x.run}
                className={cx("flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13.5px]", idx === i ? "bg-raised text-fg" : "text-muted")}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-surface text-muted ring-1 ring-inset ring-line">{x.icon}</span>
                <span className="min-w-0 flex-1 truncate font-medium">{x.label}</span>
                {x.hint}
                {idx === i && <ArrowRight className="h-3.5 w-3.5 text-subtle" />}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 border-t border-line px-4 py-2 text-2xs text-subtle">
        <span className="flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
        <span className="flex items-center gap-1"><Kbd><CornerDownLeft className="h-2.5 w-2.5" /></Kbd> open</span>
      </div>
    </Modal>
  );
}
