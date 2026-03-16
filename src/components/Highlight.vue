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

<style scoped lang="scss">
@use '../styles/theme' as *;

.Blog__article--highlight {
  font-size: 0.9rem;
  border-radius: 8px;
  color: var(--color-caption);

  cite {
    font-size: 0.9rem;
    font-style: normal;
    margin-bottom: 6px;
    color: var(--color-caption);
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-family: var(--font-code);

    @include small {
      margin-left: -18px;
    }

    svg {
      position: relative;
      top: 2.25px;
      flex-shrink: 0;
    }
  }

  blockquote {
    margin: 0;
    color: var(--color-caption);
  }

  blockquote + blockquote,
  aside + blockquote {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px dashed var(--color-border);
  }

  a {
    --color-accent: var(--color-caption);
    --link-color: var(--color-caption);
    --link-hover: var(--color-caption);
  }

  :deep(img) {
    display: none;
  }

  aside {
    color: var(--color-caption);
    margin: 12px 0 0;
    position: relative;

    span {
      background-color: var(--color-chat-bubble);
      border-radius: 14px;
      padding: 6px 12px;
      display: block;
      width: fit-content;
    }

    svg {
      position: absolute;
      left: -5.5px;
      bottom: 0.246px;
    }
  }

  blockquote,
  aside {
    margin-left: 18px;

    @include small {
      margin-left: 0;
    }
  }
}
</style>
