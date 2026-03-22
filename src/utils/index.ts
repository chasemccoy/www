import { format, formatISO } from "date-fns";
import { utc } from "@date-fns/utc";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { PostLink } from "../types";

// String helpers

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function titleize(slug: string) {
  return capitalize(slug.replaceAll("-", " "));
}

// Date formatting

export function readableDate(dateObj: Date | string) {
  return format(new Date(dateObj), "LLLL d, yyyy", { in: utc });
}

export function shortDate(dateObj: Date | string) {
  return format(new Date(dateObj), "LLLL d", { in: utc });
}

export function htmlDateString(dateObj: Date | string) {
  return format(new Date(dateObj), "yyyy-LL-dd", { in: utc });
}

export function dateForXMLFeed(date: Date | string) {
  return formatISO(new Date(date), { representation: "date" }) + "T12:00:00.000-05:00";
}

// Post helpers

export function getSlugFromPostId(id: string): string {
  return id
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/\/index$/, "")
    .replace(/\/.*$/, "");
}

export function getPostDisplayTitle(post: { title?: string; date: Date | string }): string {
  return post.title || `Note from ${readableDate(post.date)}`;
}

export function shouldShowCite(post: any, index: number, posts: any[]) {
  const isFirstInSequence =
    posts[index + 1]?.source?.title === post.source?.title &&
    posts[index - 1]?.source?.title !== post.source?.title;
  const isInSequence =
    posts[index - 1]?.source?.title === post.source?.title ||
    posts[index + 1]?.source?.title === post.source?.title;
  return isFirstInSequence || !isInSequence;
}

export function getAdjacentPosts(
  posts: CollectionEntry<"posts">[],
  currentId: string,
) {
  const ordered = posts
    .filter((p) => !p.data.hidden)
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());

  const currentIndex = ordered.findIndex((p) => p.id === currentId);

  const toPostLink = (post: CollectionEntry<"posts"> | undefined): PostLink | undefined =>
    post ? { permalink: post.data.permalink, title: post.data.title } : undefined;

  return {
    previous: toPostLink(currentIndex > 0 ? ordered[currentIndex - 1] : undefined),
    next: toPostLink(
      currentIndex >= 0 && currentIndex < ordered.length - 1
        ? ordered[currentIndex + 1]
        : undefined,
    ),
  };
}

export function getPageTitle(
  siteTitle: string,
  options: { title?: string; date?: Date | string; pageUrl?: string },
): string {
  if (options.title) {
    return `${options.title} | ${siteTitle}`;
  }

  if (options.date && options.pageUrl?.match(/\/\d{4}\/\d{2}\//)) {
    return `Note from ${readableDate(options.date)} | ${siteTitle}`;
  }

  return siteTitle;
}

// Collection helpers

export async function getPosts() {
  const posts = await getCollection("posts");
  return posts
    .map((post) => ({
      ...post,
      date: post.data.date,
      permalink: post.data.permalink,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

export async function getVisiblePosts() {
  const posts = await getPosts();
  return posts.filter((p) => !p.data.hidden);
}

export async function getFeaturedPosts(): Promise<PostLink[]> {
  const posts = await getVisiblePosts();

  return posts
    .filter((p) => p.data.title && p.data.featured)
    .map<PostLink>((p) => ({
      permalink: p.permalink,
      title: p.data.title,
    }))
    .reverse();
}

export async function getPostsByYear() {
  const posts = await getVisiblePosts();
  const groups: Record<string, typeof posts> = {};

  for (const post of posts) {
    const year = post.date.getUTCFullYear().toString();
    groups[year] ??= [];
    groups[year].push(post);
  }

  return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => b.localeCompare(a)));
}

export async function getYears() {
  const posts = await getVisiblePosts();
  const yearSet = new Set<string>();

  for (const post of posts) {
    yearSet.add(post.date.getUTCFullYear().toString());
  }

  return [...yearSet].sort().reverse();
}

export async function getBlogroll() {
  const entries = await getCollection("blogroll");
  return entries.map((entry) => entry.data);
}

export async function getFeed() {
  const posts = await getVisiblePosts();

  // Latest posts first
  return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
}
