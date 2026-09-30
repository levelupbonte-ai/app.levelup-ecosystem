"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  LifeBuoy,
  Palette,
  ShieldCheck,
} from "lucide-react";

import { Logo, LogoStar } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SERVICES_ITEMS = [
  {
    title: "Local Business & 24/7 Booking",
    href: "/services#local-business",
    badge: "Most Popular",
    icon: CalendarCheck,
    description:
      "Fast, mobile-optimized sites with automated calendar sync for barbershops, salons, and clinics.",
  },
  {
    title: "Creator & Portfolio Websites",
    href: "/services#creators",
    badge: "Custom Design",
    icon: Palette,
    description:
      "High-converting personal branding, portfolio decks, and custom digital storefronts.",
  },
  {
    title: "Website Security Check",
    href: "/services#security",
    badge: "Plain-English",
    icon: ShieldCheck,
    description:
      "Plain-English technical audit of database rules, HTTPS, API keys, and account 2FA protection.",
  },
  {
    title: "Monthly Care Plans ($49/mo)",
    href: "/services#care-plans",
    badge: "Peace of Mind",
    icon: LifeBuoy,
    description:
      "Managed cloud hosting, daily automated snapshots, uptime monitoring, and fast edits.",
  },
];

const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/**
 * Top brand logo typography:
 * Clean, neutral styling inspired by the footer, with LevelUp prominently sized,
 * Ecosystem distinctively smaller yet clearly legible, and proper breathing room.
 */
function HeaderLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center select-none text-left tracking-tight group transition-transform hover:scale-[1.02]",
        className,
      )}
    >
      <span className="text-[23px] sm:text-[25px] font-black tracking-tight text-foreground font-sans leading-tight">
        LevelUp
      </span>
      <span className="text-[14px] sm:text-[15px] font-extrabold tracking-tight text-foreground/70 dark:text-foreground/60 font-sans leading-tight mt-0.5">
        Ecosystem
      </span>
    </div>
  );
}

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // Monitor scroll on desktop to toggle between top transparent bar and floating pill
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handlers for desktop expanding mega-header for services
  const handleServicesEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsServicesOpen(true);
  };

  const handleHeaderLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsServicesOpen(false);
    }, 180);
  };

  const handleHeaderEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Close mobile menu whenever clicking or tapping outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      try {
        if (!isMenuOpen || !headerRef.current) return;
        const target = event.target;
        if (
          target &&
          typeof (target as Node).nodeType === "number" &&
          !headerRef.current.contains(target as Node)
        ) {
          setIsMenuOpen(false);
          setOpenMobileDropdown(null);
        }
      } catch {
        // Ignore detached element errors
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside, {
        passive: true,
      });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Lock scroll on mobile when menu is active
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Full-screen backdrop for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-[95] bg-black/40 backdrop-blur-xs lg:hidden transition-opacity cursor-pointer"
          onClick={() => {
            setIsMenuOpen(false);
            setOpenMobileDropdown(null);
          }}
          aria-hidden="true"
        />
      )}

      {/* Top seamless gradient fade - visible on mobile or when scrolled on desktop */}
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[80] h-28 sm:h-32 bg-[linear-gradient(to_bottom,var(--background)_0%,var(--background)_58%,transparent_100%)] transition-opacity duration-300",
          !isScrolled && !isServicesOpen ? "max-lg:opacity-100 lg:opacity-0" : "opacity-100",
        )}
        aria-hidden="true"
      />

      <header
        ref={headerRef}
        onMouseEnter={handleHeaderEnter}
        onMouseLeave={handleHeaderLeave}
        className={cn(
          "fixed left-1/2 z-[100] -translate-x-1/2 transition-all duration-300 ease-out",
          // Mobile styles: compact floating pill
          "max-lg:top-4 max-lg:w-[min(90%,720px)] max-lg:rounded-4xl max-lg:border max-lg:border-border/80 max-lg:bg-background/85 max-lg:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:max-lg:shadow-[0_8px_30px_rgb(0,0,0,0.35)] max-lg:backdrop-blur-md",
          // Desktop Scrolled:
          isScrolled &&
            cn(
              "lg:top-5 lg:w-[min(94%,1100px)] lg:border lg:border-border/80 lg:bg-background/90 lg:backdrop-blur-md lg:shadow-[0_12px_36px_rgb(0,0,0,0.12)] dark:lg:shadow-[0_12px_36px_rgb(0,0,0,0.5)] lg:py-2.5 lg:px-6",
              isServicesOpen ? "lg:rounded-3xl" : "lg:rounded-full",
            ),
          // Desktop Unscrolled (at top):
          !isScrolled &&
            (isServicesOpen
              ? "lg:top-3 lg:w-[min(94%,1100px)] lg:rounded-3xl lg:border lg:border-border/80 lg:bg-background/95 lg:backdrop-blur-md lg:shadow-[0_16px_40px_rgb(0,0,0,0.14)] dark:lg:shadow-[0_16px_40px_rgb(0,0,0,0.55)] lg:py-4 lg:px-7"
              : "lg:top-0 lg:w-full lg:max-w-7xl lg:rounded-none lg:border-transparent lg:bg-transparent lg:shadow-none lg:backdrop-blur-none lg:py-6 lg:px-8 xl:px-12"),
        )}
      >
        <div className="flex items-center justify-between px-6 py-3 lg:p-0">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center select-none"
            onClick={() => {
              setIsMenuOpen(false);
              setOpenMobileDropdown(null);
              setIsServicesOpen(false);
            }}
          >
            {/* Mobile Logo */}
            <div className="lg:hidden">
              <Logo />
            </div>

            {/* Desktop Logo:
                - At top of page: clean, enlarged LevelUp Ecosystem without star.
                - When scrolled: smoothly disappears and gives way to the star icon. */}
            <div className="max-lg:hidden flex items-center">
              {isScrolled ? (
                <div className="transition-all duration-200 animate-in fade-in zoom-in-95">
                  <LogoStar iconClassName="size-8" />
                </div>
              ) : (
                <div className="transition-all duration-200 animate-in fade-in">
                  <HeaderLogo />
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Navigation Links with Violet Hover Bubble Effect */}
          <nav className="max-lg:hidden flex items-center gap-1 xl:gap-1.5">
            {/* Services button with mega-menu expander trigger */}
            <button
              type="button"
              onMouseEnter={handleServicesEnter}
              onClick={() => setIsServicesOpen((prev) => !prev)}
              className={cn(
                "group relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer select-none",
                isServicesOpen || pathname === "/services"
                  ? "text-violet-600 dark:text-violet-400 font-semibold"
                  : "text-foreground/85 hover:text-foreground",
              )}
            >
              {/* Violet expanding bubble */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 rounded-full bg-violet-500/15 dark:bg-violet-400/20 border border-violet-500/25 dark:border-violet-400/30 transition-all duration-200 ease-out pointer-events-none -z-10",
                  isServicesOpen || pathname === "/services"
                    ? "scale-100 opacity-100"
                    : "scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100",
                )}
              />
              <span>Services</span>
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-200 opacity-70 group-hover:opacity-100",
                  isServicesOpen && "rotate-180 text-violet-600 dark:text-violet-400 opacity-100",
                )}
              />
            </button>

            {/* Other standard nav links */}
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => {
                    // Close services expander when hovering other items
                    setIsServicesOpen(false);
                  }}
                  className={cn(
                    "group relative inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors select-none",
                    isActive
                      ? "text-violet-600 dark:text-violet-400 font-semibold"
                      : "text-foreground/85 hover:text-foreground",
                  )}
                >
                  {/* Violet expanding bubble on hover */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-0 rounded-full bg-violet-500/15 dark:bg-violet-400/20 border border-violet-500/25 dark:border-violet-400/30 transition-all duration-200 ease-out pointer-events-none -z-10",
                      isActive
                        ? "scale-100 opacity-100"
                        : "scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100",
                    )}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: ThemeToggle + Book Now + Login directly after */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />

            {/* Desktop Action Buttons: Book Now then Login */}
            <div className="max-lg:hidden flex items-center gap-2">
              <Link href="/contact" onClick={() => setIsServicesOpen(false)}>
                <Button
                  size="sm"
                  className={cn(
                    "rounded-full font-semibold bg-foreground text-background hover:opacity-90 active:scale-95 transition-all shadow-xs",
                    !isScrolled && !isServicesOpen ? "px-5 py-2 text-sm" : "px-4 py-1.5 text-xs",
                  )}
                >
                  Book Now
                </Button>
              </Link>

              {/* Login button right after Book Now */}
              <Link href="/login" onClick={() => setIsServicesOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "group relative rounded-full font-medium text-foreground/85 hover:text-foreground transition-all cursor-pointer",
                    !isScrolled && !isServicesOpen ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-violet-500/15 dark:bg-violet-400/20 border border-violet-500/25 dark:border-violet-400/30 scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 pointer-events-none -z-10"
                  />
                  <span>Login</span>
                </Button>
              </Link>
            </div>

            {/* Hamburger Menu Button (Mobile Only) */}
            <button
              className="text-muted-foreground relative flex size-8 lg:hidden cursor-pointer items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="absolute top-1/2 left-1/2 block w-[18px] -translate-x-1/2 -translate-y-1/2">
                <span
                  aria-hidden="true"
                  className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${
                    isMenuOpen ? "rotate-45" : "-translate-y-1.5"
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute block h-0.5 w-full rounded-full bg-current transition duration-500 ease-in-out ${
                    isMenuOpen ? "-rotate-45" : "translate-y-1.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Expanding Mega Header for Services:
            Spreads out the header downwards smoothly with professional grid presentation */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out max-lg:hidden",
            isServicesOpen
              ? "max-h-[380px] opacity-100 mt-4 pt-4 border-t border-border/50"
              : "max-h-0 opacity-0 mt-0 pt-0 border-t-0 pointer-events-none",
          )}
        >
          <div className="grid grid-cols-4 gap-4 px-2 pb-2">
            {SERVICES_ITEMS.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  onClick={() => setIsServicesOpen(false)}
                  className="group relative flex flex-col justify-between p-3.5 rounded-2xl border border-transparent hover:border-violet-500/25 hover:bg-violet-500/5 dark:hover:bg-violet-400/10 transition-all duration-200 select-none"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="size-9 rounded-xl bg-violet-500/15 dark:bg-violet-400/20 text-violet-600 dark:text-violet-400 flex items-center justify-center transition-transform group-hover:scale-110">
                        <Icon className="size-4.5" />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground group-hover:bg-violet-500/20 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                        {service.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1.5">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0">
                    <span>Learn more</span>
                    <ArrowRight className="size-3" />
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center justify-between px-3 py-2 mt-2 border-t border-border/40 text-xs text-muted-foreground">
            <span>Tailored web design &amp; security for San Diego businesses</span>
            <Link
              href="/services"
              onClick={() => setIsServicesOpen(false)}
              className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <span>Explore all services</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Mobile Menu Navigation Dropdown */}
        <div
          className={cn(
            "bg-background absolute inset-x-0 top-[calc(100%+0.75rem)] flex flex-col rounded-2xl border border-border/80 p-6 shadow-xl max-h-[80vh] overflow-y-auto transition-all duration-300 ease-in-out lg:hidden",
            isMenuOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-4 opacity-0 pointer-events-none",
          )}
        >
          <nav className="divide-border flex flex-1 flex-col divide-y">
            {/* Services with dropdown on mobile */}
            <div className="py-4 first:pt-0">
              <button
                onClick={() =>
                  setOpenMobileDropdown(
                    openMobileDropdown === "Services" ? null : "Services",
                  )
                }
                className="text-foreground flex w-full items-center justify-between text-base font-medium cursor-pointer"
              >
                Services
                <ChevronRight
                  className={cn(
                    "size-4 transition-transform duration-200",
                    openMobileDropdown === "Services" ? "rotate-90" : "",
                  )}
                />
              </button>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300",
                  openMobileDropdown === "Services"
                    ? "mt-4 max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0",
                )}
              >
                <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                  {SERVICES_ITEMS.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group hover:bg-accent block rounded-md p-2 transition-colors"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setOpenMobileDropdown(null);
                      }}
                    >
                      <div className="transition-transform duration-200 group-hover:translate-x-1">
                        <div className="text-foreground font-medium text-sm">
                          {item.title}
                        </div>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Standard Nav links */}
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-foreground hover:text-foreground/80 py-4 text-base font-medium transition-colors last:pb-0",
                  pathname === link.href && "text-muted-foreground",
                )}
                onClick={() => {
                  setIsMenuOpen(false);
                  setOpenMobileDropdown(null);
                }}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Actions: Book Now then Login */}
            <div className="pt-4 space-y-2">
              <Link
                href="/contact"
                className="w-full block"
                onClick={() => {
                  setIsMenuOpen(false);
                  setOpenMobileDropdown(null);
                }}
              >
                <Button className="w-full font-semibold">
                  Book Now
                </Button>
              </Link>
              <Link
                href="/login"
                className="w-full block"
                onClick={() => {
                  setIsMenuOpen(false);
                  setOpenMobileDropdown(null);
                }}
              >
                <Button variant="ghost" className="w-full font-medium">
                  Login
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};
