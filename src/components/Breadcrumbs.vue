<template>
  <div class="Breadcrumbs">
    <slot />
  </div>
</template>

<style scoped>
.Breadcrumbs {
  display: flex;
  align-items: center;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-caption);
  --link-color: var(--color-caption);
}

.Breadcrumbs :deep(> * + *:before) {
  content: "/";
  margin-inline: 6px;
  color: var(--color-border);
}

.Breadcrumbs :deep(a) {
  text-decoration: none;
}

.Breadcrumbs :deep(> div),
.Breadcrumbs :deep(> a) {
  display: flex;
  align-items: center;
}

.Breadcrumbs :deep(> div > svg),
.Breadcrumbs :deep(> a > svg) {
  margin-right: 6px;
}
</style>
