"use client";

import type { ReactNode } from "react";

import { useLocale } from "@/lib/locale";

/**
 * Shows the English or the French version of a server-rendered document,
 * following the site language (English on the server and first paint).
 */
export function Localized({ en, fr }: { en: ReactNode; fr: ReactNode }) {
  return useLocale() === "fr" ? fr : en;
}
