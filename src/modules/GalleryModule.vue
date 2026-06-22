<template>
  <section class="section section--surface">
    <div class="container">
      <div class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="h-title">{{ title }}</h2>
      </div>
      <div class="gal-grid">
        <figure v-for="(img, i) in images" :key="i" class="gal-item">
          <img :src="src(img.src)" :alt="img.alt || ''" loading="lazy" />
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup>
import { asset } from '@/composables/useAssets.js'
defineProps({ eyebrow: String, title: { type: String, default: '' }, images: { type: Array, default: () => [] } })
const src = asset
</script>

<style scoped>
.gal-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
.gal-item { overflow: hidden; border-radius: var(--radius); aspect-ratio: 1; box-shadow: var(--shadow); }
.gal-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.gal-item:hover img { transform: scale(1.05); }
</style>
