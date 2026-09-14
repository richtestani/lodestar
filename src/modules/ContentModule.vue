<!--
  ContentModule — plain prose block (eyebrow/title/body/cta), for small
  amounts of text inside a rows/columns page. Same markup and props
  shape as the old PageView.vue ('view: page'), just repackaged as an
  ordinary module so it can sit in any row/column alongside other
  modules instead of owning the whole page.
-->
<template>
  <section class="section content-block">
    <div class="container content-wrap">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <hr class="rule" />
      <h1 class="h-title content-title">{{ title }}</h1>
      <div class="content-body">
        <p v-for="(para, i) in paragraphs" :key="i" class="content-para">{{ para }}</p>
      </div>
      <RouterLink v-if="cta" :to="cta.to" class="btn content-cta">{{ cta.label }}</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  eyebrow: String,
  title: { type: String, default: '' },
  body: { type: [Array, String], default: () => [] },
  cta: Object,
})

const paragraphs = computed(() =>
  Array.isArray(props.body) ? props.body : (props.body ? [props.body] : [])
)
</script>

<style scoped>
.content-wrap { max-width: 720px; }
.content-title { margin-bottom: 1.5rem; }
.content-para {
  font-family: var(--font-accent);
  font-size: 1.15rem;
  line-height: 1.85;
  color: var(--text);
  opacity: 0.9;
  margin-bottom: 1.25rem;
}
.content-cta { margin-top: 1rem; }
</style>
