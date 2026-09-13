# Product

<!-- impeccable:product-schema 1 -->

_Self-authored from the owner's written brief (2026-09-13); facts marked (inferred) were not confirmed in an interview._

## Platform

web

## Users

Hiring managers, recruiters and engineers evaluating Subhash Galla for AI and software engineering roles. They arrive from a résumé link, LinkedIn or GitHub, usually on a laptop, sometimes on a phone, and decide within a minute whether to read further and get in touch. (inferred)

## Product Purpose

A personal portfolio that presents Subhash's identity, selected projects, experience, capabilities, story and contact details as one continuous scroll-driven film. Success: the visitor understands what he builds (grounded LLM systems and the full-stack products around them), can find the evidence, and emails him.

## Positioning

Not a card-based developer portfolio. A cinematic interactive identity: a 300-frame sequence generated from his own likeness is scrubbed by the visitor's scroll, and every chapter of the portfolio is timed to a visual event in that sequence. The interface is lit by the film.

## Constraints

- All factual content comes from `content/portfolio.ts` (résumé-derived). Nothing invented; empty fields render as omitted.
- Scroll stays native. No scroll hijacking, no autoplaying video, no `<img>` per frame.
- Reduced motion gets a static, fully readable document with key-frame posters.
- Canvas imagery is decorative; every word is real HTML, keyboard reachable, SEO intact (metadata, OG, sitemap, robots, JSON-LD).
- Stack: Next.js 16 App Router, React 19, Tailwind v4, Motion. Deployed to Vercel.

## Assets

- `ezgif-74beda69edc28760-jpg/` source frames (1280x720 JPEG, 300 frames); served copies in `public/film`.
- Architecture diagrams per project in `content/diagrams.ts` (real data paths, rendered as SVG).
- Missing from the owner: GitHub and LinkedIn URLs, résumé PDF, per-project repo links, a real impact line for the Operations Review Tracker, final domain.
