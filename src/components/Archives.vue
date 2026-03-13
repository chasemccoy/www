<script setup lang="ts">
interface FeaturedPost {
  permalink: string;
  data: { title: string };
}

const props = defineProps<{
  featuredPosts: FeaturedPost[];
  postsByYear: Record<string, any[]>;
}>();

const years = Object.keys(props.postsByYear).sort().reverse();
</script>

<template>
  <div class="Archives">
    <div class="Archives__featured">
      <h3>Featured</h3>
      <ul class="featured">
        <li v-for="post in featuredPosts" :key="post.permalink">
          <a :href="post.permalink">{{ post.data.title }}</a>
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
