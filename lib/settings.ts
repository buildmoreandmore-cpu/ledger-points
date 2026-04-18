export type ValuationKey =
  | "MR"
  | "UR"
  | "C1"
  | "TY"
  | "BILT"
  | "AS"
  | "VS"
  | "FB";

export type AlertType = "saver" | "bonuses" | "expiring" | "deals";

export type Settings = {
  valuations: Record<ValuationKey, number>;
  slashTwentyFour: number;
  email: string;
  alertTypes: AlertType[];
};

export const DEFAULT_SETTINGS: Settings = {
  valuations: {
    MR: 2.0,
    UR: 2.0,
    C1: 1.85,
    TY: 1.8,
    BILT: 2.05,
    AS: 1.8,
    VS: 1.5,
    FB: 1.3,
  },
  slashTwentyFour: 0,
  email: "",
  alertTypes: ["saver", "bonuses", "expiring", "deals"],
};

export const VALUATION_LABELS: Record<ValuationKey, string> = {
  MR: "Amex Membership Rewards",
  UR: "Chase Ultimate Rewards",
  C1: "Capital One Miles",
  TY: "Citi ThankYou Points",
  BILT: "Bilt Rewards",
  AS: "Alaska Mileage Plan",
  VS: "Virgin Atlantic Flying Club",
  FB: "Air France Flying Blue",
};

const STORAGE_KEY = "redeemmax_settings";

export function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      valuations: {
        ...DEFAULT_SETTINGS.valuations,
        ...(parsed?.valuations ?? {}),
      },
      alertTypes: Array.isArray(parsed.alertTypes)
        ? (parsed.alertTypes as AlertType[])
        : DEFAULT_SETTINGS.alertTypes,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore quota/unavailable
  }
}

export function cardCurrencyToValuation(
  currency: string | null
): ValuationKey | null {
  if (!currency) return null;
  if (currency === "MR" || currency === "UR" || currency === "C1" || currency === "TY" || currency === "BILT") {
    return currency as ValuationKey;
  }
  return null;
}
