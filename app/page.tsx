"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Masthead from "@/components/Masthead";
import Hero from "@/components/Hero";
import UnicornsStrip from "@/components/UnicornsStrip";
import CardLibrary from "@/components/CardLibrary";
import BalancePanel, {
  type BalanceMap,
  type ExpirationMap,
} from "@/components/BalancePanel";
import SearchForm, { type SearchFormValues } from "@/components/SearchForm";
import ExploreMode from "@/components/ExploreMode";
import ResultsGrid from "@/components/ResultsGrid";
import ComparisonChart from "@/components/ComparisonChart";
import PointsStrategyCTA from "@/components/PointsStrategyCTA";
import ConciergeBand from "@/components/ConciergeBand";
import WaitlistForm from "@/components/WaitlistForm";
import FooterRail from "@/components/FooterRail";
import { searchFlights, type SearchResult } from "@/lib/engine/search";
import { getExpiration } from "@/lib/engine/expiration";
import { CARD_BY_ID, type CardCurrency } from "@/lib/data/cards";
import type { Cabin } from "@/lib/data/routes";

type Status = "idle" | "searching" | "ready";
type Mode = "specific" | "explore";

const WALLET_KEY = "lp:wallet:v1";
const BALANCES_KEY = "lp:balances:v1";

const DEFAULT_CARDS = ["csr", "amp", "bilt"];

function defaultBalances(ids: string[]): BalanceMap {
  const out: BalanceMap = {};
  for (const id of ids) {
    const card = CARD_BY_ID[id];
    if (card) out[id] = card.defaultPoints;
  }
  return out;
}

