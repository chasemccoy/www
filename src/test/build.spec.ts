import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const dist = resolve(import.meta.dirname, "../../dist");
const hasDist = existsSync(dist);

if (!hasDist) {
  console.warn("⚠ dist/ not found — skipping build output tests. Run `pnpm build` first.");
}

function readDist(path: string): string {
  return readFileSync(resolve(dist, path), "utf-8");
}

describe.skipIf(!hasDist)("feed.xml", () => {
  it("is valid RSS 2.0", () => {
    const xml = readDist("feed.xml");
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<rss");
    expect(xml).toContain("<channel>");
  });

  it("contains the site title and description", () => {
    const xml = readDist("feed.xml");
    expect(xml).toContain("<title>Chase McCoy</title>");
    expect(xml).toContain("<description>");
  });

  it("contains at least one item with required fields", () => {
    const xml = readDist("feed.xml");
    expect(xml).toContain("<item>");
    expect(xml).toContain("<title>");
    expect(xml).toContain("<link>");
    expect(xml).toContain("<pubDate>");
    expect(xml).toContain("<content:encoded>");
  });

  it("has absolute URLs for item links", () => {
    const xml = readDist("feed.xml");
    const links = [...xml.matchAll(/<item>.*?<link>(.*?)<\/link>/gs)];
    expect(links.length).toBeGreaterThan(0);

    for (const [, url] of links) {
      expect(url).toMatch(/^https?:\/\//);
    }
  });
});

describe.skipIf(!hasDist)("index page", () => {
  it("has a valid HTML document structure", () => {
    const html = readDist("index.html");
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");
  });

  it("includes the site header", () => {
    const html = readDist("index.html");
    expect(html).toContain("chsmc.org");
  });

  it("includes the RSS feed link", () => {
    const html = readDist("index.html");
    expect(html).toContain('href="/feed.xml"');
    expect(html).toContain('type="application/rss+xml"');
  });

  it("includes the Twitter widgets script", () => {
    const html = readDist("index.html");
    expect(html).toContain("https://platform.twitter.com/widgets.js");
  });
});

describe.skipIf(!hasDist)("404 page", () => {
  it("exists", () => {
    expect(existsSync(resolve(dist, "404.html"))).toBe(true);
  });
});
