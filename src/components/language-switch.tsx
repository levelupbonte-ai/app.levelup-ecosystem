"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { LOCALE_KEY, setLocale, useLocale, type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

const HINT_KEY = "lu_locale_hint";

const OPTIONS: { value: Locale; label: string; name: string }[] = [
  { value: "en", label: "EN", name: "English" },
  { value: "fr", label: "FR", name: "Français" },
];

/**
 * EN/FR switch. English is the default; French only when picked here
 * (or with ?lang=fr). With `hint`, French browsers see a one-time, dismissible
 * "Voir en français ?" suggestion; nothing switches automatically.
 */
export function LanguageSwitch({
  className,
  hint,
}: {
  className?: string;
  hint?: boolean;
}) {
  const locale = useLocale();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (!hint) return;
    try {
      if (
        /^fr\b/i.test(navigator.language || "") &&
        !window.localStorage.getItem(LOCALE_KEY) &&
        !window.localStorage.getItem(HINT_KEY) &&
        !/(?:^|;\s*)lu_locale=/.test(document.cookie)
      ) {
        setShowHint(true);
      }
    } catch {
      /* storage blocked: no hint */
    }
  }, [hint]);

  const dismissHint = () => {
    setShowHint(false);
    try {
      window.localStorage.setItem(HINT_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div
        role="group"
        aria-label="Language / Langue"
        className="border-border/70 bg-background/40 flex items-center rounded-full border p-0.5 text-[11px] font-semibold tracking-wide"
      >
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            lang={o.value}
            aria-pressed={locale === o.value}
            title={o.name}
            onClick={() => {
              setLocale(o.value);
              dismissHint();
            }}
            className={cn(
              "cursor-pointer rounded-full px-2 py-1 leading-none transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/40",
              locale === o.value
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      {/* Portal: the navbar clips its overflow. */}
      {showHint &&
        locale === "en" &&
        createPortal(
          <div
            role="status"
            lang="fr"
            className="border-border/70 bg-popover/95 text-popover-foreground fixed top-[calc(env(safe-area-inset-top,0px)+84px)] right-4 z-[130] flex items-center gap-2 rounded-xl border px-3 py-2 text-xs whitespace-nowrap shadow-lg backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={() => {
                setLocale("fr");
                dismissHint();
              }}
              className="cursor-pointer font-medium underline-offset-4 hover:underline"
            >
              Voir en français ?
            </button>
            <button
              type="button"
              onClick={dismissHint}
              aria-label="Fermer / Dismiss"
              className="text-muted-foreground hover:text-foreground cursor-pointer px-1"
            >
              ×
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
