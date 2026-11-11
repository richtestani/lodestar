// ============================================================
// Media (video, audio, PDF) for prose pages, the content module and
// the media module. Plain JS on purpose — scripts/prerender.mjs imports
// this in Node to validate config, so no import.meta.glob or Vue here.
//
// One item looks like:
//   { type: 'video', src: 'promo.mp4', title: 'Promo', poster: 'promo.jpg',
//     captions: [{ src: 'promo.en.vtt', lang: 'en', label: 'English' }] }
//   { type: 'audio', src: 'single.mp3', title: 'Single', artist: 'Elle', artwork: 'cover.jpg' }
//   { type: 'pdf',   src: 'rider.pdf',  title: 'Tech rider', display: 'inline' }
//   { type: 'youtube', url: 'https://youtu.be/dQw4w9WgXcQ', title: 'Live at The Pour House' }
//   { type: 'vimeo',   url: 'https://vimeo.com/76979871',   title: 'Studio session', poster: 'studio.jpg' }
//
// Files live in src/assets/media/ (posters and artwork can also come
// from src/assets/images/); full URLs pass through. See README → Media.
// ============================================================

export const MEDIA_TYPES = ['video', 'audio', 'pdf', 'youtube', 'vimeo']
const HOSTED = ['youtube', 'vimeo'] // embedded from another site: url/id instead of src

// Where an item sits in a prose page. `column` is the text column width.
export const MEDIA_LAYOUTS = ['column', 'full-bleed', 'float-left', 'float-right']
export const MEDIA_SIZES = ['sm', 'md', 'lg']
export const PDF_DISPLAYS = ['link', 'inline']

// Files a bare `src` may point at, per type — catches 'promo.mov' or a
// PDF passed as a video before it ships as a player that never loads.
const EXTENSIONS = {
  video: ['mp4', 'webm', 'm4v', 'ogv', 'mov'],
  audio: ['mp3', 'm4a', 'aac', 'ogg', 'oga', 'opus', 'wav', 'flac', 'webm'],
  pdf: ['pdf'],
}

const ext = (ref) => String(ref).split(/[?#]/)[0].split('.').pop().toLowerCase()
const isRemote = (ref) => /^(https?:)?\/\//.test(ref) || String(ref).startsWith('data:')

// The `type` attribute for a <source>, so the browser can skip formats it
// can't play without downloading them. Unknown → let the browser sniff.
export function mimeFor(ref) {
  const e = ext(ref)
  return ({
    mp4: 'video/mp4', m4v: 'video/mp4', webm: 'video/webm', ogv: 'video/ogg', mov: 'video/quicktime',
    mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', ogg: 'audio/ogg', oga: 'audio/ogg',
    opus: 'audio/ogg', wav: 'audio/wav', flac: 'audio/flac',
  })[e]
}

// ── YouTube / Vimeo ──────────────────────────────────────────
// Accepts whatever a client pastes: a watch/share/shorts/embed link or
// the bare id. Returns { id, hash? } or null.
const YT_ID = /^[\w-]{11}$/
export function parseYouTube(ref) {
  if (!ref) return null
  const s = String(ref).trim()
  if (YT_ID.test(s)) return { id: s }
  let u
  try { u = new URL(s.startsWith('http') ? s : `https://${s}`) } catch { return null }
  const host = u.hostname.replace(/^(www\.|m\.|music\.)/, '')
  let id = null
  if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0]
  else if (/^youtube(-nocookie)?\.com$/.test(host)) {
    id = u.searchParams.get('v') || (u.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})/) || [])[1]
  }
  if (!id || !YT_ID.test(id)) return null
  // a timestamped share link (&t=90, &t=1m30s, ?start=90) keeps its start
  const t = u.searchParams.get('t') || u.searchParams.get('start')
  const start = t ? seconds(t) : 0
  return start ? { id, start } : { id }
}

// '90' | '90s' | '1m30s' | '1h2m3s' → seconds
function seconds(t) {
  if (/^\d+$/.test(t)) return Number(t)
  const m = String(t).match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/)
  return m ? (Number(m[1] || 0) * 3600) + (Number(m[2] || 0) * 60) + Number(m[3] || 0) : 0
}

