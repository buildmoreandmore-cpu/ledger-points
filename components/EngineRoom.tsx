type SourceType = "API" | "Scraped" | "Editorial";

type Source = {
  n: string;
  name: string;
  type: SourceType;
  detail: string;
  note: string;
};

const SOURCES: Source[] = [
  {
    n: "01",
    name: "Seats.aero",
    type: "API",
    detail: "Partner saver inventory · refreshed every 90 seconds",
    note: "The spine of award availability for transferable currencies.",
  },
  {
    n: "02",
    name: "AwardFares",
    type: "API",
    detail: "Real-time program pricing · all major charts",
    note: "Used when Seats.aero lacks a carrier; fills pricing gaps.",
  },
  {
    n: "03",
    name: "ExpertFlyer",
    type: "API",
    detail: "Fare class counts · upgrade and hold logic",
    note: "Mandatory for first-class nuance and fare-class filtering.",
  },
  {
    n: "04",
    name: "AwardWallet",
    type: "API",
    detail: "User-synced balances and expirations (opt-in)",
    note: "Hooks in once a member links accounts. Strictly opt-in.",
  },
  {
    n: "05",
    name: "Carrier award charts",
    type: "Scraped",
    detail: "Published region pricing · updated nightly",
    note: "Backs the sweet-spot catalog when partners change rates.",
  },
  {
    n: "06",
    name: "Frequent-flyer forums",
    type: "Scraped",
    detail: "FlyerTalk · Reddit · carrier-specific boards",
    note: "Weighted mentions surface quiet devaluations within hours.",
  },
  {
    n: "07",
    name: "Our editorial desk",
    type: "Editorial",
    detail: "Point valuations · sweet-spot notes · rewrites",
    note: "A human signs off on every route before it ships.",
  },
];

const TYPE_STYLES: Record<SourceType, { dot: string; label: string }> = {
  API: { dot: "bg-gold", label: "text-gold" },
  Scraped: { dot: "bg-accent", label: "text-accent" },
  Editorial: { dot: "bg-ink-faint", label: "text-ink-faint" },
};

export default function EngineRoom() {
  return (
    <section id="engine-room" className="border-b hairline">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="mono-label mb-6 text-accent">
              04 · The Engine Room
            </div>
            <h2 className="display text-[44px] leading-[1.04] md:text-[56px]">
              Seven sources, <em>hand-weighted.</em>
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <p className="font-display text-[18px] leading-[1.55] text-ink-soft">
              There is no single feed for award availability. We braid seven
              together: four paid APIs, two scraped indices, and one editorial
              desk that still opens a browser and books the redemption to make
              sure it&apos;s real. The gold dot is where the money goes.
            </p>
            <div className="mt-6 flex flex-wrap gap-6">
              <Legend dot="bg-gold" label="API · paid feed" />
              <Legend dot="bg-accent" label="Scraped · maintained" />
              <Legend dot="bg-ink-faint" label="Editorial · signed" />
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {SOURCES.map((s, i) => {
            const style = TYPE_STYLES[s.type];
            const isLastInRow = (i + 1) % 4 === 0;
            return (
              <article
                key={s.n}
                className={[
                  "flex flex-col gap-4 border-t hairline px-6 py-8",
                  "md:border-r",
                  isLastInRow ? "md:border-r-0" : "",
                  i === SOURCES.length - 1 ? "border-b hairline md:border-b" : "",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <span className="mono-label">{s.n}</span>
                  <span className="mono-label inline-flex items-center gap-2">
                    <span
                      className={[
                        "inline-block h-[6px] w-[6px] rounded-full",
                        style.dot,
                      ].join(" ")}
                    />
                    <span className={style.label}>{s.type}</span>
                  </span>
                </div>
                <h3 className="font-display text-[24px] leading-[1.15] text-ink">
                  {s.name}
                </h3>
                <p className="font-display text-[14px] leading-[1.45] text-ink-soft">
                  {s.detail}
                </p>
                <p className="mono-label text-ink-faint">{s.note}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={["h-[8px] w-[8px] rounded-full", dot].join(" ")} />
      <span className="mono-label">{label}</span>
    </div>
  );
}
