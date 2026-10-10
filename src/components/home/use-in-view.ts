"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is on screen. With `once`, it stays true after
 * the first time (entrance reveals); without, it follows the viewport
 * (pausing loops and canvases while off screen).
 */
export function useInView<T extends Element>({
  once = false,
  rootMargin = "0px 0px -10% 0px",
  threshold = 0,
}: {
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
} = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return [ref, inView] as const;
}
