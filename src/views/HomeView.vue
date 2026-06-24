<template>
  <main>
    <SectionRenderer :sections="site.homeSections || []" />
  </main>
</template>

<script setup>
import { site } from '@/site.config.js'
import SectionRenderer from '@/components/SectionRenderer.vue'
</script>
