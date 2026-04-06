import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { file } from "astro/loaders";
import fg from "fast-glob";
import matter from "gray-matter";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { relative } from "path";
import { resolvePostDate, getPermalinkFromPostId } from "./utils/index.js";

const posts = defineCollection({
  loader: {
    name: "posts-loader",
    // oxlint-disable-next-line typescript/unbound-method
    load: async ({ store, renderMarkdown, parseData, config, watcher }) => {
      const postsDir = fileURLToPath(new URL("./posts", config.root));
      const paths = await fg("**/*.md", { cwd: "./posts" });
      store.clear();

      async function loadPost(path: string) {
        const id = path.replace(/\.md$/, "");
        const fileURL = new URL(`./posts/${path}`, config.root);
        const source = await readFile(fileURL, "utf8");
        const parsed = matter(source);

        const data = await parseData({
          id,
          data: {
            ...parsed.data,
            date: resolvePostDate(id, parsed.data.date),
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

      for (const path of paths) {
        await loadPost(path);
      }

      if (!watcher) return;

      watcher.add(postsDir);

      function getRelativePath(absPath: string) {
        const rel = relative(postsDir, absPath);
        return rel.startsWith("..") ? null : rel;
      }

      async function onChange(changedPath: string) {
        const rel = getRelativePath(changedPath);
        if (!rel || !rel.endsWith(".md")) return;
        await loadPost(rel);
      }

      watcher.on("change", onChange);
      watcher.on("add", onChange);
      watcher.on("unlink", (deletedPath: string) => {
        const rel = getRelativePath(deletedPath);
        if (!rel || !rel.endsWith(".md")) return;
        const id = rel.replace(/\.md$/, "");
        store.delete(id);
      });
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

const blogroll = defineCollection({
  loader: file("src/data/blogroll.json"),
  schema: z.object({
    name: z.string(),
    url: z.string(),
  }),
});

export const collections = { posts, blogroll };
