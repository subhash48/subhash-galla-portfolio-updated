import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { portfolio } from "@/content/portfolio";
import { diagrams } from "@/content/diagrams";
import { pad } from "@/lib/utils";
import { Nav } from "@/components/layout/nav";
import { PipelineDiagram } from "@/components/ui/pipeline-diagram";

export function generateStaticParams() {
  return portfolio.work
    .filter((p) => p.links.caseStudy)
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = portfolio.work.find((w) => w.slug === slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.impact || p.summary,
    alternates: { canonical: `/work/${p.slug}` },
  };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = portfolio.work.find(
    (w) => w.slug === slug && w.links.caseStudy,
  );
  if (!project) notFound();

  return (
    <>
      <Nav />
      <main id="main" className="wrap" style={{ paddingTop: "calc(var(--nav-h) + 5rem)", paddingBottom: "7rem" }}>
        <Link href="/#work" className="link link--quiet">
          <ArrowLeftIcon className="size-4" /> Selected work
        </Link>

        <header style={{ marginTop: "3rem" }}>
          <p className="label" style={{ display: "flex", gap: "0.75rem", alignItems: "baseline" }}>
            <span className="tnum" style={{ color: "var(--accent)" }}>{pad(project.index)}</span>
            <span>{project.kind}</span>
            <span className="tnum">{project.timeframe}</span>
          </p>
          <h1 className="display" style={{ marginTop: "1.5rem", maxWidth: "16ch", fontSize: "clamp(2.25rem, 6vw, 4.75rem)" }}>
            {project.name}
          </h1>
          <p style={{ marginTop: "1.75rem", maxWidth: "40ch", fontSize: "1.125rem", lineHeight: 1.6, color: "var(--ink-2)" }}>
            {project.impact}
          </p>
        </header>

        {diagrams[project.slug] && (
          <figure style={{ marginTop: "4rem", perspective: "2000px" }}>
            <div style={{ transform: "rotateX(3deg)", filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.5))" }}>
              <PipelineDiagram slug={project.slug} className="w-full" />
            </div>
            <figcaption className="label" style={{ marginTop: "1.5rem" }}>
              {project.domains.join(" / ")}
            </figcaption>
          </figure>
        )}

        <div style={{ marginTop: "4rem", display: "grid", gap: "3rem" }} className="cs-grid">
          <div style={{ fontSize: "1.0625rem", lineHeight: 1.65, color: "var(--ink-2)", display: "grid", gap: "1.25rem" }}>
            {project.summary.split("\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <aside style={{ fontSize: "0.8125rem", display: "grid", gap: "2rem", alignContent: "start" }}>
            {project.metrics && project.metrics.length > 0 && (
              <div style={{ display: "grid", gap: "1rem" }}>
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="display tnum" style={{ fontSize: "2.5rem", color: "var(--accent)", textTransform: "none" }}>
                      {m.value}
                    </div>
                    <p style={{ marginTop: "0.375rem", color: "var(--ink-3)" }}>{m.label}</p>
                  </div>
                ))}
              </div>
            )}
            <dl style={{ display: "grid", gap: "0.75rem", borderTop: "1px solid var(--line)", paddingTop: "1.5rem" }}>
              <div>
                <dt style={{ color: "var(--ink-4)" }}>Role</dt>
                <dd style={{ marginTop: "0.125rem", color: "var(--ink-2)" }}>{project.role}</dd>
              </div>
              <div>
                <dt style={{ color: "var(--ink-4)" }}>Stack</dt>
                <dd style={{ marginTop: "0.125rem", color: "var(--ink-2)" }}>{project.stack.join(", ")}</dd>
              </div>
            </dl>
            {project.links.repo && (
              <a href={project.links.repo} target="_blank" rel="noreferrer" className="link link--quiet">
                <GithubLogoIcon className="size-4" /> Source
              </a>
            )}
          </aside>
        </div>

        <div style={{ marginTop: "5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <Link href="/#work" className="link">
            <ArrowLeftIcon className="size-4" /> Back to selected work
          </Link>
          <p className="label">{portfolio.person.name}</p>
        </div>
      </main>
      <style>{`@media (min-width: 768px) { .cs-grid { grid-template-columns: minmax(0, 38rem) 1fr; gap: 4rem; } }`}</style>
    </>
  );
}
