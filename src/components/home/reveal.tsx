"use client";

import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

import { useInView } from "./use-in-view";

/** Fades and lifts its content in the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ once: true });
  return (
    <div
      ref={ref}
      data-inview={inView ? "true" : "false"}
      className={cn("lu-reveal", className)}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
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
