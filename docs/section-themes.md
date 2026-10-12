# Section themes

Each main section of the showcase has its own accent palette on top of the one
design system (the way the dashboard has switchable themes, but chosen by the
route). Layout and copy never change; only the accent moves.

| Section | Routes | Colour |
| --- | --- | --- |
| home | `/` and anything unlisted | LevelUp violet (the brand, unchanged) |
| services | `/services` | deep emerald / jade |
| projects | `/projects`, `/projects/[id]`, `/project/[id]` | sapphire |
| studio | `/studio` | indigo |
| pricing | `/pricing` | champagne gold |
| about | `/about` | warm terracotta / bronze |
| faq | `/faq` | plum |
| contact | `/contact`, `/start-project` | rose |
| legal | `/terms`, `/privacy`, `/cookies`, `/dpa`, `/acceptable-use`, `/services-agreement`, `/levelstudio-terms` | graphite |

## How it works

* `src/styles/section-themes.css` defines, per section and per mode (light and
  `.dark`), a set of OKLCH tokens (`--sec-accent`, `--sec-ink`, `--sec-soft`,
  `--sec-mid`, `--sec-contrast`, `--sec-a1..a4` aurora tints, `--sec-selection`,
  `--sec-ring`, `--sec-underline`, `--sec-grad-a/b`, `--sec-glow`, `--sec-edge`,
  `--sec-tint(-fg)`), selected by `<html data-theme-section="...">`. The CSS file
  is generated: `scripts/section-themes/gen_css.py` (palette parameters in
  `themes.py`, contrast table in `table.py`).
* Every token is registered with `@property` (`syntax: '<color>'`) and `html`
  transitions them over 600 ms (`cubic-bezier(.4, 0, .2, 1)`), so a section change
  morphs the colours instead of snapping. No transition under
  `prefers-reduced-motion`, nor when the light/dark toggle flips (next-themes
  disables transitions for that). Browsers without `@property` support simply
  switch instantly.
* The existing brand tokens are now aliases: `--brand` = `--sec-accent`,
  `--brand-ink` = `--sec-ink`, `--brand-soft` = `--sec-soft`, `--brand-contrast` =
  `--sec-contrast`, `--primary` (soft buttons and chips) = `--sec-tint`. So
  `text-brand`, `bg-brand/10`, `text-brand-ink`, the aurora, the glass shadow, the
  scroll progress bar, the nav underline, focus rings (`ring-sec-ring`), the
  page eyebrows, the pricing highlights, the legal summary box, the footer
  accents and the cursor lens (a whisper of accent in the disc) all follow.
  `.lu-section-glow` (a faint, uniform 280 px wash of the section accent along
  the top edge, no blobs) is shown on every page but home, whose hero carries
  its own aurora.
* Brand marks never change: the logo star, the intro, the particle star, the
  orbit star and the LevelStudio icon use fixed violet (`--lu-violet`, hex).
  LevelStudio / dashboard product replicas keep their own palettes.
* Setting the attribute: the pages are statically generated, so the layout
  does not read the route on the server (that would make every page dynamic).
  Instead a small inline script in `<head>` sets the attribute from
  `location.pathname` before the first paint (no flash), using the same table as
  the client (`src/lib/section-theme.ts`). On client-side navigation
  `<SectionTheme />` keeps it in sync; during a page transition the new value is
  applied when the panel starts to lift so the morph is seen (see
  `docs/levelup-transition.md`). Without JavaScript the home palette applies.
* The transition panel's edge, swash and progress hairline take the
  destination's `--sec-edge` (read through a throw-away probe element from the
  stylesheet, so the CSS stays the single source of truth).

## Palette and contrast

OKLCH. Backgrounds: light page `oklch(0.985 0.002 286)`, card white; dark page
`oklch(0.12 0 0)`, card `oklch(0.16 0 0)`; dark ink surfaces
`oklch(0.15 0.008 286)` / `oklch(0.175 0.01 286)`. Ratios are WCAG 2.x.
Requirements: ink text >= 4.5 on page, card and on a 10% accent tint; text on
accent fills >= 4.5; soft text on the ink surfaces >= 4.5; selection (page text
on the selection colour) >= 4.5; accent graphics and focus ring >= 3 on the page.
The home values are the original brand hexes (kept exactly), so home's white on
`#8b5cf6` is 4.2:1 (it is an icon-only button, 3:1 applies; unchanged from before).

