<!--
  PageImage — one image (or a strip of them) in a prose page.
  Config shape and presets: see components/prose/layouts.js and
  README → Pages → Images in prose pages.

  Cropping: every layout has a default aspect ratio and the photo fills
  it with object-fit: cover, so the edges get trimmed. `focus` moves the
  crop (object-position: 'top', 'left', '50% 20%' …) and `ratio` swaps
  the shape ('3/2', '1', 'natural' for no crop at all).
-->
<template>
  <div v-if="layout === 'strip'" class="pimg-strip" :style="{ '--pimg-cols': Math.min(items.length, 4), '--pimg-cols-sm': items.length === 3 ? 3 : 2 }">
    <figure v-for="(it, i) in items" :key="it.src + i" class="pimg pimg--strip">
      <img v-bind="imgAttrs(it)" :style="cropStyle(it)" />
      <figcaption v-if="it.caption">{{ it.caption }}</figcaption>
    </figure>
  </div>
  <figure v-else class="pimg" :class="[`pimg--${layout}`, sizeClass, { 'pimg--default-ratio': !image.ratio }]">
    <img v-bind="imgAttrs(image)" :style="cropStyle(image)" />
    <figcaption v-if="image.caption">{{ image.caption }}</figcaption>
  </figure>
</template>

<script setup>
import { computed } from 'vue'
import { asset, srcset } from '../../composables/useAssets.js'
import { IMAGE_LAYOUTS } from './layouts.js'

const props = defineProps({
  image: { type: Object, required: true },
  eager: { type: Boolean, default: false }, // the page's lead image: load first, it's the LCP
})

const layout = computed(() => (IMAGE_LAYOUTS[props.image.layout] ? props.image.layout : 'banner'))
const size = computed(() => props.image.size || 'md')
const ratio = computed(() => String(props.image.ratio || IMAGE_LAYOUTS[layout.value].ratio))
const items = computed(() => props.image.items || [])
// size only means something for images that sit beside the text
const SIZED = ['float-left', 'float-right', 'portrait']
const sizeClass = computed(() => (SIZED.includes(layout.value) ? `pimg--${size.value}` : ''))

function cropStyle(it) {
  const r = String(it.ratio || ratio.value)
  return {
    aspectRatio: r === 'natural' ? 'auto' : r.replace('/', ' / '),
    objectFit: r === 'natural' ? 'contain' : 'cover',
    objectPosition: it.focus || props.image.focus || 'center',
  }
}

function imgAttrs(it) {
  const set = srcset(it.src)
  return {
    src: asset(it.src),
    srcset: set || undefined,
    sizes: set ? IMAGE_LAYOUTS[layout.value].sizes(size.value) : undefined,
    alt: it.alt || '',
    loading: props.eager ? 'eager' : 'lazy',
    fetchpriority: props.eager ? 'high' : undefined,
    decoding: 'async',
  }
}
</script>

<style scoped>
.pimg { margin: 0 0 1.5rem; }
.pimg img { display: block; width: 100%; height: auto; border-radius: var(--radius); background: var(--surface); }
.pimg figcaption { margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted); }

.pimg--banner { margin-bottom: 2rem; }

/* breaks out of the 720px text column to the full viewport width */
.pimg--full-bleed { width: 100vw; margin: 2.5rem calc(50% - 50vw); }
.pimg--full-bleed img { border-radius: 0; max-height: min(60vh, 520px); } /* wide screens: crop to a band instead of a wall */
.pimg--full-bleed figcaption { padding: 0 1rem; text-align: center; }

/* floats + portrait: text wraps around them */
.pimg--float-left, .pimg--portrait { float: left; margin: 0.35rem 1.5rem 1rem 0; }
.pimg--float-right { float: right; margin: 0.35rem 0 1rem 1.5rem; }
.pimg--sm { width: 120px; }   /* drop-cap scale: sits beside the first few lines */
.pimg--md { width: min(240px, 40%); }
.pimg--lg { width: min(340px, 50%); }
.pimg--portrait img { border-radius: 50%; shape-outside: circle(50%); }
.pimg--portrait { shape-outside: circle(50%); shape-margin: 0.75rem; }
.pimg--portrait figcaption { text-align: center; }

.pimg--split { margin: 0; position: sticky; top: calc(var(--nav-height) + 1.5rem); }

.pimg-strip { display: grid; grid-template-columns: repeat(var(--pimg-cols), 1fr); gap: 0.75rem; margin: 2rem 0; }
.pimg--strip { margin: 0; }

/* phones: medium/large floats would squeeze the text to a sliver, so they
   stack full-width; the small drop-cap size stays floated */
@media (max-width: 560px) {
  .pimg--md, .pimg--lg { float: none; width: 100%; margin: 0 0 1.5rem; }
  .pimg--portrait.pimg--md, .pimg--portrait.pimg--lg { width: 60%; margin: 0 auto 1.5rem; }
  .pimg--sm { width: 96px; }
  .pimg--banner.pimg--default-ratio img { aspect-ratio: 16 / 9 !important; } /* 21:9 is a sliver on a phone */
  .pimg--split { position: static; }
  .pimg-strip { grid-template-columns: repeat(var(--pimg-cols-sm), 1fr); gap: 0.5rem; }
}
</style>
