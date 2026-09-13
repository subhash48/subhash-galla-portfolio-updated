/*
  Single source of truth for every word and link on the site.
  Nothing here is invented: fields left as "" or [] render as empty/omitted,
  never as placeholder prose. Fill from the resume / real project data.
*/

export type Link = {
  label: string;
  href: string;
};

export type Social = {
  /** platform key drives the icon */
  kind: "github" | "linkedin" | "email" | "x" | "scholar" | "resume" | "website";
  href: string;
  handle?: string;
};

export type Project = {
  /** url-safe id, also the case-study route slug */
  slug: string;
  /** display index on the work spine, e.g. 1 -> "01" */
  index: number;
  name: string;
  /** one line, concrete outcome. what changed because this exists. */
  impact: string;
  /** 2-4 sentences for the expanded view */
  summary: string;
  role: string;
  /** e.g. "2025" or "2024 – 2025" (en dash for ranges, never an em dash) */
  timeframe: string;
  /** ordered, most load-bearing first; keep to ~6 */
  stack: string[];
  /** what the graph/domain tags are: e.g. ["Agentic AI", "Infra"] */
  domains: string[];
  /** short discipline line for the cinematic work view, e.g. "Retrieval / Orchestration" */
  kind: string;
  links: {
    live?: string;
    repo?: string;
    caseStudy?: boolean; // true when an internal /work/<slug> page should exist
  };
  media: {
    /** path under /public, 16:10 or 3:2. real screenshot or generated. */
    src: string;
    alt: string;
    /** optional secondary shots for the case study */
    gallery?: { src: string; alt: string }[];
  } | null;
  /** optional hard numbers: ONLY real, measured values */
  metrics?: { value: string; label: string }[];
};

export type Role = {
  company: string;
  title: string;
  /** "2024" / "2023 – 2024" / "2022 – Present" */
  period: string;
  location?: string;
  /** 2-4 bullets: what you owned, what shipped, measurable impact */
  highlights: string[];
  stack: string[];
};

export type Education = {
  institution: string;
  credential: string;
  period: string;
  detail?: string;
};

export type CapabilityGroup = {
  /** node cluster on the capability graph */
  key: string;
  label: string;
  /** ordered by fluency */
  items: string[];
};

export type Discipline = {
  /** two-line display title, e.g. ["AI Software", "Engineering"] */
  title: [string, string];
  /** one sentence, grounded in real project/experience evidence */
  blurb: string;
  /** short capability row; every tag must exist verbatim in `capabilities` */
  tags: string[];
};

export type Portfolio = {
  person: {
    name: string;
    /** short: "AI & Software Engineer" */
    role: string;
    /** the 1-2 sentence positioning, first person, confident, concrete */
    statement: string;
    location?: string;
    /** availability line for contact, or "" */
    availability: string;
    /** path under /public to the headshot, or null for the fallback panel */
    photo: string | null;
  };
  socials: Social[];
  /** primary nav order */
  nav: { id: string; label: string }[];
  hero: {
    /** the identity statement, one string per line; ALL CAPS is applied in CSS */
    lines: string[];
    /** the exact word (within `lines`) that takes the frame-derived accent, or "" */
    accent: string;
    /** <= 24 words, sits under the statement */
    sub: string;
  };
  about: {
    /** the oversized opening statement, one string per line */
    statement: string[];
    /** the word within `statement` that takes the accent, or "" */
    statementAccent: string;
    /** editorial: 2-3 short paragraphs, no "passionate", no clichés */
    paragraphs: string[];
    /** signals under the story: what you're doing now / thinking about */
    now?: string;
  };
  work: Project[];
  experience: Role[];
  education: Education[];
  capabilities: CapabilityGroup[];
  whatIDo: Discipline[];
  contact: {
    /** the oversized closing statement, one string per line */
    lines: string[];
    /** the word within `lines` that takes the accent, or "" */
    accent: string;
    sub: string;
    /** the one primary channel */
    primaryEmail: string;
  };
  meta: {
    siteUrl: string;
    /** for <title> template and OG */
    title: string;
    description: string;
    /** OG image is generated from name + role */
  };
};
