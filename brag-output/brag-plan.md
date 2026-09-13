# Brag Plan: Subhash Galla — Portfolio

## What is this app?
A personal portfolio for an AI & Software Engineer where scrolling doesn't just reveal sections — it scrubs a real 300-frame cinematic film of the person, with each résumé chapter (work, experience, what he does, about, contact) composited over a specific frame of that film.

## The angle
Most portfolios describe the person. This one is staged like a real film — chapters, a progress rail, a poster frame per beat, a title-card hero. The brag video should feel like a trailer cut from that same film stock, using the site's own restrained chrome-and-graphite identity rather than inventing a new one. The specificity is the joke-free hook: this isn't a template, it's an engineer who built his own film engine to introduce himself.

## Hook (first 2-3 seconds)
The site's own kicker mantra — "Building. Intelligent. Tomorrow." — landing one word at a time over the exact hero backdrop (frame 001 of the real sequence: deep graphite-blue ground, magenta-to-blue light streaks bleeding in from the right).

## Key moments (the middle)
- The brushed-steel name reveal — "Subhash Galla" at full scale in the site's real two-tone chrome gradient (bright top, cooling to slate at "Galla"), tagline settling beneath it verbatim.
- Two real proof points from the actual case studies, arriving one at a time like the site's own glass metric cards: "+25% answer relevance vs LLM-only" then "62 → 88% valid task completion" — not claims, measured deltas.

## Outro / punchline
Cut straight to the site's own closing line, verbatim: "Let's build something that holds up." — email beneath it, the SG monogram quiet in the corner, music fading to silence under the hold. No CTA button, no logo sting — the line is the punchline.

## User flow worth showing
None — landing-page only, no app/login/upload flow. The closest thing to a "flow" is the site's own scroll-to-chapter mechanic (scroll position scrubs the film + drives which chapter's copy is on screen) — this is referenced conceptually in Scene 1/2's backdrop continuity, not as an interactive demo.

## Tone
- Preset: polished
- Creative direction: "a quiet trailer for the engineer, not a hype reel" — borrow the site's own cinematic vocabulary (light-streak backdrop, chapter-numeral motif, chrome type) but keep polished's restraint: slow holds, generous negative space, no shouting.
- Interpretation: Slow crossfades (0.6–0.8s), one idea per scene, mixed-case type at confident but not aggressive scale. The site already fixed its own hero to be "cinematic, premium, editorial, calm, intentional" — the brag video should read as the same brand, not a louder cousin of it.

## Format: landscape — 1920x1080
## Duration: ~20s (target 20-21s)

## Visual identity (from the project)
- Background: graphite/blue-black film ground — `--film-ground` (~rgb(26 24 40), shifts per frame)
- Accent: light-streak magenta/pink — `--film-accent` ~rgb(255 173 219), used sparingly, never on type
- Text: warm ivory `rgb(241 239 233)` for body/labels; name uses a dedicated two-tone chrome gradient from near-white `rgb(252 252 253)` to muted slate `rgb(151 160 176)` — never tinted pink/purple
- Display font: Archivo (semi-expanded via variable-font width axis, weight 600–700)
- Body / label font: Geist Sans (body), Geist Mono (labels, indices, metrics — uppercase, tracked out)
- Strongest visual element: the hero's own name treatment (chrome gradient over the film backdrop) + the work chapter's glass metric cards (dark smoked glass, thin lit rim, tabular-number stat)
- Reference frame asset: `public/scroll-frames/001.png` (the site's own intro poster frame — use as the backdrop plate for hook/reveal/outro scenes)

## Share copy (draft)
I gave my portfolio a hero film instead of a hero image — 300 frames, scroll-scrubbed, one take. Here's 20 seconds of it.

## Audio direction
- Role: sparse professional accents over a restrained bed
- Music: `happy-beats-business-moves-vol-1-by-ende-dot-app.mp3` (120 BPM) — the only bundled track; treated quietly rather than as a driving hype loop, so it reads as ambient support, not the site's genre
- Music treatment: fade in under Scene 1, held low (background presence, not foreground), one gentle lift going into Scene 4, fade to silence under the final hold — never loud enough to fight the type
- Music cue guidance: preset at `assets/music/cues/happy-beats-business-moves-vol-1-by-ende-dot-app.music-cues.json` — strong cues cluster at 16.02–23.52s (1.00 strength), which lands naturally under Scene 3→4's transition and the outro hold. Beat grid is ~0.5s apart (120 BPM) from 3.02s on — use for the kicker word-by-word reveal and the two metric-card arrivals.
- Audio-reactive treatment: subtle — let the backdrop's light-streak glow/opacity breathe faintly with music RMS (it's already a "signal" motif in the site); no waveform bars, no pulsing type
- SFX posture: sparse; one soft tick per kicker word, one soft card/interface sound per metric-card arrival, restraint everywhere else
- Audio-coupled moments: kicker word reveal (typed/ticked, beat-grid), metric card arrivals (card sound, beat-grid), name reveal (beat-lock to a nearby strong cue if timing allows, else natural)
- Restraint rule: never let music energy exceed the type's confidence — this is a quiet trailer, not a hype reel; no drum-forward moments, no chaotic cuts

