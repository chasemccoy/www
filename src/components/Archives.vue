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
@use "../styles/mixins" as *;

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
    @include label;
  }

  dd + dt {
    margin-top: 1.5rem;

    @include tiny {
      margin-top: 0;
    }
  }
}

// Undo .prose list decoration: this renders inside prose pages too.
.Archives li {
  margin: 0;

  &::before {
    content: none;
  }
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
