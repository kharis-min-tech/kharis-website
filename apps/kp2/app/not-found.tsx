import type { Metadata } from "next";
import { MissingPage } from "../../../shared/MissingPage";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <MissingPage phaseTwo />;
}
