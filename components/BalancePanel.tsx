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
        "mono-label inline-block px-2 py-[3px] border",
        isUrgent
          ? "bg-accent text-cream border-accent"
          : "border-gold bg-gold/10 text-gold",
      ].join(" ")}
    >
      Expires in {exp.days}d{isUrgent ? " · urgent" : ""}
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
    <section className="border-b hairline bg-cream-deep/30">
      <div className="mx-auto max-w-[1440px] px-6 py-14 md:px-12 md:py-20">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="mono-label mb-4 text-accent">
              01a · Your Balances
            </div>
            <h2 className="display text-[32px] leading-[1.05] md:text-[40px]">
              A real <em>workspace</em>, not a guess.
            </h2>
            <p className="mt-4 font-display text-[15px] leading-[1.5] text-ink-soft">
              Enter what you actually have. We&apos;ll price the three options
              against your real stash — and flag any balance about to expire.
            </p>
          </div>
          <div className="md:col-span-8">
            <div className="border hairline-strong bg-paper">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b hairline px-5 py-4">
                <div className="mono-label text-ink-faint">
                  Running total · {selectedCards.length} card
                  {selectedCards.length === 1 ? "" : "s"}
                </div>
                <div className="font-display text-[28px] leading-[1] text-ink">
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
                      className="flex flex-wrap items-center gap-4 border-b last:border-b-0 hairline px-5 py-4"
                    >
                      <div className="flex-1 min-w-[180px]">
                        <div className="font-display text-[15px] text-ink">
                          {card.bank} {card.name}
                        </div>
                        <div className="mono-label text-ink-faint">
                          {card.currency} · {card.currencyName}
                        </div>
                      </div>
                      {exp ? <ExpirationChip exp={exp} /> : null}
                      <div className="flex items-center gap-2">
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
                          className="w-[130px] bg-transparent border hairline-strong px-3 py-2 text-right font-[var(--font-jetbrains)] text-ink outline-none focus:border-accent"
                          style={{
                            fontFamily:
                              "var(--font-jetbrains), ui-monospace, monospace",
                          }}
                        />
                        <span className="mono-label w-[40px] text-ink-faint">
                          {card.currency}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-wrap gap-3 border-t hairline px-5 py-4">
                {Object.entries(perCurrency).map(([currency, total]) => (
                  <span
                    key={currency}
                    className="mono-label border hairline-strong px-3 py-[4px]"
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
