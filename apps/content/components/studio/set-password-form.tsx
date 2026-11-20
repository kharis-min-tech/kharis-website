"use client";

import { ArrowRight, KeyRound, Link2Off, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/studio/auth-layout";
import { PasswordField } from "@/components/studio/password-input";
import { Button, buttonClasses } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import { cn, friendlyAuthError } from "@/lib/utils";

const MIN_PASSWORD = 8;

/** Supabase puts link errors (for example an expired link) in the hash or the query. */
function linkError() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const query = new URLSearchParams(window.location.search);
  const description = hash.get("error_description") || query.get("error_description");
  if (description) return description.replace(/\+/g, " ");
  return hash.get("error") || query.get("error") ? "This link is invalid or has expired." : "";
}

export function SetPasswordForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const [invalidReason, setInvalidReason] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    const urlError = linkError();
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        if (data.session && !urlError) {
          setEmail(data.session.user.email ?? "");
          setStatus("ready");
          return;
        }
        setInvalidReason(urlError);
        setStatus("invalid");
      })
      .catch(() => {
        if (active) setStatus("invalid");
      });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active || !session || urlError) return;
      setEmail(session.user.email ?? "");
      setStatus("ready");
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < MIN_PASSWORD) {
      setError(`Use at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("The passwords don't match.");
      return;
    }
    setPending(true);
    const { error: authError } = await getSupabase().auth.updateUser({ password });
    setPending(false);
    if (authError) {
      setError(friendlyAuthError(authError.message));
      return;
    }
    toast.success("Password saved");
    router.replace("/");
  }

  if (status === "checking") {
    return (
      <AuthLayout title="Checking your link" description="One moment…" center>
        <div className="flex flex-col items-center gap-4 py-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
            <LoaderCircle className="h-7 w-7 animate-spin" aria-hidden />
          </span>
          <p className="text-sm text-muted-foreground">Confirming your invite or reset link.</p>
        </div>
      </AuthLayout>
    );
  }

  if (status === "invalid") {
    return (
      <AuthLayout
        title="This link doesn't work"
        description="Invite and password-reset links expire, and each one can only be used once."
        center
        footer={
          <Link href="/" className="font-semibold text-brand hover:underline">
            Back to sign in
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft text-danger">
            <Link2Off className="h-8 w-8" aria-hidden />
          </span>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {invalidReason || "The link is invalid or has expired."}
            </p>
            <p className="text-sm text-muted-foreground">
              Ask a super admin to press{" "}
              <span className="font-semibold text-foreground">Send password reset</span> for your
              account, then use the newest email.
            </p>
          </div>
          <Link href="/" className={cn(buttonClasses("default", "default"), "h-10 w-full")}>
            Back to sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Choose a password"
      description="Set the password you'll use to sign in to Content Studio."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="mb-1 flex items-center gap-3 rounded-lg border border-border bg-muted px-3 py-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
            <KeyRound className="h-4 w-4" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">Account</p>
            <p className="truncate text-sm font-semibold">{email || "Your studio account"}</p>
          </div>
        </div>
        <PasswordField
          label="New password"
          name="password"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordField
          label="Confirm password"
          name="confirm"
          autoComplete="new-password"
          required
          minLength={MIN_PASSWORD}
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">At least {MIN_PASSWORD} characters.</p>
        {error ? (
          <p className="rounded-lg border border-danger-line bg-danger-soft px-3 py-2 text-sm text-danger">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="h-10 w-full" disabled={pending}>
          {pending ? "Saving…" : "Save password"}
          {pending ? null : <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>
    </AuthLayout>
  );
}
