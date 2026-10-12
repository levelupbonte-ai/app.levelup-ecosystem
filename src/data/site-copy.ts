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
    { title: "Custom Websites", description: "Modern, mobile-first sites built around your brand.", icon: "globe" },
    { title: "Search Visibility", description: "Local SEO foundations for Google & Maps.", icon: "search" },
    { title: "Security Basics", description: "HTTPS, spam protection, backups and monitoring.", icon: "shield" },
    { title: "Online Booking", description: "Clients book 24/7, you confirm from your dashboard.", icon: "calendar" },
  ],
};

export const aboutHeroCopy = {
  eyebrow: "Online Web Studio • San Diego, California",
  title: "Meet LevelUp Ecosystem",
  lead: "Custom websites with 24/7 online booking, Google visibility and security best practices, for local businesses, brands and creators.",
  paragraphs: [
    "LevelUp Ecosystem is an online web studio founded by Richelieu Bonte in San Diego, California. We work online, with clients in San Diego and beyond: there is no office open to visitors, and every project runs remotely.",
    "We design, build, host and maintain websites: a custom design around your brand, 24/7 online booking, local SEO foundations, security best practices and one dashboard for your site, bookings and clients.",
  ],
  stats: [
    { value: "Free", label: "Preview of your site before you commit" },
    { value: "24/7", label: "Online appointment booking" },
    { value: "Yours", label: "Domain, content and customer data" },
    { value: "1", label: "Dashboard for your site, bookings and clients" },
  ],
};

export const aboutStoryCopy = {
  founder_title: "About Richelieu Bonte",
  founder_paragraphs: [
    "Richelieu Bonte is the founder of LevelUp Ecosystem, an online web studio based in San Diego, California. Originally from the Democratic Republic of Congo, he is a first-year cybersecurity student in California.",
    "Richelieu is not a traditional software engineer: he builds with AI. Before LevelUp Ecosystem, he explored AI assistants through personal projects such as Bonté IA and LevelUp IA. That curiosity became LevelUp Ecosystem, an online studio that helps local service businesses and independent creators get a professional website.",
    "Today, Richelieu directs modern AI tools to build each website, tests every page on phone and desktop, and reviews the security settings before launch. His cybersecurity studies shape the habits he applies to every project.",
  ],
  principles_title: "Our Principles",
  principles: [
    "1. Direct contact: no account reps, no ticket queues, no call centers. You talk directly with the founder, from the first preview to launch and maintenance.",
    "2. AI-assisted, human-reviewed: AI tools help us build faster. A person reviews and tests what they produce, including forms, bookings and access settings, before anything goes live.",
    "3. Your Content, Your Brand, Your Data: Your domain, text, photos, logos and customer data always belong to you and stay exportable. We design, host and maintain your site on our platform under a clear license, with lightweight, clean code and plain-language terms, so you are never held hostage over your content.",
    "4. Online by design: LevelUp Ecosystem is an online business based in San Diego, California. Every project runs remotely, wherever our clients are.",
  ],
};

export const contactCopy = {
  eyebrow: "Get In Touch With LevelUp Ecosystem",
  title: "Let's Build Your Website",
  subtitle:
    "Request your free interactive mobile preview, ask questions about 24/7 online booking, or request a non-destructive website security check.",
  location: "San Diego, California · Online",
  location_note:
    "An online studio: we work remotely with businesses, founders and creators.",
  email: "contact@levelup-ecosystem.com",
  email_note: "Questions and project inquiries",
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
