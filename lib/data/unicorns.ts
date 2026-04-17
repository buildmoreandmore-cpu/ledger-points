import type { Cabin } from "./routes";

export type Unicorn = {
  id: string;
  product: string;
  origin: string;
  destination: string;
  seats: string;
  points: string;
  program: string;
  cabin: Cabin;
  cardHint: string;
};

export const UNICORNS: Unicorn[] = [
  {
    id: "ana-f-jfk-nrt",
    product: "ANA First Class",
    origin: "JFK",
    destination: "NRT",
    seats: "2",
    points: "110K",
    program: "Virgin Atlantic",
    cabin: "first",
    cardHint: "Needs UR or Amex MR",
  },
  {
    id: "qatar-qsuites-lax-hkg",
    product: "Qatar Qsuites",
    origin: "LAX",
    destination: "HKG",
    seats: "4",
    points: "70K",
    program: "Alaska Mileage Plan",
    cabin: "business",
    cardHint: "Needs Bilt or Amex MR",
  },
  {
    id: "lufthansa-f-atl-fco",
    product: "Lufthansa First",
    origin: "ATL",
    destination: "FCO",
    seats: "1",
    points: "87K",
    program: "Aeroplan",
    cabin: "first",
    cardHint: "Needs UR or Amex MR",
  },
  {
    id: "emirates-f-jfk-dxb",
    product: "Emirates First",
    origin: "JFK",
    destination: "DXB",
    seats: "2",
    points: "136K",
    program: "Skywards via Alaska",
    cabin: "first",
    cardHint: "Needs Amex MR or Bilt",
  },
  {
    id: "cathay-f-lax-hkg",
    product: "Cathay First",
    origin: "LAX",
    destination: "HKG",
    seats: "2",
    points: "70K",
    program: "Alaska Mileage Plan",
    cabin: "first",
    cardHint: "Needs Amex MR or Bilt",
  },
];