## Storyboard

### Scene 1 — Hook: the mantra — 5s
Full-bleed backdrop from `scroll-frames/001.png` (or a recreation of its palette: graphite ground, magenta→blue light streaks entering from the right third). Left-aligned, the site's real kicker — "BUILDING" / "INTELLIGENT" / "TOMORROW" — lands one word at a time in the site's mono label voice (uppercase, tracked, muted ivory), each settling before the next arrives.
Sequential/interaction: yes — 3 words, one at a time, ~0.8s settled hold each before the next enters.
Audio intent: quiet anticipation building, not excitement.
Audio-coupled idea: soft tick per word, snapped to the beat grid (beats from 3.02s, ~0.5s apart).
Music: bed fades in low under the first word.
Transition mood: soft crossfade → Scene 2.

### Scene 2 — Reveal: the name — 5s
Same backdrop continuity. "Subhash Galla" slams to full scale in the real two-line chrome gradient (bright top / cool slate bottom, Archivo semi-expanded, weight 700, tight tracking, two lines stacked exactly as on the live hero). Tagline settles beneath in muted ivory, verbatim: "AI & Software Engineer building intelligent systems across LLMs, full-stack software, and cloud infrastructure."
Sequential/interaction: none — one confident single reveal.
Audio intent: confident arrival, not triumphant.
Audio-coupled idea: beat-lock the name's entrance to the nearest strong cue if one falls near this timestamp; otherwise natural timing for readability.
Music: bed continues low.
Transition mood: clean crossfade → Scene 3.

### Scene 3 — Highlight: proof, not promises — 6s
Two real metric cards from the actual case studies, styled like the site's own glass panels (dark smoked glass, thin lit rim, mono label + tabular-number stat), arriving one after the other — not simultaneously: "+25% answer relevance vs LLM-only baseline" then "62 → 88% valid task completion." Each card holds long enough to read in full before the next arrives.
Sequential/interaction: yes — card 1, hold, card 2, hold.
Audio intent: matter-of-fact credibility — the tone drops slightly more serious here.
Audio-coupled idea: one soft interface/card sound per card arrival, snapped to the beat grid; consider landing card 2 near a strong cue (17–18s window) if timing allows.
Music: bed steady, no swell yet.
Transition mood: soft crossfade → Scene 4.

### Scene 4 — Outro / punchline — 5s
Cut to the contact chapter's own line, verbatim: "Let's build something that holds up." Email beneath it (subhashgalla33@gmail.com), the "SG" monogram quiet in a corner exactly as in the real nav. No button, no extra CTA copy.
Sequential/interaction: none.
Audio intent: a settled close, not a hype ending.
Audio-coupled idea: one gentle music lift as the line lands, then fade to silence under the hold — no final SFX hit needed.
Music: soft lift then fade to silence.
Transition mood: hold to black/fade.

**Music mood for this video:** restrained corporate bed treated as ambient support, not the star.
**Audio summary:** Quiet from the first frame, never louder than the type; a single gentle lift going into the outro line, then true silence under the hold — the video ends in the same calm it started in.
