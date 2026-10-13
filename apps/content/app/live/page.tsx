"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TextField, ToggleField } from "@/components/studio/fields";
import { PageHeader } from "@/components/studio/page-header";
import { PickWorkspace } from "@/components/studio/pick-workspace";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getLiveSettings, saveLiveSettings } from "@/lib/content-repo";
import type { LiveSettings } from "@/lib/types";
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
        title="Live"
        description="The stream URL, title, and whether the app should show the broadcast as live."
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {settings ? (
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
      ) : error ? null : (
        <Skeleton className="h-40" />
      )}
    </div>
  );
}
