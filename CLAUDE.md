# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Personal website and blog built with **Astro**, **Vue 3** components, **Sass** for styling, and deployed to Netlify.

## Development commands

**Start development server:**

```bash
pnpm dev
# or
pnpm start
# Runs Astro dev server on port 1995
```

**Build for production:**

```bash
pnpm build
# Runs astro check, then the static site build
```

**Preview production build:**

```bash
pnpm preview
```

## Architecture

### Template system

Uses **Astro** (`.astro`) for layouts and pages, and **Vue 3 SFCs** (`.vue`) for presentational components. Astro files use JSX-like template syntax in the HTML section; Vue components use `<script setup lang="ts">` with TypeScript.

**Layouts** (`src/layouts/`):

- `HtmlLayout.astro` — Root HTML shell: head, meta tags, fonts, the gradient-river background layers and anchoring script, and the site footer
- `BaseLayout.astro` — Page chrome (Wrapper grid, SiteHeader, main content slot)
- `PostLayout.astro` — Blog post pages (BlogPost plus previous/next Pagination)
- `PageLayout.astro` — Generic pages (Article wrapper); supports both `.astro` imports and markdown `layout:` frontmatter

**Main pages** (`src/pages/`):

- `index.astro` — Homepage feed (first `FEED_PAGE_SIZE` = 20 items)
- `[page].astro` — Paginated feed (pages 2+)
- `[...slug].astro` — Individual blog posts, routed as `/{year}/{month}/{slug}/`
- `[year]/index.astro` — Year archive pages (`/{year}/`), rendered by `PostArchive`
- `tag/[tag].astro` — Tag archive pages (`/tag/{slug}/`), rendered by `PostArchive`
- `404.astro` — Error page (a `PageLayout` page with the `Archives` index)
- `backstage/[...page].astro` — Hidden drafts listing (only emitted when drafts are shown, i.e. dev builds)
- `feed.xml.ts` — RSS feed endpoint
- `markdown.md` — Markdown style reference page
- `style-guide.md` — The house writing style guide

### Content organization

All content lives in root-level directories, loaded via Astro content collections.

**Blog posts** (`posts/*.md` or `posts/YYYY-MM-DD-slug/index.md`):

- Filename convention: `YYYY-MM-DD-slug.md` — the date and slug are parsed from the filename, not frontmatter
- Frontmatter: `title` (optional), `excerpt`, `image`, `featured`, `hidden`, `tags`, and `date` (optional override of the filename date)
- `tags` is a YAML block list of lowercased display names with spaces (`design systems`, not `design-systems`); `getTagSlug` swaps the spaces for hyphens in URLs
- Routes: `/{year}/{month}/{slug}/`

### Data layer

`src/data/` contains static data:

- `metadata.json` — Site metadata (title, URL, author, feed config)
- `books.ts` — Reading list data
- `quotes.ts` — Quote collection
- `blogroll.json` — Links to other sites (loaded as content collection)

`src/content.config.ts` — Defines content collections: `posts` (custom loader using `fast-glob` + `gray-matter`) and `blogroll` (JSON file loader).

`src/utils/index.ts` — All utility and collection helper functions:

- `readableDate`, `shortDate`, `htmlDateString`, `dateForXMLFeed` — Date formatting (UTC, via `date-fns`)
- `getDateFromPostId`, `getSlugFromPostId`, `getPermalinkFromPostId` — URL/slug computation from post IDs
- `resolvePostDate` — Uses frontmatter date if present, otherwise derives from post ID
- `getPostDisplayTitle`, `getPageTitle` — Title generation helpers
- `getAdjacentPosts` — Previous/next post navigation
- `titleize`, `capitalize` — String helpers
- `SHOW_DRAFTS` — Whether hidden posts are included (true in dev builds only)
- `getPosts()` / `getVisiblePosts()` / `getFeaturedPosts()` — Post collection helpers
- `getPostsByYear()` / `getPostsByTag()` — Archive grouping; `getTagSlug()` maps a tag name to its URL slug
- `getBlogroll()` / `getFeed()` — Feed composition
- `FEED_PAGE_SIZE`, `TRUNCATE_WORD_COUNT`, `shouldTruncatePost()` — Feed pagination and excerpt truncation for long titled posts

`src/utils/river.ts` — Shared constants and pure helpers for the gradient river (see below).

### Collections

The `posts` collection uses a custom loader in `content.config.ts` that reads markdown files from `posts/`, parses frontmatter with `gray-matter`, computes `date` and `permalink` from the filename, and adds `wordCount` and `renderedExcerpt` (the first five paragraphs, used when the feed truncates a long post).

The `feed` is `getVisiblePosts()` sorted newest-first, used for the homepage and paginated feed.

### Styling

Sass files live flat in `src/styles/`, compiled by Astro from the `styles.scss` entry point (imported in `HtmlLayout.astro`):

```
src/styles/
├── styles.scss     # Entry point
├── _reset.scss     # CSS reset
├── _theme.scss     # Design tokens + breakpoint mixins (tiny/small/medium)
├── _river.scss     # The gradient river: mixins, tokens, page background layers
├── _elements.scss  # Global element defaults
├── _prose.scss     # The .prose typography system for Markdown content
├── _Callout.scss   # Callout styles (used in post content)
├── _Wrapper.scss   # Page grid container
├── _utilities.scss # Small utility classes
└── _prism.scss     # Syntax highlighting
```

Conventions:

