<template>
  <section class="section" :class="{ 'section--surface': onSurface && !sectionDark, 'tone-dark': sectionDark }">
    <div class="container">
      <div v-if="eyebrow || title || intro" class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 v-if="title" class="h-title">{{ title }}</h2>
        <p v-if="intro">{{ intro }}</p>
      </div>

      <!-- grid (default): icon cards -->
      <div v-if="variant !== 'rows'" class="feat-grid" :style="{ '--cols': columns }">
        <article v-for="(item, i) in items" :key="i" class="card feat-card">
          <p v-if="item.label" class="eyebrow feat-card-label">{{ item.label }}</p>
          <span v-if="item.icon && !isImage(item.icon)" class="feat-icon">{{ item.icon }}</span>
          <img v-else-if="item.icon" :src="asset(item.icon)" alt="" class="feat-icon-img" />
          <h3 class="feat-title">{{ item.title }}</h3>
          <p v-if="item.text" class="muted">{{ item.text }}</p>
          <ul v-if="item.points?.length" class="feat-bullets">
            <li v-for="(pt, pi) in item.points" :key="pi">{{ pt }}</li>
          </ul>
        </article>
      </div>

      <!-- rows: one feature per row -->
      <div v-else class="feat-rows">
        <article
          v-for="(item, i) in items" :key="i"
          class="feat-row"
          :class="{
            'feat-row--cards': item.layout === 'cards',
            'no-media': item.layout !== 'cards' && !item.image,
            'tone-dark is-dark': item.tone === 'dark' && !sectionDark,
          }"
        >
          <!-- layout: 'cards' — split heading, then `points` laid out as cards -->
          <template v-if="item.layout === 'cards'">
            <header class="feat-cards-head">
              <div>
                <p v-if="item.label" class="eyebrow">{{ item.label }}</p>
                <h3 class="feat-cards-title">{{ item.title }}</h3>
              </div>
              <p v-if="item.text" class="feat-row-text">{{ item.text }}</p>
            </header>

            <div class="feat-cards" :style="{ '--cols': item.columns || Math.min(item.points?.length || 3, 4) }">
              <article v-for="(pt, pi) in item.points" :key="pi" class="card feat-pcard">
                <p v-if="cardLabel(item, pt, pi)" class="eyebrow">{{ cardLabel(item, pt, pi) }}</p>
                <span v-if="pt.icon && !isImage(pt.icon)" class="feat-icon">{{ pt.icon }}</span>
                <img v-else-if="pt.icon" :src="asset(pt.icon)" alt="" class="feat-icon-img" />
                <h4 class="feat-pcard-title">{{ pt.title ?? pt }}</h4>
                <p v-if="pt.text" class="muted">{{ pt.text }}</p>
                <ul v-if="pt.points?.length" class="feat-bullets">
                  <li v-for="(b, bi) in pt.points" :key="bi">{{ b }}</li>
                </ul>
              </article>
            </div>

            <div v-if="item.cta" class="feat-cards-foot">
              <RouterLink :to="item.cta.to" class="btn btn--link">{{ item.cta.label }} →</RouterLink>
            </div>
          </template>

          <!-- default layout: media beside the copy, sides alternating -->
          <template v-else>
            <div v-if="item.image" class="feat-row-media">
              <img :src="asset(item.image)" :alt="item.alt || item.title" loading="lazy" />
            </div>
            <div class="feat-row-copy">
              <p v-if="item.label" class="eyebrow">{{ item.label }}</p>
              <h3 class="h-title feat-row-title">{{ item.title }}</h3>
              <p v-if="item.text" class="feat-row-text">{{ item.text }}</p>

              <!-- points: strings (check list) or { title, text } -->
              <ul v-if="item.points?.length" class="feat-points">
                <li v-for="(pt, pi) in item.points" :key="pi">
                  <template v-if="typeof pt === 'string'">{{ pt }}</template>
                  <template v-else>
                    <strong class="feat-point-title">{{ pt.title }}</strong>
                    <span v-if="pt.text" class="feat-point-text">{{ pt.text }}</span>
                  </template>
                </li>
              </ul>

              <!-- stats: [{ value, label }] -->
              <div v-if="item.stats?.length" class="feat-stats">
                <div v-for="(s, si) in item.stats" :key="si" class="feat-stat">
                  <span class="feat-stat-value">{{ s.value }}</span>
                  <span class="feat-stat-label">{{ s.label }}</span>
                </div>
              </div>

              <!-- quote: { text, cite } -->
              <blockquote v-if="item.quote?.text" class="feat-quote">
                <p>{{ item.quote.text }}</p>
                <cite v-if="item.quote.cite">{{ item.quote.cite }}</cite>
              </blockquote>

              <RouterLink v-if="item.cta" :to="item.cta.to" class="btn btn--link feat-row-cta">{{ item.cta.label }} →</RouterLink>
            </div>
          </template>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { asset } from '@/composables/useAssets.js'

const props = defineProps({
  // grid (default) — icon cards in `columns` columns; items take icon,
  //                  title, text, and optionally label and points[]
  // rows           — one feature per row. Each item is either:
  //   • default layout: `image` beside the copy, sides alternating; the copy
  //     takes label, title, text, points[] (strings, or { title, text }),
  //     stats[] ({ value, label }), quote ({ text, cite }) and cta
  //   • layout: 'cards': a full-width row with a split heading (label +
  //     title left, text right), its `points` laid out as cards
  //     ({ label, icon, title, text, points[] }), and an optional cta.
  //     `numbered: true` prefixes card labels with 01 /, 02 /, …;
  //     `columns` overrides the card count per row (default: up to 4)
  //   Any row can take `tone: 'dark'` for a full-bleed dark band.
  variant: { type: String, default: 'grid' },
  eyebrow: String, title: { type: String, default: '' }, intro: String,
  columns: { type: Number, default: 3 },
  items: { type: Array, default: () => [] },
  // tinted band behind the section. Default: on for grid, off for rows
  surface: { type: Boolean, default: undefined },
  // 'dark' — the whole section on the dark panel (surface-2), light text
  tone: { type: String, default: 'light' },
})
const onSurface = computed(() => props.surface ?? props.variant !== 'rows')
const sectionDark = computed(() => props.tone === 'dark')

