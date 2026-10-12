# Motion rules of the showcase

## Reveals play once per page load

Entrance and reveal animations (scroll reveals, word reveals, hero entrance,
section fade-ins) play the first time a route is shown during a page load.
Navigating inside the site never replays the reveals of a route already seen;
a hard reload (or a new tab) starts afresh and plays them again.

* `src/lib/play-once.tsx` keeps a module-level `Set` of visited routes (in
  memory only: not `sessionStorage`, so a reload resets it). `<PlayOnceMain />`
  replaces `<main>` in the root layout and decides, during the render that
  mounts the page, whether the route is a revisit: it sets `data-revisit` on
  `<main>` and provides `useRevisit()`.
* CSS reveals (`.lu-reveal`, `.lu-enter*`, `.lu-char`) render their final state
  under `[data-revisit]` (globals.css). Motion-based reveals (`ScrollReveal`,
  `ScrollStagger`, `PremiumServiceBlock`, `PremiumTextSectionReveal`,
  `SplitText`, the mobile showcase) start from their end state when
  `useRevisit()` is true. New reveal components should do the same.
* Scroll-linked effects (a value that follows the scroll position, such as the
  pinned showcase) are not entrance animations and keep following the scroll.
* The first-visit intro (preloader) keeps its own logic.

## Live demos are scrubbed by scroll

`src/components/home/live-demo/engine.tsx`: every frame of a demo is a pure
function of its clock `t`, so `LiveDemo` accepts `scrub`. The clock then eases
(exponential smoothing, about 140 ms) toward `progress x (duration - 500 ms)`
instead of playing on its own, forward and backward, with no loop and no outro
fade. On desktop (sticky panel) the progress is the scroll through the demo's
step (0 when the step reaches the middle of the viewport, 1 when it leaves it;
the two demo steps are 115svh tall to give the scenario room). Where the panel
is not sticky (phones and tablets) it is the window's own travel through the
viewport (`scrub="self"`: 0 with its centre at 86% of the viewport height, 1 at
36%). Reduced motion shows the final frame.

## Light/dark switch

`src/lib/theme-transition.ts`, used by `ThemeToggle` (navbar and footer):
circular View Transition reveal from the button (same effect as the LevelUp
dashboard), instant where the API is unsupported, none under reduced motion.
