<template>
  <section class="section">
    <div class="container">
      <div class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="h-title">{{ title }}</h2>
      </div>
      <div class="quote-grid">
        <figure v-for="(t, i) in items" :key="i" class="card quote-card">
          <blockquote class="quote-text">{{ t.quote }}</blockquote>
          <figcaption class="quote-by">
            <span class="quote-author">{{ t.author }}</span>
            <span v-if="t.role" class="quote-role">{{ t.role }}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ eyebrow: String, title: { type: String, default: '' }, items: { type: Array, default: () => [] } })
</script>

<style scoped>
.quote-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
.quote-card { padding: 2rem 1.75rem; display: flex; flex-direction: column; gap: 1.25rem; }
.quote-text { font-family: var(--font-accent); font-size: 1.18rem; line-height: 1.65; font-style: italic; }
.quote-text::before { content: '“'; color: var(--primary); font-size: 1.4em; margin-right: 2px; }
.quote-by { display: flex; flex-direction: column; gap: 2px; }
.quote-author { font-weight: 700; font-size: 0.82rem; letter-spacing: 0.06em; }
.quote-role { font-size: 0.72rem; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase; }
</style>
