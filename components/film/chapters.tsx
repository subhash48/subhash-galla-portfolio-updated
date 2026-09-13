import Link from "next/link";
import { ArrowUpRightIcon, GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { portfolio } from "@/content/portfolio";
import { diagrams } from "@/content/diagrams";
import { pad } from "@/lib/utils";
import { Beat } from "./beat";
import { Glass } from "@/components/ui/glass";
import { GlassReactive } from "@/components/ui/glass-reactive";
import { SocialRow } from "@/components/ui/social-row";

const { person, hero, work, experience, capabilities, about, contact, education } = portfolio;

function heroLine() {
  return hero.lines.map((l, i) => (
    <span className="line" key={i}>
      <span style={{ "--i": i } as React.CSSProperties}>{l}</span>
    </span>
  ));
}

/* ---------------------------------------------------------------- */
/* 00 — Intro. The one thing every visitor sees before they scroll. */
/* ---------------------------------------------------------------- */
export function IntroChapter() {
  return (
    <div id="intro" data-chapter="intro">
      <Beat
        chapter="intro"
        window="0,0.62,0"
        anchor="lead"
        scrim="corner-lead"
        device="greet"
        posterFrame={1}
        posterAlt="Subhash Galla, front-facing portrait in a blue and pink cinematic void"
      >
        <h1 className="greet-line" style={{ "--i": 0 } as React.CSSProperties}>
          <span className="intro-name">{person.name}</span>
        </h1>
        <p className="greet-line intro-role" style={{ "--i": 1 } as React.CSSProperties}>
          {person.role}
        </p>
        <p className="greet-line intro-where label" style={{ "--i": 2 } as React.CSSProperties}>
          {person.location}
        </p>
      </Beat>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 01 — Identity. The city materialises as the value-prop lands.    */
/* ---------------------------------------------------------------- */
export function IdentityChapter() {
  return (
    <div id="identity" data-chapter="identity">
      <Beat
        chapter="identity"
        window="0.08,1,0.3,0.18"
        anchor="lead"
        scrim="corner-lead"
        device="lines"
        posterFrame={55}
        posterAlt="Subhash Galla turning as a neon city forms behind him"
        className="identity"
      >
        <h2 className="display">{heroLine()}</h2>
        <p className="sub">{hero.sub}</p>
      </Beat>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 02 — Selected work. Three chapters, one per pass through the     */
/* corridor; a one-line coda for the rest.                          */
/* ---------------------------------------------------------------- */
const WORK_WINDOWS: Record<string, string> = {
  "retrieval-augmented-chatbot": "0.02,0.36,0.22,0.14",
  "nl-robot-task-planner": "0.35,0.68,0.16,0.14",
  "food-logging-app": "0.67,0.94,0.16,0.14",
};
const WORK_POSTERS: Record<string, number> = {
  "retrieval-augmented-chatbot": 100,
  "nl-robot-task-planner": 140,
  "food-logging-app": 180,
};

export function WorkChapter() {
  const full = work.filter((p) => diagrams[p.slug] && p.impact);
  const coda = work.filter((p) => !(diagrams[p.slug] && p.impact));

  return (
    <div id="work" data-chapter="work">
      <h2 className="sr-only">Selected work</h2>
      {full.map((p) => (
        <Beat
          key={p.slug}
          chapter="work"
          window={WORK_WINDOWS[p.slug] ?? "0,1"}
          anchor="band"
          scrim="band"
          device="wipe"
          posterFrame={WORK_POSTERS[p.slug] ?? 130}
          posterAlt={`${p.name}: a corridor of neon signage`}
          className="work-beat"
        >
          <div className="card">
            <div className="work-index label">
              <span className="n">{pad(p.index)}</span>
              <span>{p.kind}</span>
              <span style={{ marginLeft: "auto" }}>{p.timeframe}</span>
            </div>
            <h3 className="work-title display">{p.name}</h3>
            <p className="work-impact">{p.impact}</p>
            {(p.links.caseStudy || p.links.repo) && (
              <div className="work-links">
                {p.links.caseStudy && (
                  <Link href={`/work/${p.slug}`} data-cursor="view" className="link">
                    Case study
                    <ArrowUpRightIcon weight="bold" />
                  </Link>
                )}
                {p.links.repo && (
                  <a href={p.links.repo} target="_blank" rel="noreferrer" className="link link--quiet">
                    <GithubLogoIcon className="size-4" /> Source
                  </a>
                )}
              </div>
            )}
          </div>
          <GlassReactive className="plane work-plane">
            {p.metrics?.[0] && (
              <div className="work-metric">
                <span className="v tnum">{p.metrics[0].value}</span>
                <span className="l">{p.metrics[0].label}</span>
              </div>
            )}
            <dl className="work-meta">
              <dt>Role</dt>
              <dd>{p.role}</dd>
              <dt>Stack</dt>
              <dd>{p.stack.join(", ")}</dd>
            </dl>
          </GlassReactive>
          {p.slug === "food-logging-app" && coda.length > 0 && (
            <p className="micro work-coda">
              Also: {coda.map((c) => c.name).join(" · ")}
            </p>
          )}
        </Beat>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 03 — Experience. He turns to face the camera; career, plainly.   */
/* ---------------------------------------------------------------- */
function years(period: string): string {
  const ys = period.match(/\d{4}/g);
  if (!ys) return period;
  return ys[0] === ys[ys.length - 1] ? ys[0] : `${ys[0]} – ${ys[ys.length - 1].slice(2)}`;
}

const EXP_WINDOWS = ["0.02,0.52,0.2,0.16", "0.5,1,0.2,0.14"];
const EXP_POSTERS = [210, 230];

export function ExperienceChapter() {
  return (
    <div id="experience" data-chapter="experience">
      <h2 className="sr-only">Experience</h2>
      {experience.map((role, i) => (
        <Beat
          key={role.company}
          chapter="experience"
          window={EXP_WINDOWS[i] ?? "0,1"}
          anchor="column"
          scrim="column"
          device="settle"
          posterFrame={EXP_POSTERS[i] ?? 220}
          posterAlt={`Subhash Galla in a corridor of ceiling light, ${role.company}`}
        >
          <div className="card">
            <span className="exp-year">
              {years(role.period)}
              <span className="period">{role.period}</span>
            </span>
            <h3 className="exp-company display">{role.company}</h3>
            <p className="exp-title">
              {role.title}
              {role.location ? <span style={{ color: "var(--ink-3)" }}> — {role.location}</span> : null}
            </p>
          </div>
          <Glass className="plane exp-plane">
            <ul>
              {role.highlights.map((h, j) => (
                <li key={j}>{h}</li>
              ))}
            </ul>
            <p className="exp-stack">{role.stack.join(" / ")}</p>
          </Glass>
        </Beat>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 04 — Capabilities. The plainest chapter, deliberately: quiet      */
/* before the close-up.                                              */
/* ---------------------------------------------------------------- */
export function CapabilitiesChapter() {
  return (
    <div id="capabilities" data-chapter="capabilities">
      <Beat
        chapter="capabilities"
        window="0.06,1,0.3,0.18"
        anchor="centre"
        scrim="centre"
        device="stagger"
        posterFrame={242}
        posterAlt="Subhash Galla, close, cyan and white light crossing his face"
      >
        <h2 className="sr-only">Capabilities</h2>
        <div className="cap-grid">
          {capabilities.map((g, i) => (
            <div className="col" key={g.key} style={{ "--i": i } as React.CSSProperties}>
              <h3 className="cap-head display">{g.label}</h3>
              <p className="cap-items">
                {g.items.map((item, j) => (
                  <span key={item}>
                    {j > 0 && <span className="sep"> · </span>}
                    {item}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      </Beat>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 05 — About. The peak: the close-up. A statement, then the story. */
/* ---------------------------------------------------------------- */
export function AboutChapter() {
  return (
    <div id="about" data-chapter="about">
      <Beat
        chapter="about"
        window="0,0.4,0,0.25"
        anchor="centre"
        scrim="centre"
        device="focus"
        posterFrame={259}
        posterAlt="Close-up on Subhash Galla, pink and cyan light streaks crossing his face"
      >
        <div className="card">
          <h2 className="about-statement display">
            {about.statement.map((l, i) => (
              <span className="line" key={i}>
                <span>{l}</span>
              </span>
            ))}
          </h2>
        </div>
      </Beat>
      <Beat
        chapter="about"
        window="0.36,1,0.22,0.16"
        anchor="low-lead"
        scrim="corner-low-lead"
        device="rise"
        posterFrame={275}
        posterAlt="Subhash Galla, eyes closing in warm violet light"
      >
        <Glass className="plane about-plane">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {about.now && <p className="about-now">{about.now}</p>}
        </Glass>
        <div className="aside about-aside">
          {education.map((e) => (
            <div key={e.institution}>
              <span className="label">{e.institution} · {e.period}</span>
              <p>
                <strong>{e.credential}</strong>
                {e.detail ? ` — ${e.detail}` : ""}
              </p>
            </div>
          ))}
        </div>
      </Beat>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 06 — Contact. The tunnel. The film resolves; it does not fade.   */
/* ---------------------------------------------------------------- */
export function ContactChapter() {
  return (
    <div id="contact" data-chapter="contact">
      <Beat
        chapter="contact"
        window="0.3"
        anchor="centre"
        scrim="centre"
        device="finale"
        posterFrame={296}
        posterAlt="A neon-light tunnel converging on Subhash Galla"
        className="contact"
      >
        <div className="card">
          <h2 className="display">
            {contact.lines.map((l, i) => (
              <span className="line" key={i}>
                <span>{l}</span>
              </span>
            ))}
          </h2>
          <a href={`mailto:${contact.primaryEmail}`} className="contact-email follow">
            <span className="u">{contact.primaryEmail}</span>
            <ArrowUpRightIcon weight="bold" />
          </a>
          <p className="contact-sub follow">{contact.sub}</p>
          <p className="contact-avail follow">
            {person.availability}
            {person.location ? `. Based in ${person.location}.` : "."}
          </p>
          <div className="contact-socials follow">
            <SocialRow />
          </div>
          <div className="contact-colophon follow label">
            <span>© {new Date().getFullYear()} {person.name}</span>
          </div>
        </div>
      </Beat>
    </div>
  );
}
