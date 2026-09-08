import { portfolio } from "@/content/portfolio";
import { diagrams } from "@/content/diagrams";
import { pad } from "@/lib/utils";
import { Section, Heading } from "@/components/ui/section";
import { ProjectEntry } from "./project-entry";

export function Work() {
  const full = portfolio.work.filter((p) => diagrams[p.slug] && p.impact);
  const compact = portfolio.work.filter((p) => !diagrams[p.slug] || !p.impact);

  return (
    <Section id="work">
      <Heading
        title="Selected work"
        lead="Four builds, each measured against a baseline before it counted as done. The diagrams are the real data paths, not screenshots."
      />

      <div>
        {full.map((project) => (
          <ProjectEntry key={project.slug} project={project} />
        ))}
      </div>

      {compact.length > 0 && (
        <ul className="mt-4 border-t border-line">
          {compact.map((p) => (
            <li
              key={p.slug}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line py-5 text-sm"
            >
              <span className="label text-ink-4! tnum">{pad(p.index)}</span>
              <span className="text-ink">{p.name}</span>
              <span className="text-ink-4">{p.stack.join("  ·  ")}</span>
              <span className="ml-auto text-ink-4 tnum">{p.timeframe}</span>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
