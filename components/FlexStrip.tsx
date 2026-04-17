"use client";

import type { FlexDayResult } from "@/lib/engine/search";

type Props = {
  flex: FlexDayResult[];
  selectedDate: string;
  onPick: (date: string) => void;
  isSearching: boolean;
};

const WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const DAY = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

function formatLabel(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return {
    weekday: WEEKDAY.format(d).toUpperCase(),
    day: DAY.format(d),
  };
}

function statusClass(status: "open" | "waitlist" | "none"): string {
  if (status === "open") return "bg-accent";
  if (status === "waitlist") return "bg-gold";
  return "bg-rule-strong";
}

export default function FlexStrip({
  flex,
  selectedDate,
  onPick,
  isSearching,
}: Props) {
  if (!flex.length) return null;
  return (
    <div className="border-t hairline bg-cream-deep/25">
      <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-12">
        <div className="flex items-end justify-between gap-6 mb-6">
          <div>
            <div className="mono-label text-accent">
              Flexible Dates · ±3 Days
            </div>
            <p className="mt-2 font-display text-[18px] text-ink-soft">
              Award space rarely lines up with your first-choice date. A
              terracotta dot means saver seats are open; gold means waitlist;
              faint means the chart is closed that day.
            </p>
          </div>
          <div className="mono-label hidden text-ink-faint md:block">
            Click any day to re-run
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {flex.map((day) => {
            const label = formatLabel(day.date);
            const isSelected = day.date === selectedDate;
            return (
              <button
                key={day.date}
                type="button"
                onClick={() => onPick(day.date)}
                disabled={isSearching || isSelected}
                className={[
                  "flex flex-col gap-3 border px-3 py-4 text-left transition-colors",
                  isSelected
                    ? "bg-ink text-cream border-ink"
                    : "border-rule hover:border-ink",
                ].join(" ")}
              >
                <div
                  className={[
                    "mono-label",
                    isSelected ? "text-cream/70" : "text-ink-faint",
                  ].join(" ")}
                >
                  {label.weekday}
                </div>
                <div
                  className={[
                    "font-display text-[20px] leading-[1]",
                    isSelected ? "text-cream" : "text-ink",
                  ].join(" ")}
                >
                  {label.day}
                </div>
                <div className="mt-auto flex items-center gap-1 flex-wrap">
                  {day.programs.slice(0, 4).map((p) => (
                    <span
                      key={p.program}
                      title={`${p.program}: ${p.status}`}
                      className={[
                        "h-[6px] w-[6px] rounded-full",
                        statusClass(p.status),
                      ].join(" ")}
                    />
                  ))}
                  {day.programs.length > 4 ? (
                    <span
                      className={[
                        "mono-label",
                        isSelected ? "text-cream/60" : "text-ink-faint",
                      ].join(" ")}
                    >
                      +{day.programs.length - 4}
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
