import type { Metadata } from "next";
import { StudioFrame } from "@/components/studio/studio-frame";
import { StudioToaster } from "@/components/studio/toaster";
import { ThemeToggle } from "@/components/studio/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kharis Content Studio",
    template: "%s · Content Studio",
  },
  description: "Password-protected studio for Kharis content.",
  robots: { index: false, follow: false },
};

const themeScript = `(function(){try{if(localStorage.getItem("kharis-content-theme")==="light")document.documentElement.classList.remove("dark")}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700&family=Maven+Pro:wght@500;600;700;800;900&display=swap"
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <StudioFrame>{children}</StudioFrame>
        <ThemeToggle />
        <StudioToaster />
      </body>
    </html>
  );
}
