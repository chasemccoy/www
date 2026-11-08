// How wide the header collage is drawn, for sizing its images. scripts/pull-collage.js imports this
// under plain Node, so import only plain JS here.
import { BREAKPOINT_MIN } from "../collage/collage.js";

export type Breakpoint = "sm" | "md" | "lg";

// The fraction of the collage's width an image is drawn at per layout size; missing where hidden.
export type ImageScale = Partial<Record<Breakpoint, number>>;

// Mirrors _Wrapper.scss, _mixins.scss, and _theme.scss; collage.spec.ts checks that they agree.
export const SITE = {
  rem: 17, // px
  medium: 900, // px
  pageWidth: 1200, // px
  padding: { small: 1, medium: 1.5 }, // rem a side
};

const INSET_SMALL = 2 * SITE.padding.small * SITE.rem;
const INSET_MEDIUM = 2 * SITE.padding.medium * SITE.rem;
const MAX_WIDTH = SITE.pageWidth - INSET_MEDIUM;
const SMALLEST_VIEWPORT = 320;

// The collage widths (not viewport widths) each layout size covers.
export const COLLAGE_WIDTHS: Record<Breakpoint, [number, number]> = {
  sm: [SMALLEST_VIEWPORT - INSET_SMALL, BREAKPOINT_MIN.md - 1],
  md: [BREAKPOINT_MIN.md, BREAKPOINT_MIN.lg - 1],
  lg: [BREAKPOINT_MIN.lg, MAX_WIDTH],
};

// Images are made up to 2x. imageSizes understates the drawn width on 3x phones so they pick 2x.
const MAX_DENSITY = 2;
const PHONE_DENSITY = 3;

// The minimum ratio between neighboring widths.
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
      // Phone widths vary widely, so Small gets a ladder of widths from 1x to 2x.
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
  // See MAX_DENSITY.
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
