"use client";

import {
  filterAndRankMoves,
  type StrategyMove,
} from "@/lib/data/strategyMoves";
import { CARD_BY_ID, type CardCurrency } from "@/lib/data/cards";
import type { Cabin } from "@/lib/data/routes";

type Props = {
  selectedCardIds: string[];
  balanceByCurrency: Partial<Record<CardCurrency, number>>;
  onRunSearch: (prefill: {
    origin: string;
    destination: string;
    cabin: Cabin;
  }) => void;
  onPickCard: (cardId: string) => void;
};

export default function StrategyMoves({
  selectedCardIds,
  balanceByCurrency,
  onRunSearch,
  onPickCard,
}: Props) {
  const selectedCurrencies = new Set<CardCurrency>();
  for (const id of selectedCardIds) {
    const card = CARD_BY_ID[id];
    if (card) selectedCurrencies.add(card.currency);
  }

  const hasEnough = selectedCardIds.length >= 2;
  const moves = hasEnough
    ? filterAndRankMoves({
        selectedCardIds,
        balanceByCurrency,
        selectedCurrencies,
      })
    : [];

  return (
    <section
      id="strategy-moves"
      aria-label="Your next move"
      className="border-b hairline"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-8 md:py-16">
        <div className="mb-8 grid gap-5 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <div className="mono-label mb-2 text-accent">
              Your next move · Updated daily
            </div>
            <h2 className="display text-[26px] leading-[1.05] md:text-[38px]">
              Five moves that <em>earn you more</em> than your next search.
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:pt-4">
            <p className="text-[14px] leading-[1.55] text-ink-soft md:text-[15px]">
              Based on the cards you&apos;ve added, the balances you hold, and
              the transfer bonuses running right now.
            </p>
          </div>
        </div>

        {!hasEnough ? (
          <Placeholder>
            Add the cards you hold to see your personalized moves.
          </Placeholder>
        ) : moves.length === 0 ? (
          <Placeholder>
            Your wallet is well-optimized. Check back when new transfer bonuses
            run.
          </Placeholder>
        ) : (
          <ul className="flex flex-col gap-3 md:gap-4">
            {moves.map((m) => (
              <MoveCard
                key={m.id}
                m={m}
                onRunSearch={onRunSearch}
                onPickCard={onPickCard}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-surface px-5 py-8 text-center text-[15px] text-ink-soft md:text-[16px]"
      style={{ borderRadius: "16px" }}
    >
      {children}
    </div>
  );
}

function MoveCard({
  m,
  onRunSearch,
  onPickCard,
}: {
  m: StrategyMove;
  onRunSearch: Props["onRunSearch"];
  onPickCard: Props["onPickCard"];
}) {
  const urgent = m.urgency?.days !== undefined && m.urgency.days <= 14;
  const buttonLabel =
    m.actionType === "search"
      ? "See the flight →"
      : m.actionType === "card"
      ? "See the card →"
      : null;

  return (
    <li
      className="bg-paper card-shadow border hairline-strong p-5 md:p-6 flex flex-col gap-4"
      style={{ borderRadius: "16px" }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="mono-label bg-surface px-2.5 py-[3px] text-ink"
          style={{ borderRadius: "999px" }}
        >
          {m.type}
        </span>
        {m.urgency ? (
          <span
            className={[
              "mono-label px-2.5 py-[3px]",
              urgent
                ? "bg-[#dc2626] text-white"
                : "bg-accent-soft text-accent",
            ].join(" ")}
            style={{ borderRadius: "999px" }}
          >
            {m.urgency.label}
          </span>
        ) : null}
      </div>

      <h3 className="display text-[22px] md:text-[26px] leading-[1.2] text-ink">
        {m.move}
      </h3>

      <p className="text-[14px] leading-[1.55] text-ink-soft md:text-[15px]">
        {m.reasoning}
      </p>

      <div className="border-t hairline pt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="flex flex-col gap-1">
          <div>
            <span className="mono-label text-accent">Impact · </span>
            <span className="font-semibold text-[15px] text-ink">
              {m.impact.value}
            </span>
            <span className="mono-label text-ink-faint"> {m.impact.label}</span>
          </div>
          <div>
            <span className="mono-label text-ink-faint">Path · </span>
            <span className="text-[13px] text-ink-soft">{m.path}</span>
          </div>
        </div>

        {buttonLabel ? (
          <button
            type="button"
            onClick={() => {
              if (m.actionType === "search" && m.searchPrefill) {
                onRunSearch(m.searchPrefill);
              } else if (m.actionType === "card" && m.cardId) {
                onPickCard(m.cardId);
              }
            }}
            className="mono-label border hairline-strong bg-white px-4 py-2 text-ink hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a] transition-colors font-medium self-start md:self-auto shrink-0"
          >
            {buttonLabel}
          </button>
        ) : null}
      </div>
    </li>
  );
}
