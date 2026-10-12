# LevelUp signature transition (the pen-written wipe)

One brand transition for the whole ecosystem. An ink panel with a thin accent
edge sweeps up the screen, the word **LevelUp** is written across it in a
single pen signature (L-e-v-e-l, a pen lift, U, p, then an accent swash), and
the panel continues upward to reveal the next page. If the next page is ready
early the pen hurries to finish; if it is slow the signature completes and
holds, and a quiet status line appears at the foot of the panel.
Pure JS/CSS, no dependencies, transform / opacity / stroke-dashoffset only.
The panel takes the page's `--foreground` colour (ink on the light theme,
paper on the dark one), the pen the page's `--background`.

| File | What it is |
| --- | --- |
| `public/brand/levelup-transition.js` | The animation. Framework-agnostic ES module, also sets `window.LevelUpTransition`. Single source of truth. |
| `public/brand/levelup-transition.css` | Pre-paint cover for a page arriving through the wipe from another LevelUp app (unchanged). |
| `src/components/brand/levelup-transition.tsx` | Next.js (app router) wiring: `<LevelUpTransitions />` and `useTransitionRouter()`. |
| `scripts/signature/` | Generator of the signature path (see below). |

Both public files are served from `https://levelup-ecosystem.com/brand/`.

## Timing

| Phase | Time |
| --- | --- |
| Cover (panel sweeps in) | 240 ms (`cover`) |
| The pen touches down when the panel reaches the middle | at 120 ms |
| Write, page still loading | 640 ms (`write`), varying speed (slow in tight loops, fast on long strokes) |
| Write, page ready early | the pen hurries: the rest is finished in at most 170 ms (`finish`) |
| Ink settle | 320 ms, as the last stroke lands (the word relaxes from 1.02 to 1) |
| Reveal (panel sweeps out) | 260 ms (+60 ms), the signed word lifts away just ahead of it |

A typical client-side navigation is therefore about 0.7 s end to end; a slow
one holds on the finished signature. `prefers-reduced-motion: reduce`: no
overlay at all, links behave natively.

## "Almost ready" status line

While the panel is holding because the route is still loading (the time between
`cover()` resolving and `reveal()` being called) a small status line fades in
at the bottom of the panel, with a fine animated progress hairline in the
accent colour:

* after 1.2 s (`waitAfter`): "Almost ready…" / "Presque prêt…"
* after 4 s (`waitLongAfter`): "Still loading — thanks for your patience" /
  "Toujours en cours — merci de votre patience"

The language comes from the `lu_locale` cookie (or localStorage), then
`<html lang>`; English is the default. The line is removed instantly on reveal,
and also announced politely to assistive technology (`role="status"`).
Texts are overridable: `configure({ messages: { en: [a, b], fr: [a, b] } })`.

## The signature path

The path is hand-authored, not traced from a font (so there is no font
licence in the way):

1. `scripts/signature/sig.py` holds the control points of each stroke in an
   upright design space (baseline 140, x-height 62, ascender/cap 124, descender
   70), one open stroke for `Level` (the L's hook and loop flow into e-v-e-l, so
   it is one continuous pen movement), one for `U`, one for `p` (stem, loop,
   retrace, bowl), plus the accent swash. A 12-degree forward slant is applied.
2. `pen.py` turns the points into a centripetal Catmull-Rom spline and gives it
   a pointed-pen width model: the line is thick when the pen moves down the
   slanted stem direction and a hairline on upstrokes, with tapered entries and
   exits (width 2.0 to 7.0 units on a 530 unit wide drawing).
3. `gen.py` outputs, per stroke, the inked outline (simplified with
   Ramer-Douglas-Peucker, smoothed with quadratic segments), the centre line,
   the pen speed profile (`1 / (1 + 14 * curvature)` with slow in / slow out,
   sampled as time/distance keyframes) and the timeline slot (strokes are
   timed by their cost, with a pen lift between `Level`, `U` and `p`).
4. `build_js.py` injects that JSON into `template.js`, giving
   `public/brand/levelup-transition.js`.

At run time each stroke's outline is masked by its own centre line, drawn with
an animated `stroke-dashoffset` (`pathLength=1`), which is what makes variable
width ink appear as a real pen stroke.

```
cd scripts/signature
python3 gen.py                                   # needs numpy; writes sigdata.json
python3 build_js.py ../../public/brand/levelup-transition.js
```

## API (unchanged, backward compatible)

```js
import {
  cover,        // () => Promise: panel sweeps in until the screen is covered (the pen keeps writing)
  reveal,       // () => Promise: the pen hurries to finish, the panel sweeps out
  play,         // (during?) => Promise: cover, await during(), reveal
  go,           // (url, { replace? }) => Promise: cover, then full-page navigation
  intercept,    // ({ onInternal?, isExternal? }) => uninstall: click delegation for <a href>
  revealOnLoad, // () => Promise<boolean>: finish a wipe started in another LevelUp app
  configure,    // ({ cover, reveal, edge, hold, write, finish, waitAfter, waitLongAfter, messages, panel, ink, accent, domain })
} from "https://levelup-ecosystem.com/brand/levelup-transition.js";
```

* New and optional: the module dispatches `lu-transition` events on `document`
  (`detail.phase` is `"cover"` or `"reveal"`), and reads three CSS variables
  from `<html>` when the host page defines them: `--foreground` (panel),
  `--background` (pen), `--lu-edge` (accent of the edge, the swash, the halo
  and the progress hairline; LevelUp violet `#8B5CF6` when absent). Other apps
  need no change.
* Modified clicks, `target="_blank"`, `download`, hash-only links and anything
  inside `[data-no-transition]` are never intercepted.
* Back/forward cache: a page restored mid-wipe comes back uncovered.
* Cross-app handoff: `go()` to another `*.levelup-ecosystem.com` host sets a
  10-second `lu_wipe` cookie; a destination that painted the pre-paint cover
  calls `revealOnLoad()`, arrives with the word already signed and sweeps the
  panel away.

## This site

`src/components/navigation-transition.tsx` (mounted by the root layout)
renders `<LevelUpTransitions />`, which loads the module once and plays the
wipe for internal links (cover, `router.push`, wait for the route, reveal)
and for links to LevelStudio and the dashboard (cover, full load). It never
stays covered more than 10 s. For programmatic navigation use
`useTransitionRouter()`.

Section themes: before the cover it sets `--lu-edge` on `<html>` to the
destination section's colour (see `docs/section-themes.md`), and it applies the
new `data-theme-section` the moment the panel starts to lift (the module's
`lu-transition` "reveal" event), so the 600 ms colour morph is seen on the
revealed page.

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
3. Optional: define `--foreground`, `--background` (the panel and the pen
   follow the app's light/dark theme) and `--lu-edge` (accent) on `<html>`.
   The status line uses the `--font-jetbrains` variable when present and a
   monospace stack otherwise; the page language comes from the `lu_locale`
   cookie or `<html lang>`.

Keep the total under ~800 ms: the wipe is a signature, not a loading screen.
