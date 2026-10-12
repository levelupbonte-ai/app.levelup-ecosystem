/**
 * Keeps site copy that comes from the shared content database true and
 * consistent with the published Terms (/terms, /services-agreement).
 *
 * The Terms use a license model: the client owns their content, brand and data;
 * LevelUp keeps the code and hosts and maintains the site on a care plan. Older
 * rows written by dashboard editors may still carry the former wording
 * ("100% code ownership", "no monthly fee", "sub-2s") or claims that are not
 * true (LevelUp is an online studio run by its founder, a first-year
 * cybersecurity student who builds with AI: no "engineering team", no
 * "principal engineer", no "human code auditing", no physical studio).
 * Those phrases are rewritten here so they never reach visitors. Update the
 * rows in the dashboard (see the SQL patch shipped with this change) to make
 * this a no-op.
 */
const RULES: [RegExp, string][] = [
  // Ownership and pricing (license model of the Terms).
  [/100% full ownership with zero monthly fees/gi, "your content, brand and data stay yours, with hosting and maintenance on a care plan"],
  [/100% full (?:website and )?(?:source )?code ownership/gi, "Your content, brand and customer data stay yours (exportable)"],
  [/100% (?:website )?code ownership/gi, "Your content, brand & data stay yours"],
  [/\bno monthly fee\b/gi, "Hosted on a care plan"],
  [/^Optional Care$/g, "Care plan required"],
  [/\((?:Care|care) optional\)/g, "(with a care plan)"],
  [/ ?\(sub-2s loading speed target\)/gi, " for fast loading"],
  [/^Sub-2s Mobile$/i, "Fast on Mobile"],
  [/sub-2(?:s|-second)\s*/gi, ""],
  [/\(no generic templates\)/gi, "(never a generic template)"],
  [/Custom database architecture \(Cloud SQL, Firestore, Redis\)/g, "Custom databases"],
  [/the \$49\/month Care Plan/g, "a Care Plan"],
  [/Monthly care plan \(\$49\/mo\)\./g, "Monthly care plans."],
  [/50\+ professional templates/g, "Professional templates"],
  [/Cancel anytime with zero penalty/g, "Cancel with 30 days' notice"],
  [/Cancel anytime with zero long-term contract/g, "No long-term contract: cancel with 30 days' notice"],
  [/^100% customized to your exact needs$/g, "Tailored to your needs"],

  // Who builds the sites: the founder, with AI tools. No engineering team.
  [/Priority developer support via WhatsApp and email/g, "Priority support via WhatsApp and email"],
  [/Highest priority VIP developer support \(direct line\)/gi, "Highest priority support (direct line)"],
  [/Highest Priority VIP Developer Support/g, "Highest Priority Support"],
  [/Priority developer support/g, "Priority support"],
  [/^VIP Engineering & Expansion$/g, "Growth & Expansion"],
  [/Full digital engineering partner: content, SEO, dev & priority support/g, "Your ongoing web partner: content, SEO, development & priority support"],
  [/Milestone-based delivery & dedicated engineering review/g, "Milestone-based delivery with a review at each step"],
  [/^Full-stack custom web applications$/g, "Custom web applications"],
  [/^Direct engineering & project inquiries$/g, "Questions and project inquiries"],
  [/\bengineered (for|with|to)\b/g, "designed $1"],
  [/\bEngineered (for|with|to|by)\b/g, "Designed $1"],

  // Security wording: reviews and best practices, not professional audits.
  [/^Cybersecurity Hardening & Audit$/g, "Security Hardening & Review"],
  [/Full cybersecurity audit and hardening/g, "Security review and hardening"],
  [/Database security audit & access hardening/g, "Database security review & access hardening"],
  [/^Database Security Rules & Audit$/g, "Database Security Rules & Review"],
  [/^Advanced Security & Threat Defense$/g, "Advanced Security Monitoring"],
  [/advanced security defense/g, "security monitoring"],
  [/continuous security defense/g, "security updates"],
  [/^We audit your domain registrar/g, "We review your domain registrar"],
  [/, audit database permissions,/g, ", review database permissions,"],

  // Hosting and speed: no superlatives we cannot measure for every site.
  [/^Managed Edge Cloud Hosting$/g, "Managed Cloud Hosting"],
  [/High-speed cloud hosting on global edge network/g, "Managed cloud hosting"],
  [/Managed ultra-fast cloud hosting on edge infrastructure/g, "Managed cloud hosting"],
  [/^High-speed cloud hosting, /g, "Managed hosting, "],
  [/Automated daily offsite backups with instant recovery/g, "Automated daily offsite backups with restore on request"],
  [/E-commerce stores with instant Stripe checkouts/g, "E-commerce stores with online checkout"],
  [/^Instant Checkout$/g, "Online Checkout"],
  [/with instant checkout,/g, "with online checkout,"],
  [/^Instant email notifications for new bookings$/g, "Email notifications for new bookings"],
  [/, and instant confirmation\.$/g, ", and automatic confirmation."],

  // Home hero features (content_blocks home/hero): no ranking, protection or
  // "zero work" promises.
  [/^Bespoke Websites$/g, "Custom Websites"],
  [/^Fast, modern sites built to convert\.$/g, "Modern, mobile-first sites built around your brand."],
  [/^Get found first on Google & Maps\.$/g, "Local SEO foundations for Google & Maps."],
  [/^Cyber Protection$/g, "Security Basics"],
  [/^Active shield against attacks and downtime\.$/g, "HTTPS, spam protection, backups and monitoring."],
  [/^Automated Booking$/g, "Online Booking"],
  [/^24\/7 scheduling with zero manual work\.$/g, "Clients book 24/7, you confirm from your dashboard."],

  // Third-party product names are not part of what we promise.
  [/^Google Analytics setup$/g, "Analytics setup"],
  [/^Basic accessibility \(WCAG compliant\)$/g, "Basic accessibility checks (WCAG guidelines)"],
  [/^Basic technical SEO architecture$/g, "Basic technical SEO setup"],
  [/^Core Deliverables & Architecture$/g, "Core Deliverables"],

  // No popularity or conversion metrics we do not publish.
  [/^Our most popular monthly plan\./g, "Our recommended monthly plan."],
  [/^A custom-designed, high-converting showcase website\. Includes mobile-first responsive architecture,/g, "A custom-designed showcase website. Includes a mobile-first responsive design,"],

  // Company: an online studio, not a physical one.
  [/^Our Studio Principles$/g, "Our Principles"],
  [/^Independent Web & Security Engineering Studio • California & Worldwide$/g, "Online Web Studio • San Diego, California"],
  [/^San Diego, California · Worldwide$/g, "San Diego, California · Online"],
];

