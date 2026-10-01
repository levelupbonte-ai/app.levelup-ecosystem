import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const categories = [
  {
    title: "About LevelUp Ecosystem",
    questions: [
      {
        question: "What is LevelUp Ecosystem?",
        answer:
          "LevelUp Ecosystem is an independent web architecture and development studio based in San Diego, California. The studio builds fast, secure websites with 24/7 online booking, local SEO, and cybersecurity basics for businesses, barbershops, salons, and creators.",
      },
      {
        question: "Who is Richelieu Bonte?",
        answer:
          "Richelieu Bonte is the founder and principal engineer of LevelUp Ecosystem, an independent web design studio building secure, AI-assisted websites for local businesses and creators. He is a cybersecurity student based in San Diego, California, originally from the Democratic Republic of Congo.",
      },
      {
        question: "What is LevelStudio?",
        answer:
          "LevelStudio is LevelUp Ecosystem's automated AI preview generator, allowing clients to test website concepts and interactive mobile prototypes on their phone before human engineering and deployment.",
      },
    ],
  },
  {
    title: "Services & Google Ranking",
    questions: [
      {
        question: "How does the free interactive preview work?",
        answer:
          "You send us your business name, services, and any photos or ideas you have. Within 24 to 48 hours, we build a functional, interactive mobile preview of your site. You get to test it on your phone before spending a single dollar. If you approve, we move forward. If not, you owe nothing.",
      },
      {
        question: "Can you help our business rank higher on Google Maps in San Diego?",
        answer:
          "Yes. Local visibility requires coordinated website data and a verified Google Business Profile. We format your name, phone number, and service areas to match your Google listing, insert local business Schema.org structured data, and optimize page load speeds so mobile searchers convert into appointments.",
      },
      {
        question: "How long does a website take to build and launch?",
        answer:
          "Once you approve your free preview, full custom development, 24/7 online appointment booking configuration, security hardening, and domain launch typically take 7 to 10 days.",
      },
    ],
  },
  {
    title: "Security & Pricing",
    questions: [
      {
        question: "What is included in the Website Security Check?",
        answer:
          "We audit your domain registrar and DNS settings, verify SSL HTTPS certificates, audit database permissions, implement two-factor authentication (2FA) on your hosting and business email accounts, install spam bot honeypots, and test for credential leakage.",
      },
      {
        question: "Do I own my website, code, and domain?",
        answer:
          "Yes, 100%. Once final payment is settled, you own all rights to your domain, branding, text, and customer lists. There are no lock-in contracts or hostage fees.",
      },
      {
        question: "What is included in the $49/month Care Plan?",
        answer:
          "High-speed cloud hosting, automated daily backups, monthly security updates, 24/7 uptime monitoring, and on-demand content edits (updating hours, prices, service menus, or staff members).",
      },
    ],
  },
];

export const FAQ = ({
  headerTag = "h2",
  className,
  className2,
}: {
  headerTag?: "h1" | "h2";
  className?: string;
  className2?: string;
}) => {
  return (
    <section className={cn("py-28 lg:py-32", className)}>
      <div className="container max-w-5xl">
        <div className={cn("mx-auto grid gap-16 lg:grid-cols-12 items-start relative", className2)}>
          {/* Left Column: Stays sticky on PC while right side scrolls */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 xl:top-32 lg:self-start space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground">
              Answers & Insights
            </span>
            {headerTag === "h1" ? (
              <h1 className="text-2xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Frequently Asked Questions
              </h1>
            ) : (
              <h2 className="text-2xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Frequently Asked Questions
              </h2>
            )}
            <p className="text-muted-foreground max-w-md leading-relaxed lg:mx-auto">
              Have questions about our San Diego web design, 24/7 online booking, or cybersecurity audits?{" "}
              <Link href="/contact" className="text-foreground underline underline-offset-4 font-semibold">
                Get in touch with our team
              </Link>
              .
            </p>
          </div>

          {/* Right Column: Original minimalist design that scrolls smoothly */}
          <div className="lg:col-span-7 grid gap-6 text-start">
            {categories.map((category, categoryIndex) => (
              <div key={category.title} className="">
                <h3 className="text-foreground border-b py-3 font-semibold text-sm">
                  {category.title}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, i) => (
                    <AccordionItem key={i} value={`${categoryIndex}-${i}`}>
                      <AccordionTrigger className="text-left font-medium text-sm sm:text-base py-3.5">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
