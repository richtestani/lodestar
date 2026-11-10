// Only one Lodestar player plays at a time: starting a video or track
// pauses any other. One capture-phase listener on the document covers
// every player on the page (media `play` events don't bubble, but they
// do pass through the capture phase). Installed once, on first mount.
let installed = false

export function useSinglePlayback() {
  if (installed || typeof document === 'undefined') return
  installed = true
  document.addEventListener('play', (e) => {
    const started = e.target
    if (!started?.hasAttribute?.('data-lodestar-player')) return
    for (const el of document.querySelectorAll('[data-lodestar-player]')) {
      if (el !== started && !el.paused) el.pause()
    }
  }, true)
}
