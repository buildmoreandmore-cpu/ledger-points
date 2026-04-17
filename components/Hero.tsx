export default function Hero() {
  return (
    <section className="border-b hairline">
      <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-24">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14">
          <div className="md:col-span-7">
            <div className="mono-label mb-5 text-accent">
              RedeemMax · Private preview
            </div>
            <h1 className="display text-[40px] leading-[1.02] md:text-[72px] lg:text-[80px]">
              Every point. <em>Maximum trip.</em>
            </h1>
            <p className="mt-5 text-[18px] md:text-[22px] font-medium text-ink-soft leading-[1.3] max-w-[620px]">
              An award engine filtered to the cards in your wallet.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-ink-soft">
              <div className="mono-label text-ink">
                Built for frequent flyers
              </div>
              <span className="text-ink-faint hidden md:inline">·</span>
              <div className="mono-label">Saver-only inventory</div>
              <span className="text-ink-faint hidden md:inline">·</span>
              <div className="mono-label">Updated every 90 seconds</div>
            </div>
          </div>

          <div className="md:col-span-5 md:pt-8">
            <p className="text-[16px] leading-[1.6] text-ink-soft md:text-[18px]">
              One search replaces Seats.aero, AwardFares, ExpertFlyer,
              AwardWallet, and every other tab you&apos;ve got open. Tell us
              which cards live in your wallet. We&apos;ll return three bookable
              options — cash, transfer partner, and the sweet-spot award —
              filtered to what you can actually redeem today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
