<template>
  <article class="Article prose">
    <slot />
  </article>
</template>

<style scoped lang="scss">
.Article {
  :deep(h2:first-child) {
    margin-top: 0;
  }
}
</style>
