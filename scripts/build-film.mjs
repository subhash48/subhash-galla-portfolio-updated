/**
 * Film asset pipeline.
 *
 *   node scripts/build-film.mjs [--src <dir>]
 *
 * Reads the frame sequence exported from the source video (ezgif JPEGs,
 * 1280x720, `ezgif-frame-NNN.jpg`), sorts it numerically, and writes:
 *
 *   public/film/d/NNN.jpg     desktop frames. The source JPEGs are already at a
 *                             low bitrate (15-27 KB each); re-encoding to WebP or
 *                             AVIF measured LARGER at equal quality, so they are
 *                             copied byte-for-byte (metadata stripped).
 *   public/film/m/NNN.webp    phone frames. 800x450 WebP q72. Phones show the
 *                             film as a letterboxed strip over an ambient
 *                             extension, so the lower resolution is invisible
 *                             there and it saves ~40% on a cellular connection.
 *   content/film-palette.ts   per-frame colour samples (overall, left, right,
 *                             top, bottom, and a boosted "most saturated" accent),
 *                             temporally smoothed. The runtime lights the whole UI
 *                             (ground, glass rims, accent) from this table.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const srcIdx = args.indexOf("--src");
const SRC = srcIdx >= 0 ? args[srcIdx + 1] : "ezgif-74beda69edc28760-jpg";
const ROOT = process.cwd();
const OUT_D = path.join(ROOT, "public/film/d");
const OUT_M = path.join(ROOT, "public/film/m");
const PALETTE = path.join(ROOT, "content/film-palette.ts");

const files = fs
  .readdirSync(path.join(ROOT, SRC))
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .map((f) => ({ f, n: parseInt((f.match(/(\d+)(?!.*\d)/) || ["0"])[0], 10) }))
  .sort((a, b) => a.n - b.n); // numeric, never lexicographic

if (!files.length) throw new Error(`no frames found in ${SRC}`);
console.log(`${files.length} frames, ${files[0].f} … ${files[files.length - 1].f}`);

fs.mkdirSync(OUT_D, { recursive: true });
fs.mkdirSync(OUT_M, { recursive: true });

const pad = (i) => String(i).padStart(3, "0");
const hex = ([r, g, b]) => [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");

function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  return { s: max ? d / max : 0, v: max };
}

function avgRegion(px, w, h, x0, y0, x1, y1) {
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const i = (y * w + x) * 3; r += px[i]; g += px[i + 1]; b += px[i + 2]; n++;
  }
  return [r / n, g / n, b / n];
}

const raw = { avg: [], l: [], r: [], t: [], b: [], sat: [] };
let bytesD = 0, bytesM = 0, W = 0, H = 0;

for (let k = 0; k < files.length; k++) {
  const src = path.join(ROOT, SRC, files[k].f);
  const img = sharp(src);
  const meta = await img.metadata();
  W = meta.width; H = meta.height;

  // desktop: the original bytes, untouched (any re-encode measured larger)
  const orig = fs.readFileSync(src);
  fs.writeFileSync(path.join(OUT_D, `${pad(k + 1)}.jpg`), orig);
  bytesD += orig.length;

  // mobile: 800x450 WebP. Measured ~40% smaller than the source at the size
  // phones actually display (a letterboxed strip), with no visible loss.
  const m = await sharp(src).resize({ width: 800, height: 450, fit: "fill" }).webp({ quality: 72, effort: 5 }).toBuffer();
  fs.writeFileSync(path.join(OUT_M, `${pad(k + 1)}.webp`), m);
  bytesM += m.length;

  // palette from a 64x36 box-filtered thumbnail
  const w = 64, h = 36;
  const { data } = await sharp(src).resize(w, h, { fit: "fill", kernel: "cubic" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  raw.avg.push(avgRegion(data, w, h, 0, 0, w, h));
  raw.l.push(avgRegion(data, w, h, 0, 0, Math.round(w * 0.3), h));
  raw.r.push(avgRegion(data, w, h, Math.round(w * 0.7), 0, w, h));
  raw.t.push(avgRegion(data, w, h, 0, 0, w, Math.round(h * 0.3)));
  raw.b.push(avgRegion(data, w, h, 0, Math.round(h * 0.7), w, h));
  // accent: mean of the top 5% pixels by saturation*value (the neon, not the skin)
  const scored = [];
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const { s, v } = rgbToHsv(r, g, b);
    scored.push({ score: s * v, r, g, b });
  }
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, Math.max(8, Math.round(scored.length * 0.05)));
  raw.sat.push([
    top.reduce((a, p) => a + p.r, 0) / top.length,
    top.reduce((a, p) => a + p.g, 0) / top.length,
    top.reduce((a, p) => a + p.b, 0) / top.length,
  ]);
  if (k % 50 === 0) console.log(`  frame ${k + 1}`);
}

// temporal smoothing: neon tubes flicker frame to frame; the UI light must not
const smooth = (arr, radius) =>
  arr.map((_, i) => {
    let r = 0, g = 0, b = 0, n = 0;
    for (let j = Math.max(0, i - radius); j <= Math.min(arr.length - 1, i + radius); j++) {
      r += arr[j][0]; g += arr[j][1]; b += arr[j][2]; n++;
    }
    return [r / n, g / n, b / n];
  });

const out = {};
for (const key of Object.keys(raw)) out[key] = smooth(raw[key], key === "sat" ? 6 : 3).map(hex);

const ts = `/* Generated by scripts/build-film.mjs from the frame sequence. Do not edit.
   Per-frame colour samples (hex, no #): overall average, left/right/top/bottom
   thirds, and the boosted "neon" accent (mean of the most saturated 5%). */
export const FILM_FRAMES = ${files.length};
export const FILM_SIZE = { w: ${W}, h: ${H} } as const;
export const FILM_PALETTE = ${JSON.stringify(out)} as const;
`;
fs.writeFileSync(PALETTE, ts);

console.log(`desktop ${(bytesD / 1e6).toFixed(2)} MB, mobile ${(bytesM / 1e6).toFixed(2)} MB, palette → ${path.relative(ROOT, PALETTE)}`);
