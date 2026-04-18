"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Masthead from "@/components/Masthead";
import UnicornsStrip from "@/components/UnicornsStrip";
import StrategyMoves from "@/components/StrategyMoves";
import CardLibrary from "@/components/CardLibrary";
import BalancePanel, {
  type BalanceMap,
  type ExpirationMap,
} from "@/components/BalancePanel";
import SearchForm, { type SearchFormValues } from "@/components/SearchForm";
import PowerSearch from "@/components/PowerSearch";
import ResultsGrid from "@/components/ResultsGrid";
import FooterRail from "@/components/FooterRail";
import { searchFlights, type SearchResult } from "@/lib/engine/search";
import { getExpiration } from "@/lib/engine/expiration";
import { CARD_BY_ID, type CardCurrency } from "@/lib/data/cards";
import type { Cabin } from "@/lib/data/routes";

type Status = "idle" | "searching" | "ready";
type Mode = "simple" | "power";

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

export default function AppPage() {
  const [selectedCardIds, setSelectedCardIds] =
    useState<string[]>(DEFAULT_CARDS);
  const [balances, setBalances] = useState<BalanceMap>(
    defaultBalances(DEFAULT_CARDS)
  );
  const [mode, setMode] = useState<Mode>("simple");
  const [balancesOpen, setBalancesOpen] = useState(false);
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
      // ignore
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
      setMode("simple");
      const cheapestFirst = lastValues?.cheapestFirst ?? false;
      const tripType = lastValues?.tripType ?? "round-trip";
      const departDate =
        lastValues?.departDate ??
        (() => {
          const d = new Date();
          d.setUTCDate(d.getUTCDate() + 45);
          return d.toISOString().slice(0, 10);
        })();
      const returnDate =
        lastValues?.returnDate ??
        (() => {
          const d = new Date(`${departDate}T00:00:00Z`);
          d.setUTCDate(d.getUTCDate() + 7);
          return d.toISOString().slice(0, 10);
        })();
      setPrefillValues({
        ...pick,
        saverOnly: true,
        cheapestFirst,
        tripType,
        returnDate,
      });
      runSearch({
        origin: pick.origin,
        destination: pick.destination,
        departDate,
        returnDate,
        tripType,
        cabin: pick.cabin,
        saverOnly: true,
        cheapestFirst,
      });
    },
    [lastValues, runSearch]
  );

  const handleStrategyCardPick = useCallback((cardId: string) => {
    const el = document.getElementById("wallet");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setSelectedCardIds((prev) =>
      prev.includes(cardId) ? prev : [...prev, cardId]
    );
    setBalances((prev) =>
      prev[cardId] !== undefined
        ? prev
        : { ...prev, [cardId]: CARD_BY_ID[cardId]?.defaultPoints ?? 0 }
    );
  }, []);

  return (
    <main className="min-h-dvh">
      <Masthead />
      <UnicornsStrip onPick={handleUnicornPick} />

      <section className="border-b hairline">
        <div className="mx-auto max-w-[1200px] px-4 pt-14 pb-10 md:px-8 md:pt-20 md:pb-14">
          <div className="eyebrow mb-3 uppercase tracking-wider">
            Your wallet
          </div>
          <h1 className="display text-[32px] md:text-[48px] max-w-[720px]">
            Tap the cards you hold.
          </h1>
        </div>
      </section>

      <CardLibrary selectedCardIds={selectedCardIds} onToggle={toggleCard} />

      <section className="border-b hairline">
        <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8 md:py-8">
          <button
            type="button"
            onClick={() => setBalancesOpen((o) => !o)}
            className="flex items-center gap-2 text-[14px] font-medium text-ink hover:text-accent transition-colors"
            aria-expanded={balancesOpen}
          >
            <span className={balancesOpen ? "rotate-90 transition-transform" : "transition-transform"}>
              ▸
            </span>
            Edit balances · {selectedCardIds.length} card{selectedCardIds.length === 1 ? "" : "s"}
          </button>
        </div>
        {balancesOpen ? (
          <BalancePanel
            selectedCardIds={selectedCardIds}
            balances={balances}
            expirations={expirations}
            onChange={onBalanceChange}
          />
        ) : null}
      </section>

      <section id="search" className="border-b hairline">
        <div className="mx-auto max-w-[1200px] px-4 pt-14 pb-6 md:px-8 md:pt-20 md:pb-8">
          <div className="eyebrow mb-3 uppercase tracking-wider">Search</div>
          <h2 className="display text-[32px] md:text-[48px] max-w-[720px]">
            Where to?
          </h2>
        </div>

        {mode === "simple" ? (
          <SearchForm
            initial={prefillValues ?? lastValues ?? undefined}
            onSubmit={runSearch}
            isSearching={status === "searching"}
          />
        ) : (
          <div className="mx-auto max-w-[1200px] px-4 pb-10 md:px-8 md:pb-14">
            <PowerSearch
              selectedCardIds={selectedCardIds}
              onCellClick={(pick) => {
                setMode("simple");
                const returnDate = (() => {
                  const d = new Date(`${pick.date}T00:00:00Z`);
                  d.setUTCDate(d.getUTCDate() + 7);
                  return d.toISOString().slice(0, 10);
                })();
                runSearch({
                  origin: pick.origin,
                  destination: pick.destination,
                  departDate: pick.date,
                  returnDate,
                  tripType: lastValues?.tripType ?? "round-trip",
                  cabin: pick.cabin,
                  saverOnly: true,
                  cheapestFirst: lastValues?.cheapestFirst ?? false,
                });
              }}
            />
          </div>
        )}

        <div className="mx-auto max-w-[1200px] px-4 pb-10 md:px-8 md:pb-14">
          <button
            type="button"
            onClick={() =>
              setMode((m) => (m === "simple" ? "power" : "simple"))
            }
            className="text-[13px] text-ink-faint hover:text-ink transition-colors underline-offset-4 hover:underline"
          >
            {mode === "simple"
              ? "Need multi-airport or flexible dates? Try power search →"
              : "Back to simple search →"}
          </button>
          <span className="mx-2 text-ink-faint">·</span>
          <Link
            href="/explore"
            className="text-[13px] text-ink-faint hover:text-ink transition-colors underline-offset-4 hover:underline"
          >
            Or explore destinations by region →
          </Link>
        </div>
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
        ) : null}
      </div>

      <StrategyMoves
        selectedCardIds={selectedCardIds}
        balanceByCurrency={balanceByCurrency}
        onRunSearch={handleUnicornPick}
        onPickCard={handleStrategyCardPick}
      />

      <section className="border-b hairline bg-surface">
        <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-14">
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            <Link
              href="/deals"
              className="group block border hairline-strong bg-paper p-5 md:p-6 transition-all hover:border-accent"
              style={{ borderRadius: "14px" }}
            >
              <div className="eyebrow mb-2 uppercase tracking-wider">
                This week&apos;s deals
              </div>
              <div className="display text-[20px] md:text-[22px] text-ink group-hover:text-accent transition-colors">
                4 editorial briefs →
              </div>
            </Link>
            <Link
              href="/strategy"
              className="group block border hairline-strong bg-paper p-5 md:p-6 transition-all hover:border-accent"
              style={{ borderRadius: "14px" }}
            >
              <div className="eyebrow mb-2 uppercase tracking-wider">
                Strategy
              </div>
              <div className="display text-[20px] md:text-[22px] text-ink group-hover:text-accent transition-colors">
                Your next moves →
              </div>
            </Link>
            <Link
              href="/earn"
              className="group block border hairline-strong bg-paper p-5 md:p-6 transition-all hover:border-accent"
              style={{ borderRadius: "14px" }}
            >
              <div className="eyebrow mb-2 uppercase tracking-wider">
                Earn faster
              </div>
              <div className="display text-[20px] md:text-[22px] text-ink group-hover:text-accent transition-colors">
                Offers + next-purchase →
              </div>
            </Link>
          </div>
        </div>
      </section>

      <FooterRail />
    </main>
  );
}
