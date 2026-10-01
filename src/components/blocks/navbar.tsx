"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Activity,
  CalendarCheck,
  ChevronDown,
  ChevronRight,
  Palette,
  ShieldCheck,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SERVICES_ITEMS = [
  {
    title: "Local Business & 24/7 Booking",
    href: "/services#local-business",
    icon: CalendarCheck,
    description:
      "Fast, mobile-optimized sites with automated calendar sync for barbershops, salons, and clinics.",
  },
  {
    title: "Creator & Portfolio Websites",
    href: "/services#creators",
    icon: Palette,
    description:
      "High-converting personal branding, portfolio decks, and custom digital storefronts.",
  },
  {
    title: "Website Security Check",
    href: "/services#security",
    icon: ShieldCheck,
    description:
      "Plain-English technical audit of database rules, HTTPS, API keys, and account 2FA protection.",
  },
  {
    title: "Monthly Care Plans ($49/mo)",
    href: "/services#care-plans",
    icon: Activity,
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
 * Top brand logo:
 * Uses the exact same SVG, gradients, and font typography as the footer at the bottom of the site,
 * scaled to small size with a sleek tilt on hover.
 */
function FooterStyleHeaderLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "group relative select-none cursor-pointer transition-transform duration-300 ease-out hover:-rotate-2 hover:scale-[1.04] origin-bottom-left",
        className,
      )}
    >
      <svg
        viewBox="0 0 1000 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-28 sm:w-32 md:w-36 h-auto block select-none pointer-events-none text-foreground"
      >
        <text
          x="50%"
          y="85"
          textAnchor="middle"
          fill="url(#header_paint_levelup)"
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

        <text
          x="50%"
          y="198"
          textAnchor="middle"
          fill="url(#header_paint_ecosystem)"
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
            id="header_paint_levelup"
            x1="500"
            y1="10"
            x2="500"
            y2="90"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="currentColor" stopOpacity="0.95" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient
            id="header_paint_ecosystem"
            x1="500"
            y1="95"
            x2="500"
            y2="205"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="currentColor" stopOpacity="0.75" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.45" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/**
 * Text Fill Hover Effect with Spring Physics:
 * Physical translation on the Y-axis combined with a spring curve and refined neutral dark fill.
 */