| Section | Mode | accent | ink (text) | ink/page | ink/card | accent/page | text on accent | soft on ink surfaces | selection (page text on it) | focus ring/page |
|---|---|---|---|---|---|---|---|---|---|---|
| home | light | `#8b5cf6` | `#6d28d9` | 6.8 | 7.1 | 4.1 | 4.2 | 10.2 | 14.0 | 4.1 |
| home | dark | `#8b5cf6` | `#c8b3fe` | 11.0 | 10.5 | 4.8 | 4.2 | 10.2 | 9.2 | 7.5 |
| services | light | `oklch(0.6 0.125 165)` | `oklch(0.46 0.096 165)` | 6.5 | 6.8 | 3.6 | 5.2 | 12.9 | 14.5 | 3.6 |
| services | dark | `oklch(0.72 0.14 165)` | `oklch(0.86 0.1 165)` | 13.8 | 13.2 | 8.7 | 8.3 | 12.9 | 8.4 | 8.7 |
| projects | light | `oklch(0.55 0.147 248)` | `oklch(0.45 0.121 248)` | 7.1 | 7.4 | 4.6 | 4.8 | 12.1 | 14.2 | 4.6 |
| projects | dark | `oklch(0.7 0.15 248)` | `oklch(0.85 0.078 248)` | 12.9 | 12.4 | 7.6 | 7.3 | 12.1 | 8.8 | 7.6 |
| studio | light | `oklch(0.52 0.21 273)` | `oklch(0.44 0.2 273)` | 8.0 | 8.4 | 5.7 | 5.9 | 12.3 | 14.1 | 5.7 |
| studio | dark | `oklch(0.68 0.168 273)` | `oklch(0.85 0.072 273)` | 12.7 | 12.2 | 6.8 | 6.5 | 12.3 | 9.0 | 6.8 |
| pricing | light | `oklch(0.64 0.125 82)` | `oklch(0.49 0.1 82)` | 6.1 | 6.3 | 3.3 | 5.7 | 13.2 | 14.1 | 3.3 |
| pricing | dark | `oklch(0.8 0.13 82)` | `oklch(0.88 0.1 82)` | 14.1 | 13.4 | 10.8 | 10.3 | 13.2 | 8.9 | 10.8 |
| about | light | `oklch(0.62 0.14 42)` | `oklch(0.49 0.13 42)` | 6.3 | 6.6 | 3.7 | 5.1 | 12.5 | 13.9 | 3.7 |
| about | dark | `oklch(0.72 0.14 42)` | `oklch(0.86 0.078 42)` | 13.0 | 12.4 | 7.8 | 7.5 | 12.5 | 9.2 | 7.8 |
| faq | light | `oklch(0.52 0.17 328)` | `oklch(0.45 0.165 328)` | 7.8 | 8.2 | 5.8 | 6.0 | 12.4 | 13.8 | 5.8 |
| faq | dark | `oklch(0.7 0.17 328)` | `oklch(0.86 0.08 328)` | 12.9 | 12.3 | 7.0 | 6.7 | 12.4 | 9.2 | 7.0 |
| contact | light | `oklch(0.58 0.19 8)` | `oklch(0.49 0.185 8)` | 6.7 | 6.9 | 4.5 | 4.7 | 12.9 | 13.8 | 4.5 |
| contact | dark | `oklch(0.72 0.17 8)` | `oklch(0.87 0.07 8)` | 13.3 | 12.7 | 7.5 | 7.2 | 12.9 | 9.3 | 7.5 |
| legal | light | `oklch(0.45 0.02 265)` | `oklch(0.38 0.02 265)` | 9.6 | 10.0 | 7.1 | 7.4 | 12.8 | 14.1 | 7.1 |
| legal | dark | `oklch(0.74 0.02 265)` | `oklch(0.88 0.012 265)` | 14.1 | 13.5 | 8.8 | 8.4 | 12.8 | 8.9 | 8.8 |

Other tokens (aurora, gradient stops, underline, glow, edge, tint) are
decorative and are listed in the CSS file.
