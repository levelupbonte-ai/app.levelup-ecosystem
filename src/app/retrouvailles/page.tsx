import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Dernier Retrouvailles — Inscription | LevelUp Ecosystem",
  description:
    "La 4ème CONS organise Le Dernier Retrouvailles. Une dernière fête, des souvenirs pour toujours.",
};

export default function RetrouvaillesPage() {
  return (
    <main className="min-h-screen w-full bg-[#0a0908]">
      <iframe
        src="/retrouvailles.html"
        title="Le Dernier Retrouvailles — Inscription"
        className="w-full h-screen border-0"
        style={{ minHeight: "100vh" }}
      />
    </main>
  );
}
