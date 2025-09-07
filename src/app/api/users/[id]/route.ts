import { NextResponse } from "next/server";
import { getTokenFromCookie } from "@/lib/auth";
import { DIGITALMONEY_API_BASE } from "@/lib/env";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getTokenFromCookie();
    if (process.env.LOG_API === 'true' || process.env.NODE_ENV !== 'test') {
      console.log(token);
    }

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const resolvedParams = await params;
    const userId = resolvedParams.id;

    const response = await fetch(`${DIGITALMONEY_API_BASE}/api/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error al obtener datos del usuario" },
        { status: response.status }
      );
    }

    const userData = await response.json();
    return NextResponse.json(userData, { status: 200 });
  } catch (error: unknown) {
    if (process.env.LOG_API === 'true' || process.env.NODE_ENV !== 'test') {
      console.error("Error en /api/users/[id]:", error);
    }
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = await getTokenFromCookie();

    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const resolvedParams = await params;
    const userId = resolvedParams.id;

    if (!userId) {
      return NextResponse.json({ error: "id missing" }, { status: 400 });
    }

    const body = await req.json();

    const upstream = await fetch(`${DIGITALMONEY_API_BASE}/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const contentType = upstream.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await upstream.json() : await upstream.text();

    return NextResponse.json(payload, { status: upstream.status });
  } catch (error: unknown) {
    if (process.env.LOG_API === 'true' || process.env.NODE_ENV !== 'test') {
      console.error("Error en /api/users/[id] PATCH:", error);
    }
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
