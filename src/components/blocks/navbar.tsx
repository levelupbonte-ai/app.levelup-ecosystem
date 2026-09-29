"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { Logo } from "@/components/logo";
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
    label: "Features",
    href: "#features",
    dropdownItems: [
      {
        title: "Modern product teams",
        href: "/#feature-modern-teams",
        description:
          "LevelUp is built on the habits that make the best product teams successful",
      },
      {
        title: "Resource Allocation",
        href: "/#resource-allocation",
        description: "LevelUp your resource allocation and execution",
      },
    ],
  },
  { label: "About Us", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  // Close mobile menu whenever clicking or tapping outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        isMenuOpen &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
        setOpenDropdown(null);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
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
      {/* Full-screen backdrop: Clicking ANYWHERE outside the menu closes it immediately */}
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

      {/* Top seamless gradient fade: 100% opaque behind the header so content NEVER bleeds through, fading smoothly below */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-32 sm:h-36 bg-[linear-gradient(to_bottom,var(--background)_0%,var(--background)_58%,transparent_100%)]"
        aria-hidden="true"
      />

      <header
        ref={headerRef}
        className={cn(
          "bg-background/85 fixed left-1/2 z-[100] w-[min(90%,720px)] -translate-x-1/2 rounded-4xl border border-border/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)] backdrop-blur-md transition-all duration-300",
          "top-4 lg:top-6",
        )}
      >
        <div className="flex items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            onClick={() => {
              setIsMenuOpen(false);
              setOpenDropdown(null);
            }}
          >
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="max-lg:hidden">
            <NavigationMenuList>
              {ITEMS.map((link) =>
                link.dropdownItems ? (
                  <NavigationMenuItem key={link.label} className="">
                    <NavigationMenuTrigger className="data-[state=open]:bg-accent/50 bg-transparent! px-1.5">
                      {link.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="w-[400px] space-y-2 p-4">
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
                  <NavigationMenuItem key={link.label} className="">
                    <Link
                      href={link.href}
                      className={cn(
                        "relative bg-transparent px-1.5 text-sm font-medium transition-opacity hover:opacity-75",
                        pathname === link.href && "text-muted-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  </NavigationMenuItem>
                ),
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2.5">
            <Link href="/login" className="max-lg:hidden">
              <Button variant="outline">
                <span className="relative z-10">Login</span>
              </Button>
            </Link>

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

            {/* Mobile Login Link */}
            <div className="pt-4">
              <Link
                href="/login"
                className="w-full block"
                onClick={() => {
                  setIsMenuOpen(false);
                  setOpenDropdown(null);
                }}
              >
                <Button variant="outline" className="w-full">
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
