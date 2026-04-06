import { it, expect } from "vitest";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeTwitter from "./rehype-twitter.js";

function process(html: string): string {
  return unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeTwitter)
    .use(rehypeStringify)
    .processSync(html)
    .toString();
}

it("transforms a twitter.com status URL into a tweet embed", () => {
  const input =
    '<p><a href="https://twitter.com/SaraSoueidan/status/1289865845053652994">https://twitter.com/SaraSoueidan/status/1289865845053652994</a></p>';
  const output = process(input);

  expect(output).toBe(
    '<blockquote class="twitter-tweet"><a href="https://twitter.com/SaraSoueidan/status/1289865845053652994">https://twitter.com/SaraSoueidan/status/1289865845053652994</a></blockquote>',
  );
});

it("transforms an x.com status URL into a tweet embed", () => {
  const input =
    '<p><a href="https://x.com/SaraSoueidan/status/1289865845053652994">https://x.com/SaraSoueidan/status/1289865845053652994</a></p>';
  const output = process(input);

  expect(output).toBe(
    '<blockquote class="twitter-tweet"><a href="https://twitter.com/SaraSoueidan/status/1289865845053652994">https://twitter.com/SaraSoueidan/status/1289865845053652994</a></blockquote>',
  );
});

it("transforms a www.twitter.com URL", () => {
  const input =
    '<p><a href="https://www.twitter.com/user/status/123456789">https://www.twitter.com/user/status/123456789</a></p>';
  const output = process(input);

  expect(output).toBe(
    '<blockquote class="twitter-tweet"><a href="https://twitter.com/user/status/123456789">https://twitter.com/user/status/123456789</a></blockquote>',
  );
});

it("transforms a mobile.twitter.com URL", () => {
  const input =
    '<p><a href="https://mobile.twitter.com/user/status/123456789">https://mobile.twitter.com/user/status/123456789</a></p>';
  const output = process(input);

  expect(output).toBe(
    '<blockquote class="twitter-tweet"><a href="https://twitter.com/user/status/123456789">https://twitter.com/user/status/123456789</a></blockquote>',
  );
});

it("handles URLs with query parameters", () => {
  const input =
    '<p><a href="https://twitter.com/user/status/123456789?s=20&amp;t=abc">https://twitter.com/user/status/123456789?s=20&amp;t=abc</a></p>';
  const output = process(input);

  expect(output).toBe(
    '<blockquote class="twitter-tweet"><a href="https://twitter.com/user/status/123456789">https://twitter.com/user/status/123456789</a></blockquote>',
  );
});

it("does not transform a Twitter link inline with other text", () => {
  const input =
    '<p>Check out <a href="https://twitter.com/user/status/123456789">this tweet</a> for more.</p>';
  const output = process(input);

  expect(output).toContain("<p>");
  expect(output).not.toContain("twitter-tweet");
});

it("does not transform a non-status Twitter URL", () => {
  const input = '<p><a href="https://twitter.com/user">https://twitter.com/user</a></p>';
  const output = process(input);

  expect(output).toContain("<p>");
  expect(output).not.toContain("twitter-tweet");
});

it("does not transform a non-Twitter link", () => {
  const input = '<p><a href="https://example.com">https://example.com</a></p>';
  const output = process(input);

  expect(output).toContain("<p>");
  expect(output).not.toContain("twitter-tweet");
});

it("ignores paragraphs with multiple children", () => {
  const input = '<p><a href="https://twitter.com/user/status/123456789">link</a> and more text</p>';
  const output = process(input);

  expect(output).toContain("<p>");
  expect(output).not.toContain("twitter-tweet");
});
