type RouteAirline = { carrier: string; flight: string };

const ROUTE_AIRLINES: Record<string, RouteAirline> = {
  "ATL-NRT": { carrier: "Delta Air Lines", flight: "DL 295" },
  "ATL-HND": { carrier: "Delta Air Lines", flight: "DL 295" },
  "ATL-CDG": { carrier: "Delta · Air France", flight: "DL 84" },
  "ATL-LHR": { carrier: "Delta Air Lines", flight: "DL 30" },
  "ATL-GRU": { carrier: "Delta · LATAM", flight: "DL 59" },
  "ATL-DXB": { carrier: "Emirates", flight: "EK 210" },
  "ATL-FCO": { carrier: "Delta · ITA Airways", flight: "DL 242" },
  "ATL-HKG": { carrier: "Cathay Pacific", flight: "CX 801" },
  "ATL-SYD": { carrier: "Qantas · Delta", flight: "QF 64" },

  "JFK-NRT": { carrier: "ANA", flight: "NH 109" },
  "JFK-HND": { carrier: "ANA", flight: "NH 109" },
  "JFK-CDG": { carrier: "Air France", flight: "AF 7" },
  "JFK-LHR": { carrier: "Virgin Atlantic", flight: "VS 4" },
  "JFK-GRU": { carrier: "LATAM", flight: "LA 8187" },
  "JFK-DXB": { carrier: "Emirates", flight: "EK 202" },
  "JFK-FCO": { carrier: "ITA Airways", flight: "AZ 611" },
  "JFK-HKG": { carrier: "Cathay Pacific", flight: "CX 845" },
  "JFK-SYD": { carrier: "Qantas", flight: "QF 4" },

  "LAX-NRT": { carrier: "ANA", flight: "NH 105" },
  "LAX-HND": { carrier: "ANA", flight: "NH 105" },
  "LAX-CDG": { carrier: "Air France", flight: "AF 65" },
  "LAX-LHR": { carrier: "British Airways · Virgin", flight: "BA 268" },
  "LAX-GRU": { carrier: "LATAM", flight: "LA 533" },
  "LAX-DXB": { carrier: "Emirates", flight: "EK 216" },
  "LAX-FCO": { carrier: "ITA Airways", flight: "AZ 621" },
  "LAX-HKG": { carrier: "Cathay Pacific", flight: "CX 883" },
  "LAX-SYD": { carrier: "Qantas", flight: "QF 12" },
};

export function pickAirline(routeKey: string): RouteAirline {
  return (
    ROUTE_AIRLINES[routeKey.toUpperCase()] ?? {
      carrier: "Star Alliance partner",
      flight: "—",
    }
  );
}
