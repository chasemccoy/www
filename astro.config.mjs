import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig({
  site: 'https://chsmc.org',
  integrations: [vue()],
  server: {
    port: 1995,
  },
  markdown: {
    syntaxHighlight: 'prism',
    remarkPlugins: [],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
    remarkRehype: {
      allowDangerousHtml: true,
    },
  },
  build: {
    format: 'directory',
  },
});
