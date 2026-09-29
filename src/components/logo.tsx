import React from "react";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
}

export function Logo({
  className,
  iconClassName = "size-7 sm:size-8",
  showText = false,
}: LogoProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 select-none transition-transform hover:scale-[1.03]",
        className,
      )}
    >
      {/* 5-pointed faceted 3D star with softened, elegant tonal intensity */}
      <svg
        viewBox="0 0 74 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        className={cn("shrink-0 opacity-85 transition-opacity hover:opacity-100", iconClassName)}
        aria-hidden="true"
      >
        {/* Softened, refined facets with reduced harshness and balanced luminosity */}
        <polygon points="37,37 37,3 46.11,24.46" fill="#A78BFA" fillOpacity="0.9" />
        <polygon points="37,37 46.11,24.46 69.34,26.49" fill="#8B5CF6" fillOpacity="0.88" />
        <polygon points="37,37 69.34,26.49 51.74,41.79" fill="#7C3AED" fillOpacity="0.82" />
        <polygon points="37,37 51.74,41.79 56.98,64.51" fill="#6D28D9" fillOpacity="0.8" />
        <polygon points="37,37 56.98,64.51 37,52.5" fill="#5B21B6" fillOpacity="0.75" />
        <polygon points="37,37 37,52.5 17.02,64.51" fill="#6D28D9" fillOpacity="0.8" />
        <polygon points="37,37 17.02,64.51 22.26,41.79" fill="#7C3AED" fillOpacity="0.82" />
        <polygon points="37,37 22.26,41.79 4.66,26.49" fill="#8B5CF6" fillOpacity="0.88" />
        <polygon points="37,37 4.66,26.49 27.89,24.46" fill="#A78BFA" fillOpacity="0.9" />
        <polygon points="37,37 27.89,24.46 37,3" fill="#C4B5FD" fillOpacity="0.95" />
      </svg>

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span className="text-[1.25rem] font-bold tracking-tight text-foreground">
            LevelUp
          </span>
          <span className="text-[0.6rem] font-semibold tracking-[0.3em] text-violet-500/80 dark:text-violet-400/80 mt-0.5">
            ECOSYSTEM
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;
