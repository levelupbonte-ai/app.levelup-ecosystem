"use client";

import { useEffect } from "react";

/**
 * The one controller of the scroll motion system (docs/motion.md). Mounted
 * once by the root layout; renders nothing.
 *
 *  1. Reveals. Every `[data-m]` element is watched by a single
 *     IntersectionObserver. The first time it enters the viewport it gets
 *     data-in="run" (the CSS transition plays), then "done" (all animation
 *     properties, will-change included, are dropped). Elements entering
 *     together are staggered; elements already above the viewport (anchor,
 *     reload, fast fling) are shown at once. Whatever mounts later (route
 *     changes, tabs) is picked up by a MutationObserver.
 *  2. Hold. Nothing is revealed while the first-visit intro (html.lu-intro)
 *     or a page transition (the LevelUp wipe) covers the screen; it is
 *     released as the cover lifts, so the animation is seen, not consumed
 *     behind the panel.
 *  3. Counters (`data-m="count"`): the figure counts up once, the final text
 *     stays in the DOM.
 *  4. Scrub progress (`data-scrub`): writes --p (0..1) on the element for what
 *     CSS scroll timelines cannot express (pinned chapters and the horizontal
 *     band; the statement text where view() timelines are unsupported).
 *
 * Play-once: routes already seen during this page load render in their end
 * state through `main[data-revisit]` (lib/play-once.tsx); this controller
 * still marks their elements, which changes nothing visible.
 */

const STAGGER_MS = 70;
const STAGGER_MAX = 6;
const COUNT_MS = 1400;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

function domOrder(a: Element, b: Element) {
  if (a === b) return 0;
  return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
    ? -1
    : 1;
}

