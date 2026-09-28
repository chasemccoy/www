// Shared constants and pure helpers for the "gradient river" — the
// page-length gradient that the background wash, link text, underlines, and
// other pinned elements all sample. Imported by both the build-time
// frontmatter and the client script in HtmlLayout.astro, so the numbers
// exist in exactly one place. (Keep this module free of astro:content or
// DOM imports — it runs in both environments.)

// A single color transition never compresses below this height, so short
// pages show a slice of the river instead of the whole thing…
const MIN_SEGMENT = 2000;
// …but every page must still travel through at least this many transitions,
// so very short pages shrink their bands to fit.
const MIN_TRANSITIONS = 2;

// `color` is which of the six palette colors (--gradient-stop-N) sits at `at`.
export interface RiverStop {
  at: number;
  color: number;
}

// The index's open ramp: colors 1–6 at the original spacing, ending on
// violet. Five transitions.
const OPEN_STOPS: RiverStop[] = [0, 0.22, 0.42, 0.62, 0.82, 1].map((at, i) => ({
  at,
  color: i + 1,
}));

// The closed loop used by every other page: six equal transitions wrapping
// back to color 1, so a page can start anywhere and overflow repeats
// seamlessly.
const LOOP_STOPS: RiverStop[] = [0, 1, 2, 3, 4, 5, 6].map((i) => ({
  at: i / 6,
  color: (i % 6) + 1,
}));

// Deterministic per-page fraction (0..1) from the path — each page starts
// at its own point along the river. (FNV-1a hash.) The index and its
// paginated pages (/2/, /3/, …) are one continuous feed, so they all start
// at the top and get the full open ramp. (1–3 digits only: four-digit
// paths like /2024/ are year archives, which keep their own hashed spot.)
export function riverFractionForPath(pathname: string): number {
  // Normalized to a trailing slash so the build (Astro.url.pathname) and
  // the client (location.pathname, which the dev server serves either way)
  // always hash the same string.
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  if (/^\/(\d{1,3}\/)?$/.test(path)) return 0;
  let hash = 0x811c9dc5;
  for (const char of path) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  // Quantized to a stop boundary (stops 2–6; 0 is the feed's sentinel), so
  // every page's gradient starts exactly on a stop and the seam is a pure
  // stop color.
  const stop = 1 + Math.floor(((hash >>> 0) / 0x100000000) * 5);
  return stop / 6;
}

// A page's gradient, as rendered: the index (fraction 0) gets the open
// ramp; every other page gets the loop rotated so the page starts at its
// stop-quantized point — since fractions are always whole sixths, rotation
// is a pure re-indexing of the colors. Everything downstream (the CSS
// gradient, color sampling) works in this rendered, page-relative domain.
export function riverStops(fraction: number): RiverStop[] {
  if (fraction === 0) return OPEN_STOPS;
  const start = Math.round(fraction * 6);
  return LOOP_STOPS.map(({ at, color }) => ({ at, color: ((start + color - 1) % 6) + 1 }));
}

// How many whole color transitions a page of height H spans: as many as
// fit at MIN_SEGMENT height each, but always at least MIN_TRANSITIONS and
// never more than the gradient has. Pages cover a whole number of bands,
// so they always start and end exactly on stops.
function riverBands(height: number, segments: number): number {
  return Math.min(Math.max(Math.floor(height / MIN_SEGMENT), MIN_TRANSITIONS), segments);
}

// The gradient-cycle height for a page: sized so the document covers
// exactly riverBands() whole transitions. Long pages (all bands fit) get
// cycle == height, i.e. the full gradient spans the page.
export function riverCycle(height: number, stops: RiverStop[]): number {
  const segments = stops.length - 1;
  return (height * segments) / riverBands(height, segments);
}

// A CSS color expression for the river's color at position `t` (0..1 along
// one cycle of the rendered gradient): the two neighboring stops
// interpolated in oklch, matching how the gradient itself paints. Built
// from var() references only, so it re-resolves on its own when the color
// scheme changes — no JS listener needed.
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

// CSS text for a page's gradient. Stop colors come from `stopCss` (usually
// var() references, so dark mode keeps working).
function riverGradientCss(stops: RiverStop[], stopCss: (color: number) => string): string {
  const list = stops.map(({ at, color }) => `${stopCss(color)} ${+(at * 100).toFixed(2)}%`);
  return `linear-gradient(in oklch to bottom, ${list.join(', ')})`;
}

// The inline style for <html>. The faint variant is for the link hover wash
// and the section break.
export function riverInlineStyle(path: string): string {
  const stops = riverStops(riverFractionForPath(path));
  return [
    `--gradient-river: ${riverGradientCss(stops, (i) => `var(--gradient-stop-${i})`)}`,
    `--gradient-river-faint: ${riverGradientCss(
      stops,
      (i) => `color-mix(in oklab, var(--gradient-stop-${i}) 10%, transparent)`
    )}`,
  ].join('; ');
}
