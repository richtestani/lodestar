<!--
  ProseBody — paragraphs with images placed between them. Shared by
  PageView (view: 'page') and ContentModule so both read the same
  `images: [...]` config. The page's lead banner (no `after`) is not
  rendered here; the parent puts it above the title via `topImages`.
-->
<template>
  <div class="prose-body" :class="{ 'prose-body--split': placed.split, 'prose-body--split-right': placed.split?.side === 'right' }">
    <PageImage v-if="placed.split" :image="placed.split" :eager="!hasTop" />
    <div class="prose-flow">
      <template v-for="(para, i) in [...paragraphs, null]" :key="i">
        <PageImage v-for="(img, j) in placed.byIndex[i] || []" :key="`img-${i}-${j}`" :image="img" />
        <p v-if="para !== null" :class="paraClass">{{ para }}</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PageImage from './PageImage.vue'
import { placeImages } from './layouts.js'

const props = defineProps({
  body: { type: [Array, String], default: () => [] },
  images: { type: Array, default: () => [] },
  paraClass: { type: String, default: '' },
})

const paragraphs = computed(() =>
  Array.isArray(props.body) ? props.body : (props.body ? [props.body] : [])
)
const placed = computed(() => placeImages(props.images, paragraphs.value.length))
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
