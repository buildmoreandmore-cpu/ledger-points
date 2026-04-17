"use client";

import { useState } from "react";
import type { BookingOption } from "@/lib/engine/search";
import { formatSeatsLeft } from "@/lib/engine/availability";
import { getBookingUrl } from "@/lib/data/bookingUrls";
import { CARD_BY_ID, type CardCurrency } from "@/lib/data/cards";
import type { Cabin } from "@/lib/data/routes";
import { getRouteStats } from "@/lib/engine/routeStats";
import SeatMapPreview from "./SeatMapPreview";

type Props = {
  option: BookingOption;
  origin: string;
  destination: string;
  departDate: string;
  duration: string;
  cabin: Cabin;
  isSearching: boolean;
  delayClass: string;
  balanceByCurrency: Partial<Record<CardCurrency, number>>;
  expiringCardIds: Set<string>;
  selectedCardIds: string[];
};

const fmt = new Intl.NumberFormat("en-US");

const DOT = (
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    aria-hidden="true"
    className="mt-[7px] text-accent shrink-0"
  >
    <circle cx="4" cy="4" r="3" fill="currentColor" />
  </svg>
);

const BELL = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    className="inline-block mr-2 -mt-[2px]"
  >
    <path
      d="M4 6.5 C4 4.5 5.5 3 8 3 C10.5 3 12 4.5 12 6.5 V10 L13 11 H3 L4 10 Z"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 12 C6.5 12.8 7 13.3 8 13.3 C9 13.3 9.5 12.8 9.5 12"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

function AvailabilityBadge({
  option,
}: {
  option: BookingOption;
}): React.ReactNode {
  if (!option.availability) return null;
  const { status } = option.availability;
  const label = formatSeatsLeft(option.availability);
  if (status === "open")
    return (
      <span
        className="mono-label inline-flex items-center bg-accent px-2.5 py-[3px] text-white"
        style={{ borderRadius: "999px" }}
      >
        {label}
      </span>
    );
  if (status === "waitlist")
    return (
      <span
        className="mono-label inline-flex items-center bg-gold-soft px-2.5 py-[3px] text-gold"
        style={{ borderRadius: "999px" }}
      >
        {label}
      </span>
    );
  return (
    <span
      className="mono-label inline-flex items-center bg-surface px-2.5 py-[3px] text-ink-faint"
      style={{ borderRadius: "999px" }}
    >
      {label}
    </span>
  );
}

function FlightStrip({
  origin,
  destination,
  duration,
  isSearching,
}: {
  origin: string;
  destination: string;
  duration: string;
  isSearching: boolean;
}) {
  return (
    <div className="flex items-center gap-3 md:gap-4 border-b hairline pb-5">
      <span className="display text-[22px] md:text-[26px] text-ink">
        {origin}
      </span>
      <div className="flex-1 flex flex-col items-center gap-1">
        <svg
          viewBox="0 0 120 14"
          className="w-full text-ink-faint"
          aria-hidden="true"
        >
          <line
            x1="6"
            y1="7"
            x2="114"
            y2="7"
            stroke="currentColor"
            strokeWidth="1"
            className={isSearching ? "march-dash" : ""}
          />
          <g transform="translate(54 0)" className="text-accent">
            <path
              d="M14.75 7 L6 3 V5 L0.75 7 L6 9 V11 L14.75 7 Z"
              fill="currentColor"
            />
          </g>
        </svg>
        <span className="mono-label">{duration}</span>
      </div>
      <span className="display text-[22px] md:text-[26px] text-ink">
        {destination}
      </span>
    </div>
  );
}

function GoalTracker({
  needed,
  have,
  currency,
  selectedCardIds,
}: {
  needed: number;
  have: number;
  currency: CardCurrency;
  selectedCardIds: string[];
}) {
  const short = Math.max(0, needed - have);
  const pct = Math.min(100, Math.max(4, (have / needed) * 100));
  const sourceCard = selectedCardIds
    .map((id) => CARD_BY_ID[id])
    .find((c) => c && c.currency === currency);
  const sourceLabel = sourceCard
    ? `Transfer ${fmt.format(short)} ${currency} from ${sourceCard.bank} ${sourceCard.name}`
    : `Acquire ${fmt.format(short)} ${currency} to close the gap`;

  return (
    <div
      className="mt-auto flex flex-col gap-3 bg-accent-soft px-4 py-4"
      style={{ borderRadius: "12px" }}
    >
      <div className="mono-label text-accent">
        {fmt.format(short)} points short
      </div>
      <div
        className="relative h-[4px] w-full bg-white overflow-hidden"
        style={{ borderRadius: "999px" }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={needed}
        aria-valuenow={have}
      >
        <div
          className="absolute inset-y-0 left-0 bg-accent"
          style={{ width: `${pct}%`, borderRadius: "999px" }}
        />
      </div>
      <div className="text-[13px] text-ink-soft leading-[1.4]">
        {sourceLabel}
      </div>
    </div>
  );
}

function AlertMeButton() {
  const [watching, setWatching] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setWatching((w) => !w)}
      aria-pressed={watching}
      className={[
        "mt-auto mono-label px-5 py-3 text-center transition-colors font-medium",
        watching
          ? "bg-[#0a0a0a] text-white"
          : "bg-surface text-ink border hairline-strong hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a]",
      ].join(" ")}
    >
      {BELL}
      {watching ? "Watching · we'll notify you" : "Alert me when space opens"}
    </button>
  );
}

