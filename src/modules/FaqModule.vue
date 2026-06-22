<template>
  <section class="section">
    <div class="container faq-wrap">
      <div class="section-head">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 class="h-title">{{ title }}</h2>
      </div>
      <ul class="faq-list">
        <li v-for="(item, i) in items" :key="i" class="faq-item" :class="{ open: openIndex === i }">
          <button class="faq-q" :aria-expanded="openIndex === i" @click="toggle(i)">
            <span>{{ item.q }}</span>
            <span class="faq-mark" aria-hidden="true">+</span>
          </button>
          <div class="faq-a"><p>{{ item.a }}</p></div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
defineProps({ eyebrow: String, title: { type: String, default: '' }, items: { type: Array, default: () => [] } })
const openIndex = ref(0)
function toggle(i) { openIndex.value = openIndex.value === i ? -1 : i }
</script>

<style scoped>
.faq-wrap { max-width: 760px; }
.faq-list { list-style: none; }
.faq-item { border-bottom: 1px solid var(--border); }
.faq-q {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  background: none; border: none; cursor: pointer; text-align: left; padding: 1.25rem 0;
  font-family: var(--font-display); font-size: 1.05rem; font-weight: 600; color: var(--text);
}
.faq-mark { color: var(--primary); font-size: 1.3rem; transition: transform 0.25s; flex-shrink: 0; }
.faq-item.open .faq-mark { transform: rotate(45deg); }
.faq-a { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
.faq-item.open .faq-a { max-height: 320px; }
.faq-a p { padding-bottom: 1.25rem; color: var(--text-muted); line-height: 1.7; }
</style>
