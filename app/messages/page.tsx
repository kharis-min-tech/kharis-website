import type { Metadata } from "next";
import Page from "@/components/pages/messages";

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

export default Page;
