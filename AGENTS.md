# AGENTS.md

## Cursor Cloud specific instructions

This is a personal website/blog built with **Eleventy (11ty) v3**, using JSX templates, Sass, and deployed to Netlify. There is a single service: the Eleventy dev server.

### Running the dev server

```bash
yarn start
```

This starts both the Eleventy dev server (port **1995**) and the Sass watcher concurrently. No databases, Docker, or environment variables are needed.

### Build

```bash
yarn build
```

Runs `yarn clean`, compiles Sass, and builds Eleventy. Output goes to `_site/`.

### Lint / Tests

There are no dedicated lint or test scripts in this project. The build itself (`yarn build`) is the primary correctness check — if it completes successfully with no errors, the site is healthy.

### Notes

- The `.nvmrc` specifies Node 22.
- The only external data dependency is a Readwise highlights API (`api.chsmc.workers.dev`). It gracefully falls back to an empty array on failure, so builds work offline.
- Sass source is in `src/css/`, compiled output lands in `src/_includes/styles/`.
- The Eleventy dev server supports hot-reload for templates and content. Sass changes are picked up by the concurrent `sass --watch` process.
