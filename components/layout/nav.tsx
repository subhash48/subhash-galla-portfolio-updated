"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { portfolio } from "@/content/portfolio";
import { cn } from "@/lib/utils";
import { DUR, EASE_OUT } from "@/lib/motion";
import { GraphMark } from "@/components/three/graph-mark";

const { nav, person } = portfolio;

export function Nav() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 24;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    const ids = nav.map((n) => n.id);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] transition-colors duration-[--dur-panel] ease-out",
        "before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-24 before:bg-gradient-to-b before:from-canvas before:to-transparent before:content-['']",
        scrolled
          ? "border-b border-line bg-canvas/72 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="wrap flex h-[--nav-h] items-center justify-between"
      >
        <a
          href="#home"
          className="group flex items-center gap-2.5 text-[0.9375rem] tracking-tight text-ink"
          aria-label={`${person.name}, back to top`}
        >
          <GraphMark className="size-[26px] text-signal" />
          <span className="font-medium">{person.name}</span>
        </a>

        {/* desktop */}
        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className={cn(
                  "relative rounded-control px-3 py-1.5 text-[0.8125rem] transition-colors duration-[--dur-ui] ease-out",
                  active === item.id ? "text-ink" : "text-ink-3 hover:text-ink-2",
                )}
              >
                {item.label}
                {active === item.id && (
                  <motion.span
                    layoutId={reduce ? undefined : "nav-active"}
                    className="absolute inset-x-3 -bottom-px h-px bg-signal"
                    transition={{ duration: DUR.ui, ease: EASE_OUT }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative z-[80] -mr-1.5 grid size-9 place-items-center rounded-control text-ink md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <XIcon size={20} /> : <ListIcon size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] bg-canvas md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.ui }}
          >
            <ul className="wrap flex flex-col gap-1 pt-[calc(var(--nav-h)+2rem)]">
              {nav.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: DUR.panel, ease: EASE_OUT }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 border-b border-line py-4 text-2xl tracking-tight text-ink"
                  >
                    <span className="label text-ink-4!">{String(i + 1).padStart(2, "0")}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
