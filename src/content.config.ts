import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { readFile } from 'fs/promises';

function getRequiredDateFromPostId(id: string): Date {
  const match = id.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match) {
    throw new Error(`Invalid post id, expected YYYY-MM-DD prefix: ${id}`);
  }
  return new Date(`${match[1]}T00:00:00.000Z`);
}

function getSlugFromPostId(id: string): string {
  return id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\/index$/, '').replace(/\/.*$/, '');
}

function getPermalinkFromPostId(id: string): string {
  const date = getRequiredDateFromPostId(id);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const slug = getSlugFromPostId(id);
  return `/${year}/${month}/${slug}/`;
}

const posts = defineCollection({
  loader: async () => {
    const paths = await fg('**/*.md', { cwd: './posts' });
    return Promise.all(
      paths.map(async path => {
        const id = path.replace(/\.md$/, '');
        const source = await readFile(`./posts/${path}`, 'utf8');
        const parsed = matter(source);

        return {
          id,
          body: parsed.content,
          ...parsed.data,
          date: getRequiredDateFromPostId(id),
          permalink: getPermalinkFromPostId(id),
        };
      })
    );
  },
  schema: z.object({
    title: z.string().optional(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().optional(),
    hidden: z.boolean().optional(),
    tags: z.array(z.string()).optional().default([]),
    date: z.date(),
    permalink: z.string(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './notes' }),
  schema: z.object({
    title: z.string().optional(),
    excerpt: z.string().nullable().optional(),
    hidden: z.boolean().optional(),
    tags: z.array(z.string()).optional().default([]),
  }),
});

const blogroll = defineCollection({
  loader: file('src/data/blogroll.json'),
  schema: z.object({
    name: z.string(),
    url: z.string(),
  }),
});

const highlights = defineCollection({
  loader: async () => {
    try {
      const response = await fetch('https://api.chsmc.workers.dev/highlights-feed');
      if (!response.ok) return [];
      const data: Record<string, unknown>[] = await response.json();
      return data.map((item, index) => ({
        ...item,
        id: String(item.id ?? index),
      }));
    } catch {
      return [];
    }
  },
  schema: z.object({
    text: z.string(),
    note: z.string().nullable().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).nullable().optional(),
    readwise_url: z.string().optional(),
    source: z.object({
      id: z.number().optional(),
      title: z.string().nullable().optional(),
      author: z.string().nullable().optional(),
      url: z.string().nullable().optional(),
      image: z.string().nullable().optional(),
      tags: z.array(z.string()).nullable().optional(),
      note: z.string().nullable().optional(),
    }).optional(),
  }),
});

export const collections = { posts, notes, blogroll, highlights };
