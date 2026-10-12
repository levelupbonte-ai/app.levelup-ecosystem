/**
 * Section themes: which accent palette a route belongs to.
 *
 * The palettes live in src/styles/section-themes.css (OKLCH, light + dark) and
 * are selected by <html data-theme-section="...">. The attribute is set
 * before the first paint by a tiny inline script in the root layout (the
 * pages are statically generated, so reading the route on the server would
 * make every page dynamic) built from the SAME table below, and kept in sync
 * on client-side navigation by <SectionTheme />.
 */

export type SectionTheme =
  | "home"
  | "services"
  | "projects"
  | "studio"
  | "pricing"
  | "about"
  | "faq"
  | "contact"
  | "legal";

/** First path segment -> theme. Anything else (404, errors) is "home". */
export const SECTION_BY_SEGMENT: Record<string, SectionTheme> = {
  services: "services",
  projects: "projects",
  project: "projects",
  studio: "studio",
  pricing: "pricing",
  about: "about",
  faq: "faq",
  contact: "contact",
  "start-project": "contact",
  terms: "legal",
  privacy: "legal",
  cookies: "legal",
  dpa: "legal",
  "acceptable-use": "legal",
  "services-agreement": "legal",
  "levelstudio-terms": "legal"
};

export function sectionForPath(pathname: string | null | undefined): SectionTheme {
  const segment = (pathname ?? "/").split(/[?#]/)[0].split("/").filter(Boolean)[0];
  return (segment && SECTION_BY_SEGMENT[segment]) || "home";
}

/** Inline pre-paint script (same mapping as sectionForPath). */
export const SECTION_THEME_SCRIPT = `(function(){try{var m=${JSON.stringify(
  SECTION_BY_SEGMENT
)};var s=location.pathname.split("/").filter(Boolean)[0];document.documentElement.setAttribute("data-theme-section",(s&&m[s])||"home")}catch(e){}})();`;

let held = false;

/**
 * While a page transition is covering the screen the new section's colours
 * are held back, and applied the moment the panel starts to lift so the
 * morph plays in view (see navigation transition).
 */
export function holdSectionTheme(value: boolean) {
  held = value;
}

export function isSectionThemeHeld() {
  return held;
}

export function applySectionTheme(theme: SectionTheme) {
  const root = document.documentElement;
  if (root.getAttribute("data-theme-section") !== theme) {
    root.setAttribute("data-theme-section", theme);
  }
}

/**
 * The colour the transition panel's edge takes: the destination section's
 * --sec-edge for the current light/dark mode, read from the stylesheet through
 * a throw-away probe element (single source of truth: the CSS).
 */
export function sectionEdgeColor(theme: SectionTheme): string | null {
  try {
    const probe = document.createElement("i");
    probe.setAttribute("data-theme-section", theme);
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:fixed;width:0;height:0;visibility:hidden;pointer-events:none";
    document.body.appendChild(probe);
    const value = getComputedStyle(probe).getPropertyValue("--sec-edge").trim();
    probe.remove();
    return value || null;
  } catch {
    return null;
  }
}
