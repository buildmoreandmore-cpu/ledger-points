import type { BookingOption } from "@/lib/engine/search";

type Props = {
  options: BookingOption[];
};

export default function EditorialCallout({ options }: Props) {
  const cashOpt = options.find((o) => o.rank.startsWith("01"));
  const bestAward = options.find((o) => o.programKey && o.cpp !== null);

  if (!cashOpt || !bestAward || bestAward.cpp === null) return null;

  const cashValue = cashOpt.cashFare;
  const awardValue = bestAward.awardValueDollars ?? 0;
  const cpp = bestAward.cpp;

  const ratio = cashValue / awardValue;
  const isThrifty = awardValue > 0 && ratio >= 0.85;
  const isSweetSpot = cpp >= 4.5;

  if (!isThrifty && !isSweetSpot) return null;

  if (isSweetSpot) {
    return (
      <CalloutFrame label="Sweet spot alert">
        This route is one of the best uses of{" "}
        <em>{bestAward.currencyFrom} points</em> in 2026 — a{" "}
        <em>{cpp.toFixed(1)}¢/point</em> redemption that&apos;s roughly{" "}
        {Math.round(cpp / 2)}× the program&apos;s baseline valuation.
      </CalloutFrame>
    );
  }

  return (
    <CalloutFrame label="Thrifty Traveler watch">
      Cash fare on this route is historically strong. At{" "}
      <em>${Math.round(cashValue).toLocaleString()}</em> against an equivalent
      award value of <em>${Math.round(awardValue).toLocaleString()}</em>,
      consider paying cash and preserving your points for a higher-value
      redemption later.
    </CalloutFrame>
  );
}

function CalloutFrame({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="mb-4 bg-accent-soft px-4 py-4 md:px-6 md:py-5"
      style={{ borderRadius: "14px" }}
    >
      <div className="mono-label text-accent mb-1.5">{label}</div>
      <p className="text-[15px] leading-[1.5] text-ink md:text-[16px]">
        {children}
      </p>
    </div>
  );
}
