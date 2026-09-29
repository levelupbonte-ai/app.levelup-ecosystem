export interface StudioIdentity {
  personName: string;
  personRole: string;
  personOneLiner: string;
  personBio: string;
  orgName: string;
  orgOneLiner: string;
  studioName: string;
  location: string;
  contactEmail: string;
  phone?: string;
  sameAs: string[];
}

export const IDENTITY: StudioIdentity = {
  personName: "Richelieu Bonte",
  personRole: "Founder & Principal Engineer",
  personOneLiner:
    "Richelieu Bonte is the founder of LevelUp Ecosystem, an independent web design studio building secure, AI-assisted websites with 24/7 online booking for local businesses and creators. He is a cybersecurity student based in San Diego, California, originally from the Democratic Republic of Congo.",
  personBio:
    "Richelieu Bonte founded LevelUp Ecosystem to deliver clean, lightweight digital infrastructure for service businesses and creators. Combining cybersecurity coursework with hands-on systems engineering, he directs architecture, security evaluations, and human code auditing for every project.",
  orgName: "LevelUp Ecosystem",
  orgOneLiner:
    "LevelUp Ecosystem is an independent web design and development studio that builds fast, secure websites with 24/7 online booking for local businesses, creators, and portfolios.",
  studioName: "LevelStudio",
  location: "San Diego, California",
  contactEmail: "hello@levelup-ecosystem.com",
  sameAs: [],
};

export default IDENTITY;
