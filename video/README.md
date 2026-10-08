# LevelUp videos (Remotion)

Motion-design videos of the LevelUp ecosystem, written in React with
[Remotion](https://www.remotion.dev) and rendered to MP4. They use real captures
of our products (`public/captures`) and the brand mark (`src/brand.tsx`).

## Promo (social ads)

`src/Promo.tsx`, six scenes: hook, describe, build, showcase, manage, end card.
Compositions (`src/Root.tsx`): `Promo-{FR|EN}-{9x16|1x1|16x9}`.

```bash
npm i
npx remotion studio src/index.ts            # preview in the browser
npx remotion render src/index.ts Promo-FR-9x16 out/promo-fr-9x16.mp4
```

In the cloud environment, add
`--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.

## Voice-over (ElevenLabs)

Lines live in `src/copy.ts` (`voice`). With `ELEVENLABS_API_KEY` set (and
`api.elevenlabs.io` allowed on the network):

```bash
node scripts/voice.mjs        # writes public/audio/voice-*.mp3 + src/voice-timing.json
```

Each scene then stretches to fit its line; render again. Optional voices:
`VOICE_FR=<id> VOICE_EN=<id>`. Background music: put a royalty-free track in
`public/audio/music.mp3` and pass `--props='{"lang":"fr","music":"audio/music.mp3"}'`.

## Captures

Real screens, refreshed with Playwright (showcase, Final Stop, Black Pater served
under their own domains, LevelStudio with a mocked API). Text copy and captures
are the only things to change when the products evolve.
