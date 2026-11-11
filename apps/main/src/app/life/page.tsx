import { LifeExperience } from "@/components/LifeExperience";
import { LifeTunnel } from "@/components/LifeTunnel";
import { listBranches } from "@/lib/branches";

export default async function LifePage() {
  // The closer panel asks which branch to connect someone with, so the
  // directory is read here and passed down.
  const branches = await listBranches();
  return (
    <>
      <LifeTunnel />
      <LifeExperience branches={branches.map((b) => ({ id: b.id, name: b.name }))} />
    </>
  );
}
