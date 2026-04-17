import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: string; source?: string };
  try {
    body = (await request.json()) as { email?: string; source?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabase) {
    console.warn("[waitlist] Supabase env not configured — logging only.", {
      email,
      source: body.source,
    });
    return NextResponse.json({ ok: true, persisted: false });
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase
    .from("waitlist")
    .insert({ email, source: body.source ?? "landing" });

  if (error && !error.message.toLowerCase().includes("duplicate")) {
    console.error("[waitlist] Supabase insert failed", error);
    return NextResponse.json(
      { error: "Could not save your email right now." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, persisted: true });
}
