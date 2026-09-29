import Image from "next/image";

import Marquee from "react-fast-marquee";

import { DashedLine } from "@/components/dashed-line";
import { ScrollReveal } from "@/components/scroll/scroll-reveal";
import { cn } from "@/lib/utils";

const topItems = [
  {
    title: "Reusable issue templates.",
    description:
      "Draft lightning-fast documents with our Smart Instructions and Templates.",
    images: [
      {
        src: "/resource-allocation/templates.webp",
        alt: "Issue template interface",
        width: 495,
        height: 186,
      },
    ],
    className:
      "flex-1 [&>.title-container]:mb-5 md:[&>.title-container]:mb-8 xl:[&>.image-container]:translate-x-6 [&>.image-container]:translate-x-2",
    fade: [""],
  },
  {
    title: "Connect your essential stack.",
    description:
      "Embed Gmail, Google Drive, Cloudflare, Stripe, maps, analytics, and custom APIs right into client sites.",
    images: [
      { src: "/logos/gmail.svg", alt: "Gmail integration", width: 48, height: 48 },
      { src: "/logos/drive.svg", alt: "Google Drive integration", width: 48, height: 48 },
      { src: "/logos/maps.svg", alt: "Google Maps integration", width: 48, height: 48 },
      {
        src: "/logos/analytics.svg",
        alt: "Google Analytics integration",
        width: 48,
        height: 48,
      },
      {
        src: "/logos/calendar.svg",
        alt: "Google Calendar integration",
        width: 48,
        height: 48,
      },
      {
        src: "/logos/notion.svg",
        alt: "Notion integration",
        width: 48,
        height: 48,
      },
      {
        src: "/logos/jira.svg",
        alt: "Jira integration",
        width: 48,
        height: 48,
      },
      {
        src: "/logos/cloudflare-icon.svg",
        alt: "Cloudflare integration",
        width: 48,
        height: 48,
      },
      { src: "/logos/stripe.svg", alt: "Stripe integration", width: 48, height: 48 },
      {
        src: "/logos/supabase.svg",
        alt: "Supabase integration",
        width: 48,
        height: 48,
      },
      { src: "/logos/openai.svg", alt: "OpenAI integration", width: 48, height: 48 },
      { src: "/logos/github.svg", alt: "GitHub integration", width: 48, height: 48 },
      {
        src: "/logos/monday.svg",
        alt: "Monday integration",
        width: 48,
        height: 48,
      },
      { src: "/logos/asana.svg", alt: "Asana integration", width: 48, height: 48 },
    ],
    className:
      "flex-1 [&>.title-container]:mb-5 md:[&>.title-container]:mb-8 md:[&>.title-container]:translate-x-2 xl:[&>.title-container]:translate-x-4 [&>.title-container]:translate-x-0",
    fade: [],
  },
];

const bottomItems = [
  {
    title: "Graveyard it.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.",
    images: [
      {
        src: "/resource-allocation/graveyard.webp",
        alt: "Graveyard interface",
        width: 305,
        height: 280,
      },
    ],
    className:
      "[&>.title-container]:mb-5 md:[&>.title-container]:mb-8 xl:[&>.image-container]:translate-x-6 [&>.image-container]:translate-x-2",
    fade: ["bottom"],
  },
  {
    title: "Task discussions.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.",
    images: [
      {
        src: "/resource-allocation/discussions.webp",
        alt: "Task discussions interface",
        width: 320,
        height: 103,
      },
    ],
    className:
      "justify-normal [&>.title-container]:mb-5 md:[&>.title-container]:mb-0 [&>.image-container]:flex-1 md:[&>.image-container]:place-items-center md:[&>.image-container]:-translate-y-3",
    fade: [""],
  },
  {
    title: "Notifications.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod.",
    images: [
      {
        src: "/resource-allocation/notifications.webp",
        alt: "Notifications interface",
        width: 305,
        height: 280,
      },
    ],
    className:
      "[&>.title-container]:mb-5 md:[&>.title-container]:mb-8 xl:[&>.image-container]:translate-x-6 [&>.image-container]:translate-x-2",
    fade: ["bottom"],
  },
];

