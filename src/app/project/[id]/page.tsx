import type { Metadata } from "next";
import { redirect } from "next/navigation";

interface SingularProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SingularProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  if (id === "wedding-invitation" || id === "retrouvailles" || id === "02") {
    return {
      title: "Wedding & Private Event Digital Invitation | LevelUp Ecosystem",
      description:
        "Bespoke luxury digital experience for weddings and celebrations with real-time RSVP management.",
      openGraph: {
        title: "Le Dernier Retrouvailles — Wedding & Private Event Digital Invitation",
        description:
          "You are cordially invited: Explore the bespoke digital wedding invitation and submit your RSVP online.",
        images: ["https://levelup-ecosystem.com/projects/wedding-card.jpg"],
      },
    };
  }
  return {
    title: "Projects & Client Work | LevelUp Ecosystem",
    description: "Explore custom websites and web applications built by LevelUp Ecosystem.",
    openGraph: {
      images: ["https://levelup-ecosystem.com/og-image.jpg"],
    },
  };
}

export default async function SingularProjectPage({ params }: SingularProjectPageProps) {
  const { id } = await params;
  redirect(`/projects/${id}`);
}
