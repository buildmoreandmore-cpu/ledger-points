"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/lib/settings-context";
import type { AlertType } from "@/lib/settings";

type AlertContext = {
  origin: string;
  destination: string;
  departDate: string;
  cabinLabel: string;
  program: string;
};

type Props = {
  open: boolean;
  context: AlertContext | null;
  onClose: () => void;
  onConfirm: (email: string) => void;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
});

const ALERT_OPTIONS: Array<{
  value: AlertType;
  label: string;
}> = [
  { value: "bonuses", label: "New transfer bonuses" },
  { value: "expiring", label: "Points expiring soon" },
  { value: "deals", label: "Weekly deal briefs" },
];

export default function AlertModal({
  open,
  context,
  onClose,
  onConfirm,
}: Props) {
  const { settings, setSettings } = useSettings();
  const [email, setEmail] = useState(settings.email);
  const [localAlertTypes, setLocalAlertTypes] = useState<AlertType[]>(
    settings.alertTypes
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setEmail(settings.email);
      setLocalAlertTypes(settings.alertTypes);
      setError(null);
    }
  }, [open, settings.email, settings.alertTypes]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !context) return null;

  function toggle(t: AlertType) {
    setLocalAlertTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!EMAIL_RE.test(trimmed)) {
      setError("Enter a valid email address.");
      return;
    }
    setSettings((prev) => ({
      ...prev,
      email: trimmed,
      alertTypes: localAlertTypes,
    }));
    console.log("[alert] set", {
      email: trimmed,
      alertTypes: localAlertTypes,
      context,
    });
    onConfirm(trimmed);
  }

  const dateLabel = (() => {
    try {
      return DATE_FMT.format(new Date(`${context.departDate}T00:00:00Z`));
    } catch {
      return context.departDate;
    }
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] bg-paper border hairline-strong card-shadow p-5 md:p-6 flex flex-col gap-4"
        style={{ borderRadius: "16px" }}
        role="dialog"
        aria-label="Alert me when space opens"
      >
        <div>
          <div className="mono-label text-accent">
            Alert me when space opens
          </div>
          <div className="mt-2 text-[16px] text-ink font-semibold">
            {context.origin} → {context.destination} · {dateLabel} ·{" "}
            {context.cabinLabel}
          </div>
          <div className="mono-label text-ink-faint mt-0.5">
            {context.program}
          </div>
        </div>

        <div>
          <label className="block mono-label mb-1.5 text-ink">Email</label>
          <input
            type="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="w-full bg-surface border hairline-strong px-3 py-2 text-[15px] text-ink outline-none focus:border-accent"
            style={{ borderRadius: "8px" }}
          />
          {error ? (
            <p className="mt-1.5 text-[12px] text-[#dc2626]">{error}</p>
          ) : null}
        </div>

        <div>
          <div className="mono-label mb-2 text-ink">Also send me</div>
          <div className="flex flex-col gap-1.5">
            {ALERT_OPTIONS.map((a) => (
              <label
                key={a.value}
                className="flex items-center gap-2 text-[14px] text-ink cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={localAlertTypes.includes(a.value)}
                  onChange={() => toggle(a.value)}
                  className="h-4 w-4 accent-[#5e6ad2]"
                />
                {a.label}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t hairline">
          <button
            type="button"
            onClick={onClose}
            className="mono-label bg-white border hairline-strong px-4 py-2 text-ink hover:bg-surface transition-colors"
            style={{ borderRadius: "8px" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="mono-label bg-[#0a0a0a] text-white px-4 py-2 hover:opacity-85 transition-opacity font-medium"
            style={{ borderRadius: "8px" }}
          >
            Set alert →
          </button>
        </div>

        <p className="text-[11px] text-ink-faint text-center">
          Free · unsubscribe anytime
        </p>
      </form>
    </div>
  );
}
