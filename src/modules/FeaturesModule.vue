<template>
  <section class="section section--surface">
    <div class="container">
      <div class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="h-title">{{ title }}</h2>
        <p v-if="intro">{{ intro }}</p>
      </div>
      <div class="feat-grid" :style="{ '--cols': columns }">
        <article v-for="(item, i) in items" :key="i" class="card feat-card">
          <span v-if="item.icon" class="feat-icon">{{ item.icon }}</span>
          <h3 class="feat-title">{{ item.title }}</h3>
          <p class="muted">{{ item.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  eyebrow: String, title: { type: String, default: '' }, intro: String,
  columns: { type: Number, default: 3 },
  items: { type: Array, default: () => [] },
})
</script>

<style scoped>
.feat-grid { display: grid; grid-template-columns: repeat(var(--cols, 3), 1fr); gap: 1.5rem; }
.feat-card { padding: 2rem 1.75rem; }
.feat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
.feat-icon { display: inline-block; font-size: 1.6rem; color: var(--primary); margin-bottom: 1rem; }
.feat-title { font-size: 1.15rem; margin-bottom: 0.6rem; }
@media (max-width: 900px) { .feat-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .feat-grid { grid-template-columns: 1fr; } }
</style>
