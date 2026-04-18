import Link from "next/link";
import Masthead from "@/components/Masthead";
import FooterRail from "@/components/FooterRail";
import WaitlistForm from "@/components/WaitlistForm";
import ComparisonChart from "@/components/ComparisonChart";

export default function Landing() {
  return (
    <main className="min-h-dvh">
      <Masthead variant="marketing" />

      <section className="border-b hairline">
        <div className="mx-auto max-w-[1100px] px-4 pt-16 pb-20 md:px-8 md:pt-24 md:pb-28 text-center">
          <div className="mono-label mb-6 text-accent">
            RedeemMax · Private preview
          </div>
          <h1 className="display text-[44px] leading-[1.02] md:text-[80px] lg:text-[96px] tracking-[-0.045em]">
            Every point. <em>Maximum trip.</em>
          </h1>
          <p className="mt-6 mx-auto max-w-[680px] text-[17px] leading-[1.5] text-ink-soft md:text-[20px]">
            An award-search engine filtered to the cards in your wallet. One
            search replaces Seats.aero, AwardFares, AwardWallet, Thrifty
            Traveler, and every other tab you&apos;ve got open.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 md:flex-row md:justify-center">
            <Link
              href="#waitlist"
              className="mono-label bg-[#0a0a0a] text-white px-6 py-3 hover:opacity-85 transition-opacity font-medium inline-block"
              style={{ borderRadius: "10px" }}
            >
              Get early access →
            </Link>
            <Link
              href="/app"
              className="mono-label border hairline-strong bg-white px-6 py-3 text-ink hover:bg-surface transition-colors font-medium inline-block"
              style={{ borderRadius: "10px" }}
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b hairline bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-20">
          <div className="mb-10 text-center">
            <div className="mono-label mb-3 text-accent">
              What RedeemMax does
            </div>
            <h2 className="display text-[28px] md:text-[40px]">
              Three bookable options, <em>every time.</em>
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            <FeatureCard
              label="01 · Cash"
              title="The Google Flights baseline"
              body="We always show the published fare for comparison. Useful as a benchmark — not a recommendation."
            />
            <FeatureCard
              label="02 · Best award"
              title="Your sweet-spot transfer"
              body="The highest-cpp redemption your cards can actually reach, sorted first by live saver availability."
            />
            <FeatureCard
              label="03 · Alt award"
              title="The backup nobody surfaces"
              body="A second bookable path that protects against devaluations and widens your date flexibility."
            />
          </div>
        </div>
      </section>

      <section className="border-b hairline">
        <div className="mx-auto max-w-[1200px] px-4 py-16 md:px-8 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="mono-label mb-3 text-accent">
                Built for frequent flyers
              </div>
              <h2 className="display text-[28px] leading-[1.05] md:text-[40px]">
                Filtered to the cards <em>you actually hold.</em>
              </h2>
              <p className="mt-4 text-[15px] leading-[1.55] text-ink-soft md:text-[17px] max-w-[520px]">
                We never surface a redemption you can&apos;t book. Select your
                wallet once, and every suggestion — live space, transfer
                bonuses, expiring points, editorial deals — is gated by what
                your points can reach.
              </p>
              <Link
                href="/app"
                className="mt-6 inline-flex items-center gap-1.5 mono-label text-ink underline-offset-4 hover:underline"
              >
                Try the live demo →
              </Link>
            </div>
            <ul className="grid grid-cols-2 gap-3">
              <HighlightTile title="Live saver inventory" />
              <HighlightTile title="Transfer bonus alerts" />
              <HighlightTile title="Expiration warnings" />
              <HighlightTile title="5/24 aware" />
              <HighlightTile title="Date-flex matrix" />
              <HighlightTile title="Editorial deal briefs" />
              <HighlightTile title="Personalized moves" />
              <HighlightTile title="Custom valuations" />
            </ul>
          </div>
        </div>
      </section>

      <ComparisonChart variant="collapsed" />

      <WaitlistForm />
      <FooterRail />
    </main>
  );
}

function FeatureCard({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <article
      className="bg-paper card-shadow border hairline-strong p-5 md:p-6 flex flex-col gap-3"
      style={{ borderRadius: "16px" }}
    >
      <div className="mono-label text-accent">{label}</div>
      <h3 className="display text-[22px] md:text-[24px] leading-[1.2] text-ink">
        {title}
      </h3>
      <p className="text-[14px] leading-[1.55] text-ink-soft md:text-[15px]">
        {body}
      </p>
    </article>
  );
}

function HighlightTile({ title }: { title: string }) {
  return (
    <li
      className="bg-paper border hairline-strong px-4 py-3 text-[13px] md:text-[14px] font-medium text-ink"
      style={{ borderRadius: "10px" }}
    >
      {title}
    </li>
  );
}
