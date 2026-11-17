"use client";

import { Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ErrorNotice, IconTile, SectionCard } from "@/components/studio/blocks";
import { TextField, ToggleField } from "@/components/studio/fields";
import { PageHeader } from "@/components/studio/page-header";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getLiveSettings, saveLiveSettings } from "@/lib/content-repo";
import type { LiveSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/lib/workspace-context";

export default function LivePage() {
  const workspace = useWorkspaceId();
  const [settings, setSettings] = useState<LiveSettings | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getLiveSettings()
      .then(setSettings)
      .catch((caught) =>
        setError(caught instanceof Error ? caught.message : "Could not load live settings."),
      );
  }, []);

  if (!workspace) return <PickWorkspace />;

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await saveLiveSettings(settings);
      toast.success("Live settings saved");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not save live settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <PageHeader
        icon={<IconTile icon={Radio} className="h-12 w-12 rounded-2xl" />}
        title="Live"
        description="The stream URL, title, and whether the app should show the broadcast as live."
      />
      {error ? <ErrorNotice message={error} /> : null}
      {settings ? (
        <SectionCard
          title="Broadcast"
          className="studio-card-enter"
          bodyClassName="p-5"
          action={
            <Badge tone={settings.isLive ? "success" : "muted"}>
              <span
                className={cn(
                  "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
                  settings.isLive ? "bg-success animate-pulse" : "bg-muted-foreground/50",
                )}
              />
              {settings.isLive ? "On air" : "Off air"}
            </Badge>
          }
        >
          <form className="space-y-4" onSubmit={onSave}>
            <TextField
              label="Title"
              value={settings.title}
              onChange={(event) => setSettings({ ...settings, title: event.target.value })}
            />
            <TextField
              label="Stream URL"
              type="url"
              value={settings.url}
              onChange={(event) => setSettings({ ...settings, url: event.target.value })}
            />
            <ToggleField
              label="Live now"
              checked={settings.isLive}
              onChange={(isLive) => setSettings({ ...settings, isLive })}
            />
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </form>
        </SectionCard>
      ) : error ? null : (
        <Skeleton className="h-40" />
      )}
    </div>
  );
}
