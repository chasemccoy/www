import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import { COLLAGE_WIDTHS, SITE, imageSizes, imageWidths, largestWidth } from "./collage.js";

const styles = (file: string) =>
  readFileSync(new URL(`../styles/${file}`, import.meta.url), "utf8");
const num = (n: number) => String(n).replace(".", "\\.");

describe("SITE", () => {
  it("matches the masthead's styles", () => {
    const wrapper = styles("_Wrapper.scss");
    const masthead = wrapper.match(/\.Masthead \{([\s\S]*?)\n\}/)?.[1] ?? "";
    const { small, medium } = SITE.padding;
    expect(wrapper).toMatch(new RegExp(`\\.Page \\{[^}]*max-width: ${SITE.pageWidth}px;`));
    expect(masthead).toMatch(new RegExp(`^  padding: ${num(small)}rem ${num(small)}rem 0;`, "m"));
    expect(masthead).toMatch(
      new RegExp(`@include medium \\{\\s*padding: ${num(medium)}rem ${num(medium)}rem 0;`),
    );
    expect(styles("_mixins.scss")).toMatch(
      new RegExp(`@mixin medium \\{\\s*@media \\(min-width: ${SITE.medium}px\\)`),
    );
    expect(styles("_theme.scss")).toMatch(new RegExp(`--root-font-size: ${SITE.rem}px;`));
  });
});

describe("imageWidths", () => {
  it("covers every size and density an image is shown at, smallest first", () => {
    const widths = imageWidths({ sm: 0.5, md: 0.25, lg: 0.2 }, 5000);
    expect(widths[0]).toBeLessThan(widths.at(-1) ?? 0);
    expect(widths.at(-1)).toBe(Math.ceil(0.5 * COLLAGE_WIDTHS.sm[1] * 2));
  });

  it("leaves about a 25% step between widths", () => {
    const widths = imageWidths({ sm: 0.5, md: 0.25, lg: 0.2 }, 5000);
    widths
      .slice(1)
      .forEach((width, i) => expect(width).toBeGreaterThanOrEqual((widths[i] ?? 0) * 1.25 - 1));
  });

  it("gives phones a width every 25% from the narrowest at 1x to the widest at 2x", () => {
    const widths = imageWidths({ sm: 0.5 }, 5000);
    expect(widths[0]).toBeLessThanOrEqual(Math.ceil(0.5 * COLLAGE_WIDTHS.sm[0] * 1.25));
    expect(widths.at(-1)).toBe(Math.ceil(0.5 * COLLAGE_WIDTHS.sm[1] * 2));
    widths.slice(1).forEach((width, i) => expect(width / (widths[i] ?? 1)).toBeLessThan(1.27));
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
    expect(sizes).toHaveLength(6);
    expect(sizes[0]).toBe("(min-width: 1200px) calc(0.2000 * 1149px)");
    expect(sizes.at(-1)).toBe("calc(0.5000 * (100vw - 34px))");
  });

  it("steers 3x phones to 2x files", () => {
    const sizes = imageSizes({ sm: 0.5 }).split(", ");
    expect(sizes.at(-2)).toBe("(min-resolution: 3dppx) calc(0.3333 * (100vw - 34px))");
  });

  it("asks for almost nothing at sizes where the image is hidden", () => {
    expect(imageSizes({ lg: 0.2 }).split(", ").at(-1)).toBe("1px");
  });
});
