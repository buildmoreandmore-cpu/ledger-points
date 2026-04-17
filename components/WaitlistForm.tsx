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
    <section id="waitlist" className="border-b hairline bg-surface">
      <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-8 md:py-20">
        <div className="grid gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <div className="mono-label mb-3 text-accent">07 · The invitation</div>
            <h2 className="display text-[30px] leading-[1.05] md:text-[48px]">
              Join the <em>first hundred</em> seats.
            </h2>
            <p className="mt-4 text-[15px] leading-[1.55] text-ink-soft md:text-[17px]">
              We&apos;re opening the private beta to a hundred readers who
              already know the difference between Avios and LifeMiles. Leave
              your email and we&apos;ll send one note when the gate lifts — no
              drip campaign, no daily digest.
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <form
              onSubmit={handleSubmit}
              className="bg-paper card-shadow border hairline-strong overflow-hidden"
              style={{ borderRadius: "16px" }}
            >
              <div className="flex flex-col md:flex-row md:items-stretch">
                <div className="flex-1 px-4 pt-4 pb-3 border-b md:border-b-0 md:border-r hairline">
                  <label
                    htmlFor="waitlist-email"
                    className="block mono-label mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="waitlist-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent font-medium text-[17px] md:text-[18px] text-ink outline-none placeholder:text-ink-faint"
                    style={{ borderRadius: 0 }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className={[
                    "mono-label px-6 py-4 md:py-0 transition-colors font-medium",
                    state === "submitting"
                      ? "bg-ink-faint text-white"
                      : "bg-[#0a0a0a] text-white hover:bg-[#0a0a0a]/85",
                  ].join(" ")}
                  style={{ borderRadius: 0 }}
                >
                  {state === "submitting" ? "Sending" : "Send me the invite →"}
                </button>
              </div>
            </form>

            {message ? (
              <p
                className={[
                  "mt-3 text-[14px] md:text-[15px]",
                  state === "error" ? "text-accent-deep" : "text-ink-soft",
                ].join(" ")}
                role="status"
              >
                {message}
              </p>
            ) : (
              <p className="mt-3 mono-label">
                We only write when something ships. One email, maybe two.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
