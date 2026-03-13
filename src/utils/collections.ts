import { getCollection } from 'astro:content';
import { filterTagList, getDateFromPostId, getPermalinkFromPost } from './filters';

export async function getPosts() {
  const posts = await getCollection('posts');
  return posts
    .map(post => ({
      ...post,
      date: getDateFromPostId(post.id),
      permalink: getPermalinkFromPost(post),
    }))
    .filter(p => p.date)
    .sort((a, b) => a.date!.getTime() - b.date!.getTime());
}

export async function getVisiblePosts() {
  const posts = await getPosts();
  return posts.filter(p => !p.data.hidden);
}

export async function getFeaturedPosts() {
  const posts = await getVisiblePosts();
  return posts
    .filter(p => p.data.title && p.data.featured)
    .reverse();
}

export async function getPostsByYear() {
  const posts = await getVisiblePosts();
  const groups: Record<string, any[]> = {};
  for (const post of posts) {
    const year = post.date!.getUTCFullYear().toString();
    if (!groups[year]) groups[year] = [];
    groups[year].push(post);
  }
  const keys = Object.keys(groups).sort().reverse();
  const results: Record<string, any[]> = {};
  keys.forEach(key => (results[key] = groups[key]));
  return results;
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
  const postsWithType = posts.map(p => ({ ...p, type: 'post' as const }));

  const highlightEntries = await getCollection('highlights');
  const highlights = highlightEntries.map(h => ({
    ...h.data,
    type: 'highlight' as const,
  }));

  return [...highlights, ...postsWithType].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}
