// Runs at build time and in the browser (HtmlLayout's script): keep it free
// of astro:content and DOM imports.

// Px per color transition, and the fewest transitions any page shows.
const MIN_SEGMENT = 2000;
const MIN_TRANSITIONS = 2;

// `color` is the N in --gradient-stop-N.
export interface RiverStop {
  at: number;
  color: number;
}

const OPEN_STOPS: RiverStop[] = [0, 0.22, 0.42, 0.62, 0.82, 1].map((at, i) => ({
  at,
  color: i + 1,
}));

// Ends where it starts, so a page can begin anywhere and overflow repeats
// seamlessly.
const LOOP_STOPS: RiverStop[] = [0, 1, 2, 3, 4, 5, 6].map((i) => ({
  at: i / 6,
  color: (i % 6) + 1,
}));

// 0 for the feed (/, /2/, …) and a hashed whole sixth for every other page.
// The digit limit keeps year archives like /2024/ out of the feed.
function riverFractionForPath(pathname: string): number {
  // The build and the client must hash the same string, and the dev server
  // serves paths with or without the slash.
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (/^\/(\d{1,3}\/)?$/.test(path)) return 0;
  let hash = 0x811c9dc5;
  for (const char of path) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  // 1–5, never 0: that's the feed's sentinel.
  const stop = 1 + Math.floor(((hash >>> 0) / 0x100000000) * 5);
  return stop / 6;
}

export function riverStops(path: string): RiverStop[] {
  const fraction = riverFractionForPath(path);
  if (fraction === 0) return OPEN_STOPS;
  const start = Math.round(fraction * 6);
  return LOOP_STOPS.map(({ at, color }) => ({ at, color: ((start + color - 1) % 6) + 1 }));
}

// Whole bands, so every page starts and ends exactly on a stop.
function riverBands(height: number, segments: number): number {
  return Math.min(Math.max(Math.floor(height / MIN_SEGMENT), MIN_TRANSITIONS), segments);
}

export function riverCycle(height: number, stops: RiverStop[]): number {
  const segments = stops.length - 1;
  return (height * segments) / riverBands(height, segments);
}

// Built from var() references only, so it re-resolves on a color-scheme
// change without JS.
export function riverColorAt(stops: RiverStop[], t: number): string {
  const f = Math.min(1, Math.max(0, t));
  let i = 1;
  while (i < stops.length - 1 && f > (stops[i]?.at ?? 1)) i++;
  const lo = stops[i - 1] ?? { at: 0, color: 1 };
  const hi = stops[i] ?? { at: 1, color: 1 };
  const span = hi.at - lo.at;
  const mix = span === 0 ? 0 : (f - lo.at) / span;
  return `color-mix(in oklch, var(--gradient-stop-${hi.color}) ${(mix * 100).toFixed(1)}%, var(--gradient-stop-${lo.color}))`;
}

function riverGradientCss(stops: RiverStop[], stopCss: (color: number) => string): string {
  const list = stops.map(({ at, color }) => `${stopCss(color)} ${+(at * 100).toFixed(2)}%`);
  return `linear-gradient(in oklch to bottom, ${list.join(", ")})`;
}

export function riverInlineStyle(path: string): string {
  const stops = riverStops(path);
  return [
    `--gradient-river: ${riverGradientCss(stops, (i) => `var(--gradient-stop-${i})`)}`,
    `--gradient-river-faint: ${riverGradientCss(
      stops,
      (i) => `color-mix(in oklab, var(--gradient-stop-${i}) 10%, transparent)`,
    )}`,
  ].join("; ");
}
