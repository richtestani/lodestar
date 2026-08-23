# config/modules/

Optional, per-module sitewide defaults. Most modules don't need a file
here — this is only for when you want every instance of a module to
default to certain settings unless a specific usage overrides them.

## Adding one

1. Create `<name>.js` here, matching a module name from `modules/registry.js`
   (e.g. `gallery.js`, or `parallax.js` for a lodestar-pro-modules module):

   ```js
   // config/modules/gallery.js
   export default { variant: 'masonry' }
   ```

2. Wire it into `config/index.js`:

   ```js
   import gallery from './modules/gallery.js'
   export const moduleDefaults = { gallery }
   ```

That's it — `components/SectionRenderer.vue` merges this under whatever
props a specific `homeSections`/page-`sections` instance sets, so the
instance's own props always win; this only fills gaps you didn't set.

This is a plain object, not auto-discovered — see the comment at the top
of `config/index.js` for why (this file gets loaded by plain Node during
the build, not just by Vite, so `import.meta.glob` isn't usable here).
