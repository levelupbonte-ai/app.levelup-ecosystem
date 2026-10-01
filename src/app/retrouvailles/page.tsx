import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Dernier Retrouvailles — Inscription | LevelUp Ecosystem",
  description:
    "La 4ème CONS organise Le Dernier Retrouvailles. Une dernière fête, des souvenirs pour toujours.",
};

export default function RetrouvaillesPage() {
  return (
    <main className="fixed inset-0 w-full h-full bg-[#0a0908] z-30 overflow-hidden">
      <iframe
        src="/retrouvailles.html"
        title="Le Dernier Retrouvailles — Inscription"
        className="w-full h-full border-0 block"
      />
    </main>
  );
}
