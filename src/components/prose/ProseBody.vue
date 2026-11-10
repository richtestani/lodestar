<!--
  ProseBody — paragraphs with images and media (video, audio, PDF) placed
  between them. Shared by PageView (view: 'page') and ContentModule so both
  read the same `images: [...]` / `media: [...]` config. Where both land at
  the same spot, images come first. The page's lead banner (no `after`) is not
  rendered here; the parent puts it above the title via `topImages`.
-->
<template>
  <div class="prose-body" :class="{ 'prose-body--split': placed.split, 'prose-body--split-right': placed.split?.side === 'right' }">
    <PageImage v-if="placed.split" :image="placed.split" :eager="!hasTop" />
    <div class="prose-flow">
      <template v-for="(para, i) in [...paragraphs, null]" :key="i">
        <PageImage v-for="(img, j) in placed.byIndex[i] || []" :key="`img-${i}-${j}`" :image="img" />
        <MediaEmbed v-for="(item, j) in placedMedia[i] || []" :key="`media-${i}-${j}`" :item="item" />
        <p v-if="para !== null" :class="paraClass">{{ para }}</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PageImage from './PageImage.vue'
import { placeImages } from './layouts.js'
import MediaEmbed from '../media/MediaEmbed.vue'
import { placeMedia } from '../media/media.js'

const props = defineProps({
  body: { type: [Array, String], default: () => [] },
  images: { type: Array, default: () => [] },
  media: { type: Array, default: () => [] }, // see components/media/media.js
  paraClass: { type: String, default: '' },
})

const paragraphs = computed(() =>
  Array.isArray(props.body) ? props.body : (props.body ? [props.body] : [])
)
const placed = computed(() => placeImages(props.images, paragraphs.value.length))
const placedMedia = computed(() => placeMedia(props.media, paragraphs.value.length))
const hasTop = computed(() => placed.value.top.length > 0)
</script>

<style scoped>
.prose-flow { display: flow-root; } /* contains floats so the CTA never tucks beside an image */

.prose-body--split { display: grid; grid-template-columns: 2fr 3fr; gap: 2rem; align-items: start; }
.prose-body--split-right { grid-template-columns: 3fr 2fr; }
.prose-body--split-right > :first-child { order: 2; }

@media (max-width: 720px) {
  .prose-body--split, .prose-body--split-right { grid-template-columns: 1fr; gap: 1.5rem; }
  .prose-body--split-right > :first-child { order: 0; }
}
</style>
