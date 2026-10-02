import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Invitation — Celebration & RSVP | LevelUp Ecosystem",
  description:
    "Bespoke luxury wedding invitation experience. Confirm your attendance (RSVP) and discover event details.",
};

export default function RetrouvaillesPage() {
  return (
    <main className="fixed inset-0 w-full h-full bg-[#0a0908] z-30 overflow-hidden">
      <iframe
        src="/retrouvailles.html"
        title="Wedding Invitation — RSVP & Celebration"
        className="w-full h-full border-0 block"
      />
    </main>
  );
}
