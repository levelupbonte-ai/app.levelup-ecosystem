import type { SVGProps } from "react";

import { STAR_OUTLINE } from "@/lib/levelup-star";

const POINTS = STAR_OUTLINE.map(([x, y]) => `${x},${y}`).join(" ");

/** The LevelUp star silhouette in one colour (currentColor). Decorative. */
export function StarGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="20 30 472 448"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <polygon points={POINTS} fill="currentColor" />
    </svg>
  );
}
