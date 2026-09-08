# Subhash Galla — Portfolio

Personal portfolio for an AI &amp; software engineer. Dark, editorial, spatial. The
visual signature is a real-time compute graph whose strongest signal path traces
an **S**; the same node-and-edge language runs through the project diagrams, the
section transitions, and the favicon.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack, React 19.2) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Motion | Motion (`motion/react`) |
| 3D | React Three Fiber + drei + three — lazy-loaded, desktop only, static SVG fallback |
| Scroll | Lenis (JS-gated, reduced-motion aware) |
| Fonts | Bricolage Grotesque / Hanken Grotesk / JetBrains Mono via `next/font` |
| Icons | `@phosphor-icons/react` |
| Deploy | Vercel (zero config) |

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
npm run typecheck
```

## Structure

```
app/              routes, metadata, OG image, icon, robots, sitemap, 404
  work/[slug]/    per-project case-study pages
components/
  layout/         nav, footer, smooth scroll
  sections/       hero, work, about, experience, capabilities, contact
  three/          the compute-graph scene + static projection + monogram
  ui/             primitives: cta, reveal, magnetic, section, portrait, diagram
content/          portfolio.ts is the single source of truth for every word + link
lib/              utils, motion tokens
```

## Content

Everything visible lives in [`content/portfolio.ts`](content/portfolio.ts). Fields
left empty render as omitted, never as placeholder text. Outstanding items:

- GitHub &amp; LinkedIn URLs (`socials`)
- Headshot at `public/subhash-galla.jpg`
- Resume PDF at `public/subhash-galla-resume.pdf`
- Per-project repo / live links
- Operations Review Tracker: real impact line + metric
- `meta.siteUrl` → real domain
