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

- `HtmlLayout.astro` — Root HTML shell: head, meta tags, fonts, the gradient-river background layers and anchoring script
- `BaseLayout.astro` — Page chrome (Wrapper grid, SiteHeader, main content slot)
- `PostLayout.astro` — Blog post pages: takes the post entry, renders it as a `BlogPost` plus `PostPagination`
- `PageLayout.astro` — Generic pages (the `.Article.prose` wrapper); supports both `.astro` imports and markdown `layout:` frontmatter

**Main pages** (`src/pages/`):

- `[...page].astro` — The feed, via Astro's `paginate()`: `/` (first `FEED_PAGE_SIZE` = 20 items), then `/2/`, `/3/`, …
- `[...slug].astro` — Individual blog posts, routed as `/{year}/{month}/{slug}/`
- `[year]/index.astro` — Year archive pages (`/{year}/`), rendered by `PostArchive`
- `tag/[tag].astro` — Tag archive pages (`/tag/{slug}/`), rendered by `PostArchive`
- `archive.astro` — The archive index (`/archive/`): featured posts, years, and tags via `Archives`
- `404.astro` — Error page: the same archive index with an apology on top
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

`src/data/metadata.json` — Site metadata (title, URL, author, feed config).

`src/content.config.ts` — Defines the `posts` content collection (custom loader using `fast-glob` + `gray-matter`).

`src/utils/index.ts` — All utility and collection helper functions:

