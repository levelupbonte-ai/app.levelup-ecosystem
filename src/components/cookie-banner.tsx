"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, ChevronUp, ShieldCheck, SlidersHorizontal } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const COOKIE_CONSENT_KEY = "levelup_cookie_consent";
const COOKIE_PREFS_KEY = "levelup_cookie_preferences";

export type CookieConsentStatus = "all" | "declined" | "custom" | null;

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  personalization: boolean;
}

/**
 * Authentic SVG Cookie Illustration matching the user's mockup:
 * Golden-baked biscuit with a bite taken out of the top-right & chocolate chips.
 */
function CookieIllustration({ className = "size-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Cookie body with a bite taken out of top-right */}
      <path
        d="M32 6C17.64 6 6 17.64 6 32c0 14.36 11.64 26 26 26s26-11.64 26-26c0-1.88-.2-3.7-.58-5.46a7 7 0 0 1-5.88-5.88 7 7 0 0 1-4.66-4.66A7.01 7.01 0 0 1 41.5 6.58C38.48 6.2 35.3 6 32 6z"
        fill="#F5BA63"
      />
      {/* Depth shading */}
      <path
        d="M32 58c14.36 0 26-11.64 26-26 0-.82-.04-1.63-.12-2.43C55.44 42.48 44.82 52.88 32 52.88c-12.82 0-23.44-10.4-25.88-23.31A26.01 26.01 0 0 0 32 58z"
        fill="#E5A448"
        opacity="0.45"
      />
      {/* Chocolate chips */}
      <circle cx="21" cy="22" r="3.2" fill="#5A2E12" />
      <circle cx="21.9" cy="21.1" r="1.1" fill="#7E471E" opacity="0.7" />

      <circle cx="34" cy="25" r="3.5" fill="#5A2E12" />
      <circle cx="34.9" cy="24.1" r="1.1" fill="#7E471E" opacity="0.7" />

      <circle cx="23" cy="38" r="3.4" fill="#5A2E12" />
      <circle cx="23.9" cy="37.1" r="1.1" fill="#7E471E" opacity="0.7" />

      <circle cx="41" cy="37" r="3.2" fill="#5A2E12" />
      <circle cx="41.9" cy="36.1" r="1" fill="#7E471E" opacity="0.7" />

      <circle cx="31" cy="47" r="2.8" fill="#5A2E12" />

      {/* Tiny crumb chips */}
      <circle cx="16" cy="30" r="1.6" fill="#5A2E12" />
      <circle cx="45" cy="27" r="1.8" fill="#5A2E12" />
      <circle cx="36" cy="15" r="1.8" fill="#5A2E12" />
    </svg>
  );
}

