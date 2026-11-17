import { LifeExperience } from "@/components/LifeExperience";
import { LifeTunnel } from "@/components/LifeTunnel";
import { listBranches } from "@/lib/branches";
import { fetchSiteDocuments } from "@/lib/site-documents";

export default async function LifePage() {
  // The closer panel asks which branch to connect someone with, so the
  // directory is read here and passed down.
  const [branches, documents] = await Promise.all([listBranches(), fetchSiteDocuments()]);
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
      <LifeExperience
        branches={branches.map((b) => ({ id: b.id, name: b.name }))}
        fastingDownloads={fastingDownloads}
      />
    </>
  );
}
