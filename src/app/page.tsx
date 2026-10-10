import { Capabilities } from "@/components/home/capabilities";
import { HomeHero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { getPricingContent } from "@/lib/levelup-site";

export default async function Home() {

  return (
    <>
      <HomeHero />
      <Capabilities />
      <HowItWorks />
    </>
  );
}
