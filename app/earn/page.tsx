import Link from "next/link";
import Masthead from "@/components/Masthead";
import FooterRail from "@/components/FooterRail";

type EarnTile = {
  title: string;
  body: string;
  label: string;
};

const TILES: EarnTile[] = [
  {
    label: "Active offers",
    title: "Amex Offers & Chase Offers sweep",
    body: "Every week we scan your linked cards for statement credits, bonus-category offers, and dining rewards you forgot to activate. Connect cards in the app to turn this on.",
  },
  {
    label: "Next-purchase",
    title: "What to put on which card",
    body: "Add a pending purchase (amount, category, merchant). We'll tell you which card earns the most back — and whether a new card with a signup bonus would beat any of them.",
  },
  {
    label: "Wallet gap",
    title: "The one card you're missing",
    body: "Based on your current wallet, here's the single card whose transfer partners would unlock the most new redemptions. Recommendation respects your 5/24 count.",
  },
  {
    label: "Referral ledger",
    title: "Who owes you what",
    body: "A log of every referral you've sent and whether it's cleared. Monthly reminder when a referral bonus hasn't posted after 45 days.",
  },
];

export default function EarnPage() {
  return (
    <main className="min-h-dvh">
      <Masthead />
      <section className="border-b hairline">
        <div className="mx-auto max-w-[1440px] px-4 pt-14 pb-6 md:px-8 md:pt-20">
          <div className="mono-label mb-3 text-accent">Earn faster</div>
          <h1 className="display text-[32px] md:text-[52px] leading-[1.04]">
            Every point you earn <em>should work.</em>
          </h1>
          <p className="mt-4 max-w-[720px] text-[16px] leading-[1.55] text-ink-soft md:text-[18px]">
            Redemption is half the game. Earning faster is the other half. A
            set of tools to make every swipe count, route spend to the right
            card, and never miss a statement credit.
          </p>
          <Link
            href="#waitlist"
            className="mt-6 inline-flex mono-label bg-[#0a0a0a] text-white px-5 py-3 hover:opacity-85 transition-opacity font-medium"
            style={{ borderRadius: "10px" }}
          >
            Join the waitlist to unlock →
          </Link>
        </div>
      </section>

      <section className="border-b hairline bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 py-12 md:px-8 md:py-16">
          <ul className="grid gap-4 md:grid-cols-2 md:gap-6">
            {TILES.map((t) => (
              <li
                key={t.label}
                className="bg-paper border hairline-strong card-shadow p-5 md:p-6"
                style={{ borderRadius: "16px" }}
              >
                <div className="mono-label text-accent mb-2">{t.label}</div>
                <h3 className="display text-[20px] md:text-[22px] text-ink leading-[1.2]">
                  {t.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.55] text-ink-soft md:text-[15px]">
                  {t.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FooterRail />
    </main>
  );
}
