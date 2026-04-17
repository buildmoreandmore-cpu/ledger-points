export default function Masthead() {
  return (
    <header className="border-b hairline">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            className="text-accent"
          >
            <path
              d="M10 1 L18.66 6 V14 L10 19 L1.34 14 V6 Z"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M10 5 L10 15 M5.5 7.5 L14.5 12.5 M14.5 7.5 L5.5 12.5"
              stroke="currentColor"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-display text-lg tracking-tight text-ink">
            Ledger<span className="text-ink-faint">/</span>
            <span className="italic text-accent">Points</span>
          </span>
        </div>
        <nav className="hidden items-center gap-10 md:flex">
          <a
            href="#engine-room"
            className="mono-label hover:text-ink transition-colors"
          >
            The Engine
          </a>
          <a
            href="#search"
            className="mono-label hover:text-ink transition-colors"
          >
            Run a Search
          </a>
          <a
            href="#waitlist"
            className="mono-label hover:text-ink transition-colors"
          >
            Join the List
          </a>
        </nav>
        <a
          href="#search"
          className="mono-label border hairline-strong px-4 py-2 text-ink hover:bg-ink hover:text-cream transition-colors"
        >
          Start
        </a>
      </div>
    </header>
  );
}
