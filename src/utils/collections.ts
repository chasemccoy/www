import { getCollection } from 'astro:content';
import { filterTagList } from './filters';
import type { PostLink } from '../types';

export async function getPosts() {
  const posts = await getCollection('posts');
  return posts
    .map(post => ({
      ...post,
      date: post.data.date,
      permalink: post.data.permalink,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}

type PostWithDate = Awaited<ReturnType<typeof getPosts>>[number];

function toPostFeedItem(post: PostWithDate): PostWithDate & { type: 'post' } {
  return { ...post, type: 'post' };
}

export async function getVisiblePosts() {
  const posts = await getPosts();
  return posts.filter(p => !p.data.hidden);
}

export async function getFeaturedPosts(): Promise<PostLink[]> {
  const posts = await getVisiblePosts();
  return posts
    .filter(p => p.data.title && p.data.featured)
    .map<PostLink>(p => ({
      permalink: p.permalink,
      title: p.data.title,
    }))
    .reverse();
}

export async function getPostsByYear() {
  const posts = await getVisiblePosts();
  const groups: Record<string, PostWithDate[]> = {};
  for (const post of posts) {
    const year = post.date.getUTCFullYear().toString();
    groups[year] ??= [];
    groups[year].push(post);
  }
  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
  );
}

export async function getYears() {
  const posts = await getVisiblePosts();
  const yearSet = new Set<string>();
  for (const post of posts) {
    yearSet.add(post.date.getUTCFullYear().toString());
  }
  return [...yearSet].sort().reverse();
}

export async function getNotes() {
  const notes = await getCollection('notes');
  return notes;
}

export async function getVisibleNotes() {
  const notes = await getNotes();
  return notes.filter(n => !n.data.hidden);
}

export async function getTagList() {
  const posts = await getCollection('posts');
  const notes = await getCollection('notes');
  const tagSet = new Set<string>();
  [...posts, ...notes].forEach(item => {
    (item.data.tags || []).forEach((tag: string) => tagSet.add(tag));
  });
  return filterTagList([...tagSet]);
}

export async function getBlogroll() {
  const entries = await getCollection('blogroll');
  return entries.map(entry => entry.data);
}

export async function getFeed() {
  const posts = await getVisiblePosts();
  // Latest posts first
  return posts
    .map(toPostFeedItem)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
