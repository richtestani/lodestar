<template>
  <main v-if="item" :class="{ 'mv-offset': !startsWithHero }">
    <SectionRenderer :sections="page.itemSections || []" :context="{ item, collectionSlug: page.slug, collectionName: page.name }" />
  </main>
</template>

<script setup>
// The detail page of one item in a 'collection'-view page (e.g.
// /shop/sofa) — same module-list mechanism as the collection index,
// with the single matched `item` threaded into every module as a prop
// (see itemHero/itemDetail for reference implementations).
//
// itemSlug isn't found in page.items → redirect to the collection index
// rather than render a broken page. Watched (not a one-time check) so
// navigating directly between sibling items (which Vue Router reuses
// this component instance for) re-validates each time.
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import SectionRenderer from '@/components/SectionRenderer.vue'

const props = defineProps({
  page: { type: Object, required: true },
  itemSlug: { type: String, required: true },
})

const router = useRouter()
const item = computed(() => (props.page.items || []).find(i => i.slug === props.itemSlug))
const startsWithHero = computed(() => props.page.itemSections?.[0]?.module === 'itemHero')

watch(item, val => { if (!val) router.replace('/' + props.page.slug) }, { immediate: true })
</script>

<style scoped>
.mv-offset { padding-top: var(--nav-height); }
</style>
