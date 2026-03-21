import { describe, it, expect } from "vitest";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeYouTube from "./rehype-youtube.js";

function process(html: string): string {
  return unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeYouTube)
    .use(rehypeStringify)
    .processSync(html)
    .toString();
}

it("transforms a youtube.com/watch URL into a lite-youtube embed", () => {
  const input =
    '<p><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">https://www.youtube.com/watch?v=dQw4w9WgXcQ</a></p>';
  const output = process(input);

  expect(output).toBe('<lite-youtube videoid="dQw4w9WgXcQ"></lite-youtube>');
});

it("transforms a youtu.be short URL", () => {
  const input = '<p><a href="https://youtu.be/dQw4w9WgXcQ">https://youtu.be/dQw4w9WgXcQ</a></p>';
  const output = process(input);

  expect(output).toBe('<lite-youtube videoid="dQw4w9WgXcQ"></lite-youtube>');
});

it("transforms a youtube.com/embed URL", () => {
  const input =
    '<p><a href="https://www.youtube.com/embed/dQw4w9WgXcQ">https://www.youtube.com/embed/dQw4w9WgXcQ</a></p>';
  const output = process(input);

  expect(output).toBe('<lite-youtube videoid="dQw4w9WgXcQ"></lite-youtube>');
});

it("transforms a youtube.com/shorts URL", () => {
  const input =
    '<p><a href="https://www.youtube.com/shorts/dQw4w9WgXcQ">https://www.youtube.com/shorts/dQw4w9WgXcQ</a></p>';
  const output = process(input);

  expect(output).toBe('<lite-youtube videoid="dQw4w9WgXcQ"></lite-youtube>');
});

it("does not transform a YouTube link inline with other text", () => {
  const input =
    '<p>Check out <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">this video</a> for more.</p>';
  const output = process(input);

  expect(output).toContain("<p>");
  expect(output).not.toContain("lite-youtube");
});

it("does not transform a non-YouTube link on its own line", () => {
  const input = '<p><a href="https://example.com">https://example.com</a></p>';
  const output = process(input);

  expect(output).toContain("<p>");
  expect(output).not.toContain("lite-youtube");
});

it("handles a URL without www prefix", () => {
  const input =
    '<p><a href="https://youtube.com/watch?v=dQw4w9WgXcQ">https://youtube.com/watch?v=dQw4w9WgXcQ</a></p>';
  const output = process(input);

  expect(output).toBe('<lite-youtube videoid="dQw4w9WgXcQ"></lite-youtube>');
});

it("ignores paragraphs with multiple children", () => {
  const input =
    '<p><a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">link</a> and more text</p>';
  const output = process(input);

  expect(output).toContain("<p>");
  expect(output).not.toContain("lite-youtube");
});
