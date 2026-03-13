<script setup lang="ts">
import SidebarContent from './SidebarContent.vue';

interface FeaturedPost {
  permalink: string;
  data: { title: string };
}

interface BlogrollItem {
  name: string;
  url: string;
}

const props = withDefaults(defineProps<{
  mobile?: boolean;
  featuredPosts?: FeaturedPost[];
  postsByYear?: Record<string, any[]>;
  blogroll?: BlogrollItem[];
}>(), {
  mobile: false,
  featuredPosts: () => [],
  postsByYear: () => ({}),
  blogroll: () => [],
});

const years = Object.keys(props.postsByYear).sort().reverse();
</script>

<template>
  <p>A weblog by Chase McCoy about exploring and building the world wide web.</p>

  <nav class="Sidebar__nav">
    <ul class="unstyled">
      <li>
        <a href="mailto:hi@chsmc.org">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
          </svg>
          Email
        </a>
      </li>
      <li>
        <a href="https://chsmc.org/feed.xml">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1" />
          </svg>
          RSS
        </a>
      </li>
      <li>
        <a href="https://books.chsmc.org" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          Library
        </a>
      </li>
      <li>
        <a href="https://lab.chsmc.org" target="_blank">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15.9999V7.9999C20.9996 7.64918 20.9071 7.30471 20.7315 7.00106C20.556 6.69742 20.3037 6.44526 20 6.2699L13 2.2699C12.696 2.09437 12.3511 2.00195 12 2.00195C11.6489 2.00195 11.304 2.09437 11 2.2699L4 6.2699C3.69626 6.44526 3.44398 6.69742 3.26846 7.00106C3.09294 7.30471 3.00036 7.64918 3 7.9999V15.9999C3.00036 16.3506 3.09294 16.6951 3.26846 16.9987C3.44398 17.3024 3.69626 17.5545 4 17.7299L11 21.7299C11.304 21.9054 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9054 13 21.7299L20 17.7299C20.3037 17.5545 20.556 17.3024 20.7315 16.9987C20.9071 16.6951 20.9996 16.3506 21 15.9999Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3.27002 6.95996L12 12.01L20.73 6.95996" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 22.08V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Lab
        </a>
      </li>
      <li>
        <a href="https://portfolio.chsmc.org" target="_blank">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          Portfolio
        </a>
      </li>
    </ul>
  </nav>

  <details v-if="mobile" class="Sidebar__details">
    <summary class="Sidebar__summary"></summary>
    <div>
      <SidebarContent
        :featured-posts="featuredPosts"
        :years="years"
        :blogroll="blogroll"
      />
    </div>
  </details>

  <SidebarContent
    v-else
    :featured-posts="featuredPosts"
    :years="years"
    :blogroll="blogroll"
  />
</template>

<style scoped lang="scss">
@use '../styles/theme' as *;

.Sidebar__nav {
  ul {
    display: flex;
    flex-wrap: wrap;
    column-gap: 24px;
    row-gap: 8px;

    @include small {
      display: grid;
      grid-template-columns: auto 1fr;
    }
  }

  a {
    text-decoration: none;
    display: flex;
    align-items: center;

    > svg {
      margin-right: 6px;
    }
  }
}

.Sidebar__details {
  > div {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    padding: 1rem 0 0;
  }
}

.Sidebar__summary {
  font-family: var(--font-code);
  color: var(--color-caption);
  list-style: none;
  background-image: none;
  appearance: none;

  &::-webkit-details-marker {
    display: none;
  }

  &:before {
    content: '+ More';
  }

  details[open] &:before {
    content: '- Less';
  }
}
</style>
