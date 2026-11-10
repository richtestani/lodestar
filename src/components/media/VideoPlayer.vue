<!--
  VideoPlayer — the browser's own player. No library: native controls
  work with keyboard, screen readers and picture-in-picture for free.
  A styled player is a pro-module upgrade, not a base requirement.

  preload="metadata" fetches only the first few KB (duration, size), so
  several videos on a page cost little until someone presses play.
-->
<template>
  <video
    class="mvideo"
    data-lodestar-player
    controls
    playsinline
    :preload="preload"
    :poster="poster ? media(poster) : undefined"
    :aria-label="title"
    :loop="loop || undefined"
    :style="{ aspectRatio: aspect }"
  >
    <source v-for="s in sourceList" :key="s.src" :src="media(s.src)" :type="s.type || mimeFor(s.src)" />
    <track
      v-for="(t, i) in captions"
      :key="t.src"
      kind="captions"
      :src="media(t.src)"
      :srclang="t.lang"
      :label="t.label || t.lang"
      :default="t.default || (i === 0 && defaultCaptions) || undefined"
    />
    <a :href="media(sourceList[0]?.src)">Download {{ title }}</a>
  </video>
</template>

<script setup>
import { computed } from 'vue'
import { media } from '@/composables/useAssets.js'
import { mimeFor } from './media.js'

const props = defineProps({
  src: String,
  // several encodings of the same clip, best first: [{ src: 'clip.webm' }, { src: 'clip.mp4' }]
  sources: Array,
  title: { type: String, default: '' },
  poster: String,
  captions: { type: Array, default: () => [] },
  // show the first captions track without the viewer turning it on
  defaultCaptions: { type: Boolean, default: false },
  ratio: { type: String, default: '16/9' }, // 'natural' = the file's own shape
  loop: Boolean,
  preload: { type: String, default: 'metadata' },
})

const sourceList = computed(() => (props.sources?.length ? props.sources : [{ src: props.src }]).filter((s) => s?.src))
const aspect = computed(() => (props.ratio === 'natural' ? 'auto' : String(props.ratio).replace('/', ' / ')))
</script>

<style scoped>
.mvideo { display: block; width: 100%; height: auto; background: #000; border-radius: var(--radius); object-fit: contain; }
</style>
