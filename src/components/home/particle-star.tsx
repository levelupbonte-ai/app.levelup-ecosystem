"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";

import {
  STAR_BOUNDS,
  STAR_CENTER,
  STAR_FACET_COLORS,
  STAR_OUTLINE,
} from "@/lib/levelup-star";
import { cn } from "@/lib/utils";

import { usePrefersReducedMotion } from "./use-reduced-motion";

/**
 * The LevelUp star drawn with ASCII glyphs on a canvas: the silhouette of
 * public/icon.svg is sampled on a grid, every sample gets the height of its
 * facet (the star is a shallow ten-facet pyramid), and the mark slowly sways
 * and breathes in 3D. Light facets glow violet, dark ones fall back to ink.
 *
 * Performance: DPR capped at 2, ~1k glyphs drawn in ten batches (one fill
 * style each), paused when off screen or when the tab is hidden. Under
 * prefers-reduced-motion the static star image is shown instead.
 */

const GLYPHS = "·:-=+*#%@";
const LEVELS = GLYPHS.length;
const VIOLET = [139, 92, 246] as const; // #8B5CF6
const SCALE_UNIT = 230; // icon units per normalised unit

type Vec3 = [number, number, number];

interface Facet {
  a: [number, number];
  b: [number, number];
  c: [number, number];
  normal: Vec3;
  tone: number;
}

interface Particle {
  x: number;
  y: number;
  z: number;
  facet: number;
  phase: number;
  edge: boolean;
}

const HEIGHT = 0.34;
const ORIGIN = {
  x: (STAR_BOUNDS.minX + STAR_BOUNDS.maxX) / 2,
  y: (STAR_BOUNDS.minY + STAR_BOUNDS.maxY) / 2,
};

function norm(x: number, y: number): [number, number] {
  return [(x - ORIGIN.x) / SCALE_UNIT, (y - ORIGIN.y) / SCALE_UNIT];
}

function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function buildFacets(): Facet[] {
  const c = norm(STAR_CENTER.x, STAR_CENTER.y);
  const pts = STAR_OUTLINE.map(([x, y]) => norm(x, y));
  const lums = STAR_FACET_COLORS.map(luminance);
  const minL = Math.min(...lums);
  const maxL = Math.max(...lums);
  // Facet i spans outline[i-1]..outline[i] (facet 0 = top-left: notch → top tip).
  return pts.map((_, i) => {
    const p = pts[(i + pts.length - 1) % pts.length];
    const q = pts[i];
    // 3D: centre raised, outline on the base plane.
    const A: Vec3 = [c[0], c[1], HEIGHT];
    const B: Vec3 = [p[0], p[1], 0];
    const C: Vec3 = [q[0], q[1], 0];
    const u: Vec3 = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
    const v: Vec3 = [C[0] - A[0], C[1] - A[1], C[2] - A[2]];
    let n: Vec3 = [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ];
    if (n[2] < 0) n = [-n[0], -n[1], -n[2]];
    const len = Math.hypot(n[0], n[1], n[2]) || 1;
    return {
      a: c,
      b: p,
      c: q,
      normal: [n[0] / len, n[1] / len, n[2] / len],
      tone: (lums[i] - minL) / (maxL - minL || 1),
    };
  });
}

/** Barycentric weights of (x, y) in triangle abc, or null when outside. */
function bary(
  x: number,
  y: number,
  a: [number, number],
  b: [number, number],
  c: [number, number],
) {
  const d = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]);
  const wa = ((b[1] - c[1]) * (x - c[0]) + (c[0] - b[0]) * (y - c[1])) / d;
  const wb = ((c[1] - a[1]) * (x - c[0]) + (a[0] - c[0]) * (y - c[1])) / d;
  const wc = 1 - wa - wb;
  const eps = -1e-6;
  return wa >= eps && wb >= eps && wc >= eps ? ([wa, wb, wc] as const) : null;
}