// Unlisted Vimeo videos carry a privacy hash (vimeo.com/123456/abc123def
// or ?h=abc123def) that the player needs, so it's kept alongside the id.
export function parseVimeo(ref) {
  if (!ref) return null
  const s = String(ref).trim()
  if (/^\d{6,}$/.test(s)) return { id: s }
  let u
  try { u = new URL(s.startsWith('http') ? s : `https://${s}`) } catch { return null }
  const host = u.hostname.replace(/^www\./, '')
  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null
  const m = u.pathname.match(/(?:^|\/)(\d{6,})(?:\/([\da-f]{6,}))?(?:\/|$)/i)
  if (!m) return null
  const hash = m[2] || u.searchParams.get('h') || undefined
  return hash ? { id: m[1], hash } : { id: m[1] }
}

// `duration` as people write it — 90, '1:30', '1:02:03' — or already in
// ISO 8601 ('PT1M30S'), → ISO 8601 for structured data. '' if unreadable.
export function isoDuration(d) {
  if (d == null || d === '') return undefined
  if (/^P(T?\d|\d)/.test(String(d))) return String(d)
  const parts = typeof d === 'number' ? [d] : String(d).split(':').map(Number)
  if (!parts.length || parts.length > 3 || parts.some((n) => !(n >= 0))) return ''
  let total = parts.reduce((acc, n) => acc * 60 + n, 0)
  const hrs = Math.floor(total / 3600); total -= hrs * 3600
  const min = Math.floor(total / 60); const sec = Math.round(total - min * 60)
  return `PT${hrs ? `${hrs}H` : ''}${min ? `${min}M` : ''}${sec || (!hrs && !min) ? `${sec}S` : ''}`
}

// An item's video reference, from `url` or `id` — whichever is set.
export function hostedVideo(item) {
  const ref = item.url || item.id
  return item.type === 'youtube' ? parseYouTube(ref) : item.type === 'vimeo' ? parseVimeo(ref) : null
}

// Sorts a prose page's `media` the same way placeImages() sorts `images`:
// byIndex → { 0: [...], 2: [...] } inserted before paragraph N (0-based),
// so `after: 2` lands between paragraphs 2 and 3. No `after` → before the
// first paragraph. (Media never heads the page above the title — that
// slot belongs to the lead banner image.)
export function placeMedia(media, paragraphCount) {
  const byIndex = {}
  for (const item of media || []) {
    if (!item || !MEDIA_TYPES.includes(item.type)) continue
    const at = Math.min(Math.max(Number(item.after) || 0, 0), paragraphCount)
    ;(byIndex[at] ||= []).push(item)
  }
  return byIndex
}

