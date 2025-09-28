import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookie } from "@/lib/auth";
import { DIGITALMONEY_API_BASE } from "@/lib/env";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ account_id: string }> },
) {
  try {
    const token = await getTokenFromCookie();
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.log("POST /api/accounts/[account_id]/transactions - token present:", !!token);
    }

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { account_id: accountId } = await params;
    if (!accountId) {
      return NextResponse.json({ error: "missing params" }, { status: 400 });
    }

    const body = await req.json();
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.log("POST body to /transactions:", body);
    }

    const upstreamUrl = `${DIGITALMONEY_API_BASE}/api/accounts/${accountId}/transactions`;

    const response = await fetch(upstreamUrl, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "<no body>");
      if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
        console.log("Upstream POST /transactions error:", response.status, text);
      }
      return NextResponse.json({ error: text }, { status: response.status });
    }

    const payload = await response.json();
    return NextResponse.json(payload, { status: 201 });
  } catch (error: unknown) {
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.error("Error en /api/accounts/[account_id]/transactions POST:", error);
    }
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
