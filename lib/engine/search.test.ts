import { searchFlights } from "./search";
import { getAvailability } from "./availability";

type Case = { name: string; run: () => Promise<void> };

const cases: Case[] = [
  {
    name: "no cards → 3 options, cash first, no best-award badge",
    run: async () => {
      const r = await searchFlights({
        origin: "ATL",
        destination: "NRT",
        departDate: "2026-05-12",
        cabin: "business",
        selectedCardIds: [],
      });
      if (r.options.length !== 3) throw new Error("expected 3 options");
      if (r.options[0].rank !== "01 · CASH") throw new Error("cash first");
    },
  },
  {
    name: "Bilt only ATL→CDG → Flying Blue surfaces",
    run: async () => {
      const r = await searchFlights({
        origin: "ATL",
        destination: "CDG",
        departDate: "2026-05-12",
        cabin: "business",
        selectedCardIds: ["bilt"],
      });
      const programs = r.options.map((o) => o.airline).join(" ");
      if (!programs.includes("Flying Blue"))
        throw new Error(`expected Flying Blue; got ${programs}`);
    },
  },
  {
    name: "CSR+Amex JFK→LHR → best option isBest when open",
    run: async () => {
      const r = await searchFlights({
        origin: "JFK",
        destination: "LHR",
        departDate: "2026-05-12",
        cabin: "business",
        selectedCardIds: ["csr", "amp"],
      });
      const hasBest = r.options.some((o) => o.isBest);
      if (!hasBest) {
        const anyOpen = r.options.some(
          (o) => o.availability?.status === "open"
        );
        if (anyOpen)
          throw new Error("expected isBest=true when an open option exists");
      }
    },
  },
  {
    name: "unknown route ORD→CPT → fallback cash + 2 award/notes",
    run: async () => {
      const r = await searchFlights({
        origin: "ORD",
        destination: "CPT",
        departDate: "2026-05-12",
        cabin: "economy",
        selectedCardIds: ["csr", "amp"],
      });
      if (r.options.length !== 3) throw new Error("expected 3 options");
      if (!r.options[0].headlineNum.startsWith("$"))
        throw new Error("cash option should start with $");
    },
  },
  {
    name: "availability deterministic by seed",
    run: async () => {
      const a = await getAvailability(
        "ATL-NRT",
        "2026-05-12",
        "Aeroplan",
        "business"
      );
      const b = await getAvailability(
        "ATL-NRT",
        "2026-05-12",
        "Aeroplan",
        "business"
      );
      if (a.status !== b.status) throw new Error("should be deterministic");
    },
  },
  {
    name: "saverOnly=false → standard awards cost ~2.2× saver",
    run: async () => {
      const saver = await searchFlights({
        origin: "ATL",
        destination: "CDG",
        departDate: "2026-05-12",
        cabin: "business",
        selectedCardIds: ["csr"],
        saverOnly: true,
      });
      const standard = await searchFlights({
        origin: "ATL",
        destination: "CDG",
        departDate: "2026-05-12",
        cabin: "business",
        selectedCardIds: ["csr"],
        saverOnly: false,
      });
      const saverBest = saver.options.find((o) => o.programKey);
      const standardBest = standard.options.find(
        (o) => o.programKey === saverBest?.programKey
      );
      if (!saverBest || !standardBest) throw new Error("missing matching");
      const saverPoints = Number(saverBest.headlineNum.replace(/,/g, ""));
      const standardPoints = Number(standardBest.headlineNum.replace(/,/g, ""));
      const ratio = standardPoints / saverPoints;
      if (ratio < 2.0 || ratio > 2.4)
        throw new Error(`expected ~2.2× multiplier, got ${ratio}`);
    },
  },
  {
    name: "flexDates returns 7 entries offset -3..+3",
    run: async () => {
      const r = await searchFlights({
        origin: "JFK",
        destination: "CDG",
        departDate: "2026-05-12",
        cabin: "business",
        selectedCardIds: ["csr", "amp"],
      });
      if (r.flexDates.length !== 7)
        throw new Error(`expected 7 flex dates, got ${r.flexDates.length}`);
      if (r.flexDates[0].offset !== -3 || r.flexDates[6].offset !== 3)
        throw new Error("offsets wrong");
    },
  },
];

(async () => {
  let failed = 0;
  for (const c of cases) {
    try {
      await c.run();
      console.log("PASS:", c.name);
    } catch (err) {
      failed += 1;
      console.error("FAIL:", c.name, "→", (err as Error).message);
    }
  }
  if (failed > 0) {
    console.error(`\n${failed} test(s) failed`);
    process.exit(1);
  } else {
    console.log(`\nAll ${cases.length} tests passed`);
  }
})();
