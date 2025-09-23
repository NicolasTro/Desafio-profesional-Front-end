import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookie } from "@/lib/auth";
import { DIGITALMONEY_API_BASE } from "@/lib/env";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ account_id: string }> },
) {
  try {
    const token = await getTokenFromCookie();

    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.log(
        "GET /api/accounts/[account_id]/cards - token present:",
        !!token,
      );
    }
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { account_id: accountId } = await params;
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.log(
        "GET /api/accounts/[account_id]/cards - accountId:",
        accountId,
      );
    }

    const response = await fetch(
      `${DIGITALMONEY_API_BASE}/api/accounts/${accountId}/cards`,
      {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const text = await response.text().catch(() => "<no body>");
      if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
        console.log(
          "Upstream GET /api/account/{id}/cards error:",
          response.status,
          text,
        );
      }
      return NextResponse.json({ error: text }, { status: response.status });
    }

    const cardsData = await response.json();
    return NextResponse.json(cardsData, { status: 200 });
  } catch (error: unknown) {
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.error("Error en /api/accounts/[account_id]/cards:", error);
    }
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ account_id: string }> },
) {
  try {
    const token = await getTokenFromCookie();
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.log("Token from cookie:", !!token); 
    }

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { account_id: accountId } = await params;
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.log("Account ID:", accountId);
    }

    const body = await req.json();
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.log("Request body:", body);
    }

    const response = await fetch(
      `${DIGITALMONEY_API_BASE}/api/accounts/${accountId}/cards`,
      {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.log("Upstream response status:", response.status);
    }

    if (!response.ok) {
      const errorText = await response.text();
      if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
        console.log("Upstream error:", errorText);
      }
      return NextResponse.json(
        { error: "Error al crear la tarjeta" },
        { status: response.status },
      );
    }

    const cardData = await response.json();
    return NextResponse.json(cardData, { status: 201 });
  } catch (error: unknown) {
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.error("Error en /api/accounts/[account_id]/cards:", error);
    }
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
