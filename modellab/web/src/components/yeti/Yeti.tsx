import { useId } from "react";
import { cx } from "../../ui";

export type YetiPose = "idle" | "wave" | "think" | "happy" | "sleep";

// Ice-blue palette (no pink: the blush is blue too). A character, so these are fixed colours, not theme tokens.
const FUR = "#f7fbff", SHADE = "#e2f0fb", BELLY = "#eaf5fd", ARM = "#ebf5fd", SKIN = "#a9d6f0", PAD = "#c9e7f7";
const INK = "#12324a", HORN = "#b4d8f2", BUBBLE = "#c7e3f7", GLINT = "#e2f1fd", RING = "#a3cbec", LINE = "#9cc5e7";
const BLUSH = "#78b6e0", NOSE = "#3b77a6", FLAKE = "#7db7e3";

const HEAD = "M27 47C27 25 41 15 60 15C79 15 93 25 93 47C93 65 79 76 60 76C41 76 27 65 27 47Z";
const TUFT = "M47.5 19C48 11.5 54.5 7.5 60 11C65.5 7.5 72 11.5 72.5 19Z";
const HORN_L = "M38 28C31.5 23 28.5 15 31.5 7.5C36.5 11.5 41.5 17.5 45 24Z";
const HORN_R = "M82 28C88.5 23 91.5 15 88.5 7.5C83.5 11.5 78.5 17.5 75 24Z";
const PAW = [[102.5, 48.5, 8], [96.6, 42, 2.7], [102.3, 39.6, 2.7], [108, 42.2, 2.7]] as const;

/** Yeti, ModelLab's assistant: a little snow creature popping out of an ice bubble. Poses: idle (blinks),
 *  wave (raises a paw and waves once: "I can explain this"), think (while answering), happy, sleep (not connected).
 *  `badge={false}` drops the bubble (inline use). Motion lives in index.css (.yeti-*), and reduced motion stills it. */
export default function Yeti({ size = 64, pose = "idle", badge = true, className, title }: {
  size?: number; pose?: YetiPose; badge?: boolean; className?: string; title?: string;
}) {
  const id = `y${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const open = pose === "idle" || pose === "wave" || pose === "think";
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={cx("yeti shrink-0 overflow-visible", className)} data-pose={pose}
      role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <defs><clipPath id={id}><circle cx="60" cy="68" r="48" /></clipPath></defs>
      {badge && <>
        <circle cx="60" cy="68" r="48" fill={BUBBLE} />
        <path d="M24 58A38 38 0 0 1 52 31" stroke={GLINT} strokeWidth="4.5" strokeLinecap="round" fill="none" />
      </>}
      <g clipPath={`url(#${id})`}>
        <path d="M21 124C19 95 36 77 60 77C84 77 101 95 99 124Z" fill={FUR} />
        <path d="M83 81C95 89 101 103 99 124H89C91 105 89 92 83 81Z" fill={SHADE} />
        <ellipse cx="60" cy="107" rx="16" ry="13.5" fill={BELLY} />
        <path d="M30 86C21 93 20 107 27 114C33 117 38 108 37 97Z" fill={ARM} />
        <path className="yeti-rest" d="M90 86C99 93 100 107 93 114C87 117 82 108 83 97Z" fill={ARM} />
      </g>
      {badge && <circle cx="60" cy="68" r="47.3" fill="none" stroke={RING} strokeWidth="1.4" />}
      <g className="yeti-head">
        <g fill="none" stroke={LINE} strokeWidth="3.6" strokeLinejoin="round">
          <path d={HORN_L} /><path d={HORN_R} /><path d={HEAD} /><path d={TUFT} />
        </g>
        <path d={HORN_L} fill={HORN} /><path d={HORN_R} fill={HORN} />
        <path d={HEAD} fill={FUR} />
        <path d={TUFT} fill={FUR} />
        <path d="M80 24C89 30 93 39 93 47C93 62 84 72.5 71 75.5C81.5 68.5 87 58.5 87 47C87 38.5 85 30.5 80 24Z" fill={SHADE} />
        <path d="M37 47C37 36 47 31 60 31C73 31 83 36 83 47V51C83 62 73 68.5 60 68.5C47 68.5 37 62 37 51Z" fill={SKIN} />
        <path d="M35 44C35 33 46 27.5 60 27.5C74 27.5 85 33 85 44C81 39.5 76.5 39 72.5 41.5C69.5 37 63.5 36.5 60 40C56.5 36.5 50.5 37 47.5 41.5C43.5 39 39 39.5 35 44Z" fill={FUR} />
        {open ? (
          <g className={cx("blink", pose === "think" && "yeti-look-up")}>
            <ellipse cx="50" cy="48" rx="4.3" ry="5" fill={INK} /><ellipse cx="70" cy="48" rx="4.3" ry="5" fill={INK} />
            <circle cx="51.7" cy="46.1" r="1.7" fill="#fff" /><circle cx="71.7" cy="46.1" r="1.7" fill="#fff" />
            <circle cx="48.7" cy="50.3" r=".75" fill="#fff" /><circle cx="68.7" cy="50.3" r=".75" fill="#fff" />
          </g>
        ) : (
          <g stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round">
            {pose === "happy"
              ? <><path d="M45.6 49.5Q50 43.5 54.4 49.5" /><path d="M65.6 49.5Q70 43.5 74.4 49.5" /></>
              : <><path d="M45.6 48Q50 52 54.4 48" /><path d="M65.6 48Q70 52 74.4 48" /></>}
          </g>
        )}
        <ellipse cx="42.8" cy="56.6" rx="4.3" ry="2.5" fill={BLUSH} opacity=".5" />
        <ellipse cx="77.2" cy="56.6" rx="4.3" ry="2.5" fill={BLUSH} opacity=".5" />
        <path d="M56.6 53.8Q60 52.1 63.4 53.8Q62.6 56.7 60 57.3Q57.4 56.7 56.6 53.8Z" fill={NOSE} />
        {pose === "think" ? <ellipse cx="60" cy="61" rx="2.2" ry="1.9" fill={INK} />
          : pose === "happy" ? <><path d="M54.5 58.5Q60 66 65.5 58.5Z" fill={INK} /><path d="M57 61.6Q60 64.4 63 61.6Q60 63 57 61.6Z" fill="#5fa3d3" /></>
          : pose === "sleep" ? <path d="M57 60.5Q60 62 63 60.5" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          : <path d="M55.4 59.2Q60 63.6 64.6 59.2" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />}
      </g>
      <g className="yeti-arm">
        <path d="M86 84L101 54" stroke={LINE} strokeWidth="16" strokeLinecap="round" />
        {PAW.map(([x, y, r]) => <circle key={`${x}${y}`} cx={x} cy={y} r={r + 1.8} fill={LINE} />)}
        <path d="M86 84L101 54" stroke={FUR} strokeWidth="12.5" strokeLinecap="round" />
        {PAW.map(([x, y, r]) => <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill={SKIN} />)}
        <ellipse cx="102.5" cy="49.6" rx="3.6" ry="3.2" fill={PAD} />
      </g>
      {pose === "think" && (
        <g className="yeti-flake" stroke={FLAKE} strokeWidth="2" strokeLinecap="round"><path d="M103 11V23M97.8 14L108.2 20M97.8 20L108.2 14" /></g>
      )}
      {pose === "sleep" && (
        <g fill={FLAKE} fontFamily="ui-sans-serif, system-ui" fontWeight="700"><text x="96" y="22" fontSize="11">z</text><text x="104" y="13" fontSize="8" opacity=".7">z</text></g>
      )}
    </svg>
  );
}
