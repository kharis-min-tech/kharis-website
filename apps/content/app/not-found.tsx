import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="font-heading text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">That section is not in the studio.</p>
      <Link href="/" className={buttonClasses("default", "default", "mt-4")}>
        Back to workspaces
      </Link>
    </div>
  );
}
