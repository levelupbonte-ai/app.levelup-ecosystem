# LevelUp signature transition (editorial panel wipe)

One brand transition for the whole ecosystem: a thin violet edge leads an ink
panel up the screen, the LevelUp star glints at the centre, then the panel
continues upward with the violet edge trailing to reveal the next page.
About 650 ms, transform/opacity only, no dependencies. The panel takes the
page's `--foreground` colour (ink on the light theme, paper on the dark one).

| File | What it is |
| --- | --- |
| `public/brand/levelup-transition.js` | The animation. Framework-agnostic ES module, also sets `window.LevelUpTransition`. Single source of truth. |
| `public/brand/levelup-transition.css` | Pre-paint cover for a page arriving through the wipe from another LevelUp app. |
| `src/components/brand/levelup-transition.tsx` | Next.js (app router) wiring: `<LevelUpTransitions />` and `useTransitionRouter()`. |

Both public files are served from `https://levelup-ecosystem.com/brand/`.

## API

```js
import {
  cover,        // () => Promise: panel sweeps in until the screen is covered
  reveal,       // () => Promise: panel sweeps out
  play,         // (during?) => Promise: cover, await during(), reveal
  go,           // (url, { replace? }) => Promise: cover, then full-page navigation
  intercept,    // ({ onInternal?, isExternal? }) => uninstall: click delegation for <a href>
  revealOnLoad, // () => Promise<boolean>: finish a wipe started in another LevelUp app
  configure,    // ({ cover, reveal, edge, hold, panel, domain })
} from "https://levelup-ecosystem.com/brand/levelup-transition.js";
```

- `prefers-reduced-motion: reduce`: no overlay, links behave natively.
- Modified clicks, `target="_blank"`, `download`, hash-only links and anything
  inside `[data-no-transition]` are never intercepted.
- Back/forward cache: a page restored mid-wipe comes back uncovered.
- Cross-app handoff: `go()` to another `*.levelup-ecosystem.com` host sets a
  10-second `lu_wipe` cookie; a destination that painted the pre-paint cover
  calls `revealOnLoad()` and sweeps the panel away.

## This site

`src/components/navigation-transition.tsx` (mounted by the root layout)
renders `<LevelUpTransitions />`, which loads the module once and plays the
wipe for internal links (cover, `router.push`, wait for the route, reveal)
and for links to LevelStudio and the dashboard (cover, full load). For
programmatic navigation use `useTransitionRouter()`.

## Other LevelUp apps

1. In `<head>` (pre-paint cover when arriving through the wipe):

   ```html
   <link rel="stylesheet" href="https://levelup-ecosystem.com/brand/levelup-transition.css" />
   <script>
     /(?:^|;\s*)lu_wipe=1/.test(document.cookie) &&
       !matchMedia("(prefers-reduced-motion: reduce)").matches &&
       document.documentElement.classList.add("lu-wipe-in");
   </script>
   ```

2. Once at the app root: `import()` the module, call `revealOnLoad()`, then
   `intercept({ onInternal: (href) => t.play(() => navigate(href)) })` with
   the app's own router. If a strict CSP is in place, allow
   `https://levelup-ecosystem.com` in `script-src` / `style-src`, or copy both
   files into the app's `public/brand/`.

Keep the total under ~700 ms: the wipe is a signature, not a loading screen.
