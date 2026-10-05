"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * TopScrollDissolver:
 * Subtle dissolution mask at the very top of the screen that only activates
 * once the user scrolls down (when the header is launched / scrolled).
 * When at the top of the page, it remains completely invisible (opacity 0).
 */
export function TopScrollDissolver() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Only show the dissolver after the user has begun scrolling (> 35px)
      if (window.scrollY > 35) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "fixed top-0 left-0 right-0 h-10 sm:h-12 z-[40] pointer-events-none select-none bg-gradient-to-b from-background via-background/70 to-transparent transition-opacity duration-300 ease-out",
        isScrolled ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    />
  );
}

export default TopScrollDissolver;
