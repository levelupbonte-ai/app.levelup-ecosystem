import { Geist, Instrument_Sans, JetBrains_Mono, Sora } from "next/font/google";

/** Editorial display + body face of the showcase (headlines, sections). */
export const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

/** Monospace labels ("—— Eyebrow"), indexes and code-like panels. */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

/**
 * Face of the client dashboard, used only inside the live dashboard demo
 * (components/home/live-demo). Not preloaded: the demo loads it just before it
 * is first drawn, so it never competes with the page's own fonts.
 */
export const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/** Heading face of LevelStudio, used only inside the live studio demo. */
export const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
