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
      {/* Subtle pro ambient gradient at the bottom of the site */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-96 bg-[radial-gradient(ellipse_75%_55%_at_50%_100%,rgba(147,51,234,0.09),transparent_75%)]"
        aria-hidden="true"
      />

      <div className="container space-y-3 text-center">
        <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
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

      {/* Pro Soft-Diffused LevelUp Ecosystem Watermark */}
      <div className="w-full select-none overflow-hidden pb-0 mb-0 -mb-2 mt-12 md:mt-18 lg:mt-24 pointer-events-none opacity-25 dark:opacity-30 transition-opacity [mask-image:linear-gradient(to_bottom,black_35%,transparent_96%)]">
        <svg
          viewBox="0 0 1570 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block select-none pointer-events-none filter blur-[1.5px] sm:blur-[2px] text-foreground"
        >
          {/* LevelUp - positioned above Ecosystem, pro subtle diffused watermark */}
          <text
            x="50%"
            y="150"
            textAnchor="middle"
            fill="url(#paint_levelup)"
            className="font-display font-black select-none"
            style={{
              fontSize: "205px",
              fontWeight: 900,
              letterSpacing: "-0.01em",
              fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
            }}
          >
            LevelUp
          </text>

          {/* Ecosystem - massive foundation watermark with clean letter spacing */}
          <text
            x="50%"
            y="390"
            textAnchor="middle"
            fill="url(#paint_ecosystem)"
            className="font-display font-black select-none"
            style={{
              fontSize: "295px",
              fontWeight: 900,
              letterSpacing: "0.01em",
              fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
            }}
          >
            Ecosystem
          </text>

          <defs>
            {/* LevelUp gradient */}
            <linearGradient
              id="paint_levelup"
              x1="785"
              y1="10"
              x2="785"
              y2="155"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="currentColor" stopOpacity="0.55" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.25" />
            </linearGradient>

            {/* Ecosystem gradient */}
            <linearGradient
              id="paint_ecosystem"
              x1="785"
              y1="160"
              x2="785"
              y2="400"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="currentColor" stopOpacity="0.38" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0.12" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </footer>
  );
}
