<template>
  <section class="section" :class="{ 'section--surface': onSurface }">
    <div class="container">
      <div v-if="eyebrow || title || intro" class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 v-if="title" class="h-title">{{ title }}</h2>
        <p v-if="intro">{{ intro }}</p>
      </div>

      <!-- grid (default): icon cards -->
      <div v-if="variant !== 'rows'" class="feat-grid" :style="{ '--cols': columns }">
        <article v-for="(item, i) in items" :key="i" class="card feat-card">
          <span v-if="item.icon" class="feat-icon">{{ item.icon }}</span>
          <h3 class="feat-title">{{ item.title }}</h3>
          <p class="muted">{{ item.text }}</p>
        </article>
      </div>

      <!-- rows: one feature per row, image and copy alternating sides -->
      <div v-else class="feat-rows">
        <article v-for="(item, i) in items" :key="i" class="feat-row" :class="{ 'no-media': !item.image }">
          <div v-if="item.image" class="feat-row-media">
            <img :src="asset(item.image)" :alt="item.alt || item.title" loading="lazy" />
          </div>
          <div class="feat-row-copy">
            <p v-if="item.label" class="eyebrow">{{ item.label }}</p>
            <h3 class="h-title feat-row-title">{{ item.title }}</h3>
            <p class="feat-row-text">{{ item.text }}</p>
            <ul v-if="item.points?.length" class="feat-points">
              <li v-for="(pt, pi) in item.points" :key="pi">{{ pt }}</li>
            </ul>
            <RouterLink v-if="item.cta" :to="item.cta.to" class="btn btn--link feat-row-cta">{{ item.cta.label }} →</RouterLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { asset } from '@/composables/useAssets.js'

const props = defineProps({
  // grid (default) — icon cards in `columns` columns
  // rows           — one feature per row, `image` beside the copy, sides
  //                  alternating; items may also carry label, points[], cta
  variant: { type: String, default: 'grid' },
  eyebrow: String, title: { type: String, default: '' }, intro: String,
  columns: { type: Number, default: 3 },
  items: { type: Array, default: () => [] },
  // tinted band behind the section. Default: on for grid, off for rows
  surface: { type: Boolean, default: undefined },
})
const onSurface = computed(() => props.surface ?? props.variant !== 'rows')
</script>

<style scoped>
.feat-grid { display: grid; grid-template-columns: repeat(var(--cols, 3), 1fr); gap: 1.5rem; }
.feat-card { padding: 2rem 1.75rem; }
.feat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
.feat-icon { display: inline-block; font-size: 1.6rem; color: var(--primary); margin-bottom: 1rem; }
.feat-title { font-size: 1.15rem; margin-bottom: 0.6rem; }
@media (max-width: 900px) { .feat-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .feat-grid { grid-template-columns: 1fr; } }

/* ── rows ── */
.feat-rows { display: flex; flex-direction: column; gap: clamp(4rem, 9vw, 7rem); }
.feat-row { display: grid; grid-template-columns: 1.15fr 1fr; gap: clamp(2rem, 6vw, 5rem); align-items: center; }
.feat-row:nth-child(even) .feat-row-media { order: 2; }
.feat-row.no-media { grid-template-columns: 1fr; max-width: 680px; }
.feat-row-media img {
  width: 100%; aspect-ratio: 4 / 3; object-fit: cover;
  border-radius: var(--radius); border: 1px solid var(--border); box-shadow: var(--shadow-lg);
}
.feat-row-title { margin-top: 0.6rem; }
.feat-row-text { margin-top: 1rem; color: var(--text-muted); font-size: 1.08rem; }
.feat-points { list-style: none; margin-top: 1.5rem; display: grid; gap: 0.7rem; }
.feat-points li { padding-left: 1.6rem; position: relative; }
.feat-points li::before { content: '✓'; position: absolute; left: 0; color: var(--label-color, var(--primary)); font-weight: 700; }
.feat-row-cta { margin-top: 1.75rem; }
@media (max-width: 800px) {
  .feat-row { grid-template-columns: 1fr; }
  .feat-row:nth-child(even) .feat-row-media { order: 0; }
}
</style>
