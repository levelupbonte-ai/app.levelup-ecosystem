/*!
 * LevelUp signature transition: the editorial panel wipe, signed by hand.
 *
 * An ink panel with a thin accent edge sweeps up the screen, the word
 * "LevelUp" is written across it in one pen signature (L-e-v-e-l, a pen lift,
 * U, p, then an accent swash), and the panel continues upward to reveal the
 * next page. If the next page is ready early the pen hurries to finish; if it
 * is slow the signature completes and holds, and after a moment a quiet status
 * line ("Almost ready…") fades in at the foot of the panel.
 *
 * Motion budget: cover 240 ms, write ~640 ms (cut to ~170 ms once the page is
 * ready), reveal 260 ms. transform / opacity / stroke-dashoffset only, no
 * dependencies. The accent (panel edge, swash, progress hairline) is read from
 * the CSS variable --lu-edge when the host page defines it (the showcase sets
 * it to the colour of the section being entered) and falls back to LevelUp
 * violet everywhere else.
 *
 * One file for the whole ecosystem: the showcase (Next 15), LevelStudio
 * (Vite/React) and the dashboard (Next 16) can load this same module.
 * Integration notes: docs/levelup-transition.md
 *
 *   import { cover, reveal, play, go, intercept, revealOnLoad }
 *     from "https://levelup-ecosystem.com/brand/levelup-transition.js";
 *
 * Also exposed as `window.LevelUpTransition` once loaded.
 */

const config = {
  cover: 240, // ms, panel sweeping in
  reveal: 260, // ms, panel sweeping out
  edge: 6, // px, the accent edge leading (cover) / trailing (reveal) the panel
  hold: 20, // ms fully covered before cover() resolves
  write: 640, // ms, the pen writing "LevelUp" when the page is slow
  finish: 170, // ms, the pen hurrying to finish once the page is ready
  /** ms of holding (page still loading) before the status line fades in. */
  waitAfter: 1200,
  /** ms of holding before it switches to the second message. */
  waitLongAfter: 4000,
  /** Status lines, by language. */
  messages: {
    en: ["Almost ready…", "Still loading — thanks for your patience"],
    fr: ["Presque prêt…", "Toujours en cours — merci de votre patience"],
  },
  /** Panel colour; null = the page's --foreground (ink on light, paper on dark). */
  panel: null,
  /** Pen colour; null = the page's --background. */
  ink: null,
  /** Accent override; null = the page's --lu-edge, then LevelUp violet. */
  accent: null,
  /** Cookie domain used to hand the wipe over to another LevelUp app. */
  domain: null,
};

const VIOLET = "#8B5CF6";
const FALLBACK_PANEL = "#0E0E12";
const FALLBACK_INK = "#FAFAFD";

// The signature. Hand-authored pen path (control points -> centripetal
// Catmull-Rom -> pointed-pen width model), see docs/levelup-transition.md.
//   f: the inked shape (thick downstrokes, hairline upstrokes)
//   m: the centre line, revealed by an animated stroke-dashoffset mask
//   k: [time, distance] keyframes of the pen speed (slow in tight curves)
//   t: [start, length] on the write timeline (fractions)
const SIGNATURE = __SIG__;

const EASE_IN_OUT = "cubic-bezier(0.76, 0, 0.24, 1)";
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_IN = "cubic-bezier(0.7, 0, 0.84, 0)";
const HANDOFF_COOKIE = "lu_wipe";
const SVG_NS = "http://www.w3.org/2000/svg";

let root = null;
let panel = null;
let glint = null;
let sign = null; // the <svg> signature
let halo = null;
let status = null; // the status line at the foot of the panel
let statusText = null;
let statusBar = null;
let live = null; // polite live region for assistive tech
let penMasks = []; // the animated mask paths, stroke by stroke
let penStarted = 0; // performance.now() when the pen started
let holdTimers = [];
let state = "idle"; // idle | covering | covered | revealing
let gen = 0; // bumped on every cover()/hideNow(): a stale reveal() bails out

const hasDOM = typeof window !== "undefined" && typeof document !== "undefined";

function reducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function style(el, props) {
  for (const key in props) el.style[key] = props[key];
  return el;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function finished(animation) {
  return animation.finished.catch(() => undefined);
}

function cssVar(name) {
  try {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  } catch {
    return "";
  }
}

function panelColor() {
  return config.panel || cssVar("--foreground") || FALLBACK_PANEL;
}

function inkColor() {
  return config.ink || cssVar("--background") || FALLBACK_INK;
}

function accentColor() {
  return config.accent || cssVar("--lu-edge") || VIOLET;
}

/** "fr" when the visitor chose French (lu_locale cookie or storage), else <html lang>. */
function language() {
  try {
    const cookie = document.cookie.match(/(?:^|;\s*)lu_locale=(en|fr)\b/);
    if (cookie) return cookie[1];
  } catch {
    /* ignore */
  }
  try {
    const stored = window.localStorage.getItem("lu_locale");
    if (stored === "en" || stored === "fr") return stored;
  } catch {
    /* ignore */
  }
  const lang = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
  return config.messages[lang] ? lang : "en";
}

function layer(extra) {
  return style(document.createElement("div"), {
    position: "absolute",
    inset: "0",
    transform: "translate3d(0, calc(100% + 8px), 0)",
    willChange: "transform",
    ...extra,
  });
}

function signatureMarkup() {
  const S = SIGNATURE;
  const masks = S.strokes
    .map(
      (s, i) =>
        `<mask id="lu-pen-m${i}" maskUnits="userSpaceOnUse" x="${S.vb[0] - 20}" y="${S.vb[1] - 20}" width="${S.vb[2] + 40}" height="${S.vb[3] + 40}"><path data-pen d="${s.m}" pathLength="1" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 2" stroke-dashoffset="1"/></mask>`,
    )
    .join("");
  const n = S.strokes.length;
  const swash = S.flourish;
  const swashMask = `<mask id="lu-pen-m${n}" maskUnits="userSpaceOnUse" x="${S.vb[0] - 20}" y="${S.vb[1] - 20}" width="${S.vb[2] + 40}" height="${S.vb[3] + 40}"><path data-pen d="${swash.m}" pathLength="1" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-dasharray="1 2" stroke-dashoffset="1"/></mask>`;
  const ink = S.strokes
    .map((s, i) => `<g mask="url(#lu-pen-m${i})"><path d="${s.f}"/></g>`)
    .join("");
  return (
    `<svg viewBox="${S.vb.join(" ")}" width="100%" height="100%" xmlns="${SVG_NS}" style="display:block;overflow:visible" fill="currentColor">` +
    `<defs>${masks}${swashMask}</defs>${ink}` +
    `<g mask="url(#lu-pen-m${n})" style="fill:var(--lu-accent, ${VIOLET})"><path d="${swash.f}"/></g></svg>`
  );
}

function build() {
  if (root && root.isConnected) return;
  root = style(document.createElement("div"), {
    position: "fixed",
    inset: "0",
    zIndex: "2147483000",
    pointerEvents: "none",
    overflow: "hidden",
    visibility: "hidden",
    contain: "strict",
  });
  root.setAttribute("data-lu-transition", "");
  root.setAttribute("aria-hidden", "true");

  panel = layer({ background: FALLBACK_PANEL });
  // Accent hairlines riding on the panel: leading edge on the way in,
  // trailing edge on the way out. Off screen while fully covered.
  for (const side of ["top", "bottom"]) {
    const line = style(document.createElement("div"), {
      position: "absolute",
      left: "0",
      right: "0",
      height: `${config.edge}px`,
      background: "var(--lu-accent, " + VIOLET + ")",
    });
    line.setAttribute("data-edge", "");
    line.style[side] = `-${config.edge}px`;
    panel.appendChild(line);
  }

  // The signature, centred. Width clamps so it stays a signature, not a banner.
  glint = style(document.createElement("div"), {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "clamp(230px, 34vw, 420px)",
    aspectRatio: `${SIGNATURE.vb[2]} / ${SIGNATURE.vb[3]}`,
    transform: "translate(-50%, -52%)",
    color: FALLBACK_INK,
    willChange: "transform, opacity",
  });
  halo = style(document.createElement("div"), {
    position: "absolute",
    inset: "-45% -30%",
    borderRadius: "50%",
    opacity: "0",
    background:
      "radial-gradient(closest-side, color-mix(in srgb, var(--lu-accent, " +
      VIOLET +
      ") 30%, transparent) 0%, transparent 100%)",
  });
  const wrap = style(document.createElement("div"), {
    position: "absolute",
    inset: "0",
  });
  wrap.innerHTML = signatureMarkup();
  sign = wrap;
  glint.appendChild(halo);
  glint.appendChild(wrap);
  penMasks = Array.from(wrap.querySelectorAll("[data-pen]"));

  // Status line (only ever shown when the next page is slow).
  status = style(document.createElement("div"), {
    position: "absolute",
    left: "0",
    right: "0",
    bottom: "max(28px, calc(env(safe-area-inset-bottom, 0px) + 22px))",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "0 24px",
    textAlign: "center",
    opacity: "0",
    visibility: "hidden",
    color: FALLBACK_INK,
    font: "500 13px/1.5 var(--font-jetbrains, ui-monospace, SFMono-Regular, Menlo, monospace)",
    letterSpacing: "0.04em",
  });
  statusText = document.createElement("span");
  const track = style(document.createElement("span"), {
    position: "relative",
    display: "block",
    width: "96px",
    height: "1px",
    overflow: "hidden",
    background: "currentColor",
    opacity: "1",
  });
  // the track is the faint base, the bar the moving accent
  track.style.background = "color-mix(in srgb, currentColor 18%, transparent)";
  statusBar = style(document.createElement("span"), {
    position: "absolute",
    top: "0",
    left: "0",
    height: "100%",
    width: "42%",
    background: "var(--lu-accent, " + VIOLET + ")",
    transform: "translate3d(-100%, 0, 0)",
    willChange: "transform",
  });
  track.appendChild(statusBar);
  status.appendChild(statusText);
  status.appendChild(track);

  live = style(document.createElement("div"), {
    position: "fixed",
    width: "1px",
    height: "1px",
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
    whiteSpace: "nowrap",
  });
  live.setAttribute("role", "status");
  live.setAttribute("aria-live", "polite");

  root.appendChild(panel);
  root.appendChild(glint);
  root.appendChild(status);
  document.body.appendChild(root);
  document.body.appendChild(live);
}

function paint() {
  const accent = accentColor();
  root.style.setProperty("--lu-accent", accent);
  panel.style.background = panelColor();
  const ink = inkColor();
  glint.style.color = ink;
  status.style.color = ink;
}

function show() {
  build();
  paint();
  root.style.visibility = "visible";
  root.style.pointerEvents = "auto";
}

function cancelAll() {
  for (const el of [panel, glint, halo, sign, status, statusText, statusBar, ...penMasks]) {
    if (!el) continue;
    for (const a of el.getAnimations()) a.cancel();
  }
}

function clearHold() {
  for (const t of holdTimers) clearTimeout(t);
  holdTimers = [];
  if (status) {
    for (const a of status.getAnimations()) a.cancel();
    for (const a of statusText.getAnimations()) a.cancel();
    for (const a of statusBar.getAnimations()) a.cancel();
    status.style.visibility = "hidden";
    status.style.opacity = "0";
  }
  if (live) live.textContent = "";
}

function hideNow() {
  if (!root) return;
  gen++;
  clearHold();
  cancelAll();
  root.style.visibility = "hidden";
  root.style.pointerEvents = "none";
  state = "idle";
}

function slide(el, from, to, duration, delay) {
  return el.animate(
    [
      { transform: `translate3d(0, ${from}, 0)` },
      { transform: `translate3d(0, ${to}, 0)` },
    ],
    { duration, delay, easing: EASE_IN_OUT, fill: "forwards" },
  );
}

/** Starts the pen. `at` = ms from now; `total` = ms the full signature takes. */
function startPen(at, total) {
  penStarted = performance.now() + at;
  SIGNATURE.strokes.concat([SIGNATURE.flourish]).forEach((s, i) => {
    const mask = penMasks[i];
    if (!mask) return;
    const keyframes = s.k
      ? s.k.map(([t, d]) => ({ offset: t, strokeDashoffset: String(1 - d) }))
      : [
          { offset: 0, strokeDashoffset: "1" },
          { offset: 1, strokeDashoffset: "0" },
        ];
    mask.animate(keyframes, {
      duration: Math.max(1, s.t[1] * total),
      delay: at + s.t[0] * total,
      easing: "linear",
      fill: "both",
    });
  });
  halo.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: total * 0.7,
    delay: at,
    easing: "ease-out",
    fill: "forwards",
  });
  // Ink settle: when the last stroke lands the word relaxes a hair.
  const mine = gen;
  Promise.all(penAnimations().map(finished)).then(() => {
    if (mine !== gen || state === "idle" || penRemaining() > 0) return;
    sign.animate([{ transform: "scale(1.02)" }, { transform: "scale(1)" }], {
      duration: 320,
      easing: EASE_OUT,
      fill: "forwards",
    });
  });
}

