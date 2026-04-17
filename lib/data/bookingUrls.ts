type BookingContext = {
  origin: string;
  destination: string;
  departDate: string;
};

const GOOGLE_FLIGHTS = "https://www.google.com/travel/flights";

function cashUrl({ origin, destination, departDate }: BookingContext): string {
  const q = `Flights from ${origin} to ${destination} on ${departDate}`;
  return `${GOOGLE_FLIGHTS}?q=${encodeURIComponent(q)}`;
}

const PROGRAM_URLS: Array<{ match: RegExp; url: string }> = [
  { match: /virgin atlantic/i, url: "https://www.virginatlantic.com/flight-search/book-a-flight" },
  { match: /aeroplan|air canada/i, url: "https://www.aircanada.com/aeroplan/redeem/" },
  { match: /flying blue|air france/i, url: "https://www.flyingblue.com/en/use/awards" },
  { match: /lifemiles|avianca/i, url: "https://www.avianca.com/us/en/lifemiles/" },
  { match: /alaska/i, url: "https://www.alaskaair.com/" },
  { match: /asia miles|cathay/i, url: "https://www.cathaypacific.com/cx/en_US/offers/asia-miles.html" },
  { match: /iberia|avios/i, url: "https://www.iberia.com/en/avios/" },
  { match: /krisflyer|singapore/i, url: "https://www.singaporeair.com/en_UK/us/ppsclub-krisflyer/use-miles/flight-redemption/" },
  { match: /american|aadvantage/i, url: "https://www.aa.com/booking/find-flights" },
  { match: /emirates/i, url: "https://www.emirates.com/us/english/book/" },
  { match: /qantas/i, url: "https://www.qantas.com/us/en/frequent-flyer/use-points/classic-reward-flights.html" },
];

export function getBookingUrl(
  option: {
    programKey: string | null;
    airline: string;
    rank: string;
  },
  ctx: BookingContext
): string | null {
  if (option.rank.startsWith("01")) return cashUrl(ctx);
  const needle = option.programKey ?? option.airline;
  const hit = PROGRAM_URLS.find(({ match }) => match.test(needle));
  return hit?.url ?? null;
}
