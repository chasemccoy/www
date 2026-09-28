<script setup lang="ts">
import { htmlDateString, shortDate } from "../utils";

defineProps<{
  title: string;
  date: Date | string;
  permalink: string;
}>();
</script>

<template>
  <h3 class="BlogPostPreview">
    <a :href="permalink">{{ title }}</a
    >&nbsp;<time :datetime="htmlDateString(date)"
      ><a :href="permalink" class="unstyled muted">{{ shortDate(date) }}</a></time
    >
  </h3>
</template>

<style scoped lang="scss">
.BlogPostPreview {
  margin-bottom: 0.25rem;
  // Nowrap on the heading with normal wrapping inside the title link: the
  // title can break internally, but the date stays glued to its last word.
  white-space: nowrap;
  font-size: 1.15rem;
  line-height: 1.25;
  font-weight: normal;

  & > a {
    white-space: normal;
  }

  time {
    font-size: 1rem;
    margin-left: 4px;
  }
}
</style>
