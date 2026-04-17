"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function UnlockPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-6 py-12">
      <Suspense fallback={null}>
        <UnlockForm />
      </Suspense>
    </main>
  );
}

function UnlockForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push(from);
        router.refresh();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Wrong password.");
    } catch {
      setError("Could not reach the unlock service.");
    }
    setSubmitting(false);
  }

  return (
    <div className="w-full max-w-[460px]">
      <div className="mb-10 flex items-center gap-3">
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

      <div className="mono-label mb-5 text-accent">Private Preview</div>
      <h1 className="display text-[40px] leading-[1.05] md:text-[52px]">
        A <em>quiet</em> door — by invitation.
      </h1>
      <p className="mt-5 font-display text-[17px] leading-[1.55] text-ink-soft">
        The demo is on a private rail while we tighten the editorial desk.
        If you were sent a password, drop it in below.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 border hairline-strong bg-paper"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto]">
          <div className="px-5 pt-5 pb-3 border-b md:border-b-0 md:border-r hairline">
            <label htmlFor="pw" className="block mono-label mb-2">
              Password
            </label>
            <input
              id="pw"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent pb-2 font-display text-[20px] tracking-tight text-ink outline-none placeholder:text-ink-faint"
              placeholder="enter to continue"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={[
              "mono-label px-7 py-5 transition-colors",
              submitting
                ? "bg-ink-faint text-cream"
                : "bg-ink text-cream hover:bg-accent-deep",
            ].join(" ")}
          >
            {submitting ? "Opening" : "Unlock"}
            <span className="inline-block pl-2 italic">→</span>
          </button>
        </div>
      </form>

      {error ? (
        <p className="mt-4 font-display text-[15px] text-accent-deep" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-4 mono-label">
          Session lasts seven days. One password, one door.
        </p>
      )}
    </div>
  );
}
