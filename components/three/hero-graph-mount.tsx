"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";
import { GraphStill } from "./graph-still";

const HeroGraph = dynamic(() => import("./hero-graph"), {
  ssr: false,
  loading: () => null,
});

let webglOK: boolean | null = null;
function hasWebGL() {
  if (webglOK !== null) return webglOK;
  try {
    const c = document.createElement("canvas");
    webglOK = !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    webglOK = false;
  }
  return webglOK;
}

/**
 * Decides what the hero shows:
 *  - reduced motion / no WebGL / save-data  -> static SVG projection, forever
 *  - otherwise                              -> live canvas, mounted only while
 *    on screen (IntersectionObserver unmounts it to stop the render loop)
 * The SVG is always the SSR/first paint, so there is no layout shift.
 */
export function HeroGraphMount() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [live, setLive] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const saveData =
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
        ?.saveData === true;
    const smallOrTouch =
      window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    // phones and low-power contexts keep the cheap static SVG
    if (reduce || saveData || smallOrTouch || !hasWebGL()) return;

    const io = new IntersectionObserver(
      ([e]) => setOnScreen(e.isIntersecting),
      { rootMargin: "200px" },
    );
    if (ref.current) io.observe(ref.current);

    // let the hero text land first
    const t = window.setTimeout(() => setLive(true), 350);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [reduce]);

  return (
    <div
      ref={ref}
      className="absolute inset-0 opacity-30 sm:opacity-100"
      aria-hidden
    >
      <div className="absolute inset-0 [mask-image:radial-gradient(135%_125%_at_84%_46%,#000_34%,transparent_90%)]">
        {live && onScreen ? (
          <HeroGraph />
        ) : (
          <GraphStill className="absolute top-1/2 h-[112%] w-[92%] -translate-y-1/2 -right-[18%] opacity-85 sm:-right-[4%] sm:w-[72%] sm:h-[120%]" />
        )}
      </div>
    </div>
  );
}
