"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { startThemeTransition } from "@/lib/theme-transition";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "size-8.5 rounded-full flex items-center justify-center text-muted-foreground",
          className,
        )}
        aria-hidden="true"
      >
        <Moon className="size-4" />
      </div>
    );
  }

  const isDark = mounted && resolvedTheme === "dark";

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const nextTheme = isDark ? "light" : "dark";
    // Circular reveal from the toggle (keyboard activations have no pointer
    // position, so the button's centre is the origin).
    const rect = e.currentTarget.getBoundingClientRect();
    const origin =
      e.clientX || e.clientY
        ? { x: e.clientX, y: e.clientY }
        : { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    startThemeTransition(() => {
      try {
        flushSync(() => setTheme(nextTheme));
      } catch {
        /* fall through to the class toggle */
      }
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
    }, origin);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "relative flex size-8.5 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/80 active:scale-95 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="size-4 transition-transform duration-300 hover:rotate-45 text-amber-400" />
      ) : (
        <Moon className="size-4 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
