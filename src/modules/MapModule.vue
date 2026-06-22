<template>
  <section class="section">
    <div class="container">
      <div class="map-grid">
        <div class="map-info">
          <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
          <h2 class="h-title">{{ title }}</h2>
          <p v-if="address" class="map-addr">{{ address }}</p>
          <ul v-if="hours.length" class="map-hours">
            <li v-for="(h, i) in hours" :key="i"><span>{{ h.day }}</span><span>{{ h.time }}</span></li>
          </ul>
          <a v-if="query" class="btn btn--link map-dir" :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`" target="_blank" rel="noopener">Get directions →</a>
        </div>
        <div class="map-embed">
          <iframe
            v-if="query"
            :src="`https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`"
            title="Location map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { site } from '@/site.config.js'
const props = defineProps({
  eyebrow: String, title: { type: String, default: '' },
  address: String, mapQuery: String, hours: { type: Array, default: () => [] },
})
// Falls back to the address / mapQuery in site.config.contact
const address = computed(() => props.address || site.contact.address)
const query   = computed(() => props.mapQuery || site.contact.mapQuery || site.contact.address)
</script>

<style scoped>
.map-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: clamp(2rem, 5vw, 4rem); align-items: center; }
.map-addr { margin-top: 1rem; color: var(--text-muted); line-height: 1.6; }
.map-hours { list-style: none; margin: 1.5rem 0; max-width: 320px; }
.map-hours li { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
.map-hours li span:first-child { color: var(--text-muted); }
.map-dir { margin-top: 0.5rem; }
.map-embed { aspect-ratio: 4 / 3; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); }
.map-embed iframe { width: 100%; height: 100%; border: 0; }
@media (max-width: 800px) { .map-grid { grid-template-columns: 1fr; } }
</style>
