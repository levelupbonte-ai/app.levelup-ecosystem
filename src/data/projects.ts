export interface ProjectItem {
  id: string;
  step: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  href: string;
  external?: boolean;
  aspectRatio: string;
  ctaText: string;
}

export const defaultProjects: ProjectItem[] = [
  {
    id: "final-stop",
    step: "01",
    badge: "Client Case Study • San Diego, CA",
    title: "Final Stop Barber Shop",
    description:
      "A custom digital experience built to showcase the brand, simplify appointment booking, and turn local visitors into loyal clients on any device, anytime book appointments easily, and stay connected. Built with a seamless booking system.",
    image: "/projects/final-stop.png",
    href: "https://finalstop.org",
    external: true,
    aspectRatio: "aspect-[639/298]",
    ctaText: "Visit site",
  },
  {
    id: "wedding-invitation",
    step: "02",
    badge: "Client Project • Digital Experience",
    title: "Wedding Invitation",
    description:
      "A bespoke digital experience crafted to celebrate an unforgettable union: interactive prestige invitation, real-time online RSVP management, ceremony & reception itinerary, and instant confirmation.",
    image: "/projects/wedding-card.jpg",
    href: "/projects/wedding-invitation",
    external: false,
    aspectRatio: "aspect-[639/298]",
    ctaText: "Explore the invitation",
  },
  {
    id: "blackpater",
    step: "03",
    badge: "Client Case Study • Personal Brand & Portfolio",
    title: "Black_Pater — Portfolio",
    description:
      "A bespoke cinematic digital portfolio engineered for Jean-Pierre Lofumbwa (« Le Prof »), Congolese educator, entrepreneur, and cultural ambassador in the US. Features custom typography, interactive timeline journey, cover flow showcase, and multi-language support.",
    image: "https://i.ibb.co/S4XSRHVc/IMG-8467.jpg",
    href: "https://blackpater.com",
    external: true,
    aspectRatio: "aspect-[639/298]",
    ctaText: "Visit site",
  },
];

export const allProjects: ProjectItem[] = defaultProjects;

export interface ConceptItem {
  title: string;
  badge: string;
  description: string;
  image: string;
  tags: string[];
  ctaText: string;
  ctaHref: string;
}

/**
 * Built-in fallbacks. The live lists come from the LevelUp database
 * (content_blocks projects/list and projects/concepts, see lib/levelup-site.ts).
 */
export const defaultConcepts: ConceptItem[] = [
  {
    title: "Concept Architecture Studio",
    badge: "Spatial Design & Architecture",
    description:
      "Architectural firm portfolio engineered with cinematic high-resolution asset delivery, progressive scroll perspectives, and editorial typography that honors structural design without platform lag.",
    image: "/features/overview-card.svg",
    tags: ["High-Res Delivery", "Editorial Design", "Bespoke Portfolio"],
    ctaText: "Request preview like this",
    ctaHref: "/contact",
  },
  {
    title: "Concept Wellness Clinic & Spa",
    badge: "Multi-Practitioner Booking",
    description:
      "Streamlined patient intake and appointment platform featuring multi-staff scheduling, customized treatment selection, and synchronized calendar notifications for local medical wellness practices.",
    image: "/features/cycle-card.svg",
    tags: ["24/7 Scheduling", "Intake Flow", "Staff Sync"],
    ctaText: "Request preview like this",
    ctaHref: "/contact",
  },
  {
    title: "Concept Audio & Vinyl Store",
    badge: "Specialized E-Commerce",
    description:
      "Lightweight, sub-2s mobile audio showcase with instant checkout, audio previews, and zero third-party builder bloat.",
    image: "/features/overview-card.svg",
    tags: ["Sub-2s Mobile", "Instant Checkout", "Custom Catalog"],
    ctaText: "Request preview like this",
    ctaHref: "/contact",
  },
];
