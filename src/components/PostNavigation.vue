<script setup lang="ts">
interface NavPost {
  permalink: string;
  data: { title?: string };
}

defineProps<{
  previousPost?: NavPost | null;
  nextPost?: NavPost | null;
}>();
</script>

<template>
  <nav class="Pagination">
    <ul class="unstyled">
      <li v-if="previousPost" class="Pagination__previous">
        <a :href="previousPost.permalink" class="unstyled">
          <span class="Pagination__label">Previous</span>
          <span v-if="previousPost.data.title">{{ previousPost.data.title }}</span>
        </a>
      </li>
      <li v-if="nextPost" class="Pagination__next">
        <a :href="nextPost.permalink" class="unstyled">
          <span class="Pagination__label">Next</span>
          <span v-if="nextPost.data.title">{{ nextPost.data.title }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
@use '../styles/theme' as *;

.Pagination {
  border-top: 4px solid var(--color-offset);
  margin: 3rem 0 0;
  margin-inline: calc(-1 * var(--layout-padding));

  ul {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @include small {
      flex-direction: row;
    }
  }

  li {
    flex-basis: 50%;
    flex-grow: 1;
  }

  @include small {
    .Pagination__previous + .Pagination__next {
      text-align: right;
      border-left: 4px solid var(--color-offset);
    }
  }

  li a {
    display: flex;
    gap: 2px;
    flex-direction: column;
    justify-content: center;
    color: var(--color-text);
    padding: 1rem var(--layout-padding);
    transition: background-color 0.2s;
    height: 100%;
    min-height: 56px;

    &:hover {
      background-color: var(--color-offset);
    }
  }
}

.Pagination__label {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-caption);
}
</style>
