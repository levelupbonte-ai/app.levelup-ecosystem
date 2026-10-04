import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { allProjects } from "@/data/projects";
import { getProjects } from "@/lib/supabase";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

function BackToLevelUpButton() {
  return (
    <Link
      href="/projects"
      className="fixed top-4 left-4 z-[999] inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-white/90 hover:text-white backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide transition-all duration-200 shadow-xl hover:scale-105 select-none"
    >
      <ArrowLeft className="w-3.5 h-3.5" />
      <span>LevelUp</span>
    </Link>
  );
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;

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
        description:
          "Custom digital platform with real-time haircut scheduling and local business SEO.",
        images: [imageUrl],
        creator: "@levelupecosystem",
      },
    };
  }

  if (id === "blackpater" || id === "black-pater" || id === "03") {
    const title = "BLACK_PATER — Jean-Pierre Lofumbwa · Le Prof | Cinematic Portfolio";
    const description =
      "Bespoke digital experience for Congolese educator, entrepreneur, and cultural ambassador Jean-Pierre Lofumbwa (Le Prof). Engineered by LevelUp Ecosystem.";
    const imageUrl = "https://levelup-ecosystem.com/projects/blackpater-card.jpg";

    return {
      title,
      description,
      alternates: {
        canonical: `/projects/blackpater`,
      },
      openGraph: {
        title: "BLACK_PATER — Jean-Pierre Lofumbwa · Le Prof",
        description,
        url: `https://levelup-ecosystem.com/projects/blackpater`,
        siteName: "LevelUp Ecosystem",
        locale: "en_US",
        type: "article",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: "Black_Pater — Jean-Pierre Lofumbwa Portfolio",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "BLACK_PATER — Jean-Pierre Lofumbwa · Le Prof",
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
        <BackToLevelUpButton />
        <iframe
          src="/projects/wedding-invitation.html"
          title="Wedding & Event Digital Invitation — RSVP & Celebration"
          className="w-full h-full border-0 block"
        />
      </main>
    );
  }

  if (id === "blackpater" || id === "black-pater" || id === "03") {
    return (
      <main className="fixed inset-0 w-full h-full bg-[#0c0a09] z-30 overflow-hidden">
        <BackToLevelUpButton />
        <iframe
          src="/projects/blackpater-portofolio.html"
          title="BLACK_PATER — Jean-Pierre Lofumbwa · Le Prof"
          className="w-full h-full border-0 block"
        />
      </main>
    );
  }

  if (id === "final-stop") {
    redirect("https://finalstop.org");
  }

  // Check Supabase dynamic projects
  try {
    const liveProjects = await getProjects();
    const liveProject = Array.isArray(liveProjects) ? liveProjects.find((p: { id: string }) => p.id === id) : null;
    if (liveProject && liveProject.href) {
      if (liveProject.external) {
        redirect(liveProject.href);
      }
      return (
        <main className="fixed inset-0 w-full h-full bg-[#0a0908] z-30 overflow-hidden">
          <BackToLevelUpButton />
          <iframe
            src={liveProject.href}
            title={liveProject.title || "Project Showcase"}
            className="w-full h-full border-0 block"
          />
        </main>
      );
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.warn("Could not query project from Supabase:", err);
    }
  }

  const project = allProjects.find((p) => p.id === id);
  if (!project) {
    notFound();
  }

  return (
    <main className="fixed inset-0 w-full h-full bg-[#0a0908] z-30 overflow-hidden">
      <BackToLevelUpButton />
      <iframe
        src={project.href}
        title={project.title}
        className="w-full h-full border-0 block"
      />
    </main>
  );
}
