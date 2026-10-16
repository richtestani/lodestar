<template>
  <nav
    id="main-nav"
    :class="[`nav--${style}`, `logo--${logoDisplay}`, {
      'is-sticky': sticky, 'is-open': menuOpen, 'is-scrolled': scrolled,
      'logo--shrinks': shrinks,
    }]"
    :style="navStyleVars"
  >
    <RouterLink to="/" class="nav-logo" :class="{ 'has-image': logoImage }" :aria-label="logoImage && !logo.withText ? brand.name : undefined" @click="close">
      <img v-if="logoImage" :src="asset(logoImage)" :alt="logo.withText ? '' : brand.name" class="nav-logo-img" />
      <span v-if="!logoImage || logo.withText" class="nav-logo-text">{{ brand.logoText || brand.name }}</span>
    </RouterLink>

    <button
      class="nav-burger"
      :class="{ open: menuOpen }"
      :aria-expanded="menuOpen"
      aria-label="Toggle menu"
      @click="toggle"
    ><span></span><span></span><span></span></button>

    <ul class="nav-links" :class="{ open: menuOpen }">
      <li v-for="link in links" :key="link.to">
        <RouterLink :to="link.to" class="nav-link" @click="close">
          <span class="nav-link-content" :class="{ 'icon-right': iconPosition === 'right' }">
            <img v-if="link.icon" :src="asset(link.icon)" class="nav-link-icon" alt="" />
            <span>{{ link.label }}</span>
          </span>
        </RouterLink>
      </li>
      <li v-if="cta" class="nav-cta-item">
        <RouterLink :to="cta.to" class="btn nav-cta" @click="close">{{ cta.label }}</RouterLink>
      </li>
    </ul>

    <div class="nav-scrim" :class="{ visible: menuOpen }" @click="close"></div>
  </nav>
</template>

<script setup>
// classic | centered | minimal. For a nested/dropdown mega nav, see
// lodestar-pro-modules' MegaNav.vue (set nav.style: 'mega') — this
// component only ever renders flat top-level links.
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { site } from '@/site.config.js'
import { asset } from '@/composables/useAssets.js'

const brand     = site.brand
const logoImage = brand.logoImage
const style     = site.nav.style || 'classic'
const sticky    = site.nav.sticky !== false
const iconPosition = site.nav.iconPosition || 'left'
// Optional button at the end of the links ({ label, to }) — e.g. "Get started"
const cta = site.nav.cta?.label && site.nav.cta?.to ? site.nav.cta : null

// Logo image layout — see the `logo` block in config/nav.js. Only applies
// when brand.logoImage is set; a text logo always sits inline.
const LOGO_DISPLAYS = ['inline', 'overhang', 'tab']
const logo = site.nav.logo || {}
const logoDisplay = logoImage && LOGO_DISPLAYS.includes(logo.display) ? logo.display : 'inline'
if (import.meta.env.DEV && logo.display && !LOGO_DISPLAYS.includes(logo.display)) {
  console.warn(`[lodestar] nav.logo.display "${logo.display}" isn't one of ${LOGO_DISPLAYS.join(', ')}, using inline`)
}
const logoHeight = logo.height || (logoDisplay === 'inline' ? 36 : 96)
const logoMobileHeight = logo.mobileHeight || (logoDisplay === 'inline' ? Math.min(logoHeight, 32) : Math.round(logoHeight * 0.65))
// Overhanging logos tuck back into the bar once the page scrolls (sticky nav only)
const shrinks = logoDisplay !== 'inline' && sticky && logo.shrinkOnScroll !== false

const scrolled = ref(false)
const onScroll = () => { scrolled.value = window.scrollY > 24 }
onMounted(() => { if (shrinks) { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }) } })
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const links = computed(() =>
  site.nav.links ||
  site.pages.filter(p => p.showInNav !== false).map(p => ({ label: p.name, to: '/' + p.slug }))
)

