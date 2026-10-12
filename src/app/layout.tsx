import { Inter } from "next/font/google";
import localFont from "next/font/local";

import type { Metadata, Viewport } from "next";

import { Footer } from "@/components/blocks/footer";
import { Navbar } from "@/components/blocks/navbar";
import { CookieBanner } from "@/components/cookie-banner";
import { ErrorSensor } from "@/components/error-sensor";
import { NavigationTransition } from "@/components/navigation-transition";
import { Preloader } from "@/components/preloader";
import { ScrollProgressBar } from "@/components/scroll/scroll-progress-bar";
import { TopScrollDissolver } from "@/components/scroll/top-scroll-dissolver";
import { StyleGlideProvider } from "@/components/styleglide-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { WebAnalytics } from "@/components/web-analytics";
import "@/styles/globals.css";

import { instrumentSans, jetbrainsMono } from "./fonts";

const dmSans = localFont({
  src: [
    {
      path: "../../fonts/dm-sans/DMSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/dm-sans/DMSans-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../fonts/dm-sans/DMSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/dm-sans/DMSans-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../fonts/dm-sans/DMSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts/dm-sans/DMSans-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../fonts/dm-sans/DMSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/dm-sans/DMSans-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Android: the on-screen keyboard resizes the layout (dvh follows it), so
// fields such as the hero prompt stay above it. iOS ignores the key; pages
// that need it follow window.visualViewport instead. Zoom stays allowed.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

const SITE_DESCRIPTION =
  "LevelUp Ecosystem is an online web studio founded by Richelieu Bonte in San Diego, California. Custom websites with 24/7 online booking, Google visibility, security best practices and one client dashboard, for local businesses, brands and creators.";

export const metadata: Metadata = {
  metadataBase: new URL("https://levelup-ecosystem.com"),
  title: {
    default: "LevelUp Ecosystem | Websites, Online Booking & Google Visibility",
    template: "%s | LevelUp Ecosystem",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "LevelUp Ecosystem",
    "Online web studio",
    "Custom websites for local businesses",
    "Websites with 24/7 online booking",
    "Local SEO and Google Maps",
    "Website security check",
    "Website care plans",
    "Digital wedding invitation and RSVP",
    "LevelStudio",
    "Richelieu Bonte",
  ],
  authors: [{ name: "Richelieu Bonte - LevelUp Ecosystem" }],
  creator: "Richelieu Bonte",
  publisher: "LevelUp Ecosystem",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // One coherent favicon set (the violet LevelUp star): the .ico (16-64 px,
  // 48 px included for Google), the SVG, a 96 px PNG, the Apple touch icon
  // and the web manifest (192 / 512 px).
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48 64x64" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/favicon/site.webmanifest",
  openGraph: {
    title: "LevelUp Ecosystem | Websites, Online Booking & Google Visibility",
    description: SITE_DESCRIPTION,
    siteName: "LevelUp Ecosystem",
    url: "https://levelup-ecosystem.com",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LevelUp Ecosystem - Websites, Online Booking & Google Visibility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LevelUp Ecosystem | Websites, Online Booking & Google Visibility",
    description:
      "Custom websites with 24/7 online booking, Google visibility and security best practices. An online web studio founded by Richelieu Bonte in San Diego, California.",
    images: ["/og-image.jpg"],
    creator: "@levelupecosystem",
  },
};

// Facts only (see src/config/identity.ts): LevelUp is an online business with
// no office open to visitors, so the organization carries no street address,
// geo coordinates or opening hours, and no prices (the pricing page is the
// only source of truth for them).
const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://levelup-ecosystem.com/#website",
      url: "https://levelup-ecosystem.com",
      name: "LevelUp Ecosystem",
      description:
        "Custom websites with 24/7 online booking, Google visibility, security best practices and one client dashboard.",
      publisher: {
        "@id": "https://levelup-ecosystem.com/#org",
      },
      hasPart: [
        {
          "@type": "WebPage",
          "@id": "https://levelup-ecosystem.com/services",
          name: "Services",
          url: "https://levelup-ecosystem.com/services",
          description:
            "Websites with 24/7 online booking, creator and event pages, website security checks, and monthly care plans.",
        },
        {
          "@type": "WebPage",
          "@id": "https://levelup-ecosystem.com/projects",
          name: "Projects",
          url: "https://levelup-ecosystem.com/projects",
          description:
            "Client work, including Final Stop Barber Shop and a digital wedding invitation, and demo templates.",
        },
        {
          "@type": "WebPage",
          "@id": "https://levelup-ecosystem.com/pricing",
          name: "Pricing & Care Plans",
          url: "https://levelup-ecosystem.com/pricing",
          description:
            "Website packages, free previews and monthly care plans.",
        },
        {
          "@type": "WebPage",
          "@id": "https://levelup-ecosystem.com/about",
          name: "About LevelUp Ecosystem",
          url: "https://levelup-ecosystem.com/about",
          description:
            "Who we are, how we build with AI, and the story of founder Richelieu Bonte.",
        },
        {
          "@type": "WebPage",
          "@id": "https://levelup-ecosystem.com/faq",
          name: "Frequently Asked Questions",
          url: "https://levelup-ecosystem.com/faq",
          description:
            "Answers about free previews, local Google visibility, turnaround times, and who owns what.",
        },
        {
          "@type": "WebPage",
          "@id": "https://levelup-ecosystem.com/contact",
          name: "Contact & Free Preview Request",
          url: "https://levelup-ecosystem.com/contact",
          description:
            "Ask a question or request a free preview of your website.",
        },
        {
          "@type": "WebPage",
          "@id": "https://levelup-ecosystem.com/studio",
          name: "LevelStudio — Online AI Website Studio",
          url: "https://levelup-ecosystem.com/studio",
          description:
            "LevelUp's online AI studio: turn a one-line brief into a website draft with guided questions and a live preview.",
        },
      ],
    },
    {
      "@type": "ItemList",
      "@id": "https://levelup-ecosystem.com/#navigation",
      name: "Site Navigation Elements",
      itemListElement: [
        {
          "@type": "SiteNavigationElement",
          position: 1,
          name: "Services",
          description: "Websites, 24/7 booking, security checks, and monthly care plans.",
          url: "https://levelup-ecosystem.com/services",
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "Projects",
          description: "Client work, a digital wedding invitation, and demo templates.",
          url: "https://levelup-ecosystem.com/projects",
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "Pricing",
          description: "Fixed website prices, free previews, and monthly care plans.",
          url: "https://levelup-ecosystem.com/pricing",
        },
        {
          "@type": "SiteNavigationElement",
          position: 4,
          name: "About",
          description: "Who we are, how we build with AI, and the founder's story.",
          url: "https://levelup-ecosystem.com/about",
        },
        {
          "@type": "SiteNavigationElement",
          position: 5,
          name: "FAQ",
          description: "Common questions about turnaround, content and data ownership, and local SEO.",
          url: "https://levelup-ecosystem.com/faq",
        },
        {
          "@type": "SiteNavigationElement",
          position: 6,
          name: "LevelStudio",
          description: "Our online AI studio: from a one-line brief to a website draft.",
          url: "https://levelup-ecosystem.com/studio",
        },
        {
          "@type": "SiteNavigationElement",
          position: 7,
          name: "Start a Project",
          description: "Tell us about your project and get a free preview.",
          url: "https://levelup-ecosystem.com/start-project",
        },
      ],
    },
    {
      "@type": ["Organization", "OnlineBusiness"],
      "@id": "https://levelup-ecosystem.com/#org",
      name: "LevelUp Ecosystem",
      url: "https://levelup-ecosystem.com",
      logo: "https://levelup-ecosystem.com/logo.svg",
      image: "https://levelup-ecosystem.com/og-image.jpg",
      description:
        "LevelUp Ecosystem is an online web studio founded by Richelieu Bonte in San Diego, California. It designs, builds, hosts and maintains websites for local businesses, brands and creators: custom design, 24/7 online booking, Google visibility, security best practices and one client dashboard.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Diego",
        addressRegion: "CA",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "Country", name: "United States" },
        { "@type": "Place", name: "Worldwide (online)" },
      ],
      knowsAbout: [
        "Website design",
        "Online appointment booking",
        "Local SEO",
        "Website care plans",
      ],
      founder: {
        "@id": "https://levelup-ecosystem.com/about#founder",
      },
      email: "contact@levelup-ecosystem.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "contact@levelup-ecosystem.com",
        availableLanguage: ["English", "French"],
      },
    },
    {
      "@type": "Person",
      "@id": "https://levelup-ecosystem.com/about#founder",
      name: "Richelieu Bonte",
      jobTitle: "Founder",
      worksFor: {
        "@id": "https://levelup-ecosystem.com/#org",
      },
      description:
        "Richelieu Bonte is the founder of LevelUp Ecosystem, an online web studio based in San Diego, California. He is a first-year cybersecurity student, originally from the Democratic Republic of Congo, and builds websites with AI-assisted development: he directs AI tools, tests every page and reviews security settings before launch.",
      url: "https://levelup-ecosystem.com/about",
      homeLocation: {
        "@type": "Place",
        name: "San Diego, California",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* First visit of the session: hide the page under the intro colour before
            the first paint, so the content never flashes before the animation.
            The preloader lifts the cover; a timer guarantees it never sticks. */}
        <style
          dangerouslySetInnerHTML={{
            __html:
              "html.lu-intro body::before{content:'';position:fixed;inset:0;z-index:99998;background:#FAFAFD}html.lu-intro.dark body::before{background:#0A0A10}",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var d=document.documentElement;if(sessionStorage.getItem('levelup_preloader_intro_seen_v4')!=='true'||location.search.indexOf('intro')>-1){d.classList.add('lu-intro');setTimeout(function(){d.classList.remove('lu-intro')},4000)}}catch(e){}})();",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var o=JSON.stringify;JSON.stringify=function(v,r,s){try{return o(v,r,s);}catch(e){if(e instanceof TypeError&&String(e.message).indexOf("circular")!==-1){var seen=new WeakSet();return o(v,function(k,val){if(typeof Node!=="undefined"&&val instanceof Node){return val.nodeName||"Node";}if(typeof val==="object"&&val!==null){if(seen.has(val)){return"[Circular]";}seen.add(val);}return typeof r==="function"?r(k,val):val;},s);}throw e;};};}catch(_){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdGraph).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${inter.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ErrorSensor />
          <Preloader />
          <NavigationTransition />
          <StyleGlideProvider />
          <ScrollProgressBar />
          {/* Subtle top dissolution gradient mask that only reveals once scrolled */}
          <TopScrollDissolver />
          <Navbar />
          <main className="">{children}</main>
          <Footer />
          <CookieBanner />
        </ThemeProvider>
        {/* Cookieless analytics + speed insights (Vercel deployments only). */}
        {process.env.VERCEL ? <WebAnalytics /> : null}
      </body>
    </html>
  );
}
