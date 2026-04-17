import { CARD_BY_ID } from "../data/cards";
import type { Cabin } from "../data/routes";
import { AIRPORTS, ROUTES, routeKey } from "../data/routes";
import { pickAirline } from "../data/airlines";
import {
  FALLBACK_SWEET_SPOTS,
  SWEET_SPOTS,
  type SweetSpot,
} from "../data/sweetSpots";
import {
  AVAILABILITY_RANK,
  getAvailability,
  type AvailabilityResult,
} from "./availability";

export type { Cabin } from "../data/routes";

export type SearchInput = {
  origin: string;
  destination: string;
  departDate: string;
  cabin: Cabin;
  selectedCardIds: string[];
  saverOnly?: boolean;
};

export type BookingOption = {
  rank: string;
  tag: string;
  airline: string;
  cabinLabel: string;
  headlineNum: string;
  headlineUnit: string;
  detail: string;
  breakdown: Array<{ desc: string; val: string }>;
  isBest: boolean;
  availability: AvailabilityResult | null;
  programKey: string | null;
};

export type SearchResult = {
  route: {
    origin: string;
    destination: string;
    originCity: string;
    destinationCity: string;
    duration: string;
    cabin: Cabin;
    departDate: string;
    flightNumber: string;
    carrier: string;
  };
  options: BookingOption[];
  flexDates: FlexDayResult[];
};

export type FlexDayResult = {
  date: string;
  offset: number;
  programs: Array<{
    program: string;
    status: "open" | "waitlist" | "none";
  }>;
};

const CABIN_LABEL: Record<Cabin, string> = {
  economy: "Economy",
  premium: "Premium Economy",
  business: "Business",
  first: "First",
};

const fmt = new Intl.NumberFormat("en-US");
const formatPoints = (n: number): string => fmt.format(n);
const formatDollars = (n: number): string => `$${fmt.format(Math.round(n))}`;

const STANDARD_AWARD_MULTIPLIER = 2.2;

function cashOption(
  cabin: Cabin,
  actualFare: number,
  carrier: string
): BookingOption {
  const surcharge = Math.round(actualFare * 0.04);
  return {
    rank: "01 · CASH",
    tag: "Google Flights baseline",
    airline: carrier,
    cabinLabel: CABIN_LABEL[cabin],
    headlineNum: formatDollars(actualFare),
    headlineUnit: "paid in full",
    detail:
      "The published fare any booking site would surface first. Useful as a benchmark — not as a recommendation.",
    breakdown: [
      { desc: "Base fare", val: formatDollars(actualFare - surcharge) },
      { desc: "Carrier surcharges & taxes", val: formatDollars(surcharge) },
      { desc: "Cents per point earned", val: "— cpp" },
    ],
    isBest: false,
    availability: null,
    programKey: null,
  };
}

type AwardScore = {
  sweetSpot: SweetSpot;
  points: number;
  cpp: number;
  cardId: string;
  availability: AvailabilityResult;
};

function detailForAvailability(
  base: string,
  avail: AvailabilityResult
): string {
  if (avail.status === "open")
    return `Live saver space on your date — bookable today. ${base}`;
  if (avail.status === "waitlist")
    return `Waitlist only for this date. Space often clears 1–14 days before departure; we'll monitor if you save this search. ${base}`;
  return `No saver space on your exact date. The ±3 day strip below shows nearby openings. ${base}`;
}

