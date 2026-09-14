<!--
  RowsPageView — the top-level page component for `view: 'rows'` pages.
  Replaces ModuleView.vue (which handled the old `view: 'sections'`).

  Preserves ModuleView's nav-offset behavior exactly: a hero module is
  designed to sit under the transparent fixed nav, so if a page's first
  module ISN'T a hero, this pushes content below the nav so it doesn't
  get overlapped. Only checks the very first module of the very first
  row/column — matches ModuleView's original `sections[0]?.module` check,
  just adapted to the rows/columns shape.
-->
<template>
  <main :class="{ 'mv-offset': !startsWithHero }">
    <RowLayout :rows="rows" />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import RowLayout from '@/layouts/RowLayout.vue'

const props = defineProps({
  rows: { type: Array, default: () => [] },
})

function firstModuleName(rows) {
  const row0 = rows?.[0]
  if (!row0) return null
  const col0 = (row0.columns || [{ modules: row0.modules || [] }])[0]
  return col0?.modules?.[0]?.module ?? null
}

const startsWithHero = computed(() => firstModuleName(props.rows) === 'hero')
</script>

<style scoped>
.mv-offset { padding-top: var(--nav-height); }
</style>
