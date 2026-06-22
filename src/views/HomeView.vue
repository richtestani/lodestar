<template>
  <main>
    <component
      v-for="(section, i) in homeSections"
      :is="moduleFor(section.module)"
      :key="i"
      v-bind="section.props || {}"
    />
  </main>
</template>

<script setup>
import { site } from '@/site.config.js'
import { moduleRegistry } from '@/modules/registry.js'

const homeSections = site.homeSections || []
function moduleFor(name) {
  const c = moduleRegistry[name]
  if (!c && import.meta.env.DEV) console.warn(`[lodestar] unknown module "${name}" in homeSections`)
  return c
}
</script>
