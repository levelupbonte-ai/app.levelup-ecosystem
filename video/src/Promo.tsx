import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Brackets, COLORS, FONT, Star } from './brand';
import { COPY, type Lang } from './copy';
import voiceTiming from './voice-timing.json';
import { Backdrop, BrowserFrame, ease, fadeOut, KineticWords, Phone, Toast, Typed } from './components/ui';

/** Minimum scene lengths (frames at 30 fps); a scene grows to fit its voice line. */
const BASE = [90, 135, 135, 150, 135, 195];
const VOICE_LEAD = 6;

/** Scene starts and total length for a language, from src/voice-timing.json when present. */
export function timeline(lang: Lang) {
  const voice = (voiceTiming as Partial<Record<Lang, number[]>>)[lang];
  const lengths = BASE.map((base, i) => Math.max(base, voice?.[i] ? voice[i] + VOICE_LEAD + 14 : 0));
  const starts = lengths.map((_, i) => lengths.slice(0, i).reduce((a, b) => a + b, 0));
  return { starts, lengths, total: lengths.reduce((a, b) => a + b, 0), hasVoice: Boolean(voice?.length) };
}

export type PromoProps = { lang: Lang; music?: string };

const useLayout = () => {
  const { width, height } = useVideoConfig();
  const portrait = height > width * 1.2;
  const square = !portrait && height >= width * 0.9;
  const unit = Math.min(width, height) / 1080;
  return { width, height, portrait, square, unit };
};

const Scene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={from} durationInFrames={to - from}>
    <SceneFade length={to - from}>{children}</SceneFade>
  </Sequence>
);

const SceneFade: React.FC<{ length: number; children: React.ReactNode }> = ({ length, children }) => {
  const frame = useCurrentFrame();
  const opacity = Math.min(interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' }), fadeOut(frame, length, 8));
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

const Hook: React.FC<{ lang: Lang }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit, portrait } = useLayout();
  const star = ease(frame, fps, 34, 12);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 90 * unit }}>
      <div style={{ maxWidth: portrait ? 900 * unit : 1500 * unit }}>
        <KineticWords words={COPY[lang].hook} size={(portrait ? 128 : 112) * unit} stagger={5} highlight={[COPY[lang].hook.length - 1, COPY[lang].hook.length - 2]} />
      </div>
      <div style={{ marginTop: 70 * unit, opacity: star, transform: `scale(${0.6 + 0.4 * star}) rotate(${(1 - star) * -40}deg)` }}>
        <Star size={130 * unit} facets={star} />
      </div>
    </AbsoluteFill>
  );
};

const Describe: React.FC<{ lang: Lang }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit, portrait } = useLayout();
  const t = ease(frame, fps, 6);
  const frameW = portrait ? 980 * unit : 1300 * unit;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 60 * unit, flexDirection: 'column' }}>
      <KineticWords words={COPY[lang].describe.split(' ')} size={(portrait ? 92 : 76) * unit} />
      <div style={{ position: 'relative', opacity: t, transform: `translateY(${(1 - t) * 80}px) perspective(1600px) rotateX(${(1 - t) * 14}deg)` }}>
        <BrowserFrame src="captures/studio-home.jpg" width={frameW} zoom={1.0 + 0.08 * interpolate(frame, [0, 135], [0, 1])} originY="40%" />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '62%',
            transform: 'translate(-50%, -50%)',
            width: frameW * 0.6,
            minHeight: 120 * unit,
            padding: `${26 * unit}px ${30 * unit}px`,
            borderRadius: 26 * unit,
            background: 'rgba(20,20,24,0.97)',
            border: `2px solid rgba(200,179,254,0.45)`,
            boxShadow: '0 0 0 10px rgba(139,92,246,0.12), 0 30px 80px rgba(0,0,0,0.6)'
          }}
        >
          <Typed text={COPY[lang].prompt} start={20} size={(portrait ? 34 : 30) * unit} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Build: React.FC<{ lang: Lang }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit, portrait } = useLayout();
  const t = ease(frame, fps, 4);
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 50 * unit }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 * unit, maxWidth: (portrait ? 900 : 760) * unit }}>
        <div style={{ position: 'relative', width: 110 * unit, height: 110 * unit }}>
          <Brackets size={110 * unit} open={0.75 + 0.25 * pulse} />
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', transform: `rotate(${frame * 1.2}deg)` }}>
            <Star size={62 * unit} />
          </div>
        </div>
        <KineticWords words={COPY[lang].build.split(' ')} size={(portrait ? 76 : 64) * unit} stagger={3} />
      </div>
      <div
        style={{
          width: (portrait ? 960 : 900) * unit,
          aspectRatio: '1040 / 656',
          borderRadius: 30 * unit,
          overflow: 'hidden',
          border: `1px solid ${COLORS.line}`,
          boxShadow: '0 40px 120px rgba(0,0,0,0.55), 0 0 0 1px rgba(139,92,246,0.15)',
          opacity: t,
          transform: `translateY(${(1 - t) * 80}px) scale(${0.94 + 0.06 * t})`
        }}
      >
        <Img
          src={staticFile(`captures/studio-chat-${lang}.jpg`)}
          style={{ width: '100%', display: 'block', transform: `scale(${1 + 0.12 * interpolate(frame, [0, 135], [0, 1])})`, transformOrigin: '30% 40%' }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Showcase: React.FC<{ lang: Lang }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit, portrait } = useLayout();
  const a = ease(frame, fps, 6);
  const b = ease(frame, fps, 16);
  const c = ease(frame, fps, 26);
  const scroll = interpolate(frame, [30, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const phoneH = (portrait ? 1000 : 760) * unit;
  const overlap = portrait ? -170 * unit : 20 * unit;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 70 * unit }}>
      <KineticWords words={COPY[lang].showcase.split(' ')} size={(portrait ? 96 : 80) * unit} highlight={[COPY[lang].showcase.split(' ').length - 1]} />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Phone src="captures/finalstop-mobile-full.jpg" height={phoneH * 0.86} scroll={scroll} screens={2.2} style={{ opacity: a, marginRight: overlap, transform: `translateY(${(1 - a) * 300 + 40 * unit}px) rotate(-8deg)` }} />
        <Phone src="captures/blackpater-mobile-full.jpg" height={phoneH} scroll={scroll} screens={1.6} style={{ opacity: b, transform: `translateY(${(1 - b) * 300}px)`, zIndex: 2 }} />
        <Phone src="captures/showcase-mobile-full.jpg" height={phoneH * 0.86} scroll={scroll} screens={2} style={{ opacity: c, marginLeft: overlap, transform: `translateY(${(1 - c) * 300 + 40 * unit}px) rotate(8deg)` }} />
      </div>
    </AbsoluteFill>
  );
};

