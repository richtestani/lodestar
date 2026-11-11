// ============================================================
// MediaSchema — schema.org structured data (JSON-LD) for one media item,
// so search engines know a page has a video or audio track and what it
// is. Rendered as a <script type="application/ld+json"> beside the
// player; the prerender step captures it into the static HTML, which is
// what crawlers read. (A render function rather than a template: Vue
// templates can't contain <script> tags.)
//
// Video:  VideoObject — name, description, thumbnailUrl, uploadDate,
//         and contentUrl (self-hosted) or embedUrl (YouTube/Vimeo).
//         Google shows video results only when name, thumbnailUrl and
//         uploadDate are all present, so set `uploadDate` on videos you
//         want found. A Vimeo video with no `poster` has no thumbnail
//         and gets no structured data.
// Audio:  AudioObject — name, contentUrl, and the artist as creator.
// PDF:    nothing; the link itself is crawled.
//
// URLs are made absolute with VITE_SITE_URL (.env.production). Without
// it, local files stay root-relative — fine for staging, which is
// noindex anyway.
// ============================================================
import { defineComponent, h } from 'vue'
import { media } from '@/composables/useAssets.js'
import { hostedVideo, isoDuration } from './media.js'

const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/+$/, '')
const absolute = (url) => (url && url.startsWith('/') && !url.startsWith('//') ? SITE_URL + url : url)

function schemaFor(item) {
  const description = item.description || item.caption || undefined
  const uploadDate = item.uploadDate ? String(item.uploadDate) : undefined

  if (item.type === 'video') {
    const src = item.sources?.find((s) => s?.src)?.src || item.src
    const thumbnailUrl = item.poster ? absolute(media(item.poster)) : undefined
    return {
      '@type': 'VideoObject', name: item.title, description, uploadDate,
      thumbnailUrl, contentUrl: src ? absolute(media(src)) : undefined,
      duration: isoDuration(item.duration) || undefined,
    }
  }

  if (item.type === 'youtube' || item.type === 'vimeo') {
    const v = hostedVideo(item)
    if (!v) return null
    const thumbnailUrl = item.poster
      ? absolute(media(item.poster))
      : item.type === 'youtube' ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` : undefined
    if (!thumbnailUrl) return null
    const embedUrl = item.type === 'youtube'
      ? `https://www.youtube.com/embed/${v.id}`
      : `https://player.vimeo.com/video/${v.id}${v.hash ? `?h=${v.hash}` : ''}`
    return { '@type': 'VideoObject', name: item.title, description, uploadDate, thumbnailUrl, embedUrl, duration: isoDuration(item.duration) || undefined }
  }

  if (item.type === 'audio') {
    return {
      '@type': 'AudioObject', name: item.title, description, uploadDate,
      contentUrl: absolute(media(item.src)),
      creator: item.artist ? { '@type': 'Person', name: item.artist } : undefined,
      thumbnailUrl: item.artwork ? absolute(media(item.artwork)) : undefined,
      duration: isoDuration(item.duration) || undefined,
    }
  }
  return null
}

// JSON.stringify drops undefined keys. "<" is escaped so a title can never
// close the <script> tag early.
export function mediaJsonLd(item) {
  if (!item?.title) return ''
  const data = schemaFor(item)
  return data ? JSON.stringify({ '@context': 'https://schema.org', ...data }).replace(/</g, '\\u003c') : ''
}

export default defineComponent({
  name: 'MediaSchema',
  props: { item: { type: Object, required: true } },
  setup(props) {
    return () => {
      const json = mediaJsonLd(props.item)
      return json ? h('script', { type: 'application/ld+json', innerHTML: json }) : null
    }
  },
})
