import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "How Kharis Content Studio uses browser storage. Sign-in is remembered on this device. No advertising or analytics cookies are set.",
};

const ROWS = [
  [
    "kharis-content-theme",
    "local storage",
    "Remembers light or dark mode",
    "Until you clear site data",
  ],
  [
    "sb-…-auth-token",
    "local storage",
    "Keeps you signed in to Content Studio",
    "Until you sign out or clear site data",
  ],
];

export default function CookiePolicyPage() {
  return (
    <article className="mx-auto min-h-screen max-w-3xl px-4 py-16 text-foreground">
      <p className="text-sm font-semibold text-muted-foreground">Kharis Content Studio</p>
      <h1 className="mt-2 font-heading text-4xl font-extrabold tracking-tight">Cookie policy</h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated 10 November 2026</p>
      <div className="mt-8 space-y-4 leading-relaxed">
        <p>
          Kharis Ministries (charity 1139291) uses browser storage in Content Studio so staff can
          stay signed in and keep a theme choice. We do not set advertising cookies, and we do not
          use analytics cookies.
        </p>
        <p>
          UK cookie rules require a consent banner before non-essential cookies. The storage below
          is strictly necessary to sign in and to remember the theme you chose, so this studio does
          not show a consent banner.
        </p>
      </div>
      <h2 className="mt-10 font-heading text-2xl font-extrabold">What this studio stores</h2>
      <div className="mt-4 overflow-x-auto rounded-md border">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr>
              {["Name", "Where", "Why", "How long"].map((heading) => (
                <th key={heading} className="border-b px-3 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row[0]} className="align-top">
                {row.map((cell, index) => (
                  <td key={`${row[0]}-${index}`} className="border-b px-3 py-3">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-10 space-y-4 leading-relaxed">
        <h2 className="font-heading text-2xl font-extrabold">Other services</h2>
        <p>
          Signing in talks to Supabase from this browser. That is how the session above is created.
          Typefaces are loaded from Google Fonts. We do not use either connection for advertising.
          Address search and Grace run on our server after you are signed in.
        </p>
        <h2 className="font-heading text-2xl font-extrabold">How to turn this off</h2>
        <p>
          Sign out to end the studio session. You can also delete this site’s data in your browser.
          Blocking storage means you will need to sign in again on every visit, and the theme will
          reset.
        </p>
        <p>
          Questions about your information can go to{" "}
          <a className="underline" href="mailto:dataprotection@kharis.org">
            dataprotection@kharis.org
          </a>
          .
        </p>
        <p>
          <Link className="underline" href="/">
            Back to sign in
          </Link>
        </p>
      </div>
    </article>
  );
}
