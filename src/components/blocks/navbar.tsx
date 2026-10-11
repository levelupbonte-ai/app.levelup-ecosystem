"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ArrowRight } from "lucide-react";

import { LoginMenu, MobileLoginChoices } from "@/components/blocks/login-menu";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { type Locale, useLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

const COPY: Record<
  Locale,
  {
    links: { label: string; href: string }[];
    cta: string;
    open: string;
    close: string;
    home: string;
    menu: string;
  }
> = {
  en: {
    links: [
      { label: "Services", href: "/services" },
      { label: "Projects", href: "/projects" },
      { label: "Studio", href: "/studio" },
      { label: "About", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
    cta: "Start a project",
    open: "Open menu",
    close: "Close menu",
    home: "LevelUp Ecosystem, home",
    menu: "Main",
  },
  fr: {
    links: [
      { label: "Services", href: "/services" },
      { label: "Projets", href: "/projects" },
      { label: "Studio", href: "/studio" },
      { label: "À propos", href: "/about" },
      { label: "Tarifs", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
    cta: "Lancer un projet",
    open: "Ouvrir le menu",
    close: "Fermer le menu",
    home: "LevelUp Ecosystem, accueil",
    menu: "Principal",
  },
};

/** Star + wordmark, as on the rest of the ecosystem. */
function Wordmark() {
  return (
    <span className="font-editorial flex items-center gap-2.5 select-none">
      <Image
        src="/icon.svg"
        alt=""
        width={28}
        height={28}
        unoptimized
        className="size-7 shrink-0"
      />
      <span className="text-foreground text-[1.4rem] leading-none tracking-[-0.03em]">
        LevelUp
      </span>
      <span className="font-label text-muted-foreground mt-1 hidden text-[11px] leading-none tracking-tight sm:inline">
        Ecosystem
      </span>
    </span>
  );
}

function isHidden(pathname: string | null) {
  if (!pathname) return false;
  if (pathname === "/retrouvailles" || pathname.startsWith("/start-project"))
    return true;
  // Dedicated project pages keep full control of their interface.
  const segments = pathname.split("/").filter(Boolean);
  return (
    (segments[0] === "projects" || segments[0] === "project") &&
    segments.length >= 2
  );
}

export const Navbar = () => {
  const locale = useLocale();
  const t = COPY[locale];
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock scroll and listen for Escape while the mobile menu is open.
  useEffect(() => {
    if (!isMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1280) setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [isMenuOpen]);

  if (isHidden(pathname)) return null;

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(`${href}/`));
  const floating = isScrolled && !isMenuOpen;

  return (
    <header className="font-editorial fixed inset-x-0 top-0 z-[100]">
      {/* Scrolled: the bar floats (transform) and its glass backdrop fades in
          (opacity). Nothing changes size, so the header never shifts layout. */}
      <div
        className={cn(
          "mx-auto max-w-[1400px] px-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-3 lg:px-6",
          floating ? "translate-y-2.5 lg:translate-y-3" : "translate-y-0",
        )}
      >
        <nav aria-label={t.menu} className="relative">
          <div
            aria-hidden="true"
            className={cn(
              "border-hairline bg-background/88 lg:bg-background/80 absolute inset-0 rounded-2xl border shadow-[0_10px_40px_-12px_rgb(0_0_0/0.18)] backdrop-blur-md transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:backdrop-blur-xl dark:shadow-[0_10px_40px_-12px_rgb(0_0_0/0.7)]",
              floating ? "scale-100 opacity-100" : "scale-[1.015] opacity-0",
            )}
          />
          <div className="relative grid h-14 grid-cols-[1fr_auto] items-center gap-4 px-2 sm:px-3 lg:h-16 lg:px-6 xl:grid-cols-[auto_1fr_auto] xl:gap-8">
            <Link
              href="/"
              aria-label={t.home}
              className="focus-visible:ring-brand/50 justify-self-start rounded-md focus-visible:ring-2 focus-visible:outline-none"
            >
              <Wordmark />
            </Link>

            {/* Desktop links, centred */}
            <ul className="hidden items-center gap-6 justify-self-center xl:flex 2xl:gap-9">
              {t.links.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group focus-visible:ring-brand/50 relative inline-flex rounded-sm py-1 text-[15px] transition-colors duration-300 focus-visible:ring-2 focus-visible:outline-none",
                        active
                          ? "text-foreground"
                          : "text-foreground/65 hover:text-foreground",
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute -bottom-0.5 left-0 h-px w-full origin-left transition-transform duration-300",
                          active
                            ? "bg-brand scale-x-100"
                            : "bg-foreground scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-1.5 justify-self-end sm:gap-2.5">
              <LanguageSwitch hint />
              <ThemeToggle className="hidden sm:flex" />
              <div className="hidden items-center gap-1 whitespace-nowrap xl:flex">
                <LoginMenu />
                <Link
                  href="/start-project"
                  className="group bg-foreground text-background focus-visible:ring-brand/50 inline-flex h-10 items-center gap-1.5 rounded-full px-5 text-sm font-medium transition-opacity duration-300 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {t.cta}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>

              {/* Mobile / tablet menu button */}
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-expanded={isMenuOpen}
                aria-controls="lu-mobile-menu"
                aria-label={isMenuOpen ? t.close : t.open}
                className="lu-press text-foreground focus-visible:ring-brand/50 relative flex size-11 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:outline-none xl:hidden"
              >
                <span className="relative block h-3 w-5" aria-hidden="true">
                  <span
                    className={cn(
                      "absolute left-0 block h-[1.5px] w-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isMenuOpen ? "top-[5px] rotate-45" : "top-0 rotate-0",
                    )}
                  />
                  <span
                    className={cn(
                      "absolute left-0 block h-[1.5px] w-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      isMenuOpen
                        ? "top-[5px] -rotate-45"
                        : "top-[10px] rotate-0",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile menu: full-screen editorial overlay */}
      <div
        id="lu-mobile-menu"
        inert={!isMenuOpen}
        aria-hidden={!isMenuOpen}
        className={cn(
          "bg-background fixed inset-0 -z-10 transition-opacity xl:hidden",
          isMenuOpen
            ? "pointer-events-auto opacity-100 duration-500"
            : "pointer-events-none opacity-0 duration-300",
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-10">
          <ul className="flex flex-1 flex-col justify-center gap-1 py-6">
            {t.links.map((link, i) => (
              <li
                key={link.href}
                className={cn(
                  "transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isMenuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0",
                )}
                style={
                  {
                    transitionDelay: isMenuOpen ? `${80 + i * 50}ms` : "0ms",
                  } as CSSProperties
                }
              >
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className="group flex items-baseline gap-4 py-1.5"
                >
                  <span className="font-label text-muted-foreground w-6 text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-[2.6rem] leading-[1.05] tracking-[-0.04em] transition-colors sm:text-6xl",
                      isActive(link.href)
                        ? "text-foreground"
                        : "text-foreground/80 group-hover:text-foreground",
                    )}
                  >
                    {link.label}
                    {isActive(link.href) ? (
                      <span className="text-brand">.</span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div
            className={cn(
              "border-hairline space-y-4 border-t pt-6 transition-[opacity,transform] duration-500",
              isMenuOpen
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
            style={{ transitionDelay: isMenuOpen ? "380ms" : "0ms" }}
          >
            <div className="flex items-center justify-between">
              <LanguageSwitch />
              <ThemeToggle />
            </div>
            <Link
              href="/start-project"
              onClick={() => setIsMenuOpen(false)}
              className="lu-press bg-foreground text-background flex h-14 items-center justify-center gap-2 rounded-full text-base font-medium"
            >
              {t.cta}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <MobileLoginChoices onSelect={() => setIsMenuOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  );
};
