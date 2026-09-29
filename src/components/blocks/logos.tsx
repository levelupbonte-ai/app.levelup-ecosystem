"use client";

import { type ComponentType } from "react";

import Link from "next/link";

import Marquee from "react-fast-marquee";
import {
  SiAnthropic,
  SiCloudflare,
  SiCss,
  SiGithub,
  SiGoogle,
  SiGooglegemini,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiReact,
  SiReplit,
  SiTypescript,
} from "react-icons/si";

import { ScrollReveal } from "@/components/scroll/scroll-reveal";

type ToolItem = {
  name: string;
  icon: ComponentType<{ className?: string }>;
  href: string;
};

export const Logos = () => {
  const topRowTools: ToolItem[] = [
    {
      name: "HTML5",
      icon: SiHtml5,
      href: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    },
    {
      name: "CSS3",
      icon: SiCss,
      href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    },
    {
      name: "JavaScript",
      icon: SiJavascript,
      href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    {
      name: "TypeScript",
      icon: SiTypescript,
      href: "https://www.typescriptlang.org",
    },
    {
      name: "React",
      icon: SiReact,
      href: "https://react.dev",
    },
    {
      name: "Next.js",
      icon: SiNextdotjs,
      href: "https://nextjs.org",
    },
  ];

  const bottomRowTools: ToolItem[] = [
    {
      name: "Claude",
      icon: SiAnthropic,
      href: "https://claude.ai",
    },
    {
      name: "Gemini",
      icon: SiGooglegemini,
      href: "https://gemini.google.com",
    },
    {
      name: "Replit",
      icon: SiReplit,
      href: "https://replit.com",
    },
    {
      name: "Google",
      icon: SiGoogle,
      href: "https://google.com",
    },
    {
      name: "Cloudflare",
      icon: SiCloudflare,
      href: "https://cloudflare.com",
    },
    {
      name: "GitHub",
      icon: SiGithub,
      href: "https://github.com",
    },
  ];

  return (
    <section className="pb-28 lg:pb-32 overflow-hidden">
      <div className="container space-y-10 lg:space-y-16">
        <ScrollReveal yOffset={20} duration={0.7}>
          <div className="text-center">
            <h2 className="mb-4 text-xl text-balance md:text-2xl lg:text-3xl font-semibold">
              Powering the world's best product teams.
              <br className="max-md:hidden" />
              <span className="text-muted-foreground font-normal">
                {" "}From next-gen startups to established enterprises.
              </span>
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal yOffset={24} duration={0.8} delay={0.15}>
          <div className="flex w-full flex-col items-center gap-6 sm:gap-8">
            {/* Top row - Core Frontend & Languages */}
            <LogoRow tools={topRowTools} />

            {/* Bottom row - AI, Cloud & Developer Tools */}
            <LogoRow tools={bottomRowTools} direction="right" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

type LogoRowProps = {
  tools: ToolItem[];
  direction?: "left" | "right";
};

const LogoRow = ({ tools, direction }: LogoRowProps) => {
  return (
    <>
      {/* Desktop static version */}
      <div className="hidden md:block w-full">
        <div className="grid grid-cols-6 items-center justify-items-center gap-x-6 lg:gap-x-10 gap-y-4 w-full max-w-6xl mx-auto">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                href={tool.href}
                target="_blank"
                rel="noreferrer"
                key={index}
                className="group flex items-center justify-center gap-2.5 px-3 py-2 text-muted-foreground/75 transition-all duration-200 hover:text-foreground hover:scale-105"
              >
                <Icon className="size-5.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                <span className="text-[0.95rem] font-medium tracking-tight select-none">
                  {tool.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile marquee version */}
      <div className="md:hidden w-full">
        <Marquee direction={direction} pauseOnHover speed={32} className="py-2">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Link
                href={tool.href}
                target="_blank"
                rel="noreferrer"
                key={index}
                className="mx-4 inline-flex items-center gap-2 text-muted-foreground/80 hover:text-foreground px-2 py-1"
              >
                <Icon className="size-5 shrink-0" />
                <span className="text-sm font-medium tracking-tight select-none">
                  {tool.name}
                </span>
              </Link>
            );
          })}
        </Marquee>
      </div>
    </>
  );
};
