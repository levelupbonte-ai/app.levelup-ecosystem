import type { CSSProperties } from "react";

/**
 * Small looping line-art for the capability rows. Every motion is a CSS
 * transform/opacity animation (class lu-loop), paused by the parent's
 * data-live="false" while off screen and disabled under reduced motion.
 */

const box: CSSProperties = { transformBox: "fill-box" };

function anim(
  name: string,
  duration: number,
  delay = 0,
  origin = "center",
): CSSProperties {
  return {
    ...box,
    transformOrigin: origin,
    animation: `${name} ${duration}s ease-in-out ${delay}s infinite`,
  };
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** 01: a browser window whose content blocks assemble. */
export function WebsiteIcon() {
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden="true">
      <rect x="28" y="22" width="144" height="116" rx="5" {...stroke} />
      <line x1="28" y1="42" x2="172" y2="42" {...stroke} />
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={40 + i * 9}
          cy="32"
          r="2.5"
          fill="currentColor"
          opacity="0.5"
        />
      ))}
      {/* Hero block */}
      <rect
        className="lu-loop"
        x="40"
        y="54"
        width="76"
        height="9"
        rx="2"
        fill="currentColor"
        style={anim("lu-grow-x", 3.2, 0, "left center")}
      />
      <rect
        className="lu-loop"
        x="40"
        y="69"
        width="52"
        height="5"
        rx="2"
        fill="currentColor"
        opacity="0.6"
        style={anim("lu-grow-x", 3.2, 0.25, "left center")}
      />
      {/* Cards */}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          className="lu-loop"
          x={40 + i * 42}
          y="88"
          width="34"
          height="38"
          rx="3"
          fill="currentColor"
          opacity="0.14"
          style={anim("lu-pulse-soft", 3.2, 0.5 + i * 0.25)}
        />
      ))}
      <rect
        x="128"
        y="54"
        width="32"
        height="20"
        rx="10"
        fill="var(--brand)"
        className="lu-loop"
        style={anim("lu-pulse", 3.2, 1.2)}
      />
    </svg>
  );
}

/** 02: a calendar where slots light up and one gets booked. */
export function BookingIcon() {
  const cells: [number, number][] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) cells.push([c, r]);
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden="true">
      <rect x="34" y="26" width="132" height="110" rx="6" {...stroke} />
      <line x1="34" y1="50" x2="166" y2="50" {...stroke} />
      <line x1="64" y1="18" x2="64" y2="32" {...stroke} />
      <line x1="136" y1="18" x2="136" y2="32" {...stroke} />
      {cells.map(([c, r], i) => {
        const booked = c === 3 && r === 1;
        return (
          <rect
            key={i}
            className="lu-loop"
            x={46 + c * 23}
            y={60 + r * 23}
            width="16"
            height="16"
            rx="3"
            fill={booked ? "var(--brand)" : "currentColor"}
            opacity={booked ? 1 : 0.16}
            style={
              booked
                ? anim("lu-pulse", 2.4, 0)
                : anim("lu-pulse-soft", 3.6, ((c + r * 5) % 7) * 0.35)
            }
          />
        );
      })}
      <path
        d="M 118.5 91 l 3 3.5 l 5.5 -6.5"
        fill="none"
        stroke="var(--background)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 03: a map pin sending out rings (found nearby). */
export function VisibilityIcon() {
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden="true">
      {/* Map grid */}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={`h${i}`}
          x1="22"
          x2="178"
          y1={40 + i * 28}
          y2={40 + i * 28}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.18"
        />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`v${i}`}
          y1="26"
          y2="138"
          x1={40 + i * 30}
          x2={40 + i * 30}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.18"
        />
      ))}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          className="lu-loop"
          cx="100"
          cy="104"
          r="34"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="1.5"
          style={{
            ...box,
            transformOrigin: "center",
            animation: `lu-ring 3s ease-out ${i}s infinite`,
          }}
        />
      ))}
      <path
        d="M100 108 C 88 92 80 82 80 70 a 20 20 0 0 1 40 0 c 0 12 -8 22 -20 38 z"
        {...stroke}
        fill="var(--background)"
      />
      <circle cx="100" cy="70" r="7" fill="currentColor" />
    </svg>
  );
}

/** 04: a shield with a scan line passing over a lock. */
export function SecurityIcon() {
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden="true">
      <path
        d="M 100 18 L 150 36 L 150 84 Q 150 124 100 142 Q 50 124 50 84 L 50 36 Z"
        {...stroke}
      />
      <path
        className="lu-loop"
        d="M 100 32 L 137 46 L 137 82 Q 137 112 100 127 Q 63 112 63 82 L 63 46 Z"
        fill="var(--brand)"
        opacity="0.12"
        style={anim("lu-pulse", 3, 0)}
      />
      <rect x="84" y="72" width="32" height="26" rx="4" fill="currentColor" />
      <path
        d="M 90 72 L 90 63 Q 90 52 100 52 Q 110 52 110 63 L 110 72"
        {...stroke}
        strokeWidth={3}
      />
      <circle cx="100" cy="83" r="3.5" fill="var(--background)" />
      <rect
        x="98.5"
        y="84"
        width="3"
        height="7"
        rx="1"
        fill="var(--background)"
      />
      <line
        className="lu-loop"
        x1="56"
        x2="144"
        y1="40"
        y2="40"
        stroke="var(--brand)"
        strokeWidth="1.5"
        style={{
          ...box,
          transformOrigin: "center",
          animation: "lu-scan 3.2s ease-in-out infinite",
        }}
      />
    </svg>
  );
}
