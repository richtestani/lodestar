<!--
  ContentModule — plain prose block (eyebrow/title/body/cta), for small
  amounts of text inside a rows/columns page. Same markup and props
  shape as the old PageView.vue ('view: page'), just repackaged as an
  ordinary module so it can sit in any row/column alongside other
  modules instead of owning the whole page.
-->
<template>
  <section class="section content-block">
    <div class="container content-wrap">
      <PageImage v-for="(img, i) in topImages" :key="'top' + i" :image="img" />
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <hr class="rule" />
      <h1 class="h-title content-title">{{ title }}</h1>
      <ProseBody class="content-body" :body="body" :images="images" :media="media" para-class="content-para" />
      <RouterLink v-if="cta" :to="cta.to" class="btn content-cta">{{ cta.label }}</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import ProseBody from '../components/prose/ProseBody.vue'
import PageImage from '../components/prose/PageImage.vue'
import { placeImages } from '../components/prose/layouts.js'

const props = defineProps({
  eyebrow: String,
  title: { type: String, default: '' },
  body: { type: [Array, String], default: () => [] },
  cta: Object,
  images: { type: Array, default: () => [] }, // same presets as view: 'page' — see components/prose/layouts.js
  media: { type: Array, default: () => [] },  // video / audio / PDF — see components/media/media.js
})

const topImages = computed(() => placeImages(props.images, 0).top)
</script>

<style scoped>
.content-block { overflow-x: clip; } /* full-bleed images use 100vw */
.content-wrap { max-width: 720px; }
.content-title { margin-bottom: 1.5rem; }
.content-body :deep(.content-para) {
  font-family: var(--font-accent);
  font-size: 1.15rem;
  line-height: 1.85;
  color: var(--text);
  opacity: 0.9;
  margin-bottom: 1.25rem;
}
.content-cta { margin-top: 1rem; }
</style>
