import { NextResponse } from "next/server";
import { getTokenFromCookie } from "@/lib/auth";
import { DIGITALMONEY_API_BASE } from "@/lib/env";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ account_id: string }> },
) {
  try {
    const token = await getTokenFromCookie();
    if (!token)
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const resolved = await params;
    const accountId = resolved.account_id;
    if (!accountId)
      return NextResponse.json(
        { error: "account_id missing" },
        { status: 400 },
      );

    const body = await req.json();

    const upstreamUrl = `${DIGITALMONEY_API_BASE}/api/account/${accountId}`;
    // debug logs to help diagnose 404s
    try {
      console.log("[api/account PATCH] accountId=", accountId);
      console.log(
        "[api/account PATCH] token present=",
        !!token,
        "token_len=",
        token?.length ?? 0,
      );
      console.log("[api/account PATCH] upstreamUrl=", upstreamUrl);
      console.log("[api/account PATCH] body=", body);
    } catch {
      // ignore logging errors
    }

    const upstream = await fetch(upstreamUrl, {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await upstream.json()
      : await upstream.text();

    if (!upstream.ok) {
      try {
        console.error(
          "[api/account PATCH] upstream returned",
          upstream.status,
          "payload=",
          payload,
        );
      } catch {
        // noop
      }
    }

    return NextResponse.json(payload, { status: upstream.status });
  } catch (err) {
    console.error("Error in /api/account/[account_id] PATCH", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
