import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
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
  loader: {
    name: 'posts-loader',
    load: async ({ store, renderMarkdown, parseData, config }) => {
      const paths = await fg('**/*.md', { cwd: './posts' });
      store.clear();

      for (const path of paths) {
        const id = path.replace(/\.md$/, '');
        const fileURL = new URL(`./posts/${path}`, config.root);
        const source = await readFile(fileURL, 'utf8');
        const parsed = matter(source);

        const frontmatterDate = parsed.data.date
          ? new Date(parsed.data.date)
          : undefined;

        const data = await parseData({
          id,
          data: {
            ...parsed.data,
            date: frontmatterDate ?? getRequiredDateFromPostId(id),
            permalink: getPermalinkFromPostId(id),
          },
        });

        const rendered = await renderMarkdown(parsed.content, { fileURL });

        store.set({
          id,
          data,
          filePath: `posts/${path}`,
          rendered,
          assetImports: rendered?.metadata?.imagePaths,
        });
      }
    },
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

export const collections = { posts, notes, blogroll };
