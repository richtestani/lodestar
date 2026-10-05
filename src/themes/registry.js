// ============================================================
// themes/registry.js — metadata for the built-in themes.
//
// The theme itself is just tokens in src/themes/<name>.css (see
// _tokens.css for the contract). This file holds what CSS can't:
// the Google Fonts <link> each theme needs, its one-line pitch, the
// home sections setup.mjs suggests for it, and plain-English names for
// its main colors (setup shows these next to the hex values it reads
// from the .css file, so the hex can't drift out of sync).
//
// Read by setup.mjs and by scripts/vite-plugin-theme.mjs (which
// injects `fonts` into index.html for whichever theme config/site.js
// names). Plain ESM with no imports, so plain Node can load it.
//
// Adding your own theme: drop src/themes/<name>.css next to the
// others, set `theme: '<name>'` in config/site.js, and add an entry
// here if it needs different fonts. A theme with no entry here still
// works; it just keeps whatever fonts are in index.html.
// ============================================================

export const THEMES = {
  north: {
    colors: { bg: 'cool paper white', text: 'near-black', 'surface-2': 'charcoal', primary: 'cobalt blue', 'primary-2': 'deep cobalt' },
    label: 'simple & modular, works for anything (clean light, cobalt accent)',
    fonts: 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Space+Mono:wght@400;700&display=swap',
    recommended: ['hero', 'features', 'stats', 'gallery', 'testimonials', 'faq', 'cta'],
  },
  fresh: {
    colors: { bg: 'white', text: 'dark navy', 'surface-2': 'deep navy', primary: 'medium blue', 'primary-2': 'dark steel blue' },
    label: 'service / trades / professional (light + blue)',
    fonts: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lora:ital@0;1&display=swap',
    recommended: ['hero', 'features', 'stats', 'testimonials', 'faq', 'map', 'cta'],
  },
  pulse: {
    colors: { bg: 'near-black slate', text: 'pale blue-white', 'surface-2': 'midnight navy', primary: 'indigo', 'primary-2': 'cyan' },
    label: 'tech / SaaS / startup (deep slate + indigo)',
    fonts: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap',
    recommended: ['hero', 'features', 'stats', 'pricing', 'testimonials', 'faq', 'cta'],
  },
  harvest: {
    colors: { bg: 'warm cream', text: 'espresso brown', 'surface-2': 'espresso brown', primary: 'terracotta orange', 'primary-2': 'deep rust' },
    label: 'food / restaurant / cafe (warm + serif)',
    fonts: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Karla:wght@300;400;500;600;700&display=swap',
    recommended: ['hero', 'features', 'menu', 'gallery', 'testimonials', 'map', 'cta'],
  },
}

export const DEFAULT_THEME = 'north'
