"use client";

import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/components/home/use-reduced-motion";
import {
  STAR_BOUNDS,
  STAR_CENTER,
  STAR_FACET_COLORS,
  STAR_OUTLINE,
} from "@/lib/levelup-star";
import { cn } from "@/lib/utils";

/**
 * "LevelUp Ecosystem" at the foot of every page, in the exact lockup of the
 * first-visit intro (components/preloader: DM Sans black, "LevelUp" over a
 * wider "Ecosystem", both in currentColor with a top-down fade, 1000 × 220
 * viewBox cropped at the bottom edge).
 *
 * The first time it scrolls into view, the LevelUp star appears in particles
 * and its pieces fly out to assemble the letters (the glyphs are sampled
 * from the same text drawn on a canvas); then the crisp SVG text fades in
 * and the particles fade out. Afterwards the pointer (or a tap) knocks a few
 * particles off the letters and they spring back.
 *
 * The text stays real DOM text (SVG <text>, one accessible name); the canvas
 * is aria-hidden. No JavaScript or prefers-reduced-motion: just the text.
 */

const VIEW_W = 1000;
const VIEW_H = 220;
const LINES = [
  { text: "LevelUp", y: 85, size: 100, spacing: -0.01 },
  { text: "Ecosystem", y: 198, size: 135, spacing: 0.01 },
] as const;

/* Build timeline (ms). */
const STAR_IN = 380; // the star materialises
const STAGGER = 650; // spread of the departures across the word
const FLIGHT = 1050; // one particle's trip
const TEXT_IN = 1650; // crisp text starts fading in
const DUST_OUT = 1850; // particles start fading out
const END = 2500;

const TARGET_DESKTOP = 3200;
const TARGET_MOBILE = 1600;

/* Pointer physics once built (per 60 fps frame). */
const SPRING = 0.06;
const FRICTION = 0.86;

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function hash(i: number) {
  const s = Math.sin(i * 91.7 + 47.3) * 43758.5453;
  return s - Math.floor(s);
}

/** Point in the star? Returns the facet index (0–9) or -1. */
function starFacet(x: number, y: number) {
  const c = STAR_CENTER;
  for (let f = 0; f < STAR_OUTLINE.length; f++) {
    const p = STAR_OUTLINE[(f + STAR_OUTLINE.length - 1) % STAR_OUTLINE.length];
    const q = STAR_OUTLINE[f];
    const d = (p[1] - q[1]) * (c.x - q[0]) + (q[0] - p[0]) * (c.y - q[1]);
    const a = ((p[1] - q[1]) * (x - q[0]) + (q[0] - p[0]) * (y - q[1])) / d;
    const b = ((q[1] - c.y) * (x - q[0]) + (c.x - q[0]) * (y - q[1])) / d;
    if (a >= 0 && b >= 0 && a + b <= 1) return f;
  }
  return -1;
}

interface Field {
  n: number;
  /** Letter (home) positions, canvas px. */
  tx: Float32Array;
  ty: Float32Array;
  /** Star (start) positions, canvas px. */
  sx: Float32Array;
  sy: Float32Array;
  facet: Uint8Array;
  delay: Float32Array;
  arc: Float32Array;
  dot: number;
}

/** Samples the two lines of text into particle targets, paired with
 *  starting points inside the star (both sorted left to right, so the
 *  pieces stream out of the star towards their own side of the word). */