export default function OptionCard({
  option,
  origin,
  destination,
  departDate,
  duration,
  cabin,
  isSearching,
  delayClass,
  balanceByCurrency,
  expiringCardIds,
  selectedCardIds,
}: Props) {
  const [showMap, setShowMap] = useState(false);
  const isMuted = option.availability?.status === "none";
  const routeKey = `${origin}-${destination}`;
  const stats = getRouteStats(routeKey);

  const hasBalance = option.currencyFrom
    ? balanceByCurrency[option.currencyFrom] ?? 0
    : 0;
  const needs = option.pointsRequired ?? 0;
  const isShort =
    option.pointsRequired !== null &&
    option.currencyFrom !== null &&
    hasBalance < needs;

  const cardIdsForCurrency = option.currencyFrom
    ? selectedCardIds.filter(
        (id) => CARD_BY_ID[id]?.currency === option.currencyFrom
      )
    : [];
  const usesExpiring = cardIdsForCurrency.some((id) =>
    expiringCardIds.has(id)
  );

  const availabilityBlocks =
    option.availability?.status === "waitlist" ||
    option.availability?.status === "none";

  const bookingUrl = getBookingUrl(
    {
      programKey: option.programKey,
      airline: option.airline,
      rank: option.rank,
    },
    { origin, destination, departDate }
  );
  const isCash = option.rank.startsWith("01");
  const bookLabel = isCash
    ? "Open on Google Flights"
    : bookingUrl
    ? `Continue on ${option.airline.split(" ")[0]}`
    : "No booking path yet";

  let action: React.ReactNode;
  if (!isCash && availabilityBlocks) {
    action = <AlertMeButton />;
  } else if (!isCash && isShort) {
    action = (
      <GoalTracker
        needed={needs}
        have={hasBalance}
        currency={option.currencyFrom!}
        selectedCardIds={selectedCardIds}
      />
    );
  } else if (bookingUrl) {
    action = (
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto mono-label bg-[#0a0a0a] text-white px-5 py-3 text-center transition-opacity hover:opacity-85 font-medium"
      >
        {bookLabel}
        <span className="inline-block pl-1.5">↗</span>
      </a>
    );
  } else {
    action = (
      <span className="mt-auto mono-label bg-surface px-5 py-3 text-ink-faint text-center cursor-not-allowed">
        {bookLabel}
      </span>
    );
  }

  return (
    <article
      className={[
        "fade-up",
        delayClass,
        "flex flex-col gap-5 px-5 py-6 md:px-6 md:py-8 md:min-h-[640px]",
        isMuted ? "opacity-75" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <span
          className={[
            "mono-label",
            option.isBest ? "text-accent" : "text-ink-faint",
          ].join(" ")}
        >
          {option.rank}
        </span>
        {option.isBest ? (
          <span
            className="mono-label bg-accent-soft text-accent px-2.5 py-[3px]"
            style={{ borderRadius: "999px" }}
          >
            Our pick
          </span>
        ) : null}
      </div>

      <FlightStrip
        origin={origin}
        destination={destination}
        duration={duration}
        isSearching={isSearching}
      />

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="mono-label bg-accent-soft text-accent px-2.5 py-[3px]"
            style={{ borderRadius: "999px" }}
          >
            {option.cabinLabel}
          </span>
          <AvailabilityBadge option={option} />
        </div>
        <div
          className="relative inline-block w-fit"
          onMouseEnter={() => setShowMap(true)}
          onMouseLeave={() => setShowMap(false)}
          onFocus={() => setShowMap(true)}
          onBlur={() => setShowMap(false)}
          tabIndex={0}
        >
          <h3 className="display text-[20px] md:text-[22px] text-ink cursor-help border-b border-dotted border-rule-strong">
            {option.airline}
          </h3>
          {showMap ? (
            <SeatMapPreview
              cabin={cabin}
              seed={`${routeKey}|${option.programKey ?? "cash"}`}
            />
          ) : null}
        </div>
        <span className="text-[13px] text-ink-soft">{option.tag}</span>
        <span className="mono-label text-ink-faint">
          Avg {stats.avgSaverSeats} saver seats · Released {stats.typicallyReleased}d out · {stats.reliabilityLabel}
        </span>
      </div>

      <div>
        <div className="display text-[42px] leading-[1] tracking-tight text-ink md:text-[52px] lg:text-[60px]">
          {option.headlineNum}
        </div>
        <div className="mono-label mt-1.5">{option.headlineUnit}</div>
      </div>

      <p className="text-[14px] leading-[1.55] text-ink-soft md:text-[15px]">
        {option.detail}
      </p>

      <ul className="flex flex-col gap-2.5 border-t hairline pt-4">
        {option.breakdown.map((row, i) => (
          <li key={i} className="flex items-start gap-3">
            {DOT}
            <span className="flex-1 text-[13px] leading-[1.4] text-ink-soft">
              {row.desc === "Cents per point" ? (
                <span title="Cents per point — your cash-to-award efficiency. Anything above 2 cpp is generally worth the transfer.">
                  {row.desc}
                </span>
              ) : (
                row.desc
              )}
            </span>
            <span className="mono-label text-ink shrink-0">{row.val}</span>
          </li>
        ))}
        {usesExpiring ? (
          <li className="flex items-start gap-3 bg-accent-soft rounded-lg px-3 py-2">
            <span className="mt-[6px] inline-block h-[6px] w-[6px] bg-accent rounded-full shrink-0" />
            <span className="flex-1 text-[13px] leading-[1.4] text-accent-deep">
              Uses expiring points — book before your soonest expiration.
            </span>
          </li>
        ) : null}
      </ul>

      {action}
    </article>
  );
}
