<script setup lang="ts">
interface Source {
  title?: string;
  author?: string;
  url?: string;
}

defineProps<{
  text: string;
  note?: string;
  source?: Source;
  includeCite: boolean;
}>();
</script>

<template>
  <article class="Blog__article--highlight">
    <cite v-if="includeCite">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
      <span>
        <template v-if="source?.url">
          From <a :href="source.url" target="_blank">{{ source.title }}</a> by {{ source.author }}:
        </template>
        <template v-else>
          From {{ source?.title }} by {{ source?.author }}:
        </template>
      </span>
    </cite>

    <blockquote class="unstyled" v-html="text" />

    <aside v-if="note">
      <svg width="13" height="14" fill="var(--color-chat-bubble)">
        <path d="M6 .246c-.175 5.992-1.539 8.89-5.5 13.5 6.117.073 9.128-.306 12.5-3L6 .246Z" />
      </svg>
      <span>{{ note }}</span>
    </aside>
  </article>
</template>
