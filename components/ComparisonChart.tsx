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
  {
    capability: "Points balance tracking across programs",
    tool: "AwardWallet",
  },
  {
    capability: "Expiration warnings on your balances",
    tool: "AwardWallet Plus",
  },
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
  {
    capability: "Destination-first discovery",
    tool: "Roame",
  },
  {
    capability: "Cash-fare + points intelligence",
    tool: "Thrifty Traveler + TPG",
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
    <section id="comparison" className="bg-ink text-cream">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
        <div className="mb-14 grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="mono-label mb-6 text-accent">
              04 · The Consolidation
            </div>
            <h2 className="display text-[44px] leading-[1.04] text-cream md:text-[64px]">
              What you used to need <em>twelve tools</em> for — now in one.
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pt-6">
            <p className="font-display text-[16px] leading-[1.55] text-cream/75">
              The honest case for this product, in a single scan. Every row is
              a capability someone on your team already pays for separately.
              The last row is the one nobody else ships.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1.2fr_auto] md:grid-cols-[1.3fr_1fr_auto] gap-x-6 gap-y-0">
          <div className="hidden md:block py-4 mono-label text-cream/60">
            Capability
          </div>
          <div className="hidden md:block py-4 mono-label text-cream/60">
            Tool everyone uses
          </div>
          <div className="hidden md:block py-4 mono-label text-cream/60 text-right">
            Ledger/Points
          </div>

          <div
            className="col-span-full h-[1px]"
            style={{ background: "rgba(255, 255, 255,0.2)" }}
          />

          {ROWS.map((row, i) => (
            <RowRender
              key={i}
              capability={row.capability}
              tool={row.tool}
              isFirst={i === 0}
            />
          ))}

          <div
            className="col-span-full h-[2px] mt-2"
            style={{ background: "var(--accent)" }}
          />

          <div className="py-6">
            <span className="font-display text-[18px] italic font-semibold text-accent md:text-[22px]">
              {LEDGER_ROW.capability}
            </span>
          </div>
          <div className="hidden md:block py-6">
            <span
              className="font-display text-[15px]"
              style={{ color: "rgba(255, 255, 255, 0.5)" }}
            >
              {LEDGER_ROW.tool}
            </span>
          </div>
          <div className="py-6 text-right">
            <span className="font-display text-[18px] italic font-semibold text-accent">
              ✓ Our edge
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function RowRender({
  capability,
  tool,
  isFirst,
}: {
  capability: string;
  tool: string;
  isFirst: boolean;
}) {
  const borderStyle = isFirst
    ? undefined
    : { borderTop: "1px solid rgba(255, 255, 255,0.14)" };
  return (
    <>
      <div className="py-4" style={borderStyle}>
        <span className="font-display text-[15px] leading-[1.35] text-cream md:text-[16px]">
          {capability}
        </span>
      </div>
      <div className="hidden md:block py-4" style={borderStyle}>
        <span
          className="font-display text-[14px]"
          style={{ color: "rgba(255, 255, 255, 0.5)" }}
        >
          {tool}
        </span>
      </div>
      <div className="py-4 text-right" style={borderStyle}>
        <span className="mono-label text-accent">✓ Built in</span>
      </div>
    </>
  );
}
