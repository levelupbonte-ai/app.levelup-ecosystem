import type { Metadata, Viewport } from "next";

import { StudioFrame } from "@/components/start-project/studio-frame";

export const metadata: Metadata = {
  title: "Project Studio — Build a Project | LevelUp Ecosystem",
  description:
    "Interactive LevelUp Project Studio. Configure your website, booking system, e-commerce store, AI automation, or custom architecture in minutes.",
  alternates: {
    canonical: "/start-project",
  },
};

// Full-screen studio: drawn edge to edge (the studio pads itself with the
// safe-area insets) and resized with the on-screen keyboard. Zoom stays allowed.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default async function StartProjectPage({
  searchParams,
}: {
  searchParams: Promise<{
    lang?: string | string[];
    template?: string | string[];
  }>;
}) {
  // English by default; ?lang=fr|en and ?template=<slug> (the "Start with
  // this template" links) are forwarded to the studio.
  const { lang, template } = await searchParams;
  const query = new URLSearchParams();
  if (lang === "fr" || lang === "en") query.set("lang", lang);
  if (
    template === "missbeauty" ||
    template === "resto" ||
    template === "travel"
  )
    query.set("template", template);
  const src = query.size
    ? `/project-studio.html?${query.toString()}`
    : "/project-studio.html";
  return <StudioFrame src={src} />;
}
