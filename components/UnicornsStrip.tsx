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
      className="border-b hairline bg-cream/50"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-5 md:px-12">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-block h-[8px] w-[8px] rounded-full bg-accent pulse-dot" />
          <span className="mono-label text-accent">
            Live now · today&apos;s unicorns
          </span>
          <span className="mono-label text-ink-faint hidden md:inline">
            · click to pre-fill a search
          </span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
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
      className="shrink-0 w-[260px] snap-start text-left border hairline-strong bg-paper px-4 py-3 transition-colors hover:bg-ink hover:text-cream group"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="mono-label text-accent group-hover:text-cream">
          {u.origin} → {u.destination}
        </span>
        <span className="mono-label border border-accent bg-accent px-2 py-[2px] text-cream">
          {u.seats} seats
        </span>
      </div>
      <div className="font-display italic text-[18px] leading-[1.1] text-ink group-hover:text-cream">
        {u.product}
      </div>
      <div className="mono-label mt-2 text-ink group-hover:text-cream/90">
        {u.points} · {u.program}
      </div>
      <div className="mono-label text-ink-faint group-hover:text-cream/60">
        {u.cardHint}
      </div>
    </button>
  );
}
