"use client";

import { useEffect, useMemo, useRef } from "react";

import { usePathname, useRouter } from "next/navigation";

import {
  applySectionTheme,
  holdSectionTheme,
  sectionEdgeColor,
  sectionForPath
} from "@/lib/section-theme";

/**
 * LevelUp signature transition for Next.js (app router).
 *
 * The animation lives in one framework-agnostic module,
 * public/brand/levelup-transition.js, so every LevelUp app can play the same
 * wipe (see docs/levelup-transition.md). This file wires it to the router:
 *  - internal links: cover → router.push → wait for the new route → reveal;
 *  - links to other LevelUp apps (studio., dashboard.): cover → full load.
 * Section themes: the panel edge takes the destination section's colour, and
 * the new section's palette is applied when the panel starts to lift, so the
 * ~600 ms colour morph is seen on the revealed page (see lib/section-theme.ts).
 * Under prefers-reduced-motion the module stays out of the way and links
 * behave natively.
 */

export const LEVELUP_TRANSITION_SRC = "/brand/levelup-transition.js";

export interface LevelUpTransitionApi {
  cover(): Promise<void>;
  reveal(): Promise<void>;
  play(during?: () => unknown): Promise<void>;
  go(url: string, options?: { replace?: boolean }): Promise<void>;
  intercept(options?: {
    onInternal?: (href: string, anchor: HTMLAnchorElement) => void;
    isExternal?: (url: URL) => boolean;
  }): () => void;
  revealOnLoad(): Promise<boolean>;
  configure(options: Record<string, unknown>): void;
  isEcosystemUrl(url: string | URL): boolean;
}

let modulePromise: Promise<LevelUpTransitionApi | null> | null = null;

/** Loads the shared module once (a few KB, served as a static file). */
export function loadLevelUpTransition(): Promise<LevelUpTransitionApi | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!modulePromise) {
    const src: string = LEVELUP_TRANSITION_SRC;
    modulePromise = import(
      /* webpackIgnore: true */ /* turbopackIgnore: true */ src
    )
      .then((mod) => mod as LevelUpTransitionApi)
      .catch(() => null);
  }
  return modulePromise;
}

type NavigateOptions = { replace?: boolean; scroll?: boolean };

/** Set by <LevelUpTransitions />; used by useTransitionRouter(). */
let activeNavigate:
  ((href: string, options?: NavigateOptions) => Promise<void>) | null = null;

const nextFrames = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

/**
 * Mount once in the root layout. Plays the wipe for every plain link click
 * (internal and LevelUp cross-app); renders nothing.
 */
export function LevelUpTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const apiRef = useRef<LevelUpTransitionApi | null>(null);
  const busyRef = useRef(false);
  const pathRef = useRef(pathname);
  const arrivedRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    pathRef.current = pathname;
    arrivedRef.current?.();
    arrivedRef.current = null;
  }, [pathname]);

  useEffect(() => {
    const navigate = async (href: string, options: NavigateOptions = {}) => {
      const push = () =>
        options.replace
          ? router.replace(href, { scroll: options.scroll })
          : router.push(href, { scroll: options.scroll });
      const api = apiRef.current;
      if (!api || busyRef.current) {
        push();
        return;
      }
      busyRef.current = true;
      const html = document.documentElement;
      const targetPath = href.split(/[?#]/)[0] || "/";
      const section = sectionForPath(targetPath);
      const onPhase = (event: Event) => {
        const phase = (event as CustomEvent<{ phase?: string }>).detail?.phase;
        if (phase === "reveal") {
          applySectionTheme(section);
          holdSectionTheme(false);
        }
      };
      try {
        router.prefetch(href);
        const edge = sectionEdgeColor(section);
        if (edge) html.style.setProperty("--lu-edge", edge);
        holdSectionTheme(true);
        document.addEventListener("lu-transition", onPhase);
        await api.cover();
        const arrived = new Promise<void>((resolve) => {
          if (targetPath === pathRef.current) {
            window.setTimeout(resolve, 80);
            return;
          }
          arrivedRef.current = resolve;
          // Never stay covered: slow networks still get the page back.
          window.setTimeout(resolve, 10000);
        });
        push();
        await arrived;
        await nextFrames();
        await api.reveal();
      } finally {
        document.removeEventListener("lu-transition", onPhase);
        applySectionTheme(sectionForPath(pathRef.current));
        holdSectionTheme(false);
        html.style.removeProperty("--lu-edge");
        busyRef.current = false;
      }
    };
    activeNavigate = navigate;

    let cancelled = false;
    let uninstall = () => {};
    void loadLevelUpTransition().then((api) => {
      if (!api || cancelled) return;
      apiRef.current = api;
      // Finishes a wipe started in another LevelUp app (only when that app
      // painted the pre-paint cover), and clears the handoff cookie.
      void api.revealOnLoad();
      uninstall = api.intercept({
        onInternal: (href) => void navigate(href),
      });
    });
    return () => {
      cancelled = true;
      uninstall();
      if (activeNavigate === navigate) activeNavigate = null;
    };
  }, [router]);

  return null;
}

/** router.push / replace with the LevelUp wipe, plus go() for other apps. */
export function useTransitionRouter() {
  const router = useRouter();
  return useMemo(
    () => ({
      push: (href: string, options?: { scroll?: boolean }) =>
        activeNavigate
          ? void activeNavigate(href, options)
          : router.push(href, options),
      replace: (href: string, options?: { scroll?: boolean }) =>
        activeNavigate
          ? void activeNavigate(href, { ...options, replace: true })
          : router.replace(href, options),
      go: (url: string) => {
        void loadLevelUpTransition().then((api) =>
          api ? api.go(url) : window.location.assign(url),
        );
      },
    }),
    [router],
  );
}
