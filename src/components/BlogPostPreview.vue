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
    >&nbsp;<time :datetime="htmlDateString(date)">{{ shortDate(date) }}</time>
  </h3>
</template>

<style scoped lang="scss">
.BlogPostPreview {
  white-space: nowrap;
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
