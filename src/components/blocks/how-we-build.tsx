"use client";

import { type Locale, useLocale } from "@/lib/locale";

const COPY: Record<
  Locale,
  { eyebrow: string; title: string; intro: string; items: { title: string; body: string }[] }
> = {
  en: {
    eyebrow: "How we build",
    title: "AI-assisted, reviewed by a person.",
    intro:
      "We want you to know exactly how your website is made. No inflated titles, no invented numbers.",
    items: [
      {
        title: "Built with AI",
        body: "Richelieu is not a traditional software engineer. He builds with AI: he describes what each page must do, directs modern AI tools to produce it, and refines the result until it is right.",
      },
      {
        title: "Tested before launch",
        body: "Every page is checked on phone and desktop, forms and bookings are tried end to end, and nothing goes live until you approve it.",
      },
      {
        title: "Security-first habits",
        body: "HTTPS, careful access settings, spam protection, backups and updates are part of every project, and the security settings are reviewed before launch.",
      },
      {
        title: "Still learning",
        body: "Richelieu is in his first year of cybersecurity studies. What he learns goes straight into how LevelUp protects client sites, and we never claim certifications or experience we do not have.",
      },
    ],
  },
  fr: {
    eyebrow: "Notre façon de travailler",
    title: "Assisté par l'IA, vérifié par une personne.",
    intro:
      "Nous voulons que vous sachiez exactement comment votre site est fait. Pas de titres gonflés, pas de chiffres inventés.",
    items: [
      {
        title: "Construit avec l'IA",
        body: "Richelieu n'est pas un ingénieur logiciel au sens classique. Il construit avec l'IA : il décrit ce que chaque page doit faire, dirige des outils d'IA modernes pour la produire et affine le résultat jusqu'à ce qu'il soit juste.",
      },
      {
        title: "Testé avant la mise en ligne",
        body: "Chaque page est vérifiée sur téléphone et sur ordinateur, les formulaires et les réservations sont testés de bout en bout, et rien n'est mis en ligne sans votre accord.",
      },
      {
        title: "La sécurité d'abord",
        body: "HTTPS, réglages d'accès soignés, protection anti-spam, sauvegardes et mises à jour font partie de chaque projet, et les réglages de sécurité sont vérifiés avant la mise en ligne.",
      },
      {
        title: "Toujours en apprentissage",
        body: "Richelieu est en première année d'études en cybersécurité. Ce qu'il apprend sert directement à protéger les sites de nos clients, et nous ne revendiquons jamais de certifications ni d'expérience que nous n'avons pas.",
      },
    ],
  },
};

export function HowWeBuild() {
  const t = COPY[useLocale()];
  return (
    <section id="how-we-build" className="container max-w-5xl py-12">
      <span className="text-muted-foreground font-mono text-xs font-bold tracking-widest uppercase">
        {t.eyebrow}
      </span>
      <h2 className="text-foreground mt-3 text-2xl font-bold tracking-tight md:text-3xl">
        {t.title}
      </h2>
      <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">{t.intro}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {t.items.map((item) => (
          <div key={item.title} className="border-border/80 bg-card/60 rounded-2xl border p-5">
            <h3 className="text-foreground font-semibold">{item.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
