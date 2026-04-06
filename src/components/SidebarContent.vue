<script setup lang="ts">
import type { PostLink, BlogrollItem } from "../types";
import NowPlaying from "./NowPlaying.vue";
import LinkedList from "./LinkedList.vue";

defineProps<{
  featuredPosts: PostLink[];
  years: string[];
  blogroll: BlogrollItem[];
}>();
</script>

<template>
  <div>
    <h2>About the editor</h2>
    <p>
      Chase is a professional designer and amateur human currently working as a design engineer at
      <a href="https://era.app" target="_blank">Era</a>.
    </p>
  </div>

  <div>
    <h2>Featured</h2>
    <ul class="featured">
      <li v-for="post in featuredPosts" :key="post.permalink">
        <a :href="post.permalink">{{ post.title }}</a>
      </li>
    </ul>
  </div>

  <div class="Sidebar__social">
    <h2>Elsewhere</h2>
    <ul class="unstyled">
      <li><a href="https://chs.is/coding" target="_blank">GitHub</a></li>
      <li><a href="https://chs.is/ig" target="_blank">Instagram</a></li>
      <li><a rel="me" href="https://mastodon.social/@chsmc" target="_blank">Mastodon</a></li>
      <li><a href="https://bsky.app/profile/chsmc.me" target="_blank">Bluesky</a></li>
      <li><a href="https://chs.is/listening" target="_blank">Spotify</a></li>
      <li><a href="https://chs.is/tweeting" target="_blank">Twitter</a></li>
    </ul>
  </div>

  <div class="Sidebar__nowPlaying">
    <h2>Now playing</h2>
    <NowPlaying />
  </div>

  <div class="Sidebar__years">
    <h2>Archives</h2>
    <ul class="Sidebar__years unstyled inline">
      <li v-for="year in years" :key="year">
        <a :href="`/${year}`">{{ year }}</a>
      </li>
    </ul>
  </div>

  <div class="Sidebar__bookmarks">
    <h2>Linked list</h2>
    <p class="color-caption mb-4">Things that caught my eye on the web, updated sporadically.</p>
    <LinkedList />
  </div>

  <div class="Sidebar__blogroll">
    <h2>Blogroll</h2>
    <ul>
      <li v-for="item in blogroll" :key="item.url">
        <a :href="item.url" target="_blank" class="unstyled" :title="item.name">{{ item.name }}</a>
      </li>
    </ul>
  </div>

  <hr class="dashed" />

  <p class="Sidebar__colophon color-caption">
    Typeset in <a href="https://fonts.adobe.com/fonts/source-serif">Source Serif</a> and
    <a href="https://www.dennisgrauel.com/brunswick-grotesque.html">Brunswick Grotesque</a>. Built
    with <a href="https://astro.build">Astro</a> and hosted on
    <a href="https://www.netlify.com">Netlify</a>. Thanks for stopping by ♥
  </p>
</template>

<style scoped lang="scss">
.Sidebar__social {
  ul {
    column-gap: 24px;
    row-gap: 2px;
    display: grid;
    grid-template-columns: auto 1fr;
  }
}

.Sidebar__blogroll {
  ul {
    columns: 2;
    gap: 12px;
    margin-top: 4px;
  }

  li {
    margin: 0;
  }

  li:before {
    content: none;
  }

  a {
    display: block;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.Sidebar__colophon {
  a {
    text-decoration: underline;
  }
}

.Sidebar__years {
  li + li:not(:last-child):after,
  li:first-child:after {
    content: "/";
    color: var(--color-border);
    margin-inline: 2px;
  }
}
</style>
