// richText.js — Markdown for config strings (titles, body paragraphs,
// subtitles…). One markdown-it instance shared by RichText.vue and
// ProseBody.vue so every module formats text the same way.
//
//   **bold**  *italic*  `code`  [link](/about)  ==highlight==
//
// ==highlight== renders as <mark>, which themes color with the accent —
// that's how a title gets its second color:
//   title: 'Experience at the intersection of ==business and technology.=='
//
// Raw HTML is off (html: false): config text can't inject markup.
// A single newline inside a string becomes a <br>.

import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({ html: false, linkify: true, typographer: true, breaks: true })

// ==text== → <mark>text</mark>. Small inline rule rather than another
// dependency. No whitespace allowed just inside the markers, so things
// like "a == b" in prose are left alone.
function highlight(state, silent) {
  const { src, pos: start, posMax: max } = state
  if (src.charCodeAt(start) !== 0x3D || src.charCodeAt(start + 1) !== 0x3D) return false
  if (silent) return false
  const end = src.indexOf('==', start + 2)
  if (end < 0 || end >= max || end === start + 2) return false
  if (/\s/.test(src[start + 2]) || /\s/.test(src[end - 1])) return false

  state.pos = start + 2
  state.posMax = end
  state.push('mark_open', 'mark', 1).markup = '=='
  state.md.inline.tokenize(state)
  state.push('mark_close', 'mark', -1).markup = '=='
  state.pos = end + 2
  state.posMax = max
  return true
}
md.inline.ruler.before('emphasis', 'highlight', highlight)

// External links open in a new tab; internal (/about, #contact) stay put
// and are routed client-side by useRichLinks().
const defaultLinkOpen = md.renderer.rules.link_open ||
  ((tokens, idx, opts, env, self) => self.renderToken(tokens, idx, opts))
md.renderer.rules.link_open = (tokens, idx, opts, env, self) => {
  const href = tokens[idx].attrGet('href') || ''
  if (/^https?:\/\//i.test(href)) {
    tokens[idx].attrSet('target', '_blank')
    tokens[idx].attrSet('rel', 'noopener noreferrer')
  }
  return defaultLinkOpen(tokens, idx, opts, env, self)
}

/** Inline formatting only — no wrapping <p>. For titles, subtitles, one-liners. */
export const renderInline = (text) => md.renderInline(String(text ?? ''))

// A body paragraph that starts with a list marker or a quote needs block
// rendering (it becomes <ul>/<ol>/<blockquote>, not a <p>).
const BLOCK_START = /^\s*(?:[-*+]\s|\d+[.)]\s|>\s?)/

/** True when a body paragraph should render as block markdown. */
export const isBlock = (text) => BLOCK_START.test(String(text ?? ''))

/** Block markdown — lists, quotes. */
export const renderBlock = (text) => md.render(String(text ?? ''))

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" }

/** Formatting stripped — for alt text, aria-labels, anything that must be plain. */
export const plainText = (text) =>
  renderInline(text).replace(/<[^>]*>/g, '').replace(/&(?:amp|lt|gt|quot|#39);/g, (e) => ENTITIES[e])
