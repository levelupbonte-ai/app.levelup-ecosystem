"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

import { usePrefersReducedMotion } from "../use-reduced-motion";
import { WindowFrame } from "../window-frame";

/* ---------------------------------------------------------------------------
   One clock per demo. Everything on screen is a pure function of `t` (ms):
   React state changes at discrete cues, continuous motion (camera, pointer,
   scrolling) is written straight to transform/opacity once per frame. That
   keeps the loop seamless, makes pausing free and every frame reproducible.
--------------------------------------------------------------------------- */

export class DemoClock {
  t = 0;
  private subs = new Set<() => void>();
  private frames = new Set<(t: number) => void>();

  constructor(readonly duration: number) {}

  subscribe = (fn: () => void) => {
    this.subs.add(fn);
    return () => {
      this.subs.delete(fn);
    };
  };

  onFrame = (fn: (t: number) => void) => {
    this.frames.add(fn);
    return () => {
      this.frames.delete(fn);
    };
  };

  set(t: number) {
    this.t = t;
    this.frames.forEach((fn) => fn(t));
    this.subs.forEach((fn) => fn());
  }
}

const ClockContext = createContext<DemoClock | null>(null);

export function useClock(): DemoClock {
  const clock = useContext(ClockContext);
  if (!clock) throw new Error("useClock outside of a LiveDemo");
  return clock;
}

/** Re-renders only when the selected primitive changes. */
export function useClockValue<T extends number | string | boolean>(
  select: (t: number) => T,
): T {
  const clock = useClock();
  return useSyncExternalStore(
    clock.subscribe,
    () => select(clock.t),
    () => select(0),
  );
}

/** Number of cues already passed: 0 before the first one. */
export function useStage(cues: readonly number[]): number {
  return useClockValue((t) => {
    let n = 0;
    while (n < cues.length && t >= cues[n]) n++;
    return n;
  });
}

/** Named cue times -> booleans (true once the clock passed the time). */
export function useFlags<K extends string>(
  times: Record<K, number>,
): Record<K, boolean> {
  const keys = useMemo(() => Object.keys(times) as K[], [times]);
  const bits = useClockValue((t) =>
    keys.map((k) => (t >= times[k] ? "1" : "0")).join(""),
  );
  return useMemo(
    () =>
      Object.fromEntries(keys.map((k, i) => [k, bits[i] === "1"])) as Record<
        K,
        boolean
      >,
    [bits, keys],
  );
}

/** Runs `fn(t)` on every frame (and once on mount) for imperative motion. */
export function useFrame(fn: (t: number) => void) {
  const clock = useClock();
  const ref = useRef(fn);
  ref.current = fn;
  useLayoutEffect(() => {
    const run = (t: number) => ref.current(t);
    run(clock.t);
    return clock.onFrame(run);
  }, [clock]);
}

/* ------------------------------------------------------------------ typing */

function noise(i: number) {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Cumulative time (ms) at which each character appears. Human typing is
 * uneven: small deterministic jitter plus pauses after punctuation.
 */
export function typingTimes(
  text: string,
  msPerChar: number,
  pauses = true,
): number[] {
  const out: number[] = [];
  let t = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    t += msPerChar * (0.6 + noise(i) * 0.8);
    if (c === " ") t += msPerChar * 0.2;
    out.push(t);
    if (pauses) {
      if (",;:".includes(c)) t += msPerChar * 2.6;
      else if (".?!".includes(c)) t += msPerChar * 4.5;
    }
  }
  return out;
}

