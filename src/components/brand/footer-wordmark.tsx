"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/components/home/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * "LevelUp Ecosystem" at the foot of every page, in the exact lockup of the
 * first-visit intro (components/preloader: DM Sans black, "LevelUp" over a
 * wider "Ecosystem", both in currentColor with a top-down fade, 1000 × 220
 * viewBox cropped at the bottom edge).
 *
 * At rest it is the crisp SVG text. When the pointer (or a finger) moves over
 * it, the letters turn into the fine particles they are made of (sampled
 * from the same text drawn on a canvas, gradient included) and flow away
 * from it like ink in water: pushed out with a soft falloff, entrained by the
 * pointer's motion and curled into a slight swirl. Once it leaves they drift
 * back on critically damped springs and, settled, hand over to the SVG
 * again. At home the particles reproduce the text pixel for pixel, so the
 * swaps are invisible.
 *
 * The text stays real DOM text (SVG <text>, one accessible name); the canvas
 * is aria-hidden. No JavaScript or prefers-reduced-motion: just the text.
 * Performance: typed arrays, one canvas written as raw pixels (alpha splats,
 * no draw call per particle), DPR capped, nothing runs at rest, paused off
 * screen.
 */

const VIEW_W = 1000;
const LINES = [
  {
    text: "LevelUp",
    y: 85,
    size: 100,
    spacing: -0.01,
    fade: [10, 90, 0.85, 0.45],
  },
  {
    text: "Ecosystem",
    y: 198,
    size: 135,
    spacing: 0.01,
    fade: [95, 205, 0.55, 0.25],
  },
] as const;

/** Particle budgets (each is one block of the sampled text). */
const TARGET_DESKTOP = 56000;
const TARGET_MOBILE = 18000;

/* Flow (CSS px and seconds; scaled to device px at run time). */
const PUSH = 2400; // outward push at the pointer
const SWIRL = 950; // tangential curl
const ENTRAIN = 5; // how fast particles pick up the pointer's velocity
const DAMP = 2.6; // velocity decay (1/s)
const HOME_NEAR = 7; // spring home while the pointer is around
const HOME_FREE = 20; // spring home once it has left

interface Field {
  n: number;
  /** Device-pixel canvas size. */
  w: number;
  h: number;
  /** Block size of one particle, device px. */
  s: number;
  /** Home (top-left of the block), device px. */
  hx: Float32Array;
  hy: Float32Array;
  /** Alpha of the block (coverage × gradient), 0–1. */
  a: Float32Array;
  /** Response to the flow: uneven, organic dispersion. */
  m: Float32Array;
}

function hash(i: number) {
  const s = Math.sin(i * 91.7 + 47.3) * 43758.5453;
  return s - Math.floor(s);
}

/** Draws the lockup (with its gradients) at device resolution and cuts it
 *  into s × s blocks: one particle per block that holds any ink. */
function buildField(
  w: number,
  h: number,
  /** The lockup's box inside the canvas, device px. */
  box: { x: number; y: number; w: number },
  family: string,
  target: number,
  minBlock: number,
): Field | null {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const x = c.getContext("2d", { willReadFrequently: true });
  if (!x) return null;
  const k = box.w / VIEW_W;
  x.textAlign = "center";
  x.textBaseline = "alphabetic";
  for (const line of LINES) {
    const size = line.size * k;
    x.font = `900 ${size}px ${family}`;
    if ("letterSpacing" in x) {
      (
        x as CanvasRenderingContext2D & { letterSpacing: string }
      ).letterSpacing = `${(line.spacing * size).toFixed(3)}px`;
    }
    const [y0, y1, a0, a1] = line.fade;
    const g = x.createLinearGradient(0, box.y + y0 * k, 0, box.y + y1 * k);
    g.addColorStop(0, `rgba(0,0,0,${a0})`);
    g.addColorStop(1, `rgba(0,0,0,${a1})`);
    x.fillStyle = g;
    x.fillText(line.text, box.x + box.w / 2, box.y + line.y * k);
  }
  const data = x.getImageData(0, 0, w, h).data;
  let ink = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i]) ink++;
  let s = minBlock;
  while (ink / (s * s) > target) s++;

  const hx: number[] = [];
  const hy: number[] = [];
  const al: number[] = [];
  const norm = 1 / (s * s * 255);
  for (let by = 0; by < h; by += s) {
    for (let bx = 0; bx < w; bx += s) {
      let sum = 0;
      for (let yy = by; yy < Math.min(h, by + s); yy++) {
        for (let xx = bx; xx < Math.min(w, bx + s); xx++) {
          sum += data[(yy * w + xx) * 4 + 3];
        }
      }
      if (sum === 0) continue;
      hx.push(bx);
      hy.push(by);
      al.push(sum * norm);
    }
  }
  const n = hx.length;
  if (!n) return null;
  const m = new Float32Array(n);
  for (let i = 0; i < n; i++) m[i] = 0.55 + hash(i) * 0.9;
  return {
    n,
    w,
    h,
    s,
    hx: Float32Array.from(hx),
    hy: Float32Array.from(hy),
    a: Float32Array.from(al),
    m,
  };
}

