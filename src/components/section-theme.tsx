"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";

import {
  applySectionTheme,
  isSectionThemeHeld,
  sectionForPath
} from "@/lib/section-theme";

/**
 * Keeps <html data-theme-section> in step with the route on client-side
 * navigation (the first paint is handled by the inline script in the layout).
 * During a page transition the change is applied by the transition itself, at
 * the moment the panel lifts, so the colour morph is seen.
 */
export function SectionTheme() {
  const pathname = usePathname();
  useEffect(() => {
    if (isSectionThemeHeld()) return;
    applySectionTheme(sectionForPath(pathname));
  }, [pathname]);
  return null;
}

/** Fixed, tinted wash behind the page (hidden on the home page). */
export function SectionGlow() {
  return <div aria-hidden="true" className="lu-section-glow" />;
}
