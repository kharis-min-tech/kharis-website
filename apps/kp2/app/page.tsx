import Page from "@/components/pages/home";
import { listBranches } from "@/lib/branches";
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
  const [testimonials, messages, branches] = await Promise.all([
    getHomeTestimonials(),
    fetchLatestMessages(4),
    listBranches(),
  ]);
  const branchPins = branches.map(({ slug, name, lat, lng }) => ({ slug, name, lat, lng }));
  return <Page testimonials={testimonials} messages={messages} branchPins={branchPins} />;
}
