import { CHAPTER_START, chapterOf, type ChapterId } from "@/content/film";

/** The scroll position that lands on a chapter's first fully-lit beat. */
export function chapterScrollY(id: ChapterId): number {
  const c = chapterOf(id);
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  return (CHAPTER_START[id] + c.weight * c.landing) * vh;
}

export function scrollToChapter(id: ChapterId) {
  window.scrollTo({ top: chapterScrollY(id), behavior: "smooth" });
}
