import type { Transition, Variants } from "motion/react";

/*
  One motion language. Durations and easings mirror the CSS tokens in
  globals.css so DOM transitions and JS-driven motion stay in sync.

  micro   140ms  cursor, toggles, tactile feedback
  ui      240ms  hovers, controls, small state changes
  panel   420ms  menus, disclosures, cards entering
  section 640ms  section reveals, staged content
  cine    900ms  the hero, deliberate one-off sequences
*/

export const DUR = {
  micro: 0.14,
  ui: 0.24,
  panel: 0.42,
  section: 0.64,
  cine: 0.9,
} as const;

/** Exponential ease-out. The default. Content arrives, then settles. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_INOUT: [number, number, number, number] = [0.65, 0, 0.35, 1];
/** Weighted in-out. Structural moves, clip/mask reveals, the intro. Has inertia. */
export const EASE_CINE: [number, number, number, number] = [0.76, 0, 0.24, 1];

/** Natural spring for pointer physics and layout moves. */
export const SPRING: Transition = { type: "spring", stiffness: 120, damping: 20, mass: 0.9 };
export const SPRING_SOFT: Transition = { type: "spring", stiffness: 90, damping: 24, mass: 1 };

/** Section reveal: a short rise from an already-legible baseline (not a big fade-up). */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: DUR.section, ease: EASE_OUT } },
};

/** Staggered children container. */
export const stagger = (each = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  shown: { transition: { staggerChildren: each, delayChildren } },
});

/** Clip-path wipe reveal for headlines and media (varies the vocabulary vs plain fades). */
export const wipeUp: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)", y: "0.4em" },
  shown: {
    clipPath: "inset(0% 0 0 0)",
    y: 0,
    transition: { duration: DUR.section, ease: EASE_OUT },
  },
};

/** A single line of oversized type, uncovered from the baseline. Pair with an
 *  `overflow:hidden` parent (`.type-line`). Stagger `delay` per line. */
export const lineClip: Variants = {
  hidden: { y: "110%" },
  shown: { y: 0, transition: { duration: 0.9, ease: EASE_CINE } },
};

/** Large media / visual: a clip-path curtain plus a slow settle of scale. */
export const curtain: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", scale: 1.06 },
  shown: {
    clipPath: "inset(0 0 0% 0)",
    scale: 1,
    transition: { duration: 1.1, ease: EASE_CINE },
  },
};

/** Standard in-view config: fire once, a third of the element visible. */
export const inView = { once: true, amount: 0.3 } as const;
