"use client";

import Image from "next/image";
import type { MessageVideo } from "@/lib/youtube";

type Props = {
  messages: MessageVideo[];
};

function pick(messages: MessageVideo[], i: number) {
  return messages[i % messages.length]!;
}

function cleanTitle(title: string) {
  return (
    title
      .split("|")[0]
      ?.replace(/[\u2013\u2014]/g, " ")
      .replace(/\s*-\s*/g, " ")
      .replace(/\s+/g, " ")
      .trim() || title
  );
}

export function MessagesDeviceCluster({ messages }: Props) {
  if (!messages.length) return null;

  const tv = pick(messages, 0);
  const laptopHero = pick(messages, 1);
  const picks = [0, 1, 2, 3].map((i) => pick(messages, i + 1));
  const tablet = pick(messages, 2);
  const tabMore = [3, 4, 5].map((i) => pick(messages, i));

  return (
    <div className="msg-devices" aria-hidden>
      {/* TV — back */}
      <div className="msg-devices__tv">
        <div className="msg-devices__tv-bezel">
          <div className="msg-devices__screen msg-devices__screen--tv">
            <Image
              src={tv.thumbnail}
              alt=""
              fill
              className="object-cover object-[center_top]"
              sizes="(max-width: 900px) 92vw, 640px"
            />
            <div className="msg-devices__tv-mark">kharis</div>
            <div className="msg-devices__tv-copy">
              <p>{cleanTitle(tv.title)}</p>
            </div>
          </div>
        </div>
        <div className="msg-devices__tv-neck" />
        <div className="msg-devices__tv-stand" />
      </div>

      {/* Laptop — front left, browse UI */}
      <div className="msg-devices__laptop">
        <div className="msg-devices__laptop-lid">
          <div className="msg-devices__screen msg-devices__screen--laptop">
            <div className="msg-devices__lap-nav">
              <strong>kharis</strong>
              <span>Home</span>
              <span>Messages</span>
              <span>Listen</span>
            </div>
            <div className="msg-devices__lap-hero">
              <Image
                src={laptopHero.thumbnail}
                alt=""
                fill
                className="object-cover object-[center_top]"
                sizes="400px"
              />
              <div className="msg-devices__lap-hero-copy">
                <em>Latest</em>
                <p>{cleanTitle(laptopHero.title)}</p>
              </div>
            </div>
            <div className="msg-devices__lap-row">
              <p>More messages</p>
              <div className="msg-devices__lap-picks">
                {picks.map((m) => (
                  <span key={m.id} className="msg-devices__lap-pick">
                    <Image
                      src={m.thumbnail}
                      alt=""
                      fill
                      className="object-cover object-[center_top]"
                      sizes="80px"
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="msg-devices__laptop-hinge" />
        <div className="msg-devices__laptop-base">
          <span className="msg-devices__laptop-notch" />
        </div>
      </div>

      {/* Tablet — front right, detail */}
      <div className="msg-devices__tablet">
        <div className="msg-devices__screen msg-devices__screen--tablet">
          <div className="msg-devices__tab-hero">
            <Image
              src={tablet.thumbnail}
              alt=""
              fill
              className="object-cover"
              sizes="260px"
            />
          </div>
          <div className="msg-devices__tab-more">
            <p>Up next</p>
            <div className="msg-devices__tab-picks">
              {tabMore.map((m) => (
                <span key={m.id} className="msg-devices__tab-pick">
                  <Image
                    src={m.thumbnail}
                    alt=""
                    fill
                    className="object-cover object-[center_top]"
                    sizes="60px"
                  />
                </span>
              ))}
            </div>
          </div>
          <div className="msg-devices__tab-body">
            <p className="msg-devices__tab-title">{cleanTitle(tablet.title)}</p>
            <span className="msg-devices__tab-cta">Watch now</span>
          </div>
        </div>
      </div>

      {/* Phone — homepage listen asset */}
      <div className="msg-devices__phone">
        <Image
          src="/images/app-steps/step-1-messages.png"
          alt=""
          width={360}
          height={720}
          className="msg-devices__phone-img"
        />
      </div>
    </div>
  );
}
