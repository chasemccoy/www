import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

export const collections = { posts, notes };
