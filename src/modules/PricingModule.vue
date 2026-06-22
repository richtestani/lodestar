<template>
  <section class="section">
    <div class="container">
      <div class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="h-title">{{ title }}</h2>
      </div>
      <div class="price-grid">
        <article v-for="(tier, i) in tiers" :key="i" class="card price-card" :class="{ featured: tier.featured }">
          <span v-if="tier.featured" class="price-tag">Most popular</span>
          <h3 class="price-name">{{ tier.name }}</h3>
          <div class="price-amount"><span class="price-value">{{ tier.price }}</span><span v-if="tier.period" class="price-period">/{{ tier.period }}</span></div>
          <ul class="price-features">
            <li v-for="(f, fi) in tier.features" :key="fi">{{ f }}</li>
          </ul>
          <RouterLink v-if="tier.cta" :to="tier.cta.to" class="btn" :class="{ 'btn--ghost': !tier.featured }">{{ tier.cta.label }}</RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ eyebrow: String, title: { type: String, default: '' }, tiers: { type: Array, default: () => [] } })
</script>

<style scoped>
.price-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; align-items: stretch; }
.price-card { padding: 2.25rem 1.75rem; display: flex; flex-direction: column; gap: 1rem; position: relative; }
.price-card.featured { border-color: var(--primary); box-shadow: var(--shadow-lg); }
.price-tag { position: absolute; top: -0.7rem; left: 50%; transform: translateX(-50%); background: var(--primary); color: var(--on-primary); font-size: 0.6rem; letter-spacing: 0.16em; text-transform: uppercase; padding: 0.3rem 0.8rem; border-radius: 999px; }
.price-name { font-size: 1.2rem; }
.price-amount { display: flex; align-items: baseline; gap: 0.2rem; }
.price-value { font-family: var(--font-display); font-size: 2.4rem; font-weight: 700; color: var(--primary); }
.price-period { color: var(--text-muted); font-size: 0.85rem; }
.price-features { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; margin: 0.5rem 0 1rem; flex: 1; }
.price-features li { font-size: 0.88rem; color: var(--text-muted); padding-left: 1.4rem; position: relative; }
.price-features li::before { content: '✓'; position: absolute; left: 0; color: var(--primary); font-weight: 700; }
.price-card .btn { text-align: center; }
</style>
