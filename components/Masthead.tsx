export default function Masthead() {
  return (
    <header className="border-b hairline bg-paper/90 backdrop-blur-md sticky top-0 z-20">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3.5 md:px-8 md:py-4">
        <div className="flex items-center gap-2.5">
          <svg
            width="22"
            height="22"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="text-accent"
          >
            <path
              d="M10 1 L18.66 6 V14 L10 19 L1.34 14 V6 Z"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="var(--accent-soft)"
            />
            <path
              d="M10 5 L10 15 M5.5 7.5 L14.5 12.5 M14.5 7.5 L5.5 12.5"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinecap="round"
            />
          </svg>
          <span className="display text-[17px] md:text-[18px] text-ink">
            Ledger<span className="text-ink-faint">/</span>
            <span className="text-accent">Points</span>
          </span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#search"
            className="mono-label hover:text-ink transition-colors"
          >
            Search
          </a>
          <a
            href="#comparison"
            className="mono-label hover:text-ink transition-colors"
          >
            The Consolidation
          </a>
          <a
            href="#waitlist"
            className="mono-label hover:text-ink transition-colors"
          >
            Waitlist
          </a>
        </nav>
        <a
          href="#search"
          className="mono-label bg-accent text-white px-4 py-2 hover:bg-accent-deep transition-colors"
          style={{ borderRadius: "10px" }}
        >
          Start
        </a>
      </div>
    </header>
  );
}
