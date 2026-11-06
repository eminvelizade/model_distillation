import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { cx, reducedMotion } from "../../ui";
import { useMascot } from "./mascots";
import Yeti, { YetiPose } from "./Yeti";
import { useYeti, YetiSuggestion } from "./YetiContext";
import YetiPanel from "./YetiPanel";

const seen = (k: string) => { try { return !!sessionStorage.getItem(k); } catch { return false; } };
const mark = (k: string) => { try { sessionStorage.setItem(k, "1"); } catch { /* private window */ } };

/** Yeti in the bottom-right corner: opens the chat. When the page has something worth explaining, Yeti waves once and
 *  offers it in a small bubble (once per page per session). Hub only. */
export default function YetiDock() {
  const y = useYeti();
  const { name } = useMascot();
  const [pose, setPose] = useState<YetiPose>("idle");
  const [hint, setHint] = useState<YetiSuggestion | null>(null);
  const waving = useRef(0);
  const wave = () => {
    if (reducedMotion() || waving.current) return;
    setPose("wave");
    waving.current = window.setTimeout(() => { setPose("idle"); waving.current = 0; }, 1500);
  };
  useEffect(() => () => window.clearTimeout(waving.current), []);

  const s = y.suggestion;
  const hintKey = s ? `yeti-hint:${y.page?.kind}:${y.page?.id ?? ""}:${s.focus}` : null;
  useEffect(() => {
    setHint(null);
    if (!y.available || y.open || !s || !hintKey || seen(hintKey)) return;
    const t = window.setTimeout(() => { setHint(s); mark(hintKey); wave(); }, 1100);
    return () => window.clearTimeout(t);
  }, [hintKey, y.open, y.available]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!y.available) return null;
  const toggle = () => { setHint(null); y.setOpen(!y.open); };
  return (
    <>
      {hint && !y.open && (
        <div className="fixed bottom-[24px] right-[84px] z-40 w-[min(260px,calc(100vw-104px))] origin-bottom-right animate-pop sm:bottom-[30px] sm:right-[92px]">
          <div className="relative rounded-2xl rounded-br-md border border-line bg-surface px-3.5 py-2.5 shadow-lift">
            <button onClick={() => { y.ask(hint.ask, hint.focus, hint.about); setHint(null); }} className="block w-full text-left">
              <span className="block text-[13px] leading-snug text-fg">{hint.text}</span>
              <span className="mt-1 block text-xs font-medium text-accent">Ask {name} →</span>
            </button>
            <button onClick={() => setHint(null)} aria-label="Dismiss" title="Dismiss"
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-surface text-subtle shadow-soft ring-1 ring-line hover:text-fg">
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
      {y.open && <YetiPanel />}
      <button onClick={toggle} onMouseEnter={wave} onFocus={wave} aria-label={y.open ? `Close ${name}` : `Ask ${name}`} title={y.open ? `Close ${name}` : `Ask ${name}`}
        aria-expanded={y.open}
        className={cx("group fixed bottom-3 right-3 z-40 rounded-full transition duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:bottom-5 sm:right-5",
          y.open && "max-sm:hidden")}>
        <Yeti size={68} pose={y.busy ? "think" : pose} className="block" />
      </button>
    </>
  );
}
