"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { WORKSPACES } from "@/lib/workspaces";

export default function HomePage() {
  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Workspaces</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Pick where this content belongs. Kharis.org, the KP2 path, and the mobile app all read from the same studio.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {WORKSPACES.map((workspace) => (
          <Link key={workspace.id} href={`/workspace/${workspace.id}`} className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <Card className="h-full overflow-hidden transition-colors hover:bg-accent">
              <div className="h-1.5 bg-gradient-to-r from-primary to-brand-end" />
              <div className="p-5">
                <h2 className="font-heading text-xl font-semibold">{workspace.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{workspace.description}</p>
                <p className="mt-4 text-sm font-medium text-primary">Open workspace</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
