import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Footer() {
  const navigation = [
    { name: "Product", href: "/#feature-modern-teams" },
    { name: "About Us", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="relative flex flex-col items-center gap-14 pt-24 pb-0 mb-0 lg:pt-32 overflow-hidden w-full">
      <div className="container space-y-3 text-center">
        <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl font-bold">
          Start your free trial today
        </h2>
        <p className="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">
          LevelUp Ecosystem is the fit-for-purpose platform for planning and building
          modern software products.
        </p>
        <div>
          <Button size="lg" className="mt-4" asChild>
            <Link href="/contact">
              Get started
            </Link>
          </Button>
        </div>
      </div>

      <nav className="container flex flex-col items-center gap-4">
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="font-medium transition-opacity hover:opacity-75"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap items-center justify-center gap-6">
          {legal.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="text-muted-foreground text-sm transition-opacity hover:opacity-75"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* LevelUp Ecosystem - Clean, crisp, neutral, no curvature, no color glow */}
      <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto px-4 select-none overflow-hidden pb-0 mb-0 -mb-2 mt-8 md:mt-12 pointer-events-none opacity-80 dark:opacity-85">
        <svg
          viewBox="0 0 1000 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block select-none pointer-events-none text-foreground"
        >
          {/* LevelUp */}
          <text
            x="50%"
            y="85"
            textAnchor="middle"
            fill="url(#paint_levelup)"
            className="font-display font-black select-none"
            style={{
              fontSize: "100px",
              fontWeight: 900,
              letterSpacing: "-0.01em",
              fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
            }}
          >
            LevelUp
          </text>

          {/* Ecosystem */}
          <text
            x="50%"
            y="198"
            textAnchor="middle"
            fill="url(#paint_ecosystem)"
            className="font-display font-black select-none"
            style={{
              fontSize: "135px",
              fontWeight: 900,
              letterSpacing: "0.01em",
              fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
            }}
          >
            Ecosystem
          </text>

          <defs>
            <linearGradient
              id="paint_levelup"
              x1="500"
              y1="10"
              x2="500"
              y2="90"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="currentColor" stopOpacity="0.85" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.45" />
            </linearGradient>

            <linearGradient
              id="paint_ecosystem"
              x1="500"
              y1="95"
              x2="500"
              y2="205"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.25" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </footer>
  );
}
