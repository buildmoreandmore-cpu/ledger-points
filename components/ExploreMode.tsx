"use client";

import { useState, useTransition } from "react";
import {
  exploreDestinations,
  REGION_LABELS,
  type ExploreResult,
  type Region,
} from "@/lib/engine/explore";
import { ORIGINS } from "@/lib/data/routes";
import type { Cabin } from "@/lib/data/routes";

type Props = {
  selectedCardIds: string[];
  cabin: Cabin;
  origin: string;
  departDate: string;
  onPickDestination: (destination: string) => void;
};

const fmt = new Intl.NumberFormat("en-US");

const REGIONS: Region[] = [
  "europe",
  "asia",
  "south-america",
  "oceania",
  "middle-east",
  "any",
];

export default function ExploreMode({
  selectedCardIds,
  cabin,
  origin: initialOrigin,
  departDate,
  onPickDestination,
}: Props) {
  const [origin, setOrigin] = useState(initialOrigin);
  const [region, setRegion] = useState<Region>("europe");
  const [rankBy, setRankBy] = useState<"points" | "cpp">("cpp");
  const [results, setResults] = useState<ExploreResult[] | null>(null);
  const [isPending, startTransition] = useTransition();

  function run() {
    startTransition(async () => {
      const next = await exploreDestinations({
        origin,
        cabin,
        region,
        departDate,
        selectedCardIds,
        rankBy,
      });
      setResults(next);
    });
  }

  return (
    <div className="mt-10 border hairline-strong bg-cream/50">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        <div className="md:col-span-3 border-b md:border-b-0 md:border-r hairline px-5 py-4">
          <div className="mono-label mb-2">Origin</div>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full bg-transparent font-display text-[22px] tracking-tight text-ink outline-none"
          >
            {ORIGINS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4 border-b md:border-b-0 md:border-r hairline px-5 py-4">
          <div className="mono-label mb-2">Region</div>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
            className="w-full bg-transparent font-display text-[22px] tracking-tight text-ink outline-none"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {REGION_LABELS[r]}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3 border-b md:border-b-0 md:border-r hairline px-5 py-4">
          <div className="mono-label mb-2">Rank by</div>
          <select
            value={rankBy}
            onChange={(e) => setRankBy(e.target.value as "points" | "cpp")}
            className="w-full bg-transparent font-display text-[18px] tracking-tight text-ink outline-none"
          >
            <option value="cpp">Highest cpp</option>
            <option value="points">Lowest points</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={run}
            disabled={isPending}
            className={[
              "mono-label w-full h-full px-5 py-4 transition-colors",
              isPending
                ? "bg-ink-faint text-cream"
                : "bg-ink text-cream hover:bg-accent-deep",
            ].join(" ")}
          >
            {isPending ? "Scanning" : "Explore"}
            <span className="inline-block pl-2 italic">→</span>
          </button>
        </div>
      </div>

      {results ? (
        <div className="border-t hairline">
          {results.length ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {results.map((r, i) => (
                <li
                  key={r.destination}
                  className={[
                    "flex flex-col gap-3 border-rule p-5",
                    i > 0 ? "border-t md:border-t-0" : "",
                    i % 3 !== 0 ? "md:border-l" : "",
                    i >= 3 ? "md:border-t" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mono-label text-accent">
                        {r.destination} · {r.destinationCity}
                      </div>
                      <div className="font-display text-[22px] leading-[1.15] text-ink">
                        {r.bestProgram ?? "No transfer path"}
                      </div>
                    </div>
                    <AvailabilityPill status={r.availability} />
                  </div>

                  <div>
                    <span className="font-display text-[32px] leading-[1] text-ink">
                      {r.bestPoints ? fmt.format(r.bestPoints) : "—"}
                    </span>
                    <span className="mono-label ml-2 text-ink-faint">
                      {r.bestCpp ? `${r.bestCpp.toFixed(1)} cpp` : "n/a"}
                    </span>
                  </div>

                  <div className="mono-label text-ink-faint">
                    Cash · ${fmt.format(r.cashFare)} · {r.duration}
                  </div>

                  <button
                    type="button"
                    onClick={() => onPickDestination(r.destination)}
                    className="mt-auto mono-label border hairline-strong px-4 py-2 text-ink transition-colors hover:bg-ink hover:text-cream"
                  >
                    Search this route
                    <span className="inline-block pl-2 italic">→</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-10 font-display text-[16px] text-ink-soft">
              No destinations in this region match your current cards yet. Try
              another region, or add a card that transfers to Star Alliance or
              SkyTeam partners.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function AvailabilityPill({
  status,
}: {
  status: "open" | "waitlist" | "none";
}) {
  if (status === "open")
    return (
      <span className="mono-label inline-block border border-accent bg-accent px-2 py-[3px] text-cream">
        Open
      </span>
    );
  if (status === "waitlist")
    return (
      <span className="mono-label inline-block border border-gold bg-gold/10 px-2 py-[3px] text-gold">
        Waitlist
      </span>
    );
  return (
    <span className="mono-label inline-block border hairline-strong px-2 py-[3px] text-ink-faint">
      Closed
    </span>
  );
}
