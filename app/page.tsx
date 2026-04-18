import Link from "next/link";
import Masthead from "@/components/Masthead";
import FooterRail from "@/components/FooterRail";
import WaitlistForm from "@/components/WaitlistForm";
import ComparisonChart from "@/components/ComparisonChart";

export default function Landing() {
  return (
    <main className="min-h-dvh">
      <Masthead variant="marketing" />

      <section className="border-b hairline">
        <div className="mx-auto max-w-[1100px] px-4 pt-20 pb-24 md:px-8 md:pt-32 md:pb-36 text-center">
          <div className="eyebrow mb-6 uppercase tracking-wider">
            Private preview · By invitation
          </div>
          <h1 className="display text-[44px] leading-[1.02] md:text-[88px] lg:text-[104px]">
            Every point.
            <br />
            <em>Maximum trip.</em>
          </h1>
          <p className="mt-8 mx-auto max-w-[640px] text-[17px] leading-[1.55] text-ink-soft md:text-[20px]">
            An award-search engine filtered to the cards in your wallet. One
            search replaces seventeen tools.
          </p>

          <div className="mt-12 flex flex-col items-center gap-3 md:flex-row md:justify-center md:gap-4">
            <Link
              href="#waitlist"
              className="bg-[#0a0a0a] text-white px-7 py-3.5 hover:opacity-85 transition-opacity font-semibold text-[15px] inline-block"
              style={{ borderRadius: "10px" }}
            >
              Get early access →
            </Link>
            <Link
              href="/app"
              className="border hairline-strong bg-white px-7 py-3.5 text-ink hover:bg-surface transition-colors font-semibold text-[15px] inline-block"
              style={{ borderRadius: "10px" }}
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b hairline">
        <div className="mx-auto max-w-[1200px] px-4 pt-20 pb-20 md:px-8 md:pt-28 md:pb-28">
          <div className="mb-12 md:mb-16">
            <div className="eyebrow mb-3 uppercase tracking-wider">
              What it does
            </div>
            <h2 className="display text-[28px] md:text-[44px] max-w-[720px]">
              Three bookable options. Every search.
            </h2>
          </div>
          <div className="grid gap-10 md:grid-cols-3 md:gap-16">
            <ColumnGroup
              label="01"
              title="Cash"
              items={[
                "Published Google Flights baseline",
                "Carrier surcharges + taxes",
                "Useful as comparison, never as a recommendation",
              ]}
            />
            <ColumnGroup
              label="02"
              title="Best award"
              items={[
                "Highest-cpp redemption your cards can reach",
                "Sorted first by live saver availability",
                "Transfer bonus applied when active",
              ]}
            />
            <ColumnGroup
              label="03"
              title="Alt award"
              items={[
                "Second path when best option isn't bookable",
                "Protects against devaluations",
                "Widens your date flexibility",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="border-b hairline bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 pt-20 pb-20 md:px-8 md:pt-28 md:pb-28">
          <div className="mb-12 md:mb-16">
            <div className="eyebrow mb-3 uppercase tracking-wider">
              Features
            </div>
            <h2 className="display text-[28px] md:text-[44px] max-w-[720px]">
              Everything you currently keep in seventeen tabs.
            </h2>
          </div>

          <div className="grid gap-12 md:grid-cols-4 md:gap-10">
            <ColumnGroup
              label="Search"
              items={[
                "Saver-only inventory",
                "Multi-airport matrix",
                "Date-flex ±3 days",
                "Unicorn finder",
                "Power-search (500 combos)",
              ]}
            />
            <ColumnGroup
              label="Wallet"
              items={[
                "Editable balances",
                "Expiration warnings",
                "5/24 awareness",
                "Custom point valuations",
                "Transfer bonus tracker",
              ]}
            />
            <ColumnGroup
              label="Strategy"
              items={[
                "Personalized moves",
                "Goal-tracker shortfall",
                "Card-gap recommendations",
                "Timing plays",
                "Concierge booking",
              ]}
            />
            <ColumnGroup
              label="Editorial"
              items={[
                "Weekly deal briefs",
                "How-to-book playbooks",
                "Route statistics",
                "Seat-map previews",
                "Heat indicators",
              ]}
            />
          </div>
        </div>
      </section>

      <ComparisonChart variant="collapsed" />

      <WaitlistForm />
      <FooterRail />
    </main>
  );
}

function ColumnGroup({
  label,
  title,
  items,
}: {
  label: string;
  title?: string;
  items: string[];
}) {
  return (
    <div>
      <div className="eyebrow uppercase tracking-wider mb-3">{label}</div>
      {title ? (
        <h3 className="display text-[22px] md:text-[26px] mb-5 leading-[1.15]">
          {title}
        </h3>
      ) : null}
      <ul className="column-list">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
