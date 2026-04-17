"use client";

import { CARDS } from "@/lib/data/cards";

type Props = {
  selectedCardIds: string[];
  onToggle: (cardId: string) => void;
};

const CHECK = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 7 L6 10 L11 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function CardLibrary({ selectedCardIds, onToggle }: Props) {
  const selected = new Set(selectedCardIds);

  return (
    <section id="wallet" className="border-b hairline">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="mono-label mb-6 text-accent">01 · Your Wallet</div>
            <h2 className="display text-[44px] leading-[1.04] md:text-[56px]">
              The cards we know <em>speak</em> to each other.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="font-display text-[18px] leading-[1.55] text-ink-soft">
              Tap the cards you actually hold — not aspirations, not
              pre-approvals. Every option we surface below is gated by what your
              points can reach. No wishful thinking.
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
          {CARDS.map((card, i) => {
            const isOn = selected.has(card.id);
            return (
              <button
                key={card.id}
                type="button"
                role="switch"
                aria-checked={isOn}
                aria-label={`${card.bank} ${card.name}`}
                onClick={() => onToggle(card.id)}
                style={{ animationDelay: `${i * 45}ms` }}
                className={[
                  "chip-in group relative text-left border transition-all duration-150",
                  "px-5 py-5 flex flex-col gap-3 min-h-[140px]",
                  isOn
                    ? "bg-ink text-cream border-ink"
                    : "bg-paper text-ink hairline-strong hover:-translate-y-px hover:border-ink",
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <div className="mono-label">
                    <span className={isOn ? "text-cream" : "text-ink-faint"}>
                      {card.bank}
                    </span>
                  </div>
                  <span
                    className={[
                      "inline-flex h-5 w-5 items-center justify-center border",
                      isOn
                        ? "border-accent bg-accent text-cream"
                        : "border-rule-strong text-transparent",
                    ].join(" ")}
                  >
                    {CHECK}
                  </span>
                </div>
                <div
                  className={[
                    "font-display text-[22px] leading-[1.12] mt-auto",
                    isOn ? "text-cream" : "text-ink",
                  ].join(" ")}
                >
                  {card.name}
                </div>
                <div
                  className={[
                    "mono-label",
                    isOn ? "text-cream/70" : "text-ink-faint",
                  ].join(" ")}
                >
                  {card.currency} · {card.currencyName}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center gap-3 text-ink-faint">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="0.8" />
            <path
              d="M7 4 V7 M7 9.5 V10"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </svg>
          <span className="mono-label">
            Balances are illustrative — the engine uses the issuer, not your
            number.
          </span>
        </div>
      </div>
    </section>
  );
}
