import { Inter } from "next/font/google";
import localFont from "next/font/local";

import type { Metadata } from "next";

import { Footer } from "@/components/blocks/footer";
import { Navbar } from "@/components/blocks/navbar";
import { ErrorSensor } from "@/components/error-sensor";
import { Preloader } from "@/components/preloader";
import { ScrollProgressBar } from "@/components/scroll/scroll-progress-bar";
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
    "LevelUp Ecosystem builds high-speed, secure full-stack web applications, 24/7 online booking systems, bespoke digital invitations, and cybersecurity audits for businesses in San Diego and worldwide.",
  keywords: [
    "Full-stack web development San Diego",
    "International web design studio",
    "Next.js web development",
    "Websites with 24/7 online booking",
    "Websites for barbershops and salons",
    "Bespoke wedding invitation website San Diego",
    "Digital event invitation and RSVP",
    "Website security audit and hardening",
    "Richelieu Bonte",
    "LevelUp Ecosystem",
    "San Diego local SEO",
    "Cloud infrastructure care plans",
    "LevelStudio",
  ],
  authors: [{ name: "Richelieu Bonte - LevelUp Ecosystem" }],
  creator: "Richelieu Bonte",
  publisher: "LevelUp Ecosystem",
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
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg" },
    ],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "LevelUp Ecosystem | Full-Stack Web Engineering, Booking Systems & Security",
    description:
      "LevelUp Ecosystem builds fast, secure full-stack websites with 24/7 online booking, bespoke digital invitations, and security checks for brands in San Diego and globally.",
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
      "Fast, secure full-stack websites with 24/7 online booking and cybersecurity checks in San Diego and worldwide. Founded by Richelieu Bonte.",
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
          "@id": "https://levelup-ecosystem.com/login",
          name: "Client Workspace Sign In",
          url: "https://levelup-ecosystem.com/login",
          description:
            "Sign in to your secure LevelStudio client workspace.",
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
          name: "Client Login",
          description: "Access your LevelStudio workspace.",
          url: "https://levelup-ecosystem.com/login",
        },
        {
          "@type": "SiteNavigationElement",
          position: 7,
          name: "Book a Free Preview",
          description: "Request a functional mobile preview in 24-48 hours.",
          url: "https://levelup-ecosystem.com/contact",
        },
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://levelup-ecosystem.com/#org",
      name: "LevelUp Ecosystem",
      url: "https://levelup-ecosystem.com",
      description:
        "LevelUp Ecosystem is a full-stack web development and cybersecurity engineering studio based in San Diego, California. We build high-speed websites, 24/7 online booking systems, bespoke digital invitations, and secure cloud architectures for local businesses, nationwide brands, and international clients.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Diego",
        addressRegion: "CA",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "City", name: "San Diego" },
        { "@type": "AdministrativeArea", name: "California" },
        { "@type": "Country", name: "United States" },
        { "@type": "Place", name: "Global / Worldwide (International Remote Architecture)" },
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
      email: "hello@levelup-ecosystem.com",
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
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="shortcut icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var o=JSON.stringify;JSON.stringify=function(v,r,s){try{return o(v,r,s);}catch(e){if(e instanceof TypeError&&String(e.message).indexOf("circular")!==-1){var seen=new WeakSet();return o(v,function(k,val){if(typeof Node!=="undefined"&&val instanceof Node){return val.nodeName||"Node";}if(typeof val==="object"&&val!==null){if(seen.has(val)){return"[Circular]";}seen.add(val);}return typeof r==="function"?r(k,val):val;},s);}throw e;};};}catch(_){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
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
          <StyleGlideProvider />
          <ScrollProgressBar />
          <Navbar />
          <main className="">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