export const ResourceAllocation = () => {
  return (
    <section
      id="resource-allocation"
      className="overflow-hidden pb-28 lg:pb-32"
    >
      <div className="">
        <ScrollReveal yOffset={24} duration={0.7}>
          <h2 className="container text-center text-3xl tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
            LevelUp your resource allocation and execution
          </h2>
        </ScrollReveal>

        <div className="mt-8 md:mt-12 lg:mt-20">
          <DashedLine
            orientation="horizontal"
            className="container scale-x-105"
          />

          {/* Top Features Grid - 2 items */}
          <div className="relative container flex max-md:flex-col">
            {topItems.map((item, i) => (
              <ScrollReveal
                key={i}
                yOffset={28}
                delay={i * 0.12}
                duration={0.75}
                className="flex-1"
              >
                <Item item={item} isLast={i === topItems.length - 1} />
              </ScrollReveal>
            ))}
          </div>
          <DashedLine
            orientation="horizontal"
            className="container max-w-7xl scale-x-110"
          />

          {/* Bottom Features Grid - 3 items */}
          <div className="relative container grid max-w-7xl md:grid-cols-3">
            {bottomItems.map((item, i) => (
              <ScrollReveal
                key={i}
                yOffset={28}
                delay={i * 0.1}
                duration={0.75}
              >
                <Item
                  item={item}
                  isLast={i === bottomItems.length - 1}
                  className="md:pb-0"
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
        <DashedLine
          orientation="horizontal"
          className="container max-w-7xl scale-x-110"
        />
      </div>
    </section>
  );
};

interface ItemProps {
  item: (typeof topItems)[number] | (typeof bottomItems)[number];
  isLast?: boolean;
  className?: string;
}

const Item = ({ item, isLast, className }: ItemProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between px-0 py-6 md:px-6 md:py-8",
        className,
        item.className,
      )}
    >
      <div className="title-container text-balance">
        <h3 className="inline font-semibold">{item.title} </h3>
        <span className="text-muted-foreground"> {item.description}</span>
      </div>

      {item.fade.includes("bottom") && (
        <div className="from-muted/80 absolute inset-0 z-10 bg-linear-to-t via-transparent to-transparent md:hidden" />
      )}
      {item.images.length > 4 ? (
        <div className="relative overflow-hidden w-full py-2">
          <div className="flex flex-col gap-4">
            {/* First row - scrolling left */}
            <Marquee
              direction="left"
              pauseOnHover
              speed={28}
              className="py-1 overflow-hidden"
            >
              {item.images
                .slice(0, Math.ceil(item.images.length / 2))
                .map((image, j) => (
                  <div
                    key={j}
                    className="mx-2 bg-background grid aspect-square size-16 lg:size-20 place-items-center rounded-2xl p-3 shadow-xs border border-border/40 transition-transform duration-200 hover:scale-105"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="object-contain size-9 lg:size-11"
                    />
                  </div>
                ))}
            </Marquee>

            {/* Second row - scrolling right */}
            <Marquee
              direction="right"
              pauseOnHover
              speed={28}
              className="py-1 overflow-hidden"
            >
              {item.images
                .slice(Math.ceil(item.images.length / 2))
                .map((image, j) => (
                  <div
                    key={j}
                    className="mx-2 bg-background grid aspect-square size-16 lg:size-20 place-items-center rounded-2xl p-3 shadow-xs border border-border/40 transition-transform duration-200 hover:scale-105"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="object-contain size-9 lg:size-11"
                    />
                  </div>
                ))}
            </Marquee>
          </div>

          {/* Smooth side fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-16 bg-linear-to-r from-muted to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-16 bg-linear-to-l from-muted to-transparent z-10" />
        </div>
      ) : (
        <div className="image-container grid grid-cols-1 gap-4">
          {item.images.map((image, j) => (
            <Image
              key={j}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="object-contain object-left-top"
            />
          ))}
        </div>
      )}

      {!isLast && (
        <>
          <DashedLine
            orientation="vertical"
            className="absolute top-0 right-0 max-md:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute inset-x-0 bottom-0 md:hidden"
          />
        </>
      )}
    </div>
  );
};
