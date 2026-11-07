<template>
  <main class="page">
    <section class="section">
      <div class="container page-wrap">
        <PageImage v-for="(img, i) in topImages" :key="'top' + i" :image="img" :eager="i === 0" />
        <p v-if="content.eyebrow" class="eyebrow">{{ content.eyebrow }}</p>
        <hr class="rule" />
        <h1 class="h-title page-title">{{ content.title }}</h1>
        <ProseBody class="page-body" :body="content.body" :images="content.images" para-class="page-para" />
        <RouterLink v-if="content.cta" :to="content.cta.to" class="btn page-cta">{{ content.cta.label }}</RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import ProseBody from '../components/prose/ProseBody.vue'
import PageImage from '../components/prose/PageImage.vue'
import { placeImages } from '../components/prose/layouts.js'
const props = defineProps({ content: { type: Object, default: () => ({}) } })
const topImages = computed(() => placeImages(props.content.images, 0).top)
</script>

<style scoped>
.page { padding-top: var(--nav-height); overflow-x: clip; } /* full-bleed images use 100vw, which includes the scrollbar */
.page-wrap { max-width: 720px; }
.page-title { margin-bottom: 1.5rem; }
.page-body :deep(.page-para) { font-family: var(--font-accent); font-size: 1.15rem; line-height: 1.85; color: var(--text); opacity: 0.9; margin-bottom: 1.25rem; }
.page-cta { margin-top: 1rem; }
</style>
