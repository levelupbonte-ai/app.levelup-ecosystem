import Link from "next/link";

import {
  Activity,
  CalendarCheck,
  Compass,
  Home,
  MessageSquare,
  Palette,
  ShieldCheck,
} from "lucide-react";

import { Background } from "@/components/background";
import { LogoStar } from "@/components/logo";
import { Button } from "@/components/ui/button";

const QUICK_NAV = [
  {
    title: "Local Business & 24/7 Booking",
    href: "/services#local-business",
    icon: CalendarCheck,
    description: "Automated booking and high-converting sites for local clinics, barbers & salons.",
  },
  {
    title: "Creator & Portfolio Sites",
    href: "/services#creators",
    icon: Palette,
    description: "Personal branding, custom portfolios, and digital storefronts.",
  },
  {
    title: "Website Security Check",
    href: "/services#security",
    icon: ShieldCheck,
    description: "Plain-English audits of HTTPS, API keys, and account access protection.",
  },
  {
    title: "Monthly Care Plans ($49/mo)",
    href: "/services#care-plans",
    icon: Activity,
    description: "Managed hosting, daily backups, uptime monitoring, and fast updates.",
  },
];

export default function NotFound() {
  return (
    <Background className="min-h-screen">
      <div className="container relative z-10 flex min-h-[85vh] flex-col items-center justify-center py-20 lg:py-28 text-center">
        {/* Subtle ambient radial glow behind central hero */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] sm:size-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.12)_0%,transparent_70%)] blur-2xl -z-10"
          aria-hidden="true"
        />

        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 bg-foreground/[0.04] dark:bg-foreground/[0.06] backdrop-blur-md text-xs font-mono font-medium text-muted-foreground mb-6 select-none animate-in fade-in slide-in-from-top-4 duration-500">
          <LogoStar iconClassName="size-3.5 text-purple-500 animate-spin [animation-duration:8s]" />
          <span>Error 404 • Destination Not Found</span>
        </div>

        {/* Monumental Ethereal 404 Display */}
        <div className="relative select-none my-2">
          <span
            className="text-[110px] sm:text-[160px] md:text-[210px] font-black tracking-tighter leading-none block font-display bg-gradient-to-b from-foreground via-foreground/60 to-foreground/10 bg-clip-text text-transparent opacity-95 select-none"
            style={{
              letterSpacing: "-0.05em",
              fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
            }}
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="size-20 sm:size-28 rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-xl" />
          </div>
        </div>

        {/* Narrative Headline & Copy */}
        <div className="max-w-xl mx-auto space-y-3 mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            You've reached an uncharted coordinate.
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            The page you're trying to reach may have been upgraded, relocated, or does not exist in the LevelUp Ecosystem yet.
          </p>
        </div>

        {/* Main CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md mx-auto mb-14">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto font-semibold rounded-full px-6 flex items-center gap-2 shadow-sm"
          >
            <Link href="/">
              <Home className="size-4" />
              Return to Homepage
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto font-medium rounded-full px-6 flex items-center gap-2 border-border/80 hover:bg-foreground/[0.05]"
          >
            <Link href="/services">
              <Compass className="size-4" />
              Explore Services
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto font-medium rounded-full px-5 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <Link href="/contact">
              <MessageSquare className="size-4" />
              Contact
            </Link>
          </Button>
        </div>

        {/* Quick Directory Grid to Key Pages */}
        <div className="w-full max-w-4xl mx-auto pt-8 border-t border-border/60">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">
            Quick Navigation Across The Ecosystem
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            {QUICK_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group relative flex flex-col p-4 rounded-2xl border border-border/70 bg-card/50 hover:bg-card/90 hover:border-purple-500/40 hover:shadow-md transition-all duration-300"
                >
                  <div className="size-9 rounded-xl bg-foreground/5 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="size-4.5 text-foreground/80 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-purple-500 transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Background>
  );
}
