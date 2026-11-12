#!/usr/bin/env node
// ============================================================
// placeholders.mjs — generates Lodestar's bundled placeholder
// images into src/assets/placeholders/.
//
//   npm run placeholders                    # the neutral default set
//   npm run placeholders -- --accent #3fc1b4 # tinted to a brand color
//
// Why bundled: demo and starter content used to point at picsum.photos,
// so every build and every page view reached out to a third-party
// service (and a slow response could stall the prerender). These are
// local files, abstract on purpose: nothing to license, nothing that
// looks like a real product, and no photos of real people standing in
// for someone's team.
//
// Reference them by filename like any image — image: 'ph-wide-01.webp'.
// asset() looks in src/assets/images/ first, then here. The production
// build lists every page still using one (scripts/prerender.mjs), so
// they never ship by accident. Replace them with real images, or delete
// the folder once nothing uses them.
//
// Shapes:  wide 16:9 · photo 3:2 · card 4:3 · square 1:1 · portrait 4:5 · avatar 1:1
// Output is deterministic: same options → byte-identical files.
// ============================================================
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const OUT = path.join(ROOT, 'src/assets/placeholders')

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  console.error('sharp isn\'t installed. It normally comes with vite-imagetools — run `npm install`, or `npm i -D sharp`.')
  process.exit(1)
}

// ── options ────────────────────────────────────────────────
const args = process.argv.slice(2)
const opt = name => { const i = args.indexOf(`--${name}`); return i === -1 ? null : args[i + 1] }
const accent = opt('accent')
if (accent && !/^#?[0-9a-f]{6}$/i.test(accent)) {
  console.error(`--accent expects a hex color like #3fc1b4 (got "${accent}")`)
  process.exit(1)
}

const SHAPES = [
  // name      w     h    count
  ['wide',     1920, 1080, 4],
  ['photo',    1500, 1000, 4],
  ['card',     1200,  900, 6],
  ['square',   1000, 1000, 6],
  ['portrait', 1200, 1500, 4],
  ['avatar',    600,  600, 6],
]

// ── color ──────────────────────────────────────────────────
const hex2hsl = h => {
  h = h.replace('#', '')
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const hue = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  return [hue * 60, s * 100, l * 100]
}
const hsl = (h, s, l) => `hsl(${((h % 360) + 360) % 360} ${Math.max(0, Math.min(100, s)).toFixed(1)}% ${Math.max(0, Math.min(100, l)).toFixed(1)}%)`

// Six muted palettes: [dark, mid, light, highlight] as [h, s, l].
// Neutral by default; with --accent, every palette is built around the brand
// hue (neighbors on the wheel, varied depth) so the set reads as one theme.
function palettes() {
  if (!accent) return [
    [[214, 32, 22], [204, 30, 46], [196, 28, 74], [36, 60, 86]],   // slate / mist
    [[150, 18, 24], [140, 18, 46], [96, 22, 78], [42, 50, 84]],    // sage
    [[18, 26, 28], [20, 34, 52], [30, 40, 80], [40, 70, 88]],      // clay / sand
    [[252, 22, 26], [232, 26, 52], [210, 34, 80], [330, 40, 86]],  // dusk
    [[190, 40, 20], [186, 38, 40], [176, 30, 72], [48, 64, 84]],   // ocean
    [[30, 10, 22], [30, 8, 46], [36, 14, 80], [36, 30, 92]],       // stone
  ]
  const [h, s] = hex2hsl(accent)
  const sat = Math.max(18, Math.min(s, 62))
  // Five palettes on the brand hue and its neighbors, plus one near-neutral
  // grey in the brand hue for contrast (an opposite-hue palette clashed).
  return [
    ...[0, -24, 24, -48, 48].map(shift => [
      [h + shift, sat * 0.7, 20], [h + shift / 2, sat, 44], [h - shift / 3, sat * 0.8, 74], [h + 40, sat * 0.5, 88],
    ]),
    [[h, 10, 22], [h, 9, 46], [h, 12, 78], [h + 40, 20, 90]],
  ]
}