// An icon is an image if it looks like a path or URL; otherwise it's a glyph.
const isImage = (s) => typeof s === 'string' && /\.(svg|png|jpe?g|webp|gif)$|^https?:|\//i.test(s)

function cardLabel(item, pt, i) {
  const label = typeof pt === 'object' ? pt.label : ''
  if (!item.numbered) return label
  const n = String(i + 1).padStart(2, '0')
  return label ? `${n} / ${label}` : n
}
</script>

<style scoped>
.feat-grid { display: grid; grid-template-columns: repeat(var(--cols, 3), 1fr); gap: 1.5rem; }
.feat-card { padding: 2rem 1.75rem; display: flex; flex-direction: column; }
.feat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
.feat-card-label { margin-bottom: 1.25rem; }
.feat-icon { display: inline-block; font-size: 1.6rem; color: var(--label-color, var(--primary)); margin-bottom: 1rem; }
.feat-icon-img { width: 2.5rem; height: 2.5rem; object-fit: contain; margin-bottom: 1.25rem; }
.feat-title { font-size: 1.15rem; margin-bottom: 0.6rem; }
@media (max-width: 900px) { .feat-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .feat-grid { grid-template-columns: 1fr; } }

/* bulleted list inside a card, pinned to the bottom so lists line up */
.feat-bullets {
  margin-top: auto; padding-top: 1.75rem; padding-left: 1.1rem;
  display: grid; gap: 0.55rem; font-size: 0.95rem; color: var(--text-muted);
}
.feat-bullets li::marker { color: var(--text-muted); }

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
.feat-point-title { display: block; font-weight: 600; }
.feat-point-text { display: block; color: var(--text-muted); margin-top: 0.15rem; }
.feat-row-cta { margin-top: 1.75rem; }

.feat-stats {
  margin-top: 1.75rem; display: grid; gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
}
.feat-stat-value { display: block; font-family: var(--font-display); font-size: clamp(1.8rem, 3.5vw, 2.4rem); line-height: 1.1; }
.feat-stat-label { display: block; margin-top: 0.3rem; font-size: 0.9rem; color: var(--text-muted); }

.feat-quote { margin-top: 1.75rem; padding-left: 1.25rem; border-left: 2px solid var(--label-color, var(--primary)); }
.feat-quote p { font-family: var(--font-accent); font-size: 1.1rem; font-style: italic; }
.feat-quote cite { display: block; margin-top: 0.6rem; font-style: normal; font-size: 0.9rem; color: var(--text-muted); }

@media (max-width: 800px) {
  .feat-row { grid-template-columns: 1fr; }
  .feat-row:nth-child(even) .feat-row-media { order: 0; }
}

/* ── rows › layout: 'cards' ── */
.feat-row--cards { display: block; }
.feat-cards-head {
  display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem 4rem; align-items: end;
  margin-bottom: clamp(2.5rem, 5vw, 3.5rem);
}
.feat-cards-head .feat-row-text { margin-top: 0; }
.feat-cards-title {
  margin-top: 0.9rem; white-space: pre-line;   /* a \n in the title breaks the line */
  font-size: clamp(2.2rem, 5.5vw, 4.5rem); line-height: 1.05; letter-spacing: -0.02em;
}
.feat-cards { display: grid; grid-template-columns: repeat(var(--cols, 4), 1fr); gap: 1.5rem; }
.feat-pcard { padding: 2.25rem 2rem; display: flex; flex-direction: column; border-radius: var(--radius); }
.feat-pcard .eyebrow { margin-bottom: 2rem; }
.feat-pcard-title { font-size: 1.45rem; line-height: 1.2; margin-bottom: 0.9rem; }
.feat-cards-foot { display: flex; justify-content: flex-end; margin-top: 2.5rem; }
@media (max-width: 1000px) { .feat-cards { grid-template-columns: 1fr 1fr; } }
@media (max-width: 800px)  { .feat-cards-head { grid-template-columns: 1fr; } }
@media (max-width: 600px)  { .feat-cards { grid-template-columns: 1fr; } }

/* ── tone: 'dark' (section or single row) ──
   surface-2 is dark in every theme, so text comes from --on-dark (optional
   token, near-white fallback) rather than --bg, which is dark in dark themes. */
.tone-dark {
  --ink: var(--on-dark, #f3f4f6);
  --text: var(--ink);
  --text-muted: color-mix(in srgb, var(--ink) 68%, transparent);
  --border: color-mix(in srgb, var(--ink) 14%, transparent);
  --surface: color-mix(in srgb, var(--ink) 5%, var(--surface-2));
  --label-color: color-mix(in srgb, var(--primary) 55%, var(--ink));
  --shadow: none;
  background: var(--surface-2); color: var(--text);
}
.tone-dark .btn--link {
  color: var(--label-color);
  border-bottom-color: color-mix(in srgb, var(--label-color) 45%, transparent);
}
/* a single dark row bleeds to the viewport edges without leaving the container */
.feat-row.is-dark {
  padding-block: clamp(3rem, 7vw, 5rem);
  border-image: linear-gradient(var(--surface-2), var(--surface-2)) fill 0 / 0 / 0 100vmax;
}
</style>
