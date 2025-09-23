import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DIGITALMONEY_API_BASE } from "@/lib/env";
import jwt from "jsonwebtoken";

type LoginResponse = {
  token?: string;
  accessToken?: string;
  [key: string]: unknown;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
    }

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
      if (typeof payload === "string") {
        return new NextResponse(payload, {
          status: upstream.status,
          headers: { "content-type": contentType || "text/plain" },
        });
      }
      return NextResponse.json(payload, { status: upstream.status });
    }

    const data = payload as LoginResponse;
    const token = data.token || data.accessToken;

    if (token) {
      // Calcular expiración desde el JWT
      let maxAge = 60 * 60 * 24; // default 1 día
      try {
        const decoded = jwt.decode(token) as { exp?: number };
        if (decoded?.exp) {
          const now = Math.floor(Date.now() / 1000);
          maxAge = decoded.exp - now;
          if (maxAge <= 0) maxAge = 60 * 60 * 24;
        }
      } catch (error) {
        console.error("Error decoding token for maxAge:", error);
      }

      // Crear la respuesta y setear la cookie
      const res = NextResponse.json(data, { status: upstream.status });
      res.cookies.set("dm_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge,
      });
      return res;
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
