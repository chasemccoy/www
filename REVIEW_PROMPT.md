# Code Review: Eleventy → Astro Migration

## Context

This is a personal website and blog recently migrated from Eleventy (11ty) with JSX templates to Astro 5.x with Vue components. The migration is functionally complete — the site builds and all pages render — but the code needs a review pass to clean up Eleventy-isms, simplify patterns, and make the codebase more idiomatic to Astro.

Read CLAUDE.md for the full project overview (note: it still describes the Eleventy setup and needs updating too).

## Migration history (recent commits, oldest to newest)

```
b447974 Migrate blog from Eleventy to Astro with Vue integration
0998f22 Convert presentational components from Astro to Vue SFCs with TypeScript
a574e48 Refactor component styles into Vue scoped style blocks
ef50c61 Migrate blogroll and highlights to Astro content collections
09ee68c Remove unused Eleventy templates and config
99ce90a Pass only year strings to Sidebar/Archives instead of full post data
ef994ff Remove unused legacy directories and files
fe6f741 Move src/js/ to public/js/ for static serving
988f256 Convert markdown test page to use Astro layout
0de110f Wrap PageLayout content in Article prose container
cab8840 Render page title as header in PageLayout
7e8d3a2 Move sidebar data fetching into BaseLayout to fix missing featured posts
cf9617e Add Article class to blog posts on index and paginated routes
441517b Fix PageLayout not receiving props from markdown frontmatter
```

## Recent fixes that hint at architectural issues

1. **Sidebar data was prop-drilled through every layer.** `featuredPosts`, `years`, and `blogroll` were passed as props from every page → intermediate layout → BaseLayout → Sidebar. Pages using `layout:` frontmatter (like markdown files) couldn't pass these props, so the sidebar was empty. Fixed by having BaseLayout fetch this data itself.

2. **Page titles from frontmatter weren't rendering.** When a markdown file uses Astro's `layout:` frontmatter, props come via `Astro.props.frontmatter`, not as direct props. PageLayout had to add a workaround: `const props = { ...Astro.props.frontmatter, ...Astro.props }`.

3. **Code block styling was inconsistent.** Blog posts on the index route were missing the `Article` CSS class that post pages had, so `pre`/`code` styling (font-size, padding, line numbers) didn't apply on the homepage.

## Key files to review

### Layouts (the main area of concern)
- `src/layouts/HtmlLayout.astro` — Root HTML shell
- `src/layouts/BaseLayout.astro` — Page chrome (wrapper, sidebar, header)
- `src/layouts/PostLayout.astro` — Blog post pages
- `src/layouts/NoteLayout.astro` — Note pages
- `src/layouts/PageLayout.astro` — Generic pages (used via frontmatter `layout:`)

### Pages
- `src/pages/index.astro` — Homepage feed
- `src/pages/[page].astro` — Paginated feed (pages 2+)
- `src/pages/[...slug].astro` — Individual blog posts
- `src/pages/[year]/index.astro` — Year archive pages
- `src/pages/notes/index.astro` — Notes listing
- `src/pages/notes/[slug].astro` — Individual notes
- `src/pages/404.astro` — Error page
- `src/pages/backstage.astro` — Hidden drafts listing
- `src/pages/markdown.md` — Typography test page

### Data & utilities
- `src/content.config.ts` — Content collection schemas
- `src/utils/collections.ts` — Collection helpers (getPosts, getFeed, etc.)
- `src/utils/filters.ts` — Date formatting, slug parsing, etc.

### Components (Vue SFCs)
- `src/components/Sidebar.vue` & `SidebarContent.vue`
- `src/components/Highlight.vue`, `Pagination.vue`, `PostNavigation.vue`
- `src/components/BlogPostPreview.vue`, `ReplyBadge.vue`, `Archives.vue`

## What to look for

### 1. Eleventy patterns that should be replaced with Astro idioms

- **HTML-string header building**: Multiple layouts construct `headerHtml` as a raw HTML string and pass it to BaseLayout, which renders it with `<Fragment set:html={header} />`. This was necessary in Eleventy's slot system but in Astro you can use named slots or component composition instead.
- **Collection helpers duplicating Astro APIs**: `src/utils/collections.ts` wraps `getCollection()` with sorting/filtering. Check if any of these could be simplified with Astro's built-in content collection features or if the abstractions are pulling their weight.
- **Filter functions from Eleventy**: `src/utils/filters.ts` was the Eleventy filter file. Some of these (like `getDateFromPostId`, `getSlugFromPostId`, `getPermalinkFromPost`) encode URL-building logic that might be better handled differently in Astro's routing system.
- **The `Astro.props.frontmatter` workaround** in PageLayout — is there a cleaner Astro pattern for layouts used by both `.astro` imports and markdown `layout:` frontmatter?

### 2. Simplification opportunities

- **Duplicated feed rendering**: `index.astro` and `[page].astro` have nearly identical template code for rendering the feed. Can this be extracted?
- **PostLayout fetches all posts** for prev/next navigation. `[...slug].astro` also fetches all posts for `getStaticPaths`. This is redundant work — the navigation data could be computed in `getStaticPaths` and passed as props.
- **BaseLayout fetches sidebar data on every page render.** This is correct but could it be optimized?
- **The `shouldShowCite` function** is duplicated in both `index.astro` and `[page].astro`.

### 3. Consistency and correctness

- CSS class usage: are `Article`, `prose`, and BEM classes applied consistently across all content rendering paths?
- Are there any props still being passed that are no longer needed after the BaseLayout refactor?
- Type safety: are `any` types used where proper interfaces would be better?
- Are there unused imports or dead code left over from the migration?

### 4. Vue vs Astro component boundaries

- Some components are Vue SFCs that don't need client-side interactivity (e.g., `BlogPostPreview`, `Pagination`, `PostNavigation`, `Archives`, `ReplyBadge`). Should any of these be Astro components instead? What are the tradeoffs?
- The Sidebar uses Vue for its mobile `<details>` toggle — does this need to be a Vue component or could it be an Astro component with a `<details>` element?

### 5. CLAUDE.md

- The project instructions file still describes the Eleventy setup. It should be updated to reflect the Astro architecture. Draft an updated version.

## Output format

Structure your review as:
1. **Critical issues** — Things that are broken or will cause bugs
2. **Architectural improvements** — Patterns that should change to be more idiomatic Astro
3. **Simplifications** — Code that can be reduced or deduplicated
4. **Minor cleanups** — Small fixes, unused code, type improvements
5. **Updated CLAUDE.md** — A revised version of the project instructions

For each item, reference the specific file(s) and line(s), explain the current state, and propose a concrete change.
