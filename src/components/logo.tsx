import React from "react";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
}

export function Logo({
  className,
  iconClassName = "size-9",
  showText = false,
}: LogoProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 select-none transition-transform hover:scale-105",
        className,
      )}
    >
      {/* 5-pointed faceted 3D star matching LevelUp brand */}
      <svg
        viewBox="0 0 74 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="geometricPrecision"
        className={cn("shrink-0", iconClassName)}
        aria-hidden="true"
      >
        {/* Facet 0: Top point, right side */}
        <polygon points="37,37 37,3 46.11,24.46" fill="#9F76ED" />
        {/* Facet 1: Right point, top side */}
        <polygon points="37,37 46.11,24.46 69.34,26.49" fill="#8040EB" />
        {/* Facet 2: Right point, bottom side */}
        <polygon points="37,37 69.34,26.49 51.74,41.79" fill="#6724DE" />
        {/* Facet 3: Bottom-right point, outer side */}
        <polygon points="37,37 51.74,41.79 56.98,64.51" fill="#5015BC" />
        {/* Facet 4: Bottom-right point, inner/shadow side */}
        <polygon points="37,37 56.98,64.51 37,52.5" fill="#3B0A9A" />
        {/* Facet 5: Bottom-left point, inner side */}
        <polygon points="37,37 37,52.5 17.02,64.51" fill="#5517C7" />
        {/* Facet 6: Bottom-left point, outer side */}
        <polygon points="37,37 17.02,64.51 22.26,41.79" fill="#722EE0" />
        {/* Facet 7: Left point, bottom side */}
        <polygon points="37,37 22.26,41.79 4.66,26.49" fill="#8F4CEE" />
        {/* Facet 8: Left point, top/light side */}
        <polygon points="37,37 4.66,26.49 27.89,24.46" fill="#B086F6" />
        {/* Facet 9: Top point, left/brightest side */}
        <polygon points="37,37 27.89,24.46 37,3" fill="#C3ADFA" />
      </svg>

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span className="text-[1.35rem] font-bold tracking-tight text-foreground">
            LevelUp
          </span>
          <span className="text-[0.625rem] font-semibold tracking-[0.34em] text-violet-600 dark:text-violet-400 mt-0.5">
            ECOSYSTEM
          </span>
        </div>
      )}
    </div>
  );
}

export default Logo;
