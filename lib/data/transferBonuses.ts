import type { CardCurrency } from "./cards";

export type TransferBonus = {
  from: CardCurrency;
  toPattern: RegExp;
  bonus: number;
  until: string;
  displayName: string;
};

export const TRANSFER_BONUSES: TransferBonus[] = [
  {
    from: "UR",
    toPattern: /virgin atlantic/i,
    bonus: 0.30,
    until: "October 15, 2026",
    displayName: "Chase Ultimate Rewards → Virgin Atlantic",
  },
  {
    from: "MR",
    toPattern: /flying blue|air france/i,
    bonus: 0.25,
    until: "September 30, 2026",
    displayName: "Amex Membership Rewards → Flying Blue",
  },
  {
    from: "C1",
    toPattern: /lifemiles|avianca/i,
    bonus: 0.20,
    until: "November 1, 2026",
    displayName: "Capital One Miles → Avianca LifeMiles",
  },
];

export type ActiveBonus = {
  bonus: TransferBonus;
  programKey: string;
  rawPoints: number;
  effectivePoints: number;
};

export function findBonusFor(
  programKey: string,
  from: CardCurrency | null,
  rawPoints: number
): ActiveBonus | null {
  if (!from) return null;
  const bonus = TRANSFER_BONUSES.find(
    (b) => b.from === from && b.toPattern.test(programKey)
  );
  if (!bonus) return null;
  return {
    bonus,
    programKey,
    rawPoints,
    effectivePoints: Math.round(rawPoints / (1 + bonus.bonus)),
  };
}
