import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { allProjects } from "@/data/projects";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;

  if (id === "wedding-invitation" || id === "retrouvailles" || id === "02") {
    return {
      title: "Wedding & Private Event Digital Invitation | LevelUp Ecosystem",
      description:
        "Bespoke luxury digital experience for weddings, milestone parties, and celebrations with real-time RSVP management.",
      alternates: {
        canonical: `/projects/${id}`,
      },
    };
  }

  const project = allProjects.find((p) => p.id === id);
  if (!project) return { title: "Project | LevelUp Ecosystem" };

  return {
    title: `${project.title} | LevelUp Ecosystem`,
    description: project.description,
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
