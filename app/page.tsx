import Page from "@/components/pages/home";
import { getHomeTestimonials } from "@/lib/testimonies";
import { fetchLatestMessages } from "@/lib/youtube";
import { fetchInstagramPosts } from "@/lib/instagram-feed";
import { pageMeta, SITE_DESCRIPTION } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Home",
  description: SITE_DESCRIPTION,
  path: "/",
});

export default async function Home() {
  const [testimonials, messages, instagram] = await Promise.all([
    getHomeTestimonials(),
    fetchLatestMessages(5),
    fetchInstagramPosts(4),
  ]);
  return <Page testimonials={testimonials} messages={messages} instagram={instagram} />;
}
