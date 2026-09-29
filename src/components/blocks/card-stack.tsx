"use client";

import React from "react";

import {
  Code2,
  Headphones,
  Lightbulb,
  Palette,
  Rocket,
  Search,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";

import { SplitText } from "@/components/scroll/split-text";
import { cn } from "@/lib/utils";

interface StackStep {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cardBg: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
}

const steps: StackStep[] = [
  {
    id: "idea",
    icon: Lightbulb,
    title: "Idea",
    description:
      "We meet with your team to learn more about your project idea and goals. After that, our team will work together to create an action plan and proposal for your project.",
    cardBg: "bg-white dark:bg-[#14151f]",
    borderColor: "border-violet-100/90 dark:border-violet-900/40",
    iconBg: "bg-violet-50/80 dark:bg-violet-950/40",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "research",
    icon: Search,
    title: "Research",
    description:
      "We will share a detailed questionnaire to analyze your business in-depth. After that, we will be able to create a tailor-made design to reach your business goals.",
    cardBg: "bg-[#FAFAFD] dark:bg-[#151622]",
    borderColor: "border-indigo-100/90 dark:border-indigo-900/40",
    iconBg: "bg-indigo-50/80 dark:bg-indigo-950/40",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "web-design",
    icon: Palette,
    title: "Web design",
    description:
      "We craft intuitive, responsive interfaces aligned with your brand identity. Every component is designed to ensure instant credibility and fluid user navigation.",
    cardBg: "bg-[#FAF9FE] dark:bg-[#161524]",
    borderColor: "border-purple-100/90 dark:border-purple-900/40",
    iconBg: "bg-purple-50/80 dark:bg-purple-950/40",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "development",
    icon: Code2,
    title: "No-code & custom development",
    description:
      "High-speed implementation with clean architectures, automated bookings, and seamless integrations. Sub-second performance with zero third-party dependencies.",
    cardBg: "bg-[#FAF8FD] dark:bg-[#161423]",
    borderColor: "border-violet-200/80 dark:border-violet-900/40",
    iconBg: "bg-violet-50/80 dark:bg-violet-950/40",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    id: "launch",
    icon: Rocket,
    title: "Launch",
    description:
      "When the project is completed, we will schedule a dedicated 2hr session to fully train your team on using, editing, and taking advantage of your new website.",
    cardBg: "bg-[#F9FCFA] dark:bg-[#141A17]",
    borderColor: "border-emerald-100/90 dark:border-emerald-900/40",
    iconBg: "bg-emerald-50/80 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "support",
    icon: Headphones,
    title: "Support",
    description:
      "We keep a close, long-term relationship and clear communication with your team, so we can better support future design or development needs.",
    cardBg: "bg-[#F8FAFC] dark:bg-[#14181E]",
    borderColor: "border-sky-100/90 dark:border-sky-900/40",
    iconBg: "bg-sky-50/80 dark:bg-sky-950/40",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
];

export function CardStack() {
  return (
    <section className="relative pt-24 pb-36 sm:pt-32 sm:pb-44 overflow-visible">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-20 sm:mb-28">
          <SplitText
            text="We guide you throughout the entire process"
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          />
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From creative design to technical solutions, our services define industry excellence
          </p>
        </div>

        {/* Sticky Accordion Cards Container with sufficient scroll track */}
        {/* pb-[75vh] ensures all cards completely stack and rest together before scrolling away */}
        <div className="relative max-w-3xl mx-auto pb-[65vh] sm:pb-[75vh]">
          {steps.map((step, index) => {
            const Icon = step.icon;
            // Precise spacing so each card leaves exactly its clean title tab visible (52px offset)
            const stickyTop = 100 + index * 52;

            return (
              <div
                key={step.id}
                style={{
                  top: `${stickyTop}px`,
                  zIndex: index + 10,
                }}
                className="sticky mb-32 last:mb-0"
              >
                {/* Crisp, opaque card without backdrop blur fog */}
                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    "relative rounded-[26px] border p-6 sm:p-8 md:p-10 transition-shadow duration-300",
                    "shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
                    step.cardBg,
                    step.borderColor,
                  )}
                >
                  {/* Card Header: Real SVG Icon + Title */}
                  <div className="flex items-center gap-3.5 sm:gap-4 mb-4 sm:mb-5">
                    <div
                      className={cn(
                        "flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-2xl border border-border/40 shadow-xs",
                        step.iconBg,
                        step.iconColor,
                      )}
                    >
                      <Icon className="size-5 sm:size-6" strokeWidth={2} />
                    </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                      {step.title}
                    </h3>
                  </div>

                  {/* Card Content Description */}
                  <div className="pl-0 sm:pl-[60px]">
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
