import { Headline } from "@/components/motion/primitives";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  /** Seconds. */
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  once?: boolean;
  /** Kept for compatibility: heroes play with the page (held by the intro). */
  waitPreloader?: boolean;
}

/**
 * Words rise out of a mask (docs/motion.md). With `waitPreloader` it is the
 * entrance of the top of a page, otherwise it plays when scrolled into view.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  as = "h1",
  waitPreloader = false,
}: SplitTextProps) {
  return (
    <Headline
      as={as}
      hero={waitPreloader}
      delay={Math.round(delay * 1000)}
      className={cn("inline-block", className)}
    >
      {text}
    </Headline>
  );
}