function startCount(el: HTMLElement, delay: number) {
  const live = el.querySelector<HTMLElement>(".m-count-live");
  const to = Number(el.dataset.countTo);
  if (!live || !Number.isFinite(to)) return;
  const pre = el.dataset.countPre ?? "";
  const suf = el.dataset.countSuf ?? "";
  const commas = el.dataset.countCommas === "1";
  const fmt = (n: number) => {
    const v = Math.round(n);
    return pre + (commas ? v.toLocaleString("en-US") : String(v)) + suf;
  };
  live.textContent = fmt(0);
  const t0 = performance.now() + delay;
  const tick = (now: number) => {
    const k = clamp01((now - t0) / COUNT_MS);
    live.textContent = fmt(to * easeOutExpo(k));
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function MotionRoot() {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("lu-js")) return;
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMq.matches) {
      html.classList.remove("lu-js");
      return;
    }
    (window as unknown as { __luM?: boolean }).__luM = true;

    /* ------------------------------ holding ----------------------------- */
    let covering = false;
    let failsafe = 0;
    const pending = new Set<HTMLElement>();
    const held = () => covering || html.classList.contains("lu-intro");

    /* ------------------------------ reveals ----------------------------- */
    const done = (el: HTMLElement) => {
      if (el.isConnected) el.setAttribute("data-in", "done");
    };
    const reveal = (els: HTMLElement[], instant = false) => {
      els.sort(domOrder);
      let n = 0;
      for (const el of els) {
        if (el.hasAttribute("data-in")) continue;
        io.unobserve(el);
        if (instant) {
          el.setAttribute("data-in", "done");
          continue;
        }
        const step = Math.min(n++, STAGGER_MAX) * STAGGER_MS;
        el.style.setProperty("--m-s", `${step}ms`);
        el.setAttribute("data-in", "run");
        const own = parseFloat(el.style.getPropertyValue("--m-d")) || 0;
        const words = Number(el.dataset.mw) || 0;
        const wait = own + step;
        if (el.dataset.m === "count") startCount(el, wait);
        window.setTimeout(() => done(el), wait + 1800 + words * 70);
      }
    };
    const release = () => {
      const els = Array.from(pending).filter((el) => el.isConnected);
      pending.clear();
      reveal(els);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const hit: HTMLElement[] = [];
        const above: HTMLElement[] = [];
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) hit.push(el);
          else if (entry.boundingClientRect.top < 0) above.push(el);
        }
        if (above.length) reveal(above, true);
        if (!hit.length) return;
        if (held()) hit.forEach((el) => pending.add(el));
        else reveal(hit);
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );

    /* ------------------------------ scrub ------------------------------- */
    const nativeView = CSS.supports("animation-timeline: view()");
    const scrubbed = new Set<HTMLElement>();
    const active = new Set<HTMLElement>();
    let raf = 0;

    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      const reads: [HTMLElement, number][] = [];
      let moving = false;
      active.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (el.dataset.scrub === "pin") {
          const total = Math.max(1, r.height - vh);
          const target = clamp01(-r.top / total);
          const cur = Number(el.dataset.cur ?? target);
          let next = cur + (target - cur) * 0.2;
          if (Math.abs(target - next) < 0.0006) next = target;
          else moving = true;
          reads.push([el, next]);
        } else {
          reads.push([el, clamp01((vh - r.top) / (vh + r.height))]);
        }
      });
      for (const [el, p] of reads) {
        el.dataset.cur = String(p);
        el.style.setProperty("--p", p.toFixed(4));
      }
      if (moving) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && active.size) raf = requestAnimationFrame(frame);
    };
    const scrubIo = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) active.add(el);
          else active.delete(el);
        }
        kick();
      },
      { rootMargin: "30% 0px" },
    );
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    /* ------------------------------ discovery --------------------------- */
    const watchScrub = (el: HTMLElement) => {
      if (scrubbed.has(el)) return;
      // Statements use the native view() timeline where it exists.
      if (el.dataset.scrub === "view" && nativeView) return;
      scrubbed.add(el);
      scrubIo.observe(el);
    };
    const add = (root: ParentNode) => {
      root
        .querySelectorAll<HTMLElement>("[data-m]:not([data-in])")
        .forEach((el) => io.observe(el));
      root.querySelectorAll<HTMLElement>("[data-scrub]").forEach(watchScrub);
    };
    add(document);

    let queued: Node[] = [];
    let mutRaf = 0;
    const mo = new MutationObserver((records) => {
      for (const rec of records) {
        rec.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          const el = node as Element;
          // The live demos churn their DOM every frame: nothing to reveal there.
          if (el.closest(".ld-box")) return;
          queued.push(el);
        });
      }
      if (queued.length && !mutRaf) {
        mutRaf = requestAnimationFrame(() => {
          mutRaf = 0;
          const list = queued;
          queued = [];
          for (const node of list) {
            if (!node.isConnected) continue;
            const el = node as HTMLElement;
            if (el.matches("[data-m]:not([data-in])")) io.observe(el);
            if (el.matches("[data-scrub]")) watchScrub(el);
            add(el);
          }
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    /* ------------------------------ hold events ------------------------- */
    const onPhase = (event: Event) => {
      const phase = (event as CustomEvent<{ phase?: string }>).detail?.phase;
      window.clearTimeout(failsafe);
      if (phase === "cover") {
        covering = true;
        html.classList.add("lu-covering");
        failsafe = window.setTimeout(() => {
          covering = false;
          html.classList.remove("lu-covering");
          release();
        }, 12000);
      } else if (phase === "reveal") {
        covering = false;
        html.classList.remove("lu-covering");
        window.setTimeout(release, 160);
      }
    };
    document.addEventListener("lu-transition", onPhase);
    // The first-visit intro removes html.lu-intro when its curtain lifts.
    let wasIntro = html.classList.contains("lu-intro");
    const classWatch = new MutationObserver(() => {
      const now = html.classList.contains("lu-intro");
      if (wasIntro && !now) window.setTimeout(release, 260);
      wasIntro = now;
    });
    classWatch.observe(html, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      io.disconnect();
      scrubIo.disconnect();
      mo.disconnect();
      classWatch.disconnect();
      document.removeEventListener("lu-transition", onPhase);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(failsafe);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(mutRaf);
      html.classList.remove("lu-covering");
    };
  }, []);

  return null;
}
