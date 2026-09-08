"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type TargetAndTransition } from "motion/react";
import { DUR, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Kind = "rise" | "wipe" | "fade";

const HIDDEN: Record<Kind, TargetAndTransition> = {
  rise: { opacity: 0, y: 16 },
  wipe: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  fade: { opacity: 0 },
};
const SHOWN: Record<Kind, TargetAndTransition> = {
  rise: { opacity: 1, y: 0 },
  wipe: { opacity: 1, clipPath: "inset(0 0 0% 0)" },
  fade: { opacity: 1 },
};

/**
 * Scroll reveal that can never trap content invisible:
 *  - SSR / pre-hydration / no-JS  -> rendered visible (no hidden inline style)
 *  - reduced motion               -> visible, no animation
 *  - in view on mount             -> visible immediately
 *  - out of view on mount         -> hide, then animate in when observed
 *  - IntersectionObserver failure -> a 2.5s failsafe reveals it anyway
 */
export function Reveal({
  children,
  kind = "rise",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  kind?: Kind;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<"start" | "hidden" | "shown">("start");

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) {
      setPhase("shown");
      return;
    }
    const r = el.getBoundingClientRect();
    const visible = r.top < window.innerHeight * 0.92 && r.bottom > 0;
    if (visible) {
      setPhase("shown");
      return;
    }
    setPhase("hidden");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPhase("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    io.observe(el);
    const failsafe = window.setTimeout(() => setPhase("shown"), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [reduce]);

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={false}
      animate={phase === "hidden" ? HIDDEN[kind] : SHOWN[kind]}
      transition={
        phase === "shown"
          ? { duration: DUR.section, ease: EASE_OUT, delay }
          : { duration: 0 }
      }
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word headline reveal. Falls back to plain text if motion is reduced. */
export function RevealWords({
  text,
  className,
  wordClassName,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
}) {
  const reduce = useReducedMotion();
  const [go, setGo] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGo(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    const t = window.setTimeout(() => setGo(true), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [reduce]);

  if (reduce) return <span className={className}>{text}</span>;
  const words = text.split(" ");

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden>
          <motion.span
            className={cn("inline-block", wordClassName)}
            initial={false}
            animate={{ y: go ? 0 : "110%" }}
            transition={{ duration: DUR.panel, ease: EASE_OUT, delay: go ? i * 0.045 : 0 }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
