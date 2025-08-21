import { apiFetch } from "@/lib/http";
import { getTokenFromCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = await getTokenFromCookie();
    const data = await apiFetch("/api/ping", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Ping failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
