# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website and blog built with **Astro 6.x**, **Vue 3** components, **Sass** for styling, and deployed to Netlify.

## Development Commands

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
# Runs Astro static site build
```

**Preview production build:**

```bash
pnpm preview
```

## Architecture

### Template System

Uses **Astro** (`.astro`) for layouts and pages, and **Vue 3 SFCs** (`.vue`) for presentational components. Astro files use JSX-like template syntax in the HTML section; Vue components use `<script setup lang="ts">` with TypeScript.

**Layouts** (`src/layouts/`):

- `HtmlLayout.astro` — Root HTML shell (head, meta tags, fonts, scripts)
- `BaseLayout.astro` — Page chrome (Wrapper grid, Sidebar, header slot)
- `PostLayout.astro` — Blog post pages (renders post nav, reply badge)
- `PageLayout.astro` — Generic pages; supports both `.astro` imports and markdown `layout:` frontmatter

**Main pages** (`src/pages/`):

- `index.astro` — Homepage feed (first 25 items)
- `[page].astro` — Paginated feed (pages 2+)
- `[...slug].astro` — Individual blog posts, routed as `/{year}/{month}/{slug}/`
- `[year]/index.astro` — Year archive pages
- `404.astro` — Error page
- `backstage.astro` — Hidden drafts listing
- `feed.xml.ts` — RSS feed endpoint
- `markdown.md` — Markdown style reference page

### Content Organization

All content lives in root-level directories, loaded via Astro content collections.

**Blog posts** (`posts/*.md` or `posts/YYYY-MM-DD-slug/index.md`):

- Filename convention: `YYYY-MM-DD-slug.md` — the date and slug are parsed from the filename, not frontmatter
- Frontmatter: `title` (optional), `excerpt`, `image`, `featured`, `hidden`
- Routes: `/{year}/{month}/{slug}/`

### Data Layer

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
- `getPosts()` / `getVisiblePosts()` / `getFeaturedPosts()` — Post collection helpers
- `getPostsByYear()` — Archive grouping
- `getBlogroll()` / `getFeed()` — Feed composition

### Collections

The `posts` collection uses a custom loader in `content.config.ts` that reads markdown files from `posts/`, parses frontmatter with `gray-matter`, and computes `date` and `permalink` from the filename.

The `feed` is `getVisiblePosts()` sorted newest-first, used for the homepage and paginated feed.

### Styling

Sass files in `src/styles/` compiled by Astro. Uses **BEM-Lite** naming convention.

**File structure:**

```
src/styles/
├── styles.scss           # Main entry point (imported in HtmlLayout.astro)
├── _reset.scss           # CSS reset
├── _theme.scss           # Design tokens/variables (imported by Vue scoped styles)
├── _utilities.scss       # Utility classes
├── _prism.scss           # Syntax highlighting
├── base/
│   ├── _elements.scss    # Global element defaults
│   ├── _typography.scss  # .prose utility for Markdown content
│   └── _Callout.scss     # Callout component styles
└── layout/
    ├── _Wrapper.scss
    ├── _Content.scss
    └── _Sidebar.scss
```

Component-specific styles (Article, Blog, SiteHeader, BlogPostPreview, Pagination, Archives, etc.) live in Vue SFCs as `<style scoped lang="scss">` blocks.

Vue SFCs use `<style scoped lang="scss">` with `@use '../styles/theme' as *` for design token access.

**BEM-Lite naming convention:**

- **Blocks**: UpperCamelCase (`.Wrapper`, `.Sidebar`, `.Blog`)
- **Elements**: `Block__element` with camelCase (`.Sidebar__nav`, `.Blog__postPreview`)
- **Modifiers**: `Block--modifier` with camelCase (`.Sidebar--mobile`, `.Blog--featured`)

**Key classes:**

- `.Wrapper` / `.Wrapper__header` / `.Wrapper__main` — Page grid container
- `.Sidebar` / `.Sidebar--mobile` / `.Sidebar--desktop` — Sidebar variants
- `.Content` — Main content area
- `.Blog` / `.Blog--featured` / `.Blog--archive` — Blog feed variants
- `.Article` — Article content wrapper (required for code block styling)
- `.prose` — Typography utility for Markdown content
- `.Breadcrumbs` — Breadcrumb navigation
- `.SiteHeader` — Site title/logo
- `.Pagination` — Post/page navigation

**Utilities (no prefix):**

- `.mb-{0,1,2,4,6,8,12,16,20,24,32,40,48}` — Margin-bottom
- `.flex`, `.flex-column` — Flexbox
- `.font-header`, `.serif`, `.sans`, `.mono` — Font families
- `.color-accent`, `.color-caption` — Text colors
- `.unstyled` — Reset links/lists
- `.prose` — Markdown typography container

### Components (Vue SFCs)

All Vue components are presentational (no client-side reactivity needed; rendered server-side during build):

- `Sidebar.vue` + `SidebarContent.vue` — Site sidebar (mobile uses `<details>` toggle)
- `SiteHeader.vue` — Site title/logo SVG
- `BlogFeed.vue` — Blog post feed list with variant styles
- `BlogPostPreview.vue` — Post preview link with title + date
- `Article.vue` — Article content wrapper
- `Breadcrumbs.vue` — Breadcrumb navigation
- `Pagination.vue` — Older/newer page nav for the feed
- `ReplyBadge.vue` — "Reply via email" badge on post pages
- `Archives.vue` — Featured posts + year list (used on 404 page)

### URL Structure

Posts are routed by parsing the filename convention in `getStaticPaths`:

- File: `posts/2024-01-15-my-post.md` → URL: `/2024/01/my-post/`
- The `getDateFromPostId`, `getSlugFromPostId`, and `getPermalinkFromPostId` helpers in `src/utils/index.ts` handle this parsing

### Important Notes

- Server runs on port 1995
- Posts with `hidden: true` are excluded from main collections but still built (accessible via `/backstage`)
- Date handling uses `date-fns` with UTC timezone via `@date-fns/utc`
- Custom elements (e.g. `<now-playing>`, `<bookmark-list>`, `<lite-youtube>`) are excluded from Vue's component resolution via `isCustomElement: (tag) => tag.includes('-')` in `astro.config.ts`
- Output format: directory-based (`/foo/` not `/foo.html`)
- The `BaseLayout` fetches sidebar data (`featuredPosts`, `years`, `blogroll`) internally — pages do not need to pass these as props
- Rehype plugins in `src/plugins/`: `rehype-figure` (image titles → `<figure>`), `rehype-twitter` (Twitter links → embed blockquotes), `rehype-youtube` (YouTube links → `<lite-youtube>` elements)
