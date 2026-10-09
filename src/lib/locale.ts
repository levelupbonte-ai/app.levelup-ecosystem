"use client";

import { useSyncExternalStore } from "react";

/**
 * Visitor language. English is the official language of LevelUp Ecosystem;
 * French is an optional translation the visitor picks explicitly (EN/FR switch
 * or ?lang=fr). The browser language never switches it on its own.
 *
 * The choice lives in the `lu_locale` cookie and localStorage key, shared with
 * the Project Studio page (public/project-studio.html), which reads the same keys.
 */
export type Locale = "en" | "fr";

export const LOCALE_KEY = "lu_locale";
const EVENT = "lu-locale-change";

const isLocale = (v: unknown): v is Locale => v === "en" || v === "fr";

function readCookie(): Locale | null {
  const m = document.cookie.match(/(?:^|;\s*)lu_locale=(en|fr)\b/);
  return m ? (m[1] as Locale) : null;
}

export function readLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const q = new URLSearchParams(window.location.search).get("lang");
    if (isLocale(q)) return q;
  } catch {
    /* ignore */
  }
  try {
    const stored = window.localStorage.getItem(LOCALE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* storage blocked */
  }
  return readCookie() ?? "en";
}

export function setLocale(locale: Locale) {
  try {
    window.localStorage.setItem(LOCALE_KEY, locale);
  } catch {
    /* storage blocked */
  }
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${LOCALE_KEY}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  // A ?lang= in the address bar would otherwise win over the new choice.
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.delete("lang");
      window.history.replaceState(window.history.state, "", url.toString());
    }
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === LOCALE_KEY) onChange();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Current locale; the server render (and first paint) is always English. */
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, readLocale, () => "en");
}
