<template>
  <section class="section">
    <div class="container">
      <div class="stat-row">
        <div v-for="(s, i) in items" :key="i" class="stat">
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ items: { type: Array, default: () => [] } })
</script>

<style scoped>
.stat-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1.5rem; text-align: center; }
.stat { padding: 1.25rem; }
.stat-value { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; color: var(--primary); line-height: 1; }
.stat-label { margin-top: 0.6rem; font-size: 0.74rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-muted); }
</style>
