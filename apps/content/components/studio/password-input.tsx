"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input, Label } from "@/components/ui/input";

export function PasswordField({
  label,
  aside,
  ...props
}: { label: string; aside?: React.ReactNode } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>) {
  const [visible, setVisible] = useState(false);
  const id = props.id ?? props.name;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        {aside}
      </div>
      <div className="relative">
        <Input id={id} type={visible ? "text" : "password"} className="pr-10" {...props} />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-1.5 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
