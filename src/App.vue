<template>
  <div v-if="showFallbackNotice" class="lodestar-dev-notice">
    ⚠ nav.style is "mega" but lodestar-pro-modules isn't installed (src/components/pro/MegaNav.vue not found) — showing the standard nav instead. This banner only shows in dev; <code>npm run build</code> fails outright instead.
  </div>
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

const showFallbackNotice = import.meta.env.DEV && site.nav.style === 'mega' && !ProMegaNav
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

.lodestar-dev-notice {
  position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
  background: #b91c1c; color: #fff; font: 600 12.5px/1.5 system-ui, sans-serif;
  padding: 0.5rem 1rem; text-align: center;
}
.lodestar-dev-notice code { background: rgba(255,255,255,0.18); padding: 0.05rem 0.35rem; border-radius: 3px; }
</style>
