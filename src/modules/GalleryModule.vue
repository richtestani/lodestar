<template>
  <section class="section" :class="{ 'section--surface': surface }">
    <div class="container">
      <div v-if="eyebrow || title || intro" class="section-head is-center">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h2 v-if="title" class="h-title">{{ title }}</h2>
        <p v-if="intro">{{ intro }}</p>
      </div>

      <div v-if="categories.length > 1" class="gal-filter" role="group" aria-label="Filter images">
        <button
          v-for="c in [allLabel, ...categories]"
          :key="c"
          type="button"
          class="gal-chip"
          :class="{ 'is-active': active === c }"
          :aria-pressed="active === c"
          @click="active = c"
        >{{ c }}</button>
      </div>

      <div class="gal" :class="`gal--${variant}`">
        <figure
          v-for="(img, i) in shown"
          :key="(img.src || img.url || img.id || '') + i"
          class="gal-item"
          :class="{ 'has-caption': captions && img.caption, 'gal-item--video': isGalleryVideo(img) }"
          :style="isGalleryVideo(img) ? { '--gal-ratio': String(img.ratio || '16/9').replace('/', ' / ') } : null"
        >
          <button
            v-if="lightbox || isGalleryVideo(img)"
            type="button"
            class="gal-open"
            :aria-label="isGalleryVideo(img) ? `Play video: ${img.title || 'video ' + (i + 1)}` : `View ${img.alt || 'image ' + (i + 1)}`"
            @click="open(i)"
          >
            <img
              v-if="!failed.has(tileSrc(img))"
              :src="tileSrc(img)"
              :alt="isGalleryVideo(img) ? '' : img.alt || ''"
              loading="lazy"
              @error="isGalleryVideo(img) && failed.add(tileSrc(img))"
            />
            <span v-if="isGalleryVideo(img)" class="gal-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false"><path d="M8.5 6v12l9.5-6z" /></svg>
            </span>
          </button>
          <img v-else :src="tileSrc(img)" :alt="img.alt || ''" loading="lazy" />
          <figcaption v-if="captions && (img.caption || (isGalleryVideo(img) && img.title))">{{ img.caption || img.title }}</figcaption>
          <MediaSchema v-if="isGalleryVideo(img)" :item="img" />
        </figure>
      </div>
    </div>

    <!-- videos always open in the lightbox, even with lightbox: false
         (photos then just sit in the grid) -->
    <Lightbox v-if="lightbox || hasVideo" v-model:index="openIndex" :images="lightbox ? shown : shownVideos" :label="title || 'Gallery'" />
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { asset, media } from '@/composables/useAssets.js'
import Lightbox from '@/components/ui/Lightbox.vue'
import MediaSchema from '@/components/media/MediaSchema.js'
import { isGalleryVideo, hostedVideo, youtubeThumb } from '@/components/media/media.js'

const props = defineProps({
  eyebrow: String, title: { type: String, default: '' }, intro: String,
  // { src, alt, caption?, category?, full? } — `full` is an optional larger
  // file for the lightbox; `category` feeds the filter chips. Videos mix in
  // with the media shape: { type: 'youtube' | 'vimeo' | 'video', url | src,
  // title, poster?, category?, caption? } — see README → Video in the gallery.
  images: { type: Array, default: () => [] },
  // grid | masonry | carousel | mosaic
  variant: { type: String, default: 'grid' },
  // click an image to view it full-screen
  lightbox: { type: Boolean, default: true },
  // show category chips when images have 2+ distinct `category` values
  filter: { type: Boolean, default: false },
  allLabel: { type: String, default: 'All' },
  // print each image's caption under its thumbnail (the lightbox always shows it)
  captions: { type: Boolean, default: false },
  // tinted band behind the section; turn off for a standalone gallery page
  surface: { type: Boolean, default: true },
})
const src = asset

const categories = computed(() =>
  props.filter ? [...new Set(props.images.map(i => i.category).filter(Boolean))] : []
)
const active = ref(props.allLabel)
const shown = computed(() =>
  active.value === props.allLabel ? props.images : props.images.filter(i => i.category === active.value)
)

// Lightbox steps through what's on screen, so changing the filter closes it.
const openIndex = ref(null)

// A video thumbnail that fails (deleted video, ad blocker, firewall) is
// dropped, leaving the dark tile and play badge instead of a broken icon.
const failed = reactive(new Set())

// Tile picture: a photo's own file; a video's poster, or YouTube's thumbnail.
function tileSrc(item) {
  if (!isGalleryVideo(item)) return src(item.src)
  if (item.poster) return media(item.poster)
  const yt = item.type === 'youtube' && hostedVideo(item)
  return yt ? youtubeThumb(yt.id) : ''
}

