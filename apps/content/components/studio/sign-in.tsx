"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { AuthLayout } from "@/components/studio/auth-layout";
import { TextField } from "@/components/studio/fields";
import { PasswordField } from "@/components/studio/password-input";
import { Button } from "@/components/ui/button";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { friendlyAuthError } from "@/lib/utils";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const configured = isSupabaseConfigured();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    const { error: authError } = await getSupabase().auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setPending(false);
    if (authError) setError(friendlyAuthError(authError.message));
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to manage Kharis content."
      footer="Need an account? Ask a super admin to invite you."
    >
      {configured ? null : (
        <p className="mb-4 rounded-lg border border-gold-line bg-gold-soft px-3 py-2 text-sm text-gold">
          Supabase is not configured. Add the public URL and publishable key to
          apps/content/.env.local.
        </p>
      )}
      <form className="space-y-4" onSubmit={onSubmit}>
        <TextField
          label="Email address"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="you@kharis.org"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? (
          <p className="rounded-lg border border-danger-line bg-danger-soft px-3 py-2 text-sm text-danger">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="h-10 w-full" disabled={pending || !configured}>
          {pending ? "Signing in…" : "Sign in"}
          {pending ? null : <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>
    </AuthLayout>
  );
}
