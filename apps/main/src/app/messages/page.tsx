import type { Metadata } from "next";
import Link from "next/link";
import { MessagesExperience } from "@/components/MessagesExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchLatestMessages, fetchPastorMessages } from "@/lib/youtube";

// Serve a pre-rendered Messages hub and refresh it in the background so visitors
// aren't waiting for YouTube archive requests on each page load.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Messages | Kharis Church",
  description:
    "Search, preview and watch Christ-centred teachings from David Antwi, and listen on every major podcast platform.",
};

export default async function MessagesPage() {
  const [latest, messages] = await Promise.all([fetchLatestMessages(4), fetchPastorMessages(120)]);

  if (!messages.length && !latest.length) {
    return (
      <main className="msg-page min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-5 py-32 text-center text-white">
          <h1 className="text-3xl font-extrabold">Messages</h1>
          <p className="mt-4 text-white/70">
            No teachings are listed right now. Come to{" "}
            <Link href="/events" className="underline">
              Sunday service
            </Link>{" "}
            or{" "}
            <Link href="/locations" className="underline">
              find a location
            </Link>
            .
          </p>
        </div>
        <SiteFooter />
      </main>
    );
  }

  return (
    <main>
      <SiteHeader />
      <MessagesExperience messages={messages} latest={latest} />
      <div className="msg-footer-wrap">
        <SiteFooter />
      </div>
    </main>
  );
}