/** Whole texts (matched by how they start) replaced by a true version. */
const REPLACEMENTS: [RegExp, string][] = [
  [
    /^Yes, 100%\. (?:Once final payment|Unlike proprietary)/,
    "You own your domain, brand, text, photos and customer data, and you can export them on request. LevelUp builds, hosts and maintains the site on its platform under a license: we keep the code, templates and components (and may reuse them for other clients, never your content or branding), and the site stays online while your care plan is active. We never hold your domain or your data hostage. If you want the project-specific code, a code buy-out is available under a separate written agreement.",
  ],
  [
    /^3\. Zero Monthly Builder Traps/,
    "3. Your Content, Your Brand, Your Data: Your domain, text, photos, logos and customer data always belong to you and stay exportable. We design, host and maintain your site on our platform under a clear license, with lightweight, clean code and plain-language terms, so you are never held hostage over your content.",
  ],
  // About / FAQ: the company and its founder.
  [
    /^LevelUp Ecosystem is an independent web (?:architecture|design) and development studio/,
    "LevelUp Ecosystem is an online web studio founded by Richelieu Bonte in San Diego, California. We design, build, host and maintain websites for local businesses, barbershops, salons, brands and creators: custom design, 24/7 online booking, Google visibility, security best practices and one client dashboard. We work online, with no office open to visitors.",
  ],
  [
    /^Richelieu Bonte is the founder and principal engineer of LevelUp Ecosystem, an independent web design studio/,
    "Richelieu Bonte is the founder of LevelUp Ecosystem. He is a first-year cybersecurity student based in San Diego, California, originally from the Democratic Republic of Congo. He is not a traditional software engineer: he builds with AI, directing modern AI tools, testing every page and reviewing security settings before launch.",
  ],
  [
    /^Richelieu Bonte is the founder and principal engineer of LevelUp Ecosystem/,
    "Richelieu Bonte is the founder of LevelUp Ecosystem, an online web studio based in San Diego, California. Originally from the Democratic Republic of Congo, he is a first-year cybersecurity student in California.",
  ],
  [
    /^Richelieu developed his engineering expertise/,
    "Richelieu is not a traditional software engineer: he builds with AI. Before LevelUp Ecosystem, he explored AI assistants through personal projects such as Bonté IA and LevelUp IA. That curiosity became LevelUp Ecosystem, an online studio that helps local service businesses and independent creators get a professional website.",
  ],
  [
    /^Today, Richelieu personally directs architecture/,
    "Today, Richelieu directs modern AI tools to build each website, tests every page on phone and desktop, and reviews the security settings before launch. His cybersecurity studies shape the habits he applies to every project.",
  ],
  [
    /^1\. Direct Studio Partnership/,
    "1. Direct contact: no account reps, no ticket queues, no call centers. You talk directly with the founder, from the first preview to launch and maintenance.",
  ],
  [
    /^2\. Security Built In by Default/,
    "2. AI-assisted, human-reviewed: AI tools help us build faster. A person reviews and tests what they produce, including forms, bookings and access settings, before anything goes live.",
  ],
  [
    /^4\. California Roots, Global Delivery/,
    "4. Online by design: LevelUp Ecosystem is an online business based in San Diego, California. Every project runs remotely, wherever our clients are.",
  ],
  [
    /^Fast, secure digital infrastructure engineered for/,
    "Custom websites with 24/7 online booking, Google visibility and security best practices, for local businesses, brands and creators.",
  ],
  [
    /^Headquartered in San Diego, California and collaborating/,
    "LevelUp Ecosystem is an online web studio founded by Richelieu Bonte in San Diego, California. We work online, with clients in San Diego and beyond: there is no office open to visitors, and every project runs remotely.",
  ],
  [
    /^We engineer bespoke digital architectures/,
    "We design, build, host and maintain websites: a custom design around your brand, 24/7 online booking, local SEO foundations, security best practices and one dashboard for your site, bookings and clients.",
  ],
  [
    /^Partnering with ambitious businesses, founders, and creators across the United States and globally\.?$/,
    "An online studio: we work remotely with businesses, founders and creators.",
  ],
  [
    /^LevelStudio is LevelUp Ecosystem's automated AI preview generator/,
    "LevelStudio is LevelUp Ecosystem's online AI studio. You describe your business, answer a few guided questions and preview a website draft on your phone. Once you approve a draft, LevelUp finishes, tests and launches the production site.",
  ],
  // FAQ (faq_items): no ranking promise, security check is a review, not an audit.
  [
    /^Yes\. Local visibility requires coordinated website data/,
    "We can help. Local visibility depends on consistent website data and a verified Google Business Profile. We match your name, phone number and service areas to your Google listing, add local business Schema.org structured data and keep your pages light on mobile. Rankings are decided by Google, so no one can promise you a position.",
  ],
  [
    /^We audit your domain registrar and DNS settings/,
    "We review your domain registrar and DNS settings, check your SSL/HTTPS certificate and database permissions, help you turn on two-factor authentication (2FA) for your hosting and business email accounts, add spam-bot honeypots to your forms, and check for exposed keys or passwords. It is a review based on security best practices, not a professional penetration test.",
  ],
  [
    /^High-speed cloud hosting, automated daily backups, monthly security updates, 24\/7 uptime monitoring/,
    "Managed hosting, automated daily backups, monthly security updates, uptime monitoring, and on-demand content edits (updating hours, prices, service menus, or staff members).",
  ],
  [
    /^A bespoke high-converting showcase website built from scratch\./,
    "A custom showcase website designed around your brand. Includes a mobile-first responsive design, Google Maps integration, technical and local SEO foundations, and your content, brand and data stay yours, with hosting and maintenance on a care plan.",
  ],
  [
    /^An automated appointment booking and customer acquisition powerhouse\./,
    "A website with online booking built in: self-service scheduling, 2-way calendar sync, security hardening, and advanced local SEO.",
  ],
];

export function neutralizeClaims(text: string): string {
  if (!text) return text;
  for (const [re, to] of REPLACEMENTS) if (re.test(text)) return to;
  let out = text;
  for (const [re, to] of RULES) out = out.replace(re, to);
  return out;
}

/**
 * About page stats from the database: older rows show claims that are not
 * true for every site ("< 2s" load speed, "100%" code ownership, "$0"). When
 * any of them is present, the built-in stats are shown instead.
 */
export function truthfulStats<T extends { value: string; label: string }>(
  stats: T[],
  defaults: T[],
): T[] {
  const bad = stats.some(
    (s) =>
      /load speed|code & client ownership|lock-in/i.test(s.label) ||
      /^(?:<\s*2s|100%|\$0)$/.test(s.value.trim()),
  );
  return bad ? defaults : stats;
}
