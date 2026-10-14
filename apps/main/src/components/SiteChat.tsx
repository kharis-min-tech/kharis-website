"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChatIcon } from "@/components/ChatIcon";

const loadChat = () => import("@/components/LifeChatbot");

const LifeChatbot = dynamic(() => loadChat().then((m) => m.LifeChatbot), {
  ssr: false,
  loading: () => <Launcher busy />,
});

function Launcher({ busy = false, onOpen }: { busy?: boolean; onOpen?: () => void }) {
  return (
    <button
      type="button"
      className="life-chat__fab"
      aria-label="Open chat with Grace"
      aria-busy={busy || undefined}
      onClick={onOpen}
      onPointerEnter={() => void loadChat()}
      onFocus={() => void loadChat()}
    >
      <ChatIcon />
    </button>
  );
}

/**
 * Grace chat on every page. Lives in the root layout so the conversation survives navigation.
 * The chat code only loads once someone reaches for the launcher (or on Life, which keeps its
 * delayed "Need any help?" prompt).
 */
export function SiteChat() {
  const pathname = usePathname();
  const onLife = pathname === "/life";
  const [requested, setRequested] = useState(false);
  const [loaded, setLoaded] = useState(onLife);
  // Once the chat has loaded it stays mounted, so leaving Life keeps the conversation.
  if (onLife && !loaded) setLoaded(true);

  if (!loaded && !requested) {
    return <Launcher onOpen={() => setRequested(true)} />;
  }
  return <LifeChatbot nudge={onLife && !requested} startOpen={requested} />;
}
