<!--
  MediaEmbed — one video, audio track, PDF or YouTube/Vimeo video,
  wrapped in a <figure>. Takes a single media item (see
  components/media/media.js for the shape), picks the right player, and
  adds its structured data (MediaSchema.js). Used by prose pages
  (ProseBody), the content module, the media module, and directly in .md
  docs or any template:

    <MediaEmbed :item="{ type: 'audio', src: 'single.mp3', title: 'Single' }" />

  Layout (prose pages): column (default) · full-bleed · float-left ·
  float-right, with size sm / md / lg for floats.
-->
<template>
  <figure
    v-if="Player"
    class="media"
    :class="[`media--${item.type}`, `media--${layout}`, sizeClass]"
  >
    <component :is="Player" v-bind="playerProps" />
    <figcaption v-if="item.caption">{{ item.caption }}</figcaption>
    <MediaSchema :item="item" />
  </figure>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import VideoPlayer from './VideoPlayer.vue'
import AudioPlayer from './AudioPlayer.vue'
import PdfDocument from './PdfDocument.vue'
import HostedVideo from './HostedVideo.vue'
import MediaSchema from './MediaSchema.js'
import { MEDIA_LAYOUTS } from './media.js'
import { useSinglePlayback } from './singlePlayback.js'

const props = defineProps({
  item: { type: Object, required: true },
})

const PLAYERS = { video: VideoPlayer, audio: AudioPlayer, pdf: PdfDocument, youtube: HostedVideo, vimeo: HostedVideo }
const Player = computed(() => {
  const p = PLAYERS[props.item.type]
  if (!p && import.meta.env.DEV) console.warn(`[lodestar] media type "${props.item.type}" isn't recognized — expected video, audio, pdf, youtube or vimeo`)
  return p
})

const layout = computed(() => (MEDIA_LAYOUTS.includes(props.item.layout) ? props.item.layout : 'column'))
const FLOATS = ['float-left', 'float-right']
const sizeClass = computed(() => (FLOATS.includes(layout.value) ? `media--${props.item.size || 'md'}` : ''))

// Placement and structured-data keys stay here; everything else goes to
// the player. (Anything a player doesn't declare would otherwise land on
// its root element as a stray HTML attribute.)
const playerProps = computed(() => {
  const { type, layout: _l, size: _s, after: _a, caption: _c, uploadDate: _u, duration: _d, description, ...rest } = props.item
  if (type === 'pdf') rest.description = description // the PDF card shows it
  if (type === 'youtube' || type === 'vimeo') rest.provider = type
  return rest
})

onMounted(useSinglePlayback)
</script>

<style scoped>
.media { margin: 0 0 1.5rem; }
.media figcaption { margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted); }

/* breaks out of the text column to the full viewport width (parent needs overflow-x: clip) */
.media--full-bleed { width: 100vw; margin: 2.5rem calc(50% - 50vw); }
.media--full-bleed :deep(.mvideo) { border-radius: 0; max-height: 85vh; }
.media--full-bleed :deep(.mhost) { border-radius: 0; }
.media--full-bleed figcaption { padding: 0 1rem; text-align: center; }

/* floats: text wraps around them — best for audio cards and short clips */
.media--float-left { float: left; margin: 0.35rem 1.5rem 1rem 0; }
.media--float-right { float: right; margin: 0.35rem 0 1rem 1.5rem; }
.media--sm { width: min(220px, 40%); }
.media--md { width: min(320px, 50%); }
.media--lg { width: min(420px, 60%); }

/* phones: floats would squeeze the text to a sliver, so they stack */
@media (max-width: 560px) {
  .media--sm, .media--md, .media--lg { float: none; width: 100%; margin: 0 0 1.5rem; }
}
</style>
