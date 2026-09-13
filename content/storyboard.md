# Storyboard: the film and the portfolio, authored together

Source: `ezgif-74beda69edc28760-jpg/ezgif-frame-001.jpg … 300.jpg`, 1280x720, 24 fps
(12.5 s). Sorted numerically. Served from `public/film/d` (desktop, original bytes)
and `public/film/m` (phones, 960x540). Timing lives in `content/film.ts`.

## What the frames actually do (inspected at every 6th frame, plus a 10% grid)

| Frames | Visual event | Face (x, y of frame) |
|---|---|---|
| 1–40 | Front-facing portrait held still in a periwinkle void. Pink/peach motion streaks shimmer on the right. | 0.50, 0.33 |
| 40–78 | The void dissolves: a neon city bleeds in behind him. He begins to turn. | 0.51 → 0.54 |
| 78–120 | Three-quarter to full profile, walking right past magenta signage. | 0.54, 0.36 |
| 120–160 | Profile past vertical cyan and amber tubes; horizontal bars begin. | 0.55 → 0.50 |
| 160–196 | Profile past a wall of horizontal cyan / magenta / amber bars. Fastest lateral motion. | 0.48 → 0.45 |
| 196–236 | He turns back to camera. Corridor of cyan ceiling lights and pink neon. Slow push-in. | 0.48 → 0.44, 0.34 → 0.37 |
| 236–250 | The push-in accelerates; the face fills the lower centre; a morph into the close-up at 247. | 0.44, 0.44 |
| 250–284 | Extreme close-up. Pink, cyan and white light streaks cross the face. Eyes close (265) and open (277). Warm violet. | 0.50, 0.45; eyes at y 0.34 |
| 284–300 | Camera pulls back into the neon tunnel; streaks converge behind him. He smiles. | 0.50, 0.39 |

Measured colour (average of the frame): 1–50 `#776ea6` (violet-blue, pink right third),
61–71 `#555a88` steel, 81–191 `#39566e … #51637e` teal-slate with cyan/magenta bars,
201–241 `#37576d … #334e60` cyan-graphite, 251–281 `#6a5e80 … #6d6181` warm mauve,
291–300 `#625979` violet. The runtime samples all 300 frames (`content/film-palette.ts`).

## Chapters (scroll weights in viewport-heights; frames map linearly inside each)

| # | Chapter | Frames | Weight | Copy | Anchor / scrim | Entrance / exit |
|---|---|---|---|---|---|---|
| 00 | Intro | 1–40 | 1.0 | SUBHASH GALLA · AI & Software Engineer · Denton, Texas | lead corner (top-left) | greet on load (present at p=0); drifts up and out as the void dissolves |
| 01 | Identity | 40–78 | 1.2 | "I build the system around the model." + one sentence | bottom-left, band | lines rise from clip masks as the city materialises; fragments sideways as he turns |
| 02 | Work | 78–196 | 4.8 | Three projects, one per 40-frame leg: 01 Retrieval-Augmented Chatbot (78–118), 02 NL Robot Task Planner (118–158), 03 Food-Logging App (158–196). Operations Review Tracker as a one-line coda. | title card across the bottom, glass plane bottom-right, band | title wipes in from the left with the walk, exits eaten from the left; glass rises 2vh |
| 03 | Experience | 196–236 | 2.6 | 2026 · Westat · AI Software Engineer Intern (196–216); 2024–26 · UNT · IT Support Assistant (216–236) | left column, column scrim | year settles from scale 1.06 + 8px blur; company mask-reveals; glass plane slides up |
| 04 | Capabilities | 236–250 | 1.3 | AI / ML · Engineering · Data & Cloud (all items from the résumé, regrouped) | bottom band, three columns | columns stagger 70 ms, 12px rise |
| 05 | About | 250–284 | 2.6 | A: "Most language-model demos fall apart the moment they leave the slide." B: the story, what I am looking for, education | bottom-left corner scrim | A: focus-pull (blur 14px → 0); B: glass plane fades and rises |
| 06 | Contact | 284–300 | 1.4 (+1 landing) | "Let's build something that holds up." Email · LinkedIn · GitHub · Résumé. Availability. Colophon. | centred low, band | scale 1.08 → 1 settle; holds to the end (the film resolves, it does not fade) |

Total track: 14.9 vh + 1 vh landing = 15.9 viewport-heights. Peak: the close-up (About).
The quiet before it is Capabilities, deliberately the plainest chapter.

Feeling curve: curiosity (a still portrait that shimmers) → arrival (the world materialises as the
headline lands) → momentum (walking, projects passing like signage) → confidence (he turns to face
you; career) → competence (skills, plain) → intimacy (the close-up) → resolve (the tunnel, contact).

Tell-someone sentence: it's the site where scrolling walks him through a neon city and the whole
interface is lit by the frame you are on.

Signature move: the UI is lit by the film. Ground, glass rims, accent, focus ring and the
progress marker all derive from per-frame colour samples, lerped, so the page grades like one
continuous shot.

## Mobile (aspect < 0.62)
The 16:9 frame is drawn as a strip (62% of the viewport height, centred at 42%) over an ambient
extension (the same frame, box-blurred and darkened). Face and both eyes always in frame; copy
sits below the strip; no eyes under text. Tablets and desktop use a full-bleed focal cover crop.

## Reduced motion / no JS
Static document: each chapter is a flow section with its key frame as a poster (frames 1, 61,
100, 140, 180, 210, 244, 262, 300), plain opacity transitions, no frames fetched.
