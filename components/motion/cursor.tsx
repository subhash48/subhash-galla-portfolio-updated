"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "rest" | "link" | "view" | "ext" | "glass";

/**
 * Minimal contextual cursor. A small blend-difference dot that tracks exactly,
 * and a ring that lags on a spring and morphs to a labelled pill over targets:
 *   [data-cursor="view"] → VIEW      external links → ↗      other interactive → a wider ring
 *   a .glass surface (and nothing more specific) → a small inverted ring
 *
 * Fine-pointer only; disabled entirely under reduced motion (native cursor then
 * stays). rAF + refs — no re-render on move; mode is the only React state.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("rest");

  const wrapRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const s = useRef({ x: -100, y: -100, rx: -100, ry: -100, shown: false, raf: 0 });

  useEffect(() => {
    const mq = window.matchMedia(
      "(pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    if (!mq.matches) return;
    const enableRaf = requestAnimationFrame(() => setEnabled(true));
    document.documentElement.dataset.cursor = "on";

    const st = s.current;

    const tick = () => {
      st.rx += (st.x - st.rx) * 0.18;
      st.ry += (st.y - st.ry) * 0.18;
      if (dotRef.current)
        dotRef.current.style.transform = `translate3d(${st.x}px, ${st.y}px, 0) translate(-50%, -50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate3d(${st.rx}px, ${st.ry}px, 0) translate(-50%, -50%)`;
      st.raf = requestAnimationFrame(tick);
    };
    st.raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      st.x = e.clientX;
      st.y = e.clientY;
      if (!st.shown) {
        st.shown = true;
        st.rx = e.clientX;
        st.ry = e.clientY;
        wrapRef.current?.setAttribute("data-shown", "true");
      }
    };
    const onLeave = () => {
      st.shown = false;
      wrapRef.current?.removeAttribute("data-shown");
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest?.(
        "a, button, [data-cursor], [role='button'], input, textarea, select, label",
      ) as HTMLElement | null;
      if (el) {
        const dc = el.getAttribute("data-cursor");
        if (dc === "view") return setMode("view");
        if (
          dc === "ext" ||
          (el.tagName === "A" && el.getAttribute("target") === "_blank")
        )
          return setMode("ext");
        return setMode("link");
      }
      // no specific interactive target — but a glass surface still gets a
      // quiet acknowledgement, never a full label
      if (target?.closest?.(".glass")) return setMode("glass");
      setMode("rest");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(enableRaf);
      cancelAnimationFrame(st.raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      delete document.documentElement.dataset.cursor;
    };
  }, []);

  if (!enabled) return null;

  const labelled = mode === "view" || mode === "ext";

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[110] opacity-0 transition-opacity duration-300 data-[shown=true]:opacity-100"
    >
      <div
        ref={dotRef}
        className="absolute left-0 top-0 size-1.5 rounded-full bg-white mix-blend-difference transition-[width,height,opacity] duration-200"
        style={labelled || mode === "glass" ? { opacity: 0 } : undefined}
      />
      <div
        ref={ringRef}
        className={
          "absolute left-0 top-0 grid place-items-center rounded-full transition-[width,height,background-color,color,border-color] duration-[240ms] ease-[cubic-bezier(0.76,0,0.24,1)] " +
          (labelled
            ? "size-14 bg-ink text-ground"
            : mode === "glass"
              ? "size-6 border border-white/70 mix-blend-difference"
              : mode === "link"
                ? "size-10 border border-ink/40"
                : "size-8 border border-ink/25")
        }
      >
        <span className="font-mono text-[0.5625rem] font-medium uppercase tracking-[0.14em]">
          {mode === "view" ? "View" : mode === "ext" ? "↗" : ""}
        </span>
      </div>
    </div>
  );
}
