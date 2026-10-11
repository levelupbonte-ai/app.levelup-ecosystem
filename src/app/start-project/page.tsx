import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Studio — Build a Project | LevelUp Ecosystem",
  description:
    "Interactive LevelUp Project Studio. Configure your website, booking system, e-commerce store, AI automation, or custom architecture in minutes.",
  alternates: {
    canonical: "/start-project",
  },
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
  return (
    <div className="fixed inset-0 z-[200] h-dvh w-screen overflow-hidden bg-[#07070b] select-none">
      <iframe
        src={src}
        title="LevelUp Project Studio"
        className="block h-full w-full border-0 bg-[#07070b]"
        allow="clipboard-write"
      />
    </div>
  );
}
