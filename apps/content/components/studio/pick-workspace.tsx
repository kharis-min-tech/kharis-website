"use client";

import { Compass } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EmptyState } from "@/components/studio/blocks";
import { WORKSPACE_ICONS } from "@/components/studio/nav-meta";
import { buttonClasses } from "@/components/ui/button";
import { useStudioRole } from "@/lib/studio-role";
import { hrefWithWorkspace, workspacesForRole } from "@/lib/workspaces";

export function PickWorkspace() {
  const pathname = usePathname();
  const { role } = useStudioRole();
  const options = workspacesForRole(role).filter((workspace) =>
    workspace.nav.some((item) => item.href === pathname),
  );

  return (
    <EmptyState
      icon={Compass}
      title="Choose a workspace"
      action={
        <div className="flex flex-wrap justify-center gap-2">
          {options.length ? (
            options.map((workspace) => {
              const Icon = WORKSPACE_ICONS[workspace.id];
              return (
                <Link
                  key={workspace.id}
                  href={hrefWithWorkspace(pathname, workspace.id)}
                  className={buttonClasses("outline")}
                >
                  <Icon className="h-4 w-4 text-brand" />
                  {workspace.name}
                </Link>
              );
            })
          ) : (
            <Link href="/" className={buttonClasses()}>
              Back to overview
            </Link>
          )}
        </div>
      }
    >
      This section is scoped to General, the mobile app, kharis.org, or kharis.org/kp2. Pick where
      this content belongs.
    </EmptyState>
  );
}
