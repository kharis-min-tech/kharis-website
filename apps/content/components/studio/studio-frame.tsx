"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { AdminShell } from "@/components/studio/admin-shell";
import { AuthLayout } from "@/components/studio/auth-layout";
import { Avatar } from "@/components/studio/blocks";
import { GraceChat } from "@/components/studio/grace-chat";
import { Mark } from "@/components/studio/mark";
import { SignIn } from "@/components/studio/sign-in";
import { Button } from "@/components/ui/button";
import { getStudioMe, type StudioMe } from "@/lib/studio-api";
import { initials } from "@/lib/studio-dashboard";
import { StudioRoleProvider, studioAccess } from "@/lib/studio-role";
import { getSupabase } from "@/lib/supabase";

const PUBLIC_PATHS = ["/cookies", "/set-password"];

function BootScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Mark className="h-14 w-14 animate-pulse" />
        <p className="text-sm text-muted-foreground">Loading studio…</p>
      </div>
    </div>
  );
}

function AccountScreen({
  title,
  message,
  email,
  children,
}: {
  title: string;
  message: string;
  email?: string;
  children: React.ReactNode;
}) {
  return (
    <AuthLayout title={title} description={message}>
      {email ? (
        <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-muted px-3 py-2.5">
          <Avatar label={initials(email)} className="h-8 w-8 text-[11px]" />
          <span className="min-w-0 truncate text-sm font-semibold">{email}</span>
        </div>
      ) : null}
      <div className="flex flex-col gap-2">{children}</div>
    </AuthLayout>
  );
}

function signOut() {
  void getSupabase().auth.signOut();
}

export function StudioFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "anon" | "authed">("loading");
  const [account, setAccount] = useState<{ userId: string; me: StudioMe } | null>(null);
  const [accountError, setAccountError] = useState<{ userId: string; message: string } | null>(
    null,
  );
  const [attempt, setAttempt] = useState(0);
  const userId = user?.id ?? null;

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

  useEffect(() => {
    if (!userId) return;
    let active = true;
    getStudioMe()
      .then((me) => {
        if (!active) return;
        setAccountError(null);
        setAccount({ userId, me });
      })
      .catch((caught) => {
        if (!active) return;
        setAccount(null);
        setAccountError({
          userId,
          message: caught instanceof Error ? caught.message : "Your access could not be checked.",
        });
      });
    return () => {
      active = false;
    };
  }, [userId, attempt]);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);
  const me = account?.userId === userId ? account.me : null;
  const meError = accountError?.userId === userId ? accountError.message : "";
  const signedInEmail = user?.email ?? "";
  const access = useMemo(
    () => studioAccess(me && { ...me, email: me.email || signedInEmail }, reload),
    [me, signedInEmail, reload],
  );

  if (PUBLIC_PATHS.includes(pathname)) return children;
  if (status === "loading") return <BootScreen />;
  if (status === "anon" || !user) return <SignIn />;

  if (meError) {
    return (
      <AccountScreen
        title="We couldn't check your access"
        message={meError}
        email={user.email ?? undefined}
      >
        <Button
          onClick={() => {
            setAccountError(null);
            reload();
          }}
        >
          Try again
        </Button>
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </AccountScreen>
    );
  }
  if (!me) return <BootScreen />;
  if (me.role === "none") {
    return (
      <AccountScreen
        title="Waiting for access"
        message="Your account is waiting for access. Ask a super admin to give you a role."
        email={user.email ?? undefined}
      >
        <Button onClick={reload}>Check again</Button>
        <Button variant="outline" onClick={signOut}>
          Sign out
        </Button>
      </AccountScreen>
    );
  }

  return (
    <StudioRoleProvider value={access}>
      <Suspense fallback={<BootScreen />}>
        <AdminShell email={user.email ?? "Signed in"}>{children}</AdminShell>
        <GraceChat />
      </Suspense>
    </StudioRoleProvider>
  );
}
