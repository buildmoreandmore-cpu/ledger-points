function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export type ExpirationInfo = {
  hasExpiration: boolean;
  days: number;
  dateLabel: string;
  urgency: "safe" | "soon" | "urgent";
};

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const TODAY_ISO = () => new Date().toISOString().slice(0, 10);

export function getExpiration(
  cardId: string,
  balance: number,
  today: string = TODAY_ISO()
): ExpirationInfo {
  const seed = `${cardId}|${balance}|${today}`;
  const h = fnv1a(seed);
  const roll = (h & 0xffff) / 0xffff;

  if (roll > 0.22) {
    return {
      hasExpiration: false,
      days: 0,
      dateLabel: "",
      urgency: "safe",
    };
  }

  const days = 14 + Math.floor(((h >> 16) & 0xffff) / 0xffff * 80);
  const expiryDate = new Date(`${today}T00:00:00Z`);
  expiryDate.setUTCDate(expiryDate.getUTCDate() + days);
  const urgency: ExpirationInfo["urgency"] =
    days <= 30 ? "urgent" : days <= 90 ? "soon" : "safe";

  return {
    hasExpiration: true,
    days,
    dateLabel: DATE_FMT.format(expiryDate),
    urgency,
  };
}
