import { useState } from "react";
import { cx } from "../../ui";
import Yeti from "./Yeti";
import { useYeti } from "./YetiContext";

/** "Explain" next to a result: a small pill with Yeti, who waves when you point at it. Opens the chat and asks. */
export default function ExplainButton({ ask, focus, about, label = "Explain", className }: {
  ask: string; focus: string; about?: string; label?: string; className?: string;
}) {
  const y = useYeti();
  const [hover, setHover] = useState(false);
  if (!y.available) return null;
  return (
    <button onClick={() => y.ask(ask, focus, about)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)} onBlur={() => setHover(false)} title="Ask Yeti to explain this"
      className={cx("inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-accent-soft py-0 pl-0.5 pr-2.5 text-xs font-medium text-accent ring-1 ring-inset ring-accent/10 transition duration-200 hover:-translate-y-px hover:shadow-soft", className)}>
      <Yeti size={26} pose={hover ? "wave" : "idle"} />{label}
    </button>
  );
}
