"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { portfolio } from "@/content/portfolio";
import { FILM, type ChapterId } from "@/content/film";
import { scrollToChapter } from "@/lib/film-nav";
import { DUR, EASE_OUT } from "@/lib/motion";

const NAV_CHAPTERS = FILM.chapters.filter((c) => c.nav);
const { person } = portfolio;
/** "Subhash Galla" -> "SG": a quiet monogram, not the full name, in the nav */
const monogram = person.name
  .split(" ")
  .map((w) => w[0])
  .join("")
  .toUpperCase();

function go(e: React.MouseEvent, id: ChapterId) {
  e.preventDefault();
  scrollToChapter(id);
}

export function Nav() {
  const [active, setActive] = useState<ChapterId>("intro");
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onChapter = (e: Event) => setActive((e as CustomEvent<{ id: ChapterId }>).detail.id);
    window.addEventListener("film:chapter", onChapter);
    return () => window.removeEventListener("film:chapter", onChapter);
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
    <header className="nav">
      <a href="#intro" onClick={(e) => go(e, "intro")} className="nav-name" aria-label={`${person.name}, back to the top`}>
        {monogram}
      </a>

      <ul className="nav-links" aria-label="Chapters">
        {NAV_CHAPTERS.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              data-nav-link={c.id}
              aria-current={active === c.id ? "true" : undefined}
              onClick={(e) => go(e, c.id)}
              className="nav-link"
            >
              {c.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="nav-menu-btn"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        {open ? <XIcon size={18} /> : <ListIcon size={18} />}
        {!open && <span>Menu</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.01 : DUR.ui, ease: EASE_OUT }}
          >
            <ul>
              {NAV_CHAPTERS.map((c, i) => (
                <li key={c.id} style={{ "--i": i } as React.CSSProperties}>
                  <a
                    href={`#${c.id}`}
                    aria-current={active === c.id ? "true" : undefined}
                    onClick={(e) => {
                      go(e, c.id);
                      setOpen(false);
                    }}
                    className="menu-link"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
