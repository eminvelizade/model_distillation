import { useEffect, useRef, useState } from "react";
import { cx } from "../../ui";
import { AgentLook, COLOURS, isBuiltIn, MascotKind, MascotPose, STILLS, useMascot } from "./mascots";

export type YetiPose = MascotPose;

// three.js and the mascot shaders load on first use, in their own chunk
type Engine = typeof import("./mascot/engine");
let engine: Promise<Engine> | null = null;
const loadEngine = () => (engine ??= import("./mascot/engine").then((m) => { m.probe(); return m; }));

/** An agent's mascot, drawn live in 3D: the current agent's, unless `look` (any agent's) or `kind` (a built-in one)
 *  says otherwise. Poses: idle (breathes, blinks, follows the pointer), wave (once, smiling: "I can explain this"),
 *  think (looks up, a sparkle or bubbles), happy (a hop), sleep (eyes closed, z's). Shows a still picture while the 3D
 *  renderer loads (a soft blob in its colour for a make-your-own one), and keeps it where WebGL isn't available. */
export default function Yeti({ size = 64, pose = "idle", className, title, kind, look, fps, follow, thumb }: {
  size?: number; pose?: YetiPose; className?: string; title?: string; kind?: MascotKind; look?: AgentLook; fps?: number; follow?: boolean;
  thumb?: boolean;   // a small still picture among many (the editor's shapes): drawn once, with the shared program
}) {
  const chosen = useMascot().look;
  const L: AgentLook = look ?? (kind ? { base: kind } : chosen);
  const key = JSON.stringify(L);
  const host = useRef<HTMLSpanElement>(null);
  const view = useRef<import("./mascot/engine").View | null>(null);
  const [live, setLive] = useState(false);
  const small = size < 48;
  useEffect(() => {
    let alive = true;
    loadEngine().then((m) => {
      if (!alive || !host.current) return;
      const opts = { pose, fps: fps ?? (small ? 15 : 30), follow: follow ?? !small, portrait: small, still: thumb, general: thumb };
      view.current = isBuiltIn(L) ? new m.View(host.current, { kind: L.base, ...opts }) : new m.View(host.current, { kind: "fuzzy", look: L, ...opts });
      setLive(true);
    }).catch(() => undefined);   // no WebGL: the still picture stays
    return () => { alive = false; view.current?.dispose(); view.current = null; setLive(false); };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { view.current?.setPose(pose); }, [pose, live]);
  return (
    <span className={cx("relative inline-block shrink-0 select-none align-middle", className)} style={{ width: size, height: size }}
      role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} data-mascot={L.base}>
      {!live && (isBuiltIn(L) ? <img src={STILLS[L.base]} alt="" draggable={false} decoding="async" className="absolute inset-0 h-full w-full" />
        : <span className="absolute inset-[14%] rounded-[46%]" style={{ background: COLOURS[L.colour] ?? COLOURS.lime, filter: "blur(0.6px)" }} />)}
      <span ref={host} className="absolute inset-0" />
    </span>
  );
}
