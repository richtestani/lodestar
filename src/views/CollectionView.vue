<template>
  <main :class="{ 'mv-offset': !startsWithHero }">
    <SectionRenderer :sections="page.indexSections || []" :context="{ items: page.items || [], collectionSlug: page.slug }" />
  </main>
</template>

<script setup>
// The listing page of a 'collection'-view page (e.g. /shop) — an
// ordered list of modules, same mechanism as the home page, with the
// collection's `items` threaded into every module as a prop (a module
// only uses it if it declares a matching prop — see collectionGrid for
// the reference implementation).
import { computed } from 'vue'
import SectionRenderer from '@/components/SectionRenderer.vue'

const props = defineProps({ page: { type: Object, required: true } })

// A hero is designed to sit under the transparent fixed nav; anything else
// needs to be pushed below it so the nav doesn't overlap the first section.
const startsWithHero = computed(() => props.page.indexSections?.[0]?.module === 'hero')
</script>

<style scoped>
.mv-offset { padding-top: var(--nav-height); }
</style>
