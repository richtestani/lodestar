<!--
  PdfDocument — a PDF as a link card (default) or shown in the page.

  display: 'link'   → a card that opens the PDF in a new tab. Works on
                      every device and with every screen reader.
  display: 'inline' → the browser's own PDF viewer in an <iframe>, with the
                      link card underneath. Phones get only the card:
                      iOS and most Android browsers render just the first
                      page in a frame, which reads as a broken document.

  An <iframe>, not <object>: Lodestar's CSP sets object-src 'none'. The
  CSP's frame-src needs 'self' for local PDFs — see deploy/nginx.conf.txt.
-->
<template>
  <div class="mpdf" :class="{ 'mpdf--inline': display === 'inline' }">
    <iframe
      v-if="display === 'inline'"
      class="mpdf-frame"
      :src="url"
      :title="title"
      loading="lazy"
      :style="{ height }"
    ></iframe>
    <a class="mpdf-card" :href="url" target="_blank" rel="noopener">
      <svg class="mpdf-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
        <path d="M14 2v6h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
        <text x="12" y="17.5" text-anchor="middle" font-size="5.2" font-weight="700" fill="currentColor" font-family="system-ui, sans-serif">PDF</text>
      </svg>
      <span class="mpdf-text">
        <span class="mpdf-title">{{ title }}</span>
        <span v-if="description" class="mpdf-desc">{{ description }}</span>
        <span class="mpdf-meta">{{ display === 'inline' ? 'Open full screen' : 'Open PDF' }}<span class="sr-only"> (opens in a new tab)</span></span>
      </span>
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { media } from '@/composables/useAssets.js'

const props = defineProps({
  src: { type: String, required: true },
  title: { type: String, default: '' },
  description: String, // one line under the title: "2 pages · updated March 2026"
  display: { type: String, default: 'link' },
  height: { type: String, default: 'min(80vh, 900px)' }, // inline viewer height
})

const url = computed(() => media(props.src))
</script>

<style scoped>
.mpdf-frame { display: block; width: 100%; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
.mpdf--inline .mpdf-card { margin-top: 0.75rem; }

.mpdf-card {
  display: flex; gap: 0.9rem; align-items: center; padding: 0.9rem 1rem;
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  color: var(--text); text-decoration: none; transition: border-color 0.15s, box-shadow 0.15s;
}
.mpdf-card:hover { border-color: var(--primary); box-shadow: var(--shadow); }
.mpdf-card:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.mpdf-icon { flex: none; width: 2.4rem; height: 2.4rem; color: var(--primary); }
.mpdf-text { display: flex; flex-direction: column; min-width: 0; }
.mpdf-title { font-weight: 600; overflow-wrap: anywhere; }
.mpdf-desc { font-size: 0.9rem; color: var(--text-muted); }
.mpdf-meta { font-size: 0.8rem; color: var(--primary); margin-top: 0.15rem; }

.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

@media (max-width: 720px) {
  .mpdf-frame { display: none; }
  .mpdf--inline .mpdf-card { margin-top: 0; }
}
</style>
