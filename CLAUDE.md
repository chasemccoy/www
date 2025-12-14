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

Sass files in `src/css/` compiled to `src/_includes/styles/`:
- `styles.scss` - Main entry (imports all partials)
- `_global.scss` - Base styles, CSS custom properties
- `_theme.scss` - Theme variables
- `_typography.scss` - Type styles
- `_layout.scss` - Layout utilities
- `_blog.scss` - Blog-specific styles
- `_article.scss` - Article content styles
- `components/*.scss` - Component styles

Compiled CSS is included via `html.jsx` layout which renders from `src/_includes/styles/`.

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

## Important Notes

- Server runs on port 1995
- Posts with `hidden: true` excluded from main collections but still built
- Date handling uses `date-fns` with UTC timezone via `@date-fns/utc`
- Template formats: md, njk, html, jsx (configured in `.eleventy.js:181`)
- Output directory: `_site/`
