<script setup lang="ts">
import { ref, onMounted } from "vue";

const name = ref("");
const artist = ref("");
const image = ref("");
const loaded = ref(false);

onMounted(async () => {
  try {
    const response = await fetch("https://api.chsmc.workers.dev/music");
    const data = await response.json();
    const { recentTracks } = data;

    if (recentTracks?.length > 0) {
      name.value = recentTracks[0].name;
      artist.value = recentTracks[0].artist;
      image.value = recentTracks[0].image;
      loaded.value = true;
    }
  } catch {
    // Silently fail — widget is non-critical
  }
});
</script>

<template>
  <div v-if="loaded" class="NowPlaying">
    <div class="NowPlaying__image">
      <img :src="image" alt="" />
    </div>
    <span>{{ name }} by {{ artist }}</span>
  </div>
</template>

<style scoped lang="scss">
.NowPlaying {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 4px;
  margin-bottom: 3px;
  color: var(--color-caption);
}

.NowPlaying__image {
  position: relative;
  top: 3px;
  overflow: clip;
  min-width: 32px;
  width: 32px;
  height: 32px;
  border-radius: 4px;

  &:after {
    content: "";
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 0 1px rgba(0 0 0 / 0.1);
    border-radius: inherit;
  }
}
</style>