function SpringNavText({ text, isActive }: { text: string; isActive?: boolean }) {
  return (
    <span className="relative inline-flex flex-col overflow-hidden h-[1.35em] leading-[1.35em] select-none pointer-events-none">
      <span
        className={cn(
          "inline-block transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-full",
          isActive ? "text-foreground font-semibold" : "text-foreground/80",
        )}
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        className="absolute top-full left-0 inline-block transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-full text-foreground font-semibold"
      >
        {text}
      </span>
    </span>
  );
}

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // Monitor scroll: Header disappears when arriving at "Powering the world's best product teams" zone,
  // and reappears when scrolling back up.
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Track scroll progress along the top of the window
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? (currentScrollY / totalScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      if (currentScrollY <= 45) {
        setIsScrolled(false);
        setShowHeader(true);
      } else {
        setIsScrolled(true);

        // Check if user has reached the "Powering the world's best product teams" zone
        const logosZone = document.getElementById("logos-section");
        const hasArrivedAtZone = logosZone
          ? logosZone.getBoundingClientRect().top <= 140
          : currentScrollY > 400;

        // If scrolling UP: always reveal the header fluidly
        if (currentScrollY < lastScrollYRef.current - 6) {
          setShowHeader(true);
        }
        // If scrolling DOWN:
        else if (currentScrollY > lastScrollYRef.current + 6) {
          if (hasArrivedAtZone) {
            // Arrived at the logos section -> hide header fluidly
            setShowHeader(false);
          } else {
            // Still in the hero zone -> keep header visible
            setShowHeader(true);
          }
        }
      }

      lastScrollYRef.current = currentScrollY;
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
      {/* Discreet, subtle reading / scroll progress bar along the very top of the screen */}
      <div className="fixed top-0 inset-x-0 z-[120] h-[1.5px] bg-transparent pointer-events-none">
        <div
          className="h-full bg-violet-500/35 dark:bg-violet-400/40 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

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

      {/* Top seamless gradient fade:
          - When header is hidden: keeps a short/shallow rim (h-7 sm:h-8 opacity-60) leaving full room to read
          - When header is present: smoothly expands to normal height (h-20 sm:h-24 opacity-100) */}
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[80] bg-[linear-gradient(to_bottom,var(--background)_0%,var(--background)_55%,transparent_100%)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          !showHeader && isScrolled
            ? "h-7 sm:h-8 opacity-60 translate-y-0"
            : !isScrolled && !isServicesOpen
              ? "h-20 sm:h-24 max-lg:opacity-100 lg:opacity-0 translate-y-0"
              : "h-20 sm:h-24 opacity-100 translate-y-0",
        )}
        aria-hidden="true"
      />

      <header
        ref={headerRef}
        onMouseEnter={handleHeaderEnter}
        onMouseLeave={handleHeaderLeave}
        className={cn(
          "fixed left-1/2 z-[100] -translate-x-1/2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          // Directional scroll behavior: hide header when arriving at logos zone, show immediately on scroll up
          !showHeader && isScrolled && !isServicesOpen
            ? "-translate-y-[150%] opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100",
          // Desktop Scrolled: consistent rounded-2xl to prevent any morphing or conflict
          isScrolled &&
            "lg:top-5 lg:w-[min(94%,1080px)] lg:rounded-2xl lg:border lg:border-border/80 lg:bg-background/90 lg:backdrop-blur-md lg:shadow-[0_12px_36px_rgb(0,0,0,0.1)] dark:lg:shadow-[0_12px_36px_rgb(0,0,0,0.45)] lg:py-2.5 lg:px-6",
          // Desktop Unscrolled (at top of page):
          !isScrolled &&
            (isServicesOpen
              ? "lg:top-4 lg:w-[min(94%,1080px)] lg:rounded-2xl lg:border lg:border-border/80 lg:bg-background/95 lg:backdrop-blur-md lg:shadow-[0_16px_40px_rgb(0,0,0,0.12)] dark:lg:shadow-[0_16px_40px_rgb(0,0,0,0.5)] lg:py-3.5 lg:px-6"
              : "lg:top-0 lg:w-full lg:max-w-7xl lg:rounded-none lg:border-transparent lg:bg-transparent lg:shadow-none lg:backdrop-blur-none lg:py-6 lg:px-8 xl:px-12"),
          // Mobile styles: rounded-2xl
          "max-lg:top-4 max-lg:w-[min(90%,720px)] max-lg:rounded-2xl max-lg:border max-lg:border-border/80 max-lg:bg-background/85 max-lg:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:max-lg:shadow-[0_8px_30px_rgb(0,0,0,0.35)] max-lg:backdrop-blur-md",
        )}
      >
        <div className="flex items-center justify-between px-6 py-3 lg:p-0">
          {/* Brand Logo - LevelUp Ecosystem */}
          <Link
            href="/"
            className="flex shrink-0 items-center select-none"
            onClick={() => {
              setIsMenuOpen(false);
              setOpenMobileDropdown(null);
              setIsServicesOpen(false);
            }}
          >
            <FooterStyleHeaderLogo />
          </Link>

          {/* Desktop Navigation Links with Spring Physical Shift & Dark Capsule */}
          <nav className="max-lg:hidden flex items-center gap-1 xl:gap-1.5">
            {/* Services button with mega-menu expander trigger */}
            <button
              type="button"
              onMouseEnter={handleServicesEnter}
              onClick={() => setIsServicesOpen((prev) => !prev)}
              className={cn(
                "group relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 cursor-pointer select-none",
                isServicesOpen || pathname === "/services"
                  ? "text-foreground font-semibold"
                  : "text-foreground/80 hover:text-foreground",
              )}
            >
              {/* Subtle dark spring capsule */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 rounded-full bg-foreground/[0.06] dark:bg-foreground/[0.09] border border-foreground/10 dark:border-foreground/15 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none -z-10",
                  isServicesOpen || pathname === "/services"
                    ? "scale-100 opacity-100"
                    : "scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100",
                )}
              />
              <SpringNavText text="Services" isActive={isServicesOpen || pathname === "/services"} />
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] opacity-70 group-hover:opacity-100",
                  isServicesOpen && "rotate-180 opacity-100 text-foreground",
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
                    setIsServicesOpen(false);
                  }}
                  className={cn(
                    "group relative inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 select-none",
                    isActive ? "text-foreground font-semibold" : "text-foreground/80 hover:text-foreground",
                  )}
                >
                  {/* Subtle dark spring capsule */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-0 rounded-full bg-foreground/[0.06] dark:bg-foreground/[0.09] border border-foreground/10 dark:border-foreground/15 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none -z-10",
                      isActive
                        ? "scale-100 opacity-100"
                        : "scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100",
                    )}
                  />
                  <SpringNavText text={link.label} isActive={isActive} />
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
                    "group relative rounded-full font-medium text-foreground/80 hover:text-foreground transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 cursor-pointer",
                    !isScrolled && !isServicesOpen ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-foreground/[0.06] dark:bg-foreground/[0.09] border border-foreground/10 dark:border-foreground/15 scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none -z-10"
                  />
                  <SpringNavText text="Login" />
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
            Clean presentation with rounded-2xl container when opened */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] max-lg:hidden",
            isServicesOpen
              ? "max-h-[260px] opacity-100 mt-3 pt-3 border-t border-border/50"
              : "max-h-0 opacity-0 mt-0 pt-0 border-t-0 pointer-events-none",
          )}
        >
          <div className="grid grid-cols-4 gap-3 px-1 pb-1">
            {SERVICES_ITEMS.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.title}
                  href={service.href}
                  onClick={() => setIsServicesOpen(false)}
                  className="group relative flex flex-col p-3.5 rounded-xl hover:bg-foreground/[0.04] dark:hover:bg-foreground/[0.06] transition-all duration-200 select-none"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <Icon className="size-5 text-foreground/80 group-hover:text-foreground transition-colors shrink-0" />
                    <h3 className="text-sm font-semibold text-foreground group-hover:translate-x-0.5 transition-transform leading-snug">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </Link>
              );
            })}
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
