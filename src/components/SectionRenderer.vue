<template>
  <component
    v-for="(section, i) in sections"
    :is="moduleFor(section.module)"
    :key="i"
    v-bind="propsFor(section)"
  />
</template>

<script setup>
// Renders an ordered list of modules from the registry. Used by HomeView
// (site.homeSections), ModuleView ('sections'-view pages), and
// CollectionView/CollectionItemView ('collection'-view pages).
import { moduleRegistry } from '@/modules/registry.js'
import { BASE_MODULES } from '@/modules/manifest.js'
import { moduleDefaults } from '@/site.config.js'

const props = defineProps({
  sections: { type: Array, default: () => [] },
  // Extra props threaded into every module in this list — e.g. a
  // collection's `items` on its index page, or one `item` on its detail
  // page (see CollectionView.vue / CollectionItemView.vue). A module
  // only uses this if it declares a matching prop; harmless otherwise.
  context: { type: Object, default: () => ({}) },
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
