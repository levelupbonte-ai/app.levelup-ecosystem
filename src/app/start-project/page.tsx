import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Studio — Build a Project | LevelUp Ecosystem",
  description:
    "Interactive LevelUp Project Studio. Configure your website, booking system, e-commerce store, AI automation, or custom architecture in minutes.",
  alternates: {
    canonical: "/start-project",
  },
};

export default function StartProjectPage() {
  return (
    <div className="fixed inset-0 z-[200] w-screen h-dvh bg-[#07070b] overflow-hidden select-none">
      <iframe
        src="/project-studio.html"
        title="LevelUp Project Studio"
        className="w-full h-full border-0 block bg-[#07070b]"
        allow="clipboard-write"
      />
    </div>
  );
}
