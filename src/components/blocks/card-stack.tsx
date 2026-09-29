"use client";

import React from "react";

import {
  Code2,
  Lightbulb,
  Palette,
  Rocket,
  Search,
  type LucideIcon,
} from "lucide-react";

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
    cardBg: "bg-[#F7FAFE] dark:bg-[#141822]",
    borderColor: "border-sky-200/90 dark:border-sky-900/60",
    iconBg: "bg-sky-100 text-sky-600 dark:bg-sky-950/70 dark:text-sky-400",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  {
    id: "research",
    icon: Search,
    title: "Research",
    description:
      "We will share a detailed questionnaire to analyze your business in-depth. After that, we will be able to create a tailor-made design to reach your business goals.",
    cardBg: "bg-[#F9F8FE] dark:bg-[#161524]",
    borderColor: "border-indigo-200/90 dark:border-indigo-900/60",
    iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    id: "web-design",
    icon: Palette,
    title: "Web design",
    description:
      "We craft intuitive, responsive interfaces aligned with your brand identity. Every component is designed to ensure instant credibility and fluid user navigation.",
    cardBg: "bg-[#FAF7FE] dark:bg-[#181426]",
    borderColor: "border-purple-200/90 dark:border-purple-900/60",
    iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-950/70 dark:text-purple-400",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "development",
    icon: Code2,
    title: "No-code development",
    description:
      "High-speed implementation with clean architectures, automated bookings, and seamless integrations. Sub-second performance with zero third-party dependencies.",
    cardBg: "bg-[#FFFBF5] dark:bg-[#1A1612]",
    borderColor: "border-amber-200/90 dark:border-amber-900/60",
    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "launch",
    icon: Rocket,
    title: "Launch",
    description:
      "When the project is completed, we will schedule a dedicated 2hr session to fully train your team on using, editing, and taking advantage of your new website.",
    cardBg: "bg-[#F4FAF6] dark:bg-[#121A16]",
    borderColor: "border-emerald-300/90 dark:border-emerald-800/80",
    iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
];

export function CardStack() {
  return (
    <section className="relative pt-16 pb-8 sm:pt-24 sm:pb-12 overflow-visible">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 sm:mb-18">
          <SplitText
            text="We guide you throughout the entire process"
            as="h2"
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          />
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From creative design to technical solutions, our services define industry excellence
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            const stickyTop = isLast ? 100 : 100 + index * 42;
            const zIndex = isLast ? 60 : 10 + index * 10;

            const marginBottom = isLast
              ? "mb-[42vh]"
              : index === steps.length - 2
                ? "mb-[34vh]"
                : "mb-[22vh]";

            return (
              <div
                key={step.id}
                style={{
                  zIndex,
                  top: `${stickyTop}px`,
                }}
                className={cn("sticky", marginBottom)}
              >
                <div
                  className={cn(
                    "relative rounded-[26px] border p-6 sm:p-8 md:p-9 transition-shadow duration-300",
                    "shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_30px_rgba(0,0,0,0.45)]",
                    isLast && "ring-1 ring-emerald-500/25 shadow-[0_8px_32px_rgba(16,185,129,0.15)]",
                    step.cardBg,
                    step.borderColor,
                  )}
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 mb-3.5 sm:mb-4">
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

                  <div className="pl-0 sm:pl-[60px]">
                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
