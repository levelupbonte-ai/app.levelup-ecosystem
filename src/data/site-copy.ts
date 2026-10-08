/**
 * Built-in text for the editable sections of the site.
 *
 * Each entry is the default for one content_blocks row (page / block_key) of
 * the LevelUp website. Editing that row in the database (or the dashboard)
 * overrides the matching fields; anything missing or malformed keeps the text
 * below. The shape here is the contract: only these keys are read.
 */

export const heroCopy = {
  title: "LevelUp Your Online Presence.",
  kicker: "Turn Your Business Into a Brand.",
  subtitle:
    "Modern websites designed to get you found, build trust, and turn visitors into customers.",
  cta_primary: "Build a Project",
  cta_secondary: "Build free preview",
  features: [
    { title: "Bespoke Websites", description: "Fast, modern sites built to convert.", icon: "globe" },
    { title: "Search Visibility", description: "Get found first on Google & Maps.", icon: "search" },
    { title: "Cyber Protection", description: "Active shield against attacks and downtime.", icon: "shield" },
    { title: "Automated Booking", description: "24/7 scheduling with zero manual work.", icon: "calendar" },
  ],
};

export const aboutHeroCopy = {
  eyebrow:
    "Independent Web & Security Engineering Studio • California & Worldwide",
  title: "Meet LevelUp Ecosystem",
  lead: "Fast, secure digital infrastructure engineered for ambitious brands, founders, and creators worldwide.",
  paragraphs: [
    "Headquartered in San Diego, California and collaborating with clients across the United States and globally, LevelUp Ecosystem delivers custom web platforms that solve real business needs.",
    "We engineer bespoke digital architectures with effortless 24/7 customer appointment booking, sub-2-second mobile load speeds, and real cybersecurity protections from day one.",
  ],
  stats: [
    { value: "< 2s", label: "Mobile page load speed" },
    { value: "24/7", label: "Online appointment booking" },
    { value: "100%", label: "Code & client ownership" },
    { value: "$0", label: "Bulky builder subscription lock-in" },
  ],
};

export const aboutStoryCopy = {
  founder_title: "About Richelieu Bonte",
  founder_paragraphs: [
    "Richelieu Bonte is the founder and principal engineer of LevelUp Ecosystem, an independent web design and development studio based in San Diego, California. Originally from the Democratic Republic of Congo, he is currently pursuing his degree as a first-year cybersecurity student in California.",
    "Richelieu developed his engineering expertise building hands-on systems with modern AI tools. His earlier software ventures and technical explorations included Bonté IA and LevelUp IA, experiments focused on exploring automated assistance and high development velocity. What began as dedicated practical coding quickly expanded into LevelUp Ecosystem—a full-service studio engineered to solve the real challenges faced by local service businesses and independent creators.",
    "Today, Richelieu personally directs architecture, security evaluations, and human code auditing for all studio projects. To deliver robust, bespoke websites with 24/7 automated booking and zero bloat, he collaborates with technical contributors and design specialists while maintaining rigorous security practices from discovery through launch.",
  ],
  principles_title: "Our Studio Principles",
  principles: [
    "1. Direct Studio Partnership: No account reps, no ticket queues, no call centers. You work directly with our engineering team from concept through deployment and maintenance.",
    "2. Security Built In by Default: Every client project at LevelUp Ecosystem is AI-assisted, human-directed, and security-verified. AI tools accelerate initial layout prototyping, while every line of shipped production code, calendar synchronization logic, and database access rule is reviewed, verified, and secured by hand.",
    "3. Zero Monthly Builder Traps: Traditional website builders charge $30-$80 every month while delivering slow, cluttered code that hurts your Google rankings. We build clean, lightweight bespoke code that you own 100% with no lock-in fees.",
    "4. California Roots, Global Delivery: Headquartered in California, we engineer and deploy high-performance web platforms for companies, founders, and creators across the United States and worldwide with direct communication and precision delivery.",
  ],
};

export const contactCopy = {
  eyebrow: "Get In Touch With LevelUp Ecosystem",
  title: "Let's Build Your Website",
  subtitle:
    "Request your free interactive mobile preview, ask questions about 24/7 online booking, or request a non-destructive website security check.",
  location: "San Diego, California · Worldwide",
  location_note:
    "Partnering with ambitious businesses, founders, and creators across the United States and globally.",
  email: "contact@levelup-ecosystem.com",
  email_note: "Direct engineering & project inquiries",
  preview_title: "Free 24-48h Preview",
  preview_text:
    "Send your business details. We build a functional mobile prototype on your phone before any payment.",
  form_title: "Request a Preview or Consultation",
  form_subtitle:
    "Tell us about your business, current website or goals. We reply within 24 business hours.",
};

/** content_blocks rows (page, block_key) → defaults, used by the loader and the seed. */
export const SITE_COPY_BLOCKS = {
  "home/hero": heroCopy,
  "about/hero": aboutHeroCopy,
  "about/story": aboutStoryCopy,
  "contact/intro": contactCopy,
} as const;
