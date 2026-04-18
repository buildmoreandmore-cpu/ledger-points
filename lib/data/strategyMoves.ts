import type { CardCurrency } from "./cards";
import type { Cabin } from "./routes";

export type MoveType =
  | "TRANSFER BONUS"
  | "EXPIRING POINTS"
  | "NEW CARD"
  | "PROGRAM SHIFT"
  | "TIMING PLAY"
  | "REDEMPTION TIMING";

export type StrategyMove = {
  id: string;
  type: MoveType;
  urgency: { label: string; days: number } | null;
  move: string;
  reasoning: string;
  impact: { value: string; label: string };
  path: string;
  requiresCards?: string[];
  requiresCurrency?: CardCurrency;
  requiresMissingCurrency?: CardCurrency;
  minBalance?: number;
  actionType: "search" | "card" | "none";
  searchPrefill?: { origin: string; destination: string; cabin: Cabin };
  cardId?: string;
};

export const STRATEGY_MOVES: StrategyMove[] = [
  {
    id: "fb-bonus-apr30",
    type: "TRANSFER BONUS",
    urgency: { label: "Expires Apr 30", days: 12 },
    move: "Transfer 60,000 Amex MR to Flying Blue before April 30.",
    reasoning:
      "Flying Blue is running a 25% transfer bonus through April 30. Your 60,000 MR becomes 75,000 Flying Blue miles — enough for a round-trip Paris business class seat at the promotional Promo Rewards rate. Without this bonus, the same booking costs 80,000 MR.",
    impact: { value: "$2,400", label: "in business class fares" },
    path: "Transfer Amex MR → Flying Blue (1:1 + 25% bonus)",
    requiresCards: ["amp", "amg"],
    requiresCurrency: "MR",
    minBalance: 50000,
    actionType: "search",
    searchPrefill: { origin: "ATL", destination: "CDG", cabin: "business" },
  },
  {
    id: "citi-expiring",
    type: "EXPIRING POINTS",
    urgency: { label: "Expires in 18 days", days: 18 },
    move: "Use your 42,000 Citi ThankYou points in the next 18 days.",
    reasoning:
      "Your Citi TY balance expires before May 8. Transfer to Turkish Miles&Smiles at 1:1 for a round-trip to Europe at 45,000 in business class — add just 3,000 more from a different source. Losing 42k unredeemed points is the same as losing $800 in cash value.",
    impact: { value: "$800", label: "at risk if unused" },
    path: "Transfer Citi TY → Turkish Miles&Smiles",
    requiresCards: ["citi"],
    requiresCurrency: "TY",
    minBalance: 40000,
    actionType: "search",
    searchPrefill: { origin: "JFK", destination: "FCO", cabin: "business" },
  },
  {
    id: "gap-amex-gold",
    type: "NEW CARD",
    urgency: null,
    move: "Open the Amex Gold to unlock ANA partner awards.",
    reasoning:
      "Your current wallet does not include Amex Membership Rewards. Adding the Amex Gold cuts your best path to Tokyo from 87,000 Aeroplan miles to 47,500 Virgin Atlantic miles — a difference of nearly 40,000 points per trip. Current signup bonus is 60,000 MR after $6,000 spend.",
    impact: { value: "40,000 points", label: "saved per round-trip" },
    path: "Amex Gold · 60k bonus · $325 annual fee",
    requiresMissingCurrency: "MR",
    actionType: "card",
    cardId: "amg",
  },
  {
    id: "gap-venture-x",
    type: "NEW CARD",
    urgency: null,
    move: "Open the Capital One Venture X to unlock Turkish Miles&Smiles.",
    reasoning:
      "Capital One transfers 1:1 to Turkish, the single cheapest business class program for transatlantic flights — 45,000 miles each way versus 62,000 via Flying Blue. Current signup bonus is 75,000 miles, enough for a round-trip Europe business redemption on its own.",
    impact: { value: "34,000 points", label: "saved vs Flying Blue" },
    path: "Capital One Venture X · 75k bonus · $95 annual fee",
    requiresMissingCurrency: "C1",
    actionType: "card",
    cardId: "cap",
  },
  {
    id: "shift-chase-ur",
    type: "PROGRAM SHIFT",
    urgency: null,
    move: "Diversify into Chase Ultimate Rewards.",
    reasoning:
      "Your wallet overweights Amex Membership Rewards. Chase UR unlocks Hyatt (the best hotel transfer partner in points), United (your best domestic award program), and Southwest. Your current cards cover zero of these.",
    impact: { value: "3 programs", label: "unlocked on approval" },
    path: "Chase Sapphire Preferred · 75k bonus · $95 annual fee",
    requiresMissingCurrency: "UR",
    actionType: "card",
    cardId: "csp",
  },
  {
    id: "timing-turkish-summer",
    type: "TIMING PLAY",
    urgency: null,
    move: "Hold your Capital One points until late summer.",
    reasoning:
      "Capital One has run a 30% transfer bonus to Turkish every August for the past three years. If you are planning a fall trip to Europe, waiting 4-6 weeks could turn your 45,000 miles into 58,500 Turkish — enough for an extra segment on the return.",
    impact: { value: "13,500 miles", label: "bonus on 45k transfer" },
    path: "Wait · monitor transfer bonus tracker",
    requiresCards: ["cap"],
    requiresCurrency: "C1",
    actionType: "none",
  },
  {
    id: "sweet-spot-ana",
    type: "REDEMPTION TIMING",
    urgency: null,
    move: "Book ANA first class before Virgin Atlantic devalues the partner chart.",
    reasoning:
      "The Virgin Atlantic partner rate for ANA first class (110,000 miles round-trip) is the best-kept first class sweet spot in the points game. Virgin Atlantic has hinted at changes to their partner chart. If first class to Asia is on your list, booking in the next 90 days hedges against a likely 50%+ increase.",
    impact: { value: "55,000 points", label: "risk of devaluation" },
    path: "Transfer Amex MR → Virgin Atlantic, call to book",
    requiresCards: ["amp", "amg", "csr", "csp", "cik"],
    requiresCurrency: "MR",
    minBalance: 110000,
    actionType: "search",
    searchPrefill: { origin: "LAX", destination: "NRT", cabin: "first" },
  },
];

