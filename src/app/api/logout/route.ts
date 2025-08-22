import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DIGITALMONEY_API_BASE } from "@/lib/env";
import { getTokenFromCookie } from "@/lib/auth";

export async function POST() {
  const jar = await cookies();
  let upstreamStatus: number | null = null;
  try {
    const token = await getTokenFromCookie();
    if (token) {
      const upstream = await fetch(`${DIGITALMONEY_API_BASE}/api/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });
      upstreamStatus = upstream.status;
      // If upstream returns HTML (e.g., 404 page), avoid bubbling it up
      if (!upstream.ok) {
        const ct = upstream.headers.get("content-type") || "";
        if (ct.includes("text/html")) {
          return NextResponse.json(
            { ok: false, error: `Upstream ${upstream.status} ${upstream.statusText}` },
            { status: upstream.status }
          );
        }
      }
    }
    return NextResponse.json({ ok: true, upstreamStatus });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Logout failed";
    return NextResponse.json({ ok: false, error: message, upstreamStatus }, { status: 502 });
  } finally {
    // Always clear local session cookie
    jar.set("dm_token", "", { httpOnly: true, maxAge: 0, path: "/" });
  }
}
