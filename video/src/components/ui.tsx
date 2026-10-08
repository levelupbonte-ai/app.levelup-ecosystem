import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONT } from '../brand';

export const ease = (frame: number, fps: number, delay = 0, damping = 18) =>
  spring({ frame: frame - delay, fps, config: { damping, mass: 0.8, stiffness: 120 } });

/** Deep background with a slow violet glow that drifts. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const x = 50 + Math.sin(frame / 90) * 12;
  const y = 35 + Math.cos(frame / 110) * 10;
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 45% at ${x}% ${y}%, rgba(139,92,246,0.22), transparent 70%), radial-gradient(50% 40% at ${100 - x}% ${100 - y}%, rgba(200,179,254,0.08), transparent 70%)`
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(70% 60% at 50% 45%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(70% 60% at 50% 45%, black, transparent)'
        }}
      />
    </AbsoluteFill>
  );
};

/** Words rising in one by one with a soft blur. */
export const KineticWords: React.FC<{ words: readonly string[]; size: number; delay?: number; stagger?: number; highlight?: number[]; align?: 'center' | 'left' }> = ({
  words,
  size,
  delay = 0,
  stagger = 4,
  highlight = [],
  align = 'center'
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size, lineHeight: 1.05, letterSpacing: '-0.03em', color: COLORS.ink, textAlign: align, display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', gap: `0 ${size * 0.25}px` }}>
      {words.map((w, i) => {
        const t = ease(frame, fps, delay + i * stagger);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: t,
              transform: `translateY(${(1 - t) * size * 0.45}px)`,
              filter: `blur(${(1 - t) * 10}px)`,
              color: highlight.includes(i) ? COLORS.violetSoft : COLORS.ink
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** A browser window around a capture, with an optional slow zoom/pan. */
export const BrowserFrame: React.FC<{ src: string; width: number; zoom?: number; originX?: string; originY?: string; style?: React.CSSProperties }> = ({ src, width, zoom = 1, originX = '50%', originY = '0%', style }) => (
  <div style={{ width, borderRadius: 22, overflow: 'hidden', background: '#0E0E14', border: `1px solid ${COLORS.line}`, boxShadow: '0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(139,92,246,0.12)', ...style }}>
    <div style={{ height: 44, display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px', background: '#14141C', borderBottom: `1px solid ${COLORS.line}` }}>
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
        <span key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c, opacity: 0.85 }} />
      ))}
    </div>
    <div style={{ overflow: 'hidden', aspectRatio: '1440 / 900' }}>
      <Img src={staticFile(src)} style={{ width: '100%', display: 'block', transform: `scale(${zoom})`, transformOrigin: `${originX} ${originY}` }} />
    </div>
  </div>
);

/** `scroll` goes 0..1 over `screens` screen heights of the page. */
export const Phone: React.FC<{ src: string; height: number; scroll?: number; screens?: number; style?: React.CSSProperties }> = ({ src, height, scroll = 0, screens = 2, style }) => {
  const width = height * (390 / 844);
  const bezel = height * 0.022;
  const screenH = height - bezel * 2;
  const travel = screenH * screens;
  return (
    <div style={{ width, height, borderRadius: height * 0.075, background: '#050507', padding: bezel, boxShadow: '0 50px 120px rgba(0,0,0,0.6), inset 0 0 0 2px #2A2A33', position: 'relative', ...style }}>
      <div style={{ width: '100%', height: '100%', borderRadius: height * 0.06, overflow: 'hidden', position: 'relative', background: '#000' }}>
        <Img src={staticFile(src)} style={{ width: '100%', display: 'block', transform: `translateY(${-travel * scroll}px)` }} />
        <div style={{ position: 'absolute', top: height * 0.012, left: '50%', width: width * 0.3, height: height * 0.032, marginLeft: -width * 0.15, borderRadius: 999, background: '#050507' }} />
      </div>
    </div>
  );
};

/** Dashboard notification sliding in. */
export const Toast: React.FC<{ text: string; delay: number; icon: string }> = ({ text, delay, icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = ease(frame, fps, delay, 16);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '22px 28px',
        borderRadius: 22,
        background: 'rgba(20,20,28,0.92)',
        border: `1px solid ${COLORS.line}`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
        fontFamily: FONT,
        fontSize: 34,
        fontWeight: 600,
        color: COLORS.ink,
        opacity: t,
        transform: `translateX(${(1 - t) * 120}px) scale(${0.94 + 0.06 * t})`
      }}
    >
      <span style={{ width: 52, height: 52, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'rgba(139,92,246,0.18)', color: COLORS.violetSoft, fontSize: 28 }}>{icon}</span>
      {text}
    </div>
  );
};

/** Typing effect for a prompt. */
export const Typed: React.FC<{ text: string; start: number; cps?: number; size: number }> = ({ text, start, cps = 26, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const n = Math.max(0, Math.floor(((frame - start) / fps) * cps));
  const caret = Math.floor(frame / 15) % 2 === 0;
  return (
    <span style={{ fontFamily: FONT, fontSize: size, color: COLORS.ink }}>
      {text.slice(0, n)}
      <span style={{ opacity: caret ? 1 : 0, color: COLORS.violetSoft }}>|</span>
    </span>
  );
};

export const fadeOut = (frame: number, end: number, length = 10) => interpolate(frame, [end - length, end], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
