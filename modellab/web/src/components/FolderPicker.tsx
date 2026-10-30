import { useEffect, useId, useRef, useState } from "react";
import { ArrowUp, Check, ChevronRight, FileJson, Folder, FolderOpen, Home, Images, Loader2 } from "lucide-react";
import { api, Listing } from "../api";
import { Button, cx, IconButton, inputCls } from "../ui";

const LAYOUT_LABEL: Record<string, string> = { roboflow: "Roboflow", yolo: "YOLO" };
const join = (dir: string, name: string) => `${dir === "/" ? "" : dir}/${name}`;
const crumbs = (path: string) => {
  const parts = path.split("/").filter(Boolean);
  return [{ label: "/", path: "/" }, ...parts.map((p, i) => ({ label: p, path: `/${parts.slice(0, i + 1).join("/")}` }))];
};

/** A path on a machine: typed, or picked in a small explorer that lists the machine's folders through its agent.
 *  `want="json"` picks an annotation file instead of a folder. `expect` marks folders already in that layout. */
export function PathField({ machineId, canBrowse, label, hint, value, onChange, onPick, want = "dir", expect, placeholder, required }: {
  machineId: string; canBrowse: boolean; label: string; hint?: string; value: string; onChange: (path: string) => void;
  onPick?: (path: string) => void; want?: "dir" | "json"; expect?: "roboflow" | "yolo"; placeholder?: string; required?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picked, setPicked] = useState<string | null>(null); // layout of the folder picked in the explorer
  const seq = useRef(0);
  const trail = useRef<HTMLDivElement>(null);

  const go = async (path: string | null) => {
    const n = ++seq.current;
    setLoading(true);
    setError(null);
    try {
      const l = await api.browse(machineId, path, want);
      if (n === seq.current) setList(l);
    } catch (e) {
      if (n === seq.current) setError((e as Error).message);
    } finally {
      if (n === seq.current) setLoading(false);
    }
  };
  const toggle = () => {
    if (open) return setOpen(false);
    setOpen(true);
    go(value.startsWith("/") || value.startsWith("~") ? value : list?.path ?? null);
  };
  const choose = (path: string, layout: string | null = null) => {
    onChange(path);
    onPick?.(path);
    setPicked(layout);
    setOpen(false);
  };
  useEffect(() => { trail.current?.scrollTo({ left: trail.current.scrollWidth }); }, [list?.path]);

  const here = list?.layout ?? null;
  const fits = (layout?: string | null) => !!expect && layout === expect;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      <div className="flex gap-2">
        <input id={id} className={cx(inputCls, "font-mono text-[12.5px]")} value={value} placeholder={placeholder} required={required}
          onChange={(e) => { onChange(e.target.value); setPicked(null); }} spellCheck={false} autoComplete="off" />
        <Button onClick={toggle} disabled={!canBrowse} title={canBrowse ? "Browse the machine's folders" : "Browsing needs the machine online with an up-to-date agent"}
          className={cx("shrink-0", open && "ring-accent/40")}>{open ? <FolderOpen /> : <Folder />}Browse</Button>
      </div>
      {picked && fits(picked) && !open
        ? <span className="mt-1 flex items-center gap-1 text-2xs font-medium text-emerald-700 dark:text-emerald-300"><Check className="h-3 w-3" />{LAYOUT_LABEL[picked]} layout found</span>
        : hint && <span className="mt-1 block text-2xs text-subtle">{hint}</span>}

      {open && (
        <div className="mt-2 overflow-hidden rounded-xl border border-line bg-surface shadow-soft animate-pop">
          {list && list.places.length > 0 && (
            <div className="scroll-none flex gap-1 overflow-x-auto border-b border-line px-2 py-1.5">
              {list.places.map((p) => (
                <button key={p.path} type="button" onClick={() => go(p.path)}
                  className={cx("inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[11.5px] font-medium transition",
                    list.path === p.path ? "bg-accent-soft text-accent" : "text-muted hover:bg-raised hover:text-fg")}>
                  {p.label === "Home" && <Home className="h-3 w-3" />}{p.label}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 px-2 py-1.5">
            <IconButton title="Up one folder" disabled={!list?.parent || loading} onClick={() => list?.parent && go(list.parent)}><ArrowUp /></IconButton>
            <div ref={trail} className="scroll-none flex min-w-0 flex-1 items-center overflow-x-auto font-mono text-[12px]">
              {list ? crumbs(list.path).map((c, i, all) => (
                <span key={c.path} className="flex shrink-0 items-center">
                  {i > 1 && <ChevronRight className="h-3 w-3 text-subtle" />}
                  <button type="button" onClick={() => go(c.path)}
                    className={cx("rounded px-1 py-0.5 transition hover:bg-raised", i === all.length - 1 ? "font-medium text-fg" : "text-muted")}>{c.label}</button>
                </span>
              )) : <span className="px-1 text-subtle">{value || "~"}</span>}
            </div>
            {loading && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-subtle" />}
          </div>

          <div className={cx("scroll-thin max-h-64 overflow-y-auto border-t border-line p-1 transition-opacity", loading && list && "opacity-60")}>
            {error ? <div className="px-3 py-4 text-[12.5px] text-rose-700 dark:text-rose-300">{error}
                {!list && <button type="button" onClick={() => go(null)} className="ml-2 font-medium text-accent hover:underline">Open the home folder</button>}</div>
              : !list ? <div className="flex items-center gap-2 px-3 py-4 text-[12.5px] text-subtle"><Loader2 className="h-3.5 w-3.5 animate-spin" />asking the machine…</div>
              : !list.entries.length ? <div className="px-3 py-4 text-[12.5px] text-subtle">{want === "json" ? "No folders or .json files here." : "No folders here."}</div>
              : list.entries.map((e) => {
                const path = join(list.path, e.name);
                if (e.type === "file") return (
                  <button key={e.name} type="button" onClick={() => choose(path)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] text-fg transition hover:bg-raised">
                    <FileJson className="h-4 w-4 shrink-0 text-amber-500" />
                    <span className="min-w-0 flex-1 truncate font-mono text-[12.5px]">{e.name}</span>
                    {e.size !== undefined && <span className="shrink-0 font-mono text-[11px] tabular-nums text-subtle">{e.size >= 2 ** 20 ? `${(e.size / 2 ** 20).toFixed(1)} MB` : `${Math.max(1, Math.round(e.size / 1024))} KB`}</span>}
                  </button>
                );
                return (
                  <div key={e.name} className="flex items-center gap-1 rounded-lg transition hover:bg-raised">
                    <button type="button" onClick={() => go(path)} className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 text-left">
                      <Folder className={cx("h-4 w-4 shrink-0", e.layout ? "fill-accent-soft text-accent" : "text-subtle")} />
                      <span className="min-w-0 truncate text-[13px] text-fg">{e.name}</span>
                      {e.layout && <span className={cx("shrink-0 rounded-md px-1.5 py-px text-[10.5px] font-medium", fits(e.layout) ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-raised text-muted")}>{LAYOUT_LABEL[e.layout] ?? e.layout}</span>}
                    </button>
                    {want === "dir" && fits(e.layout) && <button type="button" onClick={() => choose(path, e.layout ?? null)}
                      className="mr-1 shrink-0 rounded-md bg-accent-soft px-2 py-0.5 text-[11.5px] font-medium text-accent transition hover:bg-accent/15">Use</button>}
                  </div>
                );
              })}
            {list?.truncated && <div className="px-2 py-1.5 text-2xs text-subtle">Showing the first {list.entries.length.toLocaleString()} entries: type the path to go deeper.</div>}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-line bg-raised/40 px-3 py-2">
            <span className="flex min-w-0 flex-1 basis-48 items-center gap-1.5 text-[11.5px] text-muted">
              {list && !error && (fits(here)
                ? <><Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" /><span className="text-emerald-700 dark:text-emerald-300">{LAYOUT_LABEL[here!]} layout</span></>
                : list.images > 0 ? <><Images className="h-3.5 w-3.5 shrink-0 text-subtle" />{list.images.toLocaleString()} image{list.images > 1 ? "s" : ""} here</>
                : <span className="text-subtle">{want === "json" ? "Pick the annotations .json" : expect === "roboflow" ? "Needs train/ valid/ test/ with _annotations.coco.json" : expect === "yolo" ? "Needs images/ + labels/ (or a data.yaml)" : ""}</span>)}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <Button small variant="ghost" onClick={() => setOpen(false)}>Close</Button>
              {want === "dir" && <Button small variant="primary" disabled={!list || !!error || loading} onClick={() => list && choose(list.path, here)}>Use this folder</Button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
