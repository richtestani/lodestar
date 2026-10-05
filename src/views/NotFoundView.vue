<!--
  NotFoundView — shown for any URL that doesn't match a page, and saved
  as public/404.html by the build (scripts/prerender.mjs) so the server
  can return it with a real 404 status (see deploy/).

  Styled only with theme tokens, so it follows whichever theme is set in
  config/site.js. Wording comes from `notFound` in config/site.js; the
  "try one of these" links are the same top-level pages the nav shows.
-->
<template>
  <main class="nf">
    <section class="section">
      <div class="container nf-wrap">
        <p class="nf-code" aria-hidden="true">404</p>
        <p v-if="content.eyebrow" class="eyebrow">{{ content.eyebrow }}</p>
        <hr class="rule is-center" />
        <h1 class="h-title nf-title">{{ content.title }}</h1>
        <p v-if="content.text" class="nf-text">{{ content.text }}</p>
        <RouterLink v-if="content.cta" :to="content.cta.to" class="btn">{{ content.cta.label }}</RouterLink>

        <nav v-if="links.length" class="nf-links" aria-label="Suggested pages">
          <p class="nf-links-label">Or try one of these</p>
          <ul>
            <li v-for="link in links" :key="link.to">
              <RouterLink :to="link.to" class="nf-link">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { site } from '@/site.config.js'

// Defaults keep sites made before `notFound` existed working unchanged
const DEFAULTS = {
  eyebrow: 'Page not found',
  title: "We couldn't find that page.",
  text: 'The link may be out of date, or the address may have a typo.',
  cta: { label: 'Back to home', to: '/' },
}
const content = computed(() => ({ ...DEFAULTS, ...(site.notFound || {}) }))

// Same top-level pages the nav shows, minus home (the button covers it)
const links = computed(() =>
  (site.nav?.links || site.pages.filter(p => p.showInNav !== false).map(p => ({ label: p.name, to: '/' + p.slug })))
    .filter(l => l.to && l.to !== '/' && !/^https?:/.test(l.to))
    .slice(0, 6)
)
</script>

<style scoped>
.nf { padding-top: var(--nav-height); min-height: 70vh; display: flex; align-items: center; }
.nf .section { width: 100%; }
.nf-wrap { max-width: 640px; text-align: center; }
.nf-code {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(5rem, 18vw, 9.5rem);
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: var(--primary);
  margin-bottom: 1.25rem;
}
.nf-title { margin-bottom: 1rem; }
.nf-text { font-family: var(--font-accent); font-size: 1.1rem; line-height: 1.7; color: var(--text-muted); margin: 0 auto 2rem; max-width: 46ch; }
.nf-links { margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border); }
.nf-links-label { font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 1rem; }
.nf-links ul { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 0.6rem; }
.nf-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--text);
  text-decoration: none;
  transition: border-color 0.15s, color 0.15s;
}
.nf-link:hover { border-color: var(--primary); color: var(--primary); }
</style>
