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
// (with site.homeSections) and ModuleView (with a page's `sections`).
import { moduleRegistry } from '@/modules/registry.js'
import { BASE_MODULES } from '@/modules/manifest.js'
import { moduleDefaults } from '@/site.config.js'

defineProps({ sections: { type: Array, default: () => [] } })

function moduleFor(name) {
  const c = moduleRegistry[name]
  if (!c) {
    console.warn(BASE_MODULES.includes(name)
      ? `[lodestar] unknown module "${name}"`
      : `[lodestar] module "${name}" isn't registered — if it's a premium module, make sure lodestar-pro-modules is installed into modules/pro/ (see README)`)
  }
  return c
}

// A module's sitewide default (config/modules/<name>.js, optional) fills
// gaps; the instance's own props in homeSections/sections always win.
function propsFor(section) {
  return { ...(moduleDefaults[section.module] || {}), ...(section.props || {}) }
}
</script>
