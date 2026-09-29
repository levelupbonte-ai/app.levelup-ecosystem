import Image from "next/image";

import { DashedLine } from "@/components/dashed-line";
import { ScrollReveal } from "@/components/scroll/scroll-reveal";

const deliverables = [
  {
    title: "Instant interactive previews.",
    description:
      "Test a live, functional mobile prototype on your phone within 24-48 hours before paying a single dollar.",
    image: {
      src: "/resource-allocation/templates.webp",
      alt: "Website prototype preview",
      width: 495,
      height: 186,
    },
  },
  {
    title: "24/7 automated booking.",
    description:
      "Zero phone tag. Clients choose their service, staff member, and time slot directly on their phone.",
    image: {
      src: "/resource-allocation/discussions.webp",
      alt: "Online booking interface",
      width: 495,
      height: 186,
    },
  },
  {
    title: "Cybersecurity audits.",
    description:
      "Non-destructive reviews of SSL/HTTPS, database security rules, secret leakage, and domain protection.",
    image: {
      src: "/resource-allocation/graveyard.webp",
      alt: "Security audit interface",
      width: 495,
      height: 280,
    },
  },
  {
    title: "Monthly care plan ($49/mo).",
    description:
      "High-speed cloud hosting, automated daily backups, on-demand content edits, and active uptime monitoring.",
    image: {
      src: "/resource-allocation/notifications.webp",
      alt: "Care plan dashboard",
      width: 495,
      height: 280,
    },
  },
];

export const ResourceAllocation = () => {
  return (
    <section
      id="resource-allocation"
      className="overflow-hidden pb-16 lg:pb-24"
    >
      <div className="container max-w-7xl">
        <ScrollReveal yOffset={24} duration={0.7}>
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground">
              Everything Included • Built For Growth
            </span>
            <h2 className="text-3xl tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              Everything your business needs to win online
            </h2>
          </div>
        </ScrollReveal>

        <DashedLine orientation="horizontal" className="w-full scale-x-105" />

        {/* 2x2 Grid of Clean Deliverables - No Clunky Tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60">
          {deliverables.map((item, i) => (
            <ScrollReveal
              key={i}
              yOffset={24}
              delay={i * 0.08}
              duration={0.65}
              className="p-6 sm:p-8 lg:p-10 flex flex-col justify-between"
            >
              <div className="mb-6 space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-muted/40 border border-border/50 p-4 flex items-center justify-center">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  className="max-h-48 sm:max-h-56 w-auto object-contain rounded-lg"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>

        <DashedLine orientation="horizontal" className="w-full scale-x-105 mt-6" />
      </div>
    </section>
  );
};
