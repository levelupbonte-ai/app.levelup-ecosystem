"use client";

import { type RefObject, useEffect } from "react";

/**
 * Keeps a full-screen shell exactly on the part of the screen the visitor can
 * see while the on-screen keyboard is open.
 *
 * Chrome on Android resizes the layout viewport itself
 * (`interactive-widget=resizes-content` in the root viewport), so `100dvh`
 * already follows the keyboard. iOS Safari does not: the layout viewport keeps
 * its height, the keyboard covers the bottom and Safari scrolls the page to
 * reveal the field, which pushes the header off screen and can leave a field
 * near the bottom hidden behind the keyboard.
 *
 * This hook follows `window.visualViewport` and sizes the shell to it
 * (height = visible height, shifted by the distance Safari scrolled), so a bar
 * docked at the bottom of the shell sits right on top of the keyboard and a
 * header at its top stays pinned. When the shell hosts a same-origin iframe,
 * the iframe's root gets `data-kb="open"` and the device safe-area insets as
 * `--sat` / `--sab` (iframes do not receive them from the browser).
 * Pinch-zoom is left alone.
 */
export function useKeyboardViewport(
  shellRef: RefObject<HTMLElement | null>,
  frameRef?: RefObject<HTMLIFrameElement | null>,
) {
  useEffect(() => {
    const shell = shellRef.current;
    const vv = window.visualViewport;
    if (!shell) return;

    // Probe for the safe-area insets of the page (0 without viewport-fit=cover).
    const probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText =
      "position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)";
    document.body.appendChild(probe);

    let frame = 0;
    let open = false;

    const syncFrame = () => {
      try {
        const root = frameRef?.current?.contentDocument?.documentElement;
        if (!root) return;
        const cs = getComputedStyle(probe);
        root.style.setProperty("--sat", cs.paddingTop);
        root.style.setProperty("--sab", cs.paddingBottom);
        if (open) root.dataset.kb = "open";
        else delete root.dataset.kb;
      } catch {
        // Cross-origin or not loaded yet: the frame falls back to env().
      }
    };

    const apply = () => {
      frame = 0;
      const zoomed = !!vv && vv.scale > 1.02;
      open = !!vv && !zoomed && window.innerHeight - vv.height > 100;
      if (open && vv) {
        shell.style.height = `${Math.round(vv.height)}px`;
        shell.style.transform = `translate3d(0,${Math.round(vv.offsetTop)}px,0)`;
        if (window.scrollY || window.scrollX) window.scrollTo(0, 0);
      } else {
        shell.style.removeProperty("height");
        shell.style.removeProperty("transform");
      }
      syncFrame();
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    vv?.addEventListener("resize", schedule);
    vv?.addEventListener("scroll", schedule);
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    const iframe = frameRef?.current;
    iframe?.addEventListener("load", syncFrame);
    schedule();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      vv?.removeEventListener("resize", schedule);
      vv?.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      window.removeEventListener("scroll", schedule);
      iframe?.removeEventListener("load", syncFrame);
      probe.remove();
      shell.style.removeProperty("height");
      shell.style.removeProperty("transform");
    };
  }, [shellRef, frameRef]);
}
