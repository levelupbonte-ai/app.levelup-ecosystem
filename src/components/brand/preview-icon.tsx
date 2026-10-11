import type { SVGProps } from "react";

/**
 * "Free preview" / LevelStudio icon: the corner brackets of the LevelStudio
 * mark (public/brand/levelstudio-icon.svg) framing a play button, drawn on
 * the 24 px lucide grid so it sits with the other line icons. Decorative.
 */
export function PreviewIcon({
  strokeWidth = 1.75,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M3 8V5.5A2.5 2.5 0 0 1 5.5 3H8" />
      <path d="M16 3h2.5A2.5 2.5 0 0 1 21 5.5V8" />
      <path d="M21 16v2.5a2.5 2.5 0 0 1-2.5 2.5H16" />
      <path d="M8 21H5.5A2.5 2.5 0 0 1 3 18.5V16" />
      <path
        d="M10 9.2v5.6a.7.7 0 0 0 1.06.6l4.5-2.8a.7.7 0 0 0 0-1.2l-4.5-2.8a.7.7 0 0 0-1.06.6Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
