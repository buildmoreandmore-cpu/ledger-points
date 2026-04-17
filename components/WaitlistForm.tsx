"use client";

import { useState } from "react";

type State = "idle" | "submitting" | "success" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("submitting");
    setMessage(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "landing" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState("error");
        setMessage(data.error ?? "Something went wrong.");
      } else {
        setState("success");
        setMessage(
          data.persisted
            ? "You're on the list — we'll write when the beta opens."
            : "Logged. We'll wire the database next; your email is noted."
        );
        setEmail("");
      }
    } catch {
      setState("error");
      setMessage("Could not reach our waitlist right now. Try again.");
    }
  }

  return (
    <section id="waitlist" className="border-b hairline bg-cream-deep/40">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-28">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="mono-label mb-6 text-accent">05 · The Invitation</div>
            <h2 className="display text-[44px] leading-[1.04] md:text-[64px]">
              Join the <em>first hundred</em> seats.
            </h2>
            <p className="mt-6 font-display text-[18px] leading-[1.55] text-ink-soft">
              We&apos;re opening the private beta to a hundred readers who
              already know the difference between Avios and LifeMiles. Leave
              your email and we&apos;ll send one note when the gate lifts — no
              drip campaign, no daily digest.
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <form
              onSubmit={handleSubmit}
              className="border hairline-strong bg-paper"
            >
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto]">
                <div className="px-5 pt-5 pb-3 border-b md:border-b-0 md:border-r hairline">
                  <label
                    htmlFor="waitlist-email"
                    className="block mono-label mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent pb-2 font-display text-[20px] tracking-tight text-ink outline-none placeholder:text-ink-faint"
                  />
                </div>
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className={[
                    "mono-label px-8 py-6 transition-colors",
                    state === "submitting"
                      ? "bg-ink-faint text-cream"
                      : "bg-ink text-cream hover:bg-accent-deep",
                  ].join(" ")}
                >
                  {state === "submitting" ? "Sending" : "Send Me the Invite"}
                  <span className="inline-block pl-2 italic">→</span>
                </button>
              </div>
            </form>

            {message ? (
              <p
                className={[
                  "mt-4 font-display text-[15px]",
                  state === "error" ? "text-accent-deep" : "text-ink-soft",
                ].join(" ")}
                role="status"
              >
                {message}
              </p>
            ) : (
              <p className="mt-4 mono-label">
                We only write when something ships. One email, maybe two.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
