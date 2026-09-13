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
  children,
}: {
  chapter: ChapterId;
  window: string;
  anchor: "lead" | "low-lead" | "band" | "column" | "centre";
  scrim: "corner-lead" | "corner-low-lead" | "band" | "column" | "centre" | "none";
  device: "greet" | "lines" | "wipe" | "settle" | "stagger" | "focus" | "rise" | "finale";
  posterFrame: number;
  posterAlt?: string;
  className?: string;
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
        src={`/film/d/${String(posterFrame).padStart(3, "0")}.jpg`}
        alt={posterAlt}
        width={1280}
        height={720}
        loading="lazy"
        decoding="async"
      />
      <div className="copy">{children}</div>
    </div>
  );
}
