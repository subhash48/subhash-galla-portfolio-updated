import { portfolio } from "@/content/portfolio";
import { pad } from "@/lib/utils";
import { Section, Heading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const { capabilities } = portfolio;

export function Capabilities() {
  return (
    <Section id="capabilities">
      <Heading
        title="Capabilities"
        lead="Grouped by where they sit in a system, ordered by how often I reach for them."
      />

      <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((group, i) => (
          <Reveal key={group.key} kind="rise" delay={(i % 3) * 0.05}>
            <div>
              <div className="flex items-center gap-2.5 border-b border-line pb-3">
                <span className="size-1.5 rounded-full bg-signal" aria-hidden />
                <h3 className="text-[0.9375rem] tracking-tight text-ink">{group.label}</h3>
                <span className="label ml-auto text-ink-4! tnum">{pad(group.items.length)}</span>
              </div>

              <ul className="mt-4 flex flex-wrap gap-x-1.5 gap-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-chip border border-line px-2 py-1 text-[0.8125rem] text-ink-3 transition-colors duration-[--dur-micro] hover:border-signal-dim hover:text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
