import React from "react";

import { cn } from "@/lib/utils";

type BackgroundProps = {
  children: React.ReactNode;
  variant?: "top" | "bottom";
  className?: string;
};

/**
 * Page backdrop in the editorial style: the off-white page with a thin grid
 * fading out under the header (top variant). Kept as a wrapper so every
 * inner page shares the homepage's look.
 */
export const Background = ({
  children,
  variant = "top",
  className,
}: BackgroundProps) => {
  return (
    <div className={cn("relative isolate", className)}>
      {variant === "top" && (
        <div
          aria-hidden="true"
          className="grid-lines pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] opacity-70 [mask-image:linear-gradient(to_bottom,black_30%,transparent)]"
        />
      )}
      {children}
    </div>
  );
};