export function countUpTo(times: readonly number[], t: number): number {
  let lo = 0;
  let hi = times.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (times[mid] <= t) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** Characters of `times` revealed since `start`. */
export function useTypedCount(times: readonly number[], start: number): number {
  return useClockValue((t) => countUpTo(times, t - start));
}

/* ----------------------------------------------------------------- easing */

export const easeInOut = (p: number) =>
  p < 0.5 ? 8 * p * p * p * p : 1 - Math.pow(-2 * p + 2, 4) / 2;
export const easeCursor = (p: number) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* ------------------------------------------------------------------ script */

/** Where the camera or pointer goes: a named element, or [x, y] in 0..1. */
export type Focus = string | readonly [number, number];

export type CamKey = { t: number; z: number; f: Focus };
export type CursorStop = {
  at: Focus;
  /** The pointer is there from `arrive` until `leave` (ms). */
  arrive: number;
  leave: number;
  dx?: number;
  dy?: number;
  /** The pointer fades away after leaving. */
  hide?: boolean;
};

export type DemoScript = {
  duration: number;
  /** A meaningful frame to show when motion is reduced. */
  finalAt: number;
  camera: CamKey[];
  cursor: CursorStop[];
  clicks: number[];
};

export type DemoBuild = { script: DemoScript; scene: ReactNode };

/* ---------------------------------------------------------------------- rig */

type Rig = {
  cues: Map<string, HTMLElement>;
  dw: number;
  dh: number;
  compact: boolean;
};
const RigContext = createContext<Rig | null>(null);

/** Name an element so the camera and the pointer can aim at it. */
export function useCue(name: string) {
  const rig = useContext(RigContext);
  return useMemo(
    () => (el: HTMLElement | null) => {
      if (!rig) return;
      if (el) rig.cues.set(name, el);
      else if (rig.cues.get(name)?.isConnected === false) rig.cues.delete(name);
    },
    [rig, name],
  );
}

export function useRig() {
  const rig = useContext(RigContext);
  if (!rig) throw new Error("useRig outside of a LiveDemo");
  return rig;
}

/** Fades and lifts an element that stays in the layout (data-on toggles). */
export function In({
  on,
  delay = 0,
  y = 8,
  scale,
  className,
  style,
  children,
}: {
  on: boolean;
  delay?: number;
  y?: number;
  scale?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn("ld-in", className)}
      data-on={on ? "true" : "false"}
      style={
        {
          "--ld-y": `${y}px`,
          "--ld-s": scale ?? 1,
          "--ld-d": `${delay}ms`,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- playback */

function lerp(a: number, b: number, p: number) {
  return a + (b - a) * p;
}

function Pointer({ touch }: { touch: boolean }) {
  return touch ? (
    <span
      aria-hidden="true"
      className="absolute -top-4 -left-4 block size-8 rounded-full border border-black/15 bg-black/20 shadow-[0_2px_10px_rgba(0,0,0,0.25)]"
    />
  ) : (
    <svg
      aria-hidden="true"
      width="22"
      height="26"
      viewBox="0 0 20 24"
      className="absolute -top-[2px] -left-[2px] drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
    >
      <path
        d="M2 1.5v17.2l4.6-4.1 3 6.8 2.6-1.2-3-6.7 6.3-.3L2 1.5z"
        fill="#fff"
        stroke="#111"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Playback({
  build,
  compact,
  width,
  playing,
  reduced,
  restartKey,
  getProgress,
}: {
  build: (compact: boolean) => DemoBuild;
  compact: boolean;
  width: number;
  playing: boolean;
  reduced: boolean;
  restartKey: number;
  /** Scroll-scrubbed demo: returns 0..1; the clock follows it (no loop). */
  getProgress?: () => number;
}) {
  const scrubbed = Boolean(getProgress);
  const built = useMemo(() => build(compact), [build, compact]);
  const { script } = built;
  const dw = compact ? Math.min(460, Math.max(340, width)) : 1040;
  const dh = compact ? (dw * 560) / 390 : 716;
  const s = width / dw;

  const clock = useMemo(() => {
    const c = new DemoClock(script.duration);
    c.t = reduced ? script.finalAt : 0;
    return c;
    // The clock is rebuilt only when the script itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [script]);
  const rig = useMemo<Rig>(
    () => ({ cues: new Map(), dw, dh, compact }),
    [dw, dh, compact],
  );
  const [epoch, setEpoch] = useState(0);
  const layerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const last = useRef({ scale: s, tx: 0, ty: 0 });

  // A new activation (the step scrolls back into focus) starts from the top.
  const firstRestart = useRef(true);
  useEffect(() => {
    if (firstRestart.current) {
      firstRestart.current = false;
      return;
    }
    if (scrubbed) return; // scroll position owns the clock
    clock.set(reduced ? script.finalAt : 0);
    setEpoch((e) => e + 1);
  }, [restartKey, clock, reduced, script.finalAt, scrubbed]);

  // Camera, pointer and the cross-fade of the loop: written every frame.
  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const vw = width;
    const vh = (width * dh) / dw;
    const root = () => layer.getBoundingClientRect();

    const known = new Map<string, [number, number]>();
    const resolve = (f: Focus, rootRect: DOMRect): [number, number] => {
      if (typeof f !== "string") return [f[0] * dw, f[1] * dh];
      const el = rig.cues.get(f);
      if (!el || !el.isConnected) return known.get(f) ?? [dw / 2, dh / 2];
      const r = el.getBoundingClientRect();
      const k = last.current.scale || s;
      const pos: [number, number] = [
        (r.left + r.width / 2 - rootRect.left) / k,
        (r.top + r.height / 2 - rootRect.top) / k,
      ];
      known.set(f, pos);
      return pos;
    };

    const frame = (t: number) => {
      const rr = root();
      /* camera */
      const keys = script.camera;
      let z = keys[0].z;
      let fx = 0;
      let fy = 0;
      let i = 0;
      while (i < keys.length - 1 && t >= keys[i + 1].t) i++;
      const a = keys[i];
      const b = keys[Math.min(i + 1, keys.length - 1)];
      const p = a === b ? 0 : easeInOut(clamp01((t - a.t) / (b.t - a.t)));
      const fa = resolve(a.f, rr);
      const fb = a === b ? fa : resolve(b.f, rr);
      z = lerp(a.z, b.z, p);
      fx = lerp(fa[0], fb[0], p);
      fy = lerp(fa[1], fb[1], p);
      if (reduced) {
        // The still frame is always the whole window.
        z = 1;
        fx = dw / 2;
        fy = dh / 2;
      }
      const S = s * z;
      const tx = Math.min(0, Math.max(vw - dw * S, vw / 2 - fx * S));
      const ty = Math.min(0, Math.max(vh - dh * S, vh / 2 - fy * S));
      last.current = { scale: S, tx, ty };

      /* loop fade (the epoch swap happens while fully transparent) */
      const fade = scrubbed
        ? Math.min(1, 0.4 + t / 300) // scrubbed: no outro, back to the start is a clean frame
        : Math.min(1, t / 500) * Math.min(1, (script.duration - t) / 600);
      layer.dataset.ldT = String(Math.round(t)); // read by the visual QA harness
      layer.style.opacity = String(clamp01(fade));
      layer.style.transform = `translate(${tx}px, ${ty}px) scale(${S})`;

      /* pointer */
      const cur = cursorRef.current;
      if (!cur) return;
      const stops = script.cursor;
      if (reduced || !stops.length || t < stops[0].arrive - 900) {
        cur.style.opacity = "0";
        return;
      }
      let pos: [number, number];
      const place = (st: CursorStop): [number, number] => {
        const q = resolve(st.at, rr);
        return [q[0] + (st.dx ?? 0), q[1] + (st.dy ?? 0)];
      };
      let k = 0;
      while (k < stops.length - 1 && t >= stops[k].leave) k++;
      const cs = stops[k];
      if (t < cs.arrive) {
        const prev = k === 0 ? null : stops[k - 1];
        // After a long pause the pointer slips away and re-enters near the target.
        const far = !prev || cs.arrive - prev.leave > 2500;
        const to = place(cs);
        const from: [number, number] = !prev
          ? [dw * 1.02, dh * 0.98]
          : far
            ? [to[0] + 70, to[1] + 55]
            : place(prev);
        const start = far ? cs.arrive - 900 : prev!.leave;
        if (t < start) {
          const out = prev ? 1 - clamp01((t - prev.leave) / 250) : 0;
          cur.style.opacity = String(out);
          pos = prev ? place(prev) : from;
        } else {
          const u = easeCursor(clamp01((t - start) / (cs.arrive - start)));
          const mx = (from[0] + to[0]) / 2;
          const my = (from[1] + to[1]) / 2;
          const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
          const sign = k % 2 === 0 ? 1 : -1;
          const cx = mx + ((from[1] - to[1]) / (len || 1)) * len * 0.12 * sign;
          const cy = my + ((to[0] - from[0]) / (len || 1)) * len * 0.12 * sign;
          pos = [
            (1 - u) * (1 - u) * from[0] + 2 * (1 - u) * u * cx + u * u * to[0],
            (1 - u) * (1 - u) * from[1] + 2 * (1 - u) * u * cy + u * u * to[1],
          ];
          cur.style.opacity = String(far ? clamp01((t - start) / 300) : 1);
        }
      } else {
        pos = place(cs);
        cur.style.opacity = cs.hide
          ? String(1 - clamp01((t - cs.leave) / 250))
          : "1";
      }
      /* click: the pointer presses, a ring spreads */
      let press = 1;
      let ring = -1;
      for (const c of script.clicks) {
        const d = t - c;
        if (d >= -90 && d < 0) press = 1 - 0.1 * ((d + 90) / 90);
        else if (d >= 0 && d < 160) press = 0.9 + 0.1 * (d / 160);
        if (d >= 0 && d < 520) ring = d / 520;
      }
      cur.style.transform = `translate(${pos[0]}px, ${pos[1]}px) scale(${press})`;
      const rp = rippleRef.current;
      if (rp) {
        if (ring < 0) rp.style.opacity = "0";
        else {
          rp.style.opacity = String(0.5 * (1 - ring));
          rp.style.transform = `translate(-50%, -50%) scale(${0.3 + ring * 1.5})`;
        }
      }
    };

    frame(clock.t);
    return clock.onFrame(frame);
  }, [clock, script, width, dw, dh, s, rig, reduced, scrubbed]);

  // Scroll-scrubbed: the clock eases toward (scroll progress x timeline), so
  // the scenario builds as the page scrolls, forward and backward.
  useEffect(() => {
    if (!playing || !getProgress) return;
    let raf = 0;
    let prev = 0;
    let cur = -1;
    const span = Math.max(1, clock.duration - 500);
    const tick = (now: number) => {
      const dt = prev ? Math.min(now - prev, 64) : 16;
      prev = now;
      const target = clamp01(getProgress()) * span;
      cur = cur < 0 ? target : cur + (target - cur) * (1 - Math.exp(-dt / 140));
      if (Math.abs(target - cur) < 0.5) cur = target;
      if (cur !== clock.t) clock.set(cur);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, clock, getProgress]);

  // The player.
  useEffect(() => {
    if (!playing || getProgress) return;
    let raf = 0;
    let prev = 0;
    const tick = (now: number) => {
      const dt = prev ? Math.min(now - prev, 50) : 16;
      prev = now;
      let t = clock.t + dt;
      if (t >= clock.duration) {
        t -= clock.duration;
        setEpoch((e) => e + 1);
      }
      clock.set(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, clock, getProgress]);

  return (
    <ClockContext.Provider value={clock}>
      <RigContext.Provider value={rig}>
        <div
          ref={layerRef}
          className="absolute top-0 left-0"
          style={{
            width: dw,
            height: dh,
            transformOrigin: "0 0",
            transform: `scale(${s})`,
          }}
        >
          <div key={epoch} className="absolute inset-0 overflow-hidden">
            {built.scene}
          </div>
          <div ref={cursorRef} className="ld-cursor" aria-hidden="true">
            <span
              ref={rippleRef}
              className="absolute top-0 left-0 block size-9 rounded-full border-2 border-white/80 bg-white/20 opacity-0 mix-blend-normal"
            />
            <Pointer touch={compact} />
          </div>
        </div>
      </RigContext.Provider>
    </ClockContext.Provider>
  );
}

function useTabVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return visible;
}

/**
 * The window of a live demo. Nothing is rendered or run until the demo is
 * near the viewport; it plays only while on screen, in a visible tab and (on
 * desktop) while its step is the active one. Reduced motion shows one still,
 * meaningful frame.
 */
export function LiveDemo({
  label,
  status,
  ariaLabel,
  build,
  resetKey,
  tone,
  active = true,
  prepare,
  scrub,
}: {
  label: ReactNode;
  status: string;
  ariaLabel: string;
  build: (compact: boolean) => DemoBuild;
  /** Changing it (the language) starts the demo again. */
  resetKey: string;
  tone: "dark" | "light";
  /** False while another step of the sticky panel is in front. */
  active?: boolean;
  /** Resources to have ready before the first frame (fonts). */
  prepare?: () => Promise<unknown> | undefined;
  /**
   * Scroll-scrubbed playback: "self" (progress of the window itself through
   * the viewport) or a function returning 0..1. Unset = plays on its own.
   */
  scrub?: "self" | (() => number);
}) {
  const vpRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const reduced = usePrefersReducedMotion();
  const tabVisible = useTabVisible();
  const [wanted, setWanted] = useState(active);
  const [restart, setRestart] = useState(0);
  const wasActive = useRef(active);

  useEffect(() => {
    if (active) setWanted(true);
    if (active && !wasActive.current) setRestart((n) => n + 1);
    wasActive.current = active;
  }, [active]);

  useEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      setOnScreen(true);
      return;
    }
    const nearObs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          nearObs.disconnect();
        }
      },
      { rootMargin: "700px 0px" },
    );
    const screenObs = new IntersectionObserver(
      ([e]) => setOnScreen(e.isIntersecting),
      { threshold: 0.25 },
    );
    nearObs.observe(el);
    screenObs.observe(el);
    return () => {
      nearObs.disconnect();
      screenObs.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!near || !wanted) return;
    let alive = true;
    const done = () => alive && setReady(true);
    const wait = prepare?.();
    if (wait) {
      wait.then(done, done);
      const timer = window.setTimeout(done, 1500);
      return () => {
        alive = false;
        window.clearTimeout(timer);
      };
    }
    done();
    return () => {
      alive = false;
    };
  }, [near, wanted, prepare]);

  useEffect(() => {
    const el = vpRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const getProgress = useCallback(() => {
    if (scrub === "self") {
      const el = vpRef.current;
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the window's centre enters at 86% of the viewport, 1 at 36%.
      return clamp01((0.86 * vh - (r.top + r.height / 2)) / (0.5 * vh));
    }
    return scrub ? scrub() : 0;
  }, [scrub]);
  const compact = width > 0 && width < 520;
  const playing = ready && width > 0 && onScreen && tabVisible && active;

  return (
    <WindowFrame label={label} status={status}>
      <div className="ld-box">
        <div
          ref={vpRef}
          className={cn(
            "ld-vp",
            tone === "dark" ? "bg-[#0b0b0e]" : "bg-[#fafafa]",
          )}
          role="img"
          aria-label={ariaLabel}
        >
          {ready && width > 0 && (
            <Playback
              key={`${resetKey}:${compact}`}
              build={build}
              compact={compact}
              width={width}
              playing={playing && !reduced}
              reduced={reduced}
              restartKey={restart}
              getProgress={scrub ? getProgress : undefined}
            />
          )}
        </div>
      </div>
    </WindowFrame>
  );
}
