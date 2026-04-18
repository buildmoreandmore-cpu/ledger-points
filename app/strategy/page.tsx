"use client";

import { useEffect, useMemo, useState } from "react";
import Masthead from "@/components/Masthead";
import FooterRail from "@/components/FooterRail";
import StrategyMoves from "@/components/StrategyMoves";
import PointsStrategyCTA from "@/components/PointsStrategyCTA";
import { CARD_BY_ID, type CardCurrency } from "@/lib/data/cards";
import type { Cabin } from "@/lib/data/routes";
import { useRouter } from "next/navigation";

const WALLET_KEY = "lp:wallet:v1";
const BALANCES_KEY = "lp:balances:v1";

export default function StrategyPage() {
  const router = useRouter();
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const rawW = window.localStorage.getItem(WALLET_KEY);
      if (rawW) {
        const parsed = JSON.parse(rawW);
        if (Array.isArray(parsed)) setSelectedCardIds(parsed as string[]);
      }
      const rawB = window.localStorage.getItem(BALANCES_KEY);
      if (rawB) {
        const parsed = JSON.parse(rawB);
        if (parsed && typeof parsed === "object") setBalances(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const balanceByCurrency: Partial<Record<CardCurrency, number>> = useMemo(() => {
    const out: Partial<Record<CardCurrency, number>> = {};
    for (const id of selectedCardIds) {
      const card = CARD_BY_ID[id];
      if (!card) continue;
      out[card.currency] = (out[card.currency] ?? 0) + (balances[id] ?? 0);
    }
    return out;
  }, [selectedCardIds, balances]);

  function handleSearch(prefill: {
    origin: string;
    destination: string;
    cabin: Cabin;
  }) {
    const params = new URLSearchParams({
      origin: prefill.origin,
      destination: prefill.destination,
      cabin: prefill.cabin,
    });
    router.push(`/app?${params.toString()}`);
  }

  return (
    <main className="min-h-dvh">
      <Masthead />
      <section className="border-b hairline">
        <div className="mx-auto max-w-[1440px] px-4 pt-14 pb-6 md:px-8 md:pt-20">
          <div className="mono-label mb-3 text-accent">
            Your next move · Updated daily
          </div>
          <h1 className="display text-[32px] md:text-[52px] leading-[1.04]">
            Strategy that <em>earns you more</em> than your next search.
          </h1>
          <p className="mt-4 max-w-[720px] text-[16px] leading-[1.55] text-ink-soft md:text-[18px]">
            Personalized moves based on the cards you&apos;ve added, the
            balances you hold, and the transfer bonuses running right now. Go
            to the app first if you haven&apos;t selected your wallet.
          </p>
        </div>
      </section>
      <StrategyMoves
        selectedCardIds={selectedCardIds}
        balanceByCurrency={balanceByCurrency}
        onRunSearch={handleSearch}
        onPickCard={(cardId) => {
          router.push(`/app?addCard=${cardId}`);
        }}
      />
      <PointsStrategyCTA />
      <FooterRail />
    </main>
  );
}
