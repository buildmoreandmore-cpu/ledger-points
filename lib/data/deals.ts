import { CARD_BY_ID, type CardCurrency } from "./cards";

export type DealMetric = {
  points: string;
  fees: string;
  program: string;
  heat: string;
};

export type DealRoute = { pair: string; dates: string };

export type Deal = {
  id: string;
  heat: 1 | 2 | 3;
  heatNote: string;
  region: string;
  publishedDate: string;
  headline: string;
  accentWord: string;
  dek: string;
  metrics: DealMetric;
  whyWeLoveIt: string;
  routes: DealRoute[];
  howToBook: string[];
  worksWithCards: string[];
};

export const DEALS: Deal[] = [
  {
    id: "condor-europe",
    heat: 2,
    heatNote: "48–72 hours",
    region: "Europe",
    publishedDate: "Apr 17, 2026",
    headline: "Mexico & Jamaica to Europe — business class from 55k",
    accentWord: "business",
    dek: "A wide-open Condor business class deal that nobody sees coming because it starts outside the US. Fly nonstop from Cancún, Cabo, or Montego Bay to Frankfurt on a lie-flat A330-900neo — and build a positioning beach stop into the trip.",
    metrics: {
      points: "55,000",
      fees: "$150",
      program: "Alaska Mileage",
      heat: "48–72h",
    },
    whyWeLoveIt:
      "Tons of availability in June and September — months where it is normally tough to find business class seats to Europe. And the positioning flight doubles as a vacation.",
    routes: [
      {
        pair: "CUN → FRA",
        dates:
          "May 10-11 · Jun 2, 9-11, 13-14, 16-18, 20-21 · Jul 5, 8-9, 19, 21 · Sep 16-18, 20-24",
      },
      {
        pair: "MBJ → FRA",
        dates:
          "Apr 22, 25, 29 · May 1, 8, 13, 15, 20, 22, 27, 29 · Jun 12, 19, 26",
      },
      {
        pair: "SJD → FRA",
        dates: "Nov 6, 9 · Dec 21, 25 · Jan 15, 18, 22, 29",
      },
    ],
    howToBook: [
      "Transfer Bilt points to Alaska (usually 10 min)",
      "Search Alaskaair.com with \"Use points\" and \"Flexible dates\" enabled",
      "Filter results to \"Partner Business\" class",
      "Book · call Condor at 866-960-7915 to upgrade to Prime Seats",
    ],
    worksWithCards: ["bilt"],
  },
  {
    id: "ana-first-tokyo",
    heat: 3,
    heatNote: "24 hours · move fast",
    region: "Asia",
    publishedDate: "Apr 15, 2026",
    headline: "US West Coast to Tokyo — ANA first class from 110k",
    accentWord: "first",
    dek: "ANA is sitting on surprising first class availability from LAX and SFO to Narita in May and June. Book through Virgin Atlantic at the partner rate — the same seat ANA charges 160,000 for.",
    metrics: {
      points: "110,000",
      fees: "$210",
      program: "Virgin Atlantic",
      heat: "24h",
    },
    whyWeLoveIt:
      "First class on ANA \"The Suite\" is one of the top three premium products in the sky. At 110,000 Virgin Atlantic miles booked through Amex or Chase transfer, this works out to roughly a 12¢ per-point redemption.",
    routes: [
      {
        pair: "LAX → NRT",
        dates: "May 3, 8, 14, 19, 22, 27 · Jun 4, 9, 11, 18, 25",
      },
      { pair: "SFO → NRT", dates: "May 6, 12, 19, 26 · Jun 2, 9, 16, 23, 30" },
    ],
    howToBook: [
      "Transfer Amex MR or Chase UR to Virgin Atlantic Flying Club (1:1, usually instant)",
      "Call Virgin Atlantic at 800-365-9500 — online booking does not show ANA partner space",
      "Request ANA first class, flight NH7 (LAX) or NH107 (SFO)",
      "Pay approximately $210 in taxes and fees",
    ],
    worksWithCards: ["amp", "amg", "csr", "csp", "cik"],
  },
  {
    id: "turkish-europe",
    heat: 2,
    heatNote: "Solid through summer",
    region: "Europe",
    publishedDate: "Apr 10, 2026",
    headline: "US to anywhere in Europe — 45k in business on Turkish",
    accentWord: "anywhere",
    dek: "Turkish Airlines Miles&Smiles is the single best-kept secret in the points game. 45,000 miles gets you from any Star Alliance hub in the US to any Star Alliance destination in Europe — in business class, with no fuel surcharges.",
    metrics: {
      points: "45,000",
      fees: "$95",
      program: "Turkish Miles&Smiles",
      heat: "Solid",
    },
    whyWeLoveIt:
      "Lowest business class pricing in the entire transatlantic market. The only catch is you have to call Turkish directly — the website will not show United or Lufthansa partner inventory.",
    routes: [
      { pair: "IAD → Any Europe", dates: "Open availability through September" },
      { pair: "ORD → Any Europe", dates: "Open availability through September" },
      { pair: "EWR → Any Europe", dates: "Open availability through September" },
    ],
    howToBook: [
      "Transfer Capital One Venture or Citi ThankYou points to Turkish (instant)",
      "Search United.com to identify open partner award business class space",
      "Call Turkish at +90 850 333 0849",
      "Provide the exact flight number and date — book and pay $95 in taxes",
    ],
    worksWithCards: ["cap", "citi"],
  },
  {
    id: "qatar-qsuite",
    heat: 1,
    heatNote: "Quiet window",
    region: "Middle East",
    publishedDate: "Apr 8, 2026",
    headline: "Qatar Qsuite — US to the Middle East from 70k",
    accentWord: "Qsuite",
    dek: "Qatar Airways is releasing rare Qsuite availability from JFK, ORD, and DFW to Doha for fall travel. Book through Alaska Mileage Plan at 70,000 miles each way — less than half what Qatar itself charges.",
    metrics: {
      points: "70,000",
      fees: "$52",
      program: "Alaska Mileage",
      heat: "Quiet",
    },
    whyWeLoveIt:
      "Qsuite is widely considered the best business class product ever built. Sliding doors, double bed if traveling with a partner, fine dining throughout. At 70,000 Alaska miles this works out to roughly 10¢ per point.",
    routes: [
      {
        pair: "JFK → DOH",
        dates: "Sep 15, 22, 29 · Oct 3, 10, 17, 24 · Nov 2, 9",
      },
      { pair: "ORD → DOH", dates: "Oct 5, 12, 19, 26 · Nov 6, 13, 20" },
      {
        pair: "DFW → DOH",
        dates: "Sep 18, 25 · Oct 7, 14, 21, 28 · Nov 4, 11",
      },
    ],
    howToBook: [
      "Transfer Capital One or Bilt points to Alaska Mileage Plan (instant)",
      "Call Alaska Airlines at 800-252-7522 — Qatar partner space does not show online",
      "Confirm availability with the agent before processing",
      "Pay approximately $52 in taxes",
    ],
    worksWithCards: ["cap", "bilt"],
  },
];

export function dealOwnership(
  deal: Deal,
  selectedCardIds: string[]
): {
  owns: boolean;
  missingLabel: string;
} {
  const owns = deal.worksWithCards.some((id) => selectedCardIds.includes(id));
  if (owns) return { owns: true, missingLabel: "" };

  const currencies = new Set<CardCurrency>();
  for (const id of deal.worksWithCards) {
    const card = CARD_BY_ID[id];
    if (card) currencies.add(card.currency);
  }
  const arr = Array.from(currencies);
  const missingLabel =
    arr.length === 1
      ? `Requires ${arr[0]} — you have none yet`
      : arr.length === 2
      ? `Requires ${arr[0]} or ${arr[1]} — you have neither yet`
      : `Requires ${arr.slice(0, -1).join(", ")} or ${arr[arr.length - 1]} — you have none yet`;
  return { owns: false, missingLabel };
}