// hoverBg / hoverText / bgImage are all optional — CSS falls back to the
// theme's own colors/transparent background when unset.
const navStyleVars = computed(() => {
  const v = { '--logo-h': `${logoHeight}px`, '--logo-h-mobile': `${logoMobileHeight}px` }
  if (site.nav.hoverBg)   v['--nav-hover-bg']   = site.nav.hoverBg
  if (site.nav.hoverText) v['--nav-hover-text'] = site.nav.hoverText
  if (site.nav.bgImage)   v['--nav-bg-image']   = `url(${asset(site.nav.bgImage)})`
  return v
})

const menuOpen = ref(false)
function open()  { menuOpen.value = true;  document.body.style.overflow = 'hidden' }
function close() { menuOpen.value = false; document.body.style.overflow = '' }
function toggle(){ menuOpen.value ? close() : open() }
onUnmounted(() => { document.body.style.overflow = '' })
</script>

<style scoped>
#main-nav {
  position: absolute; top: 0; left: 0; right: 0; z-index: 300;
  height: var(--nav-height);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 clamp(1.25rem, 4vw, 3rem);
  background-image: linear-gradient(color-mix(in srgb, var(--bg) 94%, transparent), color-mix(in srgb, var(--bg) 94%, transparent)), var(--nav-bg-image, none);
  background-size: cover; background-position: center; background-repeat: no-repeat;
  border-bottom: 1px solid var(--border);
}
#main-nav.is-sticky { position: fixed; }

.nav-logo {
  display: inline-flex; align-items: center; gap: 0.7rem; flex-shrink: 0; position: relative; z-index: 2;
  font-family: var(--font-display); font-size: 1.15rem; font-weight: var(--logo-weight, 600); letter-spacing: var(--logo-tracking, 0.12em); color: var(--logo-color, var(--primary));
}
.nav-logo-img { display: block; width: auto; max-width: 260px; object-fit: contain; transition: height 0.25s ease; }

/* ── Logo layouts (nav.logo.display) ────────────────────────
   inline   — fits inside the bar
   overhang — taller than the bar, hangs past its bottom edge
   tab      — overhang on a backing plate hung from the top edge   */
.logo--inline .nav-logo-img { height: min(var(--logo-h), calc(var(--nav-height) - 18px)); }

.logo--overhang .nav-logo,
.logo--tab .nav-logo { align-self: flex-start; transition: padding 0.25s ease, margin 0.25s ease, box-shadow 0.25s ease; }
.logo--overhang .nav-logo { margin-top: 12px; }
.logo--overhang .nav-logo-img,
.logo--tab .nav-logo-img { height: var(--logo-h); }
.logo--overhang .nav-logo-img { filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.18)); }

.logo--tab .nav-logo {
  padding: 14px 18px 16px;
  background: var(--surface);
  border: 1px solid var(--border); border-top: 0;
  border-radius: 0 0 var(--radius) var(--radius);
  box-shadow: var(--shadow-lg);
}

/* Shrink on scroll: settle back inside the bar */
.logo--shrinks.is-scrolled .nav-logo { align-self: center; margin-top: 0; }
.logo--shrinks.is-scrolled .nav-logo-img { height: calc(var(--nav-height) - 20px); filter: none; }
.logo--tab.logo--shrinks.is-scrolled .nav-logo { padding-block: 0; background: transparent; border-color: transparent; box-shadow: none; }

.nav-links { display: flex; align-items: center; gap: 0.25rem; list-style: none; }
.nav-link {
  display: block; padding: 0 1.2rem; height: var(--nav-height); line-height: var(--nav-height);
  font-family: var(--font-body); font-weight: var(--nav-link-weight, 600); font-size: var(--nav-link-size, 0.72rem);
  letter-spacing: var(--nav-link-tracking, 0.14em); text-transform: var(--nav-link-case, uppercase); color: var(--text);
  opacity: 0.78; transition: opacity 0.2s, color 0.2s, background 0.2s; white-space: nowrap;
}
.nav-link:hover, .nav-link.router-link-exact-active {
  opacity: 1; color: var(--nav-hover-text, var(--primary)); background: var(--nav-hover-bg, transparent);
}

