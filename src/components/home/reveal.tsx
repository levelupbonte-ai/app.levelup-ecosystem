"use client";

import type { ReactNode } from "react";

import { M } from "@/components/motion/primitives";
import type { MKind } from "@/lib/motion";

import { useInView } from "./use-in-view";

/**
 * Reveals its content the first time it scrolls into view (the scroll motion
 * system, docs/motion.md): by default it fades and rises; `kind` picks
 * another (tilt, clip, ...). `delay` is in milliseconds.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  kind = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  kind?: Exclude<MKind, "words">;
}) {
  return (
    <M kind={kind} delay={delay} className={className}>
      {children}
    </M>
  );
}

/**
 * Section wrapper exposing `data-live` (on screen right now), which pauses
 * the looping line-art inside while it is scrolled away.
 */
export function LiveRegion({
  children,
  className,
  as: Tag = "div",
  id,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  id?: string;
  labelledBy?: string;
}) {
  const [ref, live] = useInView<HTMLDivElement>({ rootMargin: "120px" });
  return (
    <Tag
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      data-live={live ? "true" : "false"}
      className={className}
    >
      {children}
    </Tag>
  );
}
