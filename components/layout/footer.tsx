import { portfolio } from "@/content/portfolio";
import { GraphMark } from "@/components/three/graph-mark";

export function Footer() {
  const year = new Date().getFullYear();
  const { person } = portfolio;

  return (
    <footer className="border-t border-line">
      <div className="wrap flex flex-col gap-6 py-10 text-[0.8125rem] text-ink-4 sm:flex-row sm:items-center sm:justify-between">
        <a
          href="#home"
          className="inline-flex items-center gap-2 text-ink-3 transition-colors hover:text-ink"
          aria-label="Back to top"
        >
          <GraphMark className="size-5 text-ink-4" />
          {person.name}
        </a>
        <p className="tnum">
          {year}. Built and designed from scratch.
        </p>
      </div>
    </footer>
  );
}