// With lightbox: false, only videos open — and the lightbox steps through
// just the videos, so its index is the item's position among them.
const hasVideo = computed(() => props.images.some(isGalleryVideo))
const shownVideos = computed(() => shown.value.filter(isGalleryVideo))
function open(i) {
  openIndex.value = props.lightbox ? i : shownVideos.value.indexOf(shown.value[i])
}
watch(active, () => { openIndex.value = null })
</script>

<style scoped>
/* Shared item treatment. Per-variant rules set sizing/aspect below. */
.gal-item { overflow: hidden; border-radius: var(--radius); box-shadow: var(--shadow); margin: 0; position: relative; }
.gal-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s ease; }
.gal-item:hover img { transform: scale(1.05); }

.gal-open {
  display: block; width: 100%; height: 100%; padding: 0; border: 0;
  background: none; cursor: zoom-in; font: inherit; color: inherit;
}
.gal-open:focus-visible { outline: 3px solid var(--primary); outline-offset: -3px; }
.gal-open:focus-visible img { transform: scale(1.05); }

/* video tiles: play badge, and video-shaped in masonry/carousel where
   photos keep their own proportions */
.gal-item--video { background: linear-gradient(135deg, #2a2a2a, #111); }
.gal-item--video .gal-open { cursor: pointer; }
/* masonry tiles size from their image; keep a video-shaped tile without one */
.gal--masonry .gal-item--video .gal-open { aspect-ratio: var(--gal-ratio, 16 / 9); }
.gal--masonry .gal-item--video img { aspect-ratio: var(--gal-ratio, 16 / 9); object-fit: cover; }
.gal-play {
  position: absolute; top: 50%; left: 50%; width: 3.5rem; height: 3.5rem;
  transform: translate(-50%, -50%); display: grid; place-items: center;
  border-radius: 50%; background: rgba(0, 0, 0, 0.55); color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3); transition: background 0.2s ease, transform 0.2s ease;
  pointer-events: none;
}
.gal-play svg { width: 1.6rem; height: 1.6rem; margin-left: 0.15rem; fill: currentColor; }
.gal-open:hover .gal-play, .gal-open:focus-visible .gal-play { background: var(--primary); transform: translate(-50%, -50%) scale(1.08); }
@media (prefers-reduced-motion: reduce) { .gal-play { transition: none; } }

/* caption: overlaid along the bottom so every variant keeps its aspect ratio */
.gal-item figcaption {
  position: absolute; left: 0; right: 0; bottom: 0;
  padding: 1.6rem 0.9rem 0.7rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
  color: #fff; font-size: 0.85rem; line-height: 1.4;
  pointer-events: none;
}

/* ── filter chips ── */
.gal-filter { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin: -1.25rem 0 2rem; }
.gal-chip {
  font: inherit; font-size: 0.85rem; cursor: pointer;
  padding: 0.45rem 1rem; border-radius: 999px;
  border: 1px solid var(--border); background: transparent; color: var(--text-muted);
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
.gal-chip:hover { color: var(--text); border-color: var(--text-muted); }
.gal-chip.is-active { background: var(--primary); border-color: var(--primary); color: var(--on-primary); }
.gal-chip:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }

/* ── grid: uniform squares ── */
.gal--grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
.gal--grid .gal-item { aspect-ratio: 1; }

/* ── masonry: staggered heights, natural proportions (CSS columns) ── */
.gal--masonry { column-count: 3; column-gap: 1rem; }
.gal--masonry .gal-item { break-inside: avoid; margin-bottom: 1rem; }
.gal--masonry .gal-item img { height: auto; }
@media (max-width: 900px) { .gal--masonry { column-count: 2; } }
@media (max-width: 560px) { .gal--masonry { column-count: 1; } }

/* ── carousel: horizontal swipe strip with snap ── */
.gal--carousel {
  display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 1rem;
  scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
  scrollbar-width: thin; scrollbar-color: var(--border) transparent;
}
.gal--carousel .gal-item { flex: 0 0 clamp(260px, 70%, 420px); aspect-ratio: 4 / 3; scroll-snap-align: center; }
.gal--carousel::-webkit-scrollbar { height: 8px; }
.gal--carousel::-webkit-scrollbar-thumb { background: var(--border); border-radius: 999px; }

/* ── mosaic: first image large, rest tiled (best with 5+ images) ── */
.gal--mosaic { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.gal--mosaic .gal-item { aspect-ratio: 1; }
.gal--mosaic .gal-item:first-child { grid-column: span 2; grid-row: span 2; }
@media (max-width: 700px) {
  .gal--mosaic { grid-template-columns: repeat(2, 1fr); }
  .gal--mosaic .gal-item:first-child { grid-column: span 2; grid-row: span 1; aspect-ratio: 2 / 1; }
}
</style>
