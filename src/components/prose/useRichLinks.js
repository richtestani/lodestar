// useRichLinks — markdown links render as plain <a>, which would do a full
// page load. This click handler hands same-site links to the router
// instead. Put it on any element that holds rendered markdown:
//   <div v-html="…" @click="onRichClick" />

import { useRouter } from 'vue-router'

export function useRichLinks() {
  const router = useRouter()

  function onRichClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const a = e.target.closest?.('a[href]')
    if (!a || a.target || a.hasAttribute('download')) return
    const url = new URL(a.href, window.location.href)
    if (url.origin !== window.location.origin) return
    // same-page hash (#contact) — let the browser / scroll-spy handle it
    if (url.pathname === window.location.pathname && url.hash) return
    e.preventDefault()
    router.push(url.pathname + url.search + url.hash)
  }

  return { onRichClick }
}
