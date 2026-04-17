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
    <div className="border-t hairline bg-surface">
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-10">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <div className="mono-label text-accent">Flex dates · ±3 days</div>
            <p className="mt-1.5 text-[14px] leading-[1.5] text-ink-soft md:text-[15px] max-w-[580px]">
              Terracotta dot = saver seats open, gold = waitlist, faint = no
              space. Tap a day to re-center the search.
            </p>
          </div>
          <div className="mono-label hidden text-ink-faint md:block">
            Scroll / tap a day
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-1 px-1 md:grid md:grid-cols-7 md:gap-2 md:overflow-visible md:px-0 md:mx-0">
          {flex.map((day) => {
            const label = formatLabel(day.date);
            const isSelected = day.date === selectedDate;
            return (
              <button
                key={day.date}
                type="button"
                onClick={() => onPick(day.date)}
                disabled={isSearching || isSelected}
                style={{ borderRadius: "12px" }}
                className={[
                  "shrink-0 w-[92px] md:w-auto flex flex-col gap-2 border px-3 py-3 text-left transition-colors snap-start",
                  isSelected
                    ? "bg-ink text-white border-ink card-shadow"
                    : "border-rule-strong bg-paper hover:border-accent hover:-translate-y-[1px] card-shadow-hover",
                ].join(" ")}
              >
                <div
                  className={[
                    "mono-label",
                    isSelected ? "text-white/70" : "text-ink-faint",
                  ].join(" ")}
                >
                  {label.weekday}
                </div>
                <div
                  className={[
                    "font-semibold text-[15px] md:text-[17px] leading-[1]",
                    isSelected ? "text-white" : "text-ink",
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
                        isSelected ? "text-white/60" : "text-ink-faint",
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
