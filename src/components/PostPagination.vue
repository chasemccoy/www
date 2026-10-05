<script setup lang="ts">
import type { PostLink } from "../types";
import { inlineDate } from "../utils";

const props = defineProps<{
  previous?: PostLink | undefined;
  next?: PostLink | undefined;
}>();

const entries = [
  { label: "Next up", post: props.next },
  { label: "Previously", post: props.previous },
].filter((e): e is { label: string; post: PostLink } => Boolean(e.post));
</script>

<template>
  <nav v-if="entries.length" class="PostPagination" aria-label="More posts">
    <div v-for="{ label, post } in entries" :key="label" class="PostPagination__entry">
      <span class="PostPagination__label">{{ label }}</span>
      <a
        :href="post.permalink"
        :class="[
          'PostPagination__title',
          'unstyled',
          { 'PostPagination__title--note': !post.title },
        ]"
      >
        {{ post.title ?? `Note from ${inlineDate(post.date)}` }}
      </a>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.PostPagination {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
  margin-top: 3rem;
  padding-bottom: 5rem;
}

.PostPagination__entry {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.2rem;

  & + &::before {
    content: "";
    display: block;
    width: 2.5rem;
    margin-bottom: 1.4rem;
    border-top: 1px solid var(--color-border);
  }
}

.PostPagination__label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-caption);
}

.PostPagination__title {
  font-family: var(--font-header);
  font-size: 1.15rem;
  line-height: 1.3;
  color: var(--color-text);
  text-wrap: balance;
}

.PostPagination__title--note {
  color: var(--color-caption);
}
</style>
