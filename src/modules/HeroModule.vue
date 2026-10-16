<template>
  <section class="hero" :class="[`hero--${variant}`, { 'no-media': usesMedia && !bg }]">
    <div v-if="usesBg && bg" class="hero-bg" :style="{ backgroundImage: `url(${bg})` }" aria-hidden="true"></div>
    <div class="container hero-inner">
      <div class="hero-copy">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h1 class="h-display hero-title">{{ title }}</h1>
        <p v-if="subtitle" class="lead hero-sub">{{ subtitle }}</p>
        <div class="hero-actions">
          <RouterLink v-if="primaryCta" :to="primaryCta.to" class="btn">{{ primaryCta.label }}</RouterLink>
          <RouterLink v-if="secondaryCta" :to="secondaryCta.to" class="btn btn--ghost">{{ secondaryCta.label }}</RouterLink>
        </div>
        <p v-if="note" class="hero-note">{{ note }}</p>
      </div>
      <div v-if="usesMedia && bg" class="hero-media"><img :src="bg" :alt="title" /></div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { asset } from '@/composables/useAssets.js'
const props = defineProps({
  // center | split | minimal | overlay | panel | stacked
  variant: { type: String, default: 'center' },
  eyebrow: String, title: { type: String, default: '' }, subtitle: String,
  image: String, primaryCta: Object, secondaryCta: Object,
  // optional small line under the buttons ("Free 14-day trial · No card needed")
  note: String,
})
const bg        = computed(() => asset(props.image))
const usesBg    = computed(() => ['center', 'overlay'].includes(props.variant)) // full-bleed background
const usesMedia = computed(() => ['split', 'panel', 'stacked'].includes(props.variant)) // inline <img>
</script>

<style scoped>
.hero { position: relative; overflow: hidden; }
.hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; z-index: 0; }
.hero-inner { position: relative; z-index: 1; padding-block: var(--section-pad); }
.hero-title { letter-spacing: var(--display-tracking, 0.04em); }
.hero-sub { margin-top: 1.1rem; color: var(--text-muted); }
.hero-actions { display: flex; gap: 1rem; margin-top: 2rem; flex-wrap: wrap; }
.hero-note { margin-top: 1rem; font-size: 0.85rem; color: var(--text-muted); }

/* ── center: full-bleed image, centered copy (theme-tinted scrim) ── */
.hero--center { min-height: 84vh; display: flex; align-items: center; text-align: center; background: var(--surface); }
.hero--center .hero-bg::after { content: ''; position: absolute; inset: 0; background: color-mix(in srgb, var(--bg) 62%, transparent); }
.hero--center .hero-inner { display: flex; justify-content: center; }
.hero--center .hero-copy { max-width: 720px; }
.hero--center .hero-actions { justify-content: center; }

/* ── split: copy beside an inline image ── */
.hero--split { background: var(--bg); }
.hero--split .hero-inner { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 6vw, 5rem); align-items: center; }
.hero--split .hero-media img { width: 100%; border-radius: var(--radius); box-shadow: var(--shadow-lg); object-fit: cover; }

/* ── minimal: text only, left-aligned, oversized type ── */
.hero--minimal { background: var(--bg); }
.hero--minimal .hero-inner { padding-block: clamp(5rem, 13vw, 9.5rem); }
.hero--minimal .hero-copy { max-width: 780px; }
.hero--minimal .hero-title { font-size: clamp(2.6rem, 7vw, 4.5rem); }

/* ── overlay: full-bleed image, copy bottom-left, light text ── */
.hero--overlay { min-height: 88vh; display: flex; background: var(--surface-2); } /* surface-2 = legible fallback if no image */
.hero--overlay .hero-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.74), rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.05)); }
.hero--overlay .hero-inner { display: flex; align-items: flex-end; }
.hero--overlay .hero-copy { max-width: 640px; }
.hero--overlay .eyebrow { color: rgba(255,255,255,0.9); }
.hero--overlay .hero-title { color: #fff; }
.hero--overlay .hero-sub { color: rgba(255,255,255,0.85); }
.hero--overlay .btn--ghost { color: #fff; border-color: rgba(255,255,255,0.55); background: transparent; }
.hero--overlay .btn--ghost:hover { background: #fff; color: var(--text); border-color: #fff; }

/* ── panel: contained image with a floating copy card overlapping it ── */
.hero--panel { background: var(--bg); }
.hero--panel .hero-inner { display: grid; }
.hero--panel .hero-media { grid-area: 1 / 1; }
.hero--panel .hero-media img { width: 100%; height: clamp(360px, 62vh, 640px); object-fit: cover; border-radius: var(--radius); box-shadow: var(--shadow); }
.hero--panel .hero-copy {
  grid-area: 1 / 1; align-self: end; justify-self: start;
  max-width: min(460px, 88%); margin: clamp(1rem, 4vw, 2.5rem);
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); box-shadow: var(--shadow-lg);
  padding: clamp(1.5rem, 3vw, 2.5rem);
}
.hero--panel .hero-title { font-size: clamp(1.8rem, 4vw, 2.8rem); }

/* ── stacked: centered copy, product shot / screenshot framed below ── */
.hero--stacked { background: var(--bg); }
.hero--stacked .hero-inner {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding-top: calc(var(--nav-height) + clamp(3rem, 8vw, 6.5rem));
  padding-bottom: clamp(3rem, 7vw, 5.5rem);
}
.hero--stacked .hero-copy { max-width: 860px; }
.hero--stacked .hero-title { font-size: clamp(2.6rem, 7vw, 5rem); }
.hero--stacked .hero-sub { max-width: 620px; margin-inline: auto; font-size: clamp(1.1rem, 1.8vw, 1.3rem); }
.hero--stacked .hero-actions { justify-content: center; }
.hero--stacked.no-media .hero-inner { padding-bottom: 0; }  /* interior page header: next section supplies the gap */
.hero--stacked.no-media .hero-title { font-size: clamp(2.4rem, 5.5vw, 4rem); }
.hero--stacked .hero-media { width: 100%; max-width: 1080px; margin-top: clamp(2.5rem, 6vw, 4.5rem); }
.hero--stacked .hero-media img {
  width: 100%; aspect-ratio: 16 / 9; object-fit: cover;
  border-radius: var(--radius); border: 1px solid var(--border); box-shadow: var(--shadow-lg);
}

@media (max-width: 768px) {
  .hero--split .hero-inner { grid-template-columns: 1fr; }
  .hero--split .hero-media { order: -1; }
}
</style>
