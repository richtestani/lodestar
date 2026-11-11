// ============================================================
// useBackgroundVideo — a muted, looping, decorative video behind a
// section (the hero's `video` prop). The section's image is the poster:
// it shows first, and stays if the video never plays.
//
// The video is skipped entirely (no element, nothing downloaded) when:
//   · the visitor has reduced motion turned on (OS accessibility setting)
//   · the browser asks to save data (Data Saver / Lite mode)
//   · it's a phone and the config says `mobile: false`
//   · the page is being prerendered — the build's headless browser would
//     otherwise bake the video into the static HTML, and the download
//     would start before any of the checks above could run
//
// Otherwise it loads after the page has finished loading (so it never
// competes with the poster, fonts or text), plays only while on screen,
// and the visitor can pause it (WCAG 2.2.2: motion longer than five
// seconds needs a pause control).
//
// Config, as the hero takes it:
//   video: 'loop.mp4'
//   video: { src: 'loop.mp4', mobile: 'loop-small.mp4', focus: 'center 30%' }
//   video: { sources: [{ src: 'loop.webm' }, { src: 'loop.mp4' }], mobile: false }
// ============================================================
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { media } from '@/composables/useAssets.js'
import { mimeFor } from './media.js'

export const PHONE_QUERY = '(max-width: 767px)'

export function normalizeVideo(video) {
  if (!video) return null
  const v = typeof video === 'string' ? { src: video } : { ...video }
  v.sources = (v.sources?.length ? v.sources : [{ src: v.src }]).filter((s) => s?.src)
  return v.sources.length ? v : null
}

export function useBackgroundVideo(videoConfig) {
  const config = computed(() => normalizeVideo(videoConfig()))
  const el = ref(null)
  const enabled = ref(false)  // the <video> element exists
  const playing = ref(false)  // first frame is up: fade it in, show the button
  const userPaused = ref(false)
  let onScreen = true
  let observer = null
  let idleHandle = null
  let chosenSources = []

  function shouldLoad(cfg) {
    if (!cfg || typeof window === 'undefined') return false
    if (navigator.webdriver) return false // build-time prerender (puppeteer)
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false
    if (navigator.connection?.saveData) return false
    const phone = window.matchMedia?.(PHONE_QUERY).matches
    if (phone && cfg.mobile === false) return false
    chosenSources = phone && typeof cfg.mobile === 'string' ? [{ src: cfg.mobile }] : cfg.sources
    return true
  }

  // First source this browser can play (webm before mp4 if both are given).
  function pickSource(video) {
    for (const s of chosenSources) {
      const type = s.type || mimeFor(s.src)
      if (!type || video.canPlayType(type)) return media(s.src)
    }
    return media(chosenSources[0].src)
  }

  function sync() {
    const v = el.value
    if (!v || !v.getAttribute('src')) return
    if (onScreen && !userPaused.value) v.play().catch(() => {}) // blocked (iOS Low Power): the poster stays
    else v.pause()
  }

  function start() {
    const v = el.value
    if (!v) return
    v.muted = true // must be set as a property too, or some browsers refuse to autoplay
    v.src = pickSource(v)
    observer?.disconnect()
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync() })
      observer.observe(v)
    }
    sync()
  }

  // after `load`, then when the browser is idle: never ahead of the poster
  function whenSettled(fn) {
    const idle = () => { idleHandle = window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: 2000 }) : setTimeout(fn, 200) }
    if (document.readyState === 'complete') idle()
    else window.addEventListener('load', idle, { once: true })
  }

  function toggle() {
    userPaused.value = !userPaused.value
    sync()
  }

  onMounted(async () => {
    if (!shouldLoad(config.value)) return
    enabled.value = true
    await nextTick()
    whenSettled(start)
  })

  // a hero whose config changes in place (dev hot reload): start over
  watch(config, () => { playing.value = false; if (el.value) start() })

  onBeforeUnmount(() => {
    observer?.disconnect()
    if (idleHandle != null) (window.cancelIdleCallback || clearTimeout)(idleHandle)
    const v = el.value
    if (v) { v.pause(); v.removeAttribute('src'); v.load() } // stop the download, free the decoder
  })

  return {
    el, enabled, playing, userPaused, toggle,
    focus: computed(() => config.value?.focus || 'center'),
  }
}
