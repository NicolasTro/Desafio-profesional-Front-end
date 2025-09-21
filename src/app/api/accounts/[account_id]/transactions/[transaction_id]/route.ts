import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookie } from "@/lib/auth";
import { DIGITALMONEY_API_BASE } from "@/lib/env";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ account_id: string; transaction_id: string }> },
) {
  try {
    const token = await getTokenFromCookie();
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.log("GET /api/accounts/[account_id]/transactions/[transaction_id] - token present:", !!token);
    }

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { account_id: accountId, transaction_id: transactionId } = await params;
    if (!accountId || !transactionId) {
      return NextResponse.json({ error: "missing params" }, { status: 400 });
    }

    const upstreamUrl = `${DIGITALMONEY_API_BASE}/api/accounts/${accountId}/transactions/${transactionId}`;

    const response = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "<no body>");
      if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
        console.log("Upstream GET /transactions/{id} error:", response.status, text);
      }
      return NextResponse.json({ error: text }, { status: response.status });
    }

    const payload = await response.json();
    return NextResponse.json(payload, { status: 200 });
  } catch (error: unknown) {
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.error("Error en /api/accounts/[account_id]/transactions/[transaction_id]:", error);
    }
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
