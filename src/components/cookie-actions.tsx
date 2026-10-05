"use client";

import React, { useEffect, useState } from "react";
import { SlidersHorizontal, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "levelup_cookie_consent";

export function CookieActions() {
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
      setStatusMessage("Cookie preferences reset. The prompt will appear shortly.");
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
    <div className="pt-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={handleOpenPreferences}
          className="font-semibold text-xs sm:text-sm inline-flex items-center gap-2 rounded-lg cursor-pointer"
        >
          <SlidersHorizontal className="size-4" />
          <span>Customize Cookie Preferences</span>
        </Button>

        <Button
          onClick={handleResetPreferences}
          variant="outline"
          className="font-medium text-xs sm:text-sm inline-flex items-center gap-2 rounded-lg cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset All Preferences</span>
        </Button>
      </div>

      {statusMessage && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1.5 pt-1">
          <CheckCircle2 className="size-3.5" />
          <span>{statusMessage}</span>
        </p>
      )}

      {currentConsent && !statusMessage && (
        <p className="text-xs text-muted-foreground pt-1">
          Current setting:{" "}
          <span className="font-semibold text-foreground capitalize">
            {currentConsent === "all"
              ? "All cookies accepted"
              : currentConsent === "declined"
                ? "Essential only (non-essential declined)"
                : "Custom preferences active"}
          </span>
        </p>
      )}
    </div>
  );
}
