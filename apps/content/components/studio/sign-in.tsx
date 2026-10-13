"use client";

import { useState } from "react";
import { Mark } from "@/components/studio/mark";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TextField } from "@/components/studio/fields";
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
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-6 flex flex-col items-center text-center">
          <Mark className="h-12 w-12 text-xl" />
          <h1 className="mt-4 font-heading text-2xl font-semibold">Kharis Content Studio</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage church content.</p>
        </div>
        {configured ? null : (
          <p className="mb-4 rounded-md bg-accent px-3 py-2 text-sm">
            Supabase is not configured. Add the public URL and publishable key to
            apps/content/.env.local.
          </p>
        )}
        <form className="space-y-4" onSubmit={onSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={pending || !configured}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
