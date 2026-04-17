"use client";

import type { Cabin } from "@/lib/data/routes";
import type { SearchResult } from "@/lib/engine/search";
import OptionCard from "./OptionCard";
import FlexStrip from "./FlexStrip";

type Props = {
  result: SearchResult;
  status: "idle" | "searching" | "ready";
  onPickFlexDate: (date: string) => void;
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
}: Props) {
  const { route, options, flexDates } = result;

  return (
    <section
      id="results"
      className="border-b hairline"
      aria-live="polite"
      aria-busy={status === "searching"}
    >
      <div className="mx-auto max-w-[1440px] px-6 pt-20 md:px-12 md:pt-28">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mono-label text-accent">
              03 · Three Booking Options
            </div>
            <h2 className="display mt-4 text-[44px] leading-[1.04] md:text-[56px]">
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
      </div>

      <div className="mx-auto max-w-[1440px] px-0 md:px-12">
        <div className="grid border-t border-b hairline-strong md:grid-cols-3 md:divide-x divide-rule">
          {options.map((opt, i) => (
            <OptionCard
              key={`${opt.rank}-${i}`}
              option={opt}
              origin={route.origin}
              destination={route.destination}
              duration={route.duration}
              delayClass={DELAYS[i] ?? DELAYS[0]}
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
    <div className="mt-8 mb-14 border hairline-strong bg-ink text-cream">
      <div className="flex items-center gap-4 px-6 py-4">
        <span
          className={[
            "inline-block h-[8px] w-[8px] rounded-full",
            isSearching ? "bg-accent pulse-dot" : "bg-[#7fa37a]",
          ].join(" ")}
          aria-hidden="true"
        />
        <span className="mono-label text-cream">
          {isSearching
            ? "Querying transfer charts · Seats.aero · AwardFares · seven sources"
            : isReady
            ? "Three options ready · Saver-only inventory · Updated just now"
            : "Idle · Run a search to see live options"}
        </span>
      </div>
    </div>
  );
}
