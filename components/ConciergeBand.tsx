export default function ConciergeBand() {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
        <div className="grid gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-8">
            <div className="mono-label mb-3 text-accent">
              06 · The concierge desk
            </div>
            <h2 className="display text-[30px] leading-[1.05] text-white md:text-[48px]">
              Don&apos;t want to <em>book it yourself?</em>
            </h2>
            <p className="mt-4 text-[15px] leading-[1.55] text-white/75 md:text-[17px] max-w-[640px]">
              We&apos;ll handle the whole booking: the transfer timing, the
              phone calls to program partners, the twenty-four-hour hold while
              fees clear, the seat assignments, the seat-map dance. One flat
              fee per passenger. No subscription required.
            </p>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pt-6">
            <div
              className="border border-white/20 p-5 md:p-6 bg-white/[0.03]"
              style={{ borderRadius: "16px" }}
            >
              <div className="mono-label mb-1.5 text-white/60">
                Per passenger · all in
              </div>
              <div className="display text-[38px] md:text-[48px] leading-[1] text-white">
                $150
              </div>
              <div className="mono-label mt-2 text-white/60">
                No subscription · cancel anytime
              </div>
              <a
                href="mailto:concierge@ledger-points.com?subject=Concierge+Booking"
                className="mt-5 mono-label inline-flex w-full justify-center bg-white text-ink px-5 py-3 hover:bg-white/90 transition-colors font-medium"
              >
                Start a concierge booking →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
