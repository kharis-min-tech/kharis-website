import type { Metadata, Viewport } from "next";
import { Anton, Bricolage_Grotesque, Hanken_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import "./refinements.css";
import "./grace-chat.css";
import { GraceChat } from "@/components/GraceChat";
import { KpIntro } from "@/components/KpIntro";

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
  "apps",
  "arrow_back",
  "arrow_downward",
  "arrow_drop_down",
  "arrow_forward",
  "arrow_right",
  "auto_awesome",
  "auto_stories",
  "calendar_add_on",
  "campaign",
  "celebration",
  "check",
  "check_circle",
  "chevron_left",
  "chevron_right",
  "church",
  "close",
  "credit_card",
  "dark_mode",
  "database",
  "directions_run",
  "diversity_3",
  "door_sliding",
  "download",
  "emoji_events",
  "error",
  "event",
  "event_busy",
  "event_repeat",
  "expand_more",
  "explore",
  "favorite",
  "flight",
  "format_quote",
  "graphic_eq",
  "grid_view",
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
  "local_fire_department",
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
  "pause",
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
  "psychology_alt",
  "public",
  "quiz",
  "record_voice_over",
  "redeem",
  "remove",
  "restart_alt",
  "schedule",
  "search",
  "search_off",
  "settings",
  "share",
  "shield",
  "shield_person",
  "smart_display",
  "smartphone",
  "sms",
  "spa",
  "stars",
  "theater_comedy",
  "train",
  "video_library",
  "videocam",
  "volume_up",
  "volunteer_activism",
  "waving_hand",
  "zoom_in",
].join(",");
import { PageTurn } from "@/components/PageTurn";
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
    icon: [
      { url: "/kp2/favicon-kp2-32.png", sizes: "32x32", type: "image/png" },
      { url: "/kp2/favicon-kp2.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/kp2/apple-touch-icon-kp2.png", sizes: "180x180", type: "image/png" },
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
      data-scroll-behavior="smooth"
      className={`${anton.variable} ${hanken.variable} ${bricolage.variable} ${space.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("kharis-site-theme")??localStorage.getItem("kharis-theme");if(t==="dark")document.documentElement.classList.add("dark");document.documentElement.style.colorScheme=t==="dark"?"dark":"light"}catch(e){}})();`,
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
        <KpIntro />
        <PageTurn />
        <div id="kp-site-content" tabIndex={-1}>
          {children}
        </div>
        <GraceChat />
        <script src="/kp2/ui-boot.js?v=9" defer></script>
      </body>
    </html>
  );
}
