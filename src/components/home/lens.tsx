"use client";

import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

const MAX_RADIUS = 42; // px: an 84px lens on display headings
const EASE = 0.16;
const PAD_X = 6; // px of grace around a line, so the lens does not flicker
const PAD_Y = 2;

function lensCapable() {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

interface LineBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

/**
 * The boxes of the rendered lines of text inside `el` (relative to it):
 * Range.getClientRects() per visible text node, merged per line. The
 * screen-reader-only copy and the lens overlay are skipped.
 */
function measureLines(el: HTMLElement, overlay: HTMLElement | null) {
  const origin = el.getBoundingClientRect();
  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!node.textContent?.trim() || !parent) return NodeFilter.FILTER_REJECT;
      if (overlay?.contains(parent) || parent.closest(".sr-only"))
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const lines: LineBox[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    range.selectNodeContents(node);
    for (const r of Array.from(range.getClientRects())) {
      if (r.width < 1 || r.height < 1) continue;
      const box = {
        left: r.left - origin.left,
        right: r.right - origin.left,
        top: r.top - origin.top,
        bottom: r.bottom - origin.top,
      };
      // Same line when the vertical ranges overlap by more than half.
      const line = lines.find(
        (l) =>
          Math.min(l.bottom, box.bottom) - Math.max(l.top, box.top) >
          0.5 * Math.min(l.bottom - l.top, box.bottom - box.top),
      );
      if (line) {
        line.left = Math.min(line.left, box.left);
        line.right = Math.max(line.right, box.right);
        line.top = Math.min(line.top, box.top);
        line.bottom = Math.max(line.bottom, box.bottom);
      } else lines.push(box);
    }
  }
  return lines;
}

/**
 * Text with the cursor lens: a dark disc follows the pointer over the words
 * and the text under it is shown inverted. The text is rendered a second
 * time in an aria-hidden overlay clipped to a circle (clip-path), so screen
 * readers read it once and the base text never moves (no layout shift, no
 * LCP impact: the overlay only mounts on hover-capable, motion-OK devices,
 * after hydration).
 *
 * The lens only opens over actual lines of text (their measured boxes), not
 * over the empty part of the block, and eases shut between lines. Its size
 * follows the line height, so it also suits large paragraphs.
 *
 * Position and radius live in CSS variables updated in a rAF loop (lerped),
 * never in React state.
 */
export function LensText({
  as: Tag = "h2",
  id,
  className,
  style,
  children,
  overlay,
  tone = "default",
}: {
  as?: ElementType;
  id?: string;
  className?: string;
  style?: CSSProperties;
  /** Base content (may include screen-reader-only text). */
  children: ReactNode;
  /** Visual content repeated inside the lens; defaults to `children`. */
  overlay?: ReactNode;
  /** "inverted" for text on the dark ink sections. */
  tone?: "default" | "inverted";
}) {
  const ref = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLSpanElement>(null);
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
    let lines: LineBox[] | null = null;
    let radius = MAX_RADIUS;

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
    const measure = () => {
      lines = measureLines(el, overlayRef.current);
      const h = lines.length
        ? Math.min(...lines.map((l) => l.bottom - l.top))
        : 2 * MAX_RADIUS;
      radius = Math.max(16, Math.min(MAX_RADIUS, h * 0.62));
    };
    const overText = (x: number, y: number) => {
      if (!lines) measure();
      return (lines ?? []).some(
        (l) =>
          x >= l.left - PAD_X &&
          x <= l.right + PAD_X &&
          y >= l.top - PAD_Y &&
          y <= l.bottom + PAD_Y,
      );
    };
    const follow = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = el.getBoundingClientRect();
      s.tx = e.clientX - rect.left;
      s.ty = e.clientY - rect.top;
      const on = overText(s.tx, s.ty);
      if (on && s.r < 1) {
        // Open where the pointer is, not from a stale spot.
        s.x = s.tx;
        s.y = s.ty;
      }
      s.tr = on ? radius : 0;
      run();
    };
    const onEnter = (e: PointerEvent) => {
      lines = null; // entrance transforms and the rotating word move lines
      follow(e);
    };
    const onLeave = () => {
      s.tr = 0;
      run();
    };
    // Re-measure lazily when the text or its size changes.
    const invalidate = () => {
      lines = null;
    };
    const ro = new ResizeObserver(invalidate);
    ro.observe(el);
    const mo = new MutationObserver(invalidate);
    mo.observe(el, { subtree: true, childList: true, characterData: true });
    window.addEventListener("resize", invalidate, { passive: true });

    el.addEventListener("animationend", invalidate);
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", follow);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", invalidate);
      el.removeEventListener("animationend", invalidate);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", follow);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled]);

  return (
    <Tag ref={ref} id={id} className={cn("relative", className)} style={style}>
      {children}
      {enabled ? (
        <span
          ref={overlayRef}
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
