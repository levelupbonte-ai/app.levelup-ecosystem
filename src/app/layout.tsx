import { Inter } from "next/font/google";
import localFont from "next/font/local";

import type { Metadata } from "next";

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
import "@/styles/globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://levelup-ecosystem.com"),
  title: {
    default: "LevelUp Ecosystem | Full-Stack Web Development, Booking Systems & Security",
    template: "%s | LevelUp Ecosystem",
  },
  description:
    "LevelUp Ecosystem engineers high-speed, secure full-stack web applications, 24/7 online booking systems, bespoke digital experiences, and cybersecurity audits for ambitious brands, companies, and creators nationwide and worldwide.",
  keywords: [
    "Full-stack web engineering studio",
    "International web development",
    "Next.js web applications",
    "Websites with 24/7 online booking",
    "Bespoke digital platforms",
    "Luxury wedding invitation website",
    "Digital event invitation and RSVP",
    "Website security audit and hardening",
    "Richelieu Bonte",
    "LevelUp Ecosystem",
    "Global & national SEO architecture",
    "Cloud infrastructure care plans",
    "LevelStudio",
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
  icons: {
    icon: [
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/web-app-manifest-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: [{ url: "/favicon.ico" }],
  },
  openGraph: {
    title: "LevelUp Ecosystem | Full-Stack Web Engineering, Booking Systems & Security",
    description:
      "LevelUp Ecosystem engineers high-speed, secure full-stack web platforms with 24/7 online booking, bespoke digital invitations, and cybersecurity audits for clients nationwide and worldwide.",
    siteName: "LevelUp Ecosystem",
    url: "https://levelup-ecosystem.com",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LevelUp Ecosystem - Full-Stack Web Engineering, Booking Systems & Security",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LevelUp Ecosystem | Full-Stack Web Development & Security",
    description:
      "Fast, secure full-stack websites with 24/7 online booking and cybersecurity audits for clients nationwide and worldwide. Founded by Richelieu Bonte.",
    images: ["/og-image.jpg"],
    creator: "@levelupecosystem",
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://levelup-ecosystem.com/#website",
      url: "https://levelup-ecosystem.com",
      name: "LevelUp Ecosystem",
      description:
        "Full-stack web engineering, 24/7 online appointment booking platforms, bespoke event digital experiences, and cybersecurity audits.",
      publisher: {
        "@id": "https://levelup-ecosystem.com/#org",
      },
      hasPart: [
        {
          "@type": "WebPage",
          "@id": "https://levelup-ecosystem.com/services",
          name: "Web Services & Solutions",
          url: "https://levelup-ecosystem.com/services",
          description:
            "Local business websites with 24/7 booking, creator platforms, security audits, and monthly managed care plans.",
        },
        {
          "@type": "WebPage",
          "@id": "https://levelup-ecosystem.com/projects",
          name: "Projects & Client Case Studies",
          url: "https://levelup-ecosystem.com/projects",
          description:
            "Case studies including Final Stop Barber Shop, bespoke digital wedding invitations, and prototype architectures.",
        },
        {
          "@type": "WebPage",
          "@id": "https://levelup-ecosystem.com/pricing",
          name: "Transparent Pricing & Care Plans",
          url: "https://levelup-ecosystem.com/pricing",
          description:
            "Website packages, 24-48h free mobile previews, and $49/mo high-speed care plans.",
        },
        {
          "@type": "WebPage",
          "@id": "https://levelup-ecosystem.com/about",
          name: "About LevelUp Ecosystem",
          url: "https://levelup-ecosystem.com/about",
          description:
            "Engineering philosophy, cybersecurity principles, and founder story of Richelieu Bonte.",
        },
        {
          "@type": "WebPage",
          "@id": "https://levelup-ecosystem.com/faq",
          name: "Frequently Asked Questions",
          url: "https://levelup-ecosystem.com/faq",
          description:
            "Answers about free mobile previews, Google Maps local ranking, turnaround times, and website ownership.",
        },
        {
          "@type": "WebPage",
          "@id": "https://levelup-ecosystem.com/contact",
          name: "Contact & Free Preview Request",
          url: "https://levelup-ecosystem.com/contact",
          description:
            "Request a free functional mobile preview in 24 to 48 hours with zero financial commitment.",
        },
        {
          "@type": "WebPage",
          "@id": "https://levelup-ecosystem.com/studio",
          name: "LevelStudio — AI Website Builder",
          url: "https://levelup-ecosystem.com/studio",
          description:
            "Turn a one-line brief into a real website draft with AI-guided questions and live preview.",
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
          description: "Full-stack development, 24/7 booking, security checks, and monthly care plans.",
          url: "https://levelup-ecosystem.com/services",
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "Projects",
          description: "Live client projects, digital wedding experiences, and case studies.",
          url: "https://levelup-ecosystem.com/projects",
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "Pricing",
          description: "Clear fixed pricing, free 24-48h mobile previews, and $49/mo care plans.",
          url: "https://levelup-ecosystem.com/pricing",
        },
        {
          "@type": "SiteNavigationElement",
          position: 4,
          name: "About",
          description: "Our engineering approach, cybersecurity background, and founder bio.",
          url: "https://levelup-ecosystem.com/about",
        },
        {
          "@type": "SiteNavigationElement",
          position: 5,
          name: "FAQ",
          description: "Common questions about turnaround, ownership, and local SEO.",
          url: "https://levelup-ecosystem.com/faq",
        },
        {
          "@type": "SiteNavigationElement",
          position: 6,
          name: "LevelStudio",
          description: "AI website builder: from a one-line brief to a live website draft.",
          url: "https://levelup-ecosystem.com/studio",
        },
        {
          "@type": "SiteNavigationElement",
          position: 7,
          name: "Start a Project",
          description: "Tell us about your project and get a functional mobile preview in 24-48 hours.",
          url: "https://levelup-ecosystem.com/start-project",
        },
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://levelup-ecosystem.com/#org",
      name: "LevelUp Ecosystem",
      url: "https://levelup-ecosystem.com",
      logo: "https://levelup-ecosystem.com/logo.svg",
      image: "https://levelup-ecosystem.com/og-image.jpg",
      description:
        "LevelUp Ecosystem is an international full-stack web engineering and cybersecurity studio. We build high-speed websites, 24/7 online booking systems, bespoke digital invitations, and secure cloud architectures for businesses, brands, and creators nationwide and worldwide.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Diego",
        addressRegion: "CA",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "Place", name: "Global / Worldwide" },
        { "@type": "Country", name: "United States" },
        { "@type": "AdministrativeArea", name: "California" },
        { "@type": "City", name: "San Diego" },
      ],
      serviceType: [
        "Full-Stack Web Development",
        "Next.js & React Web Applications",
        "Cybersecurity Audits & Web Hardening",
        "24/7 Online Appointment Booking Systems",
        "Bespoke Digital Wedding & Event Invitations",
        "Local & International SEO Architecture",
        "Cloud Infrastructure & Managed Website Care Plans",
      ],
      founder: {
        "@type": "Person",
        "@id": "https://levelup-ecosystem.com/about/richelieu-bonte#person",
        name: "Richelieu Bonte",
        jobTitle: "Founder & Principal Engineer",
        url: "https://levelup-ecosystem.com/about/richelieu-bonte",
      },
      email: "contact@levelup-ecosystem.com",
      priceRange: "$$",
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "08:00",
          closes: "18:00",
        },
      ],
    },
    {
      "@type": "Person",
      "@id": "https://levelup-ecosystem.com/about/richelieu-bonte#person",
      name: "Richelieu Bonte",
      jobTitle: "Founder & Principal Engineer",
      worksFor: {
        "@id": "https://levelup-ecosystem.com/#org",
      },
      description:
        "Richelieu Bonte is the founder of LevelUp Ecosystem, a web design studio building secure, AI-assisted websites for local businesses and creators. He is a cybersecurity student based in San Diego, California, originally from the Democratic Republic of Congo.",
      url: "https://levelup-ecosystem.com/about/richelieu-bonte",
      knowsAbout: [
        "Full-Stack Web Development",
        "Cybersecurity",
        "Local & International SEO",
        "Online Appointment Booking",
        "Web Application Hardening",
        "Cloud Architecture",
      ],
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
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="shortcut icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
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
        className={`${dmSans.variable} ${inter.variable} antialiased`}
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
      </body>
    </html>
  );
}
