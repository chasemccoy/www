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

// The index's open ramp: stops 1–6 at the original spacing, ending on
// violet. Five transitions.
const OPEN_STOPS = [0, 0.22, 0.42, 0.62, 0.82, 1];
const OPEN_COLOR_INDEXES = [1, 2, 3, 4, 5, 6];

// The closed loop used by every other page: six equal transitions wrapping
// back to stop 1, so a page can start anywhere and overflow repeats
// seamlessly.
const LOOP_STOPS = [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 1];
const LOOP_COLOR_INDEXES = [1, 2, 3, 4, 5, 6, 1];

// Deterministic per-page fraction (0..1) from the path — each page starts
// at its own point along the river. (FNV-1a hash.) The index and its
// paginated pages (/2/, /3/, …) are one continuous feed, so they all start
// at the top and get the full open ramp. (1–3 digits only: four-digit
// paths like /2024/ are year archives, which keep their own hashed spot.)
function riverFractionForPath(path: string): number {
  if (path === '/' || /^\/\d{1,3}\/?$/.test(path)) return 0;
  let hash = 0x811c9dc5;
  for (const char of path) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193);
  }
  // Quantized to a stop boundary (stops 2–6; 0 is the feed's sentinel), so
  // every page's gradient starts exactly on a stop and the rotation seam is
  // a pure stop color.
  const stop = 1 + Math.floor(((hash >>> 0) / 0x100000000) * 5);
  return stop / 6;
}

// The stop tables and segment count for a page's gradient shape: the index
// (fraction 0) uses the open ramp, everything else the closed loop.
export function riverTables(fraction: number) {
  const open = fraction === 0;
  const positions = open ? OPEN_STOPS : LOOP_STOPS;
  return {
    positions,
    colorIndexes: open ? OPEN_COLOR_INDEXES : LOOP_COLOR_INDEXES,
    segments: positions.length - 1,
  };
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
// cycle == height, i.e. the full gradient spans the page as before.
export function riverCycle(height: number, segments: number): number {
  return (height * segments) / riverBands(height, segments);
}

// A CSS approximation of the cycle for the no-JS wash: the continuous
// version of the formula (CSS can't express the whole-band floor() — typed
// percentage division folds incorrectly at computed-value time). The
// anchoring script overrides it with the exact quantized --river-size; on
// the page-spanning #gradient element, percentages resolve against the
// document height.
function riverCycleCss(segments: number): string {
  return `clamp(100%, ${MIN_SEGMENT * segments}px, ${(segments / MIN_TRANSITIONS) * 100}%)`;
}

// Map a document position back into the unrotated gradient's 0..1 domain
// (the rendered gradient is phase-shifted by `fraction` at build time).
export function riverFractionAt(y: number, cycle: number, fraction: number): number {
  return ((((y % cycle) / cycle + fraction) % 1) + 1) % 1;
}

// A CSS color expression for the river's color at position `at` (unrotated
// 0..1): the two neighboring stops interpolated in oklch, matching how the
// gradient itself paints. Built from var() references only, so it
// re-resolves on its own when the color scheme changes — no JS listener
// needed.
export function riverColorAt(pageFraction: number, at: number): string {
  const { positions, colorIndexes } = riverTables(pageFraction);
  const f = Math.min(1, Math.max(0, at));
  let i = 1;
  while (i < positions.length - 1 && f > (positions[i] ?? 1)) i++;
  const lo = positions[i - 1] ?? 0;
  const hi = positions[i] ?? 1;
  const span = hi - lo;
  const t = span === 0 ? 0 : (f - lo) / span;
  const from = `var(--gradient-stop-${colorIndexes[i - 1]})`;
  const to = `var(--gradient-stop-${colorIndexes[i]})`;
  // On (or within float noise of) a stop boundary, emit the pure stop var —
  // page ends always land on stops, so e.g. --river-end stays a clean
  // palette reference.
  if (t <= 0.001) return from;
  if (t >= 0.999) return to;
  return `color-mix(in oklch, ${to} ${(t * 100).toFixed(1)}%, ${from})`;
}

// The underline flavor: the sampled river color lightened halfway toward
// the page background so it stays subtle.
export function riverUnderlineCss(pageFraction: number, at: number): string {
  return `color-mix(in srgb, ${riverColorAt(pageFraction, at)} 50%, var(--color-body-background))`;
}

// CSS text for a page's gradient, phase-shifted by `fraction`. The index
// (fraction 0) gets the open ramp; other pages get the closed loop rotated
// so the page starts at its stop-quantized point — since fractions are
// always whole sixths, rotation is a pure re-indexing of the stop list.
// Stop colors come from `stopCss` (usually var() references, so dark mode
// keeps working).
function riverGradientCss(fraction: number, stopCss: (i: number) => string): string {
  let stops: string[];
  if (fraction === 0) {
    stops = OPEN_STOPS.map((pos, i) => `${stopCss(i + 1)} ${(pos * 100).toFixed(0)}%`);
  } else {
    const start = Math.round(fraction * 6) % 6;
    stops = LOOP_STOPS.map(
      (pos, k) => `${stopCss(((start + k) % 6) + 1)} ${(pos * 100).toFixed(2)}%`
    );
  }
  return `linear-gradient(in oklch to bottom, ${stops.join(', ')})`;
}

// The complete inline style for <html>: both gradients plus the fraction
// and wash-cycle vars the stylesheet and client script consume.
export function riverInlineStyle(path: string): string {
  const fraction = riverFractionForPath(path);
  const { segments } = riverTables(fraction);
  return [
    `--gradient-river: ${riverGradientCss(fraction, (i) => `var(--gradient-stop-${i})`)}`,
    `--gradient-river-faint: ${riverGradientCss(
      fraction,
      (i) => `color-mix(in oklab, var(--gradient-stop-${i}) 10%, transparent)`
    )}`,
    `--river-frac: ${fraction}`,
    `--river-cycle: ${riverCycleCss(segments)}`,
  ].join('; ');
}
