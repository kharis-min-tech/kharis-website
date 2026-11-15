import type { Metadata } from "next";
import { StudioFrame } from "@/components/studio/studio-frame";
import { StudioToaster } from "@/components/studio/toaster";
import "./globals.css";
import "./grace-chat.css";

export const metadata: Metadata = {
  title: {
    default: "Kharis Content Studio",
    template: "%s · Content Studio",
  },
  description: "Password-protected studio for Kharis content.",
  robots: { index: false, follow: false },
};

const themeScript = `(function(){try{var t=localStorage.getItem("kharis-content-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <StudioFrame>{children}</StudioFrame>
        <StudioToaster />
      </body>
    </html>
  );
}
