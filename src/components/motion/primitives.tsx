import type { CSSProperties, ElementType, ReactNode } from "react";

import {
  countWords,
  m,
  mHero,
  splitWords,
  type MHero,
  type MKind,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Server-safe building blocks of the scroll motion system (docs/motion.md).
 * No hooks, no "use client": they can be used from any component.
 */

/** Any element with a one-shot reveal: `<M kind="tilt" delay={80}>`. */
export function M({
  as: Tag = "div",
  kind = "up",
  delay,
  className,
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  kind?: Exclude<MKind, "words">;
  /** Milliseconds, added to the automatic stagger. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
} & Record<string, unknown>) {
  return (
    <Tag {...rest} {...m(kind, { delay, style })} className={className}>
      {children}
    </Tag>
  );
}

/**
 * A headline whose words rise out of a mask. With `hero` it is the entrance
 * of the top of a page: it plays with the page (pure CSS, no JavaScript, no
 * opacity, so the text is painted at once) instead of waiting for the scroll.
 */
export function Headline({
  as: Tag = "h2",
  hero = false,
  delay,
  className,
  id,
  style,
  children,
}: {
  as?: ElementType;
  hero?: boolean;
  /** Milliseconds. */
  delay?: number;
  className?: string;
  id?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      className={className}
      data-mw={countWords(children)}
      {...(hero
        ? mHero("words", { delay: 140 + (delay ?? 0), style })
        : m("words", { delay, style }))}
    >
      {splitWords(children)}
    </Tag>
  );
}

/** Entrance of an element at the top of a page (see Headline `hero`). */
export function Hero({
  as: Tag = "div",
  kind = "up",
  delay = 0,
  className,
  style,
  children,
}: {
  as?: ElementType;
  kind?: Exclude<MHero, "words">;
  /** Milliseconds after the page is shown. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <Tag
      className={className}
      {...mHero(kind, { delay: 140 + delay, style })}
    >
      {children}
    </Tag>
  );
}

/**
 * A statement: its words light up (opacity, a touch of blur) as it crosses
 * the viewport, forward and backward with the scroll. Keep to one or two per
 * page, on short, important sentences below the fold.
 */
export function Statement({
  as: Tag = "p",
  className,
  id,
  children,
}: {
  as?: ElementType;
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <Tag id={id} className={className} data-stmt="" data-scrub="view">
      {splitWords(children, "stmt")}
    </Tag>
  );
}

/**
 * A real figure that counts up the first time it is seen. The final text is
 * what the DOM holds (and what assistive technology reads); the live copy is
 * an aria-hidden overlay, so the box never changes size. Figures below 10 and
 * text without a number are rendered as they are.
 */
export function Count({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const match = /^(\D*?)(\d[\d,]*)(\D[\s\S]*)?$/.exec(value);
  const n = match ? Number(match[2].replace(/,/g, "")) : NaN;
  if (!match || !Number.isFinite(n) || n < 10) {
    return <span className={className}>{value}</span>;
  }
  return (
    <span
      className={cn("m-count", className)}
      data-m="count"
      data-count-to={n}
      data-count-pre={match[1]}
      data-count-suf={match[3] ?? ""}
      data-count-commas={match[2].includes(",") ? "1" : "0"}
    >
      <span className="m-count-final">{value}</span>
      <span aria-hidden="true" className="m-count-live" />
    </span>
  );
}

/**
 * Two soft glows in the section colours, fixed behind the page, that drift
 * with the scroll: the continuity between sections. Mounted once by the layout.
 */
export function Universe() {
  return (
    <div aria-hidden="true" className="lu-universe">
      <i />
      <i />
    </div>
  );
}
