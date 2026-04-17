export default function PointsStrategyCTA() {
  return (
    <section className="border-b hairline bg-cream/50">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-24">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="mono-label mb-5 text-accent">
              05 · Earning the next trip
            </div>
            <h2 className="display text-[40px] leading-[1.04] md:text-[56px]">
              A human in your ear — when the <em>math gets hard.</em>
            </h2>
            <p className="mt-6 font-display text-[18px] leading-[1.55] text-ink-soft">
              Based on the cards you&apos;ve selected and the redemptions
              you&apos;re targeting, a Points Strategy consultation identifies
              which cards to open next and where to spend to hit your booking
              faster. Thirty minutes with someone who&apos;s done this for
              hundreds of travelers.
            </p>
            <div className="mt-8 font-display text-[22px] italic text-ink md:text-[26px]">
              The average customer unlocks{" "}
              <em className="text-accent not-italic font-semibold italic">
                $2,000 in additional redemption value
              </em>{" "}
              after a single call.
            </div>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pt-10">
            <div className="border hairline-strong bg-paper p-6">
              <div className="mono-label text-ink-faint mb-2">
                Flat rate · one session
              </div>
              <div className="font-display text-[40px] leading-[1] text-ink">
                $149
              </div>
              <div className="mono-label text-ink-faint mt-2">
                Includes a written strategy note you keep
              </div>
              <a
                href="mailto:hello@ledger-points.com?subject=Points+Strategy+Call"
                className="mt-6 mono-label inline-flex w-full justify-center border border-accent px-5 py-3 text-accent hover:bg-accent hover:text-cream transition-colors"
              >
                Request a strategy call
                <span className="inline-block pl-2 italic">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
