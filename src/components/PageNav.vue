<template>
  <nav class="page-nav">
    <router-link
      v-for="item in items"
      :key="item.path"
      :to="item.path"
      class="page-nav__link"
      active-class="page-nav__link--active"
    >
      {{ item.label }}
    </router-link>
  </nav>
</template>

<script setup>
defineProps({
  // [{ label: 'Requirements', path: '/docs/requirements' }, ...]
  items: { type: Array, required: true },
})
</script>

<style scoped>
.page-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--border-color, #e2e2e2);
}

.page-nav__link {
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-muted, #555);
  text-decoration: none;
  transition: background 0.15s ease, color 0.15s ease;
}

.page-nav__link:hover {
  background: var(--surface-hover, #f2f2f2);
  color: var(--text, #111);
}

.page-nav__link--active {
  background: var(--accent-soft, #eef4ff);
  color: var(--accent, #2563eb);
}
</style>
