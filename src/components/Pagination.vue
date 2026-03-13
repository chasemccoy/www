<script setup lang="ts">
defineProps<{
  olderHref?: string;
  newerHref?: string;
}>();
</script>

<template>
  <nav class="Pagination">
    <ul class="unstyled">
      <li v-if="olderHref" class="Pagination__previous">
        <a :href="olderHref" class="unstyled">Older</a>
      </li>
      <li v-if="newerHref" class="Pagination__next">
        <a :href="newerHref" class="unstyled">Newer</a>
      </li>
    </ul>
  </nav>
</template>
