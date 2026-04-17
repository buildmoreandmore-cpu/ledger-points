export type Cabin = "economy" | "premium" | "business" | "first";

export type CashFare = Record<Cabin, number>;

export type RouteEntry = {
  duration: string;
  cashFare: CashFare;
};

export const AIRPORTS: Record<string, string> = {
  ATL: "Atlanta",
  JFK: "New York",
  LAX: "Los Angeles",
  NRT: "Tokyo Narita",
  HND: "Tokyo Haneda",
  CDG: "Paris",
  LHR: "London",
  GRU: "São Paulo",
  DXB: "Dubai",
  FCO: "Rome",
  HKG: "Hong Kong",
  SYD: "Sydney",
};

export const ORIGINS = ["ATL", "JFK", "LAX"] as const;
export const DESTINATIONS = [
  "NRT",
  "HND",
  "CDG",
  "LHR",
  "GRU",
  "DXB",
  "FCO",
  "HKG",
  "SYD",
] as const;

export const ROUTES: Record<string, RouteEntry> = {
  "ATL-NRT": {
    duration: "14h 10m",
    cashFare: { economy: 1420, premium: 2680, business: 5400, first: 9800 },
  },
  "ATL-HND": {
    duration: "14h 25m",
    cashFare: { economy: 1480, premium: 2740, business: 5620, first: 10200 },
  },
  "ATL-CDG": {
    duration: "8h 50m",
    cashFare: { economy: 780, premium: 1520, business: 3280, first: 6200 },
  },
  "ATL-LHR": {
    duration: "8h 35m",
    cashFare: { economy: 720, premium: 1460, business: 3120, first: 5800 },
  },
  "ATL-GRU": {
    duration: "10h 05m",
    cashFare: { economy: 920, premium: 1840, business: 3680, first: 6400 },
  },
  "ATL-DXB": {
    duration: "14h 45m",
    cashFare: { economy: 1620, premium: 2980, business: 6120, first: 11400 },
  },
  "ATL-FCO": {
    duration: "9h 40m",
    cashFare: { economy: 820, premium: 1620, business: 3440, first: 6600 },
  },
  "ATL-HKG": {
    duration: "15h 45m",
    cashFare: { economy: 1540, premium: 2840, business: 5780, first: 10400 },
  },
  "ATL-SYD": {
    duration: "18h 30m",
    cashFare: { economy: 1980, premium: 3420, business: 7200, first: 12800 },
  },

  "JFK-NRT": {
    duration: "13h 50m",
    cashFare: { economy: 1380, premium: 2580, business: 5280, first: 9600 },
  },
  "JFK-HND": {
    duration: "13h 35m",
    cashFare: { economy: 1420, premium: 2620, business: 5400, first: 9800 },
  },
  "JFK-CDG": {
    duration: "7h 15m",
    cashFare: { economy: 680, premium: 1320, business: 2980, first: 5600 },
  },
  "JFK-LHR": {
    duration: "7h 00m",
    cashFare: { economy: 620, premium: 1280, business: 2840, first: 5400 },
  },
  "JFK-GRU": {
    duration: "9h 50m",
    cashFare: { economy: 880, premium: 1740, business: 3540, first: 6200 },
  },
  "JFK-DXB": {
    duration: "12h 40m",
    cashFare: { economy: 1480, premium: 2840, business: 5820, first: 10800 },
  },
  "JFK-FCO": {
    duration: "8h 25m",
    cashFare: { economy: 740, premium: 1480, business: 3280, first: 6200 },
  },
  "JFK-HKG": {
    duration: "15h 55m",
    cashFare: { economy: 1580, premium: 2780, business: 5680, first: 10200 },
  },
  "JFK-SYD": {
    duration: "21h 20m",
    cashFare: { economy: 2080, premium: 3580, business: 7400, first: 13200 },
  },

  "LAX-NRT": {
    duration: "11h 45m",
    cashFare: { economy: 1240, premium: 2380, business: 4980, first: 9200 },
  },
  "LAX-HND": {
    duration: "11h 30m",
    cashFare: { economy: 1320, premium: 2480, business: 5240, first: 9600 },
  },
  "LAX-CDG": {
    duration: "10h 45m",
    cashFare: { economy: 920, premium: 1780, business: 3620, first: 6800 },
  },
  "LAX-LHR": {
    duration: "10h 25m",
    cashFare: { economy: 880, premium: 1720, business: 3480, first: 6600 },
  },
  "LAX-GRU": {
    duration: "12h 30m",
    cashFare: { economy: 1080, premium: 2040, business: 4120, first: 7200 },
  },
  "LAX-DXB": {
    duration: "16h 20m",
    cashFare: { economy: 1780, premium: 3180, business: 6420, first: 11800 },
  },
  "LAX-FCO": {
    duration: "12h 10m",
    cashFare: { economy: 980, premium: 1880, business: 3840, first: 7000 },
  },
  "LAX-HKG": {
    duration: "14h 40m",
    cashFare: { economy: 1380, premium: 2580, business: 5280, first: 9600 },
  },
  "LAX-SYD": {
    duration: "15h 10m",
    cashFare: { economy: 1680, premium: 3080, business: 6480, first: 11800 },
  },
};

export const routeKey = (origin: string, destination: string): string =>
  `${origin.toUpperCase()}-${destination.toUpperCase()}`;
