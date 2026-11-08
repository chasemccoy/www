// How wide the header collage is drawn, for sizing its images. Used at build time by
// Collage.astro and by scripts/pull-collage.js, which runs under plain Node: import only plain JS
// (the renderer), not other TypeScript.
import { BREAKPOINT_MIN } from "../collage/collage.js";

export type Breakpoint = "sm" | "md" | "lg";

// The fraction of the collage's width an image is drawn at, per layout size (collage.js's
// imageScale). A size where the item is hidden is missing.
export type ImageScale = Partial<Record<Breakpoint, number>>;

// The masthead's geometry, mirrored from the styles: .Page and .Masthead in _Wrapper.scss, the
// medium breakpoint in _mixins.scss, and the root font size in _theme.scss. collage.spec.ts checks
// these against those files.
export const SITE = {
  rem: 17, // px
  medium: 900, // px: the breakpoint where the masthead's padding grows
  pageWidth: 1200, // px
  padding: { small: 1, medium: 1.5 }, // rem a side
};

const INSET_SMALL = 2 * SITE.padding.small * SITE.rem;
const INSET_MEDIUM = 2 * SITE.padding.medium * SITE.rem;
const MAX_WIDTH = SITE.pageWidth - INSET_MEDIUM;
const SMALLEST_VIEWPORT = 320;

// The collage widths each layout size covers on this site. Its layouts take over at the
// collage's own width (BREAKPOINT_MIN), not the viewport's.
export const COLLAGE_WIDTHS: Record<Breakpoint, [number, number]> = {
  sm: [SMALLEST_VIEWPORT - INSET_SMALL, BREAKPOINT_MIN.md - 1],
  md: [BREAKPOINT_MIN.md, BREAKPOINT_MIN.lg - 1],
  lg: [BREAKPOINT_MIN.lg, MAX_WIDTH],
};

// The densest screen images are made for. Phones run 3x, but at collage scale 3x looks no sharper
// than 2x and costs about twice the bytes, so imageSizes tells them each image is drawn at
// 2/3 its width, which steers them to the 2x files.
const MAX_DENSITY = 2;
const PHONE_DENSITY = 3;

// Neighboring widths differ by at least this much, so the browser never fetches more than about
// STEP² as many pixels as it shows.
const STEP = 1.25;

// The viewport width at which the collage reaches a given width.
function viewportFor(collageWidth: number): number {
  const narrow = collageWidth + INSET_SMALL;
  return narrow < SITE.medium ? narrow : collageWidth + INSET_MEDIUM;
}

/** The pixel widths to make an image at: enough for every size and density it's shown at. */
export function imageWidths(scale: ImageScale, sourceWidth: number): number[] {
  const wanted: number[] = [];
  for (const bp of Object.keys(scale) as Breakpoint[]) {
    const fraction = scale[bp] ?? 0;
    const [min, max] = COLLAGE_WIDTHS[bp];
    const top = fraction * max * MAX_DENSITY;
    if (bp === "sm") {
      // Phone widths vary a lot across Small, so its files form a ladder STEP apart, from the
      // narrowest phone at 1x to the widest at 2x: every phone finds one close to its size.
      for (let width = top; width > (fraction * min) / STEP; width /= STEP) {
        wanted.push(Math.max(width, fraction * min));
      }
    } else {
      wanted.push(fraction * min, fraction * max, top);
    }
  }
  const sorted = wanted
    .map((width) => Math.min(Math.ceil(width), sourceWidth))
    .sort((a, b) => b - a);
  const widths: number[] = [];
  for (const width of sorted) {
    const last = widths.at(-1);
    // A pixel of slack, so rounding up doesn't knock a rung out of the phone ladder.
    if (width >= 16 && (last === undefined || width * STEP <= last + 1)) widths.push(width);
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
  // On 3x phones, an understated width (see MAX_DENSITY).
  const densePhone = scale.sm
    ? `(min-resolution: ${PHONE_DENSITY}dppx) calc(${((scale.sm * MAX_DENSITY) / PHONE_DENSITY).toFixed(4)} * ${narrow})`
    : null;
  return [
    `(min-width: ${SITE.pageWidth}px) ${drawn("lg", `${MAX_WIDTH}px`)}`,
    `(min-width: ${viewportFor(BREAKPOINT_MIN.lg)}px) ${drawn("lg", wide)}`,
    `(min-width: ${SITE.medium}px) ${drawn("md", wide)}`,
    `(min-width: ${viewportFor(BREAKPOINT_MIN.md)}px) ${drawn("md", narrow)}`,
    densePhone,
    drawn("sm", narrow),
  ]
    .filter(Boolean)
    .join(", ");
}
