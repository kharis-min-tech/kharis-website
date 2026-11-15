"use client";

import {
  Church,
  Hourglass,
  KeyRound,
  Pencil,
  ShieldCheck,
  Trash2,
  UserCog,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Avatar,
  EmptyState,
  ErrorNotice,
  IconTile,
  ListSkeleton,
  SearchInput,
  StatCard,
  Toolbar,
} from "@/components/studio/blocks";
import { PageHeader } from "@/components/studio/page-header";
import { Panel } from "@/components/studio/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label, Select } from "@/components/ui/input";
import { branchOptionLabel, listBranchOptions } from "@/lib/branches-repo";
import { confirmDelete } from "@/lib/confirm";
import {
  STUDIO_ROLES,
  deleteStudioUser,
  inviteStudioUser,
  listStudioUsers,
  sendStudioPasswordReset,
  studioRoleLabel,
  updateStudioUser,
  type StudioRole,
  type StudioUser,
} from "@/lib/studio-api";
import { initials } from "@/lib/studio-dashboard";
import { useStudioRole } from "@/lib/studio-role";
import type { BranchOption } from "@/lib/types";
import { formatWhen } from "@/lib/utils";

type Draft = { email: string; role: StudioRole; branchIds: string[] };

const ROLE_TONES = { super_admin: "default", branch_admin: "success", none: "gold" } as const;

const ROLE_HINTS: Record<StudioRole, string> = {
  super_admin: "Can edit everything in the studio and manage users.",
  branch_admin: "Can edit the chosen branches, plus their events, messages and visitors.",
  none: "Can sign in but can't see or edit anything yet.",
};

function message(caught: unknown, fallback: string) {
  return caught instanceof Error ? caught.message : fallback;
}

function sameIds(a: string[], b: string[]) {
  return a.length === b.length && a.every((id) => b.includes(id));
}

