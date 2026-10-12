/**
 * Animate a light/dark switch with a circular reveal from the toggle
 * (View Transitions API), the same effect as the LevelUp dashboard. The
 * reveal keyframes live in `src/styles/globals.css`. Falls back to an
 * instant change where the API is unavailable, and never animates under
 * prefers-reduced-motion.
 */
type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<unknown> };
};

export function startThemeTransition(
  apply: () => void,
  origin?: { x: number; y: number }
) {
  const doc = document as ViewTransitionDocument;
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!doc.startViewTransition || reduced) {
    apply();
    return;
  }

  root.style.setProperty("--x", `${origin?.x ?? window.innerWidth / 2}px`);
  root.style.setProperty("--y", `${origin?.y ?? window.innerHeight / 2}px`);
  // The section-colour morph must not run inside the reveal.
  root.classList.add("lu-theme-switching");
  const transition = doc.startViewTransition(apply);
  const done = () => root.classList.remove("lu-theme-switching");
  transition.finished.then(done, done);
}
