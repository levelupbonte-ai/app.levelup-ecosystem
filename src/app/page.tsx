import { Capabilities } from "@/components/home/capabilities";
import { Ecosystem } from "@/components/home/ecosystem";
import { HomeHero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { Work, type WorkCase } from "@/components/home/work";
import { getLiveProjects } from "@/lib/levelup-site";

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
  const projects = await getLiveProjects();

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
      <Ecosystem />
    </>
  );
}
