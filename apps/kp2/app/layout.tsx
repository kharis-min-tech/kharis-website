import type { Metadata, Viewport } from "next";
import { Anton, Bricolage_Grotesque, Hanken_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-hanken",
  display: "swap",
});
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-bricolage",
  display: "swap",
});
const space = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-space",
  display: "swap",
});

const MATERIAL_ICONS = [
  "account_balance",
  "add",
  "alternate_email",
  "arrow_back",
  "arrow_downward",
  "arrow_forward",
  "auto_awesome",
  "calendar_add_on",
  "calendar_today",
  "campaign",
  "celebration",
  "check_circle",
  "chevron_left",
  "chevron_right",
  "close",
  "dark_mode",
  "directions_run",
  "diversity_3",
  "door_sliding",
  "download",
  "event",
  "event_busy",
  "event_repeat",
  "expand_more",
  "explore",
  "favorite",
  "format_quote",
  "graphic_eq",
  "group",
  "groups",
  "groups_2",
  "handshake",
  "home",
  "image",
  "info",
  "language",
  "light_mode",
  "lightbulb",
  "local_parking",
  "location_on",
  "lock",
  "mail",
  "menu",
  "menu_book",
  "music_note",
  "my_location",
  "near_me",
  "north_east",
  "open_in_new",
  "person",
  "phone",
  "photo_camera",
  "piano",
  "pin_drop",
  "place",
  "play_arrow",
  "play_circle",
  "podcasts",
  "prayer_times",
  "public",
  "record_voice_over",
  "remove",
  "schedule",
  "search",
  "search_off",
  "share",
  "shield_person",
  "smart_display",
  "smartphone",
  "sms",
  "theater_comedy",
  "train",
  "video_library",
  "videocam",
  "volunteer_activism",
  "waving_hand",
  "zoom_in",
].join(",");
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
    icon: "/kp2/favicon-dove.png",
    apple: "/kp2/favicon-dove.png",
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
    <html
      lang="en-GB"
      className={`${anton.variable} ${hanken.variable} ${bricolage.variable} ${space.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("kharis-theme")==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://cqgyiqxhpxwasogpdghx.supabase.co" />
        <link rel="preconnect" href="https://images.kharis.org" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=${MATERIAL_ICONS}&display=swap`}
        />
      </head>
      <body>
        <JsonLd data={organizationJsonLd()} />
        <ScrollReveal />
        {children}
        <script src="/kp2/ui-boot.js?v=8" defer></script>
      </body>
    </html>
  );
}
