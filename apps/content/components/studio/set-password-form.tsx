"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/studio/auth-layout";
import { PasswordField } from "@/components/studio/password-input";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import { friendlyAuthError } from "@/lib/utils";

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

  return (
    <AuthLayout
      title={status === "invalid" ? "This link doesn't work" : "Choose a password"}
      description={
        status === "checking"
          ? "Checking your link…"
          : status === "invalid"
            ? invalidReason ||
              "The link is invalid or has expired. Ask a super admin to send a new one."
            : "Set the password you'll use to sign in to Content Studio."
      }
      footer={
        status === "invalid" ? (
          <Link href="/" className="font-semibold text-brand hover:underline">
            Back to sign in
          </Link>
        ) : null
      }
    >
      {status === "ready" ? (
        <form className="space-y-4" onSubmit={onSubmit}>
          {email ? (
            <div className="rounded-lg border border-border bg-muted px-3 py-2 text-sm">
              <span className="text-muted-foreground">Account </span>
              <span className="font-semibold">{email}</span>
            </div>
          ) : null}
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
          </Button>
        </form>
      ) : null}
    </AuthLayout>
  );
}
