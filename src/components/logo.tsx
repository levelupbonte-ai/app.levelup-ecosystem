import React from "react";
import { cn } from "@/lib/utils";

interface LogoWordmarkProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * Official LevelUp Ecosystem Wordmark:
 * Direct typographic SVG design from the bottom of the site (without the star).
 * Uses theme-adaptive currentColor gradients to stay sharp and crisp across all modes.
 */
export function LogoWordmark({ className }: LogoWordmarkProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center select-none transition-transform duration-300 ease-out hover:scale-[1.03] origin-left",
        className,
      )}
    >
      <svg
        viewBox="0 0 1000 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block select-none pointer-events-none text-foreground"
      >
        {/* LevelUp */}
        <text
          x="50%"
          y="85"
          textAnchor="middle"
          fill="url(#wordmark_paint_levelup)"
          className="font-display font-black select-none"
          style={{
            fontSize: "100px",
            fontWeight: 900,
            letterSpacing: "-0.01em",
            fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
          }}
        >
          LevelUp
        </text>

        {/* Ecosystem */}
        <text
          x="50%"
          y="198"
          textAnchor="middle"
          fill="url(#wordmark_paint_ecosystem)"
          className="font-display font-black select-none"
          style={{
            fontSize: "135px",
            fontWeight: 900,
            letterSpacing: "0.01em",
            fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
          }}
        >
          Ecosystem
        </text>

        <defs>
          <linearGradient
            id="wordmark_paint_levelup"
            x1="500"
            y1="10"
            x2="500"
            y2="90"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="currentColor" stopOpacity="0.95" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.80" />
          </linearGradient>

          <linearGradient
            id="wordmark_paint_ecosystem"
            x1="500"
            y1="95"
            x2="500"
            y2="205"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="currentColor" stopOpacity="0.75" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.45" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/**
 * Main Logo export - Points to the official typographic wordmark from the footer
 */
export function Logo({
  className,
}: {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
}) {
  return <LogoWordmark className={cn("w-32 sm:w-36", className)} />;
}

// Backwards-compatible export for any legacy references
export function LogoStar() {
  return null;
}

export default Logo;
