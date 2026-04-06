import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    alias: {
      "astro:content": fileURLToPath(new URL("./src/test/astro-content.mock.ts", import.meta.url)),
    },
  },
});
