import { CARD_BY_ID, type CardCurrency } from "../data/cards";
import { ROUTES, routeKey, type Cabin } from "../data/routes";
import { SWEET_SPOTS } from "../data/sweetSpots";
import { getAvailability, type AvailabilityStatus } from "./availability";

export type MatrixCell = {
  origin: string;
  destination: string;
  date: string;
  cabin: Cabin;
  points: number | null;
  program: string | null;
  currency: CardCurrency | null;
  cpp: number | null;
  fees: number;
  cashFare: number;
  availability: AvailabilityStatus;
};

export type MatrixInput = {
  origins: string[];
  destinations: string[];
  dateStart: string;
  dateEnd: string;
  cabin: Cabin;
  selectedCardIds: string[];
  saverOnly?: boolean;
};

export type MatrixResult = {
  cells: MatrixCell[];
  best: MatrixCell | null;
  totalCombinations: number;
};

function listDates(start: string, end: string): string[] {
  const out: string[] = [];
  const a = new Date(`${start}T00:00:00Z`);
  const b = new Date(`${end}T00:00:00Z`);
  if (b < a) return out;
  const cur = new Date(a);
  while (cur <= b) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

const STANDARD_MULTIPLIER = 2.2;

const FALLBACK_FARE: Record<Cabin, number> = {
  economy: 900,
  premium: 1700,
  business: 3400,
  first: 6300,
};

const FALLBACK_DURATION = "— hrs";

export function countCombinations(input: MatrixInput): number {
  const dates = listDates(input.dateStart, input.dateEnd);
  return input.origins.length * input.destinations.length * dates.length;
}

export async function searchMatrix(
  input: MatrixInput
): Promise<MatrixResult> {
  const selected = new Set(input.selectedCardIds);
  const dates = listDates(input.dateStart, input.dateEnd);
  const saverOnly = input.saverOnly ?? true;
  const cells: MatrixCell[] = [];

  for (const origin of input.origins) {
    for (const destination of input.destinations) {
      if (origin === destination) continue;
      const key = routeKey(origin, destination);
      const route = ROUTES[key];
      const cashFare = route?.cashFare[input.cabin] ?? FALLBACK_FARE[input.cabin];
      const spots = SWEET_SPOTS[key] ?? [];
      const reachable = spots
        .map((spot) => {
          const cardId = spot.viaCards.find((id) => selected.has(id));
          if (!cardId) return null;
          const basePoints = spot.points[input.cabin];
          if (!basePoints) return null;
          const points = saverOnly
            ? basePoints
            : Math.round(basePoints * STANDARD_MULTIPLIER);
          const cpp = (cashFare - spot.fees) / points;
          return { spot, points, cpp };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null);

      for (const date of dates) {
        let best: (typeof reachable)[number] | null = null;
        for (const r of reachable) {
          if (!best || r.cpp > best.cpp) best = r;
        }

        let availability: AvailabilityStatus = "none";
        let cell: MatrixCell;
        if (best) {
          const a = await getAvailability(
            key,
            date,
            best.spot.program,
            input.cabin
          );
          availability = a.status;
          cell = {
            origin,
            destination,
            date,
            cabin: input.cabin,
            points: best.points,
            program: best.spot.program,
            currency: best.spot.from,
            cpp: best.cpp,
            fees: best.spot.fees,
            cashFare,
            availability,
          };
        } else {
          cell = {
            origin,
            destination,
            date,
            cabin: input.cabin,
            points: null,
            program: null,
            currency: null,
            cpp: null,
            fees: 0,
            cashFare,
            availability: "none",
          };
        }
        cells.push(cell);
      }
    }
  }

  const bookable = cells.filter(
    (c) => c.availability === "open" && c.points !== null && c.cpp !== null
  );
  bookable.sort((a, b) => (b.cpp ?? 0) - (a.cpp ?? 0));
  const best = bookable[0] ?? null;

  return {
    cells,
    best,
    totalCombinations: cells.length,
  };
}

export const UNICORN_CPP_THRESHOLD = 5;
void FALLBACK_DURATION;
