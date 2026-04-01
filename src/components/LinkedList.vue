<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Bookmark {
  url: string;
  title: string;
}

const bookmarks = ref<Bookmark[]>([]);

onMounted(async () => {
  try {
    const response = await fetch("https://api.chsmc.workers.dev/bookmarks");
    const data = await response.json();
    bookmarks.value = data.slice(0, 10);
  } catch {
    // Silently fail — widget is non-critical
  }
});
</script>

<template>
  <ul v-if="bookmarks.length">
    <li v-for="bookmark in bookmarks" :key="bookmark.url">
      <a
        :href="bookmark.url"
        target="_blank"
        class="unstyled"
        :title="bookmark.title || bookmark.url"
      >
        {{ bookmark.title || bookmark.url }}
      </a>
    </li>
  </ul>
</template>

<style scoped lang="scss">
a {
  display: block;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
