export default function FooterRail() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t hairline bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-display text-[24px] leading-tight text-ink">
              Ledger<span className="text-ink-faint">/</span>
              <span className="italic text-accent">Points</span>
            </div>
            <p className="mt-3 font-display text-[15px] leading-[1.5] text-ink-soft">
              A points-to-travel engine for people who already know what
              Ultimate Rewards are for.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <div className="mono-label mb-3">The Product</div>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="#search"
                  className="font-display text-[15px] text-ink-soft hover:text-ink"
                >
                  Run a search
                </a>
              </li>
              <li>
                <a
                  href="#engine-room"
                  className="font-display text-[15px] text-ink-soft hover:text-ink"
                >
                  The Engine Room
                </a>
              </li>
              <li>
                <a
                  href="#waitlist"
                  className="font-display text-[15px] text-ink-soft hover:text-ink"
                >
                  Beta waitlist
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="mono-label mb-3">Principles</div>
            <ul className="flex flex-col gap-2 font-display text-[15px] text-ink-soft">
              <li>Saver inventory only, by default.</li>
              <li>Transferable currencies first.</li>
              <li>No surcharge laundering.</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t hairline pt-6 md:flex-row md:items-center md:justify-between">
          <span className="mono-label">© {year} Ledger/Points</span>
          <span className="mono-label text-ink-faint">
            Award pricing data compiled from public carrier charts · typed in
            Fraunces &amp; Inter Tight
          </span>
        </div>
      </div>
    </footer>
  );
}
