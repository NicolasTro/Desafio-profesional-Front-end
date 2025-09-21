import { NextResponse } from "next/server";
import { getTokenFromCookie } from "@/lib/auth";
import { fetchUserFromToken, UpstreamError } from "@/lib/user";

export const runtime = "nodejs";

export async function GET() {
  try {
    const token = await getTokenFromCookie();
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.log("Token found:", !!token);
    }
    if (!token) {
      if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
        console.log("No token found in cookies");
      }
      return NextResponse.json({ error: "No autorizado - no hay token" }, { status: 401 });
    }

    try {
      const userData = await fetchUserFromToken(token);
      return NextResponse.json(userData, { status: 200 });
    } catch (err: unknown) {
      if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
        console.error("Error fetching user from token:", err);
      }
      if (err instanceof Error && (err as UpstreamError).status) {
        const ue = err as UpstreamError;
        return NextResponse.json(
          { error: "Error al obtener datos del usuario", details: ue.details || err.message },
          { status: ue.status },
        );
      }
      const message = err instanceof Error ? err.message : "Unknown error";
      return NextResponse.json({ error: "Token inválido - " + message }, { status: 400 });
    }
  } catch (error: unknown) {
    if (process.env.LOG_API === "true" || process.env.NODE_ENV !== "test") {
      console.error("Error en /api/me:", error);
    }
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Error interno del servidor", details: errorMessage }, { status: 500 });
  }
}
