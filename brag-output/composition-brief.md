# Hyperframes Composition Brief: Subhash Galla — Portfolio

## Objective
Create a short, restrained launch-style brag video for Subhash Galla's portfolio site — a scroll-scrubbed cinematic film-driven résumé, not a typical SaaS landing page.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: ~20-21 seconds

## Source Material
- Project root: `/Users/subhashgalla/Portfolio_Sub`
- Primary files read: `content/portfolio.ts`, `app/globals.css`, `components/film/chapters.tsx`, `app/layout.tsx`, `content/film.ts`, `README.md`
- Product name: Subhash Galla (portfolio)
- Tagline / strongest claim: "AI & Software Engineer building intelligent systems across LLMs, full-stack software, and cloud infrastructure." Kicker mantra: "Building. Intelligent. Tomorrow."
- Key UI or visual moment to recreate: the hero name treatment (two-tone chrome gradient over the graphite/light-streak film backdrop) and the work-chapter glass metric card
- Copy that must appear verbatim:
  - "BUILDING" / "INTELLIGENT" / "TOMORROW"
  - "Subhash Galla"
  - "AI & Software Engineer building intelligent systems across LLMs, full-stack software, and cloud infrastructure."
  - "+25% answer relevance vs LLM-only baseline"
  - "62 → 88% valid task completion"
  - "Let's build something that holds up."
  - "subhashgalla33@gmail.com"

