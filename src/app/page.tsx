import { Capabilities } from "@/components/home/capabilities";
import { HomeHero } from "@/components/home/hero";
import { getPricingContent } from "@/lib/levelup-site";

export default async function Home() {

  return (
    <>
      <HomeHero />
      <Capabilities />
    </>
  );
}
