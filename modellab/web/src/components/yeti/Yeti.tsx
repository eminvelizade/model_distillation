import { useEffect, useRef, useState } from "react";
import { cx } from "../../ui";
import { MascotKind, MascotPose, STILLS, useMascot } from "./mascots";

export type YetiPose = MascotPose;

// three.js and the mascot shaders load on first use, in their own chunk
type Engine = typeof import("./mascot/engine");
let engine: Promise<Engine> | null = null;
const loadEngine = () => (engine ??= import("./mascot/engine").then((m) => { m.probe(); return m; }));

/** The assistant's mascot, drawn live in 3D (the one picked in the chat's settings, unless `kind` says otherwise).
 *  Poses: idle (breathes, blinks, follows the pointer), wave (once, smiling: "I can explain this"), think (looks up,
 *  a snowflake, sparkle or bubbles), happy (a hop), sleep (eyes closed, z's). Shows a still picture while the 3D
 *  renderer loads, and keeps it where WebGL isn't available. */
export default function Yeti({ size = 64, pose = "idle", className, title, kind, fps, follow }: {
  size?: number; pose?: YetiPose; className?: string; title?: string; kind?: MascotKind; fps?: number; follow?: boolean;
}) {
  const chosen = useMascot().kind;
  const k = kind ?? chosen;
  const host = useRef<HTMLSpanElement>(null);
  const view = useRef<import("./mascot/engine").View | null>(null);
  const [live, setLive] = useState(false);
  const small = size < 48;
  useEffect(() => {
    let alive = true;
    loadEngine().then((m) => {
      if (!alive || !host.current) return;
      view.current = new m.View(host.current, { kind: k, pose, fps: fps ?? (small ? 15 : 30), follow: follow ?? !small, portrait: small });
      setLive(true);
    }).catch(() => undefined);   // no WebGL: the still picture stays
    return () => { alive = false; view.current?.dispose(); view.current = null; setLive(false); };
  }, [k]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { view.current?.setPose(pose); }, [pose, live]);
  return (
    <span className={cx("relative inline-block shrink-0 select-none align-middle", className)} style={{ width: size, height: size }}
      role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} data-mascot={k}>
      {!live && <img src={STILLS[k]} alt="" draggable={false} decoding="async" className="absolute inset-0 h-full w-full" />}
      <span ref={host} className="absolute inset-0" />
    </span>
  );
}
