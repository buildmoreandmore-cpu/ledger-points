import type { Metadata } from "next";
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "opsz"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ledger/Points — finally, a points engine that names the sweet spot",
  description:
    "Tell us the cards in your wallet. Tell us the flight. We'll show you the cash fare, the best transfer partner, and the award redemption Google Flights will never surface.",
  metadataBase: new URL("https://ledger-points.vercel.app"),
  openGraph: {
    title: "Ledger/Points",
    description:
      "A points-to-travel engine for people who already know what Ultimate Rewards are for.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body className="relative bg-paper text-ink">
        <div className="noise-overlay" aria-hidden="true" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
