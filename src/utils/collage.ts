// How wide the header collage is drawn, for sizing its images. Used at build time by
// Collage.astro and by scripts/pull-collage.js, which runs under plain Node: keep it free of
// imports.
//
// Mirrors .Page and .Masthead in _Wrapper.scss: 1rem of padding a side, 1.5rem from the medium
// breakpoint, in a page capped at 1100px, at the site's 17px rem. Change those and these together.

export type Breakpoint = "sm" | "md" | "lg";

// The fraction of the collage's width an image is drawn at, per layout size (collage.js's
// imageScale). A size where the item is hidden is missing.
export type ImageScale = Partial<Record<Breakpoint, number>>;

const REM = 17;
const MEDIUM = 900;
const INSET_SMALL = 2 * 1 * REM;
const INSET_MEDIUM = 2 * 1.5 * REM;
const SMALLEST_VIEWPORT = 320;

// Where the collage's own layouts take over, by its width: BREAKPOINT_MIN in collage.js.
export const COLLAGE_BREAKPOINTS = { md: 640, lg: 1024 };

const PAGE_WIDTH = 1100;
const MAX_WIDTH = PAGE_WIDTH - INSET_MEDIUM;

// The collage widths each layout size covers on this site.
export const COLLAGE_WIDTHS: Record<Breakpoint, [number, number]> = {
  sm: [SMALLEST_VIEWPORT - INSET_SMALL, COLLAGE_BREAKPOINTS.md - 1],
  md: [COLLAGE_BREAKPOINTS.md, COLLAGE_BREAKPOINTS.lg - 1],
  lg: [COLLAGE_BREAKPOINTS.lg, MAX_WIDTH],
};

// Screen densities to make each size for: phones run 3x, larger screens 2x.
const DENSITIES: Record<Breakpoint, number[]> = { sm: [1, 2, 3], md: [1, 2], lg: [1, 2] };

// Neighboring widths differ by at least this much, so the browser never fetches more than about
// STEP² as many pixels as it shows.
const STEP = 1.25;

// The viewport width at which the collage reaches a given width.
function viewportFor(collageWidth: number): number {
  const narrow = collageWidth + INSET_SMALL;
  return narrow < MEDIUM ? narrow : collageWidth + INSET_MEDIUM;
}

/** The pixel widths to make an image at: enough for every size and density it's shown at. */
export function imageWidths(scale: ImageScale, sourceWidth: number): number[] {
  const wanted: number[] = [];
  for (const bp of Object.keys(scale) as Breakpoint[]) {
    const fraction = scale[bp] ?? 0;
    const [min, max] = COLLAGE_WIDTHS[bp];
    wanted.push(fraction * min, ...DENSITIES[bp].map((density) => fraction * max * density));
  }
  const sorted = wanted
    .map((width) => Math.min(Math.ceil(width), sourceWidth))
    .sort((a, b) => b - a);
  const widths: number[] = [];
  for (const width of sorted) {
    const last = widths.at(-1);
    if (width >= 16 && (last === undefined || width * STEP <= last)) widths.push(width);
  }
  return widths.reverse();
}

/** The widest an image is ever drawn, in device pixels: what its source needs. */
export function largestWidth(scale: ImageScale): number {
  return Math.max(0, ...imageWidths(scale, Infinity));
}

/** The `sizes` attribute for an image: its drawn width at every viewport width. */
export function imageSizes(scale: ImageScale): string {
  const drawn = (bp: Breakpoint, width: string) => {
    const fraction = scale[bp];
    return fraction ? `calc(${fraction.toFixed(4)} * ${width})` : "1px";
  };
  const narrow = `(100vw - ${INSET_SMALL}px)`;
  const wide = `(100vw - ${INSET_MEDIUM}px)`;
  return [
    `(min-width: ${PAGE_WIDTH}px) ${drawn("lg", `${MAX_WIDTH}px`)}`,
    `(min-width: ${viewportFor(COLLAGE_BREAKPOINTS.lg)}px) ${drawn("lg", wide)}`,
    `(min-width: ${MEDIUM}px) ${drawn("md", wide)}`,
    `(min-width: ${viewportFor(COLLAGE_BREAKPOINTS.md)}px) ${drawn("md", narrow)}`,
    drawn("sm", narrow),
  ].join(", ");
}
