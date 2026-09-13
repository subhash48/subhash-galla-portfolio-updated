/*
  The storyboard as data. Every number here was chosen by looking at the
  frames (see content/storyboard.md), not by dividing 300 evenly.

  Frames are 1-based to match the files on disk. Chapters own a scroll span
  measured in viewport-heights (`weight`); frames map linearly inside each
  chapter, so reverse scrolling replays the film exactly.
*/

export type Focal = readonly [frame: number, x: number, y: number];

export type ChapterId =
  | "intro"
  | "identity"
  | "work"
  | "experience"
  | "whatIDo"
  | "about"
  | "contact";

export type Chapter = {
  id: ChapterId;
  label: string;
  /** shown in the primary nav */
  nav: boolean;
  /** first and last frame of the chapter, 1-based, inclusive */
  frames: readonly [number, number];
  /** scroll span in viewport-heights */
  weight: number;
  /** chapter-local progress the nav lands on (first beat fully lit) */
  landing: number;
};

/**
 * Beat window in chapter-local progress: [from, to, rampIn, rampOut].
 * `to` omitted = hold to the end of the chapter (only the finale does this).
 * Ramps are fractions of the window; rampIn 0 = present the moment the
 * chapter begins (the greet form).
 */
export type Window = readonly [from: number, to?: number, rampIn?: number, rampOut?: number];

export const FILM = {
  frames: 300,
  fps: 24,
  size: { w: 1920, h: 1080 },
  // Both device classes currently load the same lossless PNG sequence —
  // maximum quality while the design is being judged (see scripts/build-film.mjs).
  // A lighter mobile-specific encode is a follow-up once the look is locked.
  src: {
    desktop: (i: number) => `/scroll-frames/${String(i).padStart(3, "0")}.png`,
    mobile: (i: number) => `/scroll-frames/${String(i).padStart(3, "0")}.png`,
  },
  /** one extra viewport so the last frame is a place the reader can rest */
  landing: 1,

  /** where the face is, in frame fractions, at authored keyframes */
  focal: [
    [1, 0.5, 0.33],
    [40, 0.5, 0.33],
    [78, 0.53, 0.34],
    [100, 0.54, 0.36],
    [124, 0.54, 0.36],
    [140, 0.55, 0.35],
    [165, 0.48, 0.33],
    [185, 0.45, 0.33],
    [196, 0.49, 0.34],
    [215, 0.47, 0.35],
    [230, 0.44, 0.37],
    [245, 0.44, 0.44],
    [250, 0.5, 0.44],
    [262, 0.49, 0.46],
    [275, 0.5, 0.46],
    [284, 0.5, 0.43],
    [300, 0.5, 0.39],
  ] as readonly Focal[],

  chapters: [
    { id: "intro", label: "Index", nav: true, frames: [1, 40], weight: 1.0, landing: 0 },
    { id: "identity", label: "Identity", nav: false, frames: [40, 78], weight: 1.2, landing: 0.38 },
    { id: "work", label: "Work", nav: true, frames: [78, 196], weight: 4.8, landing: 0.1 },
    { id: "experience", label: "Experience", nav: true, frames: [196, 236], weight: 2.6, landing: 0.16 },
    { id: "whatIDo", label: "What I Do", nav: true, frames: [236, 250], weight: 2.4, landing: 0.1 },
    { id: "about", label: "About", nav: true, frames: [250, 284], weight: 2.6, landing: 0.17 },
    { id: "contact", label: "Contact", nav: true, frames: [284, 300], weight: 1.4, landing: 0.5 },
  ] as readonly Chapter[],
} as const;

/** total scroll track in viewport-heights, before the landing viewport */
export const FILM_TOTAL = FILM.chapters.reduce((a, c) => a + c.weight, 0);

/** chapter start offsets in viewport-heights */
export const CHAPTER_START: Record<ChapterId, number> = (() => {
  const out = {} as Record<ChapterId, number>;
  let acc = 0;
  for (const c of FILM.chapters) {
    out[c.id] = acc;
    acc += c.weight;
  }
  return out;
})();

export function chapterOf(id: ChapterId): Chapter {
  return FILM.chapters.find((c) => c.id === id)!;
}
