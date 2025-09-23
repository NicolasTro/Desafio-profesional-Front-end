import { NextResponse } from "next/server";
import { DIGITALMONEY_API_BASE } from "@/lib/env";
import { getTokenFromCookie } from "@/lib/auth";

export async function POST() {
  try {
    const token = await getTokenFromCookie();
    if (!token) {
      return NextResponse.json(
        { ok: false, error: "No token" },
        { status: 401 },
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
      const text = await upstream.text().catch(() => "");
      return NextResponse.json(
        { ok: false, details: text || "upstream logout failed" },
        { status: upstream.status || 502 },
      );
    }

    // Respuesta OK + borrado de cookie
    const res = NextResponse.json({ ok: true }, { status: 202 });
    res.cookies.set("dm_token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // expirada
    });
    return res;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Logout failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
