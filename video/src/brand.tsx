import React from 'react';

export const COLORS = {
  bg: '#08080D',
  bgSoft: '#111118',
  ink: '#F5F3FF',
  muted: '#A1A1B5',
  violet: '#8B5CF6',
  violetSoft: '#C8B3FE',
  line: 'rgba(255,255,255,0.10)'
};

export const FONT = "'DM Sans', 'Inter', system-ui, sans-serif";

const FACETS: Array<[string, string, string, string]> = [
  ['256,278 256,38 202,192', 'tl', '#C8B3FE', '#AC7AFE'],
  ['256,278 256,38 310,192', 'tr', '#843FF4', '#6F23E7'],
  ['256,278 310,192 484,204', 'ru', '#7327EB', '#5C16D6'],
  ['256,278 484,204 344,280', 'rd', '#5111CA', '#3A08A3'],
  ['256,278 344,280 397,470', 'bru', '#430BA8', '#300586'],
  ['256,278 397,470 256,362', 'brd', '#5211C8', '#3D09A5'],
  ['256,278 256,362 115,470', 'bld', '#691CDD', '#4F0DBB'],
  ['256,278 115,470 168,280', 'blu', '#7C2CF0', '#6117D2'],
  ['256,278 168,280 28,204', 'ld', '#9754FD', '#7A2EF1'],
  ['256,278 28,204 202,192', 'lu', '#B583FF', '#9C64FD']
];

/** The LevelUp star; `facets` (0..1) draws the facets in one by one. */
export const Star: React.FC<{ size: number; facets?: number; style?: React.CSSProperties }> = ({ size, facets = 1, style }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" style={style}>
    <defs>
      {FACETS.map(([, id, a, b]) => (
        <linearGradient key={id} id={`f-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={a} />
          <stop offset="100%" stopColor={b} />
        </linearGradient>
      ))}
    </defs>
    {FACETS.map(([points, id], i) => {
      const t = Math.min(1, Math.max(0, facets * FACETS.length - i));
      return <polygon key={id} points={points} fill={`url(#f-${id})`} opacity={t} transform={`translate(256 278) scale(${0.6 + 0.4 * t}) translate(-256 -278)`} />;
    })}
  </svg>
);

/** The viewfinder brackets of LevelStudio / the dashboard, opened by `open` (0..1). */
export const Brackets: React.FC<{ size: number; open?: number; color?: string }> = ({ size, open = 1, color = COLORS.violet }) => {
  const d = (1 - open) * 60;
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" style={{ position: 'absolute', inset: 0 }}>
      <g fill="none" stroke={color} strokeWidth={22} strokeLinecap="square">
        <path d={`M ${64 + d} ${144 + d} L ${64 + d} ${64 + d} L ${144 + d} ${64 + d}`} />
        <path d={`M ${368 - d} ${64 + d} L ${448 - d} ${64 + d} L ${448 - d} ${144 + d}`} />
        <path d={`M ${64 + d} ${368 - d} L ${64 + d} ${448 - d} L ${144 + d} ${448 - d}`} />
        <path d={`M ${368 - d} ${448 - d} L ${448 - d} ${448 - d} L ${448 - d} ${368 - d}`} />
      </g>
    </svg>
  );
};
