"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { portfolio } from "@/content/portfolio";
import { DUR, EASE_OUT } from "@/lib/motion";
import { Reveal } from "@/components/ui/reveal";
import { SocialRow } from "@/components/ui/social-row";

const { contact, person } = portfolio;

export function Contact() {
  const reduce = useReducedMotion();
  const [armed, setArmed] = useState(false);

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line py-28 md:py-40">
      <div className="wrap">
        <Reveal kind="rise">
          <h2 className="max-w-[16ch] text-[clamp(2.25rem,5.2vw,4rem)] font-[560] leading-[1.03] tracking-[-0.035em] text-ink">
            {contact.headline}
          </h2>
        </Reveal>

        <Reveal kind="rise" delay={0.06}>
          <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-2">
            {contact.sub}
          </p>
        </Reveal>

        {/* the send: a large address that fires a signal down its length on hover */}
        <Reveal kind="rise" delay={0.12}>
          <a
            href={`mailto:${contact.primaryEmail}`}
            onPointerEnter={() => setArmed(true)}
            onFocus={() => setArmed(true)}
            className="group mt-12 inline-flex flex-wrap items-center gap-x-3 text-[clamp(1.5rem,4vw,2.75rem)] tracking-[-0.03em] text-ink"
          >
            <span className="relative">
              {contact.primaryEmail}
              <span className="absolute -bottom-1 left-0 h-px w-full bg-line" aria-hidden />
              <motion.span
                className="absolute -bottom-1 left-0 h-px bg-signal"
                initial={{ width: "0%" }}
                animate={reduce ? { width: "100%" } : { width: armed ? "100%" : "0%" }}
                transition={{ duration: DUR.panel, ease: EASE_OUT }}
                aria-hidden
              />
            </span>
            <ArrowUpRightIcon
              weight="bold"
              className="size-[0.7em] text-signal transition-transform duration-[--dur-ui] ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </Reveal>

        <Reveal kind="rise" delay={0.16}>
          <p className="mt-8 text-[0.9375rem] text-ink-3">
            {person.availability}
            {person.location ? `. Based in ${person.location}.` : "."}
          </p>
        </Reveal>

        <Reveal kind="rise" delay={0.2}>
          <div className="mt-10">
            <SocialRow />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
