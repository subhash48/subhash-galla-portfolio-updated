import { cn } from "@/lib/utils";
import type { ChapterId } from "@/content/film";

/**
 * A window of real HTML floating over the film. `window` is chapter-local
 * progress as "from,to,rampIn,rampOut" (Scrollcraft's cue contract — a bare
 * `from` holds to the end of the chapter, used only by the final beat).
 * `posterFrame` is the key frame shown when reduced motion / no JS makes the
 * page a flowing document instead of a scrubbed film.
 */
export function Beat({
  chapter,
  window,
  anchor,
  scrim,
  device,
  posterFrame,
  posterAlt = "",
  className,
  aside,
  children,
}: {
  chapter: ChapterId;
  window: string;
  anchor: "lead" | "low-lead" | "band" | "column" | "centre" | "about-lead" | "about-edu";
  scrim: "corner-lead" | "corner-low-lead" | "band" | "column" | "centre" | "about-lead" | "about-edu" | "none";
  device: "greet" | "lines" | "wipe" | "settle" | "discipline" | "focus" | "rise" | "finale";
  posterFrame: number;
  posterAlt?: string;
  className?: string;
  /** rendered as a sibling of .copy, not inside it — for a child that needs
   * true viewport-fixed positioning. .copy carries its own transform on some
   * devices (the exit drift), which would hijack position:fixed's containing
   * block if nested inside it. */
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      data-beat
      data-chapter-hint={chapter}
      data-window={window}
      data-device={device}
      className={cn("beat", `beat--${anchor}`, className)}
    >
      {scrim !== "none" && <div className={cn("scrim", `scrim--${scrim}`)} aria-hidden />}
      <img
        className="poster"
        src={`/scroll-frames/${String(posterFrame).padStart(3, "0")}.png`}
        alt={posterAlt}
        width={1920}
        height={1080}
        loading="lazy"
        decoding="async"
      />
      <div className="copy">{children}</div>
      {aside}
    </div>
  );
}
