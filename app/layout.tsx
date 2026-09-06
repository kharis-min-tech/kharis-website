import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ScrollReveal } from "@/components/ScrollReveal";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE, siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Kharis Ministries" }],
  creator: "Kharis Phase 2",
  publisher: "Kharis Ministries",
  category: "Church",
  keywords: [
    "Kharis Phase 2",
    "KP2",
    "youth church UK",
    "Kharis Ministries",
    "David Antwi",
    "church fellowships",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: siteUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8ff" },
    { media: "(prefers-color-scheme: dark)", color: "#121014" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("kharis-theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Anton&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700&family=Hanken+Grotesk:ital,wght@0,400;0,500;0,700;0,900;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body>
        <JsonLd data={organizationJsonLd()} />
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
