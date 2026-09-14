<template>
  <div class="two-col" :class="[`two-col--${stickySide}`, `two-col--${variant}`]">
    <aside
      class="two-col__sticky"
      :class="{ 'is-sticky': sticky }"
      :style="sticky && stickyOffset !== null ? { top: `${stickyOffset}px` } : {}"
    >
      <slot name="sticky" />
    </aside>
    <div class="two-col__main">
      <slot name="main" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  // which column is the sticky/side column
  stickySide: { type: String, default: 'right' }, // 'left' | 'right'
  // width ratio preset — keep this to a fixed set of variants rather than
  // allowing arbitrary per-page overrides, to keep layouts consistent
  variant: { type: String, default: 'even' }, // 'narrow' | 'even' | 'wide'
  // toggle sticky behavior off entirely (e.g. tall images, mobile stacking)
  sticky: { type: Boolean, default: true },
  // px offset from top when stuck; null = fall back to CSS var --sticky-top
  stickyOffset: { type: Number, default: null },
})
</script>

<style scoped>
.two-col {
  display: grid;
  gap: 2rem;
  align-items: start;
}

/* width ratio presets */
.two-col--narrow { grid-template-columns: 30% 1fr; }
.two-col--even   { grid-template-columns: 1fr 1fr; }
.two-col--wide   { grid-template-columns: 25% 1fr; }

/* flip column order when sticky column should render on the right */
.two-col--right { grid-template-columns: 1fr 30%; }
.two-col--right.two-col--even { grid-template-columns: 1fr 1fr; }
.two-col--right.two-col--wide { grid-template-columns: 1fr 25%; }
.two-col--right .two-col__sticky { order: 2; }
.two-col--right .two-col__main { order: 1; }

.two-col__sticky.is-sticky {
  position: sticky;
  top: var(--sticky-top, calc(var(--header-height, 72px) + 16px));
  align-self: start;
}

@media (max-width: 768px) {
  .two-col {
    grid-template-columns: 1fr !important;
  }
  .two-col__sticky.is-sticky {
    position: static;
  }
  .two-col--right .two-col__sticky,
  .two-col--right .two-col__main {
    order: initial;
  }
}
</style>
