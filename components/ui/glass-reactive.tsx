"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Glass that feels physical: the specular highlight drifts toward the pointer
 * and lifts a hair as it gets close. rAF + CSS custom properties, no
 * re-render. Fine-pointer + motion-allowed only; otherwise a plain <Glass>.
 */
export function GlassReactive({
  className,
  children,
  reach = 560,
}: {
  className?: string;
  children?: React.ReactNode;
  /** px radius over which the pointer influences the highlight */
  reach?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      !window.matchMedia(
        "(pointer: fine) and (prefers-reduced-motion: no-preference)",
      ).matches
    )
      return;

    const s = { tx: 30, ty: 4, mx: 30, my: 4, spec: 0.75, tspec: 0.75, raf: 0 };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy);
      const near = Math.max(0, 1 - d / reach);
      s.tx = 50 + ((e.clientX - cx) / Math.max(r.width, 1)) * 46;
      s.ty = Math.max(-8, ((e.clientY - r.top) / Math.max(r.height, 1)) * 22 - 4);
      s.tspec = 0.55 + near * 0.5;
    };
    const reset = () => {
      s.tx = 30;
      s.ty = 0;
      s.tspec = 0.75;
    };

    const tick = () => {
      s.mx += (s.tx - s.mx) * 0.08;
      s.my += (s.ty - s.my) * 0.08;
      s.spec += (s.tspec - s.spec) * 0.08;
      el.style.setProperty("--glass-mx", `${s.mx.toFixed(1)}%`);
      el.style.setProperty("--glass-my", `${s.my.toFixed(1)}%`);
      el.style.setProperty("--glass-spec", s.spec.toFixed(3));
      s.raf = requestAnimationFrame(tick);
    };
    s.raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("blur", reset);
      document.removeEventListener("pointerleave", reset);
    };
  }, [reach]);

  return (
    <div ref={ref} className={cn("glass", className)}>
      {children}
    </div>
  );
}
