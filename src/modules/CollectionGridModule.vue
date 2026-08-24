<template>
  <section class="section">
    <div class="container">
      <div class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="h-title">{{ title }}</h2>
      </div>
      <div v-for="g in groups" :key="g.key ?? '_all'" class="cg-group">
        <h3 v-if="g.key" class="cg-group-heading">{{ g.key }}</h3>
        <div class="cg-grid">
          <RouterLink
            v-for="it in g.items"
            :key="it.slug"
            :to="`/${collectionSlug}/${it.slug}`"
            class="cg-card"
          >
            <div v-if="it.image" class="cg-media">
              <img :src="asset(it.image)" :alt="it.name" loading="lazy" />
            </div>
            <div class="cg-body">
              <h4 class="cg-name">{{ it.name }}</h4>
              <p v-if="it.price" class="cg-price">{{ it.price }}</p>
              <p v-if="it.tagline" class="cg-tagline">{{ it.tagline }}</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Generic collection listing — works for a shop, team, portfolio,
// services, blog, whatever a project's collection holds. Only `name` is
// required per item; `image`/`price`/`tagline` render if present,
// domain-neutral (price isn't retail-specific here, just an optional
// line under the name — a "role" or "location" works the same way).
//
// Optional grouping: set `groupBy` to any field name your items carry —
// 'category' for a shop, 'author' for a book list, whatever — no fixed
// "category" concept, items don't need any new required field. Groups
// sort alphabetically by default; pass `groupOrder` to pin a specific
// order instead (e.g. merchandising order rather than A–Z). Items
// missing the field land in an "Other" group.
import { computed } from 'vue'
import { asset } from '@/composables/useAssets.js'

const props = defineProps({
  eyebrow: String,
  title: { type: String, default: '' },
  items: { type: Array, default: () => [] },       // from context — see CollectionView.vue
  collectionSlug: { type: String, default: '' },    // from context
  groupBy: { type: String, default: '' },           // e.g. 'category', 'author' — a field name on your items
  groupOrder: { type: Array, default: () => [] },   // optional explicit order; default is alphabetical
})

const groups = computed(() => {
  if (!props.groupBy) return [{ key: null, items: props.items }]
  const map = new Map()
  for (const it of props.items) {
    const key = it[props.groupBy] || 'Other'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(it)
  }
  let keys = [...map.keys()]
  keys = props.groupOrder.length
    ? [...props.groupOrder.filter(k => map.has(k)), ...keys.filter(k => !props.groupOrder.includes(k))]
    : keys.sort((a, b) => a.localeCompare(b))
  return keys.map(key => ({ key, items: map.get(key) }))
})
</script>

<style scoped>
.cg-group + .cg-group { margin-top: 3rem; }
.cg-group-heading { font-family: var(--font-body); font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin: 0 0 1.25rem; padding-bottom: 0.6rem; border-bottom: 1px solid var(--border); }
.cg-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.75rem; }
.cg-card { display: block; color: var(--text); }
.cg-media { aspect-ratio: 4 / 3; overflow: hidden; border-radius: var(--radius); box-shadow: var(--shadow); margin-bottom: 0.9rem; background: var(--surface-2); }
.cg-media img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
.cg-card:hover .cg-media img { transform: scale(1.05); }
.cg-name { font-family: var(--font-display); font-size: 1.05rem; margin: 0 0 0.3rem; }
.cg-price { font-family: var(--font-body); font-weight: 600; color: var(--primary); margin: 0 0 0.3rem; }
.cg-tagline { font-family: var(--font-body); font-size: 0.88rem; color: var(--text-muted); margin: 0; }
</style>