/** Jumps the pen to the end (signature complete). */
function finishPenNow() {
  for (const a of penMasks.flatMap((m) => m.getAnimations())) a.finish();
  halo.style.opacity = "1";
}

function penAnimations() {
  return penMasks.flatMap((m) => m.getAnimations());
}

function penRemaining() {
  let remaining = 0;
  for (const a of penAnimations()) {
    const t = a.effect && a.effect.getComputedTiming();
    if (!t) continue;
    const local = a.currentTime == null ? 0 : Number(a.currentTime);
    remaining = Math.max(remaining, (t.endTime - local) / (a.playbackRate || 1));
  }
  return remaining;
}

/** The status line: shows after `waitAfter` of holding, switches after `waitLongAfter`. */
function startHold() {
  clearHold();
  const lines = config.messages[language()] || config.messages.en;
  const showLine = (index) => {
    if (state !== "covered" && state !== "covering") return;
    statusText.textContent = lines[index] || lines[0];
    if (live) live.textContent = statusText.textContent;
    if (index === 0) {
      status.style.visibility = "visible";
      status.animate(
        [
          { opacity: 0, transform: "translate3d(0, 8px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        { duration: 380, easing: EASE_OUT, fill: "forwards" },
      );
      statusBar.animate(
        [
          { transform: "translate3d(-100%, 0, 0)" },
          { transform: "translate3d(240%, 0, 0)" },
        ],
        { duration: 1500, iterations: Infinity, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
      );
    } else {
      statusText.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 320,
        easing: "ease-out",
      });
    }
  };
  holdTimers.push(setTimeout(() => showLine(0), config.waitAfter));
  holdTimers.push(setTimeout(() => showLine(1), config.waitLongAfter));
}

/** Sweeps the panel in until the screen is covered. Resolves when covered. */
export function cover() {
  if (!hasDOM || reducedMotion()) return Promise.resolve();
  show();
  cancelAll();
  clearHold();
  gen++;
  state = "covering";
  const a = slide(panel, "calc(100% + 8px)", "0", config.cover, 0);
  // The pen touches down as the panel reaches the middle of the screen.
  startPen(config.cover * 0.5, config.write);
  announce("cover");
  return finished(a)
    .then(() => wait(config.hold))
    .then(() => {
      if (state === "covering") {
        state = "covered";
        startHold();
      }
    });
}

/** Sweeps the panel away, revealing the page. Resolves when done. */
export async function reveal() {
  if (!hasDOM || !root || state === "idle") return;
  const mine = gen;
  clearHold();
  // The page is ready: let the pen hurry to the end of the word instead of
  // making people wait for a full write.
  const remaining = penRemaining();
  if (remaining > 0) {
    const rate = Math.min(8, Math.max(1, remaining / config.finish));
    for (const a of penAnimations()) a.updatePlaybackRate(rate);
    await wait(Math.min(remaining, config.finish) + 24);
  }
  if (mine !== gen || state === "idle") return;
  state = "revealing";
  announce("reveal");
  // The signed word lifts away just ahead of the panel.
  glint.animate(
    [
      { opacity: 1, transform: "translate(-50%, -52%)" },
      { opacity: 1, offset: 0.3 },
      { opacity: 0, transform: "translate(-50%, -58%)" },
    ],
    { duration: 300, easing: EASE_IN, fill: "forwards" },
  );
  const a = slide(panel, "0", "calc(-100% - 8px)", config.reveal, 60);
  await finished(a);
  if (mine === gen && state === "revealing") hideNow();
}

function announce(phase) {
  try {
    document.dispatchEvent(new CustomEvent("lu-transition", { detail: { phase } }));
  } catch {
    /* ignore */
  }
}

/** Cover, run `during` (navigate, swap content…), then reveal. */
export async function play(during) {
  await cover();
  try {
    if (during) await during();
  } finally {
    await reveal();
  }
}

function cookieDomain() {
  if (config.domain) return config.domain;
  const host = location.hostname;
  return /(^|\.)levelup-ecosystem\.com$/.test(host)
    ? ".levelup-ecosystem.com"
    : null;
}

/** True for links to another LevelUp app (studio., dashboard., the showcase). */
export function isEcosystemUrl(url) {
  try {
    const u = typeof url === "string" ? new URL(url, location.href) : url;
    return /(^|\.)levelup-ecosystem\.com$/.test(u.hostname);
  } catch {
    return false;
  }
}

function setHandoff(url) {
  const domain = cookieDomain();
  if (!domain) return;
  try {
    const u = new URL(url, location.href);
    if (u.host === location.host || !isEcosystemUrl(u)) return;
    document.cookie = `${HANDOFF_COOKIE}=1; Domain=${domain}; Path=/; Max-Age=10; SameSite=Lax; Secure`;
  } catch {
    /* ignore */
  }
}

/**
 * Full-page navigation with the wipe: cover, then load `url`. Another LevelUp
 * app can finish the wipe with revealOnLoad(), so it feels like one product.
 */
export function go(url, options = {}) {
  if (!hasDOM) return Promise.resolve();
  setHandoff(url);
  return cover().then(() => {
    if (options.replace) location.replace(url);
    else location.assign(url);
  });
}

/**
 * Call once, as early as possible, on page load: when the visitor arrives from
 * another LevelUp app through go(), start covered and sweep the panel away.
 * Pair it with levelup-transition.css to avoid any flash before this runs.
 */
export function revealOnLoad() {
  if (!hasDOM) return Promise.resolve(false);
  const html = document.documentElement;
  const flagged =
    new RegExp(`(?:^|;\\s*)${HANDOFF_COOKIE}=1`).test(document.cookie) &&
    html.classList.contains("lu-wipe-in");
  const domain = cookieDomain();
  document.cookie = `${HANDOFF_COOKIE}=; Path=/; Max-Age=0${domain ? `; Domain=${domain}` : ""}`;
  if (!flagged) {
    html.classList.remove("lu-wipe-in");
    return Promise.resolve(false);
  }
  if (reducedMotion()) {
    html.classList.remove("lu-wipe-in");
    return Promise.resolve(false);
  }
  show();
  cancelAll();
  panel.animate([{ transform: "translate3d(0, 0, 0)" }], {
    duration: 0,
    fill: "forwards",
  });
  // The word was written in the other app: arrive with it already signed.
  startPen(0, 1);
  finishPenNow();
  state = "covered";
  html.classList.remove("lu-wipe-in");
  return wait(90)
    .then(reveal)
    .then(() => true);
}

/**
 * Click delegation for plain <a href> links.
 * - same-origin links: `onInternal(href)` (an SPA router), or a full load with the wipe;
 * - links to other LevelUp apps: go(href).
 * Modified clicks, target="_blank", downloads, `data-no-transition` links and
 * reduced-motion visitors are left to the browser / router.
 * Returns a function that removes the listener.
 */
export function intercept(options = {}) {
  if (!hasDOM) return () => {};
  const { onInternal, isExternal = isEcosystemUrl } = options;
  const handler = (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      reducedMotion()
    ) {
      return;
    }
    const anchor =
      event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (
      !anchor ||
      anchor.hasAttribute("download") ||
      anchor.closest("[data-no-transition]")
    ) {
      return;
    }
    const target = anchor.getAttribute("target");
    if (target && target !== "_self") return;
    let url;
    try {
      url = new URL(anchor.href, location.href);
    } catch {
      return;
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") return;
    if (url.origin === location.origin) {
      // Same page (only the hash differs): native scrolling.
      if (url.pathname === location.pathname && url.search === location.search)
        return;
      event.preventDefault();
      const href = url.pathname + url.search + url.hash;
      if (onInternal) onInternal(href, anchor);
      else go(href);
    } else if (isExternal(url)) {
      event.preventDefault();
      go(url.href);
    }
  };
  document.addEventListener("click", handler, true);
  return () => document.removeEventListener("click", handler, true);
}

/** Override durations, colours, messages or the handoff cookie domain. */
export function configure(options = {}) {
  Object.assign(config, options);
}

if (hasDOM) {
  // Back/forward cache: a page left mid-wipe must come back uncovered.
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) hideNow();
  });
  window.LevelUpTransition = {
    cover,
    reveal,
    play,
    go,
    intercept,
    revealOnLoad,
    configure,
    isEcosystemUrl,
  };
}
