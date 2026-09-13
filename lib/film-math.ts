/* Pure math for the film engine. No DOM. */
import { FILM, type Window } from "@/content/film";

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const clamp01 = (v: number) => clamp(v, 0, 1);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** smoothstep: eases the ends of a scroll-driven ramp so nothing snaps */
export const smooth = (x: number) => {
  x = clamp01(x);
  return x * x * (3 - 2 * x);
};

/**
 * Scrollcraft's monotone dwell remap: settles the camera mid-span and moves
 * quicker at the edges. f(0)=0, f(1)=1 always, so chapter seams are untouched.
 */
export function dwell(x: number, L: number): number {
  if (!L) return x;
  L = clamp(L, 0, 0.6);
  const c = x - 0.5;
  return (1 - L) * x + L * (4 * c * c * c + 0.5);
}

export type WindowState = {
  /** opacity 0..1 */
  w: number;
  /** progress through the entrance ramp 0..1 */
  in: number;
  /** progress through the exit ramp 0..1 */
  out: number;
  /** position through the whole window 0..1 */
  pos: number;
};

/** Scrollcraft cue contract, evaluated at chapter-local progress u. */
export function windowState(u: number, win: Window): WindowState {
  const from = win[0];
  const to = win[1] ?? 1;
  const len = Math.max(to - from, 1e-4);
  const ri = (win[2] ?? 0.3) * len;
  const ro = (win[3] ?? 0.3) * len;
  const pos = clamp01((u - from) / len);
  if (u < from) return { w: 0, in: 0, out: 0, pos: 0 };
  if (ri > 0 && u < from + ri) {
    const t = smooth((u - from) / ri);
    return { w: t, in: t, out: 0, pos };
  }
  if (win[1] === undefined) return { w: 1, in: 1, out: 0, pos }; // hold
  if (u <= to - ro) return { w: 1, in: 1, out: 0, pos };
  if (ro > 0 && u < to) {
    const t = smooth((u - (to - ro)) / ro);
    return { w: 1 - t, in: 1, out: t, pos };
  }
  return { w: 0, in: 1, out: 1, pos: 1 };
}

/** face position for a (fractional, 1-based) frame, interpolated between keyframes */
export function focalAt(frame: number): { x: number; y: number } {
  const k = FILM.focal;
  if (frame <= k[0][0]) return { x: k[0][1], y: k[0][2] };
  for (let i = 1; i < k.length; i++) {
    if (frame <= k[i][0]) {
      const [f0, x0, y0] = k[i - 1];
      const [f1, x1, y1] = k[i];
      const t = (frame - f0) / Math.max(f1 - f0, 1e-6);
      return { x: lerp(x0, x1, t), y: lerp(y0, y1, t) };
    }
  }
  const last = k[k.length - 1];
  return { x: last[1], y: last[2] };
}

export type CoverRect = { dx: number; dy: number; w: number; h: number };

/**
 * object-fit: cover with a focal point. The focal fraction of the image lands
 * at `tx, ty` of the box (defaults to the same fraction, i.e. object-position).
 */
export function coverRect(
  cw: number,
  ch: number,
  iw: number,
  ih: number,
  fx: number,
  fy: number,
  tx = fx,
  ty = fy,
): CoverRect {
  const scale = Math.max(cw / iw, ch / ih);
  const w = iw * scale;
  const h = ih * scale;
  const dx = clamp(tx * cw - fx * w, cw - w, 0);
  const dy = clamp(ty * ch - fy * h, ch - h, 0);
  return { dx, dy, w, h };
}

/* ---------- colour ---------- */

export type RGB = [number, number, number];

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function mixRgb(a: RGB, b: RGB, t: number): RGB {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function rgbToHsl([r, g, b]: RGB): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h / 6, s, l];
}

export function hslToRgb([h, s, l]: [number, number, number]): RGB {
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}

/** the frame's neon, pushed to a lightness that reads as text on the dark ground */
export function accentFrom(rgb: RGB, light = 0.74): RGB {
  const [h, s] = rgbToHsl(rgb);
  return hslToRgb([h, Math.max(s, 0.72), light]);
}

export const rgbTriplet = (c: RGB) => `${Math.round(c[0])} ${Math.round(c[1])} ${Math.round(c[2])}`;
