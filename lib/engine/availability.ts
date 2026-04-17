import type { Cabin } from "../data/routes";

export type AvailabilityStatus = "open" | "waitlist" | "none";
export type SeatCount = 2 | 4 | 6 | "multiple";

export type AvailabilityResult = {
  status: AvailabilityStatus;
  seatsLeft: SeatCount | 0;
};

function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function hashedFloat(key: string): number {
  return fnv1a(key) / 0xffffffff;
}

export async function getAvailability(
  routeKey: string,
  departDate: string,
  program: string,
  cabin: Cabin
): Promise<AvailabilityResult> {
  const seed = `${routeKey}|${departDate}|${program}|${cabin}`;
  const roll = hashedFloat(seed);

  if (roll < 0.55) {
    const seatRoll = hashedFloat(`${seed}|seats`);
    let seatsLeft: SeatCount;
    if (seatRoll < 0.2) seatsLeft = 2;
    else if (seatRoll < 0.55) seatsLeft = 4;
    else if (seatRoll < 0.85) seatsLeft = 6;
    else seatsLeft = "multiple";
    return { status: "open", seatsLeft };
  }
  if (roll < 0.75) {
    return { status: "waitlist", seatsLeft: 0 };
  }
  return { status: "none", seatsLeft: 0 };
}

export function formatSeatsLeft(r: AvailabilityResult): string {
  if (r.status === "open") {
    const count = r.seatsLeft === "multiple" ? "8+" : String(r.seatsLeft);
    return `${count} SEATS · SAVER`;
  }
  if (r.status === "waitlist") return "WAITLIST ONLY";
  return "NO SAVER SPACE";
}

export const AVAILABILITY_RANK: Record<AvailabilityStatus, number> = {
  open: 0,
  waitlist: 1,
  none: 2,
};

export function shiftDate(date: string, offsetDays: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}
