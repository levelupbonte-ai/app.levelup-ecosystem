"use client";

import React from "react";
import { cn } from "@/lib/utils";

const DOTS = [
  { cx: 256, cy: 109.718, delay: 0 },
  { cx: 359.437, cy: 152.563, delay: 0.17 },
  { cx: 402.282, cy: 256, delay: 0.34 },
  { cx: 359.437, cy: 359.437, delay: 0.51 },
  { cx: 256, cy: 402.283, delay: 0.68 },
  { cx: 152.563, cy: 359.437, delay: 0.85 },
  { cx: 109.718, cy: 256, delay: 1.02 },
  { cx: 152.563, cy: 152.563, delay: 1.19 },
];

/**
 * Official LevelUp Ecosystem Transition Spinner:
 * Exact vector replica of loading-14.json with 8 sequential pulsing dots.
 * 100% pure SVG/CSS, zero dependencies, theme-reactive (currentColor).
 */
export function OfficialTransitionSpinner({
  className,
  size = 56,
}: {
  className?: string;
  size?: number | string;
}) {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center select-none text-foreground", className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading..."
    >
      <svg
        viewBox="0 0 512 512"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
      >
        <style>
          {`
            @keyframes officialPulse {
              0% {
                opacity: 0.12;
                transform: scale(0.82);
              }
              18% {
                opacity: 1;
                transform: scale(1.08);
              }
              50% {
                opacity: 0.35;
                transform: scale(0.92);
              }
              100% {
                opacity: 0.12;
                transform: scale(0.82);
              }
            }
            .loading-dot {
              transform-box: fill-box;
              transform-origin: center;
              animation: officialPulse 1.36s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
          `}
        </style>
        {DOTS.map((dot, index) => (
          <circle
            key={index}
            cx={dot.cx}
            cy={dot.cy}
            r="28.718"
            className="loading-dot"
            style={{
              animationDelay: `${dot.delay}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default OfficialTransitionSpinner;
