import { defineConfig } from "astro/config";
import vue from "@astrojs/vue";
import rehypeSlug from "rehype-slug";
import rehypeFigure from "./src/plugins/rehype-figure.js";
import rehypeYouTube from "./src/plugins/rehype-youtube.js";

export default defineConfig({
  site: "https://chsmc.org",
  integrations: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.includes("-"),
        },
      },
    }),
  ],
  server: {
    port: 1995,
  },
  devToolbar: {
    enabled: false,
  },
  markdown: {
    syntaxHighlight: "prism",
    remarkPlugins: [],
    rehypePlugins: [rehypeSlug, rehypeFigure, rehypeYouTube],
    remarkRehype: {
      allowDangerousHtml: true,
    },
  },
  experimental: {
    contentIntellisense: true,
  },
});