function buildField(
  width: number,
  height: number,
  family: string,
  small: boolean,
): Field | null {
  const k = width / VIEW_W;
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(width));
  c.height = Math.max(1, Math.round(height));
  const x = c.getContext("2d", { willReadFrequently: true });
  if (!x) return null;
  x.fillStyle = "#000";
  x.textAlign = "center";
  x.textBaseline = "alphabetic";
  for (const line of LINES) {
    const size = line.size * k;
    x.font = `900 ${size}px ${family}`;
    if ("letterSpacing" in x) {
      (
        x as CanvasRenderingContext2D & { letterSpacing: string }
      ).letterSpacing = `${(line.spacing * size).toFixed(2)}px`;
    }
    x.fillText(line.text, width / 2, line.y * k);
  }
  const data = x.getImageData(0, 0, c.width, c.height).data;
  const at = (px: number, py: number) =>
    data[(Math.round(py) * c.width + Math.round(px)) * 4 + 3];

  // Count ink at a trial step, then pick the step that lands on the target.
  const target = small ? TARGET_MOBILE : TARGET_DESKTOP;
  let ink = 0;
  for (let py = 0; py < c.height; py += 2)
    for (let px = 0; px < c.width; px += 2) if (at(px, py) > 128) ink++;
  const step = Math.max(1.6, 2 * Math.sqrt(ink / target));

  const tx: number[] = [];
  const ty: number[] = [];
  let row = 0;
  for (let py = step / 2; py < c.height; py += step, row++) {
    const shift = row % 2 ? step / 2 : 0;
    for (let px = shift; px < c.width; px += step) {
      if (at(px, py) > 128) {
        tx.push(px);
        ty.push(py);
      }
    }
  }
  const n = tx.length;
  if (!n) return null;

  // The star, centred in the box, as tall as the lockup.
  const starH = height * 0.92;
  const s = starH / (STAR_BOUNDS.maxY - STAR_BOUNDS.minY);
  const ox = width / 2 - ((STAR_BOUNDS.minX + STAR_BOUNDS.maxX) / 2) * s;
  const oy = height / 2 - ((STAR_BOUNDS.minY + STAR_BOUNDS.maxY) / 2) * s;
  const stars: { x: number; y: number; f: number }[] = [];
  let seed = 0;
  while (stars.length < n && seed < n * 6) {
    const ux =
      STAR_BOUNDS.minX +
      hash(seed * 2 + 1) * (STAR_BOUNDS.maxX - STAR_BOUNDS.minX);
    const uy =
      STAR_BOUNDS.minY +
      hash(seed * 2 + 7) * (STAR_BOUNDS.maxY - STAR_BOUNDS.minY);
    seed++;
    const f = starFacet(ux, uy);
    if (f >= 0) stars.push({ x: ox + ux * s, y: oy + uy * s, f });
  }
  while (stars.length < n) stars.push({ x: width / 2, y: height / 2, f: 0 });

  const order = Array.from({ length: n }, (_, i) => i).sort(
    (a, b) => tx[a] - tx[b] || ty[a] - ty[b],
  );
  stars.sort((a, b) => a.x - b.x || a.y - b.y);

  const field: Field = {
    n,
    tx: new Float32Array(n),
    ty: new Float32Array(n),
    sx: new Float32Array(n),
    sy: new Float32Array(n),
    facet: new Uint8Array(n),
    delay: new Float32Array(n),
    arc: new Float32Array(n),
    dot: Math.max(1.2, step * 0.78),
  };
  for (let j = 0; j < n; j++) {
    const i = order[j];
    field.tx[j] = tx[i];
    field.ty[j] = ty[i];
    field.sx[j] = stars[j].x;
    field.sy[j] = stars[j].y;
    field.facet[j] = stars[j].f;
    // Departures spread outward from the centre of the word, a little noisy.
    const off = Math.abs(tx[i] - width / 2) / (width / 2);
    field.delay[j] = STAR_IN + off * STAGGER + hash(j + 31) * 160;
    field.arc[j] = (hash(j + 77) - 0.5) * height * 0.9;
  }
  return field;
}

