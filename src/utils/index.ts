import { format } from "date-fns";
import { utc } from "@date-fns/utc";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { PostLink } from "../types";

type Post = CollectionEntry<"posts">;

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function titleize(slug: string) {
  return capitalize(slug.replaceAll("-", " "));
}

export function readableDate(dateObj: Date | string) {
  return format(new Date(dateObj), "LLLL d, yyyy", { in: utc });
}

export function shortDate(dateObj: Date | string) {
  return format(new Date(dateObj), "LLLL d", { in: utc });
}

export function metaDate(date: Date | string) {
  return dateWithYearIfPast(date, "LLLL d");
}

export function inlineDate(date: Date | string) {
  return dateWithYearIfPast(date, "MMM d");
}

// "This year" is as of the build: rebuild in January or old dates keep
// omitting the year.
function dateWithYearIfPast(dateObj: Date | string, pattern: string) {
  const date = new Date(dateObj);
  const isThisYear = date.getUTCFullYear() === new Date().getUTCFullYear();
  return format(date, isThisYear ? pattern : `${pattern}, yyyy`, { in: utc });
}

export function htmlDateString(dateObj: Date | string) {
  return format(new Date(dateObj), "yyyy-LL-dd", { in: utc });
}

export function getSlugFromPostId(id: string): string {
  return id
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/\/index$/, "")
    .replace(/\/.*$/, "");
}

export function getDateFromPostId(id: string) {
  const match = id.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match?.[1]) {
    throw new Error(`Invalid post id, expected YYYY-MM-DD prefix: ${id}`);
  }
  return new Date(`${match[1]}T00:00:00.000Z`);
}

export function resolvePostDate(id: string, frontmatterDate?: Date | string) {
  if (frontmatterDate) {
    return new Date(frontmatterDate);
  }

  return getDateFromPostId(id);
}

export function getPermalinkFromPostId(id: string): string {
  const date = getDateFromPostId(id);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const slug = getSlugFromPostId(id);
  return `/${year}/${month}/${slug}/`;
}

export function getPostDisplayTitle(post: { title?: string; date: Date | string }): string {
  return post.title || `Note from ${readableDate(post.date)}`;
}

export function getAdjacentPosts(posts: Post[], currentId: string) {
  const ordered = posts
    .filter((p) => !p.data.hidden)
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());

  const currentIndex = ordered.findIndex((p) => p.id === currentId);
  const previous = currentIndex > 0 ? ordered[currentIndex - 1] : undefined;
  const next =
    currentIndex >= 0 && currentIndex < ordered.length - 1 ? ordered[currentIndex + 1] : undefined;

  return {
    previous: previous && toPostLink(previous),
    next: next && toPostLink(next),
  };
}

function toPostLink(post: Post): PostLink {
  return { permalink: post.data.permalink, title: post.data.title };
}

export function getPageTitle(
  siteTitle: string,
  options: { title?: string; date?: Date | string; pageUrl?: string },
): string {
  if (options.title) {
    return `${options.title} | ${siteTitle}`;
  }

  if (options.date && options.pageUrl?.match(/\/\d{4}\/\d{2}\//)) {
    return `${getPostDisplayTitle({ date: options.date })} | ${siteTitle}`;
  }

  return siteTitle;
}

export const SHOW_DRAFTS = import.meta.env.DEV;

// Newest first.
export async function getPosts() {
  const posts = await getCollection("posts");
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getVisiblePosts() {
  const posts = await getPosts();
  if (SHOW_DRAFTS) return posts;
  return posts.filter((p) => !p.data.hidden);
}

export async function getFeaturedPosts(): Promise<PostLink[]> {
  const posts = await getVisiblePosts();
  return posts.filter((p) => p.data.title && p.data.featured).map(toPostLink);
}

function groupPosts(posts: Post[], keysOf: (post: Post) => string[]) {
  const groups: Record<string, Post[]> = {};
  for (const post of posts) {
    for (const key of keysOf(post)) (groups[key] ??= []).push(post);
  }
  return groups;
}

// Year keys are integer-like, so they always enumerate oldest first.
export async function getPostsByYear() {
  return groupPosts(await getVisiblePosts(), (p) => [String(p.data.date.getUTCFullYear())]);
}

export function getTagSlug(tag: string) {
  return tag.replaceAll(" ", "-");
}

export async function getPostsByTag() {
  const groups = groupPosts(await getVisiblePosts(), (p) => p.data.tags);
  return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)));
}

export async function getArchiveIndex() {
  const [featuredPosts, byYear, byTag] = await Promise.all([
    getFeaturedPosts(),
    getPostsByYear(),
    getPostsByTag(),
  ]);

  return {
    featuredPosts,
    years: Object.keys(byYear),
    tags: Object.entries(byTag).map(([tag, posts]) => ({
      title: tag,
      permalink: `/tag/${getTagSlug(tag)}/`,
      count: posts.length,
    })),
  };
}

export const FEED_PAGE_SIZE = 20;

export const TRUNCATE_WORD_COUNT = 1200;

export function shouldTruncatePost(post: Post): boolean {
  return !!post.data.title && post.data.wordCount > TRUNCATE_WORD_COUNT;
}
