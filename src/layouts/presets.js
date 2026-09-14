// Column presets used by RowLayout. Each preset defines column count
// and the CSS grid ratio. Keep this list closed/curated rather than
// letting pages specify arbitrary ratios — for one-off exceptions, use
// a row's `className` escape hatch + a rule in your own custom.css
// instead of adding a new preset for a single use case.
export const presets = {
  full:   { columns: 1, ratio: ['1fr'] },
  even:   { columns: 2, ratio: ['1fr', '1fr'] },
  narrow: { columns: 2, ratio: ['30%', '1fr'] },
  wide:   { columns: 2, ratio: ['1fr', '25%'] },
  third:  { columns: 3, ratio: ['1fr', '1fr', '1fr'] },
}
