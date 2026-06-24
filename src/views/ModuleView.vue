<template>
  <main :class="{ 'mv-offset': !startsWithHero }">
    <SectionRenderer :sections="sections" />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import SectionRenderer from '@/components/SectionRenderer.vue'

const props = defineProps({ sections: { type: Array, default: () => [] } })

// A hero is designed to sit under the transparent fixed nav; anything else
// needs to be pushed below it so the nav doesn't overlap the first section.
const startsWithHero = computed(() => props.sections[0]?.module === 'hero')
</script>

<style scoped>
.mv-offset { padding-top: var(--nav-height); }
</style>
