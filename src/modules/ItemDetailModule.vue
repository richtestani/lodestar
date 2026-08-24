<template>
  <section class="section">
    <div class="container id-wrap">
      <div v-if="paragraphs.length" class="id-body">
        <p v-for="(para, i) in paragraphs" :key="i" class="id-para">{{ para }}</p>
      </div>
      <dl v-if="item.meta?.length" class="id-meta">
        <div v-for="(m, i) in item.meta" :key="i" class="id-meta-row">
          <dt>{{ m.label }}</dt>
          <dd>{{ m.value }}</dd>
        </div>
      </dl>
      <RouterLink v-if="item.cta" :to="item.cta.to" class="btn id-cta">{{ item.cta.label }}</RouterLink>
    </div>
  </section>
</template>

<script setup>
// Generic item-detail body — a description (string or string[]) plus an
// optional flexible key/value list (`item.meta`: [{label, value}]) for
// whatever extra facts a project's items carry — specs for a product,
// department for a team bio, square footage for a listing, and so on —
// without this module needing to know which domain it's in.
import { computed } from 'vue'

const props = defineProps({ item: { type: Object, required: true } }) // from context
const paragraphs = computed(() =>
  Array.isArray(props.item.description) ? props.item.description : (props.item.description ? [props.item.description] : [])
)
</script>

<style scoped>
.id-wrap { max-width: 720px; }
.id-para { font-family: var(--font-accent); font-size: 1.1rem; line-height: 1.8; color: var(--text); opacity: 0.9; margin-bottom: 1.15rem; }
.id-meta { display: grid; gap: 0.6rem; margin: 1.75rem 0; padding: 1.25rem; background: var(--surface-2); border-radius: var(--radius); }
.id-meta-row { display: flex; justify-content: space-between; gap: 1rem; font-family: var(--font-body); font-size: 0.92rem; }
.id-meta-row dt { color: var(--text-muted); }
.id-meta-row dd { margin: 0; font-weight: 600; text-align: right; }
.id-cta { margin-top: 1rem; }
</style>
