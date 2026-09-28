<script setup lang="ts">
// Aliased: the `inlineDate` prop shares the name, and in the template the
// script-setup import would shadow it.
import { htmlDateString, inlineDate as formatInlineDate, metaDate } from "../utils";

const props = defineProps<{
  title?: string;
  date: Date | string;
  permalink: string;
  isTruncated?: boolean;
  isDraft?: boolean;
  // Feed context: every post's date runs inline at the start of its first
  // line (titled posts drop the header meta row). Off, only notes do.
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
// Feed spacing: adjacent posts space themselves (both siblings carry this
// component's scope attribute, so the sibling selector works across
// instances).
.BlogPost {
  --feed-gap: 2.75rem;
  --divider-height: 5px;
}

.BlogPost + .BlogPost {
  margin-top: var(--feed-gap);

  // The perforated divider.
  &::before {
    content: "";
    display: block;
    height: var(--divider-height);
    margin-bottom: var(--feed-gap);
    background: radial-gradient(circle, var(--color-border) 1.1px, transparent 1.6px) 0 0 / 9px
      var(--divider-height) repeat-x;
  }
}

// A truncated post already ends in its own tear, so the post after it gets
// no divider — but the same total distance, so the feed's rhythm holds.
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
  color: var(--color-caption);
}

// The inline date runs into the first paragraph. If the first block isn't a
// paragraph, the date sits on its own line with no delimiter.
.BlogPost__date {
  display: inline;

  // The delimiter sits outside the link, in the link's resting color.
  &:has(+ p)::after {
    content: "/";
    margin-inline: 0.5em;
    color: var(--color-caption);
  }

  + :deep(p) {
    display: inline;
  }
}

// Inline elements carry no vertical margin, so the header supplies the gap
// to a titled post's first line itself.
.BlogPost__header:has(+ .BlogPost__date) {
  margin-bottom: calc(var(--flow-spacing) / 1.25);
}

// Drafts only ever render on the dev server, so this label never ships.
// A pseudo-element keeps it out of the DOM. It shares ::before with the
// divider, so a draft in the dev feed shows the label instead of the
// perforation — the extra class specificity is what makes it win.
.BlogPost.BlogPost--draft::before {
  content: "Draft";
  display: block;
  margin-bottom: 0.5em;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-accent);
}

// Truncated posts: the whole post is rendered, and this wrapper shows only
// its first four blocks (dropping a heading if one lands last), fading out
// into the tear. The mask is on the wrapper, not the article, so the tear
// sits outside it at full opacity. Wrapping the slot takes its children out
// of .prose's direct-child flow, so the rhythm is restated here.
.BlogPost__excerpt {
  mask-image: linear-gradient(to bottom, black 0, black 55%, transparent 100%);

  > :deep(* + *) {
    margin-top: var(--flow-spacing);
  }

  // Counts include the inline date as the wrapper's first child.
  > :deep(:nth-child(n + 6)),
  > :deep(:nth-child(5):is(h2, h3, h4)) {
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