export function CookieBanner() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<CookieConsentStatus>("all"); // default hidden until verified
  const [mounted, setMounted] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(true);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Preference switches
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(true);

  useEffect(() => {
    setMounted(true);
    let timer: NodeJS.Timeout | undefined;
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (stored === "all" || stored === "declined" || stored === "custom") {
        setConsent(stored as CookieConsentStatus);
      } else {
        // Pop-up cookie appears exactly 10 seconds after arriving on the site
        timer = setTimeout(() => {
          setConsent(null);
        }, 10000);
      }

      const storedPrefs = localStorage.getItem(COOKIE_PREFS_KEY);
      if (storedPrefs) {
        const parsed = JSON.parse(storedPrefs) as CookiePreferences;
        if (typeof parsed.analytics === "boolean") setAnalyticsEnabled(parsed.analytics);
        if (typeof parsed.personalization === "boolean") setPersonalizationEnabled(parsed.personalization);
      }
    } catch {
      timer = setTimeout(() => {
        setConsent(null);
      }, 10000);
    }

    // Support opening cookie preferences directly from /cookies page
    const handleOpenSettings = () => {
      setConsent(null);
      setIsCustomizing(true);
    };
    window.addEventListener("levelup_open_cookie_settings", handleOpenSettings);

    return () => {
      window.removeEventListener("levelup_open_cookie_settings", handleOpenSettings);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "all");
      localStorage.setItem(
        COOKIE_PREFS_KEY,
        JSON.stringify({
          necessary: true,
          analytics: true,
          personalization: true,
        }),
      );
    } catch {
      // ignore
    }
    setConsent("all");
  };

  const handleDeclineAll = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
      localStorage.setItem(
        COOKIE_PREFS_KEY,
        JSON.stringify({
          necessary: true,
          analytics: false,
          personalization: false,
        }),
      );
    } catch {
      // ignore
    }
    setConsent("declined");
  };

  const handleSavePreferences = () => {
    try {
      const isAllOn = analyticsEnabled && personalizationEnabled;
      const isAllOff = !analyticsEnabled && !personalizationEnabled;
      const status: CookieConsentStatus = isAllOn ? "all" : isAllOff ? "declined" : "custom";

      localStorage.setItem(COOKIE_CONSENT_KEY, status);
      localStorage.setItem(
        COOKIE_PREFS_KEY,
        JSON.stringify({
          necessary: true,
          analytics: analyticsEnabled,
          personalization: personalizationEnabled,
        }),
      );
    } catch {
      // ignore
    }
    setConsent("custom");
  };

  if (!mounted || consent !== null || pathname?.startsWith("/start-project")) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none p-3 sm:p-5 md:p-6 flex flex-col items-center justify-end">
        {/* ========================================================================= */}
        {/* DESKTOP VIEW (md+): Sleek Horizontal Floating Bar with Upward Deploy      */}
        {/* ========================================================================= */}
        <motion.div
          key="cookie-desktop-bar"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0, transition: { duration: 0.25 } }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="hidden md:flex flex-col pointer-events-auto w-full max-w-4xl rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200/90 dark:border-zinc-800 shadow-[0_16px_40px_-6px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-md overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          {/* Deployed Customization Drawer (Expands Upward) */}
          <div
            className={cn(
              "overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] border-b border-neutral-200/70 dark:border-zinc-800/80 bg-neutral-50/70 dark:bg-zinc-950/40",
              isCustomizing
                ? "max-h-[55vh] opacity-100 p-5"
                : "max-h-0 opacity-0 p-0 pointer-events-none border-b-0",
            )}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-zinc-800/60">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-[#2563EB]" />
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight font-sans">
                  Cookie Preferences &amp; Permissions
                </h4>
              </div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Zero third-party advertising cookies
              </span>
            </div>

            {/* Switches List */}
            <div className="mt-4 space-y-3.5">
              {/* 1. Necessary (Always Active) */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/70">
                <div className="space-y-0.5 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Strictly Necessary
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                      Always Active
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Essential for secure authentication, CSRF defense, session continuity, and theme display.
                  </p>
                </div>
                <Switch checked={true} disabled className="data-[state=checked]:bg-emerald-600 cursor-not-allowed opacity-75" />
              </div>

              {/* 2. Analytics */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/70">
                <div className="space-y-0.5 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Analytics &amp; Performance
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Anonymous telemetry with IP masking to measure load performance and error rates.
                  </p>
                </div>
                <Switch
                  checked={analyticsEnabled}
                  onCheckedChange={setAnalyticsEnabled}
                  className="data-[state=checked]:bg-[#2563EB]"
                  aria-label="Toggle analytics cookies"
                />
              </div>

              {/* 3. Personalization */}
              <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800/70">
                <div className="space-y-0.5 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Personalization &amp; Experiences
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Remembers interactive simulator states, client workspace preferences, and form inputs.
                  </p>
                </div>
                <Switch
                  checked={personalizationEnabled}
                  onCheckedChange={setPersonalizationEnabled}
                  className="data-[state=checked]:bg-[#2563EB]"
                  aria-label="Toggle personalization cookies"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between border-t border-neutral-200/60 dark:border-zinc-800/60">
              <Link
                href="/cookies"
                className="text-xs text-[#2563EB] hover:underline font-medium inline-flex items-center gap-1"
              >
                <ShieldCheck className="size-3.5" />
                <span>Read Cookie Policy</span>
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomizing(false)}
                  className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] px-5 py-1.5 rounded-full shadow-xs transition-all cursor-pointer"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>

          {/* Main Desktop Bar */}
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="shrink-0 size-9 flex items-center justify-center">
                <CookieIllustration className="size-9 drop-shadow-sm" />
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 font-sans tracking-tight">
                  We use cookies
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate sm:text-clip">
                  They help the site run faster and more conveniently for you.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {/* 1. Decline Button */}
              <button
                type="button"
                onClick={handleDeclineAll}
                className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-3 py-2 rounded-full transition-colors cursor-pointer"
              >
                Decline
              </button>

              {/* 2. Customize Button (Deploys preferences upward) */}
              <button
                type="button"
                onClick={() => setIsCustomizing((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-full border transition-all cursor-pointer",
                  isCustomizing
                    ? "bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white border-neutral-300 dark:border-zinc-700"
                    : "bg-transparent text-neutral-700 dark:text-neutral-200 border-neutral-300/80 dark:border-zinc-700 hover:bg-neutral-100 dark:hover:bg-zinc-800",
                )}
              >
                <span>Customize</span>
                {isCustomizing ? (
                  <ChevronDown className="size-3.5 transition-transform" />
                ) : (
                  <ChevronUp className="size-3.5 transition-transform" />
                )}
              </button>

              {/* 3. Accept Button */}
              <button
                type="button"
                onClick={handleAcceptAll}
                className="text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] px-6 py-2 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (< md): Card Modal Centered with Upward Deployment Drawer    */}
        {/* ========================================================================= */}
        <motion.div
          key="cookie-mobile-card"
          initial={{ y: 50, scale: 0.94, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 50, scale: 0.94, opacity: 0, transition: { duration: 0.2 } }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="md:hidden pointer-events-auto w-full max-w-sm mx-auto max-h-[calc(100dvh-5.5rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/90 dark:border-zinc-800 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-4 sm:p-5 text-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          {/* Deployed Customization Drawer (Upward expansion on mobile) */}
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-left",
              isCustomizing
                ? "max-h-[420px] opacity-100 mb-3 pb-3 border-b border-neutral-200 dark:border-zinc-800"
                : "max-h-0 opacity-0 mb-0 pb-0 pointer-events-none border-b-0",
            )}
          >
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-neutral-200/70 dark:border-zinc-800/70">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="size-4 text-[#2563EB]" />
                <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-sans tracking-tight">
                  Customize Cookies
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomizing(false)}
                className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Mobile Category Switches */}
            <div className="space-y-2">
              {/* Strictly Necessary */}
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200/80 dark:border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Strictly Necessary
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                      Required
                    </span>
                  </div>
                  <Switch checked={true} disabled className="data-[state=checked]:bg-emerald-600 opacity-80" />
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                  Session security, logins, and essential site features.
                </p>
              </div>

              {/* Analytics */}
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200/80 dark:border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    Analytics &amp; Performance
                  </span>
                  <Switch
                    checked={analyticsEnabled}
                    onCheckedChange={setAnalyticsEnabled}
                    className="data-[state=checked]:bg-[#2563EB]"
                    aria-label="Toggle analytics cookies"
                  />
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                  Anonymized metrics to optimize speed and responsiveness.
                </p>
              </div>

              {/* Personalization */}
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200/80 dark:border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    Personalization
                  </span>
                  <Switch
                    checked={personalizationEnabled}
                    onCheckedChange={setPersonalizationEnabled}
                    className="data-[state=checked]:bg-[#2563EB]"
                    aria-label="Toggle personalization cookies"
                  />
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                  Preserves interactive previews, custom options &amp; UI themes.
                </p>
              </div>
            </div>

            {/* Mobile Save Button */}
            <div className="mt-3 pt-2 flex items-center justify-between gap-2">
              <Link
                href="/cookies"
                className="text-[11px] text-[#2563EB] hover:underline font-medium"
              >
                Policy Details
              </Link>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] px-4 py-1.5 rounded-full shadow-xs transition-all cursor-pointer"
              >
                Save My Choices
              </button>
            </div>
          </div>

          {/* Collapse large Cookie Icon & Headline when Options drawer is open so top is never pushed off-screen */}
          {!isCustomizing && (
            <>
              <div className="flex justify-center mb-2">
                <CookieIllustration className="size-12 drop-shadow-md" />
              </div>

              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-sans tracking-tight leading-snug">
                We use cookies
                <br />
                to improve your experience
              </h3>

              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed max-w-xs mx-auto">
                They help the site work faster and more smoothly for you.
              </p>
            </>
          )}

          {/* Agree to Privacy Policy Checkbox */}
          <div className="mt-3.5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setAgreedToPolicy(!agreedToPolicy)}
              className={`size-4.5 rounded flex items-center justify-center transition-all cursor-pointer ${
                agreedToPolicy
                  ? "bg-[#2563EB] text-white border border-[#2563EB]"
                  : "bg-transparent border border-neutral-300 dark:border-zinc-700"
              }`}
              aria-label="Toggle agreement to Privacy Policy"
            >
              {agreedToPolicy && <Check className="size-3.5 stroke-[3]" />}
            </button>
            <label
              onClick={() => setAgreedToPolicy(!agreedToPolicy)}
              className="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer select-none"
            >
              I agree to the{" "}
              <Link
                href="/privacy"
                onClick={(e) => e.stopPropagation()}
                className="text-[#2563EB] font-medium hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* 3 Action Buttons on Mobile: Decline, Customize, Accept */}
          <div className="mt-4 grid grid-cols-3 gap-2 items-center">
            {/* 1. Decline */}
            <button
              type="button"
              onClick={handleDeclineAll}
              className="w-full text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white py-2 rounded-xl border border-neutral-200 dark:border-zinc-800 transition-colors cursor-pointer"
            >
              Decline
            </button>

            {/* 2. Customize (3rd button deploying options upward) */}
            <button
              type="button"
              onClick={() => setIsCustomizing((prev) => !prev)}
              className={cn(
                "w-full inline-flex items-center justify-center gap-1 text-xs font-semibold py-2 rounded-xl border transition-all cursor-pointer",
                isCustomizing
                  ? "bg-neutral-100 dark:bg-zinc-800 text-neutral-900 dark:text-white border-neutral-300 dark:border-zinc-700"
                  : "bg-transparent text-neutral-700 dark:text-neutral-200 border-neutral-200 dark:border-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-800",
              )}
            >
              <span>Options</span>
              {isCustomizing ? (
                <ChevronDown className="size-3 transition-transform" />
              ) : (
                <ChevronUp className="size-3 transition-transform" />
              )}
            </button>

            {/* 3. Accept */}
            <button
              type="button"
              onClick={handleAcceptAll}
              className="w-full text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Accept
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

