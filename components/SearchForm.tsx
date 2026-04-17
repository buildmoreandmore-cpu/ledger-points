"use client";

import { useId, useState } from "react";
import { DESTINATIONS, ORIGINS } from "@/lib/data/routes";
import type { Cabin } from "@/lib/data/routes";

export type SearchFormValues = {
  origin: string;
  destination: string;
  departDate: string;
  cabin: Cabin;
  saverOnly: boolean;
};

type Props = {
  initial?: Partial<SearchFormValues>;
  onSubmit: (values: SearchFormValues) => void;
  isSearching: boolean;
};

const CABINS: { value: Cabin; label: string }[] = [
  { value: "economy", label: "Economy" },
  { value: "premium", label: "Premium Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First" },
];

function defaultDepartDate(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 45);
  return d.toISOString().slice(0, 10);
}

export default function SearchForm({ initial, onSubmit, isSearching }: Props) {
  const originId = useId();
  const destId = useId();
  const dateId = useId();
  const cabinId = useId();
  const saverId = useId();

  const [origin, setOrigin] = useState(initial?.origin ?? "ATL");
  const [destination, setDestination] = useState(
    initial?.destination ?? "NRT"
  );
  const [departDate, setDepartDate] = useState(
    initial?.departDate ?? defaultDepartDate()
  );
  const [cabin, setCabin] = useState<Cabin>(initial?.cabin ?? "business");
  const [saverOnly, setSaverOnly] = useState(initial?.saverOnly ?? true);

  return (
    <section id="search" className="border-b hairline">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="mono-label mb-6 text-accent">
              02 · Search a Flight
            </div>
            <h2 className="display text-[44px] leading-[1.04] md:text-[56px]">
              The same inputs — a <em>different</em> kind of answer.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="font-display text-[18px] leading-[1.55] text-ink-soft">
              Booking sites ask <em>where</em> you&apos;re going. We also ask
              which charts you can reach. That second question is where the
              three-hundred-dollar difference hides. Pick a cabin and a date;
              we&apos;ll price it three ways.
            </p>
          </div>
        </div>

        <form
          className="mt-14 border hairline-strong bg-cream/50"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ origin, destination, departDate, cabin, saverOnly });
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12">
            <div className="border-b md:border-b-0 md:border-r hairline md:col-span-3">
              <FieldLabel id={originId} label="Origin" />
              <select
                id={originId}
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-transparent px-5 pb-5 font-display text-[22px] tracking-tight text-ink outline-none"
              >
                {ORIGINS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div className="border-b md:border-b-0 md:border-r hairline md:col-span-3">
              <FieldLabel id={destId} label="Destination" />
              <select
                id={destId}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent px-5 pb-5 font-display text-[22px] tracking-tight text-ink outline-none"
              >
                {DESTINATIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div className="border-b md:border-b-0 md:border-r hairline md:col-span-3">
              <FieldLabel id={dateId} label="Depart" />
              <input
                id={dateId}
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="w-full bg-transparent px-5 pb-5 font-display text-[18px] tracking-tight text-ink outline-none"
              />
            </div>
            <div className="md:col-span-3">
              <FieldLabel id={cabinId} label="Cabin" />
              <select
                id={cabinId}
                value={cabin}
                onChange={(e) => setCabin(e.target.value as Cabin)}
                className="w-full bg-transparent px-5 pb-5 font-display text-[18px] tracking-tight text-ink outline-none"
              >
                {CABINS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t hairline flex flex-col items-start gap-5 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <label
              htmlFor={saverId}
              className="flex items-center gap-3 cursor-pointer"
            >
              <span
                className={[
                  "relative inline-flex h-[22px] w-[40px] items-center rounded-full border transition-colors",
                  saverOnly
                    ? "bg-ink border-ink"
                    : "bg-paper border-rule-strong",
                ].join(" ")}
              >
                <span
                  className={[
                    "absolute top-[2px] h-[16px] w-[16px] rounded-full transition-all",
                    saverOnly
                      ? "left-[20px] bg-accent"
                      : "left-[2px] bg-ink-faint",
                  ].join(" ")}
                />
              </span>
              <input
                id={saverId}
                type="checkbox"
                checked={saverOnly}
                onChange={(e) => setSaverOnly(e.target.checked)}
                className="sr-only"
              />
              <span className="mono-label text-ink">Saver Awards Only</span>
              <span className="font-display text-[14px] italic text-ink-faint">
                {saverOnly
                  ? "recommended · ignores standard/anytime inflation"
                  : "showing standard awards · 2.2× the saver cost"}
              </span>
            </label>

            <button
              type="submit"
              disabled={isSearching}
              className={[
                "group mono-label px-8 py-3 transition-all",
                isSearching
                  ? "bg-ink-faint text-cream cursor-wait"
                  : "bg-ink text-cream hover:bg-accent-deep",
              ].join(" ")}
            >
              {isSearching ? "Querying inventory" : "Run Three Options"}
              <span className="inline-block pl-2 italic">→</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function FieldLabel({ id, label }: { id: string; label: string }) {
  return (
    <label htmlFor={id} className="block px-5 pt-5 pb-2 mono-label">
      {label}
    </label>
  );
}
