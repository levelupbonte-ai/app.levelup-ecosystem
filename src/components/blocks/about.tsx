import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { aboutStoryCopy } from "@/data/site-copy";
import { LEVELSTUDIO_URL } from "@/lib/levelup-login";
import { getSectionCopy } from "@/lib/levelup-site";
import { cn } from "@/lib/utils";

const About = async () => {
  const copy = await getSectionCopy("about", "story", aboutStoryCopy);
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
          title={copy.founder_title}
          paragraphs={copy.founder_paragraphs}
          ctaButton={{
            href: LEVELSTUDIO_URL,
            text: "Build a free preview",
          }}
        />
      </div>

      {/* Principles & Mission Section */}
      <div className="flex flex-col gap-8 lg:gap-14 flex-1">
        <TextSection
          title={copy.principles_title}
          paragraphs={copy.principles}
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
