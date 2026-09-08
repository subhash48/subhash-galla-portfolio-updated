"use client";

import { motion, useReducedMotion } from "motion/react";
import { portfolio } from "@/content/portfolio";
import { DUR, EASE_OUT } from "@/lib/motion";
import { Cta } from "@/components/ui/cta";
import { HeroGraphMount } from "@/components/three/hero-graph-mount";

const { hero } = portfolio;

/** Splits "... stay {signal}grounded{/signal}." into styled runs. */
function renderHeadline(src: string) {
  return src.split(/(\{signal\}.*?\{\/signal\})/g).map((part, i) => {
    const m = part.match(/^\{signal\}(.*?)\{\/signal\}$/);
    if (!m) return <span key={i}>{part}</span>;
    return (
      <span key={i} className="relative whitespace-nowrap text-signal">
        {m[1]}
        <span className="absolute -bottom-1 left-0 h-px w-full bg-signal/50" aria-hidden />
      </span>
    );
  });
}

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: DUR.cine, ease: EASE_OUT, delay },
        };

  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-[calc(var(--nav-h)+2rem)] pb-24"
    >
      <HeroGraphMount />

      {/* keeps text legible over the graph without a flat scrim */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--canvas)_4%,transparent_38%,transparent_70%,var(--canvas))] sm:bg-[linear-gradient(105deg,var(--canvas)_16%,transparent_60%)]"
        aria-hidden
      />

      <div className="wrap relative">
        <div className="max-w-[38rem]">
          <motion.h1
            {...rise(0.05)}
            className="max-w-[15ch] text-[clamp(2.5rem,5.2vw,4.25rem)] font-[560] leading-[1.03] tracking-[-0.04em] text-ink [text-wrap:balance]"
          >
            {renderHeadline(hero.headline)}
          </motion.h1>

          <motion.p
            {...rise(0.14)}
            className="mt-6 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-2"
          >
            {hero.sub}
          </motion.p>

          <motion.div {...rise(0.22)} className="mt-9 flex flex-wrap items-center gap-3">
            <Cta href="#work" variant="solid" arrow={false}>
              View work
            </Cta>
            <Cta href="/subhash-galla-resume.pdf" variant="line" external>
              Résumé
            </Cta>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
