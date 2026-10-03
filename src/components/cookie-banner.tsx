"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";

const COOKIE_CONSENT_KEY = "levelup_cookie_consent";

export type CookieConsentStatus = "all" | "declined" | null;

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
  const [consent, setConsent] = useState<CookieConsentStatus>("all"); // default hidden until verified
  const [mounted, setMounted] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (stored === "all" || stored === "declined") {
        setConsent(stored as CookieConsentStatus);
      } else {
        setConsent(null); // Show banner
      }
    } catch {
      setConsent(null);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "all");
    } catch {
      // ignore
    }
    setConsent("all");
  };

  const handleDecline = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    } catch {
      // ignore
    }
    setConsent("declined");
  };

  if (!mounted || consent !== null) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none p-3 sm:p-5 md:p-6 flex flex-col items-center justify-end">
        {/* ========================================================================= */}
        {/* DESKTOP VIEW (md+): Sleek Horizontal Floating Bar at Bottom               */}
        {/* ========================================================================= */}
        <motion.div
          key="cookie-desktop-bar"
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0, transition: { duration: 0.25 } }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className="hidden md:flex pointer-events-auto w-full max-w-5xl items-center justify-between gap-4 px-6 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-neutral-200/90 dark:border-zinc-800 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.12),0_4px_16px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-md"
        >
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

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDecline}
              className="text-xs sm:text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-3.5 py-2 rounded-full transition-colors cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] px-7 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Accept
            </button>
          </div>
        </motion.div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (< md): Card Modal Centered at Bottom of Screen               */}
        {/* ========================================================================= */}
        <motion.div
          key="cookie-mobile-card"
          initial={{ y: 50, scale: 0.94, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 50, scale: 0.94, opacity: 0, transition: { duration: 0.2 } }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="md:hidden pointer-events-auto w-full max-w-sm mx-auto relative rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200/90 dark:border-zinc-800 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-6 text-center"
        >
          {/* Top-Right Close Button */}
          <button
            onClick={handleDecline}
            aria-label="Close cookie consent"
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 rounded-full transition-colors cursor-pointer"
          >
            <X className="size-4.5" />
          </button>

          {/* Centered Cookie Icon */}
          <div className="flex justify-center mb-3">
            <CookieIllustration className="size-14 drop-shadow-md" />
          </div>

          {/* Headline */}
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-sans tracking-tight leading-snug">
            We use cookies
            <br />
            to improve your experience
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed max-w-xs mx-auto">
            They help the site work faster and more smoothly for you.
          </p>

          {/* Agree to Privacy Policy Checkbox */}
          <div className="mt-4 flex items-center justify-center gap-2">
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

          {/* Action Buttons */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={handleAccept}
              className="text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] px-8 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-4 py-2.5 transition-colors cursor-pointer"
            >
              Decline
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
