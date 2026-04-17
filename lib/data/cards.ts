export type CardCurrency = "UR" | "MR" | "C1" | "TY" | "BILT";

export type Card = {
  id: string;
  bank: string;
  name: string;
  defaultPoints: number;
  currency: CardCurrency;
  currencyName: string;
};

export const CARDS: Card[] = [
  {
    id: "csr",
    bank: "Chase",
    name: "Sapphire Reserve",
    defaultPoints: 120000,
    currency: "UR",
    currencyName: "Ultimate Rewards",
  },
  {
    id: "csp",
    bank: "Chase",
    name: "Sapphire Preferred",
    defaultPoints: 85000,
    currency: "UR",
    currencyName: "Ultimate Rewards",
  },
  {
    id: "cik",
    bank: "Chase",
    name: "Ink Business Preferred",
    defaultPoints: 100000,
    currency: "UR",
    currencyName: "Ultimate Rewards",
  },
  {
    id: "amp",
    bank: "Amex",
    name: "Platinum",
    defaultPoints: 150000,
    currency: "MR",
    currencyName: "Membership Rewards",
  },
  {
    id: "amg",
    bank: "Amex",
    name: "Gold",
    defaultPoints: 95000,
    currency: "MR",
    currencyName: "Membership Rewards",
  },
  {
    id: "cap",
    bank: "Capital One",
    name: "Venture X",
    defaultPoints: 110000,
    currency: "C1",
    currencyName: "Capital One Miles",
  },
  {
    id: "citi",
    bank: "Citi",
    name: "Premier",
    defaultPoints: 78000,
    currency: "TY",
    currencyName: "ThankYou Points",
  },
  {
    id: "bilt",
    bank: "Bilt",
    name: "Bilt Mastercard",
    defaultPoints: 42000,
    currency: "BILT",
    currencyName: "Bilt Points",
  },
];

export const CARD_BY_ID: Record<string, Card> = Object.fromEntries(
  CARDS.map((c) => [c.id, c])
);
