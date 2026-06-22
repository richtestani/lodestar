<template>
  <AppNav />
  <RouterView />
  <AppFooter />
</template>

<script setup>
import AppNav    from '@/components/AppNav.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<style>
/* Active theme tokens first, then structural base. Swap the theme in
   src/themes/active.css (or re-run `node setup.mjs`). */
@import './themes/active.css';
@import './themes/base.css';
</style>
