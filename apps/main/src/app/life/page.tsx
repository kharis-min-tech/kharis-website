import { LifeExperience } from "@/components/LifeExperience";
import KharisTunnelHero from "@/components/ui/kharis-tunnel-hero";
import { listBranches } from "@/lib/branches";

export default async function LifePage() {
  // The closer panel asks which branch to connect someone with, so the
  // directory is read here and passed down.
  const branches = await listBranches();
  return (
    <>
      <KharisTunnelHero />
      <LifeExperience branches={branches.map((b) => ({ id: b.id, name: b.name }))} />
    </>
  );
}
