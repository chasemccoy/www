import { describe, it, expect } from "vitest";
import type { CollectionEntry } from "astro:content";
import { getAdjacentPosts, getPageTitle, getPostDisplayTitle } from "./index.js";

function makePost(
  id: string,
  date: string,
  options: { hidden?: boolean; title?: string } = {},
): CollectionEntry<"posts"> {
  return {
    id,
    collection: "posts",
    data: {
      date: new Date(`${date}T00:00:00.000Z`),
      permalink: `/${date.replace(/-/g, "/").slice(0, 7)}/${id}/`,
      hidden: options.hidden,
      title: options.title,
      tags: [],
    },
  } as CollectionEntry<"posts">;
}

describe("getAdjacentPosts", () => {
  const posts = [
    makePost("first", "2024-01-01", { title: "First" }),
    makePost("second", "2024-02-01", { title: "Second" }),
    makePost("third", "2024-03-01", { title: "Third" }),
  ];

  it("returns previous and next posts for a middle post", () => {
    const result = getAdjacentPosts(posts, "second");

    expect(result.previous).toEqual({
      permalink: posts[0]!.data.permalink,
      title: "First",
    });
    expect(result.next).toEqual({
      permalink: posts[2]!.data.permalink,
      title: "Third",
    });
  });

  it("returns no previous post for the first post", () => {
    const result = getAdjacentPosts(posts, "first");

    expect(result.previous).toBeUndefined();
    expect(result.next).toEqual({
      permalink: posts[1]!.data.permalink,
      title: "Second",
    });
  });

  it("returns no next post for the last post", () => {
    const result = getAdjacentPosts(posts, "third");

    expect(result.previous).toEqual({
      permalink: posts[1]!.data.permalink,
      title: "Second",
    });
    expect(result.next).toBeUndefined();
  });

  it("returns empty results when post ID is not found", () => {
    const result = getAdjacentPosts(posts, "nonexistent");

    expect(result.previous).toBeUndefined();
    expect(result.next).toBeUndefined();
  });

  it("excludes hidden posts from navigation", () => {
    const withHidden = [
      makePost("first", "2024-01-01", { title: "First" }),
      makePost("hidden", "2024-02-01", { title: "Hidden", hidden: true }),
      makePost("third", "2024-03-01", { title: "Third" }),
    ];

    const result = getAdjacentPosts(withHidden, "first");

    expect(result.next).toEqual({
      permalink: withHidden[2]!.data.permalink,
      title: "Third",
    });
  });

  it("sorts posts by date regardless of input order", () => {
    const unordered = [
      makePost("third", "2024-03-01", { title: "Third" }),
      makePost("first", "2024-01-01", { title: "First" }),
      makePost("second", "2024-02-01", { title: "Second" }),
    ];

    const result = getAdjacentPosts(unordered, "second");

    expect(result.previous?.title).toBe("First");
    expect(result.next?.title).toBe("Third");
  });

  it("handles a single post", () => {
    const single = [makePost("only", "2024-01-01", { title: "Only" })];

    const result = getAdjacentPosts(single, "only");

    expect(result.previous).toBeUndefined();
    expect(result.next).toBeUndefined();
  });

  it("handles posts without titles", () => {
    const untitled = [makePost("a", "2024-01-01"), makePost("b", "2024-02-01")];

    const result = getAdjacentPosts(untitled, "a");

    expect(result.next).toEqual({
      permalink: untitled[1]!.data.permalink,
      title: undefined,
    });
  });
});

describe("getPageTitle", () => {
  const siteTitle = "Chase McCoy";

  it("uses the page title when provided", () => {
    const result = getPageTitle(siteTitle, { title: "My Post" });

    expect(result).toBe("My Post | Chase McCoy");
  });

  it("uses a note-style title for dateless post URLs with a date", () => {
    const result = getPageTitle(siteTitle, {
      date: new Date("2024-06-15T00:00:00.000Z"),
      pageUrl: "/2024/06/some-slug/",
    });

    expect(result).toBe("Note from June 15, 2024 | Chase McCoy");
  });

  it("returns just the site title when no title or matching date/URL", () => {
    const result = getPageTitle(siteTitle, {});

    expect(result).toBe("Chase McCoy");
  });

  it("returns just the site title when date is present but URL does not match", () => {
    const result = getPageTitle(siteTitle, {
      date: new Date("2024-06-15T00:00:00.000Z"),
      pageUrl: "/notes/some-note/",
    });

    expect(result).toBe("Chase McCoy");
  });

  it("prefers title over date-based title", () => {
    const result = getPageTitle(siteTitle, {
      title: "Explicit Title",
      date: new Date("2024-06-15T00:00:00.000Z"),
      pageUrl: "/2024/06/some-slug/",
    });

    expect(result).toBe("Explicit Title | Chase McCoy");
  });

  it("returns just site title when date is present but no pageUrl", () => {
    const result = getPageTitle(siteTitle, {
      date: new Date("2024-06-15T00:00:00.000Z"),
    });

    expect(result).toBe("Chase McCoy");
  });
});

describe("getPostDisplayTitle", () => {
  it("returns the title when present", () => {
    const result = getPostDisplayTitle({
      title: "My Great Post",
      date: new Date("2024-06-15T00:00:00.000Z"),
    });

    expect(result).toBe("My Great Post");
  });

  it("returns a note-style title when no title is provided", () => {
    const result = getPostDisplayTitle({
      date: new Date("2024-06-15T00:00:00.000Z"),
    });

    expect(result).toBe("Note from June 15, 2024");
  });

  it("handles string dates", () => {
    const result = getPostDisplayTitle({
      date: "2024-01-01T00:00:00.000Z",
    });

    expect(result).toBe("Note from January 1, 2024");
  });
});
