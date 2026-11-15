import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./cookies.css";

export const metadata: Metadata = {
  title: "Cookie Policy | Kharis Church",
  description:
    "How Kharis Church uses cookies and similar browser storage. No advertising or analytics cookies are set.",
};

const ROWS = [
  [
    "kharis-site-theme",
    "local storage",
    "Remembers light or dark mode",
    "Until you clear site data",
  ],
  [
    "kharis-branch-theme",
    "local storage",
    "Remembers the theme on a branch page",
    "Until you clear site data",
  ],
  [
    "kharis-service-branch",
    "local storage",
    "Remembers the branch you picked for service times",
    "Until you clear site data",
  ],
  [
    "kharis-give-branch",
    "local storage",
    "Remembers the branch you picked on the giving page",
    "Until you clear site data",
  ],
  [
    "kharis:life-tunnel-seen",
    "session storage",
    "Stops the Life page intro repeating in this tab",
    "Until you close the tab",
  ],
  [
    "kharis-scroll:…",
    "session storage",
    "Keeps your place on the page after a reload",
    "Until you close the tab",
  ],
  [
    "kharis-chat-opened and kharis-chat-bounces",
    "session storage",
    "Limits how often Grace offers to chat",
    "Until you close the tab",
  ],
  [
    "kharis_grace_handoff",
    "session storage",
    "Carries a Grace conversation into the contact form",
    "Until the form is sent or you close the tab",
  ],
];

export default function CookiePolicyPage() {
  return (
    <main className="bg-bg text-fg">
      <SiteHeader tone="light" />
      <article className="cookie-policy">
        <p className="eyebrow">Kharis Church</p>
        <h1>Cookie policy</h1>
        <p className="cookie-policy__updated">Last updated 10 November 2026</p>
        <p>
          Kharis Ministries (charity 1139291) uses a small amount of browser storage on this website
          so the site can remember a choice you made or keep a page working. We do not set
          advertising cookies, and we do not use analytics cookies such as Google Analytics or a
          Meta pixel.
        </p>
        <p>
          UK cookie rules require a consent banner before non-essential cookies. Everything listed
          below is strictly necessary for a feature you are using, so this site does not show a
          consent banner.
        </p>
        <h2>What this site stores</h2>
        <div className="cookie-policy__table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Where</th>
                <th>Why</th>
                <th>How long</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${index}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2>Videos</h2>
        <p>
          Sermon players use YouTube’s privacy-enhanced mode. Loading the page does not set a
          YouTube cookie. If you press play, YouTube may set its own cookies. Those cookies are
          controlled by YouTube, not by Kharis.
        </p>
        <h2>Forms</h2>
        <p>
          Contact, visit, and testimony forms send what you type to our server. That information is
          not stored as a cookie on your device.
        </p>
        <h2>How to turn this off</h2>
        <p>
          You can delete this site’s data from your browser settings. Blocking storage will reset
          the theme, the branch you last chose, and your place on the page.
        </p>
        <p>
          Questions about your information can go to{" "}
          <a href="mailto:dataprotection@kharis.org">dataprotection@kharis.org</a>. The wider
          privacy note is on the <Link href="/governance#privacy">governance page</Link>.
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
