<!--
  DocLayout — thin wrapper over RowLayout. Docs get their own component
  (rather than being an ordinary 'rows' page) because they need real
  route-driven logic: extracting headings from whatever doc is currently
  routed in, and refreshing that list on every route change. RowLayout
  itself stays generic and has no idea any of this is happening — it
  just renders whatever `rows` it's handed, same as any other page.

  No <main class="mv-offset"> here (unlike RowsPageView) — docs pages
  aren't nav-overlap candidates the way a marketing page's hero is.
-->
<template>
  <RowLayout :rows="rows" />
</template>

<script setup>
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { docsRegistry } from '@/docs/registry'
import RowLayout from './RowLayout.vue'

const route = useRoute()
const headings = ref([])

const navItems = docsRegistry.map((d) => ({ label: d.title, path: d.path }))

// regenerate the heading list any time the route (i.e. the doc page) changes
async function refreshHeadings() {
  await nextTick() // wait for router-view content to actually be in the DOM
  const els = document.querySelectorAll('.prose h2, .prose h3')
  headings.value = [...els].map((el) => ({
    id: el.id,
    text: el.textContent,
    depth: el.tagName,
  }))
}

onMounted(refreshHeadings)
watch(() => route.path, refreshHeadings)

// reactive — rebuilds whenever headings.value changes, so ScrollSpyNav
// gets fresh props without RowLayout needing to know why.
// Note the `module` key (not `type`) — matches SectionRenderer's
// existing convention, since RowLayout hands this straight through.
const rows = computed(() => [
  {
    preset: 'narrow',
    sticky: true,
    stickyColumn: 'first',
    columns: [
      {
        modules: [
          { module: 'pageNav', props: { items: navItems } },
          { module: 'scrollSpyNav', props: { headings: headings.value } },
        ],
      },
      {
        modules: [{ module: 'routerView' }],
      },
    ],
  },
])
</script>
