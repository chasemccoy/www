# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website and blog built with Eleventy (11ty) using JSX templates, Sass for styling, and deployed to Netlify. The site includes blog posts, notes, and a personal feed combining posts with reading highlights from Readwise.

## Development Commands

**Start development server:**
```bash
yarn start
# Runs Eleventy dev server on port 1995 with CSS watch mode
```

**Build for production:**
```bash
yarn build
# Cleans _site, builds CSS, runs Eleventy
```

**CSS only:**
```bash
yarn watch:css  # Watch mode
yarn build:css  # One-time build
```

**Debug:**
```bash
yarn debug  # Run Eleventy with DEBUG=* for verbose output
```

## Architecture

### Template System

Uses JSX for most templates (via `jsx-async-runtime`), with Nunjucks for older templates. JSX is compiled to HTML by Eleventy plugin configured in `.eleventy.js:58-68`.

**Layouts:**
- `src/_includes/layouts/html.jsx` - Root HTML wrapper with fonts, meta tags
- `src/_includes/layouts/base.jsx` - Base page layout with sidebar
- `src/_includes/layouts/post.jsx` - Blog post layout
- `src/_includes/layouts/note.njk` - Note layout (Nunjucks)

**Main pages:**
- `src/index.jsx` - Homepage with feed of posts/highlights
- `src/archive.jsx` - Chronological post archive
- `src/notes.njk` - Notes index

### Content Organization

**Blog posts:** `posts/YYYY-MM-DD-slug.md` or `posts/YYYY-MM-DD-slug/index.md`
- Frontmatter: `title`, `excerpt`, `image`, `featured`, `hidden`
- Tagged with `posts`
- Images in post directories are processed via markdown-it plugin

**Notes:** `notes/*.md`
- Simpler content structure
- No date in filename

### Data Layer

`src/_data/` contains global data:
- `metadata.json` - Site metadata (title, URL, author)
- `books.js` - Reading list data
- `highlights.js` - Readwise highlights (fetched via API)
- `quotes.js` - Quote collection
- `blogroll.js` - Links to other sites

### Collections

Custom collections in `.eleventy.js`:
- `postsByYear` - Posts grouped by year (excluding hidden)
- `featuredPosts` - Posts with `featured: true`
- `feed` - Combined posts + Readwise highlights sorted by date
- `tagList` - All tags (filtered)

### Styling

Sass files in `src/css/` compiled to `src/_includes/styles/`. Uses **BEM-Lite** naming convention.

**File structure:**
```
src/css/
├── styles.scss           # Main entry point
├── _reset.scss           # CSS reset
├── _theme.scss           # Design tokens/variables
├── _utilities.scss       # Utility classes
├── _prism.scss           # Syntax highlighting
├── base/
│   ├── _elements.scss    # Global element defaults (html, body, a, etc.)
│   └── _typography.scss  # .prose utility for Markdown content
├── layout/
│   ├── _Wrapper.scss     # Page wrapper grid
│   ├── _Content.scss     # Main content area
│   └── _Sidebar.scss     # Sidebar component
└── components/
    ├── _Article.scss     # Article/post content
    ├── _Blog.scss        # Blog feed and pagination
    ├── _SiteHeader.scss  # Site header and breadcrumbs
    ├── _Callout.scss     # Callout boxes
    ├── _Bookmark.scss    # book-mark custom element
    └── _Archives.scss    # Archives listing
```

**BEM-Lite naming convention:**
- **Blocks**: UpperCamelCase (`.Wrapper`, `.Sidebar`, `.Blog`)
- **Elements**: `Block__element` with camelCase (`.Sidebar__nav`, `.Blog__postPreview`)
- **Modifiers**: `Block--modifier` with camelCase (`.Sidebar--mobile`, `.Blog--featured`)

**Allowed nesting:**
```scss
.Sidebar__link {
  // Pseudo-selectors OK
  &:hover { }
  &[aria-current="page"] { }
}

.Article {
  // HTML elements OK for Markdown content
  h1, h2, h3 { }
  p { }
  pre { }
}
```

