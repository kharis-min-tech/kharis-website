import { Suspense } from "react";
import { LifeExperience } from "@/components/LifeExperience";
import { findPastorMessage } from "@/lib/youtube";

export default async function LifePage() {
  const baptismMessage = await findPastorMessage(["baptism"], [
    "newness of life",
    "saving power",
    "mercy, repentance",
  ]);

  return (
    <Suspense fallback={null}>
      <LifeExperience baptismVideoId={baptismMessage?.id} />
    </Suspense>
  );
}
