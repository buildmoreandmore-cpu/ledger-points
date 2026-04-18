type Row = {
  capability: string;
  tool: string;
};

const ROWS: Row[] = [
  {
    capability: "Award availability across programs",
    tool: "Seats.aero ($10/mo Pro)",
  },
  {
    capability: "Live-search verification + aircraft filters",
    tool: "AwardFares ($10/mo)",
  },
  {
    capability: "Fare-class codes and seat maps",
    tool: "ExpertFlyer ($100/yr)",
  },
  { capability: "Points balance tracking across programs", tool: "AwardWallet" },
  { capability: "Expiration warnings on your balances", tool: "AwardWallet Plus" },
  {
    capability: "Unicorn finder (ANA First, Qatar QSuites)",
    tool: "Seats.aero Pro only",
  },
  {
    capability: "Route statistics and historical patterns",
    tool: "Seats.aero Pro only",
  },
  {
    capability: "Alerts when award space opens",
    tool: "Seats.aero, AwardFares",
  },
  {
    capability: "Transfer bonus tracking",
    tool: "The Points Guy, email lists",
  },
  { capability: "Destination-first discovery", tool: "Roame" },
  {
    capability: "Cash-fare + points intelligence",
    tool: "Thrifty Traveler + TPG",
  },
  {
    capability: "Personalized points strategy (moves tailored to your wallet)",
    tool: "Frequent Miler (manual) · point.me Premium ($260/yr)",
  },
  {
    capability: "Editorial deal briefs with positioning plays",
    tool: "Thrifty Traveler Premium ($99/yr)",
  },
  {
    capability: "Points strategy + concierge booking",
    tool: "point.me Premium ($260/yr + $200/booking)",
  },
];

const LEDGER_ROW = {
  capability: "Filters everything to YOUR cards only",
  tool: "— nobody does this —",
};

export default function ComparisonChart() {
  return (
    <section id="comparison" className="bg-ink text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
        <div className="mb-10 grid gap-6 md:grid-cols-12 md:gap-10 md:mb-14">
          <div className="md:col-span-7">
            <div className="mono-label mb-4 text-accent">
              04 · The consolidation
            </div>
            <h2 className="display text-[30px] leading-[1.05] text-white md:text-[48px] lg:text-[56px]">
              What you used to need <em>fourteen tools</em> for — now in one.
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pt-4">
            <p className="text-[15px] leading-[1.5] text-white/75 md:text-[16px]">
              Every row below is a capability someone on your team already pays
              for separately. The last row is the one nobody else ships.
            </p>
          </div>
        </div>

        <div
          className="bg-white/[0.03] border border-white/10 overflow-hidden"
          style={{ borderRadius: "16px" }}
        >
          <div className="hidden md:grid grid-cols-[1.3fr_1fr_auto] gap-6 px-5 py-3 border-b border-white/10">
            <span className="mono-label text-white/50">Capability</span>
            <span className="mono-label text-white/50">
              Tool everyone uses
            </span>
            <span className="mono-label text-white/50 text-right">
              RedeemMax
            </span>
          </div>

          {ROWS.map((row, i) => (
            <div
              key={i}
              className={[
                "grid grid-cols-[1fr_auto] md:grid-cols-[1.3fr_1fr_auto] gap-3 md:gap-6 px-4 md:px-5 py-3.5 md:py-4",
                i > 0 ? "border-t border-white/10" : "",
              ].join(" ")}
            >
              <span className="text-[14px] leading-[1.35] text-white md:text-[15px]">
                {row.capability}
              </span>
              <span className="hidden md:block text-[14px] text-white/50">
                {row.tool}
              </span>
              <span className="mono-label text-accent justify-self-end">
                ✓ Built in
              </span>
            </div>
          ))}

          <div
            className="grid grid-cols-[1fr_auto] md:grid-cols-[1.3fr_1fr_auto] gap-3 md:gap-6 px-4 md:px-5 py-4 md:py-5 bg-accent/15 border-t-2"
            style={{ borderColor: "var(--accent)" }}
          >
            <span className="font-semibold text-[15px] md:text-[17px] text-accent">
              {LEDGER_ROW.capability}
            </span>
            <span className="hidden md:block text-[14px] text-white/50">
              {LEDGER_ROW.tool}
            </span>
            <span className="mono-label font-semibold text-accent justify-self-end">
              ✓ Our edge
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
