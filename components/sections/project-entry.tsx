"use client";

import { useRef } from "react";
import Link from "next/link";
import { useInView } from "motion/react";
import { ArrowRightIcon, GithubLogoIcon } from "@phosphor-icons/react";
import type { Project } from "@/content/types";
import { pad } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { PipelineDiagram } from "@/components/ui/pipeline-diagram";

export function ProjectEntry({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const { links } = project;
  const hasCase = links.caseStudy;

  const Title = hasCase ? Link : "div";
  const titleProps = hasCase ? { href: `/work/${project.slug}` } : {};

  return (
    <article
      ref={ref}
      data-paused={!inView}
      className="group relative grid gap-x-10 gap-y-6 border-t border-line py-10 md:grid-cols-[1fr_minmax(0,1.05fr)] md:py-14 lg:gap-x-16"
    >
      {/* left: index, name, impact, meta */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <span className="label text-ink-4! tnum">{pad(project.index)}</span>
          <span className="label text-ink-4! tnum">{project.timeframe}</span>
        </div>

        <Reveal kind="rise" className="mt-4">
          <Title
            {...(titleProps as { href: string })}
            className={
              "block text-[clamp(1.5rem,2.4vw,2rem)] leading-tight tracking-[-0.03em] text-ink " +
              (hasCase
                ? "transition-colors duration-[--dur-ui] hover:text-signal focus-visible:text-signal"
                : "")
            }
          >
            {project.name}
            {hasCase && (
              <ArrowRightIcon
                weight="bold"
                className="ml-2 inline size-4 -translate-y-px opacity-0 transition-all duration-[--dur-ui] group-hover:translate-x-1 group-hover:opacity-100"
              />
            )}
          </Title>
        </Reveal>

        <Reveal kind="rise" delay={0.05}>
          <p className="mt-4 max-w-[40ch] text-[1.0625rem] leading-relaxed text-ink-2">
            {project.impact || project.summary}
          </p>
        </Reveal>

        <div className="mt-auto pt-8">
          {project.metrics && project.metrics.length > 0 && (
            <dl className="mb-6 flex flex-wrap gap-x-8 gap-y-3">
              {project.metrics.map((m) => (
                <div key={m.label}>
                  <dt className="sr-only">{m.label}</dt>
                  <dd className="text-2xl tracking-tight text-signal tnum">{m.value}</dd>
                  <p className="mt-0.5 max-w-[18ch] text-xs leading-snug text-ink-3">{m.label}</p>
                </div>
              ))}
            </dl>
          )}

          <dl className="space-y-2 text-[0.8125rem]">
            <div className="flex gap-3">
              <dt className="w-14 shrink-0 text-ink-4">Role</dt>
              <dd className="text-ink-3">{project.role}</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-14 shrink-0 text-ink-4">Stack</dt>
              <dd className="text-ink-3">{project.stack.join("  ·  ")}</dd>
            </div>
          </dl>

          {(links.repo || hasCase) && (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem]">
              {links.repo && (
                <a
                  href={links.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-signal"
                >
                  <GithubLogoIcon className="size-4" /> Source
                </a>
              )}
              {hasCase && (
                <Link
                  href={`/work/${project.slug}`}
                  className="inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-signal"
                >
                  Case study <ArrowRightIcon className="size-3.5" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* right: architecture schematic */}
      <div className="self-center">
        <Reveal kind="wipe">
          <figure className="overflow-hidden rounded-media border border-line bg-canvas-sunk p-5 sm:p-7">
            <PipelineDiagram slug={project.slug} />
            <figcaption className="mt-4 flex flex-wrap gap-2">
              {project.domains.map((tag) => (
                <span
                  key={tag}
                  className="rounded-chip border border-line px-2 py-0.5 text-[0.6875rem] text-ink-3"
                >
                  {tag}
                </span>
              ))}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </article>
  );
}
