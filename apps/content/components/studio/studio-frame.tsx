"use client";

import { Suspense, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { AdminShell } from "@/components/studio/admin-shell";
import { GraceChat } from "@/components/studio/grace-chat";
import { Mark } from "@/components/studio/mark";
import { SignIn } from "@/components/studio/sign-in";
import { getSupabase } from "@/lib/supabase";

function BootScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Mark className="h-12 w-12 text-xl" />
        <p className="text-sm text-muted-foreground">Loading studio…</p>
      </div>
    </div>
  );
}

export function StudioFrame({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "anon" | "authed">("loading");

  useEffect(() => {
    const supabase = getSupabase();
    let active = true;
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!active) return;
        setUser(data.user);
        setStatus(data.user ? "authed" : "anon");
      })
      .catch(() => {
        if (active) setStatus("anon");
      });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setStatus(session?.user ? "authed" : "anon");
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  if (status === "loading") return <BootScreen />;
  if (status === "anon" || !user) return <SignIn />;

  return (
    <Suspense fallback={<BootScreen />}>
      <AdminShell email={user.email ?? "Signed in"}>{children}</AdminShell>
      <GraceChat />
    </Suspense>
  );
}
