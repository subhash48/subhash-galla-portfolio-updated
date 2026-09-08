"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionStyle,
} from "motion/react";
import { SPRING } from "@/lib/motion";

/**
 * Pulls its child toward the cursor within a radius. Pointer position is
 * held in motion values, never React state, so it never re-renders the tree.
 * Collapses to a plain wrapper under reduced motion / coarse pointers.
 */
export function Magnetic({
  children,
  strength = 0.35,
  radius = 90,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  if (reduce) return <span className={className}>{children}</span>;

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    const f = Math.max(0, 1 - dist / (radius + Math.max(r.width, r.height) / 2));
    x.set(dx * strength * f);
    y.set(dy * strength * f);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y, display: "inline-flex" } as MotionStyle}
      className={className}
    >
      {children}
    </motion.span>
  );
}
