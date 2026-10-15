"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChatIcon } from "@/components/ChatIcon";
import { markChatOpened, useChatAttention } from "@/components/useChatAttention";
import "./chat-attention.css";

const loadChat = () => import("@/components/LifeChatbot");

const LifeChatbot = dynamic(() => loadChat().then((m) => m.LifeChatbot), {
  ssr: false,
  loading: () => <Launcher busy />,
});

function Launcher({
  busy = false,
  pop = false,
  className = "",
  onOpen,
}: {
  busy?: boolean;
  pop?: boolean;
  className?: string;
  onOpen?: () => void;
}) {
  const [popping, setPopping] = useState(pop);
  return (
    <button
      type="button"
      className={`life-chat__fab${popping ? " chat-attn--pop" : ""} ${className}`.trim()}
      aria-label="Open chat with Grace"
      aria-busy={busy || undefined}
      onClick={onOpen}
      onPointerEnter={() => void loadChat()}
      onFocus={() => void loadChat()}
      onAnimationEnd={(e) => {
        if (e.animationName === "chat-attn-pop") setPopping(false);
      }}
    >
      <ChatIcon />
    </button>
  );
}

function AttentionCue({ bouncing, bubble }: { bouncing: boolean; bubble: boolean }) {
  return (
    <>
      <span className={`chat-attn__shadow${bouncing ? " is-on" : ""}`} aria-hidden />
      <span className={`chat-attn__bubble${bubble ? " is-on" : ""}`} aria-hidden>
        Need help?
      </span>
    </>
  );
}

/**
 * Grace chat on every page. Lives in the root layout so the conversation survives navigation.
 * The chat code only loads once someone reaches for the launcher (or on Life, which keeps its
 * delayed "Need any help?" prompt). Elsewhere the launcher pops in and bounces now and then for
 * people who keep scrolling, until the chat has been opened once.
 */
export function SiteChat() {
  const pathname = usePathname();
  const onLife = pathname === "/life";
  const [requested, setRequested] = useState(false);
  const [loaded, setLoaded] = useState(onLife);
  const [opened, setOpened] = useState(false);
  // Once the chat has loaded it stays mounted, so leaving Life keeps the conversation.
  if (onLife && !loaded) setLoaded(true);

  const cueOn = !onLife && !opened;
  const { bouncing, bubble } = useChatAttention(cueOn);
  const fabClass = bouncing ? "chat-attn--bounce" : "";
  const markOpened = () => {
    markChatOpened();
    setOpened(true);
  };

  const cue = cueOn ? <AttentionCue bouncing={bouncing} bubble={bubble} /> : null;

  if (!loaded && !requested) {
    return (
      <>
        {cue}
        <Launcher
          pop
          className={fabClass}
          onOpen={() => {
            markOpened();
            setRequested(true);
          }}
        />
      </>
    );
  }
  return (
    <>
      {cue}
      <LifeChatbot
        nudge={onLife && !requested}
        startOpen={requested}
        fabClassName={fabClass}
        onOpen={markOpened}
      />
    </>
  );
}
