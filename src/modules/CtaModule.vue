<template>
  <section class="cta-band">
    <div class="container cta-inner">
      <div>
        <h2 class="h-title">{{ title }}</h2>
        <p v-if="text" class="cta-text">{{ text }}</p>
      </div>
      <RouterLink v-if="cta" :to="cta.to" class="btn">{{ cta.label }}</RouterLink>
    </div>
  </section>
</template>

<script setup>
defineProps({ title: { type: String, default: '' }, text: String, cta: Object })
</script>

<style scoped>
.cta-band { background: var(--primary); color: var(--on-primary); padding-block: clamp(3rem, 7vw, 5rem); }
.cta-inner { display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
.cta-band .h-title { color: var(--on-primary); }
.cta-text { margin-top: 0.6rem; opacity: 0.85; max-width: 50ch; }
.cta-band .btn { background: var(--on-primary); color: var(--primary); border-color: var(--on-primary); }
.cta-band .btn:hover { opacity: 0.9; background: var(--on-primary); }
</style>
