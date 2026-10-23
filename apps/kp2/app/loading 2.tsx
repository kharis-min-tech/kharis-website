import { KpLoadingMark } from "@/components/KpIntro";

export default function Loading() {
  return (
    <div
      className="kp-route-loading"
      role="status"
      aria-label="Loading Kharis Phase 2"
      aria-busy="true"
    >
      <KpLoadingMark />
      <p>Getting things ready for you</p>
    </div>
  );
}
