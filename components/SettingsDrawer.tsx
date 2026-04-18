"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_SETTINGS,
  VALUATION_LABELS,
  type AlertType,
  type ValuationKey,
} from "@/lib/settings";
import { useSettings } from "@/lib/settings-context";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ALERT_OPTIONS: Array<{ value: AlertType; label: string }> = [
  { value: "saver", label: "Saver space on my watched flights" },
  { value: "bonuses", label: "New transfer bonuses for my cards" },
  { value: "expiring", label: "Points expiring in 30 days" },
  { value: "deals", label: "Weekly deal briefs" },
];

const VALUATION_ORDER: ValuationKey[] = [
  "MR",
  "UR",
  "C1",
  "TY",
  "BILT",
  "AS",
  "VS",
  "FB",
];

export default function SettingsDrawer({ open, onClose }: Props) {
  const { settings, setSettings, reset } = useSettings();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const { style } = document.body;
    const prev = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = prev;
    };
  }, [open]);

  function updateValuation(key: ValuationKey, value: number) {
    setSettings((prev) => ({
      ...prev,
      valuations: { ...prev.valuations, [key]: value },
    }));
  }

  function toggleAlert(t: AlertType) {
    setSettings((prev) => ({
      ...prev,
      alertTypes: prev.alertTypes.includes(t)
        ? prev.alertTypes.filter((x) => x !== t)
        : [...prev.alertTypes, t],
    }));
  }

  function handleSave() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  const s = settings;

  const slashStatus =
    s.slashTwentyFour <= 4
      ? {
          tone: "muted" as const,
          text: "Under 5/24. All Chase products remain available.",
        }
      : s.slashTwentyFour <= 6
      ? {
          tone: "warn" as const,
          text: "At 5/24 threshold. Chase applications will likely be denied.",
        }
      : {
          tone: "bad" as const,
          text: "Well over 5/24. Prioritize non-Chase issuers for the next few months.",
        };

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden={!open}
        className={[
          "fixed inset-0 z-40 transition-opacity bg-ink/40",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />
      <aside
        role="dialog"
        aria-label="Settings"
        aria-modal="true"
        className={[
          "fixed right-0 top-0 bottom-0 z-50 w-full md:w-[420px] bg-paper border-l hairline-strong overflow-y-auto transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="sticky top-0 bg-paper border-b hairline-strong px-5 py-4 flex items-center justify-between">
          <div>
            <div className="mono-label text-accent">Settings</div>
            <div className="display text-[18px] text-ink">
              Tune the math to your wallet
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="mono-label px-3 py-2 text-ink hover:bg-surface"
            style={{ borderRadius: "8px" }}
          >
            ✕
          </button>
        </div>

        <section className="px-5 py-5 border-b hairline">
          <h3 className="mono-label text-accent mb-3">
            A · Point valuations
          </h3>
          <div className="flex flex-col gap-2.5">
            {VALUATION_ORDER.map((key) => (
              <div
                key={key}
                className="flex items-center justify-between gap-3"
              >
                <label className="text-[14px] text-ink flex-1">
                  {VALUATION_LABELS[key]}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.05"
                    min={0}
                    max={10}
                    value={s.valuations[key]}
                    onChange={(e) =>
                      updateValuation(key, Number(e.target.value))
                    }
                    aria-label={VALUATION_LABELS[key]}
                    className="w-[72px] bg-surface border hairline-strong px-2 py-1 text-right text-[14px] text-ink outline-none focus:border-accent"
                    style={{
                      fontFamily:
                        "var(--font-jetbrains), ui-monospace, monospace",
                      borderRadius: "6px",
                    }}
                  />
                  <span className="mono-label text-ink-faint w-[32px]">
                    ¢/pt
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-[1.45] text-ink-faint italic">
            Defaults are TPG&apos;s published May 2026 valuations. Override any
            value to match how you actually redeem.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-3 mono-label bg-white border hairline-strong px-3 py-1.5 text-ink hover:bg-surface transition-colors"
            style={{ borderRadius: "8px" }}
          >
            Reset to TPG defaults
          </button>
        </section>

        <section className="px-5 py-5 border-b hairline">
          <h3 className="mono-label text-accent mb-3">B · 5/24 status</h3>
          <label className="block text-[14px] text-ink mb-2">
            New credit cards opened in the last 24 months
            <span className="block text-[12px] text-ink-faint">
              (excluding business cards that don&apos;t report to personal credit)
            </span>
          </label>
          <select
            value={s.slashTwentyFour}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                slashTwentyFour: Number(e.target.value),
              }))
            }
            className="w-full bg-surface border hairline-strong px-3 py-2 text-[15px] text-ink outline-none focus:border-accent"
            style={{ borderRadius: "8px" }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n === 10 ? "10+" : n}
              </option>
            ))}
          </select>
          <div
            className={[
              "mt-3 text-[13px] leading-[1.45] inline-block px-2.5 py-1",
              slashStatus.tone === "muted"
                ? "text-ink-faint"
                : slashStatus.tone === "warn"
                ? "bg-gold-soft text-gold"
                : "bg-[#fee2e2] text-[#dc2626]",
            ].join(" ")}
            style={{ borderRadius: "8px" }}
          >
            {slashStatus.text}
          </div>
          <details className="mt-3">
            <summary className="mono-label text-accent cursor-pointer hover:underline">
              What is 5/24?
            </summary>
            <p className="mt-2 text-[12px] leading-[1.5] text-ink-soft">
              Chase will deny most personal card applications if you have five
              or more new credit cards opened across any issuer in the last 24
              months. Business cards from Chase, Amex, and Capital One usually
              don&apos;t report to personal credit and therefore don&apos;t
              count.
            </p>
          </details>
        </section>

        <section className="px-5 py-5">
          <h3 className="mono-label text-accent mb-3">
            C · Alert preferences
          </h3>
          <label className="block text-[14px] text-ink mb-1.5">Email</label>
          <input
            type="email"
            placeholder="you@domain.com"
            value={s.email}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full bg-surface border hairline-strong px-3 py-2 text-[15px] text-ink outline-none focus:border-accent"
            style={{ borderRadius: "8px" }}
          />

          <div className="mt-4 mono-label text-ink mb-2">Alert me about</div>
          <div className="flex flex-wrap gap-2">
            {ALERT_OPTIONS.map((a) => {
              const on = s.alertTypes.includes(a.value);
              return (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => toggleAlert(a.value)}
                  aria-pressed={on}
                  className={[
                    "text-[13px] px-3 py-1.5 border transition-colors",
                    on
                      ? "bg-accent text-white border-accent"
                      : "bg-white text-ink border-rule-strong hover:border-accent",
                  ].join(" ")}
                  style={{ borderRadius: "999px" }}
                >
                  {a.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleSave}
            className={[
              "mt-5 mono-label w-full px-4 py-2.5 transition-colors font-medium",
              saved
                ? "bg-[#16a34a] text-white"
                : "bg-[#0a0a0a] text-white hover:opacity-85",
            ].join(" ")}
            style={{ borderRadius: "10px" }}
          >
            {saved ? "✓ Saved" : "Save preferences"}
          </button>

          <p className="mt-3 text-[12px] text-ink-faint italic">
            Values save automatically as you change them. This button confirms
            the current snapshot.
          </p>
        </section>
      </aside>
    </>
  );
}
