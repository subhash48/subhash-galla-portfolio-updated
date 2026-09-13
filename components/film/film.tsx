"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { FilmEngine } from "@/lib/film-engine";
import {
  IntroChapter,
  IdentityChapter,
  WorkChapter,
  ExperienceChapter,
  WhatIDoChapter,
  AboutChapter,
  ContactChapter,
} from "./chapters";

/**
 * The film: one fixed canvas stage plus one fixed copy layer, driven by a
 * single spacer that owns the scroll track. Reduced motion never mounts the
 * engine — the same markup then flows as a static document (app/globals.css
 * `[data-film="static"]`), each beat showing its own key frame as a poster.
 */
export function Film() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const leanRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const short = window.matchMedia("(max-height: 420px)").matches;
    document.documentElement.dataset.film = reduce || short ? "static" : "scroll";
    if (reduce || short) return;
    if (!rootRef.current || !canvasRef.current || !posterRef.current || !copyRef.current || !spacerRef.current || !leanRef.current)
      return;

    const engine = new FilmEngine({
      root: rootRef.current,
      canvas: canvasRef.current,
      poster: posterRef.current,
      copy: copyRef.current,
      spacer: spacerRef.current,
      lean: leanRef.current,
    });
    engine.mount();
    return () => engine.destroy();
  }, [reduce]);

  return (
    <>
      <div className="film-stage" ref={rootRef}>
        <div className="film-lean" ref={leanRef}>
          <img
            ref={posterRef}
            className="film-poster"
            src="/scroll-frames/001.png"
            alt=""
            width={1920}
            height={1080}
            fetchPriority="high"
            decoding="async"
          />
          <canvas ref={canvasRef} aria-hidden="true" />
        </div>
        <div className="film-grade" aria-hidden="true" />
      </div>

      <main id="main">
        <div className="film-copy" ref={copyRef}>
          <IntroChapter />
          <IdentityChapter />
          <WorkChapter />
          <ExperienceChapter />
          <WhatIDoChapter />
          <AboutChapter />
          <ContactChapter />
        </div>
      </main>

      <div className="film-spacer" ref={spacerRef} aria-hidden="true" />
    </>
  );
}
