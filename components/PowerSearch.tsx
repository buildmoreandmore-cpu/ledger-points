"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import {
  searchMatrix,
  countCombinations,
  UNICORN_CPP_THRESHOLD,
  type MatrixCell,
  type MatrixResult,
} from "@/lib/engine/matrix";
import type { Cabin } from "@/lib/data/routes";

type Props = {
  selectedCardIds: string[];
  onCellClick: (pick: {
    origin: string;
    destination: string;
    date: string;
    cabin: Cabin;
  }) => void;
};

const fmt = new Intl.NumberFormat("en-US");
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const FULL_DATE = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const CABINS: Array<{ value: Cabin; label: string }> = [
  { value: "economy", label: "Economy" },
  { value: "premium", label: "Premium" },
  { value: "business", label: "Business" },
  { value: "first", label: "First" },
];

function PillInput({
  label,
  value,
  onChange,
  placeholder,
  maxPills = 4,
}: {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  maxPills?: number;
}) {
  const [draft, setDraft] = useState("");

  function addPill() {
    const code = draft.trim().toUpperCase();
    if (!code) return;
    if (value.includes(code)) {
      setDraft("");
      return;
    }
    if (value.length >= maxPills) return;
    onChange([...value, code]);
    setDraft("");
  }

  return (
    <div>
      <div className="mono-label mb-1.5">{label}</div>
      <div
        className="flex flex-wrap items-center gap-1.5 bg-surface border hairline-strong px-2 py-2 min-h-[44px]"
        style={{ borderRadius: "10px" }}
      >
        {value.map((p) => (
          <span
            key={p}
            className="mono-label bg-white border hairline-strong inline-flex items-center gap-1 px-2 py-[3px]"
            style={{ borderRadius: "999px" }}
          >
            {p}
            <button
              type="button"
              onClick={() => onChange(value.filter((x) => x !== p))}
              aria-label={`Remove ${p}`}
              className="text-ink-faint hover:text-ink"
              style={{ minHeight: "auto" }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "," || e.key === " ") {
              e.preventDefault();
              addPill();
            } else if (
              e.key === "Backspace" &&
              draft === "" &&
              value.length > 0
            ) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={addPill}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[90px] bg-transparent text-[14px] text-ink outline-none"
          style={{ borderRadius: 0, minHeight: "auto" }}
        />
      </div>
    </div>
  );
}

function todayPlus(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function PowerSearch({ selectedCardIds, onCellClick }: Props) {
  const [origins, setOrigins] = useState<string[]>(["JFK", "EWR"]);
  const [destinations, setDestinations] = useState<string[]>(["CDG", "LHR"]);
  const [dateStart, setDateStart] = useState(todayPlus(45));
  const [dateEnd, setDateEnd] = useState(todayPlus(58));
  const [cabin, setCabin] = useState<Cabin>("business");
  const [result, setResult] = useState<MatrixResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const combinations = useMemo(
    () =>
      countCombinations({
        origins,
        destinations,
        dateStart,
        dateEnd,
        cabin,
        selectedCardIds,
        saverOnly: true,
      }),
    [origins, destinations, dateStart, dateEnd, cabin, selectedCardIds]
  );

  const tooMany = combinations > 500;

  const run = useCallback(() => {
    if (tooMany) return;
    if (!origins.length || !destinations.length) return;
    startTransition(async () => {
      const next = await searchMatrix({
        origins,
        destinations,
        dateStart,
        dateEnd,
        cabin,
        selectedCardIds,
        saverOnly: true,
      });
      setResult(next);
    });
  }, [
    origins,
    destinations,
    dateStart,
    dateEnd,
    cabin,
    selectedCardIds,
    tooMany,
  ]);

  return (
    <div className="mt-4">
      <div
        className="card-shadow border hairline-strong bg-paper overflow-hidden"
        style={{ borderRadius: "16px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-4 md:p-5 border-b md:border-b-0 md:border-r hairline">
            <PillInput
              label="From (up to 4)"
              value={origins}
              onChange={setOrigins}
              placeholder="JFK, EWR, LGA…"
            />
          </div>
          <div className="p-4 md:p-5">
            <PillInput
              label="To (up to 4)"
              value={destinations}
              onChange={setDestinations}
              placeholder="CDG, LHR, FCO…"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-[1fr_1fr_1fr_auto] gap-0 border-t hairline">
          <div className="p-4 md:p-5 border-r hairline">
            <div className="mono-label mb-1.5">Date from</div>
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="w-full bg-surface border hairline-strong px-3 py-2 text-[14px] text-ink outline-none focus:border-accent"
              style={{ borderRadius: "8px" }}
            />
          </div>
          <div className="p-4 md:p-5 md:border-r hairline">
            <div className="mono-label mb-1.5">Date to</div>
            <input
              type="date"
              value={dateEnd}
              min={dateStart}
              onChange={(e) => setDateEnd(e.target.value)}
              className="w-full bg-surface border hairline-strong px-3 py-2 text-[14px] text-ink outline-none focus:border-accent"
              style={{ borderRadius: "8px" }}
            />
          </div>
          <div className="p-4 md:p-5 col-span-2 md:col-span-1 border-t md:border-t-0 md:border-r hairline">
            <div className="mono-label mb-1.5">Cabin</div>
            <select
              value={cabin}
              onChange={(e) => setCabin(e.target.value as Cabin)}
              className="w-full bg-surface border hairline-strong px-3 py-2 text-[14px] text-ink outline-none focus:border-accent"
              style={{ borderRadius: "8px" }}
            >
              {CABINS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-span-2 md:col-span-1 border-t md:border-t-0">
            <button
              type="button"
              onClick={run}
              disabled={isPending || tooMany}
              className={[
                "mono-label w-full h-full px-5 py-4 font-medium transition-colors",
                isPending || tooMany
                  ? "bg-ink-faint text-white"
                  : "bg-[#0a0a0a] text-white hover:opacity-85",
              ].join(" ")}
              style={{ borderRadius: 0 }}
            >
              {isPending ? "Scanning" : "Run matrix →"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 mono-label text-ink-faint">
        Searching · {origins.length} origin
        {origins.length === 1 ? "" : "s"} × {destinations.length} destination
        {destinations.length === 1 ? "" : "s"} × {countDays(dateStart, dateEnd)}{" "}
        days × 1 cabin · {combinations} combination
        {combinations === 1 ? "" : "s"}
        {tooMany ? (
          <span className="ml-2 text-[#dc2626]">
            · over 500 — narrow your range
          </span>
        ) : null}
      </div>

      {result ? (
        <MatrixView
          result={result}
          origins={origins}
          destinations={destinations}
          cabin={cabin}
          onCellClick={onCellClick}
        />
      ) : null}
    </div>
  );
}

function countDays(start: string, end: string): number {
  const a = new Date(`${start}T00:00:00Z`);
  const b = new Date(`${end}T00:00:00Z`);
  const diff = Math.round((b.getTime() - a.getTime()) / (86400 * 1000));
  return Math.max(1, diff + 1);
}

function MatrixView({
  result,
  origins,
  destinations,
  cabin,
  onCellClick,
}: {
  result: MatrixResult;
  origins: string[];
  destinations: string[];
  cabin: Cabin;
  onCellClick: Props["onCellClick"];
}) {
  const pairs: Array<{ origin: string; destination: string }> = [];
  for (const o of origins) {
    for (const d of destinations) {
      if (o !== d) pairs.push({ origin: o, destination: d });
    }
  }

  const dates = Array.from(new Set(result.cells.map((c) => c.date))).sort();

  const cellMap = new Map<string, MatrixCell>();
  for (const c of result.cells) {
    cellMap.set(`${c.origin}-${c.destination}-${c.date}`, c);
  }

  return (
    <div className="mt-5">
      {result.best ? (
        <button
          type="button"
          onClick={() =>
            onCellClick({
              origin: result.best!.origin,
              destination: result.best!.destination,
              date: result.best!.date,
              cabin,
            })
          }
          className="mb-4 w-full text-left bg-accent-soft px-4 py-3 flex flex-col md:flex-row md:items-center md:gap-4 hover:bg-accent hover:text-white transition-colors group"
          style={{ borderRadius: "12px" }}
        >
          <span className="mono-label text-accent group-hover:text-white">
            Best result
          </span>
          <span className="text-[14px] md:text-[15px] text-ink group-hover:text-white">
            {result.best.origin} → {result.best.destination} ·{" "}
            {FULL_DATE.format(new Date(`${result.best.date}T00:00:00Z`))} ·{" "}
            <strong>{fmt.format(result.best.points ?? 0)}</strong>{" "}
            {result.best.program} · ${fmt.format(result.best.fees)} fees
          </span>
          <span className="mono-label ml-auto group-hover:text-white">
            Open detail →
          </span>
        </button>
      ) : null}

      <div
        className="bg-paper card-shadow border hairline-strong overflow-auto"
        style={{ borderRadius: "14px" }}
      >
        <table className="w-full text-left text-[12px] md:text-[13px] border-collapse">
          <thead>
            <tr className="bg-surface">
              <th className="sticky left-0 bg-surface px-3 py-2 mono-label text-ink-faint border-b border-r hairline">
                Route
              </th>
              {dates.map((d) => (
                <th
                  key={d}
                  className="px-2 py-2 mono-label text-ink-faint border-b hairline whitespace-nowrap text-center min-w-[72px]"
                >
                  {DATE_FMT.format(new Date(`${d}T00:00:00Z`))}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pairs.map(({ origin, destination }) => (
              <tr key={`${origin}-${destination}`}>
                <th className="sticky left-0 bg-paper px-3 py-2 mono-label text-ink border-b border-r hairline whitespace-nowrap">
                  {origin} → {destination}
                </th>
                {dates.map((d) => {
                  const cell = cellMap.get(`${origin}-${destination}-${d}`);
                  return (
                    <td
                      key={d}
                      className="border-b hairline p-1 text-center align-middle"
                    >
                      <Cell
                        cell={cell}
                        onClick={() =>
                          onCellClick({ origin, destination, date: d, cabin })
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Cell({
  cell,
  onClick,
}: {
  cell: MatrixCell | undefined;
  onClick: () => void;
}) {
  if (!cell || cell.points === null) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full py-2 text-ink-faint hover:bg-surface"
        style={{ borderRadius: 0, minHeight: "auto" }}
      >
        —
      </button>
    );
  }
  const isUnicorn =
    (cell.cpp ?? 0) >= UNICORN_CPP_THRESHOLD &&
    cell.availability === "open";
  const baseClasses = "w-full px-2 py-1.5 text-[11px] md:text-[12px] font-semibold";
  const style = { borderRadius: "6px", minHeight: "auto" } as const;

  if (cell.availability === "open") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={[
          baseClasses,
          isUnicorn
            ? "bg-white text-accent border border-accent"
            : "bg-accent text-white hover:opacity-85",
        ].join(" ")}
        style={style}
        title={`${cell.program} · ${cell.cpp?.toFixed(1)}¢ cpp`}
      >
        {isUnicorn ? "♛ " : ""}
        {fmt.format(cell.points).replace(",000", "k")}
      </button>
    );
  }
  if (cell.availability === "waitlist") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={[baseClasses, "bg-gold-soft text-gold hover:opacity-85"].join(
          " "
        )}
        style={style}
        title={`${cell.program} · waitlist`}
      >
        WL
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-2 py-1.5 text-ink-faint hover:bg-surface"
      style={{ borderRadius: "6px", minHeight: "auto" }}
    >
      —
    </button>
  );
}
