# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website and blog built with **Astro 5.x**, **Vue 3** components, **Sass** for styling, and deployed to Netlify. The site includes blog posts, notes, and a personal feed combining posts with reading highlights from Readwise.

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
- `NoteLayout.astro` — Note/wiki pages (renders TOC + article)
- `PageLayout.astro` — Generic pages; supports both `.astro` imports and markdown `layout:` frontmatter

**Main pages** (`src/pages/`):
- `index.astro` — Homepage feed (first 40 items)
- `[page].astro` — Paginated feed (pages 2+)
- `[...slug].astro` — Individual blog posts, routed as `/{year}/{month}/{slug}/`
- `[year]/index.astro` — Year archive pages
- `notes/index.astro` — Notes index with tag filter
- `notes/[slug].astro` — Individual note pages
- `404.astro` — Error page
- `backstage.astro` — Hidden drafts listing
- `feed.xml.ts` — RSS feed endpoint

### Content Organization

All content lives in root-level directories, loaded via Astro content collections.

**Blog posts** (`posts/*.md` or `posts/YYYY-MM-DD-slug/index.md`):
- Filename convention: `YYYY-MM-DD-slug.md` — the date and slug are parsed from the filename, not frontmatter
- Frontmatter: `title` (optional), `excerpt`, `image`, `featured`, `hidden`
- Routes: `/{year}/{month}/{slug}/`

**Notes** (`notes/*.md` or `notes/slug/index.md`):
- Simpler content, no date convention
- Frontmatter: `title`, `excerpt`, `tags`, `hidden`
- Routes: `/notes/{slug}/`

### Data Layer

`src/data/` contains static data:
- `metadata.json` — Site metadata (title, URL, author, feed config)
- `books.ts` — Reading list data
- `quotes.ts` — Quote collection
- `blogroll.json` — Links to other sites (loaded as content collection)

`src/content.config.ts` — Defines all content collections: `posts`, `notes`, `blogroll`, `highlights`.

`src/utils/collections.ts` — Async helpers wrapping `getCollection()`:
- `getPosts()` / `getVisiblePosts()` / `getFeaturedPosts()` — Posts with computed `date` and `permalink` fields
- `getPostsByYear()` / `getYears()` — Archive helpers
- `getNotes()` / `getVisibleNotes()` — Notes helpers
- `getBlogroll()` / `getHighlights()` / `getFeed()` — Feed composition

`src/utils/filters.ts` — Pure utility functions:
- `readableDate`, `shortDate`, `htmlDateString`, `dateForXMLFeed` — Date formatting (UTC, via `date-fns`)
- `getDateFromPostId`, `getSlugFromPostId`, `getPermalinkFromPost` — URL/slug computation from post IDs
- `filterTagList` — Exclude system tags (`all`, `nav`, `post`, `posts`, `notes`)
- `shouldShowCite` — Feed highlight citation grouping logic
- `titleize`, `capitalize` — String helpers

### Collections

The `highlights` collection is loaded dynamically at build time from a Cloudflare Worker API (`https://api.chsmc.workers.dev/highlights-feed`). If the fetch fails, it returns an empty array.

The `feed` combines `getVisiblePosts()` + `getHighlights()` sorted by date, used for the homepage and paginated feed.

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
│   └── _typography.scss  # .prose utility for Markdown content
├── layout/
│   ├── _Wrapper.scss
│   ├── _Content.scss
│   └── _Sidebar.scss
└── components/
    ├── _Article.scss
    ├── _Blog.scss
    ├── _SiteHeader.scss
    ├── _Callout.scss
    ├── _Bookmark.scss
    └── _Archives.scss
```

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
- `Highlight.vue` — Readwise highlight card with citation logic
- `BlogPostPreview.vue` — Post preview link with title + date
- `Pagination.vue` — Older/newer page nav for the feed
- `PostNavigation.vue` — Previous/next post nav for individual posts
- `ReplyBadge.vue` — "Reply via email" badge on post pages
- `Archives.vue` — Featured posts + year list (used on 404 page)

### URL Structure

Posts are routed by parsing the filename convention in `getStaticPaths`:
- File: `posts/2024-01-15-my-post.md` → URL: `/2024/01/my-post/`
- The `getDateFromPostId` and `getSlugFromPostId` helpers in `filters.ts` handle this parsing

### Important Notes

- Server runs on port 1995
- Posts with `hidden: true` are excluded from main collections but still built (accessible via `/backstage`)
- Notes with `hidden: true` are excluded from the notes index
- Date handling uses `date-fns` with UTC timezone via `@date-fns/utc`
- Custom elements (e.g. `<now-playing>`, `<bookmark-list>`, `<filter-container>`) are excluded from Vue's component resolution via `isCustomElement: (tag) => tag.includes('-')` in `astro.config.mjs`
- Output format: directory-based (`/foo/` not `/foo.html`)
- The `BaseLayout` fetches sidebar data (`featuredPosts`, `years`, `blogroll`) internally — pages do not need to pass these as props