- **Units**: rem/em for type-relative spacing and sizes; px for hairlines, radii, and small fixed offsets (documented in `_theme.scss`).
- **Component styles** live in Vue SFCs as `<style scoped lang="scss">` blocks, importing `@use '../styles/theme' as *` (breakpoints) or `@use '../styles/river' as *` (river mixins) as needed. A component's scoped styles only reference classes that component itself renders — no styling other components' internals via `:deep()` class reach-ins.
- **Page-specific one-off spacing** goes in a scoped `<style>` block in the page's own `.astro` file — not inline `style=` attributes and not margin utilities.
- **Lists**: bare `ul`/`ol` are plain everywhere; the decorated versions (bullets, counters) are scoped to `.prose` (see `_prose.scss`). Components that want decoration style it themselves, and must hold up inside a `.prose` page too (e.g. `Archives.vue` resets prose's list decoration before adding its own).
- **`.prose` selectors**: spacing/rhythm rules that post content might want to override are wrapped in `:where()`; structural rules use plain selectors.
- **`.prose` headings are adaptive**: body headings are styled bottom-up by how many levels a `.prose` block actually uses (via `:has()`), not by tag name — the deepest level present gets the smallest style (tier 1, a small uppercase label in the body font), and each level above it is promoted one rung (tiers 2 and 3, display sizes in the header font). So an `h2` in an `h2`-only post looks like an `h3` in an `h2`+`h3` post. The `h1` post title is fixed and outside the stack. The tier mixins live at the top of `_prose.scss`.
- `_river.scss` wraps its rule output in `@mixin styles`, emitted exactly once from `styles.scss` via `@include river.styles` — so components can `@use` the module for its mixins without re-emitting CSS.

**BEM-lite naming convention:**

- **Blocks**: UpperCamelCase (`.Wrapper`, `.Blog`, `.BlogPost`)
- **Elements**: `Block__element` with camelCase (`.Wrapper__header`, `.Archives__inlineList`)
- **Modifiers**: `Block--modifier` with camelCase (`.BlogPost--longForm`)

**Key classes:**

- `.Wrapper` / `.Wrapper__header` / `.Wrapper__main` — Page grid container
- `.Blog` — Blog feed container
- `.BlogPost` (+ `--longForm`, `--isTruncated`, `--draft`) — A post in the feed or on its own page
- `.BlogPostPreview` — Title link + date
- `.PostArchive` — Archive page body shared by year and tag pages
- `.Article` — Article content wrapper for generic pages
- `.prose` — Typography system for Markdown content (required for list/heading/blockquote styling)
- `.Breadcrumbs`, `.SiteHeader`, `.Pagination`, `.Archives`, `.Callout`

**Utilities (no prefix):** `.color-accent`, `.color-caption`, `.bold`, `.block`, `.font-header`, `.lead`, and `.unstyled` (opt-out for link underlines / heading sizes / blockquote chrome).

### The gradient river

The site's central visual system: a page-length gradient that link text, underlines, list bullets, the background wash, the viewport vignette, and the footer fade all sample, so everything on a page shares one continuous color ramp.

- **CSS side**: `src/styles/_river.scss` — gradient stop tokens, the `river-text` / `river-fill` anchoring mixins, the `eased-fade` function, and the full-page layers (`#gradient` wash, `#texture` noise, viewport vignette, footer fade).
- **JS side**: `src/utils/river.ts` (stop tables, per-page phase from a path hash, pure helpers; runs at build time and in the client) plus the inline anchoring script in `HtmlLayout.astro`, which measures pinned elements and writes `--river-pos` / `--river-size` / `--river-end` custom properties.
- **Contract**: the anchoring script's pinned-element selector list must cover every element whose styles `@include river-text` or `river-fill` — grep for the mixin names when changing either side.

### Components (Vue SFCs unless noted)

All presentational, rendered server-side during build:

- `SiteHeader.vue` — Site title/logo
- `Feed.astro` — Maps posts into `BlogPost`s inside a `BlogFeed` (handles truncation)
- `BlogFeed.vue` — Feed section wrapper
- `BlogPost.vue` — A full post (feed, post pages, and archive notes); owns spacing between adjacent posts
- `BlogPostPreview.vue` — Title link + date for post lists (archives, backstage)
- `PostArchive.astro` — Archive page body shared by the year and tag pages: breadcrumb + self-linked heading, titled posts as `BlogPostPreview`s, untitled notes rendered in full via `BlogPost`
- `Article.vue` — Prose wrapper for generic pages
- `Breadcrumbs.vue` — Breadcrumb navigation
- `Pagination.vue` — Older/newer navigation for the feed and post pages
- `Archives.vue` — Featured posts plus the year and tag indexes (used on the 404 page)
- `Sky.vue` — WebGL sky shader (not currently mounted anywhere)
- `LinkedList.vue`, `NowPlaying.vue` — Sidebar-era widgets, currently unused

### URL structure

Posts are routed by parsing the filename convention in `getStaticPaths`:

- File: `posts/2024-01-15-my-post.md` → URL: `/2024/01/my-post/`
- The `getDateFromPostId`, `getSlugFromPostId`, and `getPermalinkFromPostId` helpers in `src/utils/index.ts` handle this parsing
- Archives: `/{year}/` and `/tag/{slug}/` (tag slugs via `getTagSlug`)

### Important notes

- Server runs on port 1995
- Posts with `hidden: true` are excluded from main collections but still built in dev (accessible via `/backstage`); drafts are excluded from production builds entirely
- Date handling uses `date-fns` with UTC timezone via `@date-fns/utc`
- Custom elements (e.g. `<now-playing>`, `<bookmark-list>`, `<lite-youtube>`) are excluded from Vue's component resolution via `isCustomElement: (tag) => tag.includes('-')` in `astro.config.ts`
- Output format: directory-based (`/foo/` not `/foo.html`)
- Rehype plugins in `src/plugins/`: `rehype-figure` (image titles → `<figure>`), `rehype-twitter` (Twitter links → embed blockquotes), `rehype-youtube` (YouTube links → `<lite-youtube>` elements)
