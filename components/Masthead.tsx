"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SettingsDrawer from "./SettingsDrawer";

type Props = {
  variant?: "marketing" | "app";
};

const NAV = [
  { href: "/app", label: "Try it" },
  { href: "/deals", label: "Deals" },
  { href: "/strategy", label: "Strategy" },
  { href: "/explore", label: "Explore" },
  { href: "/earn", label: "Earn" },
];

export default function Masthead({ variant }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isMarketing = variant === "marketing" || pathname === "/";
  const primary = isMarketing
    ? { label: "Get early access", href: "#waitlist" }
    : { label: "New search", href: "#search" };

  return (
    <>
      <header className="border-b hairline bg-paper/95 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 md:px-8 md:py-5">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="RedeemMax home"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
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
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {NAV.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={[
                      "text-[14px] font-medium transition-colors",
                      active
                        ? "text-ink"
                        : "text-ink-faint hover:text-ink",
                    ].join(" ")}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center w-10 h-10 text-ink-faint hover:text-ink hover:bg-surface transition-colors"
              style={{ borderRadius: "10px" }}
              aria-label="Open settings"
            >
              <GearIcon />
            </button>
            <Link
              href={primary.href}
              className="bg-[#0a0a0a] text-white px-4 py-2.5 hover:opacity-85 transition-opacity font-semibold text-[13px]"
              style={{ borderRadius: "10px" }}
            >
              {primary.label}
            </Link>
          </div>
        </div>
      </header>
      <SettingsDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function GearIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
