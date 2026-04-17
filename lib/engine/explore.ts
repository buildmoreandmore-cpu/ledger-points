import { AIRPORTS, DESTINATIONS, ROUTES, routeKey } from "../data/routes";
import type { Cabin } from "../data/routes";
import { SWEET_SPOTS } from "../data/sweetSpots";
import { getAvailability } from "./availability";

export type Region =
  | "europe"
  | "asia"
  | "south-america"
  | "oceania"
  | "middle-east"
  | "any";

export const REGION_LABELS: Record<Region, string> = {
  europe: "Europe",
  asia: "Asia",
  "south-america": "South America",
  oceania: "Oceania",
  "middle-east": "Middle East",
  any: "Anywhere",
};

const REGION_MAP: Record<Region, readonly string[]> = {
  europe: ["CDG", "LHR", "FCO"],
  asia: ["NRT", "HND", "HKG"],
  "south-america": ["GRU"],
  oceania: ["SYD"],
  "middle-east": ["DXB"],
  any: DESTINATIONS,
};

export type ExploreInput = {
  origin: string;
  cabin: Cabin;
  region: Region;
  departDate: string;
  selectedCardIds: string[];
  rankBy: "points" | "cpp";
};

export type ExploreResult = {
  destination: string;
  destinationCity: string;
  duration: string;
  cashFare: number;
  bestProgram: string | null;
  bestPoints: number | null;
  bestCpp: number | null;
  availability: "open" | "waitlist" | "none";
};

export async function exploreDestinations(
  input: ExploreInput
): Promise<ExploreResult[]> {
  const selected = new Set(input.selectedCardIds);
  const candidates = REGION_MAP[input.region];
  const results: ExploreResult[] = [];

  for (const dest of candidates) {
    const key = routeKey(input.origin, dest);
    const route = ROUTES[key];
    if (!route) continue;

    const cash = route.cashFare[input.cabin];
    const spots = SWEET_SPOTS[key] ?? [];

    const reachable = spots
      .map((spot) => {
        const cardId = spot.viaCards.find((id) => selected.has(id));
        if (!cardId) return null;
        const pts = spot.points[input.cabin];
        if (!pts) return null;
        const cpp = (cash - spot.fees) / pts;
        return { spot, pts, cpp };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    let best: (typeof reachable)[number] | null = null;
    if (reachable.length) {
      best = reachable.reduce((a, b) => {
        if (input.rankBy === "points") return a.pts <= b.pts ? a : b;
        return a.cpp >= b.cpp ? a : b;
      });
    }

    const avail = best
      ? (await getAvailability(
          key,
          input.departDate,
          best.spot.program,
          input.cabin
        )).status
      : "none";

    results.push({
      destination: dest,
      destinationCity: AIRPORTS[dest] ?? dest,
      duration: route.duration,
      cashFare: cash,
      bestProgram: best?.spot.program ?? null,
      bestPoints: best?.pts ?? null,
      bestCpp: best?.cpp ?? null,
      availability: avail,
    });
  }

  results.sort((a, b) => {
    if (input.rankBy === "points") {
      return (a.bestPoints ?? Infinity) - (b.bestPoints ?? Infinity);
    }
    return (b.bestCpp ?? -Infinity) - (a.bestCpp ?? -Infinity);
  });

  return results.slice(0, 6);
}
