import { useEffect, useRef, useState } from "react";
import { cx, reducedMotion } from "../../ui";
import arm from "./art/arm.webp";
import body from "./art/body.webp";
import eyeL from "./art/eye-l.webp";
import eyeR from "./art/eye-r.webp";
import tuft from "./art/tuft.webp";

export type YetiPose = "idle" | "wave" | "think" | "happy" | "sleep";

const INK = "#25222f"; // the embroidered eyes' colour

// Optional generated clips (tools/mascot/clip.py): art/clips/<pose>.webp, a transparent animated WebP on the puppet's
// canvas. Played while Yeti is in that pose; the puppet does everything else.
const CLIPS = import.meta.glob("./art/clips/*.webp", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const blobs = new Map<string, Promise<Blob>>();

/** A fresh object URL each time the pose starts, so a play-once clip plays from its first frame every time. */
function useClip(pose: YetiPose): string | null {
  const url = CLIPS[`./art/clips/${pose}.webp`];
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!url || reducedMotion()) return;
    let live = true;
    let obj: string | null = null;
    if (!blobs.has(url)) blobs.set(url, fetch(url).then((r) => r.blob()));
    blobs.get(url)!.then((b) => { if (live) { obj = URL.createObjectURL(b); setSrc(obj); } }).catch(() => undefined);
    return () => { live = false; setSrc(null); if (obj) URL.revokeObjectURL(obj); };
  }, [url]);
  return src;
}

/** Yeti, ModelLab's assistant: the plush mascot as a little puppet. Each layer in ./art is cut from the same
 *  photo and shares one square canvas (positions in index.css are fractions of it): the body (eyes patched out),
 *  the two embroidered eyes, a copy of the tuft and a stubby arm tucked behind the body.
 *
 *  Poses: idle (breathes, blinks), wave (raises its arm and waves once, smiling: "I can explain this"),
 *  think (looks up, sways, a snowflake turns), happy (hops, the tuft bounces), sleep (eyes closed, z). */
export default function Yeti({ size = 64, pose = "idle", className, title }: {
  size?: number; pose?: YetiPose; className?: string; title?: string;
}) {
  const delay = useRef(`${-Math.random() * 5}s`).current; // several Yetis never blink in sync
  const clip = useClip(pose);
  return (
    <span className={cx("yeti relative inline-block shrink-0 select-none align-middle", clip && "yeti-has-clip", className)} data-pose={pose}
      style={{ width: size, height: size }} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <span className="yeti-shadow" />
      <span className="yeti-hop">
        <span className="yeti-rig">
          <img src={arm} className="yeti-arm" alt="" draggable={false} decoding="async" />
          <img src={body} alt="" draggable={false} decoding="async" />
          <img src={tuft} className="yeti-tuft" alt="" draggable={false} decoding="async" />
          <img src={eyeL} className="yeti-eye yeti-eye-l" alt="" draggable={false} decoding="async" style={{ animationDelay: delay }} />
          <img src={eyeR} className="yeti-eye yeti-eye-r" alt="" draggable={false} decoding="async" style={{ animationDelay: delay }} />
          <svg viewBox="0 0 100 100" className="yeti-face" aria-hidden>
            <g className="yeti-smile" stroke={INK} strokeWidth="1.7" strokeLinecap="round" fill="none">
              <path d="M30.6 68.9Q33.4 64.4 36.2 68.9" /><path d="M59.9 69.4Q62.7 64.9 65.5 69.4" />
            </g>
          </svg>
        </span>
      </span>
      {clip && <img src={clip} className="yeti-clip" alt="" draggable={false} />}
      {pose === "think" && (
        <svg viewBox="0 0 100 100" className="yeti-extra" aria-hidden>
          <g className="yeti-flake" stroke="#7db7e3" strokeWidth="2.6" strokeLinecap="round">
            <path d="M88 5V19M81.9 8.5L94.1 15.5M81.9 15.5L94.1 8.5" />
          </g>
        </svg>
      )}
      {pose === "sleep" && (
        <svg viewBox="0 0 100 100" className="yeti-extra" aria-hidden>
          <g fill="#7db7e3" fontFamily="ui-sans-serif, system-ui" fontWeight="700">
            <text x="80" y="22" fontSize="13" className="yeti-z">z</text><text x="89" y="11" fontSize="9" className="yeti-z yeti-z2">z</text>
          </g>
        </svg>
      )}
    </span>
  );
}
