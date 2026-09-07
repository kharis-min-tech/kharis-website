import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ThemeToggle } from "@/components/ThemeToggle";
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
    { media: "(prefers-color-scheme: light)", color: "#f4eee6" },
    { media: "(prefers-color-scheme: dark)", color: "#06070a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function apply(d){var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";try{localStorage.setItem("kharis-theme",d?"dark":"light")}catch(e){}var t=document.getElementById("theme-toggle");if(!t)return;t.setAttribute("aria-pressed",d?"true":"false");t.setAttribute("aria-label",d?"Switch to light mode":"Switch to dark mode");var l=t.querySelector("[data-theme-label]");var i=t.querySelector("[data-theme-icon]");if(l)l.textContent=d?"Light":"Dark";if(i)i.textContent=d?"light_mode":"dark_mode"}try{apply(localStorage.getItem("kharis-theme")==="dark")}catch(e){}document.addEventListener("click",function(e){var t=e.target&&e.target.closest&&e.target.closest("#theme-toggle");if(!t)return;e.preventDefault();apply(!document.documentElement.classList.contains("dark"))});})();`,
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
        <ThemeToggle />
        <script src="/ui-boot.js?v=4" defer />
      </body>
    </html>
  );
}