async function scoreAwards(
  routeKeyStr: string,
  departDate: string,
  spots: SweetSpot[],
  cabin: Cabin,
  cashFare: number,
  selectedCardIds: string[],
  saverOnly: boolean
): Promise<AwardScore[]> {
  const selected = new Set(selectedCardIds);
  const candidates = spots
    .map((spot) => {
      const cardId = spot.viaCards.find((id) => selected.has(id));
      if (!cardId) return null;
      const basePoints = spot.points[cabin];
      if (!basePoints) return null;
      const points = saverOnly
        ? basePoints
        : Math.round(basePoints * STANDARD_AWARD_MULTIPLIER);
      const cpp = (cashFare - spot.fees) / points;
      return { spot, cardId, points, cpp };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const scored: AwardScore[] = [];
  for (const c of candidates) {
    const availability = await getAvailability(
      routeKeyStr,
      departDate,
      c.spot.program,
      cabin
    );
    scored.push({
      sweetSpot: c.spot,
      points: c.points,
      cpp: c.cpp,
      cardId: c.cardId,
      availability,
    });
  }

  scored.sort((a, b) => {
    const availDelta =
      AVAILABILITY_RANK[a.availability.status] -
      AVAILABILITY_RANK[b.availability.status];
    if (availDelta !== 0) return availDelta;
    return b.cpp - a.cpp;
  });

  return scored;
}

function awardOption(
  rank: string,
  tag: string,
  score: AwardScore,
  cabin: Cabin,
  cashFare: number,
  isBest: boolean,
  saverOnly: boolean
): BookingOption {
  const { sweetSpot, points, cpp, cardId, availability } = score;
  const card = CARD_BY_ID[cardId];
  const cardLabel = card ? `${card.bank} ${card.name}` : "your wallet";
  const savings = cashFare - sweetSpot.fees;
  const baseDetail =
    sweetSpot.note ??
    `Transfer from ${cardLabel} into ${sweetSpot.program} at ${sweetSpot.ratio}:${sweetSpot.ratio} and book direct. Price holds on partner metal, not on the operating carrier's own chart.`;
  const detail = detailForAvailability(baseDetail, availability);
  const tier = saverOnly ? "saver" : "standard";
  return {
    rank,
    tag,
    airline: sweetSpot.program,
    cabinLabel: CABIN_LABEL[cabin],
    headlineNum: formatPoints(points),
    headlineUnit: `${sweetSpot.from} pts + ${formatDollars(sweetSpot.fees)}`,
    detail,
    breakdown: [
      { desc: `Transfer source · ${cardLabel}`, val: `${sweetSpot.from}` },
      {
        desc: `Points required (${tier})`,
        val: formatPoints(points),
      },
      { desc: "Carrier fees & taxes", val: formatDollars(sweetSpot.fees) },
      { desc: "Cash value displaced", val: formatDollars(savings) },
      { desc: "Cents per point", val: `${cpp.toFixed(2)} cpp` },
    ],
    isBest: isBest && availability.status === "open",
    availability,
    programKey: sweetSpot.program,
  };
}

function walletGapOption(rank: string, cabin: Cabin): BookingOption {
  return {
    rank,
    tag: "No card matches the sweet spots we track",
    airline: "Wallet gap detected",
    cabinLabel: CABIN_LABEL[cabin],
    headlineNum: "—",
    headlineUnit: "no transfer path",
    detail:
      "None of the cards you selected can transfer into a program that prices this route favorably. Consider adding a flexible-points issuer (Chase, Amex, Capital One) to unlock the chart.",
    breakdown: [
      { desc: "Matched programs", val: "0" },
      {
        desc: "Best path forward",
        val: "Open a Sapphire Preferred or Amex Gold",
      },
    ],
    isBest: false,
    availability: null,
    programKey: null,
  };
}

function earnOption(rank: string, cabin: Cabin, cashFare: number): BookingOption {
  return {
    rank,
    tag: "Editorial note",
    airline: "Book cash, earn miles",
    cabinLabel: CABIN_LABEL[cabin],
    headlineNum: "—",
    headlineUnit: "passive accrual",
    detail:
      "If no transfer partner saves meaningfully, paying cash on a card that earns bonus miles on airfare is the correct move. Reserve, Gold, and Venture X all qualify.",
    breakdown: [
      {
        desc: "Cash + bonus accrual",
        val: `${Math.round(cashFare / 1000)}k pts earned`,
      },
    ],
    isBest: false,
    availability: null,
    programKey: null,
  };
}

async function flexDates(
  routeKeyStr: string,
  departDate: string,
  cabin: Cabin,
  programs: string[]
): Promise<FlexDayResult[]> {
  const days: FlexDayResult[] = [];
  for (let offset = -3; offset <= 3; offset += 1) {
    const d = new Date(`${departDate}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + offset);
    const iso = d.toISOString().slice(0, 10);
    const programResults: FlexDayResult["programs"] = [];
    for (const program of programs) {
      const a = await getAvailability(routeKeyStr, iso, program, cabin);
      programResults.push({ program, status: a.status });
    }
    days.push({ date: iso, offset, programs: programResults });
  }
  return days;
}

export async function searchFlights(
  input: SearchInput
): Promise<SearchResult> {
  const origin = input.origin.toUpperCase();
  const destination = input.destination.toUpperCase();
  const key = routeKey(origin, destination);
  const routeEntry = ROUTES[key];
  const { carrier, flight } = pickAirline(key);
  const duration = routeEntry?.duration ?? "— hrs";
  const saverOnly = input.saverOnly ?? true;

  const cabinMultipliers: Record<Cabin, number> = {
    economy: 1,
    premium: 1.9,
    business: 3.8,
    first: 7,
  };
  const cashFare =
    routeEntry?.cashFare[input.cabin] ??
    Math.round(900 * cabinMultipliers[input.cabin]);

  const route: SearchResult["route"] = {
    origin,
    destination,
    originCity: AIRPORTS[origin] ?? origin,
    destinationCity: AIRPORTS[destination] ?? destination,
    duration,
    cabin: input.cabin,
    departDate: input.departDate,
    flightNumber: flight,
    carrier,
  };

  const cash = cashOption(input.cabin, cashFare, carrier);

  const availableSpots = SWEET_SPOTS[key] ?? [];
  const scored = await scoreAwards(
    key,
    input.departDate,
    availableSpots,
    input.cabin,
    cashFare,
    input.selectedCardIds,
    saverOnly
  );

  let options: BookingOption[];

  if (scored.length >= 2) {
    options = [
      cash,
      awardOption(
        "02 · BEST AWARD",
        "Transfer-partner sweet spot",
        scored[0],
        input.cabin,
        cashFare,
        true,
        saverOnly
      ),
      awardOption(
        "03 · ALT AWARD",
        "Worth keeping on deck",
        scored[1],
        input.cabin,
        cashFare,
        false,
        saverOnly
      ),
    ];
  } else if (scored.length === 1) {
    const fallbackScored = (
      await scoreAwards(
        key,
        input.departDate,
        FALLBACK_SWEET_SPOTS,
        input.cabin,
        cashFare,
        input.selectedCardIds,
        saverOnly
      )
    ).filter((s) => s.sweetSpot.program !== scored[0].sweetSpot.program);
    options = [
      cash,
      awardOption(
        "02 · BEST AWARD",
        "Transfer-partner sweet spot",
        scored[0],
        input.cabin,
        cashFare,
        true,
        saverOnly
      ),
      fallbackScored.length
        ? awardOption(
            "03 · ALT AWARD",
            "Reliable fallback",
            fallbackScored[0],
            input.cabin,
            cashFare,
            false,
            saverOnly
          )
        : walletGapOption("03 · ALT AWARD", input.cabin),
    ];
  } else {
    const fallbackScored = await scoreAwards(
      key,
      input.departDate,
      FALLBACK_SWEET_SPOTS,
      input.cabin,
      cashFare,
      input.selectedCardIds,
      saverOnly
    );
    if (fallbackScored.length >= 2) {
      options = [
        cash,
        awardOption(
          "02 · BEST AWARD",
          "Cross-program fallback",
          fallbackScored[0],
          input.cabin,
          cashFare,
          true,
          saverOnly
        ),
        awardOption(
          "03 · ALT AWARD",
          "Second-best on file",
          fallbackScored[1],
          input.cabin,
          cashFare,
          false,
          saverOnly
        ),
      ];
    } else {
      options = [
        cash,
        walletGapOption("02 · BEST AWARD", input.cabin),
        earnOption("03 · ALT AWARD", input.cabin, cashFare),
      ];
    }
  }

  const flexPrograms = options
    .map((o) => o.programKey)
    .filter((p): p is string => !!p);

  const flex = flexPrograms.length
    ? await flexDates(key, input.departDate, input.cabin, flexPrograms)
    : [];

  return { route, options, flexDates: flex };
}
