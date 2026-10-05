<script setup lang="ts">
// Aliased: the import would shadow the `inlineDate` prop in the template.
import { htmlDateString, inlineDate as formatInlineDate, metaDate } from "../utils";

const props = defineProps<{
  title?: string;
  date: Date | string;
  permalink: string;
  isTruncated?: boolean;
  isDraft?: boolean;
  // Titled posts too, in place of the meta row. Untitled ones always do.
  inlineDate?: boolean;
}>();

const showInlineDate = !props.title || props.inlineDate;
</script>

<template>
  <article
    :class="[
      'prose',
      'BlogPost',
      {
        'BlogPost--isTruncated': isTruncated,
        'BlogPost--draft': isDraft,
      },
    ]"
  >
    <header v-if="title" class="BlogPost__header">
      <h1>
        <a :href="permalink" class="unstyled">{{ title }}</a>
      </h1>

      <div v-if="!inlineDate" class="BlogPost__meta">
        <time :datetime="htmlDateString(date)">
          <a :href="permalink" class="unstyled muted">{{ metaDate(date) }}</a>
        </time>
      </div>
    </header>

    <div v-if="isTruncated" class="BlogPost__excerpt">
      <time v-if="showInlineDate" class="BlogPost__date" :datetime="htmlDateString(date)">
        <a :href="permalink" class="unstyled muted">{{ formatInlineDate(date) }}</a>
      </time>
      <slot />
    </div>
    <template v-else>
      <time v-if="showInlineDate" class="BlogPost__date" :datetime="htmlDateString(date)">
        <a :href="permalink" class="unstyled muted">{{ formatInlineDate(date) }}</a>
      </time>
      <slot />
    </template>

    <div v-if="isTruncated" class="BlogPost__tear">
      <span class="BlogPost__tearLine"></span>
      <a class="BlogPost__readMore unstyled muted" :href="permalink">Read more</a>
      <span class="BlogPost__tearLine"></span>
    </div>
  </article>
</template>

<style scoped lang="scss">
.BlogPost {
  --feed-gap: 2.75rem;
  --divider-height: 5px;
}

.BlogPost + .BlogPost {
  margin-top: var(--feed-gap);

  &::before {
    content: "";
    display: block;
    height: var(--divider-height);
    margin-bottom: var(--feed-gap);
    background: radial-gradient(circle, var(--color-border) 1.1px, transparent 1.6px) 0 0 / 9px
      var(--divider-height) repeat-x;
  }
}

// Already ends in a tear: no divider, same total distance.
.BlogPost--isTruncated + .BlogPost {
  margin-top: calc(var(--feed-gap) * 2 + var(--divider-height));

  &::before {
    content: none;
  }
}

.BlogPost__header h1 {
  margin-top: 0;
  font-weight: normal;

  a {
    color: var(--color-text);
  }
}

.BlogPost__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25em 0.5em;
  margin-top: 0.75em;
  font-size: 0.75rem;
}

// Runs into a first paragraph. Before anything else (a list, an image) it
// keeps its own line, slash and all, so the block reads as what follows.
.BlogPost__date {
  display: inline;
  opacity: 0.65;

  &::after {
    content: "/";
    margin-inline: 0.5em 0.55em;
    opacity: 0.5;
  }

  + :deep(p) {
    display: inline;
  }
}

// The inline date can't carry a top margin, so the header supplies it.
.BlogPost__header:has(+ .BlogPost__date) {
  margin-bottom: calc(var(--flow-spacing) / 1.25);
}

// Shares ::before with the divider; the doubled class makes the label win.
.BlogPost.BlogPost--draft::before {
  content: "Draft";
  display: block;
  margin-bottom: 0.5em;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
}

// The mask lives here, not on the article, so the tear stays opaque. The
// wrapper takes children out of .prose's direct-child flow, so the rhythm
// is restated.
.BlogPost__excerpt {
  mask-image: linear-gradient(to bottom, black 0, black 55%, transparent 100%);

  > :deep(* + *) {
    margin-top: var(--flow-spacing);
  }

  // Three blocks, counting the inline date as the first child.
  > :deep(:nth-child(n + 5)),
  > :deep(:nth-child(4):is(h2, h3, h4)) {
    display: none;
  }
}

.BlogPost__header + .BlogPost__excerpt {
  margin-top: calc(var(--flow-spacing) / 1.25);
}

.BlogPost__tear {
  display: flex;
  align-items: center;
  margin-top: -0.5rem;
}

.BlogPost__tearLine {
  flex: 1;
  height: 8px;
  background-color: var(--color-border);
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 8'%3E%3Cpath d='M0 4 L4 0.7 L12 7.3 L16 4' fill='none' stroke='black' stroke-width='1.2'/%3E%3C/svg%3E")
    left center / 16px 8px repeat-x;
}

.BlogPost__readMore {
  margin-inline: 0.75rem;
  font-family: var(--font-code);
  font-size: 0.75rem;
  white-space: nowrap;
}
</style>
