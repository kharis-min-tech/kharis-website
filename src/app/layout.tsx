import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ScrollToTopOnLoad } from "@/components/ScrollToTopOnLoad";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sans.variable}>
      <body className={`${sans.className} antialiased`}>
        <ScrollToTopOnLoad />
        {children}
      </body>
    </html>
  );
}
