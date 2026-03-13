<script setup lang="ts">
import { htmlDateString, shortDate } from '../utils/filters';

defineProps<{
  title: string;
  date: Date | string;
  permalink: string;
}>();
</script>

<template>
  <a :href="permalink" class="unstyled block Blog__postPreview">
    <h3>
      <span>{{ title }}</span>&nbsp;<time :datetime="htmlDateString(date)">{{ shortDate(date) }}</time>
    </h3>
  </a>
</template>