**Key classes:**
- `.Wrapper` - Main page grid container
- `.Wrapper__header` - Page header with site title
- `.Wrapper__main` - Main content wrapper
- `.Sidebar` / `.Sidebar--mobile` / `.Sidebar--desktop` - Sidebar variants
- `.Content` - Main content area
- `.Blog` / `.Blog--featured` / `.Blog--archive` - Blog feed variants
- `.Article` - Article content wrapper
- `.Pagination` - Post/page navigation
- `.Breadcrumbs` - Breadcrumb navigation
- `.SiteHeader` - Site title/logo
- `.prose` - Typography utility for Markdown content (not a BEM block)

**Utilities (no prefix):**
- `.mb-{0,1,2,4,6,8,12,16,20,24,32,40,48}` - Margin-bottom
- `.flex`, `.flex-column` - Flexbox
- `.font-header`, `.serif`, `.sans`, `.mono` - Font families
- `.color-accent`, `.color-caption` - Text colors
- `.unstyled` - Reset links/lists
- `.prose` - Markdown typography container

Compiled CSS included via `html.jsx` layout from `src/_includes/styles/`.

### Filters

`utils/filters.js` exports Eleventy filters:
- `readableDate`, `shortDate`, `htmlDateString` - Date formatting using date-fns with UTC
- `groupByYear` - Group items by year
- `filterHidden` - Exclude hidden posts
- `filterTagList` - Exclude system tags

### Markdown Processing

Custom markdown-it configuration with:
- `markdown-it-anchor` - Auto-generate heading anchors
- `utils/markdown-it-eleventy-img/` - Custom plugin for image processing with `@11ty/eleventy-img`
- Images wrapped in `<figure>` with optional `<figcaption>` from title attribute

### Shortcodes

**Slots system** (`.eleventy.js:72-86`): Allows child templates to inject content into parent layouts.
```njk
{% slot 'slotName', page.url %}content{% endslot %}
```
Access via `slots.slotName` in layouts.

**Image shortcode:**
```njk
{% image src, alt, sizes %}
```
Generates responsive images with webp/jpg formats.

### Static Assets

- `public/` - Copied to site root (fonts, favicon, etc.)
- `src/js/` - Copied to `/js` in output
- Post images processed through markdown-it plugin to `_site/img/`

## Template Patterns

**Page layout structure (base.jsx):**
```jsx
<div class='Wrapper'>
  <header class='Wrapper__header'>
    <h1 class='SiteHeader'>...</h1>
    <aside class='Sidebar Sidebar--mobile'>...</aside>
  </header>
  <main class='Wrapper__main'>
    <div class='Content'>...</div>
  </main>
  <aside class='Sidebar Sidebar--desktop'>...</aside>
</div>
```

**Blog post (post.jsx):**
```jsx
<article class='Article prose'>
  {content}
</article>
<nav class='Pagination'>
  <ul class='unstyled'>
    <li class='Pagination__previous'>...</li>
    <li class='Pagination__next'>...</li>
  </ul>
</nav>
```

**Blog feed (index.jsx):**
```jsx
<section class='Blog Blog--featured'>
  <article class='prose Blog__article--longForm'>...</article>
  <article class='Blog__article--highlight'>...</article>
</section>
```

**Sidebar elements:**
```jsx
<div class='Sidebar__social'>...</div>
<div class='Sidebar__blogroll'>...</div>
<div class='Sidebar__years'>...</div>
<nav class='Sidebar__nav'>...</nav>
```

**Common patterns:**
- Combine BEM classes with utilities: `class='Blog__postPreview unstyled block'`
- Use `.prose` for any Markdown-rendered content
- Breadcrumbs: `<div class='Breadcrumbs'>...</div>`
- Modifiers stack with base: `class='Sidebar Sidebar--mobile'`

## Important Notes

- Server runs on port 1995
- Posts with `hidden: true` excluded from main collections but still built
- Date handling uses `date-fns` with UTC timezone via `@date-fns/utc`
- Template formats: md, njk, html, jsx (configured in `.eleventy.js:181`)
- Output directory: `_site/`
