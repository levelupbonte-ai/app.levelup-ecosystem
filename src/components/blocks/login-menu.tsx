"use client";

import { useEffect, useId, useRef, useState } from "react";

import {
  ChevronDown,
  LayoutDashboard,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { levelUpLoginUrl } from "@/lib/levelup-login";
import { cn } from "@/lib/utils";

type LoginDestination = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

/** The only two ways into LevelUp. Authentication always happens on the dashboard. */
export const LOGIN_DESTINATIONS: LoginDestination[] = [
  {
    title: "LevelStudio",
    description: "Build a website",
    href: levelUpLoginUrl("sign-in", "https://studio.levelup-ecosystem.com/"),
    icon: Sparkles,
  },
  {
    title: "Dashboard",
    description: "Manage my site",
    href: levelUpLoginUrl("sign-in", "/dashboard/site"),
    icon: LayoutDashboard,
  },
];

function DestinationLink({
  destination,
  onSelect,
  className,
  role,
}: {
  destination: LoginDestination;
  onSelect?: () => void;
  className?: string;
  role?: string;
}) {
  const Icon = destination.icon;
  return (
    <a
      href={destination.href}
      role={role}
      onClick={onSelect}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors outline-none",
        "hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:ring-ring/40 focus-visible:ring-2",
        className,
      )}
    >
      <span className="border-border/60 bg-background text-foreground/80 group-hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-foreground text-sm leading-tight font-semibold">
          {destination.title}
        </span>
        <span className="text-muted-foreground text-xs leading-snug">
          {destination.description}
        </span>
      </span>
    </a>
  );
}

/** Desktop "Log in" button opening a compact menu (LevelStudio / Dashboard). */
export function LoginMenu({
  compact,
  onOpen,
}: {
  compact?: boolean;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node))
        setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          setOpen((prev) => !prev);
          onOpen?.();
        }}
        className={cn(
          "text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1 rounded-lg font-medium transition-colors duration-200",
          "focus-visible:ring-ring/40 focus-visible:ring-2 focus-visible:outline-none",
          compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
          open && "text-foreground",
        )}
      >
        Log in
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
          <motion.div
            id={menuId}
            role="menu"
            aria-label="Log in to"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="border-border/60 bg-popover text-popover-foreground absolute top-full right-0 z-[120] mt-2 w-60 origin-top-right rounded-xl border p-1.5 shadow-lg"
          >
            {LOGIN_DESTINATIONS.map((destination) => (
              <DestinationLink
                key={destination.title}
                destination={destination}
                role="menuitem"
                onSelect={() => setOpen(false)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Mobile menu variant: the same two choices, listed inline. */
export function MobileLoginChoices({ onSelect }: { onSelect?: () => void }) {
  return (
    <div className="sm:col-span-2">
      <p className="text-muted-foreground px-1 pb-1.5 text-[11px] font-medium tracking-wider uppercase">
        Log in
      </p>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {LOGIN_DESTINATIONS.map((destination) => (
          <DestinationLink
            key={destination.title}
            destination={destination}
            onSelect={onSelect}
            className="border-border/60 rounded-xl border"
          />
        ))}
      </div>
    </div>
  );
}
