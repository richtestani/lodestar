<template>
  <template v-for="(section, i) in sections" :key="i">
    <!-- Wrapped in lodestar-pro-modules' SectionMotion when it's installed
         and this is a top-level page section (not a RowLayout column). -->
    <SectionMotion v-if="SectionMotion && !nested" :module="section.module" :override="section.motion">
      <component :is="moduleFor(section.module)" v-bind="propsFor(section)" />
    </SectionMotion>
    <component v-else :is="moduleFor(section.module)" v-bind="propsFor(section)" />
  </template>
</template>

<script setup>
// Renders an ordered list of modules from the registry. Used by HomeView
// (site.homeSections), RowLayout (each column of a 'rows' page), and
// CollectionView/CollectionItemView ('collection'-view pages).
import { moduleRegistry } from '@/modules/registry.js'
import { BASE_MODULES } from '@/modules/manifest.js'
import { moduleDefaults } from '@/site.config.js'

// Optional — resolves to null if lodestar-pro-modules isn't installed.
// Same pickup pattern as modules/registry.js and App.vue's MegaNav.
const proMotionMatches = import.meta.glob('./pro/SectionMotion.vue', { eager: true })
const SectionMotion = Object.values(proMotionMatches)[0]?.default || null

const props = defineProps({
  sections: { type: Array, default: () => [] },
  // Extra props threaded into every module in this list — e.g. a
  // collection's `items` on its index page, or one `item` on its detail
  // page (see CollectionView.vue / CollectionItemView.vue). A module
  // only uses this if it declares a matching prop; harmless otherwise.
  context: { type: Object, default: () => ({}) },
  // True when rendering modules inside a RowLayout column — those aren't
  // page sections, so section-level wrappers (e.g. pro SectionMotion) skip them.
  nested: { type: Boolean, default: false },
})

function moduleFor(name) {
  const c = moduleRegistry[name]
  if (!c) {
    console.warn(BASE_MODULES.includes(name)
      ? `[lodestar] unknown module "${name}"`
      : `[lodestar] module "${name}" isn't registered — if it's a premium module, make sure lodestar-pro-modules is installed into modules/pro/ (see README)`)
  }
  return c
}

// Precedence, lowest to highest: a module's sitewide default
// (config/modules/<name>.js, optional) < page-supplied context
// (items/item) < the instance's own props in homeSections/sections —
// the more specific one always wins.
function propsFor(section) {
  return { ...(moduleDefaults[section.module] || {}), ...props.context, ...(section.props || {}) }
}
</script>
