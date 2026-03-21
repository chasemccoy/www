<script setup lang="ts">
import { htmlDateString, shortDate } from "../utils/filters";

defineProps<{
  title: string;
  date: Date | string;
  permalink: string;
}>();
</script>

<template>
  <a :href="permalink" class="unstyled block Blog__postPreview">
    <h3>
      <span>{{ title }}</span
      >&nbsp;<time :datetime="htmlDateString(date)">{{ shortDate(date) }}</time>
    </h3>
  </a>
</template>

<style scoped lang="scss">
.Blog__postPreview {
  color: var(--color-text);

  &:hover {
    color: var(--color-accent);
  }

  h3 {
    white-space: nowrap;
    font-size: 1.15rem;
    line-height: 1.25;
    color: inherit;
    font-weight: normal;
  }

  h3 span {
    white-space: normal;
  }

  h3 time {
    color: var(--color-caption);
    font-family: var(--font-code);
    font-weight: normal;
    text-transform: none;
    letter-spacing: 0px;
    position: relative;
    display: inline-block;
    margin-left: 4px;
  }
}
</style>
