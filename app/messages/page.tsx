import type { Metadata } from "next";
import Page from "@/components/pages/messages";
import { fetchPastorMessages } from "@/lib/youtube";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Messages | Kharis Phase 2",
  description: "Browse the Kharis Phase 2 message archive — recent series, teachings and moments worth replaying.",
  openGraph: {
    title: "Messages | Kharis Phase 2",
    description: "Browse the Kharis Phase 2 message archive — recent series, teachings and moments worth replaying.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default async function Messages() {
  const messages = await fetchPastorMessages(18);
  return <Page messages={messages} />;
}
