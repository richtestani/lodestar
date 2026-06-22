<template>
  <section class="hero" :class="`hero--${variant}`">
    <div v-if="variant === 'center' && bg" class="hero-bg" :style="{ backgroundImage: `url(${bg})` }" aria-hidden="true"></div>
    <div class="container hero-inner">
      <div class="hero-copy">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h1 class="h-display hero-title">{{ title }}</h1>
        <p v-if="subtitle" class="lead hero-sub">{{ subtitle }}</p>
        <div class="hero-actions">
          <RouterLink v-if="primaryCta" :to="primaryCta.to" class="btn">{{ primaryCta.label }}</RouterLink>
          <RouterLink v-if="secondaryCta" :to="secondaryCta.to" class="btn btn--ghost">{{ secondaryCta.label }}</RouterLink>
        </div>
      </div>
      <div v-if="variant === 'split' && bg" class="hero-media">
        <img :src="bg" :alt="title" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { asset } from '@/composables/useAssets.js'
const props = defineProps({
  variant: { type: String, default: 'center' },
  eyebrow: String, title: { type: String, default: '' }, subtitle: String,
  image: String, primaryCta: Object, secondaryCta: Object,
})
const bg = computed(() => asset(props.image))
</script>

<style scoped>
.hero { position: relative; overflow: hidden; }
.hero--center { min-height: 84vh; display: flex; align-items: center; text-align: center; background: var(--surface); }
.hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; z-index: 0; }
.hero--center .hero-bg::after { content: ''; position: absolute; inset: 0; background: color-mix(in srgb, var(--bg) 62%, transparent); }
.hero-inner { position: relative; z-index: 1; padding-block: var(--section-pad); }
.hero--center .hero-inner { display: flex; justify-content: center; }
.hero--center .hero-copy { max-width: 720px; }
.hero-title { letter-spacing: 0.04em; }
.hero-sub { margin-top: 1.1rem; color: var(--text-muted); }
.hero-actions { display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; }
.hero--center .hero-actions { justify-content: center; }

.hero--split .hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 6vw, 5rem); align-items: center; }
.hero--split { background: var(--bg); }
.hero-media img { width: 100%; border-radius: var(--radius); box-shadow: var(--shadow-lg); object-fit: cover; }
@media (max-width: 768px) {
  .hero--split .hero-inner { grid-template-columns: 1fr; }
  .hero--split .hero-media { order: -1; }
}
</style>