// Deterministic randomness per image so regenerating gives the same files.
function rng(seed) {
  let a = 0
  for (const c of seed) a = (a * 31 + c.charCodeAt(0)) >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ── artwork ────────────────────────────────────────────────
function svgFor(shape, w, h, n, pal) {
  const r = rng(`${shape}-${n}-${accent || ''}`)
  const [dark, mid, light, hi] = pal.map(c => hsl(...c))
  const angle = Math.round(r() * 360)

  // soft color fields: big radial blobs, each fading to transparent
  const blobs = Array.from({ length: 5 }, (_, i) => {
    const cx = (0.1 + r() * 0.8) * w, cy = (0.1 + r() * 0.8) * h
    const rad = (0.35 + r() * 0.45) * Math.max(w, h)
    const col = [mid, light, hi, mid, light][i]
    const op = (0.45 + r() * 0.4).toFixed(2)
    return { cx, cy, rad, col, op }
  })

  // one quiet geometric layer, chosen per image: rings, arcs or a grid
  const kind = shape === 'avatar' ? 'none' : ['rings', 'arcs', 'grid', 'rings', 'arcs'][Math.floor(r() * 5)]
  let geo = ''
  if (kind === 'rings') {
    const cx = (0.55 + r() * 0.35) * w, cy = (0.3 + r() * 0.4) * h, base = Math.min(w, h) * 0.18
    geo = Array.from({ length: 5 }, (_, i) => `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(base * (1 + i * 0.55)).toFixed(0)}"/>`).join('')
  } else if (kind === 'arcs') {
    const y0 = h * (0.55 + r() * 0.3)
    geo = Array.from({ length: 6 }, (_, i) => {
      const y = y0 + i * h * 0.06
      return `<path d="M${-w * 0.1} ${y.toFixed(0)} Q ${w * 0.5} ${(y - h * (0.35 + r() * 0.15)).toFixed(0)} ${w * 1.1} ${(y - h * 0.05).toFixed(0)}"/>`
    }).join('')
  } else if (kind === 'grid') {
    const step = Math.round(Math.min(w, h) / 9)
    for (let x = step; x < w; x += step) geo += `<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`
    for (let y = step; y < h; y += step) geo += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`
  }

  // avatar: neutral head-and-shoulders silhouette, never a face
  const person = shape === 'avatar' ? `
    <g fill="#fff" fill-opacity="0.62">
      <circle cx="${w / 2}" cy="${h * 0.4}" r="${w * 0.17}"/>
      <path d="M${w * 0.16} ${h} C ${w * 0.16} ${h * 0.7}, ${w * 0.34} ${h * 0.62}, ${w / 2} ${h * 0.62} C ${w * 0.66} ${h * 0.62}, ${w * 0.84} ${h * 0.7}, ${w * 0.84} ${h} Z"/>
    </g>` : ''

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" gradientTransform="rotate(${angle} .5 .5)">
      <stop offset="0" stop-color="${dark}"/><stop offset="1" stop-color="${mid}"/>
    </linearGradient>
    ${blobs.map((b, i) => `<radialGradient id="b${i}"><stop offset="0" stop-color="${b.col}" stop-opacity="${b.op}"/><stop offset="1" stop-color="${b.col}" stop-opacity="0"/></radialGradient>`).join('')}
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${Math.floor(r() * 99)}" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${blobs.map((b, i) => `<circle cx="${b.cx.toFixed(0)}" cy="${b.cy.toFixed(0)}" r="${b.rad.toFixed(0)}" fill="url(#b${i})"/>`).join('')}
  <g fill="none" stroke="#fff" stroke-opacity="0.16" stroke-width="${Math.max(1, Math.round(Math.min(w, h) / 600))}">${geo}</g>
  ${person}
  <rect width="${w}" height="${h}" filter="url(#grain)"/>
</svg>`
}

// ── write ──────────────────────────────────────────────────
fs.mkdirSync(OUT, { recursive: true })
for (const f of fs.readdirSync(OUT)) if (/^ph-.*\.webp$/.test(f)) fs.unlinkSync(path.join(OUT, f))

const pals = palettes()
let total = 0, count = 0
for (const [shape, w, h, n] of SHAPES) {
  for (let i = 1; i <= n; i++) {
    const pal = pals[(i - 1 + SHAPES.findIndex(s => s[0] === shape)) % pals.length]
    const file = path.join(OUT, `ph-${shape}-${String(i).padStart(2, '0')}.webp`)
    await sharp(Buffer.from(svgFor(shape, w, h, i, pal))).webp({ quality: 74, effort: 6 }).toFile(file)
    total += fs.statSync(file).size; count++
  }
}
console.log(`✓ ${count} placeholders → ${path.relative(ROOT, OUT)}/ (${(total / 1024).toFixed(0)} KB total)${accent ? `, tinted to ${accent}` : ''}`)
