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
    console.log("DIGITALMONEY_API_BASE:", DIGITALMONEY_API_BASE);
    console.log("Request body:", body);
    
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
      // Decodificar el token para obtener la expiración real
      let maxAge = 60 * 60 * 24; // Default: 1 día
      try {
        const decoded = jwt.decode(token) as { exp?: number };
        if (decoded?.exp) {
          const now = Math.floor(Date.now() / 1000);
          maxAge = decoded.exp - now;
          if (maxAge <= 0) maxAge = 60 * 60 * 24; // Si ya expiró, usa default
        }
      } catch (error) {
        console.error("Error decoding token for maxAge:", error);
      }

      const jar = await cookies();
      jar.set("dm_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: maxAge,
      });
      
    }

  
  return NextResponse.json(data, { status: upstream.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
