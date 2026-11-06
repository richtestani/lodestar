// ============================================================
// config/motion.js — section motion (lodestar-pro-modules).
// Does nothing unless lodestar-pro-modules is installed
// (components/pro/SectionMotion.vue). Even then, nothing animates
// until `enabled: true` — installing the package never changes a
// site on its own.
//
// Per section, in homeSections / a page's sections:
//   motion: false                                 → this section doesn't animate
//   motion: { effect: 'fade', stagger: true }     → override any setting below
//   motion: { fullHeight: false }                 → opt one section out of full height
// Modules inside a RowLayout column are never wrapped.
// ============================================================
export const motion = {
  // Reveal each section as it scrolls into view. The first screen
  // always shows immediately; reduced-motion users get no animation.
  enabled: false,

  // 'rise' | 'fade' | 'scale' | 'slide'
  effect: 'rise',

  // Separate from `enabled`: every section at least one screen tall.
  // Uses min-height, so long sections (pricing, FAQ) still grow.
  fullHeight: false,

  // Modules whose repeating items cascade in one after another, instead
  // of the whole section moving at once. `true` = every module that has
  // an item selector. Built in for: features, stats, testimonials,
  // gallery, pricing, team, faq, menu, collectionGrid.
  stagger: [],

  // Item selectors for your own modules (or to override a built-in), e.g.
  //   staggerSelectors: { logos: '.logo' },
  staggerSelectors: {},

  // Timing — rarely worth touching.
  duration: 750,     // ms per element
  distance: 36,      // px travelled by 'rise' / 'slide'
  staggerDelay: 90,  // ms between items in a staggered section
}
