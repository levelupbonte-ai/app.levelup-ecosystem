import { Background } from "@/components/background";
import { FAQ } from "@/components/blocks/faq";
import { Features } from "@/components/blocks/features";
import { Hero } from "@/components/blocks/hero";
import { Logos } from "@/components/blocks/logos";
import { Pricing } from "@/components/blocks/pricing";
import { ResourceAllocation } from "@/components/blocks/resource-allocation";
import { Testimonials } from "@/components/blocks/testimonials";
import { heroCopy } from "@/data/site-copy";
import {
  getFaqCategories,
  getLiveProjects,
  getPricingContent,
  getSectionCopy,
  getTestimonialItems,
} from "@/lib/levelup-site";

export default async function Home() {
  const [pricing, projects, testimonials, faqCategories, hero] = await Promise.all([
    getPricingContent(),
    getLiveProjects(),
    getTestimonialItems(),
    getFaqCategories(),
    getSectionCopy("home", "hero", heroCopy),
  ]);

  return (
    <>
      <Background className="via-muted to-muted/80">
        <Hero copy={hero} />
        <Pricing
          initialPlans={pricing.buildPlans}
          initialCarePlans={pricing.carePlans}
        />
        <Logos />
        <Features projects={projects} />
        <ResourceAllocation />
      </Background>
      <Background variant="bottom">
        <Testimonials items={testimonials} />
        <FAQ categories={faqCategories} />
      </Background>
    </>
  );
}
