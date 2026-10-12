/**
 * Facts about LevelUp Ecosystem and its founder. Keep every public statement
 * (pages, metadata, JSON-LD, llms.txt) consistent with this file, and keep it
 * true: no invented credentials, team size, clients, metrics or experience.
 */
export interface StudioIdentity {
  personName: string;
  personRole: string;
  personOneLiner: string;
  personBio: string;
  orgName: string;
  orgOneLiner: string;
  studioName: string;
  studioOneLiner: string;
  location: string;
  contactEmail: string;
  phone?: string;
  sameAs: string[];
}

export const IDENTITY: StudioIdentity = {
  personName: "Richelieu Bonte",
  personRole: "Founder",
  personOneLiner:
    "Richelieu Bonte is the founder of LevelUp Ecosystem, an online web studio founded in San Diego, California. He is a first-year cybersecurity student, originally from the Democratic Republic of Congo.",
  personBio:
    "Richelieu is not a traditional software engineer: he builds with AI. He directs modern AI tools, tests every page and reviews security settings before launch, and brings what he learns in his cybersecurity studies into every project.",
  orgName: "LevelUp Ecosystem",
  orgOneLiner:
    "LevelUp Ecosystem is an online web studio founded by Richelieu Bonte in San Diego, California. It designs, builds, hosts and maintains websites with 24/7 online booking for local businesses, brands and creators.",
  studioName: "LevelStudio",
  studioOneLiner:
    "LevelStudio is LevelUp's online AI website studio: describe your business and preview a website draft.",
  location: "San Diego, California",
  contactEmail: "contact@levelup-ecosystem.com",
  sameAs: [],
};

export default IDENTITY;
