import { portfolio } from "@/content/portfolio";
import { Section, Heading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Portrait } from "@/components/ui/portrait";

const { about, person, education } = portfolio;

export function About() {
  const [lead, ...rest] = about.paragraphs;

  return (
    <Section id="about">
      <Heading title="About" />

      <div className="grid gap-12 md:grid-cols-[minmax(0,300px)_1fr] md:gap-16 lg:gap-24">
        {/* portrait + identity */}
        <div className="md:sticky md:top-28 md:self-start">
          <Reveal kind="fade">
            <Portrait src={person.photo} alt={`${person.name}, ${person.role}`} />
          </Reveal>
          <div className="mt-4 space-y-1 text-[0.8125rem]">
            <p className="text-ink">{person.name}</p>
            <p className="text-ink-3">{person.role}</p>
            {person.location && <p className="text-ink-4">{person.location}</p>}
          </div>
        </div>

        {/* editorial copy */}
        <div>
          <Reveal kind="rise">
            <p className="max-w-[26ch] text-[clamp(1.3rem,1.9vw,1.65rem)] font-[430] leading-[1.4] tracking-[-0.018em] text-ink text-pretty sm:max-w-[34ch]">
              {lead}
            </p>
          </Reveal>

          <div className="mt-9 max-w-[60ch] space-y-5 text-[1rem] leading-relaxed text-ink-2">
            {rest.map((p, i) => (
              <Reveal key={i} kind="rise" delay={0.04 * (i + 1)}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          {about.now && (
            <Reveal kind="rise" delay={0.1}>
              <p className="mt-8 max-w-[46ch] text-[1.0625rem] leading-relaxed text-ink">
                {about.now}
              </p>
            </Reveal>
          )}

          {/* education, kept to a fact line */}
          <Reveal kind="rise" delay={0.05}>
            <dl className="mt-10 border-t border-line pt-8">
              {education.map((e) => (
                <div key={e.institution} className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-6">
                  <dt className="text-[0.9375rem] text-ink">{e.institution}</dt>
                  <dd className="text-[0.8125rem] text-ink-4 tnum sm:text-right">{e.period}</dd>
                  <dd className="text-[0.875rem] text-ink-3 sm:col-span-2">{e.credential}</dd>
                  {e.detail && (
                    <dd className="mt-1 max-w-[62ch] text-[0.8125rem] leading-relaxed text-ink-4 sm:col-span-2">
                      {e.detail}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
