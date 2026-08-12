<script setup lang="ts">
import type { PostLink } from "../types";

defineProps<{
  featuredPosts: PostLink[];
  years: string[];
}>();
</script>

<template>
  <div class="Archives">
    <div class="Archives__featured">
      <h3>Featured</h3>
      <ul>
        <li v-for="post in featuredPosts" :key="post.permalink">
          <a :href="post.permalink">{{ post.title }}</a>
        </li>
      </ul>
    </div>

    <div>
      <h3>By year</h3>
      <ul class="Archives__years">
        <li v-for="year in years" :key="year">
          <a :href="`/${year}`">{{ year }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../styles/river" as *;

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

.Archives__featured {
  li {
    margin-left: 1.5em;
  }

  li:before {
    content: "⁕";
    margin-left: -1.5em;
    margin-top: -2.5px;
    float: left;
    color: var(--color-accent);
    @include river-text;
  }
}

.Archives__years {
  line-height: 1;

  li {
    display: inline-block;
  }

  li + li:before {
    content: "/";
    display: inline;
    margin-inline: 2px;
    color: var(--color-border);
  }
}
</style>
