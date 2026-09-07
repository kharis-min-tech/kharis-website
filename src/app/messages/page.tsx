import type { Metadata } from "next";
import { MessagesExperience } from "@/components/MessagesExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchLatestMessages, fetchPastorMessages } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Messages | Kharis Church",
  description:
    "Search, preview and watch Christ-centred teachings from David Antwi, and listen on every major podcast platform.",
};

export default async function MessagesPage() {
  const [latest, messages] = await Promise.all([
    fetchLatestMessages(4),
    fetchPastorMessages(120),
  ]);

  if (!messages.length && !latest.length) {
    return (
      <main className="msg-page min-h-screen">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-5 py-32 text-center text-white">
          <h1 className="text-3xl font-extrabold">Messages</h1>
          <p className="mt-4 text-white/70">Check back soon for new teachings.</p>
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