function hash(i: number) {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function buildParticles(facets: Facet[], step: number): Particle[] {
  const out: Particle[] = [];
  const [minX, minY] = norm(STAR_BOUNDS.minX, STAR_BOUNDS.minY);
  const [maxX, maxY] = norm(STAR_BOUNDS.maxX, STAR_BOUNDS.maxY);
  let k = 0;
  for (let y = minY; y <= maxY; y += step) {
    // Offset every other row: a softer, less mechanical texture.
    const shift = Math.round((y - minY) / step) % 2 ? step / 2 : 0;
    for (let x = minX + shift; x <= maxX; x += step) {
      for (let f = 0; f < facets.length; f++) {
        const w = bary(x, y, facets[f].a, facets[f].b, facets[f].c);
        if (!w) continue;
        out.push({
          x,
          y,
          z: w[0] * HEIGHT,
          facet: f,
          phase: hash(k++) * Math.PI * 2,
          edge: w[1] < 0.06 || w[2] < 0.06,
        });
        break;
      }
    }
  }
  return out;
}

function parseColor(value: string): [number, number, number] {
  const m = value.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return [17, 17, 17];
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}

export function ParticleStar({
  className,
  tint = 0.85,
  intensity = 1,
  label,
}: {
  className?: string;
  /** 0 = monochrome ink, 1 = full violet on the lit facets. */
  tint?: number;
  /** Overall opacity of the glyphs. */
  intensity?: number;
  /** Accessible name; decorative when omitted. */
  label?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const facets = buildFacets();
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let scale = 1;
    let fontPx = 11;
    let styles: string[] = [];
    let raf = 0;
    let visible = false;
    let running = false;
    let last = 0;
    let time = hash(7) * 10;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const buildStyles = () => {
      const base = parseColor(getComputedStyle(canvas).color);
      styles = Array.from({ length: LEVELS }, (_, l) => {
        const b = l / (LEVELS - 1);
        const mix = Math.min(1, Math.max(0, (b - 0.35) / 0.6)) * tint;
        const r = Math.round(base[0] + (VIOLET[0] - base[0]) * mix);
        const g = Math.round(base[1] + (VIOLET[1] - base[1]) * mix);
        const bl = Math.round(base[2] + (VIOLET[2] - base[2]) * mix);
        const a = (0.16 + 0.8 * b) * intensity;
        return `rgba(${r},${g},${bl},${a.toFixed(3)})`;
      });
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.min(width, height) * 0.43;
      // ~12px between glyphs whatever the canvas size.
      const spacing = width < 420 ? 10 : 12.5;
      fontPx = width < 420 ? 9 : 11;
      particles = buildParticles(facets, spacing / scale);
      buildStyles();
    };

    const buckets: number[][] = Array.from({ length: LEVELS }, () => []);
    const projected = { x: new Float32Array(0), y: new Float32Array(0) };

    const draw = () => {
      if (projected.x.length < particles.length) {
        projected.x = new Float32Array(particles.length);
        projected.y = new Float32Array(particles.length);
      }
      for (const b of buckets) b.length = 0;

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      const ry = Math.sin(time * 0.36) * 0.5 + pointer.x * 0.22;
      const rx = Math.sin(time * 0.27) * 0.16 + 0.06 + pointer.y * 0.18;
      const rz = Math.sin(time * 0.19) * 0.05;
      const breathe = 1 + Math.sin(time * 0.9) * 0.025;
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      const cz = Math.cos(rz);
      const sz = Math.sin(rz);

      // Light from the upper left, slightly in front.
      const L: Vec3 = [-0.45, -0.55, 0.7];
      const lit = facets.map((f) => {
        const [nx, ny, nz] = f.normal;
        const x1 = nx * cy + nz * sy;
        const z1 = -nx * sy + nz * cy;
        const y2 = ny * cx - z1 * sx;
        const z2 = ny * sx + z1 * cx;
        const d = Math.max(0, x1 * L[0] + y2 * L[1] + z2 * L[2]);
        return 0.45 * f.tone + 0.55 * d;
      });

      const cxp = width / 2;
      const cyp = height / 2;
      const persp = 3.2;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const wobble = 1 + Math.sin(time * 1.3 + p.phase) * 0.012;
        const x = p.x * breathe * wobble;
        const y = p.y * breathe * wobble;
        const z = p.z;
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const x3 = x1 * cz - y2 * sz;
        const y3 = x1 * sz + y2 * cz;
        const k = persp / (persp - z2);
        projected.x[i] = cxp + x3 * k * scale;
        projected.y[i] = cyp + y3 * k * scale;

        // Every facet stays readable; light facets climb to violet.
        let b = 0.22 + 0.78 * lit[p.facet];
        if (p.edge) b = Math.min(1, b + 0.22);
        // A few glyphs twinkle.
        const tw = Math.sin(time * 1.7 + p.phase * 3);
        if (tw > 0.97) b = Math.min(1, b + 0.35);
        const level = Math.max(
          0,
          Math.min(LEVELS - 1, Math.round(b * (LEVELS - 1))),
        );
        buckets[level].push(i);
      }

      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fontPx}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let l = 0; l < LEVELS; l++) {
        const list = buckets[l];
        if (!list.length) continue;
        ctx.fillStyle = styles[l];
        const glyph = GLYPHS[l];
        for (let j = 0; j < list.length; j++) {
          const i = list[j];
          ctx.fillText(glyph, projected.x[i], projected.y[i]);
        }
      }
    };

    const frame = (now: number) => {
      if (!running) return;
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      time += dt / 1000;
      draw();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "80px" },
    );
    io.observe(wrap);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // Theme switches: re-read the ink colour.
    const mo = new MutationObserver(() => {
      buildStyles();
      if (!running) draw();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (finePointer) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [reduced, tint, intensity]);

  return (
    <div
      ref={wrapRef}
      className={cn("relative text-foreground", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {reduced ? (
        <Image
          src="/icon.svg"
          alt=""
          width={512}
          height={512}
          unoptimized
          className="absolute inset-0 m-auto h-[62%] w-[62%] object-contain opacity-90"
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full text-foreground"
        />
      )}
    </div>
  );
}
