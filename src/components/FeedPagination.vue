<script setup lang="ts">
const props = defineProps<{
  current: number;
  total: number;
}>();

const pages = Array.from({ length: props.total }, (_, i) => i + 1);
const href = (n: number) => (n === 1 ? "/" : `/${n}/`);
</script>

<template>
  <nav class="FeedPagination" aria-label="Feed pages">
    <a v-if="current > 1" :href="href(current - 1)" class="FeedPagination__step unstyled muted">
      Newer
    </a>
    <span v-else class="FeedPagination__step FeedPagination__step--off" aria-hidden="true">
      Newer
    </span>

    <ol>
      <li v-for="n in pages" :key="n">
        <span
          v-if="n === current"
          class="FeedPagination__current"
          aria-current="page"
          data-river-pin
        >
          {{ n }}
        </span>
        <a v-else :href="href(n)" class="FeedPagination__page unstyled">{{ n }}</a>
      </li>
    </ol>

    <a v-if="current < total" :href="href(current + 1)" class="FeedPagination__step unstyled muted">
      Older
    </a>
    <span v-else class="FeedPagination__step FeedPagination__step--off" aria-hidden="true">
      Older
    </span>
  </nav>
</template>

<style scoped lang="scss">
@use "../styles/mixins" as *;

.FeedPagination {
  display: flex;
  align-items: baseline;
  gap: 1.75rem;
  margin-top: 3rem;
  padding-bottom: 5rem;

  ol {
    display: flex;
    gap: 1.1rem;
  }
}

.FeedPagination__step {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.FeedPagination__step--off {
  color: var(--color-caption);
  opacity: 0.35;
}

.FeedPagination__page,
.FeedPagination__current {
  font-family: var(--font-header);
  font-size: 1.15rem;
  font-variant-numeric: tabular-nums;
}

// No river-link padding: it shifts the row's baseline depending on whether
// the first page is a link or the current one.
.FeedPagination__page {
  padding: 0;
  margin: 0;
  color: var(--color-caption);
}

.FeedPagination__current {
  position: relative;
  color: var(--color-text);

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -0.45rem;
    width: 5px;
    height: 5px;
    translate: -50% 0;
    border-radius: 50%;
    background-color: var(--color-accent);
    @include river-fill;
  }
}
</style>