- `readableDate`, `shortDate`, `inlineDate` (short month, year only when not the build's current year; the date that leads every post), `htmlDateString` — Date formatting (UTC, via `date-fns`)
- `getDateFromPostId`, `getSlugFromPostId`, `getPermalinkFromPostId` — URL/slug computation from post IDs
- `resolvePostDate` — Uses frontmatter date if present, otherwise derives from post ID
- `getPostDisplayTitle`, `getPageTitle` — Title generation helpers
- `getAdjacentPosts` — Previous/next post navigation
- `titleize`, `capitalize` — String helpers
- `SHOW_DRAFTS` — Whether hidden posts are included (true in dev builds only)
- `getPosts()` / `getVisiblePosts()` / `getFeaturedPosts()` — Post collection helpers
- `getPostsByYear()` / `getPostsByTag()` — Archive grouping; `getTagSlug()` maps a tag name to its URL slug; `getArchiveIndex()` bundles featured posts, years, and tags for the archive pages
- `FEED_PAGE_SIZE`, `TRUNCATE_WORD_COUNT`, `shouldTruncatePost()` — Feed pagination, and which long titled posts get truncated (the post still renders in full; `BlogPost.vue` shows only its first three blocks via CSS)

`src/utils/river.ts` — Shared constants and pure helpers for the gradient river (see below).

### Collections

The `posts` collection uses a custom loader in `content.config.ts` that reads markdown files from `posts/`, parses frontmatter with `gray-matter`, computes `date` and `permalink` from the filename, and adds `wordCount`.

`getPosts()` sorts newest-first, so everything built on it (the feed, RSS, archive groups, featured posts) is already in display order. The feed is just `getVisiblePosts()`, paginated.

### Styling

Sass files live flat in `src/styles/`, compiled by Astro from the `styles.scss` entry point (imported in `HtmlLayout.astro`):

```
src/styles/
├── styles.scss     # Entry point
├── _reset.scss     # CSS reset
├── _mixins.scss    # Mixins only, emits no CSS: breakpoints (tiny/small/medium/large), label, river-fill/text/hover-wash
├── _theme.scss     # Design tokens
├── _river.scss     # The gradient river: palette tokens, page background layers
├── _elements.scss  # Global element defaults
├── _prose.scss     # The .prose typography system for Markdown content
├── _Callout.scss   # Callouts (`<aside class='Callout'>` in posts): a sticky note with river-sampled washi tape
├── _Wrapper.scss   # Page layout: left-anchored column + the sticky site-info box
├── _utilities.scss # Small utility classes
└── _prism.scss     # Syntax highlighting
```

Conventions:

- **Units**: rem/em for type-relative spacing and sizes; px for hairlines, radii, and small fixed offsets (documented in `_theme.scss`).
- **Component styles** live in Vue SFCs as `<style scoped lang="scss">` blocks, importing `@use '../styles/mixins' as *` as needed. Components only ever `@use` `_mixins.scss`: any other partial emits CSS, and each component would get its own copy. A component's scoped styles only reference classes that component itself renders — no styling other components' internals via `:deep()` class reach-ins.
- **Page-specific one-off spacing** goes in a scoped `<style>` block in the page's own `.astro` file — not inline `style=` attributes and not margin utilities.
- **Lists**: bare `ul`/`ol` are plain everywhere; the decorated versions (bullets, counters) are scoped to `.prose` (see `_prose.scss`). Components that want decoration style it themselves, and must hold up inside a `.prose` page too (e.g. `Archives.vue` resets prose's list decoration before adding its own).
- **`.prose` selectors**: spacing/rhythm rules that post content might want to override are wrapped in `:where()`; structural rules use plain selectors.
- **`.prose` headings are adaptive**: body headings are styled bottom-up by how many levels a `.prose` block actually uses (via `:has()`), not by tag name — the deepest level present gets the smallest style (tier 1, a small uppercase label in the body font), and each level above it is promoted one rung (tiers 2 and 3, display sizes in the header font). So an `h2` in an `h2`-only post looks like an `h3` in an `h2`+`h3` post. The `h1` post title is fixed and outside the stack. The tier mixins live at the top of `_prose.scss`.

**BEM-lite naming convention:**

- **Blocks**: UpperCamelCase (`.Wrapper`, `.Blog`, `.BlogPost`)
- **Elements**: `Block__element` with camelCase (`.Wrapper__header`, `.Archives__inlineList`)
- **Modifiers**: `Block--modifier` with camelCase (`.BlogPost--isTruncated`)

**Key classes:**

- `.Wrapper` / `.Wrapper__header` / `.Wrapper__main` — Page layout grid: a left-anchored reading column; from the `medium` breakpoint the header becomes a site-info box sticky in the lower-right corner, below it a header above the column
- `.Blog` — Blog feed container
- `.BlogPost` (+ `--isTruncated`, `--draft`) — A post in the feed or on its own page
- `.BlogPostPreview` — Title link + date
- `.PostArchive` — Archive page body shared by year and tag pages
- `.Article` — The generic-page content wrapper (rendered by `PageLayout`)
- `.prose` — Typography system for Markdown content (required for list/heading/blockquote styling)
- `.Breadcrumbs`, `.SiteHeader`, `.FeedPagination`, `.PostPagination`, `.Archives`, `.Callout`

**Utilities (no prefix):** `.color-caption`, `.bold`, `.lead`, `.unstyled` (opt-out for link underlines / blockquote chrome), and `.muted` (caption-colored link).

**Links** come in three kinds, chosen with classes rather than per-component link CSS (see the `a` rules in `_elements.scss`): the default river link (tinted underline, and on hover the offset slides and the box gets the faint river wash); `.unstyled` — quiet, no underline at rest, the river underline appears in place on hover, no wash; and `.muted` — plain caption-colored text with none of the river text treatment (no gradient background, clip, or wash), keeping only the tinted underline; combinable with `.unstyled`. Components never set `text-decoration` on links themselves (the shorthand resets the river underline color); markdown-generated links that can't take a class (captions, blockquote cites) are listed alongside the modifiers.

### The gradient river

The site's central visual system: a page-length gradient that link text, underlines, list bullets, the background wash, and the viewport vignette all sample, so everything on a page shares one continuous color ramp.

- **CSS side**: `src/styles/_river.scss` — gradient stop tokens, the `eased-fade` function, and the full-page layers (`#gradient` wash, `#texture` noise, viewport vignette). The `river-fill` / `river-text` / `river-hover-wash` mixins live in `_mixins.scss`.
- **JS side**: `src/utils/river.ts` (the stop tables, the per-page phase from a path hash, pure helpers; runs at build time and in the client) plus the inline anchoring script in `HtmlLayout.astro`. Both sides derive the page's stop table from its path, so the script samples directly in page space. The build writes the page's `--gradient-river` (and `-faint`) inline on `<html>`; the script writes `--river-size` and `--river-doc` once on the root, then `--river-pos` per pinned element and `--river-color` (the underline tint) per link. The sticky site-info box's links are re-pinned on scroll.
- **Contract**: the anchoring script's pinned-element selector list must cover every element whose styles `@include river-text` or `river-fill` — grep for the mixin names when changing either side. One-off elements opt in with a `data-river-pin` attribute instead of a new selector.

### Components (Vue SFCs unless noted)

All presentational, rendered server-side during build:

- `SiteHeader.vue` — The site-info box: wordmark, blurb, and nav. Its river links are muted at rest by a translucent caption color over the gradient text, which clears when the box is hovered
- `Feed.astro` — Maps posts into `BlogPost`s inside a `BlogFeed`, flagging long posts for truncation
- `BlogFeed.vue` — Feed section wrapper
- `BlogPost.vue` — A full post (feed, post pages, and archive notes); owns the spacing and the perforated divider between adjacent posts
- `BlogPostPreview.vue` — Title link + date for post lists (archives, backstage)
- `PostArchive.astro` — Archive page body shared by the year and tag pages: breadcrumb + self-linked heading, titled posts as `BlogPostPreview`s, untitled notes rendered in full via `BlogPost`
- `Breadcrumbs.vue` — Breadcrumb navigation
- `FeedPagination.vue` — The feed's numbered pages, flush left, current page marked with a river dot, Newer/Older on either side
- `PostPagination.vue` — Post pages' previous/next, flush left: "Next up" over "Previously" with a short hairline between; untitled neighbors read "Note from {date}"
- Both leave 5rem of room below, so pages don't end hard against the window edge
- `Archives.vue` — A ledger of featured posts, years, and tags with post counts (the `/archive/` page and the 404)

### URL structure

Posts are routed by parsing the filename convention in `getStaticPaths`:

- File: `posts/2024-01-15-my-post.md` → URL: `/2024/01/my-post/`
- The `getDateFromPostId`, `getSlugFromPostId`, and `getPermalinkFromPostId` helpers in `src/utils/index.ts` handle this parsing
- Archives: `/archive/` (the index), `/{year}/`, and `/tag/{slug}/` (tag slugs via `getTagSlug`)

### Important notes

- Server runs on port 1995
- Posts with `hidden: true` are excluded from main collections but still built in dev (accessible via `/backstage`); drafts are excluded from production builds entirely
- Date handling uses `date-fns` with UTC timezone via `@date-fns/utc`
- Custom elements (e.g. `<now-playing>`, `<bookmark-list>`, `<lite-youtube>`) are excluded from Vue's component resolution via `isCustomElement: (tag) => tag.includes('-')` in `astro.config.ts`
- Output format: directory-based (`/foo/` not `/foo.html`)
- Rehype plugins in `src/plugins/`: `rehype-figure` (image titles → `<figure>`), `rehype-twitter` (Twitter links → embed blockquotes), `rehype-youtube` (YouTube links → `<lite-youtube>` elements)
