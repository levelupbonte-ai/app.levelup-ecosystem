"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { type Locale, useLocale } from "@/lib/locale";
import { levelUpLoginUrl, LEVELSTUDIO_URL } from "@/lib/levelup-login";
import { cn } from "@/lib/utils";

const COPY = {
  en: {
    trigger: "Log in",
    title: "Log in to LevelUp",
    subtitle: "One account for every LevelUp tool.",
    close: "Close",
    signUpLead: "New to LevelUp?",
    signUp: "Create an account",
    studio: "Create and preview your website with AI.",
    dashboard: "Manage your site, bookings and clients.",
  },
  fr: {
    trigger: "Se connecter",
    title: "Se connecter à LevelUp",
    subtitle: "Un seul compte pour tous les outils LevelUp.",
    close: "Fermer",
    signUpLead: "Nouveau sur LevelUp ?",
    signUp: "Créer un compte",
    studio: "Créez et prévisualisez votre site avec l’IA.",
    dashboard: "Gérez votre site, vos réservations et vos clients.",
  },
} as const;

type LoginDestination = {
  id: "studio" | "dashboard";
  title: string;
  href: string;
  logo: string;
};

/** The only two ways into LevelUp. Authentication always happens on the dashboard. */
export const LOGIN_DESTINATIONS: LoginDestination[] = [
  {
    id: "studio",
    title: "LevelStudio",
    href: levelUpLoginUrl("sign-in", `${LEVELSTUDIO_URL}/`),
    logo: "/brand/levelstudio-icon.svg",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    href: levelUpLoginUrl("sign-in", "/dashboard/site"),
    logo: "/icon.svg",
  },
];

function DestinationCard({
  destination,
  locale,
  onSelect,
  className,
}: {
  destination: LoginDestination;
  locale: Locale;
  onSelect?: () => void;
  className?: string;
}) {
  return (
    <a
      href={destination.href}
      onClick={onSelect}
      data-login-card
      className={cn(
        "group relative flex items-center gap-4 overflow-hidden rounded-xl border p-4 text-left outline-none",
        "border-border/70 bg-background/40 transition-[border-color,background-color,transform,box-shadow] duration-200",
        "hover:border-[#8B5CF6]/55 hover:bg-[#8B5CF6]/[0.06] hover:shadow-[0_8px_30px_-12px_rgba(139,92,246,0.45)]",
        "focus-visible:border-[#8B5CF6] focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/40",
        "motion-safe:active:scale-[0.99]",
        className,
      )}
    >
      <span className="border-border/60 bg-muted/40 relative flex size-12 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200 group-hover:border-[#8B5CF6]/40">
        <Image
          src={destination.logo}
          alt=""
          width={30}
          height={30}
          unoptimized
          className="size-[30px]"
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-foreground text-[15px] leading-tight font-semibold tracking-tight">
          {destination.title}
        </span>
        <span className="text-muted-foreground text-[13px] leading-snug">
          {COPY[locale][destination.id]}
        </span>
      </span>
      <ArrowUpRight
        className="text-muted-foreground size-4 shrink-0 transition-[transform,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#8B5CF6] group-focus-visible:text-[#8B5CF6]"
        aria-hidden="true"
      />
    </a>
  );
}

function SignUpLine({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <p className="text-muted-foreground text-center text-xs">
      {t.signUpLead}{" "}
      <a
        href={levelUpLoginUrl("sign-up")}
        className="text-foreground rounded-sm font-medium underline-offset-4 outline-none hover:text-[#8B5CF6] hover:underline focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/40"
      >
        {t.signUp}
      </a>
    </p>
  );
}

/**
 * "Log in" button opening a chooser: LevelStudio or Dashboard.
 * Popover under the button on larger screens, bottom sheet on phones.
 * Escape, a click outside or the close button dismiss it; focus returns to the button.
 */
export function LoginMenu({
  compact,
  onOpen,
}: {
  compact?: boolean;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = COPY[locale];
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const close = (restoreFocus: boolean) => {
      setOpen(false);
      if (restoreFocus) triggerRef.current?.focus();
    };
    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node))
        close(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      // Arrow keys move between the two cards.
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const cards = Array.from(
          panelRef.current?.querySelectorAll<HTMLElement>("[data-login-card]") ??
            [],
        );
        if (!cards.length) return;
        event.preventDefault();
        const i = cards.indexOf(document.activeElement as HTMLElement);
        const next =
          event.key === "ArrowDown"
            ? (i + 1) % cards.length
            : (i - 1 + cards.length) % cards.length;
        cards[next].focus();
      }
    }
    function onFocusIn(event: FocusEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node))
        close(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    // Move focus into the panel once it is mounted.
    const raf = requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>("[data-login-card]")?.focus(),
    );
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => {
          setOpen((prev) => !prev);
          onOpen?.();
        }}
        className={cn(
          "text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1 rounded-lg font-medium transition-colors duration-200",
          "focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/40 focus-visible:outline-none",
          compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
          open && "text-foreground",
        )}
      >
        {t.trigger}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Phones: dimmed backdrop behind the bottom sheet. */}
            <motion.div
              key="backdrop"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[119] bg-black/60 backdrop-blur-[2px] sm:hidden"
            />
            <motion.div
              key="panel"
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-labelledby={titleId}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
              className={cn(
                "text-popover-foreground z-[120] overflow-hidden border shadow-2xl",
                "border-border/70 bg-popover/95 backdrop-blur-xl supports-[backdrop-filter]:bg-popover/85",
                // Phones: bottom sheet.
                "fixed inset-x-0 bottom-0 rounded-t-2xl pb-[max(1rem,env(safe-area-inset-bottom))]",
                // Larger screens: popover under the button.
                "sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:bottom-auto sm:mt-3 sm:w-[380px] sm:origin-top-right sm:rounded-2xl sm:pb-0",
              )}
            >
              {/* Violet hairline accent. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#8B5CF6]/70 to-transparent"
              />
              <div
                aria-hidden="true"
                className="bg-muted-foreground/30 mx-auto mt-2.5 h-1 w-10 rounded-full sm:hidden"
              />
              <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3 sm:pt-5">
                <div>
                  <p
                    id={titleId}
                    className="text-foreground text-[15px] font-semibold tracking-tight"
                  >
                    {t.title}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-[13px]">
                    {t.subtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/60 -mt-1 -mr-1.5 inline-flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/40"
                >
                  <span className="sr-only">{t.close}</span>
                  <svg
                    viewBox="0 0 16 16"
                    className="size-3.5"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  >
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
              </div>
              <div className="grid gap-2.5 px-3 sm:px-3.5">
                {LOGIN_DESTINATIONS.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    locale={locale}
                    onSelect={() => setOpen(false)}
                  />
                ))}
              </div>
              <div className="border-border/60 mt-3.5 border-t px-5 py-3.5">
                <SignUpLine locale={locale} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Mobile menu variant: the same two cards, full width, listed inline. */
export function MobileLoginChoices({ onSelect }: { onSelect?: () => void }) {
  const locale = useLocale();
  const t = COPY[locale];
  return (
    <div className="sm:col-span-2">
      <p className="text-muted-foreground px-1 pt-1 pb-2 text-[11px] font-medium tracking-wider uppercase">
        {t.title}
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {LOGIN_DESTINATIONS.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            locale={locale}
            onSelect={onSelect}
          />
        ))}
      </div>
      <div className="pt-3">
        <SignUpLine locale={locale} />
      </div>
    </div>
  );
}
