"use client";

import { useEffect, useState } from "react";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

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
    try {
      const nextTheme = isDark ? "light" : "dark";
      setTheme(nextTheme);
      if (typeof document !== "undefined") {
        if (nextTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    } catch {
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark");
      }
    }
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
