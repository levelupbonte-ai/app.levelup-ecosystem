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
  searchParams: Promise<{ lang?: string | string[] }>;
}) {
  // English by default; ?lang=fr|en is forwarded to the studio.
  const { lang } = await searchParams;
  const src =
    lang === "fr" || lang === "en"
      ? `/project-studio.html?lang=${lang}`
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
