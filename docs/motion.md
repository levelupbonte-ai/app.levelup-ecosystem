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

# Scroll motion system ("the page assembles as you scroll")

One vocabulary for the whole site, written as plain HTML attributes and driven
by CSS plus a single controller. Copy and layout never change; only motion and
a few decorative layers are added.

| File | Role |
| --- | --- |
| `src/styles/motion.css` | All the CSS: tokens, reveals, word masks, hero entrances, scroll-driven animations, universe glow, pinned chapter, horizontal band, final states. |
| `src/lib/motion.tsx` | `m()`, `mHero()`, `mPar()` prop helpers and `splitWords()` (server-safe). |
| `src/components/motion/primitives.tsx` | `<M>`, `<Headline>`, `<Hero>`, `<Statement>`, `<Count>`, `<Universe>` (no hooks, usable from server components). |
| `src/components/motion/motion-root.tsx` | The one controller (mounted by the root layout): one IntersectionObserver for reveals, scrub progress (`--p`), counters, holds. |

## Safety rules

* Content is in the HTML and visible without JavaScript. An inline script in
  `<head>` sets `html.lu-js` (not under `prefers-reduced-motion`); every hidden
  "before" state is scoped to `html.lu-js`, and the class is dropped again if
  the controller has not started within 8 s. Reduced motion: everything static
  and fully visible (also in the CSS as a last guard).
* Only transform, opacity, clip-path and filter move. Hidden-before-reveal
  never changes layout (no CLS). `will-change` is set only while an element is
  animating (`data-in="run"`), then dropped (`data-in="done"`).
* Play once per route per page load: `main[data-revisit]` (lib/play-once.tsx)
  forces every reveal and hero entrance to its final state. Scroll-scrubbed
  effects (parallax, sheet, statements, pinned chapter, band) follow the scroll
  both ways, as before.
* Held while covered: nothing is revealed while the first-visit intro
  (`html.lu-intro`) or the page transition (`html.lu-covering`, from the
  `lu-transition` events) covers the screen; the pending reveals are released
  as the cover lifts, so they are seen. The hero entrance CSS is paused the
  same way. The intro itself is untouched.
* Mobile: shorter distances and shorter durations (`--m-y`, `--m-dur`), no 3D
  tilt, parallax at 40% (`--m-par`), no second universe glow, no blur on
  statements.

## Primitives

* Reveal: `<M kind="up|fade|left|right|scale|tilt|clip|line|line-v|rule|rule-top" delay={ms}>`
  or `{...m('tilt', { delay })}` on any element. Elements entering together
  are staggered automatically (70 ms, up to 6); `delay` adds to it. `tilt`:
  cards rise from a slight 3D tilt and settle flat. `clip`: a clip-path wipe
  with the picture settling from a zoom. `rule`/`rule-top`: the element's
  hairline is drawn from the left; `DashedLine` draws itself.
* Headline: `<Headline as="h2" hero?>` wraps every word in a mask; the words
  rise out of the clip line, staggered. `hero` plays with the page (pure CSS,
  transform only, no opacity: the text is painted at once, so LCP is not
  delayed) instead of waiting for the scroll. `LensText motion="words"` does
  the same for the homepage headings (the lens copy is split identically).
* `<Hero kind="up|fade" delay>`: eyebrows, leads and buttons at the top of a
  page.
* Statement: `<Statement>` / `LensText motion="stmt"`: each word lights up
  (opacity, a little blur on desktop) as the text crosses the viewport, tied to
  a CSS `view()` timeline (a `--p` fallback where unsupported). One or two per
  page, on short sentences below the fold.
* `<Count value="$850">`: a real figure counts up once (the final text stays in
  the DOM, the box never resizes). Figures below 10 and non-numeric text are
  left as they are. Only real figures are used (plan prices, about stats).
* Parallax: `{...mPar(distance, { img })}` (`data-par`), a `view()` timeline.
  Used on the aurora and grid (two depths), the hero star, device mockups (the
  phone drifts against the screen) and photos. `data-out` lags an element as it
  leaves (home hero).
* `data-sheet`: an ink panel whose clip-path opens on entry and closes on exit
  (How it works).
* Universe: two fixed glows in the section colours, drifting with the page
  scroll (`scroll(root)`), so sections read as one continuous world; the colours
  follow the section theme.
* Progress line: the existing top line (`ScrollProgressBar`) takes the section's
  gradient (`--sec-grad-a/b`).
* Pinned chapter (home, Capabilities): `.m-pin` + `data-scrub="pin"` on
  desktop (>= 1024 px wide and >= 640 px tall); the controller writes `--p`
  and the slides crossfade and drift with it. The same content is the plain
  list (`.m-pin-off`) on phones, tablets, short windows and without motion.
  Where the chapter is pinned the list is `display: none` and the slides are the
  readable copy; the rail on the left is aria-hidden.
* Horizontal band (home, Templates): `.m-band` on desktop (>= 1024 x 720): the
  three templates are pulled sideways across a pinned stage with a progress
  hairline; a normal vertical list elsewhere.

## Using it on a new page

1. Page top: `<Hero kind="fade">` for the eyebrow, `<Headline hero as="h1">`
   for the title, `<Hero delay={260}>` for the lead.
2. Sections: `<Headline as="h2">`, `<M>` for paragraphs and lists, `<M kind="tilt">`
   for cards (the stagger is automatic), `<M kind="clip">` around images.
3. At most one or two `<Statement>`.
4. Never animate layout properties and never hide content with anything other
   than these attributes (they are the only things guarded by `html.lu-js`).
5. Legal pages get only a fade of the header and summary and a drawn rule.
