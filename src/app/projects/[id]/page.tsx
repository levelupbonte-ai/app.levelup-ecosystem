import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { allProjects } from "@/data/projects";
import { db } from "@/lib/firebase";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

interface FirestoreProjectData {
  title?: string;
  shareTitle?: string;
  description?: string;
  shareDescription?: string;
  image?: string;
  ogImage?: string;
  href?: string;
  badge?: string;
  external?: boolean;
}

/**
 * Reads project details dynamically from Firestore:
 * 1. Checks direct document ID: `doc(db, "projects", id)`
 * 2. Checks slug field query: `where("slug", "==", id)`
 */
async function fetchProjectFromFirestore(id: string): Promise<FirestoreProjectData | null> {
  try {
    // 1. Direct document ID lookup
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as FirestoreProjectData;
    }

    // 2. Query by slug if ID does not match document ID directly
    const projectsCol = collection(db, "projects");
    const slugQuery = query(projectsCol, where("slug", "==", id));
    const slugSnap = await getDocs(slugQuery);
    if (!slugSnap.empty) {
      return slugSnap.docs[0].data() as FirestoreProjectData;
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn(`[Firestore OpenGraph] Could not fetch project "${id}":`, err);
    }
  }
  return null;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;

  // 1. Dynamic Firestore OpenGraph metadata lookup
  const firestoreData = await fetchProjectFromFirestore(id);
  if (firestoreData) {
    const title =
      firestoreData.shareTitle ||
      firestoreData.title ||
      "Client Project | LevelUp Ecosystem";
    const description =
      firestoreData.shareDescription ||
      firestoreData.description ||
      "Explore this custom web project engineered by LevelUp Ecosystem.";
    const rawImage =
      firestoreData.ogImage ||
      firestoreData.image ||
      "/projects/final-stop.png";
    const imageUrl = rawImage.startsWith("http")
      ? rawImage
      : `https://levelup-ecosystem.com${rawImage}`;

    return {
      title: `${title} | LevelUp Ecosystem`,
      description,
      alternates: {
        canonical: `/projects/${id}`,
      },
      openGraph: {
        title,
        description,
        url: `https://levelup-ecosystem.com/projects/${id}`,
        siteName: "LevelUp Ecosystem",
        locale: "en_US",
        type: "article",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
        creator: "@levelupecosystem",
      },
    };
  }

  // 2. Known presets & fallbacks
  if (id === "wedding-invitation" || id === "retrouvailles" || id === "02") {
    const title = "Wedding & Private Event Digital Invitation | San Diego RSVP Experience";
    const description =
      "Bespoke luxury digital experience for weddings and celebrations with real-time RSVP management, ceremony itinerary, and Google Maps navigation in San Diego, CA.";
    const imageUrl = "https://levelup-ecosystem.com/projects/wedding-card.jpg";

    return {
      title,
      description,
      alternates: {
        canonical: `/projects/wedding-invitation`,
      },
      openGraph: {
        title: "Le Dernier Retrouvailles — Wedding & Private Event Digital Invitation",
        description:
          "You are cordially invited: Explore the bespoke digital wedding invitation, ceremony details, and submit your RSVP online.",
        url: `https://levelup-ecosystem.com/projects/wedding-invitation`,
        siteName: "LevelUp Ecosystem",
        locale: "en_US",
        type: "article",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: "Le Dernier Retrouvailles — Wedding Invitation & RSVP Experience",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Wedding & Private Event Digital Invitation | LevelUp Ecosystem",
        description:
          "Luxury bespoke digital wedding invitation and real-time online RSVP experience in San Diego, CA.",
        images: [imageUrl],
        creator: "@levelupecosystem",
      },
    };
  }

  if (id === "final-stop") {
    const title = "Final Stop Barber Shop — 24/7 Online Booking & Web Platform | San Diego";
    const description =
      "Sub-2-second load times, mobile appointment scheduling, haircut showcase, and Google Maps local SEO in San Diego, CA.";
    const imageUrl = "https://levelup-ecosystem.com/projects/final-stop.png";

    return {
      title,
      description,
      alternates: {
        canonical: `/projects/final-stop`,
      },
      openGraph: {
        title: "Final Stop Barber Shop — Fast Mobile Booking System",
        description:
          "Engineered by LevelUp Ecosystem: 24/7 calendar appointment booking, portfolio gallery, and local San Diego SEO.",
        url: `https://levelup-ecosystem.com/projects/final-stop`,
        siteName: "LevelUp Ecosystem",
        locale: "en_US",
        type: "article",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: "Final Stop Barber Shop Web Platform Case Study",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Final Stop Barber Shop Case Study | LevelUp Ecosystem",
        description,
        images: [imageUrl],
        creator: "@levelupecosystem",
      },
    };
  }

  const project = allProjects.find((p) => p.id === id);
  if (!project) {
    return {
      title: "Projects & Client Work | LevelUp Ecosystem",
      description: "Explore custom websites and web applications built by LevelUp Ecosystem.",
    };
  }

  const projectImageUrl = project.image.startsWith("http")
    ? project.image
    : `https://levelup-ecosystem.com${project.image}`;

  return {
    title: `${project.title} | LevelUp Ecosystem`,
    description: project.description,
    alternates: {
      canonical: `/projects/${project.id}`,
    },
    openGraph: {
      title: `${project.title} | LevelUp Ecosystem`,
      description: project.description,
      url: `https://levelup-ecosystem.com/projects/${project.id}`,
      siteName: "LevelUp Ecosystem",
      locale: "en_US",
      type: "article",
      images: [
        {
          url: projectImageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} | LevelUp Ecosystem`,
      description: project.description,
      images: [projectImageUrl],
      creator: "@levelupecosystem",
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;

  if (id === "retrouvailles") {
    redirect("/projects/wedding-invitation");
  }

  if (id === "wedding-invitation" || id === "02") {
    return (
      <main className="fixed inset-0 w-full h-full bg-[#0a0908] z-30 overflow-hidden">
        <iframe
          src="/projects/wedding-invitation.html"
          title="Wedding & Event Digital Invitation — RSVP & Celebration"
          className="w-full h-full border-0 block"
        />
      </main>
    );
  }

  if (id === "final-stop") {
    redirect("https://finalstop.org");
  }

  // Check Firestore live data first
  const liveProject = await fetchProjectFromFirestore(id);
  if (liveProject && liveProject.href) {
    if (liveProject.external) {
      redirect(liveProject.href);
    }
    return (
      <main className="fixed inset-0 w-full h-full bg-[#0a0908] z-30 overflow-hidden">
        <iframe
          src={liveProject.href}
          title={liveProject.title || "Project Showcase"}
          className="w-full h-full border-0 block"
        />
      </main>
    );
  }

  const project = allProjects.find((p) => p.id === id);
  if (!project) {
    notFound();
  }

  return (
    <main className="fixed inset-0 w-full h-full bg-[#0a0908] z-30 overflow-hidden">
      <iframe
        src={project.href}
        title={project.title}
        className="w-full h-full border-0 block"
      />
    </main>
  );
}
