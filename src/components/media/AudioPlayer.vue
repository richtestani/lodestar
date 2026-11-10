<!--
  AudioPlayer — a track card: optional cover art, title / artist, and the
  browser's own audio controls. preload="none" means nothing downloads
  until play is pressed, so a page of ten tracks loads like a page of text.
-->
<template>
  <div class="maudio" :class="{ 'has-art': artwork }">
    <img v-if="artwork" class="maudio-art" :src="media(artwork)" alt="" loading="lazy" decoding="async" />
    <div class="maudio-main">
      <p class="maudio-title">{{ title }}</p>
      <p v-if="artist" class="maudio-artist">{{ artist }}</p>
    </div>
    <!-- spans the whole card, under the art: native controls need ~300px
         before they show the time, and a float can be narrower than that -->
    <audio data-lodestar-player controls :preload="preload" :aria-label="artist ? `${title} — ${artist}` : title">
      <source :src="media(src)" :type="mimeFor(src)" />
      <a :href="media(src)">Download {{ title }}</a>
    </audio>
  </div>
</template>

<script setup>
import { media } from '@/composables/useAssets.js'
import { mimeFor } from './media.js'

defineProps({
  src: { type: String, required: true },
  title: { type: String, default: '' },
  artist: String,
  artwork: String, // square cover image — decorative, the title carries the name
  preload: { type: String, default: 'none' },
})
</script>

<style scoped>
.maudio {
  display: grid; grid-template-columns: 1fr; gap: 0.75rem 1rem; align-items: center;
  padding: 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
}
.maudio.has-art { grid-template-columns: 64px 1fr; }
.maudio-art { width: 64px; aspect-ratio: 1; object-fit: cover; border-radius: calc(var(--radius) * 0.6); display: block; }
.maudio-main { min-width: 0; }
.maudio-title { font-weight: 600; color: var(--text); margin: 0; overflow-wrap: anywhere; }
.maudio-artist { font-size: 0.9rem; color: var(--text-muted); margin: 0.15rem 0 0; }
.maudio audio { display: block; width: 100%; grid-column: 1 / -1; }
</style>
