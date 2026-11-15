import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeToggle } from "@/components/ThemeToggle";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Cookie Policy",
  description:
    "How Kharis Phase 2 uses cookies and similar browser storage. No advertising or analytics cookies are set.",
  path: "/cookies",
});

const ROWS = [
  [
    "kharis-site-theme",
    "local storage",
    "Remembers light or dark mode. An older kharis-theme value is read if it is still there.",
    "Until you clear site data",
  ],
  [
    "kp-page-reload:…",
    "session storage",
    "Allows one automatic reload if a page fails to open",
    "Until that page loads or you close the tab",
  ],
];

export default function CookiePolicyPage() {
  return (
    <div className="bg-background text-on-surface font-body-md">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-margin-mobile pb-24 pt-28 md:px-margin-desktop md:pt-32">
        <p className="mb-4 font-label-md uppercase tracking-widest text-primary">Kharis Phase 2</p>
        <h1 className="font-display-lg text-headline-lg uppercase leading-none">Cookie policy</h1>
        <p className="mt-4 text-sm text-on-surface-variant">Last updated 10 November 2026</p>
        <div className="mt-8 space-y-4 leading-relaxed text-on-surface-variant">
          <p>
            Kharis Ministries (charity 1139291) uses a small amount of browser storage on Kharis
            Phase 2 so the site can remember a choice you made or recover a page that failed to
            open. We do not set advertising cookies, and we do not use analytics cookies such as
            Google Analytics or a Meta pixel.
          </p>
          <p>
            UK cookie rules require a consent banner before non-essential cookies. Everything we
            store ourselves is strictly necessary for a feature you are using, so this site does not
            show a consent banner.
          </p>
        </div>
        <h2 className="mt-10 font-headline-md text-headline-md uppercase">What this site stores</h2>
        <div className="mt-4 overflow-x-auto border-2 border-black">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead className="bg-surface-container">
              <tr>
                {["Name", "Where", "Why", "How long"].map((heading) => (
                  <th key={heading} className="border-b-2 border-black px-3 py-3 uppercase">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row[0]} className="align-top">
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${index}`} className="border-b border-black/20 px-3 py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-10 space-y-4 leading-relaxed text-on-surface-variant">
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">Videos</h2>
          <p>
            Sermon players use YouTube’s privacy-enhanced mode. Loading the page does not set a
            YouTube cookie. If you press play, YouTube may set its own cookies. Those cookies are
            controlled by YouTube, not by Kharis. Instagram and TikTok icons leave this site when
            you choose to open them.
          </p>
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">Forms</h2>
          <p>
            Contact, visit, newsletter, and testimony forms send what you type to our server. That
            information is not stored as a cookie on your device.
          </p>
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
            How to turn this off
          </h2>
          <p>
            You can delete this site’s data from your browser settings. Blocking storage will reset
            the theme, and a failed page will not reload itself automatically.
          </p>
          <p>
            Questions about your information can go to{" "}
            <a className="underline" href="mailto:dataprotection@kharis.org">
              dataprotection@kharis.org
            </a>
            . The wider privacy note is on the{" "}
            <Link className="underline" href="/governance#privacy">
              governance page
            </Link>
            .
          </p>
        </div>
      </article>
      <SiteFooter />
      <ThemeToggle />
    </div>
  );
}
