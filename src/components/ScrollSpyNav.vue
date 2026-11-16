<template>
  <nav v-if="headings.length" class="scrollspy-nav">
    <a
      v-for="h in headings"
      :key="h.id"
      :href="`#${h.id}`"
      :class="['scrollspy-nav__link', `depth-${h.depth}`, { 'is-active': h.id === activeId }]"
    >
      {{ h.text }}
    </a>
  </nav>
</template>

<script setup>
import { useScrollSpy } from '@/composables/useScrollSpy.js'

const props = defineProps({
  // [{ id: 'browser-support', text: 'Browser Support', depth: 'H2' }, ...]
  headings: { type: Array, default: () => [] },
})

// keepLast: headings are short, so the last one passed stays highlighted
// until the next one arrives, instead of flickering off between them.
const { activeId } = useScrollSpy(() => props.headings.map((h) => h.id), { keepLast: true })
</script>

<style scoped>
.scrollspy-nav {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.85rem;
}

.scrollspy-nav__link {
  padding: 0.3rem 0.6rem;
  border-left: 2px solid transparent;
  color: var(--text-muted, #777);
  text-decoration: none;
  transition: border-color 0.15s ease, color 0.15s ease;
}

.scrollspy-nav__link.depth-H3 {
  padding-left: 1.2rem; /* indent subheadings under their h2 */
}

.scrollspy-nav__link:hover {
  color: var(--text, #111);
}

.scrollspy-nav__link.is-active {
  border-left-color: var(--accent, #2563eb);
  color: var(--accent, #2563eb);
  font-weight: 600;
}
</style>
