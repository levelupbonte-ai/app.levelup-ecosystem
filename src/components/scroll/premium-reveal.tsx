"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarCheck,
  Globe,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  globe: Globe,
  search: Search,
  shield: ShieldCheck,
  calendar: CalendarCheck,
};

/**
 * Hook to adapt vertical translation distance between desktop (~20px) and mobile (~10px).
 */
function useResponsiveYOffset(desktopOffset = 20, mobileOffset = 10) {
  const [offset, setOffset] = useState(desktopOffset);

  useEffect(() => {
    const update = () => {
      setOffset(window.innerWidth < 640 ? mobileOffset : desktopOffset);
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, [desktopOffset, mobileOffset]);

  return offset;
}

// Smooth high-end agency ease-out curve (no bouncing, minimal and elegant)
const EASE_OUT_PREMIUM = [0.16, 1, 0.3, 1] as const;

interface PremiumServiceBlockProps {
  title: string;
  description: string;
  iconName?: "globe" | "search" | "shield" | "calendar" | string;
  icon?: LucideIcon | React.ReactNode;
  index?: number;
  delay?: number;
  className?: string;
}

/**
 * Service block reveal:
 * - Heading and description animate together when the block enters the viewport.
 * - Starts translated downward (20px desktop, 10px mobile) at 0% opacity.
 * - Smoothly animates to natural position (y: 0) and 100% opacity over 600ms with ease-out.
 * - Heading appears first, followed by description ~100ms later.
 * - Sequential stagger between blocks as the user scrolls.
 * - Triggers once per section.
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
  const yOffset = useResponsiveYOffset(20, 10);
  const blockDelay = delay !== undefined ? delay : index * 0.12;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: blockDelay,
        staggerChildren: 0.1, // Heading first, description 100ms later
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: yOffset,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: EASE_OUT_PREMIUM,
      },
    },
  };

  // Determine icon to render: prioritize iconName string for 100% safe Server-to-Client serialization
  const ResolvedIcon = iconName && ICON_MAP[iconName] ? ICON_MAP[iconName] : null;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={containerVariants}
      className={cn("flex gap-2.5 lg:gap-5 mb-5 last:mb-0 group", className)}
    >
      <motion.div
        variants={itemVariants}
        className="shrink-0 mt-1"
      >
        {ResolvedIcon ? (
          <ResolvedIcon className="text-foreground size-4 lg:size-5 transition-transform duration-300 group-hover:scale-110" />
        ) : React.isValidElement(IconProp) ? (
          IconProp
        ) : IconProp ? (
          (() => {
            const CustomComp = IconProp as React.ComponentType<{ className?: string }>;
            return (
              <CustomComp className="text-foreground size-4 lg:size-5 transition-transform duration-300 group-hover:scale-110" />
            );
          })()
        ) : null}
      </motion.div>
      <div className="space-y-1">
        <motion.h3
          variants={itemVariants}
          className="font-text text-foreground font-semibold text-sm sm:text-base leading-snug"
        >
          {title}
        </motion.h3>
        <motion.p
          variants={itemVariants}
          className="text-muted-foreground max-w-76 text-xs sm:text-sm leading-relaxed"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}

interface PremiumTextSectionRevealProps {
  heading: React.ReactNode;
  description: React.ReactNode;
  headingAs?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  headingClassName?: string;
  descriptionClassName?: string;
  delay?: number;
  align?: "center" | "left";
}

/**
 * Text Section Reveal (applied to "Tailored Solutions. Clear Pricing."):
 * - Heading starts translated down 20px (10px mobile) at 0% opacity.
 * - Smoothly animates to natural position at 100% opacity in 600ms.
 * - Description appears ~100ms later with the same duration and curve.
 * - Triggered once on viewport entry.
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
  const yOffset = useResponsiveYOffset(20, 10);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: 0.1, // 100ms stagger: heading first, description 100ms later
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: yOffset,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: EASE_OUT_PREMIUM,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className={cn(
        align === "center" ? "text-center max-w-3xl mx-auto" : "text-left max-w-3xl",
        className
      )}
    >
      <motion.div variants={itemVariants}>
        <HeadingTag className={headingClassName}>
          {heading}
        </HeadingTag>
      </motion.div>
      <motion.p
        variants={itemVariants}
        className={descriptionClassName}
      >
        {description}
      </motion.p>
    </motion.div>
  );
}
