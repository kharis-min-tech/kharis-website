/**
 * Giving for Kharis Church Accra, on its own page.
 *
 * This used to be a fourth tab, "From Ghana", sitting beside Online, Bank
 * transfer and Text. It did not belong there: the other three are ways for
 * anyone to give, while this one is for a single branch, so every visitor
 * who was never going to use it had to read past it. Picking Accra from the
 * branch list on /give now sends people here instead, which is the same
 * shape as every other branch, where choosing one takes you to that branch's
 * own giving page.
 */
"use client";

import Link from "next/link";
import { ArrowLeft, Phone } from "lucide-react";
import { CopyRow } from "@/components/GiveCopyRow";
import { BANK_ACCRA, MOMO } from "@/lib/giving";
import "./give.css";

export function GiveAccra() {
  return (
    <div className="gv gv-accra">
      <section className="gv-accra__inner" aria-labelledby="accra-title">
        <Link href="/give" className="gv-accra__back">
          <ArrowLeft aria-hidden className="h-4 w-4" />
          All ways to give
        </Link>

        <p className="gv-eyebrow">Kharis Church Accra</p>
        <h1 className="gv-accra__title" id="accra-title">
          Giving from Ghana
        </h1>
        <p className="gv-accra__lede">
          Kharis Accra gives through CalBank or Mobile Money. Both go to the church in Ghana.
        </p>

        <div className="gv-panel">
          <div className="gv-split">
            <div>
              <p className="gv-split__label">CalBank transfer</p>
              <dl className="gv-rows">
                <CopyRow label="Account name" value={BANK_ACCRA.accountName} />
                <CopyRow label="Account number" value={BANK_ACCRA.accountNumber} />
                <CopyRow label="Bank" value={BANK_ACCRA.bank} />
                <CopyRow
                  label="SWIFT / BIC"
                  value={BANK_ACCRA.swift}
                  hint={`or ${BANK_ACCRA.swiftLong} if your bank asks for 11 characters`}
                />
              </dl>
            </div>
            <div>
              <p className="gv-split__label">Mobile Money</p>
              <dl className="gv-rows">
                <CopyRow label="Account name" value={MOMO.accountName} />
                <CopyRow label="USSD code" value={MOMO.ussd} />
              </dl>
              <a href={`tel:${MOMO.ussd.replace(/#/g, "%23")}`} className="gv-dial">
                <Phone aria-hidden />
                Dial {MOMO.ussd}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
