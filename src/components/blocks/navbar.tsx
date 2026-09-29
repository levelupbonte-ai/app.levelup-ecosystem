"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { Logo, LogoStar } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    label: "Services",
    href: "/services",
    dropdownItems: [
      {
        title: "Local Business & 24/7 Booking",
        href: "/services#local-business",
        description:
          "Fast, mobile-optimized sites with automated calendar sync for barbershops, salons, and clinics.",
      },
      {
        title: "Creator & Portfolio Websites",
        href: "/services#creators",
        description:
          "High-converting personal branding, portfolio decks, and custom digital storefronts.",
      },
      {
        title: "Website Security Check",
        href: "/services#security",
        description:
          "Plain-English technical audit of database rules, HTTPS, API keys, and account 2FA.",
      },
      {
        title: "Monthly Care Plans ($49/mo)",
        href: "/services#care-plans",
        description:
          "Managed cloud hosting, daily automated snapshots, uptime monitoring, and quick edits.",
      },
    ],
  },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

/**
 * Clean, neutral typography identical to the footer at the bottom of the site,
 * but scaled down to fit perfectly in the top header.
 */
function FooterStyleLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center leading-[0.88] select-none text-left tracking-tight group transition-transform hover:scale-[1.02]",
        className,
      )}
    >
      <span className="text-[19px] lg:text-[21px] font-black tracking-tight text-foreground font-sans">
        LevelUp
      </span>
      <span className="text-[13px] lg:text-[14px] font-black tracking-tight text-foreground/60 dark:text-foreground/55 font-sans -mt-0.5">
        Ecosystem
      </span>
    </div>
  );
}

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
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
          setOpenDropdown(null);
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
            setOpenDropdown(null);
          }}
          aria-hidden="true"
        />
      )}

      {/* Top seamless gradient fade - only visible on mobile or when scrolled on desktop */}
      <div
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-[80] h-28 sm:h-32 bg-[linear-gradient(to_bottom,var(--background)_0%,var(--background)_58%,transparent_100%)] transition-opacity duration-300",
          !isScrolled ? "max-lg:opacity-100 lg:opacity-0" : "opacity-100",
        )}
        aria-hidden="true"
      />

      <header
        ref={headerRef}
        className={cn(
          "fixed left-1/2 z-[100] -translate-x-1/2 transition-all duration-300 ease-out",
          // Mobile styles: always compact floating pill
          "max-lg:top-4 max-lg:w-[min(90%,720px)] max-lg:rounded-4xl max-lg:border max-lg:border-border/80 max-lg:bg-background/85 max-lg:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:max-lg:shadow-[0_8px_30px_rgb(0,0,0,0.35)] max-lg:backdrop-blur-md",
          // Desktop styles:
          // When at the very top: full-width transparent header without container box
          // When scrolled: smoothly morphs into generous wide floating pill (not too short)
          isScrolled
            ? "lg:top-5 lg:w-[min(92%,1060px)] lg:rounded-full lg:border lg:border-border/80 lg:bg-background/85 lg:shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:lg:shadow-[0_8px_30px_rgb(0,0,0,0.4)] lg:backdrop-blur-md lg:py-2.5 lg:px-6"
            : "lg:top-0 lg:w-full lg:max-w-7xl lg:rounded-none lg:border-transparent lg:bg-transparent lg:shadow-none lg:backdrop-blur-none lg:py-6 lg:px-8 xl:px-12",
        )}
      >
        <div className="flex items-center justify-between px-6 py-3 lg:p-0">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center select-none"
            onClick={() => {
              setIsMenuOpen(false);
              setOpenDropdown(null);
            }}
          >
            {/* Mobile Logo: Star */}
            <div className="lg:hidden">
              <Logo />
            </div>

            {/* Desktop Logo:
                At the top: Clean, neutral "LevelUp Ecosystem" typography like the bottom of the site (small, no star).
                When scrolled: "LevelUp Ecosystem" text disappears to leave room for the star icon. */}
            <div className="max-lg:hidden flex items-center">
              {isScrolled ? (
                <div className="transition-all duration-200 animate-in fade-in zoom-in-95">
                  <LogoStar iconClassName="size-8" />
                </div>
              ) : (
                <div className="transition-all duration-200 animate-in fade-in">
                  <FooterStyleLogo />
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Navigation Links:
              Exact same items, classification, and dropdown behavior in both top and scrolled states */}
          <div className="max-lg:hidden flex items-center">
            <NavigationMenu className="transition-all duration-200">
              <NavigationMenuList
                className={cn(
                  "gap-1 transition-all duration-200",
                  !isScrolled ? "gap-2" : "gap-1",
                )}
              >
                {ITEMS.map((link) =>
                  link.dropdownItems ? (
                    <NavigationMenuItem key={link.label}>
                      <NavigationMenuTrigger
                        className={cn(
                          "data-[state=open]:bg-accent/50 bg-transparent! font-medium transition-all duration-150 cursor-pointer",
                          !isScrolled
                            ? "px-3.5 py-2 text-sm text-foreground/90 hover:text-foreground"
                            : "px-2.5 py-1.5 text-xs lg:text-sm text-foreground/90",
                        )}
                      >
                        {link.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="w-[420px] space-y-2 p-4">
                          {link.dropdownItems.map((item) => (
                            <li key={item.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={item.href}
                                  className="group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex items-center gap-4 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none"
                                >
                                  <div className="space-y-1.5 transition-transform duration-300 group-hover:translate-x-1">
                                    <div className="text-sm leading-none font-medium">
                                      {item.title}
                                    </div>
                                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                      {item.description}
                                    </p>
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={link.label}>
                      <Link
                        href={link.href}
                        className={cn(
                          "relative bg-transparent rounded-md font-medium transition-colors select-none",
                          !isScrolled
                            ? "px-3.5 py-2 text-sm hover:text-foreground hover:bg-accent/40"
                            : "px-2.5 py-1.5 text-xs lg:text-sm hover:text-foreground hover:bg-accent/30",
                          pathname === link.href
                            ? "text-foreground font-semibold"
                            : "text-foreground/80",
                        )}
                      >
                        {link.label}
                      </Link>
                    </NavigationMenuItem>
                  ),
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Action: Clean ThemeToggle & Book Now only (no extra buttons) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Desktop "Book Now" button */}
            <div className="max-lg:hidden flex items-center">
              <Link href="/contact">
                <Button
                  size="sm"
                  className={cn(
                    "rounded-full font-semibold bg-foreground text-background hover:opacity-90 active:scale-95 transition-all shadow-xs",
                    !isScrolled ? "px-6 py-2.5 text-sm" : "px-4 py-1.5 text-xs",
                  )}
                >
                  Book Now
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
            {ITEMS.map((link) =>
              link.dropdownItems ? (
                <div key={link.label} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === link.label ? null : link.label,
                      )
                    }
                    className="text-foreground flex w-full items-center justify-between text-base font-medium cursor-pointer"
                  >
                    {link.label}
                    <ChevronRight
                      className={cn(
                        "size-4 transition-transform duration-200",
                        openDropdown === link.label ? "rotate-90" : "",
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      openDropdown === link.label
                        ? "mt-4 max-h-[1000px] opacity-100"
                        : "max-h-0 opacity-0",
                    )}
                  >
                    <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                      {link.dropdownItems.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className="group hover:bg-accent block rounded-md p-2 transition-colors"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setOpenDropdown(null);
                          }}
                        >
                          <div className="transition-transform duration-200 group-hover:translate-x-1">
                            <div className="text-foreground font-medium">
                              {item.title}
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-foreground hover:text-foreground/80 py-4 text-base font-medium transition-colors first:pt-0 last:pb-0",
                    pathname === link.href && "text-muted-foreground",
                  )}
                  onClick={() => {
                    setIsMenuOpen(false);
                    setOpenDropdown(null);
                  }}
                >
                  {link.label}
                </Link>
              ),
            )}

            {/* Mobile Action: Single clean Book Now button */}
            <div className="pt-4">
              <Link
                href="/contact"
                className="w-full block"
                onClick={() => {
                  setIsMenuOpen(false);
                  setOpenDropdown(null);
                }}
              >
                <Button className="w-full font-semibold">
                  Book Now
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};
