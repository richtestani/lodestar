<template>
  <section class="hero hero--split ih">
    <div class="container hero-inner">
      <div class="hero-copy">
        <RouterLink :to="'/' + collectionSlug" class="ih-back">← Back to {{ collectionName || 'all' }}</RouterLink>
        <h1 class="h-display hero-title">{{ item.name }}</h1>
        <p v-if="item.price" class="ih-price">{{ item.price }}</p>
        <p v-if="item.tagline" class="lead hero-sub">{{ item.tagline }}</p>
      </div>
      <div v-if="item.image" class="hero-media">
        <img :src="asset(item.image)" :alt="item.name" />
      </div>
    </div>
  </section>
</template>

<script setup>
// Generic item-detail header — works for a product, a team bio, a
// portfolio piece, whatever a collection holds. Reads straight off the
// matched `item` (threaded in via context — see CollectionItemView.vue),
// not a fixed prop list, so any extra fields a project's items carry
// just pass through untouched.
import { asset } from '@/composables/useAssets.js'

defineProps({
  item: { type: Object, required: true },     // from context
  collectionSlug: { type: String, default: '' },
  collectionName: { type: String, default: '' },
})
</script>

<style scoped>
.ih { background: var(--bg); }
.ih .hero-inner { padding-block: var(--section-pad); }
.ih-back { display: inline-block; font-family: var(--font-body); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1.25rem; opacity: 0.8; transition: opacity 0.2s; }
.ih-back:hover { opacity: 1; color: var(--primary); }
.ih-price { font-family: var(--font-body); font-size: 1.3rem; font-weight: 700; color: var(--primary); margin-top: 0.75rem; }
</style>
