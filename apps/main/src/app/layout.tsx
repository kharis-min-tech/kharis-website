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

/* Clean Vive / Apple-like type (not bubble Quicksand) */
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kharis.org"),
  title: "Kharis Church",
  description: "Changing the world with a touch of His grace. Find a Kharis branch near you.",
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
    <html lang="en" className={sans.variable} data-site-intro="pending" suppressHydrationWarning>
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
