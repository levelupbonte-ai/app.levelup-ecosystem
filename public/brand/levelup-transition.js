/*!
 * LevelUp signature transition: the editorial panel wipe.
 *
 * A full-screen ink panel with a thin violet leading edge sweeps up the
 * screen, the LevelUp star glints at the centre, then the panel continues
 * upward, violet edge trailing, to reveal the next page. About 650 ms,
 * transform/opacity only (compositor), no dependencies.
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
  cover: 280, // ms, panel sweeping in
  reveal: 290, // ms, panel sweeping out
  edge: 6, // px, the violet edge leading (cover) / trailing (reveal) the panel
  hold: 30, // ms fully covered (the star glint)
  /** Panel colour; null = the page's --foreground (ink on light, paper on dark). */
  panel: null,
  /** Cookie domain used to hand the wipe over to another LevelUp app. */
  domain: null,
};

const VIOLET = "#8B5CF6";
const FALLBACK_PANEL = "#0E0E12";

// The star (public/icon.svg): ten facets around one centre point.
const STAR_FACETS = [
  ["256,278 256,38 202,192", "#C8B3FE"],
  ["256,278 256,38 310,192", "#843FF4"],
  ["256,278 310,192 484,204", "#7327EB"],
  ["256,278 484,204 344,280", "#5111CA"],
  ["256,278 344,280 397,470", "#430BA8"],
  ["256,278 397,470 256,362", "#5211C8"],
  ["256,278 256,362 115,470", "#691CDD"],
  ["256,278 115,470 168,280", "#7C2CF0"],
  ["256,278 168,280 28,204", "#9754FD"],
  ["256,278 28,204 202,192", "#B583FF"],
];

const EASE_IN_OUT = "cubic-bezier(0.76, 0, 0.24, 1)";
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_IN = "cubic-bezier(0.7, 0, 0.84, 0)";
const HANDOFF_COOKIE = "lu_wipe";

let root = null;
let panel = null;
let glint = null;
let state = "idle"; // idle | covering | covered | revealing

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

function panelColor() {
  if (config.panel) return config.panel;
  try {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--foreground")
      .trim();
    return value || FALLBACK_PANEL;
  } catch {
    return FALLBACK_PANEL;
  }
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
  // Violet hairlines riding on the panel: leading edge on the way in,
  // trailing edge on the way out. Off screen while fully covered.
  for (const side of ["top", "bottom"]) {
    const line = style(document.createElement("div"), {
      position: "absolute",
      left: "0",
      right: "0",
      height: `${config.edge}px`,
      background: VIOLET,
    });
    line.style[side] = `-${config.edge}px`;
    panel.appendChild(line);
  }

  const size = "clamp(44px, 7vmin, 72px)";
  glint = style(document.createElement("div"), {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: size,
    height: size,
    transform: "translate(-50%, -50%)",
    opacity: "0",
    willChange: "transform, opacity",
  });
  const halo = style(document.createElement("div"), {
    position: "absolute",
    inset: "-120%",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(139,92,246,0.38) 0%, rgba(139,92,246,0.12) 32%, rgba(139,92,246,0) 64%)",
  });
  const polygons = STAR_FACETS.map(
    ([points, fill]) => `<polygon points="${points}" fill="${fill}"/>`,
  ).join("");
  const star = document.createElement("div");
  star.innerHTML = `<svg viewBox="20 30 472 448" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="display:block">${polygons}</svg>`;
  style(star, { position: "relative", width: "100%", height: "100%" });
  glint.appendChild(halo);
  glint.appendChild(star);

  root.appendChild(panel);
  root.appendChild(glint);
  document.body.appendChild(root);
}

function show() {
  build();
  panel.style.background = panelColor();
  root.style.visibility = "visible";
  root.style.pointerEvents = "auto";
}

function cancelAll() {
  for (const el of [panel, glint]) {
    if (!el) continue;
    for (const a of el.getAnimations()) a.cancel();
  }
}

function hideNow() {
  if (!root) return;
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

/** Sweeps the panel in until the screen is covered. Resolves when covered. */
export function cover() {
  if (!hasDOM || reducedMotion()) return Promise.resolve();
  show();
  cancelAll();
  state = "covering";
  const a = slide(panel, "calc(100% + 8px)", "0", config.cover, 0);
  glint.animate(
    [
      {
        opacity: 0,
        transform: "translate(-50%, -50%) scale(0.55) rotate(-72deg)",
      },
      { opacity: 1, transform: "translate(-50%, -50%) scale(1) rotate(0deg)" },
    ],
    {
      duration: 300,
      delay: config.cover * 0.55,
      easing: EASE_OUT,
      fill: "forwards",
    },
  );
  return finished(a)
    .then(() => wait(config.hold))
    .then(() => {
      if (state === "covering") state = "covered";
    });
}

/** Sweeps the panel away, revealing the page. Resolves when done. */
export function reveal() {
  if (!hasDOM || !root || state === "idle") return Promise.resolve();
  state = "revealing";
  glint.animate(
    [
      { opacity: 1, transform: "translate(-50%, -50%) scale(1) rotate(0deg)" },
      {
        opacity: 0,
        transform: "translate(-50%, -50%) scale(0.8) rotate(36deg)",
      },
    ],
    { duration: 180, easing: EASE_IN, fill: "forwards" },
  );
  const a = slide(panel, "0", "calc(-100% - 8px)", config.reveal, 0);
  return finished(a).then(() => {
    if (state === "revealing") hideNow();
  });
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
  glint.animate([{ opacity: 1, transform: "translate(-50%, -50%) scale(1)" }], {
    duration: 0,
    fill: "forwards",
  });
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

/** Override durations, panel colour or the handoff cookie domain. */
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
