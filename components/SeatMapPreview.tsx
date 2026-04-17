"use client";

import type { Cabin } from "@/lib/data/routes";

type Props = {
  cabin: Cabin;
  seed: string;
};

function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

type SeatState = "free" | "taken" | "yours";

function buildSeats(
  rows: number,
  cols: number,
  seed: string
): SeatState[][] {
  const out: SeatState[][] = [];
  const yoursRow = Math.abs(fnv1a(`${seed}|yourrow`)) % rows;
  const yoursCol = Math.abs(fnv1a(`${seed}|yourcol`)) % cols;
  for (let r = 0; r < rows; r += 1) {
    const row: SeatState[] = [];
    for (let c = 0; c < cols; c += 1) {
      const h = fnv1a(`${seed}|${r}|${c}`);
      const roll = (h & 0xffff) / 0xffff;
      let state: SeatState = roll < 0.55 ? "taken" : "free";
      if (r === yoursRow && c === yoursCol) state = "yours";
      row.push(state);
    }
    out.push(row);
  }
  return out;
}

const COLS_LETTERS = ["A", "B", "C", "D", "E", "F"];

function seatLabel(cabin: Cabin): string {
  if (cabin === "first") return "Predicted seat · 1A · Suite";
  if (cabin === "business") return "Predicted seat · 3A · Window";
  if (cabin === "premium") return "Predicted seat · 14A · Window";
  return "Predicted seat · 21A · Window";
}

export default function SeatMapPreview({ cabin, seed }: Props) {
  const cols = cabin === "first" ? 4 : cabin === "business" ? 6 : 6;
  const rows = cabin === "first" ? 2 : cabin === "business" ? 5 : 4;
  const layout = buildSeats(rows, cols, seed);

  return (
    <div className="pointer-events-none absolute left-0 top-full z-30 mt-2 w-[220px] border hairline-strong bg-paper px-3 py-3 shadow-lg">
      <div className="mono-label mb-2 text-accent">Cabin preview</div>
      <div className="flex flex-col gap-1.5">
        {layout.map((row, r) => (
          <div key={r} className="flex items-center gap-1">
            <span className="w-[14px] mono-label text-ink-faint">{r + 1}</span>
            <div className="flex items-center gap-1">
              {row.map((state, c) => {
                const gap =
                  cabin === "first"
                    ? c === 1
                      ? "ml-2"
                      : ""
                    : c === 2 || c === 4
                    ? "ml-1.5"
                    : "";
                return (
                  <span
                    key={c}
                    title={`${r + 1}${COLS_LETTERS[c]} · ${state}`}
                    className={[
                      gap,
                      "inline-block h-3 w-3 border rounded-[2px]",
                      state === "yours"
                        ? "bg-accent border-accent"
                        : state === "taken"
                        ? "bg-rule border-rule"
                        : "bg-transparent border-accent/60",
                    ].join(" ")}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mono-label mt-3 text-ink-faint">{seatLabel(cabin)}</div>
    </div>
  );
}
