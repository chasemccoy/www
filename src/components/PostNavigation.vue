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
