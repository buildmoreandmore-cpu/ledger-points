"use client";

import { CARD_BY_ID, type Card, type CardCurrency } from "@/lib/data/cards";
import type { ExpirationInfo } from "@/lib/engine/expiration";

export type BalanceMap = Record<string, number>;
export type ExpirationMap = Record<string, ExpirationInfo>;

type Props = {
  selectedCardIds: string[];
  balances: BalanceMap;
  expirations: ExpirationMap;
  onChange: (cardId: string, value: number) => void;
};

const fmt = new Intl.NumberFormat("en-US");

function totalByCurrency(
  selected: string[],
  balances: BalanceMap
): Record<CardCurrency, number> {
  const totals: Partial<Record<CardCurrency, number>> = {};
  for (const id of selected) {
    const card = CARD_BY_ID[id];
    if (!card) continue;
    totals[card.currency] = (totals[card.currency] ?? 0) + (balances[id] ?? 0);
  }
  return totals as Record<CardCurrency, number>;
}

function ExpirationChip({ exp }: { exp: ExpirationInfo }) {
  if (!exp.hasExpiration) return null;
  const isUrgent = exp.urgency === "urgent";
  return (
    <span
      className={[
        "mono-label inline-flex items-center px-2.5 py-[3px]",
        isUrgent
          ? "bg-accent text-white"
          : "bg-gold-soft text-gold",
      ].join(" ")}
      style={{ borderRadius: "999px" }}
    >
      {exp.days}d{isUrgent ? " · urgent" : ""}
    </span>
  );
}

export default function BalancePanel({
  selectedCardIds,
  balances,
  expirations,
  onChange,
}: Props) {
  if (!selectedCardIds.length) return null;

  const selectedCards: Card[] = selectedCardIds
    .map((id) => CARD_BY_ID[id])
    .filter(Boolean);

  const grandTotal = selectedCards.reduce(
    (sum, c) => sum + (balances[c.id] ?? 0),
    0
  );
  const perCurrency = totalByCurrency(selectedCardIds, balances);

  return (
    <section className="border-b hairline">
      <div className="mx-auto max-w-[1200px] px-4 pb-10 md:px-8 md:pb-14">
        <div>
          <div>
            <div
              className="bg-paper card-shadow border hairline-strong"
              style={{ borderRadius: "16px" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b hairline px-4 py-3.5 md:px-5 md:py-4">
                <div className="mono-label text-ink-faint">
                  Running total · {selectedCards.length} card
                  {selectedCards.length === 1 ? "" : "s"}
                </div>
                <div className="display text-[22px] md:text-[26px] text-ink">
                  {fmt.format(grandTotal)} pts
                </div>
              </div>

              <ul>
                {selectedCards.map((card) => {
                  const value = balances[card.id] ?? card.defaultPoints;
                  const exp = expirations[card.id];
                  return (
                    <li
                      key={card.id}
                      className="grid grid-cols-[1fr_auto] gap-3 border-b last:border-b-0 hairline px-4 py-3 md:grid-cols-[1fr_auto_auto] md:px-5 md:py-4 md:gap-4 md:items-center"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-[14px] md:text-[15px] text-ink truncate">
                          {card.bank} {card.name}
                        </div>
                        <div className="mono-label text-ink-faint flex items-center gap-2 flex-wrap">
                          <span>{card.currency} · {card.currencyName}</span>
                          {exp ? <ExpirationChip exp={exp} /> : null}
                        </div>
                      </div>
                      <div className="hidden md:block">
                        {/* chip slot for alignment on desktop */}
                      </div>
                      <div className="flex items-center gap-2 justify-self-end">
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          step={1000}
                          value={value}
                          onChange={(e) => {
                            const n = Math.max(
                              0,
                              Number(e.target.value || 0)
                            );
                            onChange(card.id, n);
                          }}
                          aria-label={`${card.bank} ${card.name} balance`}
                          className="w-[120px] md:w-[140px] bg-surface border hairline-strong px-3 py-1.5 text-right text-[14px] font-medium text-ink outline-none focus:border-accent"
                          style={{
                            fontFamily:
                              "var(--font-jetbrains), ui-monospace, monospace",
                          }}
                        />
                        <span className="mono-label w-[36px] text-ink-faint">
                          {card.currency}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-wrap gap-2 border-t hairline px-4 py-3.5 md:px-5 md:py-4">
                {Object.entries(perCurrency).map(([currency, total]) => (
                  <span
                    key={currency}
                    className="mono-label bg-surface px-2.5 py-1 text-ink"
                    style={{ borderRadius: "999px" }}
                  >
                    {currency} · {fmt.format(total)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
