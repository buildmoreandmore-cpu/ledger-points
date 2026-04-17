"use client";

import type { Cabin } from "@/lib/data/routes";
import type { SearchResult } from "@/lib/engine/search";
import type { CardCurrency } from "@/lib/data/cards";
import OptionCard from "./OptionCard";
import FlexStrip from "./FlexStrip";
import EditorialCallout from "./EditorialCallout";
import TransferBonusBanner from "./TransferBonusBanner";

type Props = {
  result: SearchResult;
  status: "idle" | "searching" | "ready";
  onPickFlexDate: (date: string) => void;
  balanceByCurrency: Partial<Record<CardCurrency, number>>;
  expiringCardIds: Set<string>;
  selectedCardIds: string[];
};

const DELAYS = ["fade-up-delay-1", "fade-up-delay-2", "fade-up-delay-3"];

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const CABIN_LABEL: Record<Cabin, string> = {
  economy: "economy",
  premium: "premium economy",
  business: "business",
  first: "first class",
};

function formatDate(iso: string) {
  try {
    return DATE_FMT.format(new Date(`${iso}T00:00:00Z`));
  } catch {
    return iso;
  }
}

export default function ResultsGrid({
  result,
  status,
  onPickFlexDate,
  balanceByCurrency,
  expiringCardIds,
  selectedCardIds,
}: Props) {
  const { route, options, flexDates } = result;

  return (
    <section
      id="results"
      className="border-b hairline"
      aria-live="polite"
      aria-busy={status === "searching"}
    >
      <div className="mx-auto max-w-[1440px] px-4 pt-14 md:px-8 md:pt-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6">
          <div>
            <div className="mono-label text-accent">
              03 · Three booking options
            </div>
            <h2 className="display mt-3 text-[28px] md:text-[40px]">
              {route.origin} → {route.destination},{" "}
              <em>{CABIN_LABEL[route.cabin]}</em>
            </h2>
          </div>
          <div className="mono-label text-ink-faint">
            {formatDate(route.departDate)} · {route.flightNumber} ·{" "}
            {route.carrier}
          </div>
        </div>

        <StatusBar status={status} />

        <TransferBonusBanner options={options} />
        <EditorialCallout options={options} />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 md:px-8">
        <div
          className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-rule border hairline-strong bg-paper overflow-hidden card-shadow"
          style={{ borderRadius: "20px" }}
        >
          {options.map((opt, i) => (
            <OptionCard
              key={`${opt.rank}-${i}`}
              option={opt}
              origin={route.origin}
              destination={route.destination}
              departDate={route.departDate}
              duration={route.duration}
              cabin={route.cabin}
              isSearching={status === "searching"}
              delayClass={DELAYS[i] ?? DELAYS[0]}
              balanceByCurrency={balanceByCurrency}
              expiringCardIds={expiringCardIds}
              selectedCardIds={selectedCardIds}
            />
          ))}
        </div>
      </div>

      <FlexStrip
        flex={flexDates}
        selectedDate={route.departDate}
        onPick={onPickFlexDate}
        isSearching={status === "searching"}
      />
    </section>
  );
}

function StatusBar({
  status,
}: {
  status: "idle" | "searching" | "ready";
}) {
  const isSearching = status === "searching";
  const isReady = status === "ready";
  return (
    <div
      className="mb-6 bg-ink text-white card-shadow overflow-hidden"
      style={{ borderRadius: "12px" }}
    >
      <div className="flex items-center gap-3 px-4 py-3 md:px-6 md:py-3.5">
        <span
          className={[
            "inline-block h-[8px] w-[8px] rounded-full shrink-0",
            isSearching ? "bg-accent pulse-dot" : "bg-[#7fa37a]",
          ].join(" ")}
          aria-hidden="true"
        />
        <span className="mono-label text-white">
          {isSearching
            ? "Querying Seats.aero · AwardFares · seven sources"
            : isReady
            ? "Three options · saver-only · updated just now"
            : "Idle · run a search"}
        </span>
      </div>
    </div>
  );
}
