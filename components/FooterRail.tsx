import Link from "next/link";

export default function FooterRail() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t hairline bg-paper">
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="display text-[20px] md:text-[22px] text-ink">
              Redeem<span className="text-accent">Max</span>
              <span className="text-ink-faint text-[15px] ml-1">.com</span>
            </div>
            <div className="mt-1 text-[14px] font-medium text-ink">
              Every point.{" "}
              <em className="italic text-accent not-italic font-semibold">
                Maximum trip.
              </em>
            </div>
            <p className="mt-3 text-[14px] leading-[1.5] text-ink-soft md:text-[15px] max-w-[380px]">
              A points-to-travel engine for people who already know what
              Ultimate Rewards are for.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <div className="mono-label mb-2.5">Features</div>
            <ul className="flex flex-col gap-1.5">
              <li>
                <Link
                  href="/app"
                  className="text-[14px] text-ink-soft hover:text-ink"
                >
                  Try the tool
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  className="text-[14px] text-ink-soft hover:text-ink"
                >
                  Deals
                </Link>
              </li>
              <li>
                <Link
                  href="/strategy"
                  className="text-[14px] text-ink-soft hover:text-ink"
                >
                  Strategy
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="text-[14px] text-ink-soft hover:text-ink"
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link
                  href="/earn"
                  className="text-[14px] text-ink-soft hover:text-ink"
                >
                  Earn faster
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="mono-label mb-2.5">Principles</div>
            <ul className="flex flex-col gap-1.5 text-[14px] text-ink-soft">
              <li>Built for frequent flyers</li>
              <li>Saver-only inventory</li>
              <li>Updated every 90 seconds</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t hairline pt-5 md:flex-row md:items-center md:justify-between">
          <span className="mono-label">© {year} RedeemMax.com</span>
          <span className="mono-label text-ink-faint">
            Award pricing data compiled from public carrier charts
          </span>
        </div>
      </div>
    </footer>
  );
}
