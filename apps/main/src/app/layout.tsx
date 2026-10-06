import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { FloatingThemeToggle } from "@/components/FloatingThemeToggle";
import { ScrollToTopOnLoad } from "@/components/ScrollToTopOnLoad";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

/* Clean Vive / Apple-like type (not bubble Quicksand) */
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kharis Church",
  description:
    "Changing the world with a touch of His grace. Find a Kharis branch near you.",
  other: {
    "color-scheme": "light",
  },
};

export const viewport = {
  colorScheme: "light" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('kharis-site-theme');var d=t==='dark'?'dark':'light';document.documentElement.dataset.theme=d;document.documentElement.style.colorScheme=d;}catch(e){document.documentElement.dataset.theme='light';document.documentElement.style.colorScheme='light';}})();`,
          }}
        />
      </head>
      <body className={`${sans.className} antialiased`}>
        <ThemeProvider>
          <ScrollToTopOnLoad />
          {children}
          <FloatingThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
