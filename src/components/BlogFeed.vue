<script setup lang="ts">
const { variant = "default" } = defineProps<{
  variant?: "default" | "archive";
}>();
</script>

<template>
  <section :class="['Blog', variant && `Blog--${variant}`]">
    <slot />
  </section>
</template>

<style scoped lang="scss">
.Blog {
  display: flex;
  flex-direction: column;

  :deep(h3) {
    margin-bottom: 0.25rem;
  }
}

.Blog--default {
  :deep(article + article) {
    margin-top: 5rem;
  }

  :deep(header) {
    display: grid;
    gap: 0.75rem;
  }

  :deep(article > time) {
    display: block;
    margin-bottom: -0.5rem;
  }

  :deep(.Blog__article--longForm + .Blog__article--longForm) {
    margin-top: 5rem;
  }

  :deep(article:after) {
    content: ":::";
    color: var(--color-border);
    margin-top: 1rem;
    font-size: 1.2rem;
    display: block;
  }
}

.Blog--archive {
  :deep(.Blog__notes) {
    border-top: 1px solid var(--color-border);
    margin-top: 40px;
    padding-top: 40px;
    padding-block-end: 80px;

    &:not(:has(*)) {
      display: none;
    }
  }
}
</style>
