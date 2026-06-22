<template>
  <section class="section section--surface">
    <div class="container">
      <div class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="h-title">{{ title }}</h2>
      </div>
      <div class="team-grid">
        <article v-for="(m, i) in members" :key="i" class="team-card">
          <div class="team-photo"><img v-if="m.image" :src="src(m.image)" :alt="m.name" loading="lazy" /></div>
          <h3 class="team-name">{{ m.name }}</h3>
          <p class="team-role">{{ m.role }}</p>
          <p v-if="m.bio" class="muted team-bio">{{ m.bio }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { asset } from '@/composables/useAssets.js'
defineProps({ eyebrow: String, title: { type: String, default: '' }, members: { type: Array, default: () => [] } })
const src = asset
</script>

<style scoped>
.team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center; }
.team-photo { width: 130px; height: 130px; margin: 0 auto 1rem; border-radius: 50%; overflow: hidden; background: var(--border); }
.team-photo img { width: 100%; height: 100%; object-fit: cover; }
.team-name { font-size: 1.1rem; }
.team-role { color: var(--primary); font-size: 0.74rem; letter-spacing: 0.14em; text-transform: uppercase; margin: 0.3rem 0 0.7rem; }
.team-bio { font-size: 0.88rem; line-height: 1.6; max-width: 30ch; margin: 0 auto; }
</style>
