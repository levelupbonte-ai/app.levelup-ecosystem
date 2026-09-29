import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const About = () => {
  return (
    <section className="container mt-10 flex max-w-5xl flex-col-reverse gap-8 md:mt-14 md:gap-14 lg:mt-20 lg:flex-row lg:items-start">
      {/* Founder Section */}
      <div className="flex flex-col gap-8 lg:gap-14 flex-1">
        <ImageSection
          images={[
            { src: "/about/1.webp", alt: "LevelUp design architecture" },
            { src: "/about/2.webp", alt: "Development workspace" },
          ]}
          className="xl:-translate-x-6"
        />

        <TextSection
          title="About Richelieu Bonte"
          paragraphs={[
            "Richelieu Bonte is the founder and principal engineer of LevelUp Ecosystem, an independent web design and development studio based in San Diego, California. Originally from the Democratic Republic of Congo, he is currently pursuing his degree as a first-year cybersecurity student in California.",
            "Richelieu developed his engineering expertise building hands-on systems with modern AI tools. His earlier software ventures and technical explorations included Bonté IA and LevelUp IA, experiments focused on exploring automated assistance and high development velocity. What began as dedicated practical coding quickly expanded into LevelUp Ecosystem—a full-service studio engineered to solve the real challenges faced by local service businesses and independent creators.",
            "Today, Richelieu personally directs architecture, security evaluations, and human code auditing for all studio projects. To deliver robust, bespoke websites with 24/7 automated booking and zero bloat, he collaborates with technical contributors and design specialists while maintaining rigorous security practices from discovery through launch.",
          ]}
          ctaButton={{
            href: "/contact",
            text: "Request a free preview",
          }}
        />
      </div>

      {/* Principles & Mission Section */}
      <div className="flex flex-col gap-8 lg:gap-14 flex-1">
        <TextSection
          title="Our Studio Principles"
          paragraphs={[
            "1. Direct Studio Partnership: No account reps, no ticket queues, no call centers. You work directly with our engineering team from concept through deployment and maintenance.",
            "2. Security Built In by Default: Every client project at LevelUp Ecosystem is AI-assisted, human-directed, and security-verified. AI tools accelerate initial layout prototyping, while every line of shipped production code, calendar synchronization logic, and database access rule is reviewed, verified, and secured by hand.",
            "3. Zero Monthly Builder Traps: Traditional website builders charge $30-$80 every month while delivering slow, cluttered code that hurts your Google rankings. We build clean, lightweight bespoke code that you own 100% with no lock-in fees.",
            "4. Local San Diego Commitment: While we serve clients across the United States and internationally, we are proud to be based in San Diego, regularly meeting local business owners in person to review prototypes and optimize their Google Maps presence.",
          ]}
          ctaButton={{
            href: "/projects",
            text: "View recent case studies",
          }}
        />
        <ImageSection
          images={[
            { src: "/about/3.webp", alt: "San Diego web architecture" },
            { src: "/about/4.webp", alt: "Client collaboration" },
          ]}
          className="hidden lg:flex xl:translate-x-6"
        />
      </div>
    </section>
  );
};

export default About;

interface ImageSectionProps {
  images: { src: string; alt: string }[];
  className?: string;
}

export function ImageSection({ images, className }: ImageSectionProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {images.map((image, index) => (
        <div
          key={index}
          className="relative aspect-[2/1.5] overflow-hidden rounded-2xl border border-border/60 shadow-sm"
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

interface TextSectionProps {
  title?: string;
  paragraphs: string[];
  ctaButton?: {
    href: string;
    text: string;
  };
}

export function TextSection({
  title,
  paragraphs,
  ctaButton,
}: TextSectionProps) {
  return (
    <section className="flex-1 space-y-4 text-base md:space-y-5">
      {title && (
        <h2 className="text-foreground text-2xl md:text-3xl font-bold tracking-tight">
          {title}
        </h2>
      )}
      <div className="text-muted-foreground space-y-4 leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {ctaButton && (
        <div className="mt-6">
          <Link href={ctaButton.href}>
            <Button size="lg">{ctaButton.text}</Button>
          </Link>
        </div>
      )}
    </section>
  );
}
