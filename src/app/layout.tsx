import { Inter } from "next/font/google";
import localFont from "next/font/local";

import type { Metadata } from "next";

import { Footer } from "@/components/blocks/footer";
import { Navbar } from "@/components/blocks/navbar";
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
    default: "LevelUp Ecosystem | Web Design, Online Booking & Security in San Diego",
    template: "%s | LevelUp Ecosystem",
  },
  description:
    "LevelUp Ecosystem builds fast, secure websites with 24/7 online booking, Google Maps setup, and security checks for local businesses, barbershops, salons, and creators in San Diego, CA.",
  keywords: [
    "Web design San Diego",
    "Websites for barbershops",
    "Websites for salons",
    "Online booking websites",
    "Website security check",
    "Richelieu Bonte",
    "LevelUp Ecosystem",
    "San Diego local SEO",
    "Website care plans",
    "LevelStudio",
    "Fast mobile web development",
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
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon.ico" },
    ],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "LevelUp Ecosystem | Web Design, Online Booking & Security in San Diego",
    description:
      "LevelUp Ecosystem builds fast, secure websites with 24/7 online booking, Google Maps setup, and security checks for local businesses, barbershops, salons, and creators in San Diego, CA.",
    siteName: "LevelUp Ecosystem",
    url: "https://levelup-ecosystem.com",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/projects/final-stop.png",
        width: 1200,
        height: 630,
        alt: "LevelUp Ecosystem - Web Design, Online Booking & Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LevelUp Ecosystem | Web Design & Security in San Diego",
    description:
      "LevelUp Ecosystem builds fast, secure websites with 24/7 online booking, Google Maps setup, and security checks for local businesses in San Diego, CA. Founded by Richelieu Bonte.",
    images: ["/projects/final-stop.png"],
    creator: "@levelupecosystem",
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": "https://levelup-ecosystem.com/#org",
      name: "LevelUp Ecosystem",
      url: "https://levelup-ecosystem.com",
      description:
        "LevelUp Ecosystem is an independent web design and development studio that builds fast, secure websites with 24/7 online booking for local businesses, creators, and portfolios in San Diego, California.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "San Diego",
        addressRegion: "CA",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "City", name: "San Diego" },
        { "@type": "AdministrativeArea", name: "California" },
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
        "Web Design",
        "Cybersecurity",
        "Local SEO",
        "Online Appointment Booking",
        "Web Application Hardening",
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
