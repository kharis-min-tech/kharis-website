import type { Metadata } from "next";
import { SetPasswordForm } from "@/components/studio/set-password-form";

export const metadata: Metadata = {
  title: "Choose a password",
  description: "Set the password for your Kharis Content Studio account.",
  robots: { index: false, follow: false },
};

export default function SetPasswordPage() {
  return <SetPasswordForm />;
}
