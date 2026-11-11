<!--
  MediaModule — a section of video, audio or PDFs for home and
  'sections' pages: one featured video, a set of tracks, a few download
  cards. Each item is the same shape as a prose page's `media` entry
  (see components/media/media.js); `layout`/`after` are ignored here —
  the grid places them.

    { module: 'media', props: {
        title: 'Listen', columns: 2,
        media: [
          { type: 'audio', src: 'single.mp3', title: 'New single', artist: 'Elle Sera', artwork: 'single.jpg' },
          { type: 'audio', src: 'demo.mp3',   title: 'Demo',       artist: 'Elle Sera' },
        ] } }
-->
<template>
  <section class="section" :class="{ 'section--surface': surface }">
    <div class="container" :class="{ 'mmod-narrow': narrow }">
      <div v-if="eyebrow || title || intro" class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 v-if="title" class="h-title">{{ title }}</h2>
        <p v-if="intro">{{ intro }}</p>
      </div>
      <div class="mmod-grid" :style="{ '--mmod-cols': cols }">
        <MediaEmbed v-for="(item, i) in items" :key="(item.src || item.url || item.id || item.sources?.[0]?.src || '') + i" :item="item" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import MediaEmbed from '@/components/media/MediaEmbed.vue'

const props = defineProps({
  eyebrow: String, title: { type: String, default: '' }, intro: String,
  surface: { type: Boolean, default: false },
  media: { type: Array, default: () => [] },
  // 1–3 across on wide screens; phones always get one column
  columns: { type: Number, default: 1 },
})

const VIDEO = ['video', 'youtube', 'vimeo']
const cols = computed(() => Math.min(Math.max(props.columns || 1, 1), 3))
// a single video/track/PDF reads better at text width than stretched to 1200px
const narrow = computed(() => cols.value === 1 && props.media.length > 0 && props.media.every((m) => !VIDEO.includes(m.type)))
const items = computed(() => props.media.map(({ layout, size, after, ...rest }) => rest))
</script>

<style scoped>
.mmod-narrow { max-width: 760px; }
.mmod-grid { display: grid; grid-template-columns: repeat(var(--mmod-cols), minmax(0, 1fr)); gap: 1.5rem; align-items: start; }
.mmod-grid :deep(.media) { margin: 0; }

@media (max-width: 720px) {
  .mmod-grid { grid-template-columns: 1fr; }
}
</style>
