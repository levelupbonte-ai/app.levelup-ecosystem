import React, { type ReactNode } from "react";
import {
  CalendarCheck,
  Globe,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { Headline, Hero, M } from "@/components/motion/primitives";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  globe: Globe,
  search: Search,
  shield: ShieldCheck,
  calendar: CalendarCheck,
};

interface PremiumServiceBlockProps {
  title: string;
  description: string;
  iconName?: "globe" | "search" | "shield" | "calendar" | string;
  icon?: LucideIcon | ReactNode;
  index?: number;
  delay?: number;
  className?: string;
}

/**
 * A service block: the icon, the heading and the description rise in one
 * after the other as the block enters the viewport (scroll motion system,
 * docs/motion.md).
 */
export function PremiumServiceBlock({
  title,
  description,
  iconName,
  icon: IconProp,
  index = 0,
  delay,
  className,
}: PremiumServiceBlockProps) {
  const base = delay !== undefined ? Math.round(delay * 1000) : index * 120;
  const ResolvedIcon = iconName && ICON_MAP[iconName] ? ICON_MAP[iconName] : null;
  const iconClass =
    "text-foreground size-4 lg:size-5 transition-transform duration-300 group-hover:scale-110";

  return (
    <div className={cn("flex gap-2.5 lg:gap-5 mb-5 last:mb-0 group", className)}>
      <M className="shrink-0 mt-1" delay={base}>
        {ResolvedIcon ? (
          <ResolvedIcon className={iconClass} />
        ) : React.isValidElement(IconProp) ? (
          IconProp
        ) : IconProp ? (
          (() => {
            const CustomComp = IconProp as React.ComponentType<{ className?: string }>;
            return <CustomComp className={iconClass} />;
          })()
        ) : null}
      </M>
      <div className="space-y-1">
        <M as="h3" delay={base + 100} className="font-text text-foreground font-semibold text-sm sm:text-base leading-snug">
          {title}
        </M>
        <M as="p" delay={base + 200} className="text-muted-foreground max-w-76 text-xs sm:text-sm leading-relaxed">
          {description}
        </M>
      </div>
    </div>
  );
}

interface PremiumTextSectionRevealProps {
  heading: ReactNode;
  description: ReactNode;
  headingAs?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  headingClassName?: string;
  descriptionClassName?: string;
  /** Seconds. */
  delay?: number;
  align?: "center" | "left";
}

/**
 * A section heading and its lead: the headline's words rise out of a mask,
 * then the description follows. The heading level is respected. As the first
 * block of a page (`h1`) it plays with the page instead of waiting for the
 * scroll, and its text is in the HTML from the first paint.
 */
export function PremiumTextSectionReveal({
  heading,
  description,
  headingAs: HeadingTag = "h2",
  className,
  headingClassName,
  descriptionClassName,
  delay = 0,
  align = "center",
}: PremiumTextSectionRevealProps) {
  const hero = HeadingTag === "h1";
  const ms = Math.round(delay * 1000);
  return (
    <div
      className={cn(
        align === "center" ? "text-center max-w-3xl mx-auto" : "text-left max-w-3xl",
        className,
      )}
    >
      <Headline as={HeadingTag} hero={hero} delay={ms} className={headingClassName}>
        {heading}
      </Headline>
      {hero ? (
        <Hero as="p" delay={ms + 160} className={descriptionClassName}>
          {description}
        </Hero>
      ) : (
        <M kind="up" as="p" delay={ms + 160} className={descriptionClassName}>
          {description}
        </M>
      )}
    </div>
  );
}
