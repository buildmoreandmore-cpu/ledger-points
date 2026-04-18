"use client";

import { useEffect, useState } from "react";
import Masthead from "@/components/Masthead";
import FooterRail from "@/components/FooterRail";
import ExploreMode from "@/components/ExploreMode";
import type { Cabin } from "@/lib/data/routes";
import { useRouter } from "next/navigation";

const WALLET_KEY = "lp:wallet:v1";

export default function ExplorePage() {
  const router = useRouter();
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [cabin] = useState<Cabin>("business");
  const [origin] = useState("ATL");
  const [departDate] = useState(() => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + 45);
    return d.toISOString().slice(0, 10);
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(WALLET_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSelectedCardIds(parsed as string[]);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <main className="min-h-dvh">
      <Masthead />
      <section className="border-b hairline">
        <div className="mx-auto max-w-[1440px] px-4 pt-14 pb-6 md:px-8 md:pt-20">
          <div className="mono-label mb-3 text-accent">
            Destination-first discovery
          </div>
          <h1 className="display text-[32px] md:text-[52px] leading-[1.04]">
            Let the <em>cards pick</em> the city.
          </h1>
          <p className="mt-4 max-w-[720px] text-[16px] leading-[1.55] text-ink-soft md:text-[18px]">
            Give us a region. We&apos;ll scan every route you can actually
            redeem with the cards you hold, ranked by lowest points or highest
            cpp.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-[1440px] px-4 py-10 md:px-8 md:py-14">
        <ExploreMode
          selectedCardIds={selectedCardIds}
          cabin={cabin}
          origin={origin}
          departDate={departDate}
          onPickDestination={(destination) => {
            const params = new URLSearchParams({
              origin,
              destination,
              cabin,
            });
            router.push(`/app?${params.toString()}`);
          }}
        />
      </div>
      <FooterRail />
    </main>
  );
}
