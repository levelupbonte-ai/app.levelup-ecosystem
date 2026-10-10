"use client";

import {
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const RADIUS = 42; // px: an 84px lens
const EASE = 0.16;

function lensCapable() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Heading with the cursor lens: a dark disc follows the pointer and the text
 * under it is shown inverted. The text is rendered a second time in an
 * aria-hidden overlay clipped to a circle (clip-path), so screen readers read
 * it once and the base text never moves (no layout shift, no LCP impact: the
 * overlay only mounts on hover-capable, motion-OK devices, after hydration).
 *
 * Position and radius live in CSS variables updated in a rAF loop (lerped),
 * never in React state.
 */
export function LensText({
  as: Tag = "h2",
  id,
  className,
  children,
  overlay,
  tone = "default",
}: {
  as?: ElementType;
  id?: string;
  className?: string;
  /** Base content (may include screen-reader-only text). */
  children: ReactNode;
  /** Visual content repeated inside the lens; defaults to `children`. */
  overlay?: ReactNode;
  /** "inverted" for headings on the dark ink sections. */
  tone?: "default" | "inverted";
}) {
  const ref = useRef<HTMLElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(lensCapable());
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const s = { x: 0, y: 0, r: 0, tx: 0, ty: 0, tr: 0 };
    let raf = 0;
    let running = false;

    const apply = () => {
      el.style.setProperty("--lx", `${s.x.toFixed(1)}px`);
      el.style.setProperty("--ly", `${s.y.toFixed(1)}px`);
      el.style.setProperty("--lr", `${s.r.toFixed(1)}px`);
    };
    const tick = () => {
      s.x += (s.tx - s.x) * EASE * 1.6;
      s.y += (s.ty - s.y) * EASE * 1.6;
      s.r += (s.tr - s.r) * EASE;
      apply();
      const settled =
        Math.abs(s.tx - s.x) < 0.2 &&
        Math.abs(s.ty - s.y) < 0.2 &&
        Math.abs(s.tr - s.r) < 0.2;
      if (settled) {
        s.x = s.tx;
        s.y = s.ty;
        s.r = s.tr;
        apply();
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const run = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const target = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      s.tx = e.clientX - rect.left;
      s.ty = e.clientY - rect.top;
    };
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target(e);
      if (s.r < 1) {
        s.x = s.tx;
        s.y = s.ty;
      }
      s.tr = RADIUS;
      run();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target(e);
      s.tr = RADIUS;
      run();
    };
    const onLeave = () => {
      s.tr = 0;
      run();
    };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  return (
    <Tag ref={ref} id={id} className={cn("relative", className)}>
      {children}
      {enabled ? (
        <span
          aria-hidden="true"
          className={cn(
            "lu-lens pointer-events-none absolute inset-0 select-none",
            tone === "inverted"
              ? "bg-ink-foreground text-ink"
              : "bg-foreground text-background",
          )}
        >
          {overlay ?? children}
        </span>
      ) : null}
    </Tag>
  );
}
