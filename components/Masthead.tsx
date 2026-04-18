"use client";

import { useState } from "react";
import SettingsDrawer from "./SettingsDrawer";

export default function Masthead() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="border-b hairline bg-paper/90 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3.5 md:px-8 md:py-4">
          <div className="flex items-center gap-2.5">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="text-accent"
            >
              <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="6"
                fill="var(--accent)"
              />
              <path
                d="M7.5 14.5 L10.5 11.5 L13 14 L16.5 9"
                stroke="#ffffff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="display text-[17px] md:text-[18px] text-ink tracking-tight">
              Redeem<span className="text-accent">Max</span>
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a
              href="#search"
              className="mono-label hover:text-ink transition-colors"
            >
              Search
            </a>
            <a
              href="#deals"
              className="mono-label hover:text-ink transition-colors"
            >
              Deals
            </a>
            <a
              href="#comparison"
              className="mono-label hover:text-ink transition-colors"
            >
              The Consolidation
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mono-label border hairline-strong bg-white px-3 py-2 text-ink hover:bg-surface transition-colors"
              style={{ borderRadius: "10px" }}
              aria-label="Open settings"
            >
              Settings
            </button>
            <a
              href="#search"
              className="mono-label bg-[#0a0a0a] text-white px-4 py-2 hover:opacity-85 transition-opacity"
              style={{ borderRadius: "10px" }}
            >
              Start
            </a>
          </div>
        </div>
      </header>
      <SettingsDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
