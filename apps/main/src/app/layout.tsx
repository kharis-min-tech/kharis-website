import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { FloatingThemeToggle } from "@/components/FloatingThemeToggle";
import { ScrollRestoration } from "@/components/ScrollRestoration";
import { SiteChat } from "@/components/SiteChat";
import { SmoothNavigation } from "@/components/SmoothNavigation";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteIntro } from "@/components/SiteIntro";
import { SITE_INTRO_BOOTSTRAP } from "@/lib/site-intro";
import "./globals.css";
import "./motion.css";
import "./mobile.css";
import "./refresh-overrides.css";
import "./department-detail.css";

/* Clean Vive / Apple-like type (not bubble Quicksand).
 * Loaded as the variable font (no `weight` key) so body copy can sit at 400
 * while headings stay at 800. The old static set started at 500, which is why
 * every paragraph on the site had to be 600 — there was nothing lighter. */
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kharis.org"),
  title: "Kharis Church",
  description: "Changing the world with a touch of His Grace. Find a Kharis branch near you.",
  other: {
    "color-scheme": "light",
  },
};

export const viewport = {
  colorScheme: "light" as const,
};

/** Public pages can be a minute old. Repeat visits skip a fresh database round trip. */
export const revalidate = 60;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={sans.variable}
      data-site-intro="pending"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SITE_INTRO_BOOTSTRAP }} />
        <noscript>
          <style>{`.site-intro{display:none!important}html[data-site-intro]{overflow:auto!important}`}</style>
        </noscript>
        <meta name="color-scheme" content="light" />
        <link rel="preconnect" href="https://cqgyiqxhpxwasogpdghx.supabase.co" />
        <link rel="preconnect" href="https://images.kharis.org" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('kharis-site-theme');var d=t==='dark'?'dark':'light';document.documentElement.dataset.theme=d;document.documentElement.style.colorScheme=d;}catch(e){document.documentElement.dataset.theme='light';document.documentElement.style.colorScheme='light';}})();`,
          }}
        />
      </head>
      <body className={`${sans.className} antialiased`}>
        <ThemeProvider>
          <ScrollRestoration />
          <SmoothNavigation />
          <SiteIntro />
          <div id="site-content">
            {children}
            <FloatingThemeToggle />
            <SiteChat />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
