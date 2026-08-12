<script setup lang="ts">
import { htmlDateString, readableDate, shortDate } from "../utils";

defineProps<{
  title?: string;
  date: Date | string;
  permalink: string;
  isTruncated?: boolean;
  isDraft?: boolean;
}>();
</script>

<template>
  <article :class="['prose', 'BlogPost', { 'BlogPost--longForm': title, 'BlogPost--isTruncated': isTruncated, 'BlogPost--draft': isDraft }]">
    <h1 v-if="title" class="font-header">
      <a :href="permalink" class="unstyled">{{ title }}</a>
    </h1>

    <time v-if="!title" :datetime="htmlDateString(date)">
      <a :href="permalink">{{ shortDate(date) }}</a>
    </time>

    <slot />

    <a v-if="isTruncated" class="BlogPost--readMoreButton" :href="permalink">Read more</a>

    <div v-if="title && !isTruncated">
      <time :datetime="htmlDateString(date)">
        <a :href="permalink">{{ readableDate(date) }}</a>
      </time>
    </div>
  </article>
</template>

<style scoped lang="scss">
// Feed spacing: adjacent posts space themselves (both siblings carry this
// component's scope attribute, so the sibling selector works across
// instances).
.BlogPost + .BlogPost {
  margin-top: calc(var(--flow-spacing) * 6);
}

.BlogPost--longForm + .BlogPost--longForm {
  margin-top: 5rem;
}

.BlogPost h1 {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.75em;
  font-weight: normal;
}

.BlogPost time a {
  color: var(--color-caption);
  text-decoration: none;
}

.BlogPost time:first-child {
  display: inline;
  margin-right: 0.5em;
}

.BlogPost time:first-child + :deep(p) {
  display: inline;
}

// Drafts only ever render on the dev server, so this label never ships.
// A pseudo-element keeps it out of the DOM, leaving the `time:first-child`
// rules above intact for untitled notes.
.BlogPost--draft::before {
  content: "Draft";
  display: block;
  margin-bottom: 0.5em;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
}

.BlogPost--isTruncated {
  position: relative;
  mask-image: linear-gradient(to bottom, black 0, black 25%, transparent 100%);
}

.BlogPost--readMoreButton {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  width: 100%;
  color: var(--color-accent);
  padding: 16px 0;
  margin: -16px 0;
  text-decoration: none;
  text-transform: uppercase;

  &:before,
  &:after {
    content: "";
    height: 0.5px;
    background-color: var(--color-accent);
    display: block;
    width: 100%;
  }
}
</style>
