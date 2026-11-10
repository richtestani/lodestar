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
//
// Files live in src/assets/media/ (posters and artwork can also come
// from src/assets/images/); full URLs pass through. See README → Media.
// ============================================================

export const MEDIA_TYPES = ['video', 'audio', 'pdf']

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
    const files = item.type === 'video' && Array.isArray(item.sources) && item.sources.length
      ? item.sources.map((s) => s?.src)
      : [item.src]
    if (!files.some(Boolean)) problems.push(`${label}: missing src`)
    for (const f of files.filter(Boolean)) {
      if (!isRemote(f) && !EXTENSIONS[item.type].includes(ext(f))) {
        problems.push(`${label}: "${f}" doesn't look like ${item.type === 'pdf' ? 'a PDF' : `a${item.type === 'audio' ? 'n' : ''} ${item.type} file`} — expected .${EXTENSIONS[item.type].join(' / .')}`)
      }
    }
    // Every player and link needs a name: it's the accessible label, the
    // link text for a PDF, and what search engines see.
    if (!item.title) problems.push(`${label}: "${files[0] || '?'}" has no title — screen readers announce it, and PDFs use it as the link text`)
    if (item.layout && !MEDIA_LAYOUTS.includes(item.layout)) problems.push(`${label}: layout "${item.layout}" — expected one of: ${MEDIA_LAYOUTS.join(', ')}`)
    if (item.size && !MEDIA_SIZES.includes(item.size)) problems.push(`${label}: size "${item.size}" — expected sm, md or lg`)
    if (item.type === 'pdf' && item.display && !PDF_DISPLAYS.includes(item.display)) problems.push(`${label}: display "${item.display}" — expected link or inline`)
    if (item.captions != null) {
      if (item.type !== 'video') problems.push(`${label}: captions only apply to video`)
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
