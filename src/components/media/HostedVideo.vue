<!--
  HostedVideo — a YouTube or Vimeo video as a "facade": a thumbnail and
  play button that loads the real player only when clicked.

  Why: a YouTube embed pulls in ~500KB+ of script and sets cookies the
  moment the page loads, for every video on it, watched or not. Until
  the click this is just an image and a link — nothing from YouTube or
  Vimeo runs. On click the player loads from YouTube's privacy-enhanced
  domain (youtube-nocookie.com) or with Vimeo's do-not-track flag.

  The facade is a real link to the video, so it works without JavaScript
  and crawlers see it. The thumbnail is YouTube's own, or `poster` (your
  own image — a better-looking frame, and no request to Google at all
  until the click). Vimeo needs `poster` for a thumbnail: without its
  API there's no public thumbnail URL, so it falls back to a plain panel.
-->
<template>
  <div class="mhost" :style="{ aspectRatio: aspect }">
    <iframe
      v-if="active"
      ref="frame"
      class="mhost-frame"
      :src="embedSrc"
      :title="title"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
    <a
      v-else
      class="mhost-facade"
      :class="{ 'has-thumb': thumb && !thumbFailed }"
      :href="watchUrl"
      target="_blank"
      rel="noopener"
      @click="play"
    >
      <img v-if="thumb && !thumbFailed" class="mhost-thumb" :src="thumb" alt="" loading="lazy" decoding="async" @error="thumbFailed = true" />
      <span class="mhost-title" aria-hidden="true">{{ title }}</span>
      <span class="mhost-play" aria-hidden="true">
        <svg viewBox="0 0 68 48" focusable="false"><path class="mhost-play-bg" d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.2.3 34 .3 34 .3s-21.2 0-26.5 1.4a8.5 8.5 0 0 0-6 6C.1 13 .1 24 .1 24s0 11 1.4 16.3a8.5 8.5 0 0 0 6 6C12.8 47.7 34 47.7 34 47.7s21.2 0 26.5-1.4a8.5 8.5 0 0 0 6-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z" /><path d="M45 24 27 14v20z" fill="#fff" /></svg>
      </span>
      <span class="sr-only">Play video: {{ title }} ({{ providerName }})</span>
    </a>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { media } from '@/composables/useAssets.js'
import { hostedVideo } from './media.js'
import { claimPlayback } from './singlePlayback.js'

const props = defineProps({
  provider: { type: String, required: true }, // 'youtube' | 'vimeo'
  url: String,  // the link from the Share button…
  id: String,   // …or just the id
  title: { type: String, default: '' },
  poster: String,
  start: [Number, String], // seconds; a YouTube link's own &t= also works
  ratio: { type: String, default: '16/9' }, // '9/16' for Shorts / vertical video
  // load the player straight away — for players opened by a click (the
  // gallery lightbox), never for players sitting in a page
  autoplay: Boolean,
})

const ref_ = computed(() => hostedVideo({ type: props.provider, url: props.url, id: props.id }) || {})
const startAt = computed(() => Math.floor(Number(props.start ?? ref_.value.start) || 0))
const providerName = computed(() => (props.provider === 'vimeo' ? 'Vimeo' : 'YouTube'))
const aspect = computed(() => String(props.ratio).replace('/', ' / '))

const thumb = computed(() => {
  if (props.poster) return media(props.poster)
  if (props.provider === 'youtube' && ref_.value.id) return `https://i.ytimg.com/vi/${ref_.value.id}/hqdefault.jpg`
  return ''
})

const watchUrl = computed(() => {
  const { id, hash } = ref_.value
  if (!id) return undefined
  if (props.provider === 'vimeo') return `https://vimeo.com/${id}${hash ? `/${hash}` : ''}${startAt.value ? `#t=${startAt.value}s` : ''}`
  return `https://www.youtube.com/watch?v=${id}${startAt.value ? `&t=${startAt.value}s` : ''}`
})

const embedSrc = computed(() => {
  const { id, hash } = ref_.value
  if (props.provider === 'vimeo') {
    const q = new URLSearchParams({ autoplay: '1', dnt: '1' })
    if (hash) q.set('h', hash)
    return `https://player.vimeo.com/video/${id}?${q}${startAt.value ? `#t=${startAt.value}s` : ''}`
  }
  // rel=0: end-of-video suggestions come from the same channel, not anyone's
  const q = new URLSearchParams({ autoplay: '1', rel: '0', playsinline: '1' })
  if (startAt.value) q.set('start', String(startAt.value))
  return `https://www.youtube-nocookie.com/embed/${id}?${q}`
})

// a deleted video, an ad blocker or a firewall can block the thumbnail:
// show the plain panel rather than a broken-image icon
const thumbFailed = ref(false)

const active = ref(false)
const frame = ref(null)
let release = null

function stop() {
  active.value = false
  release?.()
  release = null
}

async function play(e) {
  if (!ref_.value.id) return // bad link: let the browser follow it
  e?.preventDefault()
  release = claimPlayback(stop)
  active.value = true
  await nextTick()
  if (e) frame.value?.focus() // keyboard users land in the player, not back at the top
}

onMounted(() => { if (props.autoplay) play() })

onBeforeUnmount(() => release?.())
</script>

<style scoped>
.mhost { position: relative; width: 100%; overflow: hidden; border-radius: var(--radius); background: #000; }
.mhost-frame { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }

.mhost-facade {
  position: absolute; inset: 0; display: block; color: #fff; text-decoration: none; cursor: pointer;
  background: linear-gradient(135deg, var(--surface-2, #333), #111);
}
.mhost-thumb { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
/* darken the top edge so the title reads on any thumbnail */
.mhost-facade::before {
  content: ''; position: absolute; inset: 0 0 auto; height: 45%; z-index: 1;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), transparent);
}
.mhost-title {
  position: absolute; z-index: 2; top: 0; left: 0; right: 0; padding: 0.9rem 1rem;
  font-weight: 600; font-size: 1rem; line-height: 1.3;
  overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}
.mhost-play {
  position: absolute; z-index: 2; top: 50%; left: 50%; width: 68px; height: 48px;
  transform: translate(-50%, -50%); transition: transform 0.15s;
}
.mhost-play svg { display: block; width: 100%; height: 100%; }
.mhost-play-bg { fill: rgba(33, 33, 33, 0.8); transition: fill 0.15s; }
.mhost-facade:hover .mhost-play-bg,
.mhost-facade:focus-visible .mhost-play-bg { fill: var(--primary); }
.mhost-facade:hover .mhost-play { transform: translate(-50%, -50%) scale(1.06); }
.mhost-facade:focus-visible { outline: 3px solid var(--primary); outline-offset: -3px; }

.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

@media (prefers-reduced-motion: reduce) {
  .mhost-play, .mhost-play-bg { transition: none; }
  .mhost-facade:hover .mhost-play { transform: translate(-50%, -50%); }
}
</style>
