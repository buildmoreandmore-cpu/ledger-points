export default function Hero() {
  return (
    <section className="border-b hairline">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="mono-label mb-8">
              Issue N°01 · The Transfer-Partner Dossier · Edited by Martin
              Francis, Atlanta
            </div>
            <h1 className="display text-[56px] leading-[1.02] md:text-[96px] md:leading-[0.98]">
              A points engine that <em>finally</em>
              <br />
              names the sweet spot.
            </h1>
            <div className="mt-10 flex flex-wrap items-center gap-5 text-ink-soft">
              <div className="mono-label text-ink">Built for frequent flyers</div>
              <span className="text-ink-faint">·</span>
              <div className="mono-label">Editorial, not algorithmic</div>
              <span className="text-ink-faint">·</span>
              <div className="mono-label">Updated with every chart change</div>
            </div>
          </div>

          <div className="md:col-span-5 md:pt-16">
            <p className="font-display text-[20px] leading-[1.55] text-ink-soft md:text-[22px]">
              <span className="float-left mr-2 font-display text-[64px] leading-[0.85] text-accent">
                O
              </span>
              ne search replaces Seats.aero, AwardFares, ExpertFlyer,
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
