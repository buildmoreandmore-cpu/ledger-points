export default function ConciergeBand() {
  return (
    <section className="bg-ink text-cream">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-24">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="mono-label mb-5" style={{ color: "var(--accent)" }}>
              06 · The Concierge Desk
            </div>
            <h2 className="display text-[40px] leading-[1.04] text-cream md:text-[60px]">
              Don&apos;t want to <em>book it yourself?</em>
            </h2>
            <p className="mt-6 font-display text-[17px] leading-[1.55] text-cream/80 md:text-[19px]">
              We&apos;ll handle the whole booking: the transfer timing, the
              phone calls to program partners, the twenty-four-hour hold while
              fees clear, the seat assignments, the seat-map dance. One flat
              fee per passenger. No subscription required.
            </p>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:pt-6">
            <div
              className="border p-6"
              style={{ borderColor: "rgba(255, 255, 255,0.25)" }}
            >
              <div className="mono-label mb-2" style={{ color: "rgba(255, 255, 255,0.6)" }}>
                Per passenger · all in
              </div>
              <div className="font-display text-[48px] leading-[1] text-cream">
                $150
              </div>
              <div
                className="mono-label mt-2"
                style={{ color: "rgba(255, 255, 255,0.6)" }}
              >
                No subscription · cancel anytime
              </div>
              <a
                href="mailto:concierge@ledger-points.com?subject=Concierge+Booking"
                className="mt-6 mono-label inline-flex w-full justify-center border border-accent px-5 py-3 text-accent hover:bg-accent hover:text-cream transition-colors"
              >
                Start a concierge booking
                <span className="inline-block pl-2 italic">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
