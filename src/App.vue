<template>
  <component :is="navComponent" />
  <RouterView />
  <AppFooter />
</template>

<script setup>
import { computed } from 'vue'
import AppNav    from '@/components/AppNav.vue'
import AppFooter from '@/components/AppFooter.vue'
import { site } from '@/site.config.js'

// Optional — resolves to nothing if components/pro/MegaNav.vue isn't
// installed. If nav.style is 'mega' but the premium package isn't
// there, fall back to the standard nav rather than breaking.
const proNavMatches = import.meta.glob('./components/pro/MegaNav.vue', { eager: true })
const ProMegaNav = Object.values(proNavMatches)[0]?.default || null

if (site.nav.style === 'mega' && !ProMegaNav) {
  console.warn(`[lodestar] nav.style is "mega" but lodestar-pro-modules isn't installed (components/pro/MegaNav.vue not found) — falling back to the standard nav`)
}

const navComponent = computed(() => (site.nav.style === 'mega' && ProMegaNav) ? ProMegaNav : AppNav)
</script>

<style>
/* Active theme tokens first, then structural base. Swap the theme in
   src/themes/active.css (or re-run `node setup.mjs`). */
@import './themes/active.css';
@import './themes/base.css';
</style>
