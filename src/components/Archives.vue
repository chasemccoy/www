<script setup lang="ts">
import type { PostLink } from "../types";

const props = defineProps<{
  featuredPosts: PostLink[];
  years: string[];
}>();
</script>

<template>
  <div class="Archives">
    <div class="Archives__featured">
      <h3>Featured</h3>
      <ul class="featured">
        <li v-for="post in featuredPosts" :key="post.permalink">
          <a :href="post.permalink">{{ post.title }}</a>
        </li>
      </ul>
    </div>

    <div>
      <h3>By year</h3>
      <ul class="Archives__years unstyled inline">
        <li v-for="year in years" :key="year">
          <a :href="`/${year}`">{{ year }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.Archives {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  a {
    text-decoration: none;
  }

  h3 {
    margin-bottom: 0.25rem;
  }
}

.Archives__years {
  li + li:before {
    content: "/";
    display: inline;
    margin-inline: 2px;
    color: var(--color-border);
  }
}
</style>
