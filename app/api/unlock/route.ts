import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DEFAULT_PASSWORD = "sweet-spot";
const COOKIE_NAME = "lp_unlocked";
const MAX_AGE_DAYS = 7;

export async function POST(request: Request) {
  let body: { password?: string } = {};
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const expected = process.env.SITE_PASSWORD || DEFAULT_PASSWORD;
  const candidate = (body.password ?? "").trim();

  if (candidate !== expected) {
    return NextResponse.json(
      { error: "Wrong password. Try again." },
      { status: 401 }
    );
  }

  const store = await cookies();
  store.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * MAX_AGE_DAYS,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  return NextResponse.json({ ok: true });
}
