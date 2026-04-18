"use client";

import { DEALS, dealOwnership, type Deal } from "@/lib/data/deals";

type Props = {
  selectedCardIds: string[];
};

const FLAME = (
  <svg
    width="12"
    height="14"
    viewBox="0 0 16 18"
    fill="currentColor"
    aria-hidden="true"
    className="inline-block"
  >
    <path d="M8 1 C 6.5 3.5, 7.5 5.5, 7 7 C 4.5 5.5, 3 7.5, 3 9.5 C 3 13, 5.5 17, 8 17 C 10.5 17, 13 13.5, 13 10.5 C 13 8, 11.5 6, 10 7 C 10.5 5, 9.5 3, 8 1 Z" />
  </svg>
);

function FlameCluster({ level }: { level: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-center gap-[1px] text-accent">
      {Array.from({ length: level }, (_, i) => (
        <span key={i}>{FLAME}</span>
      ))}
    </span>
  );
}

export default function DealsSection({ selectedCardIds }: Props) {
  return (
    <section
      id="deals"
      aria-label="This week's deals"
      className="border-b hairline bg-surface"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
        <div className="mb-10 grid gap-5 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <div className="mono-label mb-2 text-accent">
              This week&apos;s deals · Updated Fridays
            </div>
            <h2 className="display text-[28px] leading-[1.05] md:text-[40px]">
              The deals our editors <em>found this week.</em>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pt-4">
            <p className="text-[14px] leading-[1.55] text-ink-soft md:text-[15px]">
              Positioning plays, partner awards that price 40% below the
              obvious choice, and routes most searches never surface.
            </p>
          </div>
        </div>

        <ul className="flex flex-col gap-6 md:gap-8">
          {DEALS.map((d) => (
            <DealCard key={d.id} deal={d} selectedCardIds={selectedCardIds} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function DealCard({
  deal,
  selectedCardIds,
}: {
  deal: Deal;
  selectedCardIds: string[];
}) {
  const { owns, missingLabel } = dealOwnership(deal, selectedCardIds);
  const headlineParts = deal.headline.split(deal.accentWord);

  return (
    <li
      className="bg-paper card-shadow border hairline-strong overflow-hidden"
      style={{ borderRadius: "18px" }}
    >
      <div className="px-5 py-6 md:px-8 md:py-8 flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="mono-label bg-accent-soft text-accent px-2.5 py-[3px] inline-flex items-center gap-1.5"
            style={{ borderRadius: "999px" }}
          >
            <FlameCluster level={deal.heat} />
            <span>{deal.heatNote}</span>
          </span>
          <span
            className="mono-label bg-surface text-ink px-2.5 py-[3px]"
            style={{ borderRadius: "999px" }}
          >
            {deal.region}
          </span>
          <span className="mono-label text-ink-faint">
            Published {deal.publishedDate}
          </span>
        </div>

        <h3 className="display text-[26px] md:text-[36px] leading-[1.1] text-ink">
          {headlineParts[0]}
          <em>{deal.accentWord}</em>
          {headlineParts[1]}
        </h3>

        <p className="text-[15px] leading-[1.55] text-ink-soft md:text-[16px] max-w-[900px]">
          {deal.dek}
        </p>

        <div
          className="grid grid-cols-2 md:grid-cols-4 bg-surface border hairline-strong"
          style={{ borderRadius: "12px" }}
        >
          <Metric label="Points" value={deal.metrics.points} />
          <Metric label="Fees" value={deal.metrics.fees} border />
          <Metric label="Program" value={deal.metrics.program} border />
          <Metric label="Heat" value={deal.metrics.heat} border />
        </div>

        <div className="grid gap-6 md:grid-cols-2 md:gap-10">
          <div>
            <div className="mono-label mb-2 text-accent">Why we love it</div>
            <p className="text-[14px] leading-[1.55] text-ink-soft md:text-[15px]">
              {deal.whyWeLoveIt}
            </p>
          </div>
          <div>
            <div className="mono-label mb-2 text-accent">Routes & dates</div>
            <ul className="flex flex-col gap-1.5">
              {deal.routes.map((r) => (
                <li key={r.pair} className="text-[14px] leading-[1.45]">
                  <span className="font-semibold text-ink">{r.pair}</span>
                  <span className="text-ink-soft"> · {r.dates}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="mono-label mb-2 text-accent">How to book</div>
          <ol className="flex flex-col gap-1.5">
            {deal.howToBook.map((step, i) => (
              <li
                key={i}
                className="text-[14px] leading-[1.5] text-ink-soft md:text-[15px]"
              >
                <span className="mono-label text-ink-faint mr-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-3 border-t hairline pt-4 md:flex-row md:items-center md:justify-between">
          <span
            className={[
              "mono-label inline-flex items-center gap-2 px-3 py-[6px] w-fit",
              owns
                ? "bg-accent text-white"
                : "bg-white border hairline-strong text-ink-faint",
            ].join(" ")}
            style={{ borderRadius: "999px" }}
          >
            {owns ? (
              <>
                <CheckIcon />
                You have the points for this
              </>
            ) : (
              missingLabel
            )}
          </span>
          <button
            type="button"
            className="mono-label border hairline-strong bg-white px-4 py-2 text-ink hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a] transition-colors font-medium self-start md:self-auto"
            onClick={() => {
              const el = document.getElementById(`deal-${deal.id}`);
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            See full brief →
          </button>
        </div>
      </div>
    </li>
  );
}

function Metric({
  label,
  value,
  border,
}: {
  label: string;
  value: string;
  border?: boolean;
}) {
  return (
    <div
      className={[
        "px-4 py-3 md:px-5 md:py-4",
        border ? "border-l hairline-strong" : "",
      ].join(" ")}
    >
      <div className="mono-label text-ink-faint mb-1">{label}</div>
      <div className="font-semibold text-[16px] md:text-[17px] text-ink leading-[1.2]">
        {value}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 7 L6 10 L11 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
