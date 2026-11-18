import { LifeExperience } from "@/components/LifeExperience";
import { LifeTunnel } from "@/components/LifeTunnel";
import { fetchSiteDocuments } from "@/lib/site-documents";

export default async function LifePage() {
  const documents = await fetchSiteDocuments();
  const fastingDownloads = {
    booklet: documents.fasting.booklet.url
      ? { title: documents.fasting.booklet.title, url: documents.fasting.booklet.url }
      : undefined,
    schedule: documents.fasting.schedule.url
      ? { title: documents.fasting.schedule.title, url: documents.fasting.schedule.url }
      : undefined,
  };
  return (
    <>
      <LifeTunnel />
      <LifeExperience fastingDownloads={fastingDownloads} />
    </>
  );
}
