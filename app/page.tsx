import Page from "@/components/pages/home";
import { getHomeTestimonials } from "@/lib/testimonies";
import { fetchLatestMessages } from "@/lib/youtube";
import { pageMeta, SITE_DESCRIPTION } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Home",
  description: SITE_DESCRIPTION,
  path: "/",
});

export default async function Home() {
  const [testimonials, messages] = await Promise.all([
    getHomeTestimonials(),
    fetchLatestMessages(5),
  ]);
  return <Page testimonials={testimonials} messages={messages} />;
}
