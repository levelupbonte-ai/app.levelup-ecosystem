import { getProjects } from "@/lib/supabase";

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

/**
 * Loads projects dynamically from Supabase PostgreSQL `projects` table.
 * If Supabase is empty or unreachable, cleanly falls back to default projects.
 */
export async function getLiveProjects(): Promise<ProjectItem[]> {
  try {
    const data = await getProjects();
    if (!data || !Array.isArray(data) || data.length === 0) {
      return defaultProjects;
    }

    return data.map((item: {
      id: string;
      step?: string;
      badge?: string;
      title?: string;
      description?: string;
      image?: string;
      href?: string;
      external?: boolean;
      aspect_ratio?: string;
      cta_text?: string;
    }) => ({
      id: item.id,
      step: item.step || "01",
      badge: item.badge || "Client Project",
      title: item.title || "Project",
      description: item.description || "",
      image: item.image || "/og-image.jpg",
      href: item.href || "#",
      external: item.external ?? true,
      aspectRatio: item.aspect_ratio || "aspect-[639/298]",
      ctaText: item.cta_text || "Explore project",
    }));
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("Could not fetch projects from Supabase, using defaults:", err);
    }
    return defaultProjects;
  }
}

