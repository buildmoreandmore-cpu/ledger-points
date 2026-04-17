"use client";

import { UNICORNS, type Unicorn } from "@/lib/data/unicorns";
import type { Cabin } from "@/lib/data/routes";

type Props = {
  onPick: (pick: {
    origin: string;
    destination: string;
    cabin: Cabin;
  }) => void;
};

export default function UnicornsStrip({ onPick }: Props) {
  return (
    <section
      aria-label="Today's unicorns"
      className="border-b hairline bg-surface"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-4 md:px-8 md:py-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block h-[8px] w-[8px] rounded-full bg-accent pulse-dot" />
          <span className="mono-label text-accent">
            Live · today&apos;s unicorns
          </span>
          <span className="mono-label text-ink-faint hidden md:inline">
            · tap to pre-fill
          </span>
        </div>
        <div className="flex gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory -mx-1 px-1">
          {UNICORNS.map((u) => (
            <UnicornTile
              key={u.id}
              u={u}
              onPick={() =>
                onPick({
                  origin: u.origin,
                  destination: u.destination,
                  cabin: u.cabin,
                })
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function UnicornTile({ u, onPick }: { u: Unicorn; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      style={{ borderRadius: "14px" }}
      className="shrink-0 w-[240px] md:w-[260px] snap-start text-left border border-rule-strong bg-paper px-4 py-3 transition-all hover:border-accent hover:-translate-y-[1px] card-shadow-hover group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="mono-label text-accent">
          {u.origin} → {u.destination}
        </span>
        <span
          className="mono-label bg-accent px-2 py-[2px] text-white"
          style={{ borderRadius: "999px" }}
        >
          {u.seats} seats
        </span>
      </div>
      <div className="font-semibold text-[16px] md:text-[17px] leading-[1.2] text-ink">
        {u.product}
      </div>
      <div className="mono-label mt-2 text-ink">
        {u.points} · {u.program}
      </div>
      <div className="mono-label text-ink-faint">{u.cardHint}</div>
    </button>
  );
}
