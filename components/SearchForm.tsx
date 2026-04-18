"use client";

import { useId, useState } from "react";
import { DESTINATIONS, ORIGINS } from "@/lib/data/routes";
import type { Cabin } from "@/lib/data/routes";

export type TripType = "round-trip" | "one-way";

export type SearchFormValues = {
  origin: string;
  destination: string;
  departDate: string;
  returnDate: string;
  tripType: TripType;
  cabin: Cabin;
  saverOnly: boolean;
  cheapestFirst: boolean;
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

function defaultReturnDate(depart: string): string {
  const d = new Date(`${depart}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 7);
  return d.toISOString().slice(0, 10);
}

export default function SearchForm({ initial, onSubmit, isSearching }: Props) {
  const originId = useId();
  const destId = useId();
  const dateId = useId();
  const returnId = useId();
  const cabinId = useId();
  const saverId = useId();
  const cheapId = useId();

  const [origin, setOrigin] = useState(initial?.origin ?? "ATL");
  const [destination, setDestination] = useState(
    initial?.destination ?? "NRT"
  );
  const [departDate, setDepartDate] = useState(
    initial?.departDate ?? defaultDepartDate()
  );
  const [returnDate, setReturnDate] = useState(
    initial?.returnDate ?? defaultReturnDate(initial?.departDate ?? defaultDepartDate())
  );
  const [tripType, setTripType] = useState<TripType>(
    initial?.tripType ?? "round-trip"
  );
  const [cabin, setCabin] = useState<Cabin>(initial?.cabin ?? "business");
  const [saverOnly, setSaverOnly] = useState(initial?.saverOnly ?? true);
  const [cheapestFirst, setCheapestFirst] = useState(
    initial?.cheapestFirst ?? false
  );

  return (
    <section id="search-form" className="">
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-14 md:pb-20">
        <div className="grid gap-6 md:grid-cols-12 md:gap-10 mb-8">
          <div className="md:col-span-6">
            <div className="mono-label mb-3 text-accent">
              02 · Search a flight
            </div>
            <h2 className="display text-[28px] md:text-[40px]">
              The same inputs — a <em>different</em> kind of answer.
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:pt-4">
            <p className="text-[15px] leading-[1.55] text-ink-soft md:text-[16px]">
              Booking sites ask <em>where</em> you&apos;re going. We also ask
              which charts you can reach. Pick a cabin and a date; we&apos;ll
              price it three ways.
            </p>
          </div>
        </div>

        <form
          className="card-shadow border hairline-strong bg-paper overflow-hidden"
          style={{ borderRadius: "16px" }}
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              origin,
              destination,
              departDate,
              returnDate,
              tripType,
              cabin,
              saverOnly,
              cheapestFirst,
            });
          }}
        >
          <div className="border-b hairline px-4 py-3 md:px-5 flex flex-wrap items-center gap-2">
            <TripTypeButton
              active={tripType === "round-trip"}
              onClick={() => setTripType("round-trip")}
            >
              Round-trip
            </TripTypeButton>
            <TripTypeButton
              active={tripType === "one-way"}
              onClick={() => setTripType("one-way")}
            >
              One-way
            </TripTypeButton>
          </div>
          <div className={tripType === "round-trip" ? "grid grid-cols-2 md:grid-cols-5" : "grid grid-cols-2 md:grid-cols-4"}>
            <div className="border-b md:border-b-0 md:border-r hairline">
              <FieldLabel id={originId} label="Origin" />
              <select
                id={originId}
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-transparent px-4 pb-4 font-medium text-[18px] md:text-[22px] text-ink outline-none"
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
              <FieldLabel id={destId} label="Destination" />
              <select
                id={destId}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-transparent px-4 pb-4 font-medium text-[18px] md:text-[22px] text-ink outline-none"
                style={{ borderRadius: 0 }}
              >
                {DESTINATIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:border-r hairline border-t md:border-t-0">
              <FieldLabel id={dateId} label="Depart" />
              <input
                id={dateId}
                type="date"
                value={departDate}
                onChange={(e) => {
                  setDepartDate(e.target.value);
                  if (tripType === "round-trip" && returnDate < e.target.value) {
                    setReturnDate(defaultReturnDate(e.target.value));
                  }
                }}
                className="w-full bg-transparent px-4 pb-4 text-[15px] md:text-[17px] text-ink outline-none"
                style={{ borderRadius: 0 }}
              />
            </div>
            {tripType === "round-trip" ? (
              <div className="md:border-r hairline border-l md:border-l-0 border-t md:border-t-0">
                <FieldLabel id={returnId} label="Return" />
                <input
                  id={returnId}
                  type="date"
                  value={returnDate}
                  min={departDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-transparent px-4 pb-4 text-[15px] md:text-[17px] text-ink outline-none"
                  style={{ borderRadius: 0 }}
                />
              </div>
            ) : null}
            <div className="border-l md:border-l-0 border-t md:border-t-0">
              <FieldLabel id={cabinId} label="Cabin" />
              <select
                id={cabinId}
                value={cabin}
                onChange={(e) => setCabin(e.target.value as Cabin)}
                className="w-full bg-transparent px-4 pb-4 text-[15px] md:text-[17px] text-ink outline-none"
                style={{ borderRadius: 0 }}
              >
                {CABINS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t hairline flex flex-col items-start gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6 w-full md:w-auto">
              <ToggleRow
                id={saverId}
                on={saverOnly}
                onChange={setSaverOnly}
                label="Saver awards only"
                hint={
                  saverOnly
                    ? "Ignoring standard/anytime inflation"
                    : "Showing standard awards at 2.2× saver"
                }
              />
              <ToggleRow
                id={cheapId}
                on={cheapestFirst}
                onChange={setCheapestFirst}
                label="Cheapest points first"
                hint={
                  cheapestFirst
                    ? "Ranking by lowest point cost (not best value)"
                    : "Ranking by best value (cents per point)"
                }
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className={[
                "mono-label w-full md:w-auto px-6 py-3 transition-all font-medium shrink-0",
                isSearching
                  ? "bg-ink-faint text-white cursor-wait"
                  : "bg-[#0a0a0a] text-white hover:bg-[#0a0a0a]/85",
              ].join(" ")}
            >
              {isSearching ? "Querying inventory" : "Run three options →"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function FieldLabel({ id, label }: { id: string; label: string }) {
  return (
    <label htmlFor={id} className="block px-4 pt-4 pb-2 mono-label">
      {label}
    </label>
  );
}

function TripTypeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "text-[13px] font-medium px-3 py-1.5 transition-colors",
        active
          ? "bg-ink text-white"
          : "bg-transparent text-ink-faint hover:text-ink",
      ].join(" ")}
      style={{ borderRadius: "999px", minHeight: "auto" }}
    >
      {children}
    </button>
  );
}

function ToggleRow({
  id,
  on,
  onChange,
  label,
  hint,
}: {
  id: string;
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer"
      style={{ minHeight: 0 }}
    >
      <span
        className={[
          "relative inline-flex h-[22px] w-[38px] items-center rounded-full border transition-colors shrink-0",
          on
            ? "bg-[#0a0a0a] border-[#0a0a0a]"
            : "bg-surface border-rule-strong",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-[2px] h-[16px] w-[16px] rounded-full transition-all",
            on ? "left-[19px] bg-white" : "left-[2px] bg-ink-faint",
          ].join(" ")}
        />
      </span>
      <input
        id={id}
        type="checkbox"
        checked={on}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="flex flex-col">
        <span className="mono-label text-ink">{label}</span>
        <span className="text-[12px] text-ink-faint leading-tight">
          {hint}
        </span>
      </span>
    </label>
  );
}
