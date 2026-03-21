<script setup lang="ts">
const props = defineProps<{
  postTitle: string;
}>();

const emailReplySubject = `Re: ${props.postTitle}`;
const mailtoHref = `mailto:hi@chsmc.org?subject=${encodeURIComponent(emailReplySubject)}`;
</script>

<template>
  <a :href="mailtoHref" class="reply-badge">
    <img
      src="/images/reply-via-email.gif"
      alt="Reply via email"
      class="pixelated invert-for-light-mode"
    />
  </a>
</template>

<style scoped>
.reply-badge {
  display: block;
  margin-top: 2rem;
}
</style>
