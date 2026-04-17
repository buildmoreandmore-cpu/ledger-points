function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export type RouteStats = {
  avgSaverSeats: string;
  typicallyReleased: number;
  reliabilityLabel: "Reliable" | "Mixed" | "Lottery";
};

export function getRouteStats(routeKey: string): RouteStats {
  const h = fnv1a(routeKey);
  const seatRoll = (h & 0xffff) / 0xffff;
  const daysRoll = ((h >> 16) & 0xffff) / 0xffff;

  const avg = (0.4 + seatRoll * 4.4).toFixed(1);
  const released = Math.round(21 + daysRoll * 280);

  const reliability: RouteStats["reliabilityLabel"] =
    seatRoll > 0.66 ? "Reliable" : seatRoll > 0.33 ? "Mixed" : "Lottery";

  return {
    avgSaverSeats: avg,
    typicallyReleased: released,
    reliabilityLabel: reliability,
  };
}
