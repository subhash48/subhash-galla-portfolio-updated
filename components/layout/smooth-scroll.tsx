"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * App-wide smooth scroll. Inertia + velocity feed the rest of the motion
 * system. Disabled entirely under prefers-reduced-motion and on coarse
 * pointers (touch already has native inertia and Lenis fights it).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const raf = useRef<number>(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 0.9,
      lerp: 0.12,
    });

    // expose progress for scroll-driven bits that want it cheaply
    lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
      document.documentElement.style.setProperty(
        "--scroll-progress",
        limit > 0 ? (scroll / limit).toFixed(4) : "0",
      );
    });

    const loop = (time: number) => {
      lenis.raf(time);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    // anchor links -> smooth
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as
        | HTMLAnchorElement
        | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -80 });
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf.current);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
