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
    className="mt-[6px] text-accent"
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
      <span className="mono-label inline-block border border-accent bg-accent px-2 py-[3px] text-cream">
        {label}
      </span>
    );
  if (status === "waitlist")
    return (
      <span className="mono-label inline-block border border-gold bg-gold/10 px-2 py-[3px] text-gold">
        {label}
      </span>
    );
  return (
    <span className="mono-label inline-block border hairline-strong px-2 py-[3px] text-ink-faint">
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
    <div className="flex items-center gap-4 border-b hairline pb-6">
      <span className="font-display text-[28px] text-ink">{origin}</span>
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
      <span className="font-display text-[28px] text-ink">{destination}</span>
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
    ? `Transfer ${fmt.format(short)} ${currency} from ${sourceCard.bank} ${sourceCard.name} →`
    : `Acquire ${fmt.format(short)} ${currency} to close the gap →`;

  return (
    <div className="mt-auto flex flex-col gap-3 border hairline-strong px-4 py-4">
      <div className="mono-label text-accent">
        You&apos;re {fmt.format(short)} points short
      </div>
      <div
        className="relative h-[3px] w-full bg-rule overflow-hidden"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={needed}
        aria-valuenow={have}
      >
        <div
          className="absolute inset-y-0 left-0 bg-accent"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mono-label text-ink-soft">{sourceLabel}</div>
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
        "mt-auto mono-label px-5 py-3 text-center transition-colors",
        watching
          ? "bg-accent text-cream border border-accent"
          : "border hairline-strong text-ink hover:bg-ink hover:text-cream",
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
        className="mt-auto mono-label border hairline-strong px-5 py-3 text-ink text-center transition-colors hover:bg-ink hover:text-cream"
      >
        {bookLabel}
        <span className="inline-block pl-2 italic">↗</span>
      </a>
    );
  } else {
    action = (
      <span className="mt-auto mono-label border hairline px-5 py-3 text-ink-faint text-center cursor-not-allowed">
        {bookLabel}
      </span>
    );
  }

  return (
    <article
      className={[
        "fade-up",
        delayClass,
        "flex flex-col gap-6 px-6 py-8 md:min-h-[640px]",
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
          <span className="mono-label text-accent">Our Pick</span>
        ) : null}
      </div>

      <FlightStrip
        origin={origin}
        destination={destination}
        duration={duration}
        isSearching={isSearching}
      />

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="mono-label text-accent">{option.cabinLabel}</span>
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
          <h3 className="font-display text-[24px] leading-[1.15] text-ink cursor-help border-b border-dotted border-rule-strong">
            {option.airline}
          </h3>
          {showMap ? (
            <SeatMapPreview
              cabin={cabin}
              seed={`${routeKey}|${option.programKey ?? "cash"}`}
            />
          ) : null}
        </div>
        <span className="mono-label">{option.tag}</span>
        <span className="mono-label text-ink-faint">
          On this route · Avg {stats.avgSaverSeats} saver seats · Typically
          released {stats.typicallyReleased} days out · {stats.reliabilityLabel}
        </span>
      </div>

      <div>
        <div className="font-display text-[72px] leading-[0.98] tracking-tight text-ink md:text-[84px]">
          {option.headlineNum}
        </div>
        <div className="mono-label mt-2">{option.headlineUnit}</div>
      </div>

      <p className="font-display text-[15px] leading-[1.55] text-ink-soft">
        {option.detail}
      </p>

      <ul className="flex flex-col gap-3 border-t hairline pt-5">
        {option.breakdown.map((row, i) => (
          <li key={i} className="flex items-start gap-3">
            {DOT}
            <span className="flex-1 font-display text-[14px] leading-[1.4] text-ink-soft">
              {row.desc === "Cents per point" ? (
                <span title="Cents per point — your cash-to-award efficiency. Anything above 2 cpp is generally worth the transfer.">
                  {row.desc}
                </span>
              ) : (
                row.desc
              )}
            </span>
            <span className="mono-label text-ink">{row.val}</span>
          </li>
        ))}
        {usesExpiring ? (
          <li className="flex items-start gap-3">
            <span className="mt-[6px] inline-block h-[8px] w-[8px] bg-accent" />
            <span className="flex-1 font-display text-[14px] leading-[1.4] text-accent-deep">
              Uses expiring points — book before your soonest expiration to
              avoid losing balance.
            </span>
          </li>
        ) : null}
      </ul>

      {action}
    </article>
  );
}
