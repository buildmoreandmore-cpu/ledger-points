import type { Cabin } from "./routes";
import type { CardCurrency } from "./cards";

export type SweetSpot = {
  program: string;
  from: CardCurrency;
  ratio: number;
  points: Record<Cabin, number>;
  fees: number;
  viaCards: string[];
  note?: string;
};

const URCards = ["csr", "csp", "cik"];
const MRCards = ["amp", "amg"];
const C1Cards = ["cap"];
const TYCards = ["citi"];
const BILTCards = ["bilt"];

const URMR = [...URCards, ...MRCards];
const URMRC1 = [...URMR, ...C1Cards];
const URMRBILT = [...URMR, ...BILTCards];
const URMRC1BILT = [...URMRC1, ...BILTCards];
const URMRC1TYBILT = [...URMRC1BILT, ...TYCards];

export const SWEET_SPOTS: Record<string, SweetSpot[]> = {
  "ATL-NRT": [
    {
      program: "Virgin Atlantic Flying Club → ANA",
      from: "UR",
      ratio: 1,
      points: { economy: 35000, premium: 55000, business: 47500, first: 72500 },
      fees: 180,
      viaCards: URCards,
      note: "The legendary ANA sweet spot via Virgin",
    },
    {
      program: "Aeroplan (Air Canada)",
      from: "UR",
      ratio: 1,
      points: { economy: 45000, premium: 65000, business: 75000, first: 95000 },
      fees: 120,
      viaCards: URMRC1,
    },
    {
      program: "Avianca LifeMiles",
      from: "MR",
      ratio: 1,
      points: { economy: 40000, premium: 60000, business: 78000, first: 90000 },
      fees: 85,
      viaCards: [...MRCards, ...C1Cards],
    },
  ],
  "ATL-HND": [
    {
      program: "Virgin Atlantic → ANA",
      from: "UR",
      ratio: 1,
      points: { economy: 35000, premium: 55000, business: 47500, first: 72500 },
      fees: 180,
      viaCards: URCards,
    },
    {
      program: "Aeroplan (Air Canada)",
      from: "UR",
      ratio: 1,
      points: { economy: 45000, premium: 65000, business: 75000, first: 95000 },
      fees: 120,
      viaCards: URMRC1,
    },
  ],
  "ATL-CDG": [
    {
      program: "Air France Flying Blue",
      from: "UR",
      ratio: 1,
      points: { economy: 22000, premium: 42000, business: 55000, first: 85000 },
      fees: 240,
      viaCards: URMRC1BILT,
      note: "Promo Rewards drop business to 50k-55k monthly",
    },
    {
      program: "Virgin Atlantic → Delta",
      from: "UR",
      ratio: 1,
      points: { economy: 30000, premium: 45000, business: 60000, first: 95000 },
      fees: 280,
      viaCards: URCards,
    },
    {
      program: "Aeroplan (Air Canada)",
      from: "UR",
      ratio: 1,
      points: { economy: 35000, premium: 50000, business: 60000, first: 85000 },
      fees: 125,
      viaCards: URMRC1,
    },
  ],
  "ATL-LHR": [
    {
      program: "Virgin Atlantic",
      from: "UR",
      ratio: 1,
      points: { economy: 20000, premium: 37500, business: 47500, first: 80000 },
      fees: 520,
      viaCards: URCards,
    },
    {
      program: "Aeroplan → United",
      from: "UR",
      ratio: 1,
      points: { economy: 30000, premium: 45000, business: 60000, first: 90000 },
      fees: 125,
      viaCards: URMRC1,
    },
    {
      program: "Iberia Avios",
      from: "MR",
      ratio: 1,
      points: { economy: 34000, premium: 62000, business: 68000, first: 102000 },
      fees: 620,
      viaCards: [...MRCards, ...C1Cards],
    },
  ],
  "ATL-GRU": [
    {
      program: "LifeMiles (Avianca)",
      from: "MR",
      ratio: 1,
      points: { economy: 20000, premium: 35000, business: 63000, first: 78000 },
      fees: 95,
      viaCards: [...MRCards, ...C1Cards],
    },
    {
      program: "Aeroplan",
      from: "UR",
      ratio: 1,
      points: { economy: 25000, premium: 40000, business: 70000, first: 95000 },
      fees: 110,
      viaCards: URMRC1,
    },
  ],
  "ATL-DXB": [
    {
      program: "Alaska → Emirates",
      from: "MR",
      ratio: 1,
      points: { economy: 42500, premium: 72500, business: 105000, first: 180000 },
      fees: 340,
      viaCards: [...MRCards, ...BILTCards],
      note: "Alaska is the only route to Emirates first for reasonable miles",
    },
    {
      program: "LifeMiles",
      from: "MR",
      ratio: 1,
      points: { economy: 40000, premium: 65000, business: 87500, first: 135000 },
      fees: 180,
      viaCards: [...MRCards, ...C1Cards],
    },
  ],
  "ATL-FCO": [
    {
      program: "Air France Flying Blue",
      from: "UR",
      ratio: 1,
      points: { economy: 22000, premium: 42000, business: 55000, first: 85000 },
      fees: 240,
      viaCards: URMRC1BILT,
    },
    {
      program: "Aeroplan",
      from: "UR",
      ratio: 1,
      points: { economy: 35000, premium: 50000, business: 60000, first: 85000 },
      fees: 135,
      viaCards: URMRC1,
    },
  ],
  "ATL-HKG": [
    {
      program: "Alaska → Cathay Pacific",
      from: "MR",
      ratio: 1,
      points: { economy: 30000, premium: 55000, business: 50000, first: 70000 },
      fees: 95,
      viaCards: [...MRCards, ...BILTCards],
      note: "Classic Cathay first via Alaska — book the moment inventory drops",
    },
    {
      program: "Asia Miles (Cathay)",
      from: "MR",
      ratio: 1,
      points: { economy: 42500, premium: 67500, business: 85000, first: 125000 },
      fees: 180,
      viaCards: [...MRCards, ...C1Cards],
    },
  ],
  "ATL-SYD": [
    {
      program: "Virgin Atlantic → Delta",
      from: "UR",
      ratio: 1,
      points: { economy: 45000, premium: 70000, business: 95000, first: 140000 },
      fees: 85,
      viaCards: URCards,
    },
    {
      program: "American AAdvantage → Qantas",
      from: "MR",
      ratio: 1,
      points: { economy: 42500, premium: 67500, business: 80000, first: 110000 },
      fees: 95,
      viaCards: [...MRCards, ...BILTCards],
    },
  ],

  "JFK-NRT": [
    {
      program: "Virgin Atlantic → ANA",
      from: "UR",
      ratio: 1,
      points: { economy: 35000, premium: 55000, business: 47500, first: 72500 },
      fees: 180,
      viaCards: URCards,
    },
    {
      program: "Aeroplan",
      from: "UR",
      ratio: 1,
      points: { economy: 45000, premium: 65000, business: 75000, first: 95000 },
      fees: 120,
      viaCards: URMRC1,
    },
    {
      program: "LifeMiles",
      from: "MR",
      ratio: 1,
      points: { economy: 40000, premium: 60000, business: 78000, first: 90000 },
      fees: 85,
      viaCards: [...MRCards, ...C1Cards],
    },
  ],
  "JFK-HND": [
    {
      program: "Virgin Atlantic → ANA",
      from: "UR",
      ratio: 1,
      points: { economy: 35000, premium: 55000, business: 47500, first: 72500 },
      fees: 180,
      viaCards: URCards,
    },
    {
      program: "Aeroplan",
      from: "UR",
      ratio: 1,
      points: { economy: 45000, premium: 65000, business: 75000, first: 95000 },
      fees: 120,
      viaCards: URMRC1,
    },
  ],
  "JFK-CDG": [
    {
      program: "Air France Flying Blue",
      from: "UR",
      ratio: 1,
      points: { economy: 22000, premium: 42000, business: 55000, first: 85000 },
      fees: 240,
      viaCards: URMRC1BILT,
    },
    {
      program: "Virgin Atlantic → Delta",
      from: "UR",
      ratio: 1,
      points: { economy: 28000, premium: 42500, business: 57500, first: 90000 },
      fees: 280,
      viaCards: URCards,
    },
  ],
  "JFK-LHR": [
    {
      program: "Virgin Atlantic (non-BA metal)",
      from: "UR",
      ratio: 1,
      points: { economy: 18000, premium: 35000, business: 45000, first: 77500 },
      fees: 420,
      viaCards: URCards,
      note: "Always avoid BA metal to dodge the carrier-imposed surcharges",
    },
    {
      program: "Iberia Avios",
      from: "MR",
      ratio: 1,
      points: { economy: 34000, premium: 62000, business: 68000, first: 102000 },
      fees: 620,
      viaCards: [...MRCards, ...C1Cards],
    },
    {
      program: "Aeroplan",
      from: "UR",
      ratio: 1,
      points: { economy: 30000, premium: 45000, business: 60000, first: 90000 },
      fees: 125,
      viaCards: URMRC1,
    },
  ],
  "JFK-GRU": [
    {
      program: "LifeMiles",
      from: "MR",
      ratio: 1,
      points: { economy: 20000, premium: 35000, business: 63000, first: 78000 },
      fees: 95,
      viaCards: [...MRCards, ...C1Cards],
    },
    {
      program: "Air France Flying Blue",
      from: "UR",
      ratio: 1,
      points: { economy: 30000, premium: 55000, business: 75000, first: 110000 },
      fees: 210,
      viaCards: URMRC1BILT,
    },
  ],
  "JFK-DXB": [
    {
      program: "Alaska → Emirates",
      from: "MR",
      ratio: 1,
      points: { economy: 42500, premium: 72500, business: 105000, first: 180000 },
      fees: 340,
      viaCards: [...MRCards, ...BILTCards],
    },
    {
      program: "LifeMiles",
      from: "MR",
      ratio: 1,
      points: { economy: 40000, premium: 65000, business: 87500, first: 135000 },
      fees: 180,
      viaCards: [...MRCards, ...C1Cards],
    },
  ],
  "JFK-FCO": [
    {
      program: "Air France Flying Blue",
      from: "UR",
      ratio: 1,
      points: { economy: 22000, premium: 42000, business: 55000, first: 85000 },
      fees: 240,
      viaCards: URMRC1BILT,
    },
    {
      program: "Aeroplan",
      from: "UR",
      ratio: 1,
      points: { economy: 35000, premium: 50000, business: 60000, first: 85000 },
      fees: 135,
      viaCards: URMRC1,
    },
  ],
  "JFK-HKG": [
    {
      program: "Alaska → Cathay Pacific",
      from: "MR",
      ratio: 1,
      points: { economy: 30000, premium: 55000, business: 50000, first: 70000 },
      fees: 95,
      viaCards: [...MRCards, ...BILTCards],
    },
    {
      program: "Asia Miles",
      from: "MR",
      ratio: 1,
      points: { economy: 42500, premium: 67500, business: 85000, first: 125000 },
      fees: 180,
      viaCards: [...MRCards, ...C1Cards],
    },
  ],
  "JFK-SYD": [
    {
      program: "American → Qantas",
      from: "MR",
      ratio: 1,
      points: { economy: 42500, premium: 67500, business: 80000, first: 110000 },
      fees: 95,
      viaCards: [...MRCards, ...BILTCards],
    },
    {
      program: "Virgin Atlantic → Delta",
      from: "UR",
      ratio: 1,
      points: { economy: 45000, premium: 70000, business: 95000, first: 140000 },
      fees: 85,
      viaCards: URCards,
    },
  ],

  "LAX-NRT": [
    {
      program: "Virgin Atlantic → ANA",
      from: "UR",
      ratio: 1,
      points: { economy: 30000, premium: 50000, business: 45000, first: 65000 },
      fees: 180,
      viaCards: URCards,
    },
    {
      program: "Aeroplan",
      from: "UR",
      ratio: 1,
      points: { economy: 35000, premium: 55000, business: 75000, first: 90000 },
      fees: 120,
      viaCards: URMRC1,
    },
    {
      program: "Citi → Singapore KrisFlyer",
      from: "TY",
      ratio: 1,
      points: { economy: 38000, premium: 58000, business: 92000, first: 125000 },
      fees: 140,
      viaCards: [...TYCards, ...MRCards, ...URCards],
    },
  ],
  "LAX-HND": [
    {
      program: "Virgin Atlantic → ANA",
      from: "UR",
      ratio: 1,
      points: { economy: 30000, premium: 50000, business: 45000, first: 65000 },
      fees: 180,
      viaCards: URCards,
    },
    {
      program: "Aeroplan",
      from: "UR",
      ratio: 1,
      points: { economy: 35000, premium: 55000, business: 75000, first: 90000 },
      fees: 120,
      viaCards: URMRC1,
    },
  ],
  "LAX-CDG": [
    {
      program: "Air France Flying Blue",
      from: "UR",
      ratio: 1,
      points: { economy: 25000, premium: 48000, business: 62500, first: 95000 },
      fees: 240,
      viaCards: URMRC1BILT,
    },
    {
      program: "Aeroplan",
      from: "UR",
      ratio: 1,
      points: { economy: 40000, premium: 55000, business: 70000, first: 95000 },
      fees: 135,
      viaCards: URMRC1,
    },
  ],
  "LAX-LHR": [
    {
      program: "Virgin Atlantic",
      from: "UR",
      ratio: 1,
      points: { economy: 22500, premium: 40000, business: 57500, first: 85000 },
      fees: 520,
      viaCards: URCards,
    },
    {
      program: "Aeroplan",
      from: "UR",
      ratio: 1,
      points: { economy: 35000, premium: 50000, business: 70000, first: 100000 },
      fees: 125,
      viaCards: URMRC1,
    },
  ],
  "LAX-GRU": [
    {
      program: "LifeMiles",
      from: "MR",
      ratio: 1,
      points: { economy: 25000, premium: 42500, business: 63000, first: 78000 },
      fees: 95,
      viaCards: [...MRCards, ...C1Cards],
    },
    {
      program: "Aeroplan",
      from: "UR",
      ratio: 1,
      points: { economy: 30000, premium: 50000, business: 75000, first: 95000 },
      fees: 110,
      viaCards: URMRC1,
    },
  ],
  "LAX-DXB": [
    {
      program: "Alaska → Emirates",
      from: "MR",
      ratio: 1,
      points: { economy: 52500, premium: 87500, business: 135000, first: 200000 },
      fees: 340,
      viaCards: [...MRCards, ...BILTCards],
    },
    {
      program: "LifeMiles",
      from: "MR",
      ratio: 1,
      points: { economy: 45000, premium: 72500, business: 95000, first: 145000 },
      fees: 180,
      viaCards: [...MRCards, ...C1Cards],
    },
  ],
  "LAX-FCO": [
    {
      program: "Air France Flying Blue",
      from: "UR",
      ratio: 1,
      points: { economy: 25000, premium: 48000, business: 62500, first: 95000 },
      fees: 240,
      viaCards: URMRC1BILT,
    },
    {
      program: "Aeroplan",
      from: "UR",
      ratio: 1,
      points: { economy: 40000, premium: 55000, business: 70000, first: 95000 },
      fees: 135,
      viaCards: URMRC1,
    },
  ],
  "LAX-HKG": [
    {
      program: "Alaska → Cathay Pacific",
      from: "MR",
      ratio: 1,
      points: { economy: 30000, premium: 55000, business: 50000, first: 70000 },
      fees: 95,
      viaCards: [...MRCards, ...BILTCards],
    },
    {
      program: "Asia Miles",
      from: "MR",
      ratio: 1,
      points: { economy: 42500, premium: 67500, business: 85000, first: 125000 },
      fees: 180,
      viaCards: [...MRCards, ...C1Cards],
    },
  ],
  "LAX-SYD": [
    {
      program: "American → Qantas",
      from: "MR",
      ratio: 1,
      points: { economy: 42500, premium: 67500, business: 80000, first: 110000 },
      fees: 95,
      viaCards: [...MRCards, ...BILTCards],
    },
    {
      program: "Virgin Atlantic → Delta",
      from: "UR",
      ratio: 1,
      points: { economy: 40000, premium: 65000, business: 90000, first: 135000 },
      fees: 85,
      viaCards: URCards,
    },
    {
      program: "Aeroplan → Air New Zealand",
      from: "UR",
      ratio: 1,
      points: { economy: 45000, premium: 72500, business: 95000, first: 135000 },
      fees: 135,
      viaCards: URMRC1,
    },
  ],
};

export const FALLBACK_SWEET_SPOTS: SweetSpot[] = [
  {
    program: "Air France Flying Blue",
    from: "UR",
    ratio: 1,
    points: { economy: 25000, premium: 45000, business: 60000, first: 95000 },
    fees: 240,
    viaCards: URMRC1BILT,
    note: "Reliable transfer partner that covers most SkyTeam longhaul",
  },
  {
    program: "Aeroplan (Air Canada)",
    from: "UR",
    ratio: 1,
    points: { economy: 35000, premium: 55000, business: 75000, first: 100000 },
    fees: 135,
    viaCards: URMRC1,
    note: "Distance-based chart with generous Star Alliance coverage",
  },
];

void URMRBILT;
void URMRC1TYBILT;
