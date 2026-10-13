"use client";

import { Select } from "@/components/ui/input";
import { WORKSPACES, type WorkspaceId } from "@/lib/workspaces";

export function WorkspaceSelect({
  value,
  onChange,
  allowAll = false,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  allowAll?: boolean;
  id?: string;
}) {
  return (
    <Select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Workspace"
    >
      {allowAll ? <option value="all">All workspaces</option> : null}
      {WORKSPACES.map((workspace) => (
        <option key={workspace.id} value={workspace.id}>
          {workspace.name}
        </option>
      ))}
    </Select>
  );
}

export function isSelectableWorkspace(value: string): value is WorkspaceId {
  return WORKSPACES.some((workspace) => workspace.id === value);
}
