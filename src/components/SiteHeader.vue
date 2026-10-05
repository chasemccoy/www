<script setup lang="ts">
import metadata from "../data/metadata.json";
</script>

<template>
  <header class="SiteHeader">
    <h1>
      <a href="/">chsmc.org</a>
    </h1>

    <p>A weblog by Chase McCoy about exploring and building the world wide web.</p>

    <nav>
      <ul class="SiteHeader__nav">
        <li><a href="/archive/">Archive</a></li>
        <li><a :href="`mailto:${metadata.author.email}`">Email</a></li>
        <li><a :href="metadata.feed.path">RSS</a></li>
        <li><a href="https://books.chsmc.org" target="_blank" rel="noopener">Library</a></li>
        <li><a href="https://lab.chsmc.org" target="_blank" rel="noopener">Lab</a></li>
        <li><a href="https://portfolio.chsmc.org" target="_blank" rel="noopener">Portfolio</a></li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
@use "../styles/mixins" as *;

.SiteHeader {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 18em;
  color: var(--color-caption);
  text-wrap: pretty;
  font-size: 0.75rem;
  position: relative;
  opacity: 0.75;
  transition: opacity 0.15s ease-in-out;

  // Muted at rest by a translucent caption color painted over the river
  // text, which clears on hover. Plain color transitions only: animating a
  // custom property into the gradient left underlines stuck mid-transition.
  a {
    color: color-mix(in srgb, var(--color-caption) 60%, transparent);
    text-decoration-color: color-mix(
      in srgb,
      color-mix(in oklch, var(--river-color, var(--color-text)) 40%, var(--color-caption)) 30%,
      var(--color-body-background)
    );
    transition:
      color 0.15s ease-in-out,
      text-decoration-color 0.15s ease-in-out;

    // Hovering the box is the hover state: no per-link wash or slide.
    &:hover {
      background-image: var(--gradient-river);
      text-underline-offset: 0.15em;
    }
  }

  &:hover {
    opacity: 1;

    a {
      color: transparent;
      text-decoration-color: color-mix(
        in srgb,
        var(--river-color, var(--color-text)) 30%,
        var(--color-body-background)
      );
    }
  }

  // A larger hover target. Extending right or down would overflow the
  // viewport; isolation keeps it behind the links so they still get clicks.
  isolation: isolate;

  &::after {
    content: "";
    position: absolute;
    inset: -400px 0 0 -8rem;
    z-index: -1;
  }

  h1 {
    color: inherit;
    font-family: var(--font-header);
    font-size: 1.4em;
  }

  // Filled with the link's gradient: its text color is transparent, so
  // currentColor won't do.
  a[href^="http"]::after {
    content: "";
    display: inline-block;
    width: 0.9em;
    height: 0.9em;
    margin-left: 0.25em;
    vertical-align: middle;
    @include river-fill;
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
