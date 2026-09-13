/**
 * Page-wide grain. One fixed, static feTurbulence tile at ~3.5% over overlay
 * blend — enough tactility to kill pure digital flatness, never a visible film
 * effect. No JS, no animation; the class lives in globals.css.
 */
export function Grain() {
  return <div className="grain" aria-hidden />;
}
