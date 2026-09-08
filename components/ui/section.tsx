import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function Section({
  id,
  children,
  className,
  bleed = false,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  /** full-bleed sections skip the content column */
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-20 py-20 md:py-28", className)}
    >
      <div className={cn(!bleed && "wrap")}>{children}</div>
    </section>
  );
}

/**
 * Section heading. Stacked, never split. No eyebrow.
 * `ordinal` is shown only where the section is a genuine index (Work).
 */
export function Heading({
  title,
  lead,
  ordinal,
  className,
}: {
  title: string;
  lead?: string;
  ordinal?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-10 md:mb-14 max-w-3xl", className)}>
      <Reveal kind="rise">
        <h2 className="flex items-baseline gap-4 text-[clamp(1.85rem,4vw,2.9rem)] leading-[1.05] tracking-[-0.033em] text-ink">
          {ordinal && (
            <span className="label mt-1 shrink-0 text-ink-4! tnum" aria-hidden>
              {ordinal}
            </span>
          )}
          <span>{title}</span>
        </h2>
      </Reveal>
      {lead && (
        <Reveal kind="rise" delay={0.05}>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-3 max-w-[62ch]">
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}
