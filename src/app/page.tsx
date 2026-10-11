import { Capabilities } from "@/components/home/capabilities";
import { HomeCta } from "@/components/home/cta";
import { Ecosystem } from "@/components/home/ecosystem";
import { HomeHero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PricingTeaser } from "@/components/home/pricing-teaser";
import { Templates } from "@/components/home/templates";
import { Work, type WorkCase } from "@/components/home/work";
import type { PlanItem } from "@/components/blocks/pricing";
import { getLiveProjects, getPricingContent } from "@/lib/levelup-site";

/** Same starting prices as the built-in plans of components/blocks/pricing.tsx. */
const FALLBACK_PROJECT_FROM = "$850";
const FALLBACK_CARE_FROM = "$39";

/**
 * Lowest plain price ("$1,500") among the plans; ranges like "From $250+"
 * (event pages, custom quotes) are not a starting price for a website.
 */
function lowestPrice(plans: PlanItem[] | undefined, fallback: string) {
  const values = (plans ?? [])
    .map((plan) => plan.price.trim())
    .filter((price) => /^\$\d[\d,]*$/.test(price))
    .map((price) => ({ price, value: Number(price.replace(/[$,]/g, "")) }))
    .filter((p) => Number.isFinite(p.value) && p.value > 0)
    .sort((a, b) => a.value - b.value);
  return values[0]?.price ?? fallback;
}

const CASE_IDS: WorkCase["id"][] = ["final-stop", "blackpater"];
const CASE_FALLBACK: Record<WorkCase["id"], WorkCase> = {
  "final-stop": {
    id: "final-stop",
    title: "Final Stop Barbershop",
    href: "https://finalstop.org",
  },
  blackpater: {
    id: "blackpater",
    title: "Black Pater",
    href: "https://blackpater.com",
  },
};

export default async function Home() {
  const [pricing, projects] = await Promise.all([
    getPricingContent(),
    getLiveProjects(),
  ]);

  // Live links from the projects list when present, else the known sites.
  const cases = CASE_IDS.map((id) => {
    const project = projects.find((p) => p.id === id);
    const fallback = CASE_FALLBACK[id];
    return {
      id,
      title: fallback.title,
      href:
        project?.external && project.href.startsWith("https://")
          ? project.href
          : fallback.href,
    } satisfies WorkCase;
  });

  return (
    <>
      <HomeHero />
      <Capabilities />
      <HowItWorks />
      <Work cases={cases} />
      <Templates />
      <Ecosystem />
      <PricingTeaser
        projectFrom={lowestPrice(pricing.buildPlans, FALLBACK_PROJECT_FROM)}
        careFrom={lowestPrice(pricing.carePlans, FALLBACK_CARE_FROM)}
      />
      <HomeCta />
    </>
  );
}
