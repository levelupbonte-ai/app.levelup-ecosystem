"use client";

import React, { useEffect, useState } from "react";
import { SlidersHorizontal, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Locale, useLocale } from "@/lib/locale";

const COOKIE_CONSENT_KEY = "levelup_cookie_consent";

const COPY: Record<
  Locale,
  {
    customize: string;
    reset: string;
    resetDone: string;
    current: string;
    all: string;
    declined: string;
    custom: string;
  }
> = {
  en: {
    customize: "Cookie settings",
    reset: "Reset my choice",
    resetDone: "Your choice was reset. The cookie prompt will appear shortly.",
    current: "Current setting:",
    all: "All optional cookies accepted",
    declined: "Essential only (optional cookies declined)",
    custom: "Custom preferences"
  },
  fr: {
    customize: "Paramètres des cookies",
    reset: "Réinitialiser mon choix",
    resetDone:
      "Votre choix a été réinitialisé. Le bandeau des cookies va s'afficher.",
    current: "Réglage actuel :",
    all: "Tous les cookies facultatifs acceptés",
    declined: "Essentiels uniquement (cookies facultatifs refusés)",
    custom: "Préférences personnalisées"
  }
};

export function CookieActions() {
  const t = COPY[useLocale()];
  const [currentConsent, setCurrentConsent] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      setCurrentConsent(stored);
    } catch {
      // ignore
    }
  }, []);

  const handleOpenPreferences = () => {
    window.dispatchEvent(new CustomEvent("levelup_open_cookie_settings"));
  };

  const handleResetPreferences = () => {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      localStorage.removeItem("levelup_cookie_preferences");
      setCurrentConsent(null);
      setStatusMessage(t.resetDone);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("levelup_open_cookie_settings"));
      }, 300);
      setTimeout(() => {
        setStatusMessage(null);
      }, 4000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="border-hairline mt-10 max-w-3xl space-y-3 rounded-2xl border p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={handleOpenPreferences}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg text-sm font-semibold"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          <span>{t.customize}</span>
        </Button>

        <Button
          onClick={handleResetPreferences}
          variant="outline"
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg text-sm font-medium"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          <span>{t.reset}</span>
        </Button>
      </div>

      <div aria-live="polite">
        {statusMessage && (
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            <span>{statusMessage}</span>
          </p>
        )}

        {currentConsent && !statusMessage && (
          <p className="text-muted-foreground text-xs">
            {t.current}{" "}
            <span className="text-foreground font-semibold">
              {currentConsent === "all"
                ? t.all
                : currentConsent === "declined"
                  ? t.declined
                  : t.custom}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
