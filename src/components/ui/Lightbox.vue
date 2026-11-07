<!--
  Lightbox — a full-screen overlay for viewing one image at a time.
  Used by GalleryModule (lightbox: true, the default); reusable anywhere
  that has a list of images.

    <Lightbox :images="images" v-model:index="openIndex" />

  `index` is the open image's position, or null when closed — set it to
  a number to open, the lightbox sets it back to null on close.

  Image shape (same as GalleryModule's `images`):
    { src, alt, caption?, full? }
  `full` is an optional larger file shown in the overlay while `src`
  stays the thumbnail; without it the overlay uses `src`.

  Controls: ← / → or swipe to move (wraps around), Esc / backdrop click /
  ✕ to close. Focus moves into the dialog on open, stays inside it while
  open, and returns to whatever opened it on close. Page scroll is locked
  while open. Neighbors are preloaded so next/prev feels instant.
  The overlay is always dark regardless of theme — photos read best on
  near-black — but buttons pick up the theme's fonts and --primary focus ring.
-->
<template>
  <Teleport to="body">
    <Transition name="lb">
      <div
        v-if="isOpen"
        ref="dialog"
        class="lb"
        role="dialog"
        aria-modal="true"
        :aria-label="label"
        @keydown="onKey"
        @click.self="close"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="startX = null"
      >
        <div class="lb-bar">
          <span v-if="images.length > 1" class="lb-count" aria-live="polite">{{ index + 1 }} / {{ images.length }}</span>
          <button ref="closeBtn" type="button" class="lb-btn lb-close" aria-label="Close" @click="close">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <figure class="lb-stage" @click.self="close">
          <Transition :name="dir === 1 ? 'lb-next' : 'lb-prev'" mode="out-in">
            <img
              :key="index"
              class="lb-img"
              :src="src(current.full || current.src)"
              :alt="current.alt || ''"
              draggable="false"
            />
          </Transition>
          <figcaption v-if="current.caption" class="lb-caption">{{ current.caption }}</figcaption>
        </figure>

        <template v-if="images.length > 1">
          <button type="button" class="lb-btn lb-nav lb-nav--prev" aria-label="Previous image" @click="go(-1)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <button type="button" class="lb-btn lb-nav lb-nav--next" aria-label="Next image" @click="go(1)">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { asset } from '@/composables/useAssets.js'

const props = defineProps({
  images: { type: Array, default: () => [] },
  index: { type: Number, default: null },
  label: { type: String, default: 'Image viewer' },
})
const emit = defineEmits(['update:index'])

const src = asset
const dialog = ref(null)
const closeBtn = ref(null)
const dir = ref(1)
let opener = null

const isOpen = computed(() => props.index != null && props.images.length > 0)
const current = computed(() => props.images[props.index] || {})

function close() { emit('update:index', null) }

function go(step) {
  const n = props.images.length
  if (n < 2) return
  dir.value = step > 0 ? 1 : -1
  emit('update:index', (props.index + step + n) % n)
}

// ── keyboard: arrows, Esc, and a Tab trap so focus can't wander behind the overlay ──
function onKey(e) {
  if (e.key === 'Escape') { e.preventDefault(); close() }
  else if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
  else if (e.key === 'Tab') {
    const btns = [...dialog.value.querySelectorAll('button')]
    const first = btns[0], last = btns[btns.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }
}

// ── swipe: a mostly-horizontal drag of 50px+ on touch/pen moves one image ──
const startX = ref(null)
let startY = 0
function onPointerDown(e) {
  if (e.pointerType === 'mouse') return
  startX.value = e.clientX; startY = e.clientY
}
function onPointerUp(e) {
  if (startX.value == null) return
  const dx = e.clientX - startX.value, dy = e.clientY - startY
  startX.value = null
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1)
}

// ── scroll lock that doesn't make the page jump sideways when the scrollbar vanishes ──
function lockScroll(on) {
  const el = document.documentElement
  if (on) {
    const gap = window.innerWidth - el.clientWidth
    el.style.overflow = 'hidden'
    if (gap > 0) el.style.paddingRight = gap + 'px'
  } else {
    el.style.overflow = ''
    el.style.paddingRight = ''
  }
}

function preload(i) {
  const img = props.images[(i + props.images.length) % props.images.length]
  if (img) new Image().src = src(img.full || img.src)
}

watch(isOpen, async (open) => {
  if (typeof document === 'undefined') return
  if (open) {
    opener = document.activeElement
    lockScroll(true)
    await nextTick()
    closeBtn.value?.focus()
  } else {
    lockScroll(false)
    opener?.focus?.({ preventScroll: true })
    opener = null
  }
})

watch(() => props.index, (i) => {
  if (i == null) return
  preload(i + 1); preload(i - 1)
}, { immediate: true })

// Navigating away (router link, back button) with the overlay open
onBeforeUnmount(() => { if (isOpen.value) lockScroll(false) })
</script>

<style scoped>
.lb {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(8, 8, 8, 0.97);
  touch-action: pan-y;
  -webkit-user-select: none; user-select: none;
}

.lb-stage {
  position: absolute; inset: 0; margin: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 4.5rem clamp(1rem, 7vw, 6rem) 2rem;
  box-sizing: border-box;
}
.lb-img {
  max-width: 100%; max-height: 100%; min-height: 0;
  object-fit: contain; display: block;
  border-radius: calc(var(--radius) * 0.5);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
.lb-caption {
  margin-top: 1rem; max-width: 60ch; text-align: center;
  color: rgba(255, 255, 255, 0.85); font-family: var(--font-body); font-size: 0.95rem; line-height: 1.5;
}

.lb-bar {
  position: absolute; top: 0; left: 0; right: 0;
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem; pointer-events: none;
}
.lb-bar > * { pointer-events: auto; }
.lb-count {
  color: rgba(255, 255, 255, 0.7); font-family: var(--font-body);
  font-size: 0.85rem; letter-spacing: 0.08em; font-variant-numeric: tabular-nums;
}

.lb-btn {
  display: grid; place-items: center;
  width: 44px; height: 44px; padding: 0;
  border: 0; border-radius: 999px; cursor: pointer;
  background: rgba(255, 255, 255, 0.08); color: #fff;
  transition: background 0.2s ease;
}
.lb-btn:hover { background: rgba(255, 255, 255, 0.18); }
.lb-btn:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.lb-btn svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.lb-close { margin-left: auto; }

.lb-nav { position: absolute; top: 50%; transform: translateY(-50%); }
.lb-nav--prev { left: clamp(0.5rem, 2vw, 1.5rem); }
.lb-nav--next { right: clamp(0.5rem, 2vw, 1.5rem); }
@media (max-width: 600px) {
  /* swipe is the main control on phones — keep the arrows small and out of the photo */
  .lb-nav { top: auto; bottom: 1rem; transform: none; width: 40px; height: 40px; }
  .lb-stage { padding: 4rem 0.75rem 4.5rem; }
}

/* overlay fade */
.lb-enter-active, .lb-leave-active { transition: opacity 0.25s ease; }
.lb-enter-from, .lb-leave-to { opacity: 0; }

/* image change: short slide in the direction of travel */
.lb-next-enter-active, .lb-next-leave-active,
.lb-prev-enter-active, .lb-prev-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.lb-next-enter-from, .lb-prev-leave-to { opacity: 0; transform: translateX(24px); }
.lb-next-leave-to, .lb-prev-enter-from { opacity: 0; transform: translateX(-24px); }

@media (prefers-reduced-motion: reduce) {
  .lb-enter-active, .lb-leave-active,
  .lb-next-enter-active, .lb-next-leave-active,
  .lb-prev-enter-active, .lb-prev-leave-active { transition: none; }
}
</style>
