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
              Every point. <em className="italic text-accent not-italic font-semibold">Maximum trip.</em>
            </div>
            <p className="mt-3 text-[14px] leading-[1.5] text-ink-soft md:text-[15px]">
              A points-to-travel engine for people who already know what
              Ultimate Rewards are for.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <div className="mono-label mb-2.5">The product</div>
            <ul className="flex flex-col gap-1.5">
              <li>
                <a
                  href="#search"
                  className="text-[14px] text-ink-soft hover:text-ink"
                >
                  Run a search
                </a>
              </li>
              <li>
                <a
                  href="#comparison"
                  className="text-[14px] text-ink-soft hover:text-ink"
                >
                  The consolidation
                </a>
              </li>
              <li>
                <a
                  href="#waitlist"
                  className="text-[14px] text-ink-soft hover:text-ink"
                >
                  Beta waitlist
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="mono-label mb-2.5">Principles</div>
            <ul className="flex flex-col gap-1.5 text-[14px] text-ink-soft">
              <li>Saver inventory only, by default.</li>
              <li>Transferable currencies first.</li>
              <li>No surcharge laundering.</li>
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
