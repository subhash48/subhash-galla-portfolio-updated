import { portfolio } from "@/content/portfolio";
import { Section, Heading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

const { experience } = portfolio;

export function Experience() {
  return (
    <Section id="experience">
      <Heading
        title="Experience"
        lead="Two roles across the same two years: an AI engineering internship, and the front line of a university computer lab."
      />

      <ol className="relative">
        {/* the spine */}
        <span
          className="absolute left-0 top-2 bottom-2 w-px bg-line md:left-[10.5rem]"
          aria-hidden
        />

        {experience.map((role, i) => (
          <li key={role.company + role.title}>
            <Reveal kind="rise" delay={i * 0.05}>
              <div className="relative grid gap-x-10 gap-y-4 py-10 md:grid-cols-[10.5rem_1fr] md:py-14">
                {/* period + node */}
                <div className="flex items-start gap-4 md:flex-col md:gap-0">
                  <span
                    className={
                      "relative z-[1] mt-1.5 size-2 shrink-0 rounded-full ring-4 ring-canvas md:absolute md:left-[10.5rem] md:-translate-x-1/2 " +
                      (i === 0 ? "bg-signal" : "bg-ink-4")
                    }
                    aria-hidden
                  />
                  <span className="label whitespace-nowrap text-ink-3! tnum tracking-[0.08em]">
                    {role.period}
                  </span>
                </div>

                {/* body */}
                <div className="md:pl-10">
                  <h3 className="text-[1.25rem] tracking-[-0.02em] text-ink">
                    {role.title}
                  </h3>
                  <p className="mt-0.5 text-[0.9375rem] text-ink-3">
                    {role.company}
                    {role.location ? `  ·  ${role.location}` : ""}
                  </p>

                  <ul className="mt-5 space-y-3 md:max-w-[64ch]">
                    {role.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="grid grid-cols-[auto_1fr] gap-3 text-[0.9375rem] leading-relaxed text-ink-2"
                      >
                        <span className="mt-2 h-px w-3 shrink-0 bg-ink-4" aria-hidden />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 font-mono text-[0.75rem] leading-relaxed text-ink-4">
                    {role.stack.join("  /  ")}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
