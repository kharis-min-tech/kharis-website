import Page from "@/components/pages/events";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Events at Kharis Phase 2",
  description:
    "Bring A Soul Sunday, Sports Day, Praise Night and Camp: the moments that make the KP2 year.",
  path: "/events",
});

export default function Events() {
  return <Page />;
}
