"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function UnlockPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-4 py-12 bg-paper">
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
    <div className="w-full max-w-[440px]">
      <div className="mb-8 flex items-center gap-2.5">
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
        <span className="display text-[18px] text-ink">
          Ledger<span className="text-ink-faint">/</span>
          <span className="text-accent">Points</span>
        </span>
      </div>

      <div className="mono-label mb-4 text-accent">Private preview</div>
      <h1 className="display text-[32px] leading-[1.05] md:text-[40px]">
        A <em>quiet</em> door — by invitation.
      </h1>
      <p className="mt-3 text-[15px] leading-[1.55] text-ink-soft md:text-[16px]">
        The demo is on a private rail while we tighten the editorial desk. If
        you were sent a password, drop it in below.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 bg-paper card-shadow border hairline-strong overflow-hidden"
        style={{ borderRadius: "14px" }}
      >
        <div className="flex flex-col md:flex-row md:items-stretch">
          <div className="flex-1 px-4 pt-4 pb-3 border-b md:border-b-0 md:border-r hairline">
            <label htmlFor="pw" className="block mono-label mb-1.5">
              Password
            </label>
            <input
              id="pw"
              type="password"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent font-medium text-[18px] text-ink outline-none placeholder:text-ink-faint"
              placeholder="enter to continue"
              style={{ borderRadius: 0 }}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={[
              "mono-label px-6 py-4 transition-colors font-medium",
              submitting
                ? "bg-ink-faint text-white"
                : "bg-[#0a0a0a] text-white hover:bg-[#0a0a0a]/85",
            ].join(" ")}
            style={{ borderRadius: 0 }}
          >
            {submitting ? "Opening" : "Unlock →"}
          </button>
        </div>
      </form>

      {error ? (
        <p className="mt-3 text-[14px] text-accent-deep" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-3 mono-label">
          Session lasts seven days. One password, one door.
        </p>
      )}
    </div>
  );
}
