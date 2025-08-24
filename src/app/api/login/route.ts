import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DIGITALMONEY_API_BASE } from "@/lib/env";

type LoginResponse = {
  token?: string;
  accessToken?: string;
  [key: string]: unknown;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("DIGITALMONEY_API_BASE:", DIGITALMONEY_API_BASE);
    console.log("Request body:", body);
    // Proxy to external API preserving upstream status/body
    const upstream = await fetch(`${DIGITALMONEY_API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await upstream.json()
      : await upstream.text();

    

    if (!upstream.ok) {
      // Forward real status and payload from upstream (e.g., 400/401/404)
      if (typeof payload === "string") {
        return new NextResponse(payload, {
          status: upstream.status,
          headers: { "content-type": contentType || "text/plain" },
        });
      }
      return NextResponse.json(payload, { status: upstream.status });
    }

    const data = payload as LoginResponse;
    // If upstream returns a token, store it securely
    const token = data.token || data.accessToken;
    
    if (token) {
      const jar = await cookies();
      jar.set("dm_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
      
    }

  // Preserve upstream success status (e.g., 202 Accepted)
  return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