export function FooterWordmark({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // "static": text shown, no canvas (SSR, no JS, reduced motion).
  // "waiting": text hidden until the build plays. "built": text shown.
  const [state, setState] = useState<"static" | "waiting" | "built">("static");

  useEffect(() => {
    if (reduced) {
      setState("static");
      return;
    }
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const textEl = textRef.current;
    if (!box || !canvas || !textEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setState("waiting");

    let field: Field | null = null;
    let width = 0;
    let height = 0;
    let raf = 0;
    let t0 = 0;
    let phase: "idle" | "build" | "done" = "idle";
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let energy = 0;
    let X = new Float32Array(0);
    let Y = new Float32Array(0);
    let shown = false;
    let colours: string[] = [];
    const ptr = { cx: 0, cy: 0, on: false, x: 0, y: 0, px: 0, py: 0 };
    let bursts: { cx: number; cy: number }[] = [];
    let disposed = false;

    const family = () =>
      getComputedStyle(textEl).fontFamily || "DM Sans, sans-serif";

    const setup = () => {
      const rect = box.getBoundingClientRect();
      if (!rect.width) return false;
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      field = buildField(width, height, family(), window.innerWidth < 640);
      const n = field?.n ?? 0;
      ox = new Float32Array(n);
      oy = new Float32Array(n);
      vx = new Float32Array(n);
      vy = new Float32Array(n);
      colours = STAR_FACET_COLORS.map((c) => c);
      return !!field;
    };

    /** Draws every particle, grouped by facet colour (ten fill styles). */
    const paint = (
      posX: (i: number) => number,
      posY: (i: number) => number,
      alpha: number,
    ) => {
      ctx.clearRect(0, 0, width, height);
      if (!field || alpha <= 0) return;
      const d = field.dot;
      const h = d / 2;
      ctx.globalAlpha = alpha;
      for (let f = 0; f < colours.length; f++) {
        ctx.fillStyle = colours[f];
        for (let i = 0; i < field.n; i++) {
          if (field.facet[i] !== f) continue;
          ctx.fillRect(posX(i) - h, posY(i) - h, d, d);
        }
      }
      ctx.globalAlpha = 1;
    };

    const buildFrame = (now: number) => {
      if (disposed || !field) return;
      if (!t0) t0 = now;
      const t = now - t0;
      const F = field;
      const appear = Math.min(1, t / STAR_IN);
      // The star materialises: grows a little and turns into place.
      const grow = 0.75 + 0.25 * easeInOut(appear);
      const spin = (1 - easeInOut(appear)) * -0.5;
      const cs = Math.cos(spin);
      const sn = Math.sin(spin);
      const cx = width / 2;
      const cy = height / 2;
      if (X.length !== F.n) {
        X = new Float32Array(F.n);
        Y = new Float32Array(F.n);
      }
      for (let i = 0; i < F.n; i++) {
        const rx = (F.sx[i] - cx) * grow;
        const ry = (F.sy[i] - cy) * grow;
        const sx = cx + rx * cs - ry * sn;
        const sy = cy + rx * sn + ry * cs;
        const p = Math.min(1, Math.max(0, (t - F.delay[i]) / FLIGHT));
        const e = easeInOut(p);
        // Curved path: an arc perpendicular to the trip, zero at both ends.
        const dx = F.tx[i] - sx;
        const dy = F.ty[i] - sy;
        const len = Math.hypot(dx, dy) || 1;
        const bend = Math.sin(Math.PI * e) * F.arc[i];
        X[i] = sx + dx * e + (-dy / len) * bend;
        Y[i] = sy + dy * e + (dx / len) * bend;
      }
      const fade =
        t < DUST_OUT ? 1 : Math.max(0, 1 - (t - DUST_OUT) / (END - DUST_OUT));
      paint(
        (i) => X[i],
        (i) => Y[i],
        Math.min(appear * 1.4, 1) * fade,
      );
      if (t >= TEXT_IN && !shown) {
        shown = true;
        setState("built");
      }
      if (t >= END) {
        phase = "done";
        ctx.clearRect(0, 0, width, height);
        raf = ptr.on || bursts.length ? requestAnimationFrame(dustFrame) : 0;
        return;
      }
      raf = requestAnimationFrame(buildFrame);
    };

    /** After the build: particles live on the letters, invisible until the
     *  pointer knocks them off; they show while displaced and spring back. */
    let lastDust = 0;
    const dustFrame = (now: number) => {
      if (disposed || !field) return;
      const F = field;
      const dt = lastDust ? Math.min(4, (now - lastDust) / 16.67) : 1;
      lastDust = now;
      const rect = canvas.getBoundingClientRect();
      const R = Math.max(40, height * 0.42);
      const R2 = R * R;
      let pvx = 0;
      let pvy = 0;
      if (ptr.on) {
        ptr.x = ptr.cx - rect.left;
        ptr.y = ptr.cy - rect.top;
        pvx = (ptr.x - ptr.px) / dt;
        pvy = (ptr.y - ptr.py) / dt;
        ptr.px = ptr.x;
        ptr.py = ptr.y;
      }
      for (const b of bursts) {
        const bx = b.cx - rect.left;
        const by = b.cy - rect.top;
        const RB = height * 0.9;
        for (let i = 0; i < F.n; i++) {
          const dx = F.tx[i] + ox[i] - bx;
          const dy = F.ty[i] + oy[i] - by;
          const d = Math.hypot(dx, dy) || 1;
          if (d > RB) continue;
          const f = (1 - d / RB) * 9 * (0.6 + hash(i) * 0.8);
          vx[i] += (dx / d) * f;
          vy[i] += (dy / d) * f;
        }
      }
      bursts = [];
      const spring = 1 - Math.pow(1 - SPRING, dt);
      const keep = Math.pow(FRICTION, dt);
      let e = 0;
      for (let i = 0; i < F.n; i++) {
        let ax = 0;
        let ay = 0;
        if (ptr.on) {
          const dx = F.tx[i] + ox[i] - ptr.x;
          const dy = F.ty[i] + oy[i] - ptr.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) || 1;
            const f = 1 - d / R;
            const m = 0.6 + hash(i) * 0.8;
            ax = ((dx / d) * f * f * 2.2 + pvx * f * 0.18) * m;
            ay = ((dy / d) * f * f * 2.2 + pvy * f * 0.18) * m;
          }
        }
        vx[i] = (vx[i] + ax * dt - ox[i] * spring) * keep;
        vy[i] = (vy[i] + ay * dt - oy[i] * spring) * keep;
        ox[i] += vx[i] * dt;
        oy[i] += vy[i] * dt;
        e += Math.abs(ox[i]) + Math.abs(oy[i]);
      }
      energy = e / F.n;

      // Only the displaced particles are drawn: dust lifting off the text.
      ctx.clearRect(0, 0, width, height);
      const d = F.dot;
      const h = d / 2;
      for (let f = 0; f < colours.length; f++) {
        ctx.fillStyle = colours[f];
        for (let i = 0; i < F.n; i++) {
          if (F.facet[i] !== f) continue;
          const m = Math.abs(ox[i]) + Math.abs(oy[i]);
          if (m < 0.8) continue;
          ctx.globalAlpha = Math.min(1, m / 10);
          ctx.fillRect(F.tx[i] + ox[i] - h, F.ty[i] + oy[i] - h, d, d);
        }
      }
      ctx.globalAlpha = 1;

      if (ptr.on || energy > 0.03) {
        raf = requestAnimationFrame(dustFrame);
      } else {
        ox.fill(0);
        oy.fill(0);
        vx.fill(0);
        vy.fill(0);
        ctx.clearRect(0, 0, width, height);
        raf = 0;
        lastDust = 0;
      }
    };

    const play = async () => {
      if (phase !== "idle") return;
      phase = "build";
      try {
        await document.fonts.load(`900 100px ${family()}`);
      } catch {
        /* sample with whatever is available */
      }
      if (disposed) return;
      if (!setup()) {
        phase = "done";
        setState("built");
        return;
      }
      raf = requestAnimationFrame(buildFrame);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          void play();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(box);

    const wake = () => {
      if (phase === "done" && !raf) {
        lastDust = 0;
        raf = requestAnimationFrame(dustFrame);
      }
    };
    const inside = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      return (
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom
      );
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && !ptr.on) return;
      if (!inside(e)) {
        ptr.on = false;
        return;
      }
      if (!ptr.on) {
        const r = box.getBoundingClientRect();
        ptr.px = e.clientX - r.left;
        ptr.py = e.clientY - r.top;
      }
      ptr.cx = e.clientX;
      ptr.cy = e.clientY;
      ptr.on = true;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (phase !== "done" || !inside(e)) return;
      bursts.push({ cx: e.clientX, cy: e.clientY });
      wake();
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") ptr.on = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });

    const ro = new ResizeObserver(() => {
      if (phase === "done") setup();
    });
    ro.observe(box);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [reduced]);

  return (
    <div
      className={cn(
        "pointer-events-none mx-auto -mb-2 w-full max-w-2xl overflow-hidden px-4 pb-0 opacity-80 select-none sm:max-w-3xl md:max-w-4xl dark:opacity-85",
        className,
      )}
    >
      <div ref={boxRef} className="relative">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="LevelUp Ecosystem"
          className={cn(
            "text-foreground block h-auto w-full transition-opacity duration-700 ease-out select-none",
            state === "waiting" ? "opacity-0" : "opacity-100",
          )}
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
            ref={textRef}
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
            className="absolute inset-0 block h-full w-full"
          />
        )}
      </div>
    </div>
  );
}
