"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Masthead from "@/components/Masthead";
import Hero from "@/components/Hero";
import CardLibrary from "@/components/CardLibrary";
import SearchForm, { type SearchFormValues } from "@/components/SearchForm";
import ResultsGrid from "@/components/ResultsGrid";
import EngineRoom from "@/components/EngineRoom";
import WaitlistForm from "@/components/WaitlistForm";
import FooterRail from "@/components/FooterRail";
import { searchFlights, type SearchResult } from "@/lib/engine/search";

type Status = "idle" | "searching" | "ready";

const WALLET_KEY = "lp:wallet:v1";

export default function Home() {
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([
    "csr",
    "amp",
  ]);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [lastValues, setLastValues] = useState<SearchFormValues | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const hasHydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(WALLET_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (
          Array.isArray(parsed) &&
          parsed.every((x) => typeof x === "string")
        ) {
          setSelectedCardIds(parsed);
        }
      }
    } catch {
      // ignore malformed storage
    }
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    try {
      window.localStorage.setItem(WALLET_KEY, JSON.stringify(selectedCardIds));
    } catch {
      // quota/unavailable — not fatal for a demo
    }
  }, [selectedCardIds]);

  const toggleCard = useCallback((cardId: string) => {
    setSelectedCardIds((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId]
    );
  }, []);

  const runSearch = useCallback(
    async (values: SearchFormValues) => {
      setStatus("searching");
      setLastValues(values);
      const start = performance.now();
      const next = await searchFlights({
        ...values,
        selectedCardIds,
      });
      const elapsed = performance.now() - start;
      const waitFor = Math.max(0, 1100 - elapsed);
      await new Promise((r) => setTimeout(r, waitFor));
      setResult(next);
      setStatus("ready");
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    },
    [selectedCardIds]
  );

  const rerunForDate = useCallback(
    async (date: string) => {
      if (!lastValues) return;
      await runSearch({ ...lastValues, departDate: date });
    },
    [lastValues, runSearch]
  );

  return (
    <main className="min-h-dvh">
      <Masthead />
      <Hero />
      <CardLibrary selectedCardIds={selectedCardIds} onToggle={toggleCard} />
      <SearchForm
        initial={lastValues ?? undefined}
        onSubmit={runSearch}
        isSearching={status === "searching"}
      />
      <div ref={resultsRef}>
        {result ? (
          <ResultsGrid
            result={result}
            status={status}
            onPickFlexDate={rerunForDate}
          />
        ) : (
          <EmptyResultsPlaceholder />
        )}
      </div>
      <EngineRoom />
      <WaitlistForm />
      <FooterRail />
    </main>
  );
}

function EmptyResultsPlaceholder() {
  return (
    <section className="border-b hairline">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
        <div className="mono-label text-accent">
          03 · Three Booking Options
        </div>
        <h2 className="display mt-4 text-[44px] leading-[1.04] md:text-[64px] text-ink-faint">
          Awaiting <em>your wallet</em>, your flight, your question.
        </h2>
        <p className="mt-6 max-w-[680px] font-display text-[18px] leading-[1.55] text-ink-soft">
          Pick the cards you carry up above, then run a search. We&apos;ll
          return the cash fare, your best transfer-partner award, and the
          sweet-spot redemption most comparison sites refuse to surface.
        </p>
      </div>
    </section>
  );
}
