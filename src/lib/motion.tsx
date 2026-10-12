import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode
} from "react";

/**
 * Scroll motion vocabulary (see docs/motion.md). Pure helpers, usable from
 * server and client components alike: the markup is plain HTML with
 * `data-m` attributes, the behaviour lives in CSS (styles/motion.css) and in
 * one controller (components/motion/motion-root.tsx).
 */

/** Reveal kinds: what an element does the first time it scrolls into view. */
export type MKind =
  | "up" // fade + rise
  | "fade"
  | "left"
  | "right"
  | "scale"
  | "tilt" // rises from a slight 3D tilt and settles flat
  | "clip" // clip-path wipe, the first child eases down from a zoom
  | "line" // hairline drawn from the centre (horizontal)
  | "line-v" // hairline drawn from the top (vertical)
  | "rule" // the element"s bottom border drawn from the left
  | "rule-top" // the element"s top border drawn from the left
  | "words"; // headline: words rise out of a mask

type Style = CSSProperties & Record<`--${string}`, string | number | undefined>;

/**
 * Props for a reveal: `<div {...m("up", { delay: 120 })} />`. `delay` is in
 * milliseconds and adds to the automatic stagger of elements entering together.
 */
export function m(
  kind: MKind,
  opts: { delay?: number; style?: CSSProperties } = {}
): { "data-m": MKind; style?: CSSProperties } {
  const style: Style = { ...opts.style };
  if (opts.delay) style["--m-d"] = `${opts.delay}ms`;
  return Object.keys(style).length ? { "data-m": kind, style } : { "data-m": kind };
}

/** Same for the entrance of a hero (page top): plays with the page, not on scroll. */
export type MHero = "words" | "up" | "fade";
export function mHero(
  kind: MHero,
  opts: { delay?: number; style?: CSSProperties } = {}
): { "data-hero": MHero; style?: CSSProperties } {
  const style: Style = { ...opts.style };
  if (opts.delay !== undefined) style["--m-hero-d"] = `${opts.delay}ms`;
  return Object.keys(style).length ? { "data-hero": kind, style } : { "data-hero": kind };
}

/** Parallax props: `distance` px of drift (positive lags behind the scroll). */
export function mPar(
  distance: number,
  opts: { img?: boolean; style?: CSSProperties } = {}
): { "data-par": string; style: CSSProperties } {
  return {
    "data-par": opts.img ? "img" : "y",
    style: { ...opts.style, ["--par" as string]: `${distance}px` } as CSSProperties
  };
}

/* -------------------------------------------------------------------------
   Word splitting
   ------------------------------------------------------------------------- */

type Mode = "mask" | "stmt";

function isBr(node: ReactElement) {
  return node.type === "br";
}

/** Number of words in a React node tree (strings only). */
export function countWords(node: ReactNode): number {
  if (node === null || node === undefined || typeof node === "boolean") return 0;
  if (typeof node === "string" || typeof node === "number") {
    return String(node).split(/\s+/).filter(Boolean).length;
  }
  if (Array.isArray(node)) return node.reduce<number>((n, c) => n + countWords(c), 0);
  if (isValidElement(node)) {
    if (isBr(node)) return 0;
    if (typeof node.type !== "string") return 0;
    return countWords((node.props as { children?: ReactNode }).children);
  }
  return 0;
}

function walk(node: ReactNode, state: { i: number; total: number }, mode: Mode): ReactNode {
  if (node === null || node === undefined || typeof node === "boolean") return node;
  if (typeof node === "string" || typeof node === "number") {
    const parts = String(node).split(/(\s+)/);
    return parts.map((part, k) => {
      if (!part) return null;
      if (/^\s+$/.test(part)) return part;
      const i = state.i++;
      if (mode === "mask") {
        return (
          <span key={`${i}-${k}`} className="m-w" style={{ ["--wi" as string]: i } as CSSProperties}>
            <span>{part}</span>
          </span>
        );
      }
      // Statement: the word lights up between a and b (% of the view range).
      const a = 6 + (i / Math.max(1, state.total)) * 34;
      const b = a + 14;
      return (
        <span
          key={`${i}-${k}`}
          className="m-sw"
          style={
            {
              ["--a" as string]: a.toFixed(2),
              ["--b" as string]: b.toFixed(2),
              ["--r" as string]: (1 / (b - a)).toFixed(4)
            } as CSSProperties
          }
        >
          {part}
        </span>
      );
    });
  }
  if (Array.isArray(node)) {
    return Children.toArray(node).map((child) => walk(child, state, mode));
  }
  if (isValidElement(node)) {
    if (isBr(node) || typeof node.type !== "string") return node;
    const props = node.props as { children?: ReactNode };
    if (props.children === undefined) return node;
    return cloneElement(node as ReactElement<{ children?: ReactNode }>, undefined, walk(props.children, state, mode));
  }
  return node;
}

/**
 * Wraps every word of `children` in a mask (`mode: "mask"`, for headlines
 * revealed by `data-m="words"` / `data-hero="words"`) or in a statement span
 * (`mode: "stmt"`, lit up by the scroll). Host elements inside (`<span>`,
 * `<em>`, ...) are kept and split recursively; `<br />` is kept.
 */
export function splitWords(children: ReactNode, mode: Mode = "mask"): ReactNode {
  return walk(children, { i: 0, total: countWords(children) }, mode);
}
