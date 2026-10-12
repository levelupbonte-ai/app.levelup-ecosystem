"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";

import { usePathname } from "next/navigation";

/**
 * Entrance animations play once per route for the lifetime of the document.
 *
 * `seen` is module-level memory (not sessionStorage): it lives exactly as long
 * as this page load, so keeping on navigating inside the site never replays
 * the reveals of a page already seen, while a full reload (or a new tab)
 * starts afresh and plays them again.
 *
 * <PlayOnceMain /> replaces <main>: on a revisit it sets `data-revisit` (the
 * CSS reveals in globals.css render their final state) and provides
 * `useRevisit()` to the motion-based reveals, which then start at their end
 * state. Both are decided during the render that mounts the page, so there is
 * no flash of hidden content. The first-visit intro (preloader) is separate.
 */
const seen = new Set<string>();

const RevisitContext = createContext(false);

/** True when the current route was already shown during this page load. */
export function useRevisit() {
  return useContext(RevisitContext);
}

export function PlayOnceMain({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  // Decided once per route change, before the page's components mount.
  const revisit = useMemo(() => seen.has(pathname), [pathname]);
  useEffect(() => {
    seen.add(pathname);
  }, [pathname]);
  return (
    <RevisitContext.Provider value={revisit}>
      <main data-revisit={revisit ? "true" : undefined}>{children}</main>
    </RevisitContext.Provider>
  );
}
