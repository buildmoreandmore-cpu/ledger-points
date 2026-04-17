export default function PointsStrategyCTA() {
  return (
    <section className="border-b hairline bg-surface">
      <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
        <div className="grid gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <div className="mono-label mb-3 text-accent">
              05 · Earning the next trip
            </div>
            <h2 className="display text-[28px] leading-[1.05] md:text-[40px]">
              A human in your ear — when the <em>math gets hard.</em>
            </h2>
            <p className="mt-4 text-[15px] leading-[1.55] text-ink-soft md:text-[17px] max-w-[620px]">
              Based on the cards you&apos;ve selected and the redemptions
              you&apos;re targeting, a Points Strategy consultation identifies
              which cards to open next and where to spend to hit your booking
              faster. Thirty minutes with someone who&apos;s done this for
              hundreds of travelers.
            </p>
            <div className="mt-6 text-[16px] text-ink md:text-[18px]">
              The average customer unlocks{" "}
              <em>$2,000 in additional redemption value</em> after a single
              call.
            </div>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pt-6">
            <div
              className="bg-paper card-shadow border hairline-strong p-5 md:p-6"
              style={{ borderRadius: "16px" }}
            >
              <div className="mono-label text-ink-faint mb-1.5">
                Flat rate · one session
              </div>
              <div className="display text-[36px] md:text-[44px] leading-[1] text-ink">
                $149
              </div>
              <div className="mono-label text-ink-faint mt-2">
                Includes a written strategy note you keep
              </div>
              <a
                href="mailto:hello@ledger-points.com?subject=Points+Strategy+Call"
                className="mt-5 mono-label inline-flex w-full justify-center bg-accent text-white px-5 py-3 hover:bg-accent-deep transition-colors font-medium"
              >
                Request a strategy call →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
