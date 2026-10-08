import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import React from 'react';
import { Composition } from 'remotion';
import { Promo, timeline } from './Promo';

const FORMATS = [
  { id: '9x16', width: 1080, height: 1920 },
  { id: '1x1', width: 1080, height: 1080 },
  { id: '16x9', width: 1920, height: 1080 }
];

export const Root: React.FC = () => (
  <>
    {(['fr', 'en'] as const).flatMap((lang) =>
      FORMATS.map((f) => (
        <Composition
          key={`${lang}-${f.id}`}
          id={`Promo-${lang.toUpperCase()}-${f.id}`}
          component={Promo}
          durationInFrames={timeline(lang).total}
          fps={30}
          width={f.width}
          height={f.height}
          defaultProps={{ lang }}
        />
      ))
    )}
  </>
);
