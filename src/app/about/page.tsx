import type { Metadata } from "next";

import { Background } from "@/components/background";
import About from "@/components/blocks/about";
import { AboutHero } from "@/components/blocks/about-hero";
import { HowWeBuild } from "@/components/blocks/how-we-build";
import { DashedLine } from "@/components/dashed-line";

const DESCRIPTION =
  "LevelUp Ecosystem is an online web studio founded by Richelieu Bonte in San Diego, California. How we build: AI-assisted development, human testing and review, and security-first habits.";

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About LevelUp Ecosystem",
    description: DESCRIPTION,
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <Background>
      <div className="py-28 lg:py-32 lg:pt-44">
        <AboutHero />

        <About />

        <div className="pt-28 lg:pt-32">
          <DashedLine className="container max-w-5xl scale-x-115" />
          <HowWeBuild />
        </div>
      </div>
    </Background>
  );
}
