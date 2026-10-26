"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { BANK, ONLINE_GIVE_URL, SMS_GIVE } from "@/lib/giving";

export type GivingLocation = { slug: string; name: string; givingLink: string | null };
const METHODS = [
  { id: "online", title: "Online", hint: "By card, through your branch" },
  { id: "bank", title: "Bank transfer", hint: "One-off or monthly, from the UK" },
  { id: "text", title: "Text", hint: "Give from your UK mobile" },
  { id: "app", title: "Kharis app", hint: "Give through the Kharis Hub" },
] as const;
type Method = (typeof METHODS)[number]["id"];

function CopyRow({ label, value }: { label: string; value: string }) {
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Copied");
    } catch {
      setStatus("Select the details to copy them");
    }
  }
  return (
    <div className="kp-giving-bank-row">
      <div>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </div>
      <button type="button" onClick={copy} aria-label={`Copy ${label.toLowerCase()}`}>
        Copy
      </button>
      <span className="sr-only" role="status">
        {status}
      </span>
    </div>
  );
}

export function GivingMethods({ branches }: { branches: GivingLocation[] }) {
  const [method, setMethod] = useState<Method>("online");
  const [selected, setSelected] = useState("");
  const [amount, setAmount] = useState(10);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const branch = branches.find(({ slug }) => slug === selected);
  const sms = `${SMS_GIVE.keyword} ${amount}`;

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (index + 1) % METHODS.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index + METHODS.length - 1) % METHODS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = METHODS.length - 1;
    else return;
    event.preventDefault();
    setMethod(METHODS[next].id);
    tabs.current[next]?.focus();
  }

  return (
    <section id="ways" className="kp-giving-methods" aria-labelledby="giving-ways-title">
      <div className="kp-giving-methods__inner">
        <p className="kp-giving-kicker">Ways to give</p>
        <h2 id="giving-ways-title" className="font-display-lg uppercase">
          Pick what suits you
        </h2>
        <div className="kp-giving-desk">
          <div className="kp-giving-tabs" role="tablist" aria-label="Ways to give">
            {METHODS.map((item, index) => (
              <button
                key={item.id}
                ref={(el) => {
                  tabs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`giving-tab-${item.id}`}
                aria-controls="giving-panel"
                aria-selected={method === item.id}
                tabIndex={method === item.id ? 0 : -1}
                onClick={() => setMethod(item.id)}
                onKeyDown={(event) => onKeyDown(event, index)}
              >
                <span className="kp-giving-tab-num">0{index + 1}</span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.hint}</small>
                </span>
              </button>
            ))}
          </div>
          <div
            id="giving-panel"
            className="kp-giving-panel"
            role="tabpanel"
            aria-labelledby={`giving-tab-${method}`}
            tabIndex={0}
          >
            {method === "online" ? (
              <>
                <h3>Give to your branch online</h3>
                <p>Choose your KP2 branch to give by card through its giving page.</p>
                <label className="kp-giving-select">
                  Your branch
                  <select value={selected} onChange={(event) => setSelected(event.target.value)}>
                    <option value="" disabled>
                      Choose a branch
                    </option>
                    {branches.map(({ slug, name }) => (
                      <option key={slug} value={slug}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                {branch ? (
                  <a
                    className="kp-giving-button"
                    href={branch.givingLink || ONLINE_GIVE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {branch.givingLink ? `Give to ${branch.name}` : "Continue to Kharis Giving"}
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <button type="button" className="kp-giving-button" disabled>
                    Choose your branch first
                  </button>
                )}
                {branch && !branch.givingLink ? (
                  <p className="kp-giving-note">
                    Select {branch.name} in the Kharis giving portal.
                  </p>
                ) : null}
              </>
            ) : null}
            {method === "bank" ? (
              <>
                <h3>Bank transfer</h3>
                <p>
                  Use these details in your banking app. To give every month, set up a standing
                  order.
                </p>
                <dl>
                  <CopyRow label="Account name" value={BANK.accountName} />
                  <CopyRow label="Account number" value={BANK.accountNumber} />
                  <CopyRow label="Sort code" value={BANK.sortCode} />
                  <CopyRow label="IBAN" value={BANK.iban} />
                  <CopyRow label="SWIFT / BIC" value={BANK.swift} />
                </dl>
              </>
            ) : null}
            {method === "text" ? (
              <>
                <h3>Text to give</h3>
                <p>
                  Text <strong>{SMS_GIVE.keyword}</strong> and the amount to{" "}
                  <strong>{SMS_GIVE.number}</strong> from your UK mobile.
                </p>
                <div className="kp-giving-amounts" role="group" aria-label="Choose an amount">
                  {[5, 10, 15, 20].map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={amount === value}
                      onClick={() => setAmount(value)}
                    >
                      £{value}
                    </button>
                  ))}
                </div>
                <div className="kp-giving-message" aria-label="Text message preview">
                  <span>To: {SMS_GIVE.number}</span>
                  <strong>{sms}</strong>
                </div>
                <a
                  className="kp-giving-button"
                  href={`sms:${SMS_GIVE.number}?&body=${encodeURIComponent(sms)}`}
                >
                  Text {sms} to {SMS_GIVE.number}
                </a>
                <p className="kp-giving-note">UK mobiles only. Up to £20 per text.</p>
              </>
            ) : null}
            {method === "app" ? (
              <>
                <h3>Give through the Kharis app</h3>
                <p>Use Kharis Hub to give and stay connected with your church family.</p>
                <Link className="kp-giving-button" href="/#app-stores">
                  Get the Kharis app <span aria-hidden="true">↗</span>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