export default function UsersPage() {
  const router = useRouter();
  const { isSuperAdmin } = useStudioRole();
  const [users, setUsers] = useState<StudioUser[] | null>(null);
  const [branches, setBranches] = useState<BranchOption[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<{ user?: StudioUser; draft: Draft } | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((value) => value + 1), []);

  useEffect(() => {
    if (!isSuperAdmin) router.replace("/");
  }, [isSuperAdmin, router]);

  useEffect(() => {
    if (!isSuperAdmin) return;
    let cancelled = false;
    setError("");
    setUsers(null);
    Promise.all([listStudioUsers(), listBranchOptions()])
      .then(([nextUsers, nextBranches]) => {
        if (cancelled) return;
        setUsers(nextUsers);
        setBranches(nextBranches);
      })
      .catch((caught) => {
        if (cancelled) return;
        setUsers([]);
        setError(message(caught, "Could not load studio users."));
      });
    return () => {
      cancelled = true;
    };
  }, [isSuperAdmin, tick]);

  const branchNames = useMemo(
    () => new Map(branches.map((branch) => [branch.id, branch.name])),
    [branches],
  );

  const branchesOf = useCallback(
    (user: StudioUser) => {
      if (user.role === "super_admin") return "All branches";
      if (user.role === "none" || !user.branchIds.length) return "—";
      return user.branchIds.map((id) => branchNames.get(id) ?? "Removed branch").join(", ");
    },
    [branchNames],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!users) return [];
    if (!needle) return users;
    return users.filter((user) =>
      `${user.email} ${studioRoleLabel(user.role)} ${branchesOf(user)}`
        .toLowerCase()
        .includes(needle),
    );
  }, [query, users, branchesOf]);

  if (!isSuperAdmin) return null;

  function openInvite() {
    setEditing({ draft: { email: "", role: "branch_admin", branchIds: [] } });
  }

  function openEdit(user: StudioUser) {
    setEditing({
      user,
      draft: { email: user.email, role: user.role, branchIds: [...user.branchIds] },
    });
  }

  function patch(next: Partial<Draft>) {
    setEditing((current) =>
      current ? { ...current, draft: { ...current.draft, ...next } } : null,
    );
  }

  async function onSave(event: React.FormEvent) {
    event.preventDefault();
    if (!editing) return;
    const { user, draft } = editing;
    const email = draft.email.trim();
    if (!user && !email) {
      toast.error("Enter an email address.");
      return;
    }
    if (draft.role === "branch_admin" && !draft.branchIds.length) {
      toast.error("Choose at least one branch for a branch admin.");
      return;
    }
    const branchIds = draft.role === "branch_admin" ? draft.branchIds : [];
    setSaving(true);
    try {
      if (user) {
        const changes: { role?: StudioRole; branchIds?: string[] } = {};
        if (draft.role !== user.role) changes.role = draft.role;
        if (draft.role === "branch_admin" && !sameIds(branchIds, user.branchIds)) {
          changes.branchIds = branchIds;
        }
        if (changes.role || changes.branchIds) {
          await updateStudioUser(user.id, changes);
          toast.success("Saved");
        }
      } else {
        await inviteStudioUser({ email, role: draft.role, branchIds });
        toast.success(`Invite sent to ${email}`);
      }
      setEditing(null);
      refresh();
    } catch (caught) {
      toast.error(message(caught, "Save failed"));
    } finally {
      setSaving(false);
    }
  }

  async function onReset(user: StudioUser) {
    setBusyId(user.id);
    try {
      await sendStudioPasswordReset(user.id);
      toast.success(`Password reset sent to ${user.email}`);
    } catch (caught) {
      toast.error(message(caught, "Could not send the password reset."));
    } finally {
      setBusyId("");
    }
  }

  async function onDelete(user: StudioUser) {
    const confirmed = await confirmDelete(user.email || "this account");
    if (!confirmed) return;
    setBusyId(user.id);
    try {
      await deleteStudioUser(user.id);
      toast.success("Deleted");
      if (editing?.user?.id === user.id) setEditing(null);
      refresh();
    } catch (caught) {
      toast.error(message(caught, "Delete failed"));
    } finally {
      setBusyId("");
    }
  }

  return (
    <div>
      <PageHeader
        icon={<IconTile icon={UserCog} className="h-12 w-12 rounded-2xl" />}
        title="Users"
        description="Who can sign in to the studio and what they can edit. Invites and password resets are sent by email."
        action={
          <Button onClick={openInvite}>
            <UserPlus className="h-4 w-4" />
            Invite user
          </Button>
        }
      />
      {users && !error && users.length ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Super admins"
            value={users.filter((user) => user.role === "super_admin").length}
            icon={ShieldCheck}
            tone="brand"
          />
          <StatCard
            label="Branch admins"
            value={users.filter((user) => user.role === "branch_admin").length}
            icon={Church}
            tone="success"
          />
          <StatCard
            label="Waiting for access"
            value={users.filter((user) => user.role === "none").length}
            icon={Hourglass}
            tone="gold"
          />
        </div>
      ) : null}
      <Toolbar>
        <SearchInput
          value={query}
          placeholder="Search email, role or branch"
          onChange={(event) => setQuery(event.target.value)}
        />
      </Toolbar>
      {users === null ? (
        <ListSkeleton />
      ) : error ? (
        <ErrorNotice message={error} onRetry={refresh} />
      ) : visible.length === 0 ? (
        <EmptyState icon={UserCog} title={users.length ? "No matches" : "No studio users yet"}>
          {users.length ? "No users match that search." : "Invite someone to get started."}
        </EmptyState>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-card">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="studio-eyebrow px-5 py-3">User</th>
                <th className="studio-eyebrow px-5 py-3">Role</th>
                <th className="studio-eyebrow px-5 py-3">Branches</th>
                <th className="studio-eyebrow px-5 py-3">Last sign-in</th>
                <th className="px-5 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visible.map((user) => (
                <tr key={user.id} className="transition-colors hover:bg-accent/60">
                  <td className="px-5 py-3">
                    <div className="flex max-w-[18rem] items-center gap-3">
                      <Avatar label={initials(user.email)} className="h-8 w-8 text-[11px]" />
                      <span className="truncate font-medium">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge tone={ROLE_TONES[user.role]}>{studioRoleLabel(user.role)}</Badge>
                  </td>
                  <td className="max-w-[16rem] px-5 py-3 text-muted-foreground">
                    {branchesOf(user)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-muted-foreground">
                    {formatWhen(user.lastSignInAt) || "Never"}
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="flex justify-end gap-1">
                      <Button variant="outline" size="sm" onClick={() => openEdit(user)}>
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={busyId === user.id}
                        onClick={() => void onReset(user)}
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        Send password reset
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-danger hover:bg-danger-soft"
                        disabled={busyId === user.id}
                        onClick={() => void onDelete(user)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing ? (
        <Panel
          title={editing.user ? `Edit ${editing.user.email}` : "Invite user"}
          onClose={() => setEditing(null)}
        >
          <form className="space-y-4" onSubmit={onSave}>
            {editing.user ? null : (
              <div>
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  required
                  autoComplete="off"
                  value={editing.draft.email}
                  onChange={(event) => patch({ email: event.target.value })}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  They get an email with a link to choose a password.
                </p>
              </div>
            )}
            <div>
              <Label htmlFor="user-role">Role</Label>
              <Select
                id="user-role"
                value={editing.draft.role}
                onChange={(event) => patch({ role: event.target.value as StudioRole })}
              >
                {[...STUDIO_ROLES].reverse().map((role) => (
                  <option key={role} value={role}>
                    {studioRoleLabel(role)}
                  </option>
                ))}
              </Select>
              <p className="mt-1 text-xs text-muted-foreground">{ROLE_HINTS[editing.draft.role]}</p>
            </div>
            {editing.draft.role === "branch_admin" ? (
              <BranchPicker
                branches={branches}
                value={editing.draft.branchIds}
                onChange={(branchIds) => patch({ branchIds })}
              />
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : editing.user ? "Save" : "Send invite"}
              </Button>
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </form>
        </Panel>
      ) : null}
    </div>
  );
}

function BranchPicker({
  branches,
  value,
  onChange,
}: {
  branches: BranchOption[];
  value: string[];
  onChange: (value: string[]) => void;
}) {
  function toggle(id: string, checked: boolean) {
    onChange(checked ? [...value, id] : value.filter((item) => item !== id));
  }

  return (
    <fieldset>
      <legend className="mb-1.5 block text-[13px] font-medium text-foreground/85">Branches</legend>
      {branches.length ? (
        <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
          {branches.map((branch) => (
            <label
              key={branch.id}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
            >
              <input
                type="checkbox"
                className="h-4 w-4 accent-[var(--primary)]"
                checked={value.includes(branch.id)}
                onChange={(event) => toggle(branch.id, event.target.checked)}
              />
              {branchOptionLabel(branch)}
            </label>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Add a branch before inviting branch admins.</p>
      )}
      <p className="mt-1 text-xs text-muted-foreground">
        {value.length
          ? `${value.length} selected.`
          : "Choose at least one branch this person can edit."}
      </p>
    </fieldset>
  );
}
