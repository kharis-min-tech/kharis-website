import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

export function PickWorkspace() {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
      <h1 className="font-heading text-xl font-semibold">Choose a workspace</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        This section is scoped to General, the mobile app, kharis.org, or kharis.org/kp2. Pick one
        in the sidebar.
      </p>
      <Link href="/" className={buttonClasses("default", "default", "mt-4")}>
        Back to workspaces
      </Link>
    </div>
  );
}
