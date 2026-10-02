import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
];

export const allProjects: ProjectItem[] = defaultProjects;

/**
 * Loads projects dynamically from Firebase Firestore `/projects` collection.
 * If the collection is empty or unreachable, cleanly falls back to the default items.
 */
export async function getLiveProjects(): Promise<ProjectItem[]> {
  try {
    const projectsCol = collection(db, "projects");
    const q = query(projectsCol, orderBy("step", "asc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return defaultProjects;
    }

    const fetched: ProjectItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      fetched.push({
        id: docSnap.id,
        step: data.step || "01",
        badge: data.badge || "Client Project",
        title: data.title || "Project",
        description: data.description || "",
        image: data.image || "/og-image.jpg",
        href: data.href || "#",
        external: data.external ?? true,
        aspectRatio: data.aspectRatio || "aspect-[639/298]",
        ctaText: data.ctaText || "Explore project",
      });
    });

    return fetched.length > 0 ? fetched : defaultProjects;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("Could not fetch projects from Firestore, using defaults:", err);
    }
    return defaultProjects;
  }
}

