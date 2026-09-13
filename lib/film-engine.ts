/**
 * The film engine. Framework-agnostic: reads the DOM, writes the DOM, no
 * React state. One rAF loop drives everything — canvas draw, beat opacity,
 * frame-derived colour, the rail marker, nav aria-current.
 *
 * Architecture (Scrollcraft's "continuous world" grammar): ONE fixed canvas
 * stage for the whole scroll, ONE spacer sets the scroll track, real content
 * ("beats") lives in a fixed copy layer and becomes interactive only in its
 * own scroll window. Nothing else is ever in document flow.
 */
import { FILM, FILM_TOTAL, CHAPTER_START, type ChapterId } from "@/content/film";
import { FILM_PALETTE } from "@/content/film-palette";
import {
  clamp,
  clamp01,
  coverRect,
  focalAt,
  hexToRgb,
  accentFrom,
  rgbTriplet,
  windowState,
  type RGB,
} from "@/lib/film-math";

type BeatWindow = readonly [number, number?, number?, number?];

type Beat = {
  el: HTMLElement;
  chapter: ChapterId;
  win: BeatWindow;
  lastLit: boolean;
};

type Img = { el: HTMLImageElement; ready: boolean };

const isMobile = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(max-width: 767px)").matches || window.matchMedia("(pointer: coarse)").matches);

const canHover = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

function parseWindow(raw: string | null): BeatWindow {
  if (!raw) return [0, 1];
  const parts = raw.split(",").map((s) => (s.trim() === "" ? undefined : parseFloat(s)));
  return [parts[0] ?? 0, parts[1], parts[2], parts[3]] as BeatWindow;
}

export type FilmEngineOptions = {
  root: HTMLElement; // container with canvas, poster, lean layer
  canvas: HTMLCanvasElement;
  poster: HTMLImageElement;
  copy: HTMLElement; // .film-copy, holds all chapters/beats
  spacer: HTMLElement;
  lean: HTMLElement; // parallax wrapper inside the stage
};

export class FilmEngine {
  private opts: FilmEngineOptions;
  private ctx: CanvasRenderingContext2D;
  private mini: HTMLCanvasElement; // tiny offscreen canvas for the mobile blur-extend trick
  private miniCtx: CanvasRenderingContext2D;

  private mobile = false;
  private strip = false;
  private cw = 0;
  private ch = 0;
  private dpr = 1;

  private cache = new Map<number, Img>();
  private inflight = new Set<number>();
  private cacheCap: number;
  private fillerIdx = 1;
  private fillerStride = 4;
  private fillerHandle = 0;

  private beats: Beat[] = [];
  private navLinks = new Map<ChapterId, HTMLElement[]>();
  private railTicks = new Map<ChapterId, HTMLElement[]>();

  private raf = 0;
  private running = false;
  private lastDrawnFrame = -1;
  private activeChapter: ChapterId | null = null;

  private leanTarget = { x: 0, y: 0 };
  private leanCur = { x: 0, y: 0 };
  private hoverGate = canHover();

