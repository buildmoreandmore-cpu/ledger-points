import type { BookingOption } from "@/lib/engine/search";
import { formatSeatsLeft } from "@/lib/engine/availability";

type Props = {
  option: BookingOption;
  origin: string;
  destination: string;
  duration: string;
  delayClass: string;
};

const DOT = (
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    aria-hidden="true"
    className="mt-[6px] text-accent"
  >
    <circle cx="4" cy="4" r="3" fill="currentColor" />
  </svg>
);

function AvailabilityBadge({
  option,
}: {
  option: BookingOption;
}): React.ReactNode {
  if (!option.availability) return null;
  const { status } = option.availability;
  const label = formatSeatsLeft(option.availability);
  if (status === "open")
    return (
      <span className="mono-label inline-block border border-accent bg-accent px-2 py-[3px] text-cream">
        {label}
      </span>
    );
  if (status === "waitlist")
    return (
      <span className="mono-label inline-block border border-gold bg-gold/10 px-2 py-[3px] text-gold">
        {label}
      </span>
    );
  return (
    <span className="mono-label inline-block border hairline-strong px-2 py-[3px] text-ink-faint">
      {label}
    </span>
  );
}

function FlightStrip({
  origin,
  destination,
  duration,
}: {
  origin: string;
  destination: string;
  duration: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b hairline pb-6">
      <span className="font-display text-[28px] text-ink">{origin}</span>
      <div className="flex-1 flex flex-col items-center gap-1">
        <svg
          viewBox="0 0 120 14"
          className="w-full text-ink-faint"
          aria-hidden="true"
        >
          <line
            x1="6"
            y1="7"
            x2="114"
            y2="7"
            stroke="currentColor"
            strokeWidth="1"
            className="march-dash"
          />
          <g transform="translate(54 0)" className="text-accent">
            <path
              d="M14.75 7 L6 3 V5 L0.75 7 L6 9 V11 L14.75 7 Z"
              fill="currentColor"
            />
          </g>
        </svg>
        <span className="mono-label">{duration}</span>
      </div>
      <span className="font-display text-[28px] text-ink">{destination}</span>
    </div>
  );
}

export default function OptionCard({
  option,
  origin,
  destination,
  duration,
  delayClass,
}: Props) {
  const isMuted =
    option.availability?.status === "none" && !option.programKey === false;
  return (
    <article
      className={[
        "fade-up",
        delayClass,
        "flex flex-col gap-6 px-6 py-8 md:min-h-[640px]",
        isMuted ? "opacity-75" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <span
          className={[
            "mono-label",
            option.isBest ? "text-accent" : "text-ink-faint",
          ].join(" ")}
        >
          {option.rank}
        </span>
        {option.isBest ? (
          <span className="mono-label text-accent">Our Pick</span>
        ) : null}
      </div>

      <FlightStrip
        origin={origin}
        destination={destination}
        duration={duration}
      />

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="mono-label text-accent">{option.cabinLabel}</span>
          <AvailabilityBadge option={option} />
        </div>
        <h3 className="font-display text-[24px] leading-[1.15] text-ink">
          {option.airline}
        </h3>
        <span className="mono-label">{option.tag}</span>
      </div>

      <div>
        <div className="font-display text-[72px] leading-[0.98] tracking-tight text-ink md:text-[84px]">
          {option.headlineNum}
        </div>
        <div className="mono-label mt-2">{option.headlineUnit}</div>
      </div>

      <p className="font-display text-[15px] leading-[1.55] text-ink-soft">
        {option.detail}
      </p>

      <ul className="flex flex-col gap-3 border-t hairline pt-5">
        {option.breakdown.map((row, i) => (
          <li key={i} className="flex items-start gap-3">
            {DOT}
            <span className="flex-1 font-display text-[14px] leading-[1.4] text-ink-soft">
              {row.desc}
            </span>
            <span className="mono-label text-ink">{row.val}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-auto mono-label border hairline-strong px-5 py-3 text-ink transition-colors hover:bg-ink hover:text-cream"
      >
        Book this option
        <span className="inline-block pl-2 italic">↗</span>
      </button>
    </article>
  );
}
