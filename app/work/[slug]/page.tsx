import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { portfolio } from "@/content/portfolio";
import { diagrams } from "@/content/diagrams";
import { pad } from "@/lib/utils";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
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
  const project = portfolio.work.find((w) => w.slug === slug && w.links.caseStudy);
  if (!project) notFound();

  return (
    <>
      <Nav />
      <main className="wrap pt-[calc(var(--nav-h)+4rem)] pb-24">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-[0.8125rem] text-ink-3 transition-colors hover:text-ink"
        >
          <ArrowLeftIcon className="size-4" /> All work
        </Link>

        <header className="mt-10">
          <div className="flex items-center gap-4">
            <span className="label text-ink-4! tnum">{pad(project.index)}</span>
            <span className="label text-ink-4! tnum">{project.timeframe}</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-[-0.035em] text-ink">
            {project.name}
          </h1>
          <p className="mt-5 max-w-[34rem] text-[1.125rem] leading-relaxed text-ink-2">
            {project.impact}
          </p>
        </header>

        {diagrams[project.slug] && (
          <figure className="mt-14 overflow-hidden rounded-media border border-line bg-canvas-sunk p-6 sm:p-10">
            <PipelineDiagram slug={project.slug} />
          </figure>
        )}

        <div className="mt-14 grid gap-12 md:grid-cols-[minmax(0,36rem)_16rem]">
          <div className="space-y-5 text-[1rem] leading-relaxed text-ink-2">
            {project.summary.split("\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <aside className="space-y-6 text-[0.8125rem]">
            {project.metrics && project.metrics.length > 0 && (
              <div className="space-y-3">
                {project.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-2xl tracking-tight text-signal tnum">{m.value}</div>
                    <p className="mt-0.5 text-ink-3">{m.label}</p>
                  </div>
                ))}
              </div>
            )}
            <dl className="space-y-3 border-t border-line pt-6">
              <div>
                <dt className="text-ink-4">Role</dt>
                <dd className="mt-0.5 text-ink-2">{project.role}</dd>
              </div>
              <div>
                <dt className="text-ink-4">Stack</dt>
                <dd className="mt-0.5 text-ink-2">{project.stack.join(", ")}</dd>
              </div>
              <div>
                <dt className="text-ink-4">Domains</dt>
                <dd className="mt-0.5 text-ink-2">{project.domains.join(", ")}</dd>
              </div>
            </dl>
            {project.links.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-signal"
              >
                <GithubLogoIcon className="size-4" /> Source
              </a>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
