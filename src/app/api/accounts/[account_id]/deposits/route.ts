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
      console.log(
        "POST /api/accounts/[account_id]/deposits - token present:",
        !!token,
      );
    }

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { account_id: accountId } = await params;
    if (!accountId) {
      return NextResponse.json(
        { error: "account_id missing" },
        { status: 400 },
      );
    }

    const body = await req.json();
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.log("POST /api/accounts/[account_id]/deposits - body:", body);
    }

    const upstream = await fetch(
      `${DIGITALMONEY_API_BASE}/api/accounts/${accountId}/deposits`,
      {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "<no body>");
      if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
        console.log("Upstream POST /deposits error:", upstream.status, text);
      }
      // Forward upstream body (as text) and status to client
      return NextResponse.json({ error: text }, { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await upstream.json()
      : await upstream.text();

    // Typically a creation returns 201 but forward actual status from upstream
    return NextResponse.json(payload, { status: upstream.status || 201 });
  } catch (error: unknown) {
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.error("Error in /api/accounts/[account_id]/deposits POST", error);
    }
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
