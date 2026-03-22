import { describe, it, expect } from "vitest";
import type { CollectionEntry } from "astro:content";
import {
  getAdjacentPosts,
  getDateFromPostId,
  getPageTitle,
  getPermalinkFromPostId,
  getPostDisplayTitle,
  getSlugFromPostId,
  resolvePostDate,
} from "./index.js";

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

describe("getDateFromPostId", () => {
  it("extracts the date from a flat post id", () => {
    const result = getDateFromPostId("2024-01-15-my-post");

    expect(result).toEqual(new Date("2024-01-15T00:00:00.000Z"));
  });

  it("extracts the date from a directory-style post id", () => {
    const result = getDateFromPostId("2024-06-17-no-reservations/index");

    expect(result).toEqual(new Date("2024-06-17T00:00:00.000Z"));
  });

  it("returns a UTC midnight date", () => {
    const result = getDateFromPostId("2023-12-25-christmas");

    expect(result.getUTCHours()).toBe(0);
    expect(result.getUTCMinutes()).toBe(0);
    expect(result.getUTCSeconds()).toBe(0);
  });

  it("throws for an id without a date prefix", () => {
    expect(() => getDateFromPostId("no-date-here")).toThrow(
      "Invalid post id, expected YYYY-MM-DD prefix: no-date-here",
    );
  });
});

describe("resolvePostDate", () => {
  it("uses the filename date when no frontmatter date is provided", () => {
    const result = resolvePostDate("2024-03-15-my-post");

    expect(result).toEqual(new Date("2024-03-15T00:00:00.000Z"));
  });

  it("uses the filename date when frontmatter date is undefined", () => {
    const result = resolvePostDate("2024-03-15-my-post", undefined);

    expect(result).toEqual(new Date("2024-03-15T00:00:00.000Z"));
  });

  it("overrides with a frontmatter Date object", () => {
    const frontmatter = new Date("2025-01-01T12:00:00.000Z");
    const result = resolvePostDate("2024-03-15-my-post", frontmatter);

    expect(result).toEqual(frontmatter);
  });

  it("overrides with a frontmatter date string", () => {
    const result = resolvePostDate("2024-08-08-orbit-css", "2024-08-08T15:21:00-05:00");

    expect(result).toEqual(new Date("2024-08-08T15:21:00-05:00"));
  });
});

describe("getSlugFromPostId", () => {
  it("strips the date prefix from a flat post id", () => {
    expect(getSlugFromPostId("2024-01-15-my-post")).toBe("my-post");
  });

  it("strips the date prefix and /index from a directory-style post id", () => {
    expect(getSlugFromPostId("2024-01-15-my-post/index")).toBe("my-post");
  });

  it("strips the date prefix and nested paths from a directory-style post id", () => {
    expect(getSlugFromPostId("2024-01-15-my-post/images/photo")).toBe("my-post");
  });
});

describe("getPermalinkFromPostId", () => {
  it("builds a permalink from a flat post id", () => {
    expect(getPermalinkFromPostId("2024-01-15-my-post")).toBe("/2024/01/my-post/");
  });

  it("builds a permalink from a directory-style post id", () => {
    expect(getPermalinkFromPostId("2024-06-17-no-reservations/index")).toBe(
      "/2024/06/no-reservations/",
    );
  });

  it("zero-pads single-digit months", () => {
    expect(getPermalinkFromPostId("2024-03-01-spring")).toBe("/2024/03/spring/");
  });

  it("handles double-digit months", () => {
    expect(getPermalinkFromPostId("2024-12-25-christmas")).toBe("/2024/12/christmas/");
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