.nav-cta-item { margin-left: 0.75rem; display: flex; align-items: center; }
.nav-cta { padding: 0.6rem 1.2rem; white-space: nowrap; }

.nav-link-content { display: inline-flex; align-items: center; gap: 0.5em; }
.nav-link-content.icon-right { flex-direction: row-reverse; }
.nav-link-icon { width: 1.05em; height: 1.05em; object-fit: contain; flex-shrink: 0; }

/* CENTERED: logo absolutely centered, links pushed right */
.nav--centered .nav-logo { position: absolute; left: 50%; transform: translateX(-50%); }
#main-nav.nav--centered { justify-content: flex-end; } /* #id beats the base rule */
.nav--centered.logo--tab .nav-logo { top: 0; }
.nav--centered.logo--overhang .nav-logo { top: 0; }
.nav--centered.logo--shrinks.is-scrolled .nav-logo { top: 50%; transform: translate(-50%, -50%); }

/* MINIMAL: burger shows on desktop too, links become the drawer */
.nav--minimal .nav-links { position: fixed; }
.nav--minimal .nav-burger { display: flex; }

/* Burger */
.nav-burger {
  display: none; flex-direction: column; justify-content: center; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 8px; z-index: 320;
}
.nav-burger span { display: block; width: 22px; height: 2px; background: var(--primary); transition: transform 0.25s, opacity 0.25s; }
.nav-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav-burger.open span:nth-child(2) { opacity: 0; }
.nav-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.nav-scrim { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 290; }
.nav-scrim.visible { display: block; }

/* Drawer for minimal style + all mobile */
.nav--minimal .nav-links {
  top: 0; right: 0; width: min(340px, 86vw); height: 100dvh;
  flex-direction: column; align-items: stretch; gap: 0;
  background: var(--bg); border-left: 1px solid var(--border);
  padding-top: calc(var(--nav-height) + 0.5rem);
  transform: translateX(100%); transition: transform 0.3s ease; z-index: 300;
}
.nav--minimal .nav-links.open { transform: translateX(0); }
.nav--minimal .nav-link { width: 100%; height: auto; line-height: 1; padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); }
.nav--minimal .nav-cta-item { margin: 1.25rem 1.5rem 0; }
.nav--minimal .nav-cta { width: 100%; text-align: center; }

@media (max-width: 768px) {
  .nav-burger { display: flex; }
  .nav--centered .nav-logo { position: static; transform: none; }
  .logo--inline .nav-logo-img { height: min(var(--logo-h-mobile), calc(var(--nav-height) - 18px)); }
  .logo--overhang .nav-logo-img,
  .logo--tab .nav-logo-img { height: var(--logo-h-mobile); }
  .logo--tab .nav-logo { padding: 10px 12px 12px; }
  .logo--overhang .nav-logo { margin-top: 10px; }
  .nav-logo-text { font-size: 1rem; }
  .nav-links {
    position: fixed; top: 0; right: 0; width: min(340px, 86vw); height: 100dvh;
    flex-direction: column; align-items: stretch; gap: 0;
    background: var(--bg); border-left: 1px solid var(--border);
    padding-top: calc(var(--nav-height) + 0.5rem);
    transform: translateX(100%); transition: transform 0.3s ease; z-index: 300; overflow-y: auto;
  }
  .nav-links.open { transform: translateX(0); }
  .nav-link { width: 100%; height: auto; line-height: 1; padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); }
  .nav-cta-item { margin: 1.25rem 1.5rem 0; }
  .nav-cta { width: 100%; text-align: center; }
}
</style>
