"use client";

import { CARDS } from "@/lib/data/cards";

type Props = {
  selectedCardIds: string[];
  onToggle: (cardId: string) => void;
};

const CHECK = (
  <svg
    width="12"
    height="12"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 7 L6 10 L11 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function CardLibrary({ selectedCardIds, onToggle }: Props) {
  const selected = new Set(selectedCardIds);

  return (
    <section id="wallet" className="border-b hairline">
      <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
        <div className="grid gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <div className="mono-label mb-3 text-accent">01 · Your wallet</div>
            <h2 className="display text-[28px] md:text-[40px]">
              The cards we know <em>speak</em> to each other.
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 md:pt-4">
            <p className="text-[15px] leading-[1.55] text-ink-soft md:text-[16px]">
              Tap the cards you actually hold — not aspirations, not
              pre-approvals. Every option below is gated by what your points
              can reach.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-2.5 md:mt-12 md:grid-cols-4 md:gap-3">
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
                style={{
                  animationDelay: `${i * 40}ms`,
                  borderRadius: "14px",
                }}
                className={[
                  "chip-in group relative text-left border transition-all duration-150",
                  "px-4 py-4 md:px-5 md:py-5 flex flex-col gap-2.5 min-h-[132px] md:min-h-[140px]",
                  isOn
                    ? "bg-ink text-white border-ink card-shadow"
                    : "bg-paper text-ink border-rule-strong hover:-translate-y-[1px] hover:border-accent card-shadow-hover",
                ].join(" ")}
              >
                <div className="flex items-start justify-between">
                  <div className="mono-label">
                    <span
                      className={isOn ? "text-white/70" : "text-ink-faint"}
                    >
                      {card.bank}
                    </span>
                  </div>
                  <span
                    className={[
                      "inline-flex h-5 w-5 items-center justify-center rounded-full",
                      isOn
                        ? "bg-accent text-white"
                        : "bg-transparent border border-rule-strong text-transparent",
                    ].join(" ")}
                  >
                    {CHECK}
                  </span>
                </div>
                <div
                  className={[
                    "font-semibold text-[16px] md:text-[17px] leading-[1.2] mt-auto",
                    isOn ? "text-white" : "text-ink",
                  ].join(" ")}
                >
                  {card.name}
                </div>
                <div
                  className={[
                    "mono-label",
                    isOn ? "text-white/60" : "text-ink-faint",
                  ].join(" ")}
                >
                  {card.currency} · {card.currencyName}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-2 text-ink-faint">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="0.9" />
            <path
              d="M7 4 V7 M7 9.5 V10"
              stroke="currentColor"
              strokeWidth="0.9"
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
