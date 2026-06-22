<template>
  <nav
    id="main-nav"
    :class="[`nav--${style}`, { 'is-sticky': sticky, 'is-open': menuOpen }]"
  >
    <RouterLink to="/" class="nav-logo" @click="close">
      <img v-if="logoImage" :src="asset(logoImage)" :alt="brand.name" class="nav-logo-img" />
      <span v-else>{{ brand.logoText || brand.name }}</span>
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
        <RouterLink :to="link.to" class="nav-link" @click="close">{{ link.label }}</RouterLink>
      </li>
    </ul>

    <div class="nav-scrim" :class="{ visible: menuOpen }" @click="close"></div>
  </nav>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { site } from '@/site.config.js'
import { asset } from '@/composables/useAssets.js'

const brand     = site.brand
const logoImage = brand.logoImage
const style     = site.nav.style || 'classic'
const sticky    = site.nav.sticky !== false

const links = computed(() =>
  site.nav.links ||
  site.pages.map(p => ({ label: p.name, to: '/' + p.slug }))
)

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
  background: color-mix(in srgb, var(--bg) 94%, transparent);
  border-bottom: 1px solid var(--border);
}
#main-nav.is-sticky { position: fixed; }

.nav-logo { font-family: var(--font-display); font-size: 1.15rem; font-weight: 600; letter-spacing: 0.12em; color: var(--primary); flex-shrink: 0; }
.nav-logo-img { height: 34px; width: auto; }

.nav-links { display: flex; align-items: center; gap: 0.25rem; list-style: none; }
.nav-link {
  display: block; padding: 0 1.2rem; height: var(--nav-height); line-height: var(--nav-height);
  font-family: var(--font-body); font-weight: 600; font-size: 0.72rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--text);
  opacity: 0.78; transition: opacity 0.2s, color 0.2s; white-space: nowrap;
}
.nav-link:hover, .nav-link.router-link-exact-active { opacity: 1; color: var(--primary); }

/* CENTERED: logo absolutely centered, links pushed right */
.nav--centered .nav-logo { position: absolute; left: 50%; transform: translateX(-50%); }
.nav--centered { justify-content: flex-end; }

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

@media (max-width: 768px) {
  .nav-burger { display: flex; }
  .nav--centered .nav-logo { position: static; transform: none; }
  .nav-links {
    position: fixed; top: 0; right: 0; width: min(340px, 86vw); height: 100dvh;
    flex-direction: column; align-items: stretch; gap: 0;
    background: var(--bg); border-left: 1px solid var(--border);
    padding-top: calc(var(--nav-height) + 0.5rem);
    transform: translateX(100%); transition: transform 0.3s ease; z-index: 300; overflow-y: auto;
  }
  .nav-links.open { transform: translateX(0); }
  .nav-link { width: 100%; height: auto; line-height: 1; padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); }
}
</style>
