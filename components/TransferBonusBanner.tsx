import type { BookingOption } from "@/lib/engine/search";
import { findBonusFor } from "@/lib/data/transferBonuses";

type Props = {
  options: BookingOption[];
};

export default function TransferBonusBanner({ options }: Props) {
  let hit: ReturnType<typeof findBonusFor> | null = null;
  for (const o of options) {
    if (!o.programKey || !o.currencyFrom || !o.pointsRequired) continue;
    const match = findBonusFor(o.programKey, o.currencyFrom, o.pointsRequired);
    if (match) {
      hit = match;
      break;
    }
  }
  if (!hit) return null;

  const fmt = new Intl.NumberFormat("en-US");
  const bonusPct = Math.round(hit.bonus.bonus * 100);

  return (
    <div
      className="mb-6 border-l-[3px] bg-accent/5 px-5 py-4 flex flex-wrap items-baseline gap-3"
      style={{ borderLeftColor: "var(--accent)" }}
    >
      <span className="mono-label text-accent">
        Limited · {bonusPct}% transfer bonus
      </span>
      <p className="flex-1 font-display text-[15px] leading-[1.45] text-ink">
        {hit.bonus.displayName} until{" "}
        <span className="mono-label text-ink-faint">{hit.bonus.until}</span>.
        Move points now — your{" "}
        <em className="italic">
          {fmt.format(hit.rawPoints)} {hit.programKey.split(" ")[0]}
        </em>{" "}
        redemption could cost only{" "}
        <em className="italic not-italic font-semibold">
          {fmt.format(hit.effectivePoints)} {hit.bonus.from}
        </em>{" "}
        after the bonus.
      </p>
    </div>
  );
}
