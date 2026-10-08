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
import { AnimatePresence, motion, type Variants } from "motion/react";

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
  { label: "Studio", href: "/studio" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/**
 * Top brand logo:
 * Uses the exact SVG wordmark from the footer at the bottom of the site (without the star),
 * rendered with high-contrast currentColor so it stays crisp in both light and dark modes.
 */
function FooterStyleHeaderLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "group relative select-none cursor-pointer transition-transform duration-300 ease-out hover:-rotate-1 hover:scale-[1.03] origin-bottom-left",
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
            <stop offset="1" stopColor="currentColor" stopOpacity="0.80" />
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

// Smooth editorial cubic-bezier curve
const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const mobileNavListVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.06,
      staggerChildren: 0.065,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const mobileWordItemVariants: Variants = {
  hidden: {
    y: "115%",
    opacity: 0,
    rotateZ: 1.5,
  },
  visible: {
    y: "0%",
    opacity: 1,
    rotateZ: 0,
    transition: {
      duration: 0.52,
      ease: EASE_OUT_EXPO,
    },
  },
  exit: {
    y: "60%",
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const mobileDividerVariants: Variants = {
  hidden: {
    scaleX: 0,
    opacity: 0,
  },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: EASE_OUT_EXPO,
    },
  },
  exit: {
    scaleX: 0,
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

const mobileActionsVariants: Variants = {
  hidden: {
    y: 16,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.48,
      ease: EASE_OUT_EXPO,
    },
  },
  exit: {
    y: 10,
    opacity: 0,
    transition: {
      duration: 0.18,
    },
  },
};

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // Keep header visible and only hide gracefully after deep scroll (> 380px)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY <= 60) {
        setIsScrolled(false);
        setShowHeader(true);
      } else {
        setIsScrolled(true);

        // Directional scroll: only hide when scrolled well past hero (> 380px) and scrolling downwards decisively
        if (currentScrollY > 380 && currentScrollY > lastScrollY + 16) {
          setShowHeader(false);
        } else if (currentScrollY < lastScrollY - 8) {
          setShowHeader(true);
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

  // On standalone digital project showcase pages (e.g. /projects/blackpater, /projects/wedding-invitation, /start-project),
  // hide the root navbar completely so the project retains 100% control of its own interface.
  if (
    pathname &&
    (pathname.startsWith("/projects/") ||
      pathname.startsWith("/project/") ||
      pathname === "/retrouvailles" ||
      pathname.startsWith("/start-project"))
  ) {
    const segments = pathname.split("/").filter(Boolean);
    // If there is an ID/slug after "projects" or "project", or if it's /start-project, it is a dedicated space
    if (
      segments.length >= 2 ||
      pathname === "/retrouvailles" ||
      pathname.startsWith("/start-project")
    ) {
      return null;
    }
  }

  return (
    <>
      {/* Full-screen backdrop for mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
            className="fixed inset-0 z-[95] bg-black/45 backdrop-blur-xs lg:hidden cursor-pointer"
            onClick={() => {
              setIsMenuOpen(false);
              setOpenMobileDropdown(null);
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <header
        ref={headerRef}
        onMouseEnter={handleHeaderEnter}
        onMouseLeave={handleHeaderLeave}
        className={cn(
          "fixed left-1/2 z-[100] -translate-x-1/2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          // Directional scroll behavior: keep visible when mobile menu or services menu is open
          !showHeader && isScrolled && !isServicesOpen && !isMenuOpen
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
          // Mobile styles: unified header island that seamlessly expands when hamburger is clicked
          "max-lg:top-3.5 max-lg:w-[min(92%,720px)] max-lg:rounded-2xl max-lg:border max-lg:overflow-hidden",
          isMenuOpen
            ? "max-lg:border-border max-lg:bg-background/95 max-lg:backdrop-blur-2xl max-lg:shadow-[0_24px_64px_rgb(0,0,0,0.22)] dark:max-lg:shadow-[0_24px_64px_rgb(0,0,0,0.65)]"
            : "max-lg:border-border/80 max-lg:bg-background/85 max-lg:backdrop-blur-md max-lg:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:max-lg:shadow-[0_8px_30px_rgb(0,0,0,0.35)]",
        )}
      >
        <div className="flex items-center justify-between px-5 py-3 lg:p-0">
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

          {/* Desktop Navigation Links: Clean Typography, No Bubble Backgrounds */}
          <nav className="max-lg:hidden flex items-center gap-2 xl:gap-3">
            {/* Services button with mega-menu expander trigger */}
            <button
              type="button"
              onMouseEnter={handleServicesEnter}
              onClick={() => setIsServicesOpen((prev) => !prev)}
              className={cn(
                "group relative inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer select-none",
                isServicesOpen || pathname === "/services"
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <SpringNavText text="Services" isActive={isServicesOpen || pathname === "/services"} />
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform duration-200 opacity-70 group-hover:opacity-100",
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
                    "group relative inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-colors duration-200 select-none",
                    isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <SpringNavText text={link.label} isActive={isActive} />
                </Link>
              );
            })}
          </nav>

          {/* Right Action: ThemeToggle + Book Now + Login directly after */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />

            {/* Desktop Action Buttons: Start a Project then Login */}
            <div className="max-lg:hidden flex items-center gap-2">
              <Link href="/start-project" onClick={() => setIsServicesOpen(false)}>
                <Button
                  size="sm"
                  className={cn(
                    "font-semibold bg-foreground text-background hover:opacity-90 active:scale-95 transition-all shadow-xs rounded-lg",
                    !isScrolled && !isServicesOpen ? "px-5 py-2 text-sm" : "px-4 py-1.5 text-xs",
                  )}
                >
                  Build a Project
                </Button>
              </Link>

              {/* Login button right after Start a Project */}
              <Link href="/login" onClick={() => setIsServicesOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "group relative font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer rounded-lg",
                    !isScrolled && !isServicesOpen ? "px-4 py-2 text-sm" : "px-3 py-1.5 text-xs",
                  )}
                >
                  <SpringNavText text="Login" />
                </Button>
              </Link>
            </div>

            {/* Hamburger Menu Button (Mobile Only) - Clean lines, no background bubble */}
            <button
              type="button"
              className="text-foreground relative flex size-9 lg:hidden cursor-pointer items-center justify-center bg-transparent hover:opacity-80 transition-opacity duration-200"
              onClick={() => {
                setIsMenuOpen((prev) => {
                  const next = !prev;
                  if (!next) setOpenMobileDropdown(null);
                  return next;
                });
              }}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-[18px] h-[14px]">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 block h-[1.5px] w-full bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isMenuOpen ? "top-[6px] rotate-45" : "top-0 rotate-0",
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 top-[6px] block h-[1.5px] bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isMenuOpen ? "w-0 opacity-0 translate-x-2" : "w-full opacity-100 translate-x-0",
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 block h-[1.5px] w-full bg-current rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    isMenuOpen ? "top-[6px] -rotate-45" : "top-[12px] rotate-0",
                  )}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Expanding Mega Header for Services */}
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
                  className="group relative flex flex-col p-3 rounded-lg hover:bg-muted/40 transition-colors select-none"
                >
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <Icon className="size-4 text-foreground/80 group-hover:text-foreground transition-colors shrink-0" />
                    <h3 className="text-sm font-semibold text-foreground leading-snug">
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

        {/* Unified Mobile Navigation Panel - Merged inside the same <header> container, no scrollbar, no numbers */}
        <AnimatePresence initial={false}>
          {isMenuOpen && (
            <motion.div
              key="unified-mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: { duration: 0.42, ease: EASE_OUT_EXPO },
                  opacity: { duration: 0.25, ease: "easeOut" },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.18, ease: "easeIn" },
                },
              }}
              className="lg:hidden overflow-hidden"
            >
              <div className="px-5 pb-5 pt-1 max-h-[calc(100dvh-5.5rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {/* Animated top separator blending header bar & nav items */}
                <motion.div
                  variants={mobileDividerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="h-px w-full bg-border/60 origin-left mb-1.5"
                />

                <motion.nav
                  variants={mobileNavListVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col"
                >
                  {/* Services Item (with expandable sub-items) */}
                  <div className="border-b border-border/50 py-0.5">
                    <div className="overflow-hidden">
                      <motion.div variants={mobileWordItemVariants}>
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMobileDropdown(
                              openMobileDropdown === "Services" ? null : "Services",
                            )
                          }
                          className="group flex w-full items-center justify-between py-2 text-left cursor-pointer select-none"
                        >
                          <span className="text-lg font-bold tracking-tight text-foreground group-hover:translate-x-1 transition-transform duration-200">
                            Services
                          </span>
                          <ChevronRight
                            className={cn(
                              "size-4 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                              openMobileDropdown === "Services"
                                ? "rotate-90 text-foreground"
                                : "",
                            )}
                          />
                        </button>
                      </motion.div>
                    </div>

                    <AnimatePresence initial={false}>
                      {openMobileDropdown === "Services" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                            transition: {
                              height: { duration: 0.34, ease: EASE_OUT_EXPO },
                              opacity: { duration: 0.24 },
                            },
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                            transition: {
                              height: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
                              opacity: { duration: 0.15 },
                            },
                          }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={{
                              hidden: {},
                              visible: {
                                transition: {
                                  staggerChildren: 0.045,
                                  delayChildren: 0.03,
                                },
                              },
                            }}
                            className="pl-3.5 pr-1 pb-2.5 pt-1 space-y-1.5 border-l border-border/70 ml-1 my-1"
                          >
                            {SERVICES_ITEMS.map((item) => {
                              const Icon = item.icon;
                              return (
                                <motion.div
                                  key={item.title}
                                  variants={{
                                    hidden: { y: 10, opacity: 0 },
                                    visible: {
                                      y: 0,
                                      opacity: 1,
                                      transition: {
                                        duration: 0.35,
                                        ease: EASE_OUT_EXPO,
                                      },
                                    },
                                  }}
                                >
                                  <Link
                                    href={item.href}
                                    className="group block py-1 rounded-lg transition-colors"
                                    onClick={() => {
                                      setIsMenuOpen(false);
                                      setOpenMobileDropdown(null);
                                    }}
                                  >
                                    <div className="flex items-center gap-2 text-foreground text-sm font-semibold group-hover:translate-x-0.5 transition-transform">
                                      <Icon className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                                      <span>{item.title}</span>
                                    </div>
                                    <p className="text-muted-foreground text-xs leading-snug mt-0.5 pl-5.5 line-clamp-1">
                                      {item.description}
                                    </p>
                                  </Link>
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* One-by-one Staggered Navigation Words (Projects, About, Pricing, FAQ, Contact) */}
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <div
                        key={link.label}
                        className="border-b border-border/50 py-0.5 last:border-b-0"
                      >
                        <div className="overflow-hidden">
                          <motion.div variants={mobileWordItemVariants}>
                            <Link
                              href={link.href}
                              className={cn(
                                "group flex items-center justify-between py-2 transition-colors select-none",
                                isActive
                                  ? "text-foreground"
                                  : "text-foreground/90 hover:text-foreground",
                              )}
                              onClick={() => {
                                setIsMenuOpen(false);
                                setOpenMobileDropdown(null);
                              }}
                            >
                              <span
                                className={cn(
                                  "text-lg tracking-tight transition-transform duration-200 group-hover:translate-x-1",
                                  isActive ? "font-extrabold" : "font-bold",
                                )}
                              >
                                {link.label}
                              </span>
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Staggered Bottom CTA Buttons */}
                  <motion.div
                    variants={mobileActionsVariants}
                    className="pt-3.5 mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-border/50"
                  >
                    <Link
                      href="/start-project"
                      className="w-full block"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setOpenMobileDropdown(null);
                      }}
                    >
                      <Button className="w-full font-semibold rounded-xl h-10">
                        Build a Project
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
                      <Button
                        variant="outline"
                        className="w-full font-medium rounded-xl h-10"
                      >
                        Sign In to LevelStudio
                      </Button>
                    </Link>
                  </motion.div>
                </motion.nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