// Config check used by prerender — returns human-readable problems.
// `localExists(name)` (optional) says whether a bare filename exists in
// src/assets/media/ or src/assets/images/, so a typo fails the build
// instead of shipping a player that 404s.
export function checkMedia(media, where, localExists) {
  const problems = []
  if (media != null && !Array.isArray(media)) {
    return [`${where} media: expected a list — media: [{ type, src, title }, …]`]
  }
  for (const [i, item] of (media || []).entries()) {
    const label = `${where} media[${i}]`
    if (!item || typeof item !== 'object') { problems.push(`${label}: expected { type, src, title }`); continue }
    if (!MEDIA_TYPES.includes(item.type)) {
      problems.push(`${label}: type "${item.type}" isn't recognized — expected one of: ${MEDIA_TYPES.join(', ')}`)
      continue
    }
    const hosted = HOSTED.includes(item.type)
    const files = hosted ? [] : item.type === 'video' && Array.isArray(item.sources) && item.sources.length
      ? item.sources.map((s) => s?.src)
      : [item.src]
    if (hosted) {
      const name = item.type === 'youtube' ? 'YouTube' : 'Vimeo'
      if (!item.url && !item.id) problems.push(`${label}: a ${name} video needs url: (the link from ${name}'s Share button) or id:`)
      else if (!hostedVideo(item)) problems.push(`${label}: "${item.url || item.id}" isn't a ${name} video link — paste the link from ${name}'s Share button`)
      if (item.start != null && !(Number(item.start) >= 0)) problems.push(`${label}: start should be a number of seconds, e.g. start: 90`)
    } else if (!files.some(Boolean)) problems.push(`${label}: missing src`)
    for (const f of files.filter(Boolean)) {
      if (!isRemote(f) && !EXTENSIONS[item.type].includes(ext(f))) {
        problems.push(`${label}: "${f}" doesn't look like ${item.type === 'pdf' ? 'a PDF' : `a${item.type === 'audio' ? 'n' : ''} ${item.type} file`} — expected .${EXTENSIONS[item.type].join(' / .')}`)
      }
    }
    // Every player and link needs a name: it's the accessible label, the
    // link text for a PDF, and what search engines see.
    if (!item.title) problems.push(`${label}: "${files[0] || item.url || item.id || '?'}" has no title — screen readers announce it, and PDFs use it as the link text`)
    if (item.duration != null && !isoDuration(item.duration)) problems.push(`${label}: duration "${item.duration}" — use minutes:seconds like '3:45', or seconds`)
    if (item.uploadDate != null && !/^\d{4}-\d{2}-\d{2}/.test(String(item.uploadDate))) problems.push(`${label}: uploadDate "${item.uploadDate}" — use YYYY-MM-DD`)
    if (item.layout && !MEDIA_LAYOUTS.includes(item.layout)) problems.push(`${label}: layout "${item.layout}" — expected one of: ${MEDIA_LAYOUTS.join(', ')}`)
    if (item.size && !MEDIA_SIZES.includes(item.size)) problems.push(`${label}: size "${item.size}" — expected sm, md or lg`)
    if (item.type === 'pdf' && item.display && !PDF_DISPLAYS.includes(item.display)) problems.push(`${label}: display "${item.display}" — expected link or inline`)
    if (item.captions != null) {
      if (item.type !== 'video') problems.push(`${label}: captions only apply to self-hosted video${hosted ? ` — turn captions on in ${item.type === 'youtube' ? 'YouTube' : 'Vimeo'} instead` : ''}`)
      else if (!Array.isArray(item.captions)) problems.push(`${label}: captions should be a list — [{ src: 'clip.en.vtt', lang: 'en', label: 'English' }]`)
      else for (const t of item.captions) {
        if (!t?.src) problems.push(`${label}: a captions entry is missing src`)
        else if (!isRemote(t.src) && ext(t.src) !== 'vtt') problems.push(`${label}: captions "${t.src}" must be a WebVTT (.vtt) file — convert .srt with any subtitle tool`)
        if (t && !t.lang) problems.push(`${label}: captions "${t.src || '?'}" needs a lang ('en', 'es', …)`)
      }
    }
    if (localExists) {
      const refs = [...files, item.poster, item.artwork, ...(Array.isArray(item.captions) ? item.captions.map((t) => t?.src) : [])]
      for (const r of refs) {
        if (r && !isRemote(r) && !r.startsWith('/') && !localExists(r)) {
          problems.push(`${label}: "${r}" isn't in src/assets/media/ or src/assets/images/ — check the filename, or use a full URL`)
        }
      }
    }
  }
  return problems
}

// Hero background video (`video` on the hero module) — see
// components/media/useBackgroundVideo.js. Returns human-readable problems.
const BG_VARIANTS = ['center', 'overlay']
export function checkHeroVideo(props, where, localExists) {
  const video = props?.video
  if (video == null) return []
  const label = `${where} hero video`
  const problems = []
  if (typeof video !== 'string' && (typeof video !== 'object' || Array.isArray(video))) {
    return [`${label}: expected a filename ('loop.mp4') or { src, mobile, focus, controls }`]
  }
  const variant = props.variant || 'center'
  if (!BG_VARIANTS.includes(variant)) {
    problems.push(`${label}: background video works with the center and overlay variants — this hero is "${variant}"`)
  }
  const v = typeof video === 'string' ? { src: video } : video
  const files = (Array.isArray(v.sources) && v.sources.length ? v.sources.map((x) => x?.src) : [v.src]).filter(Boolean)
  if (!files.length) problems.push(`${label}: missing src`)
  if (typeof v.mobile === 'string') files.push(v.mobile)
  else if (v.mobile != null && typeof v.mobile !== 'boolean') problems.push(`${label}: mobile should be false (poster only on phones) or a smaller file ('loop-small.mp4')`)
  if (v.controls != null && typeof v.controls !== 'boolean') problems.push(`${label}: controls should be true or false (false hides the pause button)`)
  for (const f of files) {
    if (parseYouTube(f) || parseVimeo(f)) {
      problems.push(`${label}: "${f}" is a ${parseYouTube(f) ? 'YouTube' : 'Vimeo'} link — a background video has to be a file you host. Trim a short clip with ffmpeg (README → Hero video)`)
    } else if (!isRemote(f) && !EXTENSIONS.video.includes(ext(f))) {
      problems.push(`${label}: "${f}" doesn't look like a video file — expected .${EXTENSIONS.video.join(' / .')}`)
    } else if (localExists && !isRemote(f) && !f.startsWith('/') && !localExists(f)) {
      problems.push(`${label}: "${f}" isn't in src/assets/media/ — check the filename, or use a full URL`)
    }
  }
  return problems
}