## Creative Direction
- Tone preset: polished
- Creative direction: a quiet trailer for the engineer, not a hype reel — borrow the site's own cinematic vocabulary (light-streak backdrop, chrome type, chapter-numeral motif) but keep polished's restraint throughout.
- Interpretation: slow crossfades (0.6-0.8s), one idea per scene, generous negative space, confident but never shouting type. Mixed case, not all-caps (except the kicker labels, which are uppercase in the real site's own mono UI voice).
- Angle: This portfolio doesn't describe the person, it stages him — chapters, a progress rail, a poster frame per beat, a real 300-frame film scrubbed by scroll. The brag video is cut from that same film stock: restrained, chrome-and-graphite, no invented visual language.
- Hook: kicker mantra "Building. Intelligent. Tomorrow." landing one word at a time over the real hero backdrop.
- Outro / punchline: the contact chapter's own closing line, verbatim — "Let's build something that holds up." — email beneath it, silence under the hold.
- Avoid:
  - Generic SaaS language ("streamline your workflow" etc. — none of that exists in this project's real copy, don't invent any)
  - Abstract filler visuals (no generic particle systems, no stock gradients unrelated to the project's own film-ground/film-accent palette)
  - Unrelated visual redesign (don't invent a new color system — reuse the project's exact tokens below)
  - Any pink/purple tint bleeding onto the name type — this was explicitly fixed on the live site; the chrome gradient must stay neutral (near-white → slate), never magenta-shifted

## Visual Identity
- Background: graphite/blue-black film ground, `rgb(26 24 40)` baseline (this shifts per source frame — treat as "deep graphite-blue," not flat black)
- Text: warm ivory `rgb(241 239 233)` for body/labels
- Accent: light-streak magenta/pink `rgb(255 173 219)`, used only in the backdrop light streaks — never applied to type
- Name gradient (dedicated, not the general accent): `linear-gradient(180deg, rgb(252 252 253) 0%, rgb(226 230 237) 40%, rgb(151 160 176) 100%)` — bright near-white top fading to muted cool slate
- Display font: Archivo — semi-expanded (variable width axis), weight 600-700, tight negative tracking (~-0.015em) on the name
- Body font: Geist Sans (paragraph/tagline), weight 400
- Label/mono font: Geist Mono — uppercase, letter-spacing ~0.14em, used for the kicker words, metric labels, and email
- Visual references from the project:
  - `public/scroll-frames/001.png` — the site's real hero poster frame (graphite ground, magenta-to-blue light streaks entering from the right third of frame, subject on the right two-thirds). Use as backdrop plate for Scenes 1, 2, and 4.
  - The site's glass metric card treatment: dark smoked-glass panel, thin lit rim (cool blue-to-magenta gradient border), mono label above a large tabular-number stat — recreate in HTML for Scene 3, don't screenshot the live site.
  - The site's "SG" monogram (two letters, thin rule beside it) for a quiet corner mark in Scene 4 only — not a persistent watermark across every scene.

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract. Scene summary:

1. Hook — 5s — kicker mantra ("BUILDING" / "INTELLIGENT" / "TOMORROW") lands one word at a time over the real backdrop plate.
2. Reveal — 5s — "Subhash Galla" in the chrome gradient, two lines, tagline settles beneath verbatim.
3. Highlight — 6s — two real metric cards arrive one at a time: "+25% answer relevance vs LLM-only baseline", then "62 → 88% valid task completion".
4. Outro — 5s — "Let's build something that holds up." + email + quiet SG monogram corner mark, music fades to silence under the hold.

## Audio
- Audio role: sparse professional accents over a restrained bed
- Audio arc: fades in low under Scene 1, stays quiet and steady through Scenes 2-3, one gentle lift into Scene 4, fades to true silence under the final hold
- Music: `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3` (already copied to `composition/assets/music/` — see below)
- Music treatment: kept low throughout (ambient support, not foreground); never loud enough to compete with the type; one soft lift going into the outro line, then fade to silence
- Music cue guidance: preset JSON at `~/.claude/skills/brag/assets/music/cues/happy-beats-business-moves-vol-1-by-ende-dot-app.music-cues.json` (also referenced from the skill's bundled copy). Beat grid runs ~0.5s apart from 3.02s (120 BPM); strong cues cluster 16.02-23.52s, which lands under the Scene 3→4 transition and outro hold — good candidates for the metric card 2 arrival and the outro lift, within ±0.15s. Treat as optional timing hints only; readability wins any conflict.
- Audio-reactive treatment: subtle — the backdrop's light-streak glow/opacity may breathe faintly with music RMS. No waveform bars, no pulsing type, no strobing.
- Audio-coupled moments:
  - Scene 1 kicker words — soft tick per word, snapped to the beat grid
  - Scene 3 metric cards — one soft interface/card sound per arrival, snapped to the beat grid; consider landing card 2 near the 17-18s strong-cue window if the overall scene timeline allows
  - Scene 2 name reveal — beat-lock to a nearby strong cue only if one falls naturally near that timestamp in the final cut; otherwise natural timing for readability
- SFX selection guidance: sparse throughout; interface/card-style sounds for the metric cards, a light key/tick for the kicker words, nothing on the outro besides the music's own fade
- SFX analysis guidance: `~/.claude/skills/brag/assets/sfx/sfx-analysis.md` — prefer lower high-frequency-risk sounds since this video is quiet and polished, not busy
- Exact SFX choice: Hyperframes chooses exact filenames/timestamps/density once the animation timing exists
- Audio files: copy the chosen music (and any SFX Hyperframes selects) into `brag-output/composition/assets/`

## Hyperframes Instructions
Load the composition-building Hyperframes domain skills — `hyperframes-core` (composition contract + `data-*` timing), `hyperframes-animation` (motion), `hyperframes-creative` (design spec, beats, audio-reactive), `hyperframes-keyframes` (seek-safe keyframes), and `hyperframes-cli` (lint/check/render). `/brag` is its own workflow: do not enter the `hyperframes` entry-point intent interview and do not route into its generic promo/launch-video workflow. Prefer native Hyperframes conventions over anything in `/brag`.

Requirements:
- Show at least one real UI/copy/visual element from the source project (the chrome name treatment and the glass metric card both qualify — use both).
- Keep all text readable in the final render — hold every line to at least the reading-time floor from `step-2-plan.md`.
- Keep the video within 15-25 seconds (target ~20-21s).
- Include the planned music/SFX layer (not disabled, not documented as silent).
- Treat `/brag` audio notes as guidance, not a fixed cue sheet — choose exact SFX after the visual animation exists.
- Treat music cue metadata as optional timing hints; ignore cues that hurt readability, pacing, or the product story. Use at most 1-3 strong-cue locks in this video.
- Use SFX to support motion: card sounds for the metric-card reveals, light tick sounds for the kicker words, restraint everywhere else — this is a quiet, polished piece, not a busy one.
- Honor the planned fade-in / low-bed / single-lift / fade-to-silence music treatment.
- Wire at least one visual element (the backdrop light-streak glow) to subtle audio-reactive RMS, or document why extraction was unavailable — do not block the render on it.
- Use local assets (the bundled music file, `public/scroll-frames/001.png`, project fonts) rather than fetching anything remote.
- Run `hyperframes check` before render — it is brag's single gate.
