<template>
  <footer id="app-footer" :class="`footer--${style}`">
    <div class="container">

      <div v-if="style === 'columns'" class="footer-grid">
        <div class="footer-brand">
          <RouterLink to="/" class="footer-logo">{{ brand.logoText || brand.name }}</RouterLink>
          <p v-if="footer.blurb" class="footer-blurb">{{ footer.blurb }}</p>
          <ul v-if="social.length" class="footer-social">
            <li v-for="s in social" :key="s.label">
              <a :href="s.url" target="_blank" rel="noopener">{{ s.label }}</a>
            </li>
          </ul>
        </div>

        <div v-for="(col, i) in footer.columns" :key="i" class="footer-col">
          <h3 class="footer-heading">{{ col.heading }}</h3>
          <ul>
            <li v-for="link in col.links" :key="link.to">
              <RouterLink :to="link.to" class="footer-link">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h3 class="footer-heading">Contact</h3>
          <ul class="footer-contact">
            <li v-if="contact.email"><a :href="`mailto:${contact.email}`" class="footer-link">{{ contact.email }}</a></li>
            <li v-if="contact.phone"><a :href="`tel:${contact.phone}`" class="footer-link">{{ contact.phone }}</a></li>
            <li v-if="contact.address" class="footer-addr">{{ contact.address }}</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>{{ legal }}</p>
        <p v-if="footer.fineprint" class="footer-fine">{{ footer.fineprint }}</p>
      </div>

    </div>
  </footer>
</template>

<script setup>
import { site } from '@/site.config.js'
const brand   = site.brand
const footer  = site.footer
const contact = site.contact
const social  = site.social || []
const style   = footer.style || 'columns'
const legal   = (footer.legal || '© {year}').replace('{year}', new Date().getFullYear())
</script>

<style scoped>
#app-footer { background: var(--surface-2); color: var(--bg); border-top: 1px solid var(--border); padding-block: clamp(2.5rem, 6vw, 4rem) 2rem; }
/* surface-2 is a dark panel in light themes and a deep panel in dark themes;
   pull text/links from a readable contrast against it. */
#app-footer, #app-footer a { color: color-mix(in srgb, var(--bg) 88%, var(--text)); }

.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 2.5rem; margin-bottom: 2.5rem; }
.footer-logo { font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; letter-spacing: 0.12em; color: var(--primary); display: inline-block; margin-bottom: 0.9rem; }
.footer-blurb { font-family: var(--font-accent); font-size: 1rem; line-height: 1.7; max-width: 38ch; opacity: 0.8; }
.footer-social { list-style: none; display: flex; gap: 1rem; margin-top: 1.1rem; }
.footer-social a { font-size: 0.72rem; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.75; }
.footer-social a:hover { color: var(--primary); opacity: 1; }

.footer-heading { font-family: var(--font-body); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--primary); opacity: 0.85; margin-bottom: 1rem; }
.footer-col ul { list-style: none; display: flex; flex-direction: column; gap: 0.55rem; }
.footer-link { font-size: 0.82rem; opacity: 0.75; transition: opacity 0.15s, color 0.15s; }
.footer-link:hover { opacity: 1; color: var(--primary); }
.footer-addr { font-size: 0.82rem; opacity: 0.6; line-height: 1.5; }

.footer-bottom { border-top: 1px solid color-mix(in srgb, var(--primary) 18%, transparent); padding-top: 1.5rem; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
.footer-bottom p { font-size: 0.68rem; opacity: 0.5; letter-spacing: 0.04em; }

.footer--minimal { text-align: center; }
.footer--minimal .footer-bottom { justify-content: center; border-top: none; padding-top: 0; }

@media (max-width: 768px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .footer-brand { grid-column: 1 / -1; }
  .footer-bottom { flex-direction: column; align-items: center; text-align: center; }
}
</style>