const Manage: React.FC<{ lang: Lang }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit, portrait, square } = useLayout();
  const icons = ['◷', '⌕', '◈'];
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 56 * unit, padding: 80 * unit }}>
      <div style={{ display: 'flex', flexDirection: portrait || square ? 'column' : 'row', alignItems: 'center', gap: 22 * unit }}>
        {COPY[lang].features.map((f, i) => {
          const t = ease(frame, fps, 4 + i * 7);
          return (
            <div
              key={f}
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: (portrait ? 64 : 52) * unit,
                color: COLORS.ink,
                display: 'flex',
                alignItems: 'center',
                gap: 22 * unit,
                padding: `${22 * unit}px ${36 * unit}px`,
                borderRadius: 999,
                border: `1px solid rgba(200,179,254,0.28)`,
                background: 'rgba(139,92,246,0.10)',
                opacity: t,
                transform: `translateY(${(1 - t) * 60}px) scale(${0.9 + 0.1 * t})`
              }}
            >
              <span style={{ color: COLORS.violetSoft }}>{icons[i]}</span>
              {f}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 * unit, width: (portrait ? 860 : 900) * unit, transform: `scale(${unit})`, transformOrigin: 'top center' }}>
        {COPY[lang].toasts.map((text, i) => (
          <Toast key={text} text={text} delay={30 + i * 12} icon={['✓', '★', '✉'][i]} />
        ))}
      </div>
      <div style={{ opacity: ease(frame, fps, 70), fontFamily: FONT, fontSize: (portrait ? 48 : 42) * unit, color: COLORS.muted, fontWeight: 500 }}>{COPY[lang].manage}</div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{ lang: Lang }> = ({ lang }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { unit } = useLayout();
  const star = ease(frame, fps, 4, 12);
  const word = ease(frame, fps, 22);
  const cta = ease(frame, fps, 40);
  const glow = 0.35 + 0.25 * Math.sin(frame / 10);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <div style={{ position: 'relative', filter: `drop-shadow(0 0 ${60 * glow}px rgba(139,92,246,0.7))`, transform: `scale(${0.5 + 0.5 * star}) rotate(${(1 - star) * 90}deg)` }}>
        <Star size={260 * unit} facets={star} />
      </div>
      <div style={{ marginTop: 44 * unit, opacity: word, transform: `translateY(${(1 - word) * 40}px)`, fontFamily: FONT, fontWeight: 800, textAlign: 'center', lineHeight: 0.95, letterSpacing: '-0.02em', color: COLORS.ink }}>
        <div style={{ fontSize: 96 * unit }}>LevelUp</div>
        <div style={{ fontSize: 118 * unit, color: COLORS.violetSoft }}>Ecosystem</div>
      </div>
      <div
        style={{
          marginTop: 70 * unit,
          opacity: cta,
          transform: `translateY(${(1 - cta) * 40}px)`,
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 50 * unit,
          color: '#0A0A10',
          background: COLORS.ink,
          borderRadius: 999,
          padding: `${26 * unit}px ${54 * unit}px`
        }}
      >
        {COPY[lang].cta}
      </div>
      <div style={{ marginTop: 34 * unit, opacity: cta, fontFamily: FONT, fontSize: 40 * unit, color: COLORS.violetSoft, letterSpacing: '0.02em' }}>{COPY[lang].url}</div>
    </AbsoluteFill>
  );
};

const SCENE_COMPONENTS = [Hook, Describe, Build, Showcase, Manage, EndCard];

export const Promo: React.FC<PromoProps> = ({ lang, music }) => {
  const { starts, lengths, total, hasVoice } = timeline(lang);
  return (
    <AbsoluteFill style={{ background: COLORS.bg }}>
      <Backdrop />
      {SCENE_COMPONENTS.map((Component, i) => (
        <Scene key={i} from={starts[i]} to={starts[i] + lengths[i]}>
          <Component lang={lang} />
        </Scene>
      ))}
      {hasVoice &&
        starts.map((start, i) => (
          <Sequence key={`voice-${i}`} from={start + VOICE_LEAD}>
            <Audio src={staticFile(`audio/voice-${lang}-${i + 1}.mp3`)} />
          </Sequence>
        ))}
      {music && (
        <Audio
          src={staticFile(music)}
          volume={(f) => (hasVoice ? 0.16 : 0.6) * Math.min(1, f / 20) * Math.min(1, (total - f) / 30)}
        />
      )}
    </AbsoluteFill>
  );
};
