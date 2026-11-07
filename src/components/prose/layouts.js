// ============================================================
// Image presets for prose pages (view: 'page') and the content module.
// Plain JS on purpose — scripts/prerender.mjs imports this in Node to
// validate config, so no import.meta.glob or Vue here.
//
//   ratio  default crop when the config doesn't set one ('natural' = no crop)
//   sizes  the `sizes` attribute, so the browser picks the right srcset width
// ============================================================

const FLOAT_SIZES = {
  sm: '120px',
  md: '(max-width: 560px) 100vw, 240px',
  lg: '(max-width: 560px) 100vw, 340px',
}

export const IMAGE_LAYOUTS = {
  banner:        { ratio: '21/9', sizes: () => '(max-width: 760px) 100vw, 720px' },
  'full-bleed':  { ratio: '16/9', sizes: () => '100vw' },
  'float-left':  { ratio: '4/5',  sizes: (size) => FLOAT_SIZES[size] || FLOAT_SIZES.md },
  'float-right': { ratio: '4/5',  sizes: (size) => FLOAT_SIZES[size] || FLOAT_SIZES.md },
  portrait:      { ratio: '1',    sizes: (size) => FLOAT_SIZES[size] || FLOAT_SIZES.md },
  split:         { ratio: '4/5',  sizes: () => '(max-width: 720px) 100vw, 340px' },
  strip:         { ratio: '1',    sizes: () => '(max-width: 560px) 50vw, 240px' },
}

export const IMAGE_SIZES = ['sm', 'md', 'lg']

// Sorts a page's `images` into where they render:
//   top     → above the eyebrow/title (a banner with no `after`)
//   split   → the one image beside the whole body (first split wins)
//   byIndex → { 0: [...], 2: [...] } inserted before paragraph N (0-based),
//             i.e. `after: 2` lands between paragraphs 2 and 3
// Anything else with no `after` goes before the first paragraph.
export function placeImages(images, paragraphCount) {
  const out = { top: [], split: null, byIndex: {} }
  for (const img of images || []) {
    if (!img || !IMAGE_LAYOUTS[img.layout || 'banner']) continue
    const layout = img.layout || 'banner'
    if (layout === 'split') { out.split ||= img; continue }
    if (img.after == null && layout === 'banner') { out.top.push(img); continue }
    const at = Math.min(Math.max(Number(img.after) || 0, 0), paragraphCount)
    ;(out.byIndex[at] ||= []).push(img)
  }
  return out
}

// Config check used by prerender — returns human-readable problems.
export function checkImages(images, where) {
  const problems = []
  for (const [i, img] of (images || []).entries()) {
    const label = `${where} images[${i}]`
    const layout = img.layout || 'banner'
    if (!IMAGE_LAYOUTS[layout]) {
      problems.push(`${label}: layout "${img.layout}" isn't recognized — expected one of: ${Object.keys(IMAGE_LAYOUTS).join(', ')}`)
      continue
    }
    if (img.size && !IMAGE_SIZES.includes(img.size)) problems.push(`${label}: size "${img.size}" — expected sm, md or lg`)
    const items = layout === 'strip' ? (img.items || []) : [img]
    if (layout === 'strip' && !items.length) problems.push(`${label}: a strip needs an items: [...] list`)
    for (const it of items) {
      if (!it.src) problems.push(`${label}: missing src`)
      else if (it.alt == null) problems.push(`${label}: "${it.src}" has no alt text — describe the image (use alt: '' only if it's purely decorative)`)
    }
  }
  return problems
}
