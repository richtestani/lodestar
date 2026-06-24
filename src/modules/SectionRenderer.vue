<template>
  <component
    v-for="(section, i) in sections"
    :is="moduleFor(section.module)"
    :key="i"
    v-bind="section.props || {}"
  />
</template>

<script setup>
// Renders an ordered list of modules from the registry. Used by HomeView
// (with site.homeSections) and ModuleView (with a page's `sections`).
import { moduleRegistry } from '@/modules/registry.js'

defineProps({ sections: { type: Array, default: () => [] } })

function moduleFor(name) {
  const c = moduleRegistry[name]
  if (!c && import.meta.env.DEV) console.warn(`[lodestar] unknown module "${name}"`)
  return c
}
</script>
