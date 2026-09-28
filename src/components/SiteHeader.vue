<script setup lang="ts">
import metadata from "../data/metadata.json";
</script>

<template>
  <header class="SiteHeader">
    <h1>
      <a href="/" class="muted">chsmc.org</a>
    </h1>

    <p>A weblog by Chase McCoy about exploring and building the world wide web.</p>

    <nav>
      <ul class="SiteHeader__nav">
        <li><a href="/archive/" class="muted">Archive</a></li>
        <li><a :href="`mailto:${metadata.author.email}`" class="muted">Email</a></li>
        <li><a :href="metadata.feed.path" class="muted">RSS</a></li>
        <li><a href="https://books.chsmc.org" class="muted" target="_blank" rel="noopener">Library</a></li>
        <li><a href="https://lab.chsmc.org" class="muted" target="_blank" rel="noopener">Lab</a></li>
        <li><a href="https://portfolio.chsmc.org" class="muted" target="_blank" rel="noopener">Portfolio</a></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
.SiteHeader {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 18em;
  color: var(--color-caption);
  text-wrap: pretty;
  font-size: 0.75rem;
  position: relative;

  & > * {
    opacity: 0.75;
    transition: opacity 0.15s ease-in-out;
  }

  &:hover a,
  &:hover > *:has(a) {
    opacity: 1;
  }

  // A larger hover target. Only the top and left extend: the box sits
  // against the viewport's right and bottom edges, so growing that way
  // would only add scrollable overflow. The left extension stays inside the
  // gutter between the box and the reading column so it never covers text.
  // It paints behind the box's own content (the header is its own stacking
  // context) so the links underneath still take hovers and clicks.
  isolation: isolate;

  &::after {
    content: "";
    position: absolute;
    inset: -100px 0 0 -3rem;
    z-index: -1;
  }

  h1 {
    color: inherit;
    font-family: var(--font-header);
    font-size: 1.4em;
  }


  // The external-link arrow is a masked SVG so it takes the link's color,
  // and its space is always reserved so nothing shifts when it fades in.
  a[href^="http"]::after {
    content: "";
    display: inline-block;
    width: 0.9em;
    height: 0.9em;
    margin-left: 0.25em;
    vertical-align: middle;
    background-color: currentColor;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M7 17 17 7M7 7h10v10'/%3E%3C/svg%3E")
      center / contain no-repeat;
    opacity: 0;
    transition: opacity 0.15s;
  }

  a[href^="http"]:hover::after {
    opacity: 1;
  }
}

.SiteHeader__nav {
  columns: 2;
  column-gap: 1.5em;

  li {
    break-inside: avoid;
  }
}
</style>
