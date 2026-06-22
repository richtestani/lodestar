<template>
  <main class="page">
    <section class="section">
      <div class="container page-wrap">
        <p v-if="content.eyebrow" class="eyebrow">{{ content.eyebrow }}</p>
        <hr class="rule" />
        <h1 class="h-title page-title">{{ content.title }}</h1>
        <div class="page-body">
          <p v-for="(para, i) in paragraphs" :key="i" class="page-para">{{ para }}</p>
        </div>
        <RouterLink v-if="content.cta" :to="content.cta.to" class="btn page-cta">{{ content.cta.label }}</RouterLink>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ content: { type: Object, default: () => ({}) } })
const paragraphs = computed(() =>
  Array.isArray(props.content.body) ? props.content.body : (props.content.body ? [props.content.body] : [])
)
</script>

<style scoped>
.page { padding-top: var(--nav-height); }
.page-wrap { max-width: 720px; }
.page-title { margin-bottom: 1.5rem; }
.page-para { font-family: var(--font-accent); font-size: 1.15rem; line-height: 1.85; color: var(--text); opacity: 0.9; margin-bottom: 1.25rem; }
.page-cta { margin-top: 1rem; }
</style>
