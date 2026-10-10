import { Instrument_Sans, JetBrains_Mono } from "next/font/google";

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