/** Any CSS colour to sRGB, by painting one pixel. */
function toRgb(value: string): [number, number, number] {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const x = c.getContext("2d", { willReadFrequently: true });
  if (!x) return [17, 17, 17];
  x.fillStyle = "#111";
  x.fillStyle = value;
  x.fillRect(0, 0, 1, 1);
  const [r, g, b] = x.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

export function FooterWordmark({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced) return;
    const box = boxRef.current;
    const svg = svgRef.current;
    const canvas = canvasRef.current;
    if (!box || !svg || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let field: Field | null = null;
    let dirty = true;
    let building = false;
    let dpr = 1;
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let acc = new Float32Array(0); // Σ alpha × coverage
    let cov = new Float32Array(0); // Σ coverage
    let image: ImageData | null = null;
    let colour = "";
    let raf = 0;
    let last = 0;
    let live = false; // particle layer on screen
    let visible = false;
    let disposed = false;
    // Pointer, client coordinates; velocity smoothed in CSS px/s.
    const ptr = {
      on: false,
      cx: 0,
      cy: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      fresh: true,
    };
    let touchId: number | null = null;

    const family = () =>
      getComputedStyle(svg.querySelector("text") ?? svg).fontFamily ||
      "DM Sans, sans-serif";

    const build = async () => {
      if (building || disposed) return;
      building = true;
      try {
        await document.fonts.load(`900 100px ${family()}`);
      } catch {
        /* sample with whatever is loaded */
      }
      building = false;
      if (disposed) return;
      const r = box.getBoundingClientRect();
      const c = canvas.getBoundingClientRect();
      if (!r.width || !r.height || !c.width) return;
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
      // The canvas overhangs the lockup (above and to the sides), so the
      // letters can blow out of their box instead of being clipped.
      const w = Math.round(c.width * dpr);
      const h = Math.round(c.height * dpr);
      field = buildField(
        w,
        h,
        {
          x: (r.left - c.left) * dpr,
          y: (r.top - c.top) * dpr,
          w: r.width * dpr,
        },
        family(),
        coarse || r.width < 640 ? TARGET_MOBILE : TARGET_DESKTOP,
        Math.max(1, Math.round(dpr)),
      );
      dirty = false;
      if (!field) return;
      canvas.width = w;
      canvas.height = h;
      ox = new Float32Array(field.n);
      oy = new Float32Array(field.n);
      vx = new Float32Array(field.n);
      vy = new Float32Array(field.n);
      acc = new Float32Array(w * h);
      cov = new Float32Array(w * h);
      image = ctx.createImageData(w, h);
      colour = "";
    };

    /** Splats every particle into the buffers (box coverage, so sub-pixel
     *  motion stays smooth) and writes them out as one image. A pixel shows
     *  the mean alpha of the particles covering it, times the coverage up
     *  to 1: crowded particles never get darker than the letters they came
     *  from, scattered ones thin out. */
    const paint = () => {
      const F = field;
      if (!F || !image) return;
      const px = image.data;
      acc.fill(0);
      cov.fill(0);
      const { w, h, s } = F;
      for (let i = 0; i < F.n; i++) {
        const x = F.hx[i] + ox[i];
        const y = F.hy[i] + oy[i];
        const x0 = Math.floor(x);
        const y0 = Math.floor(y);
        const fx = x - x0;
        const fy = y - y0;
        const a = F.a[i];
        for (let j = 0; j <= s; j++) {
          const yy = y0 + j;
          if (yy < 0 || yy >= h) continue;
          const wy = j === 0 ? 1 - fy : j === s ? fy : 1;
          if (wy <= 0) continue;
          const row = yy * w;
          const ay = a * wy;
          for (let k = 0; k <= s; k++) {
            const xx = x0 + k;
            if (xx < 0 || xx >= w) continue;
            const wx = k === 0 ? 1 - fx : k === s ? fx : 1;
            if (wx > 0) {
              acc[row + xx] += ay * wx;
              cov[row + xx] += wy * wx;
            }
          }
        }
      }
      for (let p = 0, q = 3; p < acc.length; p++, q += 4) {
        const c = cov[p];
        px[q] = c > 1 ? (acc[p] / c) * 255 : acc[p] * 255;
      }
      ctx.putImageData(image, 0, 0);
    };

    /** The ink colour (theme): the pixels' RGB, set once per change. */
    const syncColour = () => {
      const now = getComputedStyle(svg).color;
      if (!image || now === colour) return;
      colour = now;
      const [r, g, b] = toRgb(now);
      const px = image.data;
      for (let i = 0; i < px.length; i += 4) {
        px[i] = r;
        px[i + 1] = g;
        px[i + 2] = b;
      }
    };

    const showParticles = (on: boolean) => {
      if (live === on) return;
      live = on;
      // Same image either way: the swap is invisible.
      canvas.style.opacity = on ? "1" : "0";
      svg.style.opacity = on ? "0" : "1";
    };

    const step = (dt: number) => {
      const F = field;
      if (!F) return 0;
      const rect = canvas.getBoundingClientRect();
      const R = Math.max(48, rect.height * 0.45) * dpr;
      const R2 = R * R;
      let px = 0;
      let py = 0;
      let fvx = 0;
      let fvy = 0;
      if (ptr.on) {
        // Pointer in device px, at the block centre convention.
        px = (ptr.cx - rect.left) * dpr - F.s / 2;
        py = (ptr.cy - rect.top) * dpr - F.s / 2;
        if (ptr.fresh) {
          ptr.x = px;
          ptr.y = py;
          ptr.fresh = false;
        }
        const k = 1 - Math.exp(-dt * 18);
        ptr.vx += ((px - ptr.x) / dt - ptr.vx) * k;
        ptr.vy += ((py - ptr.y) / dt - ptr.vy) * k;
        ptr.x = px;
        ptr.y = py;
        fvx = ptr.vx;
        fvy = ptr.vy;
      }
      const push = PUSH * dpr;
      const swirl = SWIRL * dpr;
      const homeK = ptr.on ? HOME_NEAR : HOME_FREE;
      // Critically damped overall (the drag above counts): no overshoot,
      // no slow tail.
      const homeC = Math.max(0, 2 * Math.sqrt(homeK) - DAMP);
      const damp = Math.exp(-DAMP * dt);
      const entrain = 1 - Math.exp(-ENTRAIN * dt);
      let moving = 0;
      for (let i = 0; i < F.n; i++) {
        let u = vx[i];
        let v = vy[i];
        const dx0 = ox[i];
        const dy0 = oy[i];
        const at = dx0 === 0 && dy0 === 0 && u === 0 && v === 0;
        if (ptr.on) {
          const dx = F.hx[i] + dx0 - px;
          const dy = F.hy[i] + dy0 - py;
          const d2 = dx * dx + dy * dy;
          if (d2 >= R2 && at) continue; // untouched, at home
          if (d2 < R2) {
            const d = Math.sqrt(d2) + 1e-3;
            const t = 1 - d2 / R2;
            const f = t * t * F.m[i]; // soft falloff
            const nx = dx / d;
            const ny = dy / d;
            u += (nx * push - ny * swirl) * f * dt;
            v += (ny * push + nx * swirl) * f * dt;
            // Carried along by the pointer's flow.
            u += (fvx - u) * entrain * f;
            v += (fvy - v) * entrain * f;
          }
        } else if (at) {
          continue;
        }
        u += (-homeK * dx0 - homeC * u) * dt;
        v += (-homeK * dy0 - homeC * v) * dt;
        u *= damp;
        v *= damp;
        vx[i] = u;
        vy[i] = v;
        ox[i] = dx0 + u * dt;
        oy[i] = dy0 + v * dt;
        const e =
          Math.abs(ox[i]) +
          Math.abs(oy[i]) +
          (Math.abs(u) + Math.abs(v)) * 0.05;
        if (e > moving) moving = e;
      }
      return moving / dpr;
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed || !field) return;
      const dt = last ? Math.min(1 / 30, (now - last) / 1000) : 1 / 60;
      last = now;
      const moving = step(dt);
      if (!ptr.on && moving < 0.25) {
        // Settled: back home exactly, then the crisp text again.
        ox.fill(0);
        oy.fill(0);
        vx.fill(0);
        vy.fill(0);
        showParticles(false);
        last = 0;
        return;
      }
      paint();
      raf = requestAnimationFrame(frame);
    };

    const wake = async () => {
      if (disposed || !visible) return;
      if (dirty || !field) await build();
      if (!field || raf) return;
      if (!live) {
        syncColour();
        paint(); // home positions: the same picture as the SVG
        showParticles(true);
      }
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const near = (x: number, y: number) => {
      const r = box.getBoundingClientRect();
      const m = Math.max(24, r.height * 0.25);
      return (
        x >= r.left - m &&
        x <= r.right + m &&
        y >= r.top - m &&
        y <= r.bottom + m
      );
    };
    const press = (x: number, y: number) => {
      if (!ptr.on) ptr.fresh = true;
      ptr.cx = x;
      ptr.cy = y;
      ptr.on = true;
      void wake();
    };
    const release = () => {
      ptr.on = false;
      ptr.vx = ptr.vy = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // touch events below
      if (visible && near(e.clientX, e.clientY)) press(e.clientX, e.clientY);
      else if (ptr.on) release();
    };
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget && e.pointerType !== "touch") release();
    };
    // Touch events keep flowing while the page scrolls (pointer events
    // would be cancelled), so a drag in any direction stirs the letters.
    const onTouchStart = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      if (!t || !visible || !near(t.clientX, t.clientY)) return;
      touchId = t.identifier;
      press(t.clientX, t.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchId === null) return;
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === touchId) press(t.clientX, t.clientY);
      }
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchId === null) return;
      for (const t of Array.from(e.changedTouches)) {
        if (t.identifier === touchId) {
          touchId = null;
          release();
        }
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    // Sample the text ahead of time, once the footer comes close.
    let idle = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && dirty && !idle) {
          const ric = window.requestIdleCallback as
            typeof window.requestIdleCallback | undefined;
          const run = () => {
            idle = 0;
            if (dirty) void build();
          };
          idle = ric ? ric(run, { timeout: 800 }) : window.setTimeout(run, 200);
        }
        if (!visible) {
          // Off screen: drop the animation, back to the crisp text.
          cancelAnimationFrame(raf);
          raf = 0;
          release();
          ox.fill(0);
          oy.fill(0);
          vx.fill(0);
          vy.fill(0);
          showParticles(false);
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(box);

    const ro = new ResizeObserver(() => {
      dirty = true;
      if (live) {
        cancelAnimationFrame(raf);
        raf = 0;
        release();
        showParticles(false);
      }
    });
    ro.observe(box);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      const cic = window.cancelIdleCallback as
        typeof window.cancelIdleCallback | undefined;
      cic?.(idle);
      window.clearTimeout(idle);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      svg.style.opacity = "";
    };
  }, [reduced]);

  return (
    <div
      className={cn(
        "pointer-events-none mx-auto -mb-2 w-full max-w-2xl overflow-x-clip px-4 pb-0 opacity-80 select-none sm:max-w-3xl md:max-w-4xl dark:opacity-85",
        className,
      )}
    >
      <div ref={boxRef} className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} 220`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="LevelUp Ecosystem"
          className="text-foreground block h-auto w-full select-none"
        >
          <defs>
            <linearGradient
              id="footer_paint_levelup"
              x1="500"
              y1="10"
              x2="500"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="currentColor" stopOpacity="0.85" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.45" />
            </linearGradient>
            <linearGradient
              id="footer_paint_ecosystem"
              x1="500"
              y1="95"
              x2="500"
              y2="205"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <text
            x="50%"
            y="85"
            textAnchor="middle"
            fill="url(#footer_paint_levelup)"
            className="font-display font-black select-none"
            style={{
              fontSize: "100px",
              fontWeight: 900,
              letterSpacing: "-0.01em",
              fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
            }}
          >
            LevelUp
          </text>
          <text
            x="50%"
            y="198"
            textAnchor="middle"
            fill="url(#footer_paint_ecosystem)"
            className="font-display font-black select-none"
            style={{
              fontSize: "135px",
              fontWeight: 900,
              letterSpacing: "0.01em",
              fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
            }}
          >
            Ecosystem
          </text>
        </svg>
        {reduced ? null : (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="text-foreground absolute -top-[45%] -left-4 block h-[145%] w-[calc(100%+2rem)] opacity-0"
          />
        )}
      </div>
    </div>
  );
}
