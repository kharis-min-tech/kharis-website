import Page from "@/components/pages/home";
import { listBranches } from "@/lib/branches";
import { getHomeTestimonials } from "@/lib/testimonies";
import { pageMeta, SITE_DESCRIPTION } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Home",
  description: SITE_DESCRIPTION,
  path: "/",
});

export default async function Home() {
  const [testimonials, branches] = await Promise.all([
    getHomeTestimonials(),
    listBranches(),
  ]);
  const branchPins = branches.map(({ slug, name, lat, lng }) => ({ slug, name, lat, lng }));
  return <Page testimonials={testimonials} branchPins={branchPins} />;
}
