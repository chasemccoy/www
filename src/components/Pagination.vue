<script setup lang="ts">
defineProps<{
  previousHref?: string;
  nextHref?: string;
  previousLabel?: string;
  nextLabel?: string;
  previousTitle?: string;
  nextTitle?: string;
}>();
</script>

<template>
  <nav class="Pagination">
    <ul class="unstyled">
      <li v-if="previousHref" class="Pagination__previous">
        <a :href="previousHref" class="unstyled">
          <span v-if="previousLabel" class="Pagination__label">{{ previousLabel }}</span>
          <span v-if="previousTitle">{{ previousTitle }}</span>
        </a>
      </li>
      <li v-if="nextHref" class="Pagination__next">
        <a :href="nextHref" class="unstyled">
          <span v-if="nextLabel" class="Pagination__label">{{ nextLabel }}</span>
          <span v-if="nextTitle">{{ nextTitle }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
@use "../styles/theme" as *;

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
