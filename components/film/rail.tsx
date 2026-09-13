"use client";

import { FILM, FILM_TOTAL, CHAPTER_START, type ChapterId } from "@/content/film";
import { scrollToChapter } from "@/lib/film-nav";
import { pad } from "@/lib/utils";

/**
 * The restrained scroll indicator: a fine vertical line, a tick per chapter,
 * and a marker at --film-p (written every frame by the engine, read purely
 * in CSS via app/globals.css — no React state on scroll). Desktop only;
 * on a phone the nav carries wayfinding instead.
 */
export function Rail() {
  return (
    <nav className="rail" aria-label="Film progress">
      <span className="rail-index rail-index--start label" aria-hidden>
        {pad(1)}
      </span>
      <div className="rail-marker" aria-hidden />
      {FILM.chapters.map((c) => (
        <button
          key={c.id}
          type="button"
          data-rail-tick={c.id}
          className="rail-tick"
          style={{ top: `${(CHAPTER_START[c.id as ChapterId] / FILM_TOTAL) * 100}%` }}
          aria-label={c.label}
          onClick={() => scrollToChapter(c.id as ChapterId)}
        />
      ))}
      <span className="rail-index rail-index--end label" aria-hidden>
        {pad(FILM.chapters.length)}
      </span>
    </nav>
  );
}
