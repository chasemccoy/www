import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './posts' }),
  schema: z.object({
    title: z.string().optional(),
    excerpt: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().optional(),
    hidden: z.boolean().optional(),
    tags: z.array(z.string()).optional().default([]),
    layout: z.string().optional(),
    permalink: z.string().optional(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './notes' }),
  schema: z.object({
    title: z.string().optional(),
    excerpt: z.string().nullable().optional(),
    tags: z.array(z.string()).optional().default([]),
    layout: z.string().optional(),
    permalink: z.string().optional(),
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
      const data = await response.json();
      return (data as any[]).map((item: any, index: number) => ({
        id: String(item.id ?? index),
        ...item,
      }));
    } catch {
      return [];
    }
  },
  schema: z.object({
    text: z.string(),
    note: z.string().optional(),
    date: z.coerce.date(),
    source: z.object({
      title: z.string().optional(),
      author: z.string().optional(),
      url: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { posts, notes, blogroll, highlights };
