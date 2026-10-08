// Generates the voice-over with ElevenLabs (one clip per scene and language),
// measures each clip and writes src/voice-timing.json so scenes last as long
// as their line. Needs ELEVENLABS_API_KEY in the environment (never in code).
//   node scripts/voice.mjs            -> FR + EN
//   VOICE_FR=<voice id> VOICE_EN=<voice id> node scripts/voice.mjs
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const key = process.env.ELEVENLABS_API_KEY;
if (!key) {
  console.error('ELEVENLABS_API_KEY is not set.');
  process.exit(1);
}
const MODEL = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2';
// Default voices are ElevenLabs premade voices; override with VOICE_FR / VOICE_EN.
const VOICES = { fr: process.env.VOICE_FR || 'pNInz6obpgDQGcFmaJgB', en: process.env.VOICE_EN || 'pNInz6obpgDQGcFmaJgB' };

const src = fs.readFileSync(new URL('../src/copy.ts', import.meta.url), 'utf8');
const lines = (lang) => {
  const block = src.split(`${lang}: {`)[1];
  const voice = block.slice(block.indexOf('voice: ['), block.indexOf(']', block.indexOf('voice: [')));
  return [...voice.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1].replace(/\\'/g, "'"));
};

const outDir = new URL('../public/audio/', import.meta.url).pathname;
fs.mkdirSync(outDir, { recursive: true });
const timing = {};
for (const lang of ['fr', 'en']) {
  timing[lang] = [];
  for (const [i, text] of lines(lang).entries()) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICES[lang]}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: MODEL, voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true } })
    });
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const file = path.join(outDir, `voice-${lang}-${i + 1}.mp3`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    const seconds = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());
    timing[lang].push(Math.ceil(seconds * 30));
    console.log(lang, i + 1, `${seconds.toFixed(2)}s`, text);
  }
}
fs.writeFileSync(new URL('../src/voice-timing.json', import.meta.url), JSON.stringify(timing, null, 2) + '\n');
console.log('Wrote src/voice-timing.json');
