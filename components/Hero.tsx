export default function Hero() {
  return (
    <section className="border-b hairline">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="mono-label mb-6 text-accent">
              Ledger/Points · Private preview
            </div>
            <h1 className="display text-[48px] leading-[1.05] md:text-[80px] md:leading-[0.98]">
              A points engine <em>filtered to your wallet.</em>
            </h1>
            <div className="mt-10 flex flex-wrap items-center gap-4 text-ink-soft">
              <div className="mono-label text-ink">Built for frequent flyers</div>
              <span className="text-ink-faint">·</span>
              <div className="mono-label">Saver-only inventory</div>
              <span className="text-ink-faint">·</span>
              <div className="mono-label">Updated every 90 seconds</div>
            </div>
          </div>

          <div className="md:col-span-5 md:pt-12">
            <p className="font-display text-[18px] leading-[1.55] text-ink-soft md:text-[19px]">
              One search replaces Seats.aero, AwardFares, ExpertFlyer,
              AwardWallet, and every other tab you&apos;ve got open. Tell us
              which cards live in your wallet. We&apos;ll return three bookable
              options — cash, transfer partner, and the sweet-spot award —
              filtered to what you can actually redeem today.
            </p>
            <div className="mt-10 border-t hairline pt-6">
              <div className="mono-label">What you won&apos;t get</div>
              <p className="mt-3 font-display text-[17px] leading-[1.45] text-ink-faint">
                A newsletter about the best <em>Chase</em> card of the year. A
                lecture on status matches. A suggestion to buy miles on sale.
                This is the math, the chart, and the booking path — nothing
                else.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
