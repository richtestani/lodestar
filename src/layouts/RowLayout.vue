<!--
  RowLayout — renders an ordered list of rows, each row with 1-3 columns
  (per a named preset), each column a list of modules.

  This component ONLY handles grid/column/sticky mechanics. It does NOT
  resolve module names to components itself — each column's `modules`
  array is handed off to SectionRenderer, the existing single source
  of truth for module resolution (base + pro registry merge, prop
  precedence). This means every module already built for
  HomeView/collections works here for free, and nothing about module
  resolution had to be duplicated or reinvented.

  No page-level <main> wrapper here on purpose — that's RowsPageView's
  job (see src/views/RowsPageView.vue) for top-level 'rows' pages.
  DocLayout uses RowLayout directly, without that wrapper, since it's
  not a top-level nav-offset page in the same sense.

  Row shape:
    {
      preset: 'full' | 'even' | 'narrow' | 'wide' | 'third',  // default 'full'
      sticky: boolean,               // optional, only meaningful with 2+ columns
      stickyColumn: 'first' | 'last', // optional, default 'first'
      className: 'my-custom-class',  // optional escape hatch for custom.css
      context: { ... },              // optional, forwarded to SectionRenderer
      columns: [ { modules: [ { module: 'hero', props: {...} } ] }, ... ]
      // OR the single-column shorthand — for a full-width row you can skip
      // `columns` entirely and put `modules` directly on the row:
      modules: [ { module: 'hero', props: {...} } ]
    }

  Module shape matches SectionRenderer's existing convention exactly:
    { module: 'moduleName', props: { ... } }
-->
<template>
  <div class="row-layout">
    <div
      v-for="(row, i) in rows"
      :key="i"
      class="row-layout__row"
      :class="row.className"
      :style="{ gridTemplateColumns: presetFor(row).ratio.join(' ') }"
    >
      <div
        v-for="(col, ci) in normalizedColumns(row)"
        :key="ci"
        class="row-layout__column"
        :class="{ 'is-sticky': row.sticky && isStickyColumn(row, ci) }"
      >
        <SectionRenderer :sections="col.modules || []" :context="row.context || {}" />
      </div>
    </div>
  </div>
</template>

<script setup>
import SectionRenderer from '@/components/SectionRenderer.vue'
import { presets } from './presets'

defineProps({
  rows: { type: Array, required: true },
})

function presetFor(row) {
  return presets[row.preset] || presets.full
}

// supports both the explicit `columns` form and the single-column
// shorthand (`modules` directly on the row, for full-width rows)
function normalizedColumns(row) {
  return row.columns || [{ modules: row.modules || [] }]
}

function isStickyColumn(row, columnIndex) {
  const stickySide = row.stickyColumn || 'first'
  const lastIndex = presetFor(row).columns - 1
  return stickySide === 'first' ? columnIndex === 0 : columnIndex === lastIndex
}
</script>

<style scoped>
.row-layout__row {
  display: grid;
  gap: 2rem;
  align-items: start;
  margin-bottom: 3rem;
}

.row-layout__column.is-sticky {
  position: sticky;
  top: var(--sticky-top, calc(var(--header-height, 72px) + 16px));
  align-self: start;
}

@media (max-width: 768px) {
  .row-layout__row {
    grid-template-columns: 1fr !important;
  }
  .row-layout__column.is-sticky {
    position: static;
  }
}
</style>
