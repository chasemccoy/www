import { describe, it, expect } from "vitest";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeFigure from "./rehype-figure.js";

function process(html: string): string {
  return unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeFigure)
    .use(rehypeStringify)
    .processSync(html)
    .toString();
}

it("wraps an image with a title in a figure with figcaption", () => {
  const input = '<p><img src="photo.jpg" alt="A photo" title="My caption"></p>';
  const output = process(input);

  expect(output).toContain("<figure>");
  expect(output).toContain("<figcaption>My caption</figcaption>");
  expect(output).not.toContain("title=");
});

it("parses markdown links in the caption", () => {
  const input = '<p><img src="photo.jpg" title="Credit: [Source](https://example.com)"></p>';
  const output = process(input);

  expect(output).toContain("<figcaption>");
  expect(output).toContain('<a href="https://example.com">Source</a>');
});

it("parses inline markdown formatting in the caption", () => {
  const input = '<p><img src="photo.jpg" title="This is *emphasized* text"></p>';
  const output = process(input);

  expect(output).toContain("<figcaption>");
  expect(output).toContain("<em>emphasized</em>");
});

it("replaces a wrapping p tag with figure when img is the only child", () => {
  const input = '<p><img src="photo.jpg" title="Caption"></p>';
  const output = process(input);

  expect(output).not.toContain("<p>");
  expect(output).toMatch(/^<figure>/);
});

it("leaves images without a title unchanged", () => {
  const input = '<p><img src="photo.jpg" alt="A photo"></p>';
  const output = process(input);

  expect(output).not.toContain("<figure>");
  expect(output).not.toContain("<figcaption>");
  expect(output).toContain("<p>");
});

it("preserves the alt attribute on the image", () => {
  const input = '<p><img src="photo.jpg" alt="Alt text" title="Caption"></p>';
  const output = process(input);

  expect(output).toContain('alt="Alt text"');
});

it("handles a caption that is entirely a markdown link", () => {
  const input =
    '<p><img src="photo.jpg" title="[CHIP magazine](https://archive.org/details/chip)"></p>';
  const output = process(input);

  expect(output).toContain(
    '<figcaption><a href="https://archive.org/details/chip">CHIP magazine</a></figcaption>',
  );
});