  private onScroll = () => this.markDirty();
  private onResize = () => this.layout();
  private onVisibility = () => {
    if (document.hidden) this.pause();
    else this.resume();
  };
  private onPointer = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !this.hoverGate) return;
    const nx = e.clientX / Math.max(window.innerWidth, 1) - 0.5;
    const ny = e.clientY / Math.max(window.innerHeight, 1) - 0.5;
    this.leanTarget.x = nx * 14;
    this.leanTarget.y = ny * 10;
  };

  private dirty = true;
  private markDirty() {
    this.dirty = true;
  }

  constructor(opts: FilmEngineOptions) {
    this.opts = opts;
    const ctx = opts.canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("2d context unavailable");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    this.ctx = ctx;
    this.mini = document.createElement("canvas");
    this.mini.width = 48;
    this.mini.height = 27;
    this.miniCtx = this.mini.getContext("2d", { alpha: false })!;
    this.miniCtx.imageSmoothingEnabled = true;
    this.mobile = isMobile();
    this.cacheCap = this.mobile ? 70 : 130;
  }

  mount() {
    this.collectBeats();
    this.layout();
    window.addEventListener("resize", this.onResize, { passive: true });
    window.addEventListener("scroll", this.onScroll, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
    if (this.hoverGate) window.addEventListener("pointermove", this.onPointer, { passive: true });
    document.addEventListener("focusin", this.onFocusIn, true);
    if (document.fonts?.ready) document.fonts.ready.then(() => this.layout());
    window.addEventListener("load", () => this.layout(), { once: true });

    // Phase 1: the frame under the poster, immediately.
    this.request(1, true).then(() => {
      this.opts.root.dataset.ready = "1";
      this.draw(1);
    });
    // Phase 2: the reader's likely first screen.
    this.warmRange(1, 24, true);
    // Phase 3: everything else, in the background, low priority.
    this.startFiller();

    this.running = true;
    this.raf = requestAnimationFrame(this.tick);
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    if (this.fillerHandle) cancelIdle(this.fillerHandle);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("scroll", this.onScroll);
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("pointermove", this.onPointer);
    document.removeEventListener("focusin", this.onFocusIn, true);
  }

  private pause() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }
  private resume() {
    if (this.running) return;
    this.running = true;
    this.raf = requestAnimationFrame(this.tick);
  }

  /* ---------------- layout ---------------- */

  private layout = () => {
    const vh = window.innerHeight || 1;
    const vw = window.innerWidth || 1;
    this.mobile = isMobile();
    this.strip = vh / vw > 1.55;
    this.dpr = Math.min(window.devicePixelRatio || 1, this.mobile ? 1.6 : 2);
    this.cw = vw;
    this.ch = vh;
    this.opts.canvas.width = Math.round(vw * this.dpr);
    this.opts.canvas.height = Math.round(vh * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const total = (FILM_TOTAL + FILM.landing) * vh;
    this.opts.spacer.style.height = `${Math.max(total, vh * 2)}px`;
    this.lastDrawnFrame = -1;
    this.markDirty();
  };

  private collectBeats() {
    const els = Array.from(this.opts.copy.querySelectorAll<HTMLElement>("[data-beat]"));
    this.beats = els.map((el) => ({
      el,
      chapter: (el.closest<HTMLElement>("[data-chapter]")?.dataset.chapter as ChapterId) ?? "intro",
      win: parseWindow(el.dataset.window ?? null),
      lastLit: false,
    }));
    this.navLinks.clear();
    document.querySelectorAll<HTMLElement>("[data-nav-link]").forEach((el) => {
      const id = el.dataset.navLink as ChapterId;
      const arr = this.navLinks.get(id) ?? [];
      arr.push(el);
      this.navLinks.set(id, arr);
    });
    this.railTicks.clear();
    document.querySelectorAll<HTMLElement>("[data-rail-tick]").forEach((el) => {
      const id = el.dataset.railTick as ChapterId;
      const arr = this.railTicks.get(id) ?? [];
      arr.push(el);
      this.railTicks.set(id, arr);
    });
  }

  /* ---------------- image loading ---------------- */

  private src(frame: number): string {
    return this.mobile ? FILM.src.mobile(frame) : FILM.src.desktop(frame);
  }

  private request(frame: number, priority: boolean): Promise<Img> {
    const existing = this.cache.get(frame);
    if (existing) return Promise.resolve(existing);
    if (this.inflight.has(frame) && !priority) {
      return new Promise((resolve) => {
        const check = () => {
          const im = this.cache.get(frame);
          if (im) resolve(im);
          else setTimeout(check, 60);
        };
        check();
      });
    }
    this.inflight.add(frame);
    const img = new Image();
    img.decoding = "async";
    const rec: Img = { el: img, ready: false };
    const done = () => {
      rec.ready = true;
      this.inflight.delete(frame);
      this.evict();
      this.cache.set(frame, rec);
    };
    img.src = this.src(frame);
    const p: Promise<Img> = img.decode
      ? img.decode().then(done, done).then(() => rec)
      : new Promise((resolve) => {
          img.onload = () => {
            done();
            resolve(rec);
          };
          img.onerror = () => {
            this.inflight.delete(frame);
            resolve(rec);
          };
        });
    return p;
  }

  private evict() {
    if (this.cache.size < this.cacheCap) return;
    const target = this.lastDrawnFrame < 0 ? 1 : this.lastDrawnFrame;
    let worst = -1;
    let worstD = -1;
    for (const k of this.cache.keys()) {
      const d = Math.abs(k - target);
      if (d > worstD) {
        worstD = d;
        worst = k;
      }
    }
    if (worst >= 0 && worstD > 24) this.cache.delete(worst);
  }

  private warmRange(a: number, b: number, priority: boolean) {
    for (let f = a; f <= b; f++) this.request(f, priority);
  }

  /** Background filler: every Nth frame first, then gaps. Idle, low priority,
   *  paused while the tab is hidden. Never competes with the frame the reader
   *  is actually scrubbing. */
  private startFiller() {
    const step = () => {
      this.fillerHandle = 0;
      if (document.hidden) {
        this.fillerHandle = requestIdle(step);
        return;
      }
      let queued = 0;
      while (queued < 3 && this.fillerIdx <= FILM.frames) {
        const f = this.fillerIdx;
        this.fillerIdx += this.fillerStride;
        if (this.fillerIdx > FILM.frames && this.fillerStride > 1) {
          this.fillerStride = 1;
          this.fillerIdx = 2;
        }
        if (!this.cache.has(f) && !this.inflight.has(f)) {
          this.request(f, false);
          queued++;
        }
      }
      if (this.fillerStride === 1 && this.fillerIdx > FILM.frames) return; // done
      this.fillerHandle = requestIdle(step);
    };
    this.fillerHandle = requestIdle(step);
  }

  private nearest(frame: number): Img | null {
    if (this.cache.get(frame)?.ready) return this.cache.get(frame)!;
    for (let d = 1; d < FILM.frames; d++) {
      const a = this.cache.get(frame - d);
      if (a?.ready) return a;
      const b = this.cache.get(frame + d);
      if (b?.ready) return b;
    }
    return null;
  }

  /* ---------------- drawing ---------------- */

  private draw(frame: number) {
    const idx = clamp(Math.round(frame), 1, FILM.frames);
    if (idx === this.lastDrawnFrame) return;
    const img = this.nearest(idx);
    if (!img) return; // nothing decoded yet; poster still shows
    this.lastDrawnFrame = idx;

    const focal = focalAt(idx);
    const ctx = this.ctx;
    const cw = this.cw;
    const ch = this.ch;

    if (this.strip) {
      const bandH = ch * 0.62;
      const bandY = ch * 0.42 - bandH / 2;
      // cheap blur: draw into a tiny canvas, then upscale (bilinear = blur)
      const mctx = this.miniCtx;
      const mr = coverRect(this.mini.width, this.mini.height, img.el.naturalWidth, img.el.naturalHeight, focal.x, focal.y);
      mctx.drawImage(img.el, mr.dx, mr.dy, mr.w, mr.h);
      ctx.drawImage(this.mini, 0, 0, cw, ch);
      ctx.fillStyle = "rgba(6,7,11,0.42)";
      ctx.fillRect(0, 0, cw, ch);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, bandY, cw, bandH);
      ctx.clip();
      const r = coverRect(cw, bandH, img.el.naturalWidth, img.el.naturalHeight, focal.x, focal.y, focal.x, 0.5);
      ctx.drawImage(img.el, r.dx, bandY + r.dy, r.w, r.h);
      ctx.restore();
    } else {
      const r = coverRect(cw, ch, img.el.naturalWidth, img.el.naturalHeight, focal.x, focal.y);
      ctx.drawImage(img.el, r.dx, r.dy, r.w, r.h);
    }

    this.paintColor(idx);
  }

  private paintColor(idx: number) {
    const i = idx - 1;
    const p = FILM_PALETTE;
    const set = (name: string, hex: string) => root.style.setProperty(name, rgbTriplet(hexToRgb(hex)));
    const root = document.documentElement;
    set("--film-avg", p.avg[i]);
    set("--film-l", p.l[i]);
    set("--film-r", p.r[i]);
    set("--film-t", p.t[i]);
    set("--film-b", p.b[i]);
    set("--film-sat", p.sat[i]);
    const ground: RGB = hexToRgb(p.avg[i]).map((v) => v * 0.34) as RGB;
    root.style.setProperty("--film-ground", rgbTriplet(ground));
    const accent = accentFrom(hexToRgb(p.sat[i]));
    root.style.setProperty("--film-accent", rgbTriplet(accent));
  }

  /* ---------------- scroll → chapter/frame ---------------- */

  private activeChapterAt(t: number): (typeof FILM.chapters)[number] {
    for (const c of FILM.chapters) {
      const start = CHAPTER_START[c.id];
      if (t < start + c.weight || c === FILM.chapters[FILM.chapters.length - 1]) return c;
    }
    return FILM.chapters[0];
  }

  private read() {
    const vh = window.innerHeight || 1;
    const y = window.scrollY || 0;
    const t = clamp(y / vh, 0, FILM_TOTAL);
    const chapter = this.activeChapterAt(t);
    const start = CHAPTER_START[chapter.id];
    const u = clamp01((t - start) / Math.max(chapter.weight, 1e-4));
    const frame = chapter.frames[0] + (chapter.frames[1] - chapter.frames[0]) * u;

    if (chapter.id !== this.activeChapter) {
      this.activeChapter = chapter.id;
      this.navLinks.forEach((els, id) =>
        els.forEach((el) => {
          if (id === chapter.id) el.setAttribute("aria-current", "true");
          else el.removeAttribute("aria-current");
        }),
      );
      this.railTicks.forEach((els, id) =>
        els.forEach((el) => {
          if (id === chapter.id) el.setAttribute("aria-current", "true");
          else el.removeAttribute("aria-current");
        }),
      );
      window.dispatchEvent(new CustomEvent("film:chapter", { detail: { id: chapter.id } }));
    }
    document.documentElement.style.setProperty("--film-p", (t / FILM_TOTAL).toFixed(4));

    // ensure the frames just ahead of the reader (either direction) are hot
    const dir = frame >= this.lastRequestCenter ? 1 : -1;
    this.lastRequestCenter = frame;
    const lo = Math.max(1, Math.round(frame) - (dir > 0 ? 2 : 8));
    const hi = Math.min(FILM.frames, Math.round(frame) + (dir > 0 ? 8 : 2));
    this.warmRange(lo, hi, true);

    this.draw(frame);
    this.applyBeats();
    this.applyLean();
  }
  private lastRequestCenter = 1;

  private applyBeats() {
    const vh = window.innerHeight || 1;
    const t = clamp((window.scrollY || 0) / vh, 0, FILM_TOTAL);
    for (const b of this.beats) {
      const start = CHAPTER_START[b.chapter];
      const chapter = FILM.chapters.find((c) => c.id === b.chapter)!;
      // Chapter-local progress, UNCLAMPED at the low end. windowState's greet
      // form (rampIn 0) treats progress 0 as "already lit", so clamping a
      // not-yet-reached chapter to 0 would make every greet beat visible from
      // the very first pixel of the page. Only clamp the high end, where a
      // fully passed chapter should settle at whatever its own window ends on
      // (0 for a normal two-value window, 1 for the final chapter's hold).
      const uRaw = (t - start) / Math.max(chapter.weight, 1e-4);
      const s = uRaw < 0 ? { w: 0, in: 0, out: 0, pos: 0 } : windowState(Math.min(uRaw, 1), b.win);
      const el = b.el;
      el.style.setProperty("--w", s.w.toFixed(3));
      el.style.setProperty("--in", s.in.toFixed(3));
      el.style.setProperty("--out", s.out.toFixed(3));
      el.style.setProperty("--pos", s.pos.toFixed(3));
      const lit = s.w > 0.12;
      if (lit !== b.lastLit) {
        b.lastLit = lit;
        if (lit) {
          el.removeAttribute("inert");
          el.setAttribute("data-lit", "1");
        } else {
          el.setAttribute("data-lit", "0");
          if (s.w < 0.02) el.setAttribute("inert", "");
        }
      }
    }
  }

  private applyLean() {
    this.leanCur.x += (this.leanTarget.x - this.leanCur.x) * 0.06;
    this.leanCur.y += (this.leanTarget.y - this.leanCur.y) * 0.06;
    // On :root, not the stage: .film-copy is a sibling of .film-stage, not a
    // descendant, so it can only inherit a custom property set above both.
    // The canvas itself never moves or resizes — only the text layer leans,
    // which is what sells depth without ever softening a frame.
    const root = document.documentElement;
    root.style.setProperty("--lean-x", `${this.leanCur.x.toFixed(2)}px`);
    root.style.setProperty("--lean-y", `${this.leanCur.y.toFixed(2)}px`);
  }

  /* ---------------- keyboard focus: park the beat where its cue is open ---------------- */

  private onFocusIn = (e: FocusEvent) => {
    const target = e.target as HTMLElement | null;
    const beatEl = target?.closest?.("[data-beat]") as HTMLElement | null;
    if (!beatEl) return;
    const w = parseFloat(beatEl.style.getPropertyValue("--w") || "1");
    if (w > 0.6) return;
    const chapterId = (beatEl.closest<HTMLElement>("[data-chapter]")?.dataset.chapter as ChapterId) ?? "intro";
    const win = parseWindow(beatEl.dataset.window ?? null);
    const mid = win[1] === undefined ? win[0] + 0.08 : (win[0] + win[1]) / 2;
    const chapter = FILM.chapters.find((c) => c.id === chapterId)!;
    const vh = window.innerHeight || 1;
    const targetY = (CHAPTER_START[chapterId] + chapter.weight * mid) * vh;
    window.scrollTo({ top: targetY, behavior: "instant" as ScrollBehavior });
  };

  /* ---------------- main loop ---------------- */

  private tick = () => {
    if (!this.running) return;
    if (this.dirty) {
      this.dirty = false;
      this.read();
    } else if (this.hoverGate) {
      this.applyLean();
    }
    this.raf = requestAnimationFrame(this.tick);
  };
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: IdleRequestCallback, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

function requestIdle(cb: () => void): number {
  if (typeof window === "undefined") return 0;
  const w = window as IdleWindow;
  if (w.requestIdleCallback) return w.requestIdleCallback(cb, { timeout: 800 });
  return w.setTimeout(cb, 120);
}
function cancelIdle(handle: number) {
  if (typeof window === "undefined") return;
  const w = window as IdleWindow;
  if (w.cancelIdleCallback) w.cancelIdleCallback(handle);
  else w.clearTimeout(handle);
}
