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
    <div
      className="card-shadow border hairline-strong bg-paper overflow-hidden"
      style={{ borderRadius: "16px" }}
    >
      <div className="grid grid-cols-2 md:grid-cols-[1fr_1.4fr_1fr_auto]">
        <div className="border-b md:border-b-0 md:border-r hairline">
          <label className="block mono-label px-4 pt-4 pb-1.5">Origin</label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full bg-transparent px-4 pb-4 font-medium text-[18px] md:text-[20px] text-ink outline-none"
            style={{ borderRadius: 0 }}
          >
            {ORIGINS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="border-b md:border-b-0 md:border-r hairline border-l md:border-l-0">
          <label className="block mono-label px-4 pt-4 pb-1.5">Region</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region)}
            className="w-full bg-transparent px-4 pb-4 font-medium text-[18px] md:text-[20px] text-ink outline-none"
            style={{ borderRadius: 0 }}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {REGION_LABELS[r]}
              </option>
            ))}
          </select>
        </div>

        <div className="md:border-r hairline">
          <label className="block mono-label px-4 pt-4 pb-1.5">Rank by</label>
          <select
            value={rankBy}
            onChange={(e) => setRankBy(e.target.value as "points" | "cpp")}
            className="w-full bg-transparent px-4 pb-4 text-[15px] md:text-[16px] text-ink outline-none"
            style={{ borderRadius: 0 }}
          >
            <option value="cpp">Highest cpp</option>
            <option value="points">Lowest points</option>
          </select>
        </div>

        <div className="border-l md:border-l-0 col-span-2 md:col-span-1">
          <button
            type="button"
            onClick={run}
            disabled={isPending}
            className={[
              "mono-label w-full h-full px-5 py-4 transition-colors font-medium",
              isPending
                ? "bg-ink-faint text-white"
                : "bg-accent text-white hover:bg-accent-deep",
            ].join(" ")}
            style={{ borderRadius: 0 }}
          >
            {isPending ? "Scanning" : "Explore →"}
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
                    "flex flex-col gap-2.5 p-4 md:p-5",
                    i > 0 ? "border-t md:border-t-0 hairline" : "",
                    i % 3 !== 0 ? "md:border-l hairline" : "",
                    i >= 3 ? "md:border-t hairline" : "",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mono-label text-accent">
                        {r.destination} · {r.destinationCity}
                      </div>
                      <div className="font-semibold text-[17px] md:text-[18px] leading-[1.25] text-ink">
                        {r.bestProgram ?? "No transfer path"}
                      </div>
                    </div>
                    <AvailabilityPill status={r.availability} />
                  </div>

                  <div>
                    <span className="display text-[26px] md:text-[30px] leading-[1] text-ink">
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
                    className="mt-auto mono-label bg-accent text-white px-4 py-2.5 transition-colors hover:bg-accent-deep font-medium"
                  >
                    Search this route →
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 md:px-5 py-8 text-[15px] text-ink-soft">
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
  const base = "mono-label inline-flex items-center px-2.5 py-[3px]";
  const style = { borderRadius: "999px" };
  if (status === "open")
    return (
      <span className={`${base} bg-accent text-white`} style={style}>
        Open
      </span>
    );
  if (status === "waitlist")
    return (
      <span className={`${base} bg-gold-soft text-gold`} style={style}>
        Waitlist
      </span>
    );
  return (
    <span className={`${base} bg-surface text-ink-faint`} style={style}>
      Closed
    </span>
  );
}