export type MoveFilterInput = {
  selectedCardIds: string[];
  balanceByCurrency: Partial<Record<CardCurrency, number>>;
  selectedCurrencies: Set<CardCurrency>;
};

export function filterAndRankMoves({
  selectedCardIds,
  balanceByCurrency,
  selectedCurrencies,
}: MoveFilterInput): StrategyMove[] {
  const viable = STRATEGY_MOVES.filter((m) => {
    if (
      m.requiresMissingCurrency &&
      selectedCurrencies.has(m.requiresMissingCurrency)
    ) {
      return false;
    }
    if (m.requiresCards && m.requiresCards.length > 0) {
      if (!m.requiresCards.some((id) => selectedCardIds.includes(id))) {
        return false;
      }
    }
    if (m.requiresCurrency) {
      const bal = balanceByCurrency[m.requiresCurrency] ?? 0;
      if (m.minBalance && bal < m.minBalance) return false;
      if (!m.minBalance && !selectedCurrencies.has(m.requiresCurrency)) {
        return false;
      }
    }
    return true;
  });

  const typeRank: Record<MoveType, number> = {
    "TRANSFER BONUS": 0,
    "EXPIRING POINTS": 0,
    "NEW CARD": 1,
    "PROGRAM SHIFT": 1,
    "TIMING PLAY": 2,
    "REDEMPTION TIMING": 2,
  };

  viable.sort((a, b) => {
    const au = a.urgency?.days;
    const bu = b.urgency?.days;
    if (au !== undefined && bu !== undefined) return au - bu;
    if (au !== undefined) return -1;
    if (bu !== undefined) return 1;
    return typeRank[a.type] - typeRank[b.type];
  });

  return viable.slice(0, 5);
}
