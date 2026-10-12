import type { ReactNode } from "react";

import { M } from "@/components/motion/primitives";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds. */
  delay?: number;
  /** Kept for compatibility: the distance is a motion token (--m-y). */
  duration?: number;
  yOffset?: number;
  xOffset?: number;
  scale?: number;
  once?: boolean;
}

/**
 * Fades and lifts its content in the first time it scrolls into view. A thin
 * wrapper over the scroll motion system (docs/motion.md): the content is in
 * the HTML, hidden only once the page is hydrated, and shown at once on a
 * route already seen during this page load.
 */
export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  return (
    <M kind="up" delay={Math.round(delay * 1000)} className={className}>
      {children}
    </M>
  );
}