export default function Home() {
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>(DEFAULT_CARDS);
  const [balances, setBalances] = useState<BalanceMap>(
    defaultBalances(DEFAULT_CARDS)
  );
  const [mode, setMode] = useState<Mode>("specific");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [lastValues, setLastValues] = useState<SearchFormValues | null>(null);
  const [prefillValues, setPrefillValues] = useState<
    Partial<SearchFormValues> | undefined
  >(undefined);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const hasHydrated = useRef(false);

  useEffect(() => {
    try {
      const rawWallet = window.localStorage.getItem(WALLET_KEY);
      if (rawWallet) {
        const parsed = JSON.parse(rawWallet) as unknown;
        if (
          Array.isArray(parsed) &&
          parsed.every((x) => typeof x === "string")
        ) {
          setSelectedCardIds(parsed);
          setBalances((prev) => {
            const next: BalanceMap = { ...prev };
            for (const id of parsed) {
              if (next[id] === undefined) {
                next[id] = CARD_BY_ID[id]?.defaultPoints ?? 0;
              }
            }
            return next;
          });
        }
      }
      const rawBal = window.localStorage.getItem(BALANCES_KEY);
      if (rawBal) {
        const parsed = JSON.parse(rawBal) as unknown;
        if (parsed && typeof parsed === "object") {
          setBalances((prev) => ({ ...prev, ...(parsed as BalanceMap) }));
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
      window.localStorage.setItem(
        WALLET_KEY,
        JSON.stringify(selectedCardIds)
      );
      window.localStorage.setItem(BALANCES_KEY, JSON.stringify(balances));
    } catch {
      // ignore
    }
  }, [selectedCardIds, balances]);

  const toggleCard = useCallback((cardId: string) => {
    setSelectedCardIds((prev) => {
      const isOn = prev.includes(cardId);
      if (isOn) return prev.filter((id) => id !== cardId);
      return [...prev, cardId];
    });
    setBalances((prev) => {
      if (prev[cardId] !== undefined) return prev;
      const card = CARD_BY_ID[cardId];
      return { ...prev, [cardId]: card?.defaultPoints ?? 0 };
    });
  }, []);

  const onBalanceChange = useCallback((cardId: string, value: number) => {
    setBalances((prev) => ({ ...prev, [cardId]: value }));
  }, []);

  const expirations: ExpirationMap = useMemo(() => {
    const out: ExpirationMap = {};
    for (const id of selectedCardIds) {
      out[id] = getExpiration(id, balances[id] ?? 0);
    }
    return out;
  }, [selectedCardIds, balances]);

  const expiringCardIds = useMemo(() => {
    const set = new Set<string>();
    for (const [id, exp] of Object.entries(expirations)) {
      if (exp.hasExpiration) set.add(id);
    }
    return set;
  }, [expirations]);

  const balanceByCurrency: Partial<Record<CardCurrency, number>> =
    useMemo(() => {
      const out: Partial<Record<CardCurrency, number>> = {};
      for (const id of selectedCardIds) {
        const card = CARD_BY_ID[id];
        if (!card) continue;
        out[card.currency] =
          (out[card.currency] ?? 0) + (balances[id] ?? 0);
      }
      return out;
    }, [selectedCardIds, balances]);

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

  const handleUnicornPick = useCallback(
    (pick: { origin: string; destination: string; cabin: Cabin }) => {
      setMode("specific");
      setPrefillValues({ ...pick, saverOnly: true });
      const next: SearchFormValues = {
        origin: pick.origin,
        destination: pick.destination,
        departDate:
          lastValues?.departDate ??
          (() => {
            const d = new Date();
            d.setUTCDate(d.getUTCDate() + 45);
            return d.toISOString().slice(0, 10);
          })(),
        cabin: pick.cabin,
        saverOnly: true,
      };
      runSearch(next);
    },
    [lastValues, runSearch]
  );

  const handleExplorePick = useCallback(
    (destination: string) => {
      setMode("specific");
      const origin = lastValues?.origin ?? "ATL";
      const cabin = lastValues?.cabin ?? "business";
      const departDate =
        lastValues?.departDate ??
        (() => {
          const d = new Date();
          d.setUTCDate(d.getUTCDate() + 45);
          return d.toISOString().slice(0, 10);
        })();
      setPrefillValues({ origin, destination, cabin, saverOnly: true });
      runSearch({
        origin,
        destination,
        cabin,
        departDate,
        saverOnly: true,
      });
    },
    [lastValues, runSearch]
  );

  const initialOrigin = lastValues?.origin ?? "ATL";
  const initialCabin: Cabin = lastValues?.cabin ?? "business";
  const initialDepart =
    lastValues?.departDate ??
    (() => {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() + 45);
      return d.toISOString().slice(0, 10);
    })();

  return (
    <main className="min-h-dvh">
      <Masthead />
      <UnicornsStrip onPick={handleUnicornPick} />
      <Hero />
      <CardLibrary selectedCardIds={selectedCardIds} onToggle={toggleCard} />
      <BalancePanel
        selectedCardIds={selectedCardIds}
        balances={balances}
        expirations={expirations}
        onChange={onBalanceChange}
      />

      <section id="search" className="border-b hairline">
        <div className="mx-auto max-w-[1440px] px-4 pt-14 md:px-8 md:pt-20">
          <div
            className="mb-6 inline-flex bg-surface p-1 gap-1"
            style={{ borderRadius: "12px" }}
          >
            <button
              type="button"
              onClick={() => setMode("specific")}
              className={[
                "mono-label px-4 py-2 transition-colors font-medium",
                mode === "specific"
                  ? "bg-paper text-ink card-shadow"
                  : "bg-transparent text-ink-faint hover:text-ink",
              ].join(" ")}
              style={{ borderRadius: "8px" }}
            >
              Search a flight
            </button>
            <button
              type="button"
              onClick={() => setMode("explore")}
              className={[
                "mono-label px-4 py-2 transition-colors font-medium",
                mode === "explore"
                  ? "bg-paper text-ink card-shadow"
                  : "bg-transparent text-ink-faint hover:text-ink",
              ].join(" ")}
              style={{ borderRadius: "8px" }}
            >
              Explore destinations
            </button>
          </div>
        </div>

        {mode === "specific" ? (
          <SearchForm
            initial={prefillValues ?? lastValues ?? undefined}
            onSubmit={runSearch}
            isSearching={status === "searching"}
          />
        ) : (
          <div className="mx-auto max-w-[1440px] px-4 pb-14 md:px-8 md:pb-20">
            <div className="grid gap-6 md:grid-cols-12 md:gap-10 mb-6">
              <div className="md:col-span-6">
                <div className="mono-label mb-3 text-accent">
                  02b · Destination-first
                </div>
                <h2 className="display text-[28px] md:text-[40px]">
                  Let the <em>cards pick</em> the city.
                </h2>
              </div>
              <div className="md:col-span-5 md:col-start-8 md:pt-4">
                <p className="text-[15px] leading-[1.55] text-ink-soft md:text-[16px]">
                  Give us a region. We&apos;ll scan every route you can
                  actually redeem with the cards you hold, ranked by lowest
                  points or highest cpp.
                </p>
              </div>
            </div>
            <ExploreMode
              selectedCardIds={selectedCardIds}
              cabin={initialCabin}
              origin={initialOrigin}
              departDate={initialDepart}
              onPickDestination={handleExplorePick}
            />
          </div>
        )}
      </section>

      <div ref={resultsRef}>
        {result ? (
          <ResultsGrid
            result={result}
            status={status}
            onPickFlexDate={rerunForDate}
            balanceByCurrency={balanceByCurrency}
            expiringCardIds={expiringCardIds}
            selectedCardIds={selectedCardIds}
          />
        ) : (
          <EmptyResultsPlaceholder />
        )}
      </div>

      <ComparisonChart />
      <PointsStrategyCTA />
      <ConciergeBand />
      <WaitlistForm />
      <FooterRail />
    </main>
  );
}

function EmptyResultsPlaceholder() {
  return (
    <section className="border-b hairline">
      <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
        <div className="mono-label text-accent">
          03 · Three booking options
        </div>
        <h2 className="display mt-3 text-[28px] leading-[1.05] md:text-[44px] text-ink-faint">
          Awaiting <em>your wallet</em>, your flight, your question.
        </h2>
        <p className="mt-4 max-w-[640px] text-[15px] leading-[1.55] text-ink-soft md:text-[17px]">
          Pick the cards you carry above, edit your balances, then run a
          search. Or tap a unicorn from the live strip at the top to pre-fill.
        </p>
      </div>
    </section>
  );
}
