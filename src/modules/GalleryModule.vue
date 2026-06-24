<template>
  <section class="section section--surface">
    <div class="container">
      <div class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="h-title">{{ title }}</h2>
      </div>
      <div class="gal" :class="`gal--${variant}`">
        <figure v-for="(img, i) in images" :key="i" class="gal-item">
          <img :src="src(img.src)" :alt="img.alt || ''" loading="lazy" />
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup>
import { asset } from '@/composables/useAssets.js'
defineProps({
  eyebrow: String, title: { type: String, default: '' },
  images: { type: Array, default: () => [] },
  // grid | masonry | carousel | mosaic
  variant: { type: String, default: 'grid' },
})
const src = asset
</script>

<style scoped>
/* Shared item treatment. Per-variant rules set sizing/aspect below. */
.gal-item { overflow: hidden; border-radius: var(--radius); box-shadow: var(--shadow); margin: 0; }
.gal-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
.gal-item:hover img { transform: scale(1.05); }

/* ── grid: uniform squares ── */
.gal--grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
.gal--grid .gal-item { aspect-ratio: 1; }

/* ── masonry: staggered heights, natural proportions (CSS columns) ── */
.gal--masonry { column-count: 3; column-gap: 1rem; }
.gal--masonry .gal-item { break-inside: avoid; margin-bottom: 1rem; }
.gal--masonry .gal-item img { height: auto; }
@media (max-width: 900px) { .gal--masonry { column-count: 2; } }
@media (max-width: 560px) { .gal--masonry { column-count: 1; } }

/* ── carousel: horizontal swipe strip with snap ── */
.gal--carousel {
  display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 1rem;
  scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
  scrollbar-width: thin; scrollbar-color: var(--border) transparent;
}
.gal--carousel .gal-item { flex: 0 0 clamp(260px, 70%, 420px); aspect-ratio: 4 / 3; scroll-snap-align: center; }
.gal--carousel::-webkit-scrollbar { height: 8px; }
.gal--carousel::-webkit-scrollbar-thumb { background: var(--border); border-radius: 999px; }

/* ── mosaic: first image large, rest tiled (best with 5+ images) ── */
.gal--mosaic { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.gal--mosaic .gal-item { aspect-ratio: 1; }
.gal--mosaic .gal-item:first-child { grid-column: span 2; grid-row: span 2; }
@media (max-width: 700px) {
  .gal--mosaic { grid-template-columns: repeat(2, 1fr); }
  .gal--mosaic .gal-item:first-child { grid-column: span 2; grid-row: span 1; aspect-ratio: 2 / 1; }
}
</style>
