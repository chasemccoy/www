<script setup lang="ts">
import type { PostLink } from "../types";

defineProps<{
  featuredPosts: PostLink[];
  years: string[];
  tags: { title: string; permalink: string; count: number }[];
}>();
</script>

<template>
  <dl class="Archives">
    <dt>Featured</dt>
    <dd>
      <ul class="Archives__stack">
        <li v-for="post in featuredPosts" :key="post.permalink">
          <a :href="post.permalink" class="unstyled">{{ post.title }}</a>
        </li>
      </ul>
    </dd>

    <dt>Years</dt>
    <dd>
      <ul class="Archives__years">
        <li v-for="year in years" :key="year">
          <a :href="`/${year}/`" class="unstyled">{{ year }}</a>
        </li>
      </ul>
    </dd>

    <dt>Tags</dt>
    <dd>
      <ul class="Archives__entries">
        <li v-for="tag in tags" :key="tag.permalink">
          <a :href="tag.permalink" class="unstyled">{{ tag.title }}</a>
          <span class="Archives__leader"></span>
          <span class="Archives__count">{{ tag.count }}</span>
        </li>
      </ul>
    </dd>
  </dl>
</template>

<style scoped lang="scss">
@use "../styles/theme" as *;

.Archives {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 0.5rem;

  @include tiny {
    grid-template-columns: max-content minmax(0, 1fr);
    column-gap: 2.5rem;
    row-gap: 1.5rem;
    align-items: baseline;
  }

  dt {
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.25px;
  }

  dd + dt {
    margin-top: 1.5rem;

    @include tiny {
      margin-top: 0;
    }
  }
}

// This component owns its lists: undo .prose's bullets, indents and item
// spacing so it renders the same inside a prose page (the 404) as anywhere.
.Archives__stack > li,
.Archives__years > li,
.Archives__entries > li {
  margin: 0;
}

.Archives__stack > li:before,
.Archives__years > li:before,
.Archives__entries > li:before {
  content: none;
}

.Archives__stack > li + li {
  margin-top: 0.25rem;
}

.Archives__years {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25em 1.4em;
  font-variant-numeric: tabular-nums;
}

.Archives__entries {
  columns: 2;
  column-gap: 2rem;
  line-height: 1.7;

  & > li {
    display: flex;
    align-items: baseline;
    gap: 0.5em;
    break-inside: avoid;
    font-variant-numeric: tabular-nums;
  }
}

.Archives__leader {
  flex: 1;
  min-width: 1.5em;
  border-bottom: 1px dotted var(--color-border);
  position: relative;
  top: -0.2em;
}

.Archives__count {
  font-size: 0.75rem;
  color: var(--color-caption);
}
</style>
