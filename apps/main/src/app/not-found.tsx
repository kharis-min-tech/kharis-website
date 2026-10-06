import { NotFoundExperience } from "@/components/NotFoundExperience";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <main className="site-page not-found-page text-fg">
      <SiteHeader />
      <NotFoundExperience />
      <SiteFooter />
    </main>
  );
}
