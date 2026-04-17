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
      className="mb-4 bg-accent-soft px-4 py-3 md:px-5 md:py-4 flex flex-wrap items-baseline gap-2 md:gap-3"
      style={{ borderRadius: "12px" }}
    >
      <span
        className="mono-label bg-accent text-white px-2.5 py-1"
        style={{ borderRadius: "999px" }}
      >
        {bonusPct}% bonus
      </span>
      <p className="flex-1 text-[14px] leading-[1.45] text-ink md:text-[15px]">
        {hit.bonus.displayName} until{" "}
        <span className="mono-label text-ink-faint">{hit.bonus.until}</span>.
        Your <em>{fmt.format(hit.rawPoints)}</em> redemption could cost{" "}
        <em>{fmt.format(hit.effectivePoints)} {hit.bonus.from}</em> after the
        bonus.
      </p>
    </div>
  );
}
