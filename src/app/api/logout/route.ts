import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DIGITALMONEY_API_BASE } from "@/lib/env";
import { getTokenFromCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function POST() {
  const jar = await cookies();
  try {
    const token = await getTokenFromCookie();
    if (!token) {
      return NextResponse.json(
        { ok: false },
        { status: 500 }
      );
    }

    const upstream = await fetch(`${DIGITALMONEY_API_BASE}/api/logout`, {
      method: "POST",
      headers: {
        Authorization: token,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { ok: false },
        { status: 500 }
      );
    }

    // Redirect to landing page after successful logout
    redirect("/");

    return NextResponse.json({ ok: true }, { status: 202 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Logout failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  } finally {
    // Always clear local session cookie
    jar.set("dm_token", "", { httpOnly: true, maxAge: 0, path: "/" });
  }
}
