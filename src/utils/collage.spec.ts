import { describe, it, expect } from "vitest";
import { BREAKPOINT_MIN } from "../collage/collage.js";
import {
  COLLAGE_BREAKPOINTS,
  COLLAGE_WIDTHS,
  imageSizes,
  imageWidths,
  largestWidth,
} from "./collage.js";

describe("COLLAGE_BREAKPOINTS", () => {
  it("matches the renderer's breakpoints", () => {
    expect(COLLAGE_BREAKPOINTS).toEqual({ md: BREAKPOINT_MIN.md, lg: BREAKPOINT_MIN.lg });
  });
});

describe("imageWidths", () => {
  it("covers every size and density an image is shown at, smallest first", () => {
    const widths = imageWidths({ sm: 0.5, md: 0.25, lg: 0.2 }, 5000);
    expect(widths[0]).toBeLessThan(widths.at(-1) ?? 0);
    expect(widths.at(-1)).toBe(Math.ceil(0.5 * COLLAGE_WIDTHS.sm[1] * 3));
  });

  it("leaves at least a 25% step between widths", () => {
    const widths = imageWidths({ sm: 0.5, md: 0.25, lg: 0.2 }, 5000);
    widths
      .slice(1)
      .forEach((width, i) => expect(width).toBeGreaterThanOrEqual((widths[i] ?? 0) * 1.25));
  });

  it("never asks for more than the source has", () => {
    expect(Math.max(...imageWidths({ lg: 0.5 }, 600))).toBe(600);
  });

  it("makes nothing for an image hidden at every size", () => {
    expect(imageWidths({}, 1000)).toEqual([]);
  });
});

describe("largestWidth", () => {
  it("is the widest an image is drawn, at the densest screen", () => {
    expect(largestWidth({ lg: 0.25 })).toBe(Math.ceil(0.25 * COLLAGE_WIDTHS.lg[1] * 2));
  });
});

describe("imageSizes", () => {
  it("describes the drawn width at every viewport, widest first", () => {
    const sizes = imageSizes({ sm: 0.5, md: 0.25, lg: 0.2 }).split(", ");
    expect(sizes).toHaveLength(5);
    expect(sizes[0]).toMatch(/^\(min-width: \d+px\) calc\(0\.2000 \* \d+px\)$/);
    expect(sizes.at(-1)).toBe("calc(0.5000 * (100vw - 34px))");
  });

  it("asks for almost nothing at sizes where the image is hidden", () => {
    expect(imageSizes({ lg: 0.2 }).split(", ").at(-1)).toBe("1px");
  });
});
